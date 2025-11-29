#!/usr/bin/env node

/**
 * LoopMemory MCP Proxy
 * This script acts as a local MCP server that proxies requests to the remote LoopMemory API
 */

const API_URL = 'https://loopmemory.vercel.app/api/mcp';

// Read from stdin and write to stdout (MCP stdio protocol)
process.stdin.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', async (chunk) => {
    buffer += chunk;

    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
        if (line.trim()) {
            try {
                const request = JSON.parse(line);

                // Forward request to remote API
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                });

                const result = await response.json();

                // Write response to stdout
                process.stdout.write(JSON.stringify(result) + '\n');
            } catch (error) {
                const errorResponse = {
                    jsonrpc: '2.0',
                    id: null,
                    error: {
                        code: -32700,
                        message: error.message,
                    },
                };
                process.stdout.write(JSON.stringify(errorResponse) + '\n');
            }
        }
    }
});

process.stdin.on('end', () => {
    process.exit(0);
});

// Handle errors
process.on('uncaughtException', (error) => {
    console.error('Error:', error);
    process.exit(1);
});
