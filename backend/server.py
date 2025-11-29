"""
ASGI wrapper for Node.js Express server
This file provides a minimal ASGI interface for uvicorn while running Node.js
"""
import subprocess
import sys
import signal
import os
import asyncio

# Global reference to Node.js process
node_process = None

async def app(scope, receive, send):
    """
    Minimal ASGI app for ASGI lifespan protocol
    The actual HTTP server is the Node.js process
    """
    global node_process
    
    if scope['type'] == 'lifespan':
        while True:
            message = await receive()
            if message['type'] == 'lifespan.startup':
                # Start Node.js server on startup
                if node_process is None:
                    os.chdir('/app/backend')
                    node_process = subprocess.Popen(['node', 'server.js'])
                    print("Node.js server started", file=sys.stderr, flush=True)
                await send({'type': 'lifespan.startup.complete'})
            elif message['type'] == 'lifespan.shutdown':
                # Stop Node.js server on shutdown
                if node_process:
                    node_process.terminate()
                    try:
                        node_process.wait(timeout=5)
                    except:
                        node_process.kill()
                    print("Node.js server stopped", file=sys.stderr, flush=True)
                await send({'type': 'lifespan.shutdown.complete'})
                return
    else:
        # HTTP requests (shouldn't happen as Node.js handles them)
        await send({
            'type': 'http.response.start',
            'status': 200,
            'headers': [[b'content-type', b'text/plain']],
        })
        await send({
            'type': 'http.response.body',
            'body': b'Node.js server running',
        })

# Cleanup handler for signals
def signal_handler(signum, frame):
    if node_process:
        node_process.terminate()
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)
