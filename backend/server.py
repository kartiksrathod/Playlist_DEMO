"""
ASGI server that proxies requests to Node.js Express backend
Node.js runs on port 8002, uvicorn proxies from 8001 to 8002
"""
import subprocess
import sys
import signal
import os
import httpx
import asyncio

# Global reference to Node.js process
node_process = None
http_client = None

async def app(scope, receive, send):
    """
    ASGI app that proxies all requests to Node.js server on port 8002
    """
    global node_process, http_client
    
    if scope['type'] == 'lifespan':
        while True:
            message = await receive()
            if message['type'] == 'lifespan.startup':
                # Start Node.js server on port 8002
                if node_process is None:
                    env = os.environ.copy()
                    env['PORT'] = '8002'  # Node.js will use port 8002
                    os.chdir('/app/backend')
                    node_process = subprocess.Popen(['node', 'server.js'], env=env)
                    # Wait a bit for Node.js to start
                    await asyncio.sleep(2)
                    print("Node.js server started on port 8002", file=sys.stderr, flush=True)
                # Initialize HTTP client
                http_client = httpx.AsyncClient(timeout=30.0)
                await send({'type': 'lifespan.startup.complete'})
            elif message['type'] == 'lifespan.shutdown':
                # Close HTTP client
                if http_client:
                    await http_client.aclose()
                # Stop Node.js server
                if node_process:
                    node_process.terminate()
                    try:
                        node_process.wait(timeout=5)
                    except:
                        node_process.kill()
                    print("Node.js server stopped", file=sys.stderr, flush=True)
                await send({'type': 'lifespan.shutdown.complete'})
                return
    
    elif scope['type'] == 'http':
        # Proxy HTTP request to Node.js
        try:
            # Build URL for Node.js backend
            path = scope['path']
            query_string = scope.get('query_string', b'').decode('utf-8')
            url = f"http://localhost:8002{path}"
            if query_string:
                url += f"?{query_string}"
            
            # Forward request
            method = scope['method']
            headers = {k.decode(): v.decode() for k, v in scope['headers'] if k != b'host'}
            
            # Read request body
            body = b''
            while True:
                message = await receive()
                if message['type'] == 'http.request':
                    body += message.get('body', b'')
                    if not message.get('more_body', False):
                        break
            
            # Make request to Node.js
            response = await http_client.request(
                method=method,
                url=url,
                headers=headers,
                content=body if body else None
            )
            
            # Send response
            await send({
                'type': 'http.response.start',
                'status': response.status_code,
                'headers': [[k.encode(), v.encode()] for k, v in response.headers.items()],
            })
            await send({
                'type': 'http.response.body',
                'body': response.content,
            })
        except Exception as e:
            print(f"Proxy error: {e}", file=sys.stderr, flush=True)
            await send({
                'type': 'http.response.start',
                'status': 502,
                'headers': [[b'content-type', b'text/plain']],
            })
            await send({
                'type': 'http.response.body',
                'body': b'Bad Gateway - Node.js backend unavailable',
            })

# Cleanup handler for signals
def signal_handler(signum, frame):
    if node_process:
        node_process.terminate()
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)
