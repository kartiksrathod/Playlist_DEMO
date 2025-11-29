"""
ASGI wrapper for Node.js Express server
This file provides an ASGI interface for uvicorn while running the Node.js server
"""
import subprocess
import sys
import signal
import os
import asyncio
from typing import Dict, Any

# Global reference to Node.js process
node_process = None

async def app(scope: Dict[str, Any], receive, send):
    """
    Dummy ASGI app that just keeps uvicorn happy
    The actual server is the Node.js process
    """
    if scope['type'] == 'lifespan':
        # Handle ASGI lifespan events
        while True:
            message = await receive()
            if message['type'] == 'lifespan.startup':
                await send({'type': 'lifespan.startup.complete'})
            elif message['type'] == 'lifespan.shutdown':
                await send({'type': 'lifespan.shutdown.complete'})
                return
    else:
        # This shouldn't be called since Node.js handles HTTP
        await send({
            'type': 'http.response.start',
            'status': 200,
            'headers': [[b'content-type', b'text/plain']],
        })
        await send({
            'type': 'http.response.body',
            'body': b'Node.js server is running',
        })

def start_node_server():
    """Start the Node.js server"""
    global node_process
    
    # Change to backend directory
    os.chdir('/app/backend')
    
    # Start Node.js server
    node_process = subprocess.Popen(
        ['node', 'server.js'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=os.environ.copy()
    )
    
    print("Node.js server started", file=sys.stderr)

def stop_node_server():
    """Stop the Node.js server"""
    global node_process
    if node_process:
        node_process.terminate()
        try:
            node_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            node_process.kill()
        print("Node.js server stopped", file=sys.stderr)

# Start Node.js server when module is imported
start_node_server()

# Register cleanup handlers
def cleanup_handler(signum, frame):
    """Handle termination signals"""
    stop_node_server()
    sys.exit(0)

signal.signal(signal.SIGTERM, cleanup_handler)
signal.signal(signal.SIGINT, cleanup_handler)
