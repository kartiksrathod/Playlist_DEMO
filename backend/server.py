"""
ASGI wrapper for Node.js Express server
This file exists to satisfy the uvicorn requirement in supervisord.conf
The actual server runs via Node.js
"""
import subprocess
import sys
import signal
import os

# Start the Node.js server
node_process = None

def signal_handler(signum, frame):
    """Handle termination signals"""
    if node_process:
        node_process.terminate()
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

# Change to backend directory
os.chdir('/app/backend')

# Start Node.js server
node_process = subprocess.Popen(['node', 'server.js'])

try:
    node_process.wait()
except KeyboardInterrupt:
    node_process.terminate()
    sys.exit(0)
