
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const VOTOS_FILE = path.resolve('votos.json');

let votos = [0, 0, 0, 0];

// Load votes from file
if (fs.existsSync(VOTOS_FILE)) {
    try {
        const data = fs.readFileSync(VOTOS_FILE, 'utf8');
        votos = JSON.parse(data);
    } catch (err) {
        console.error('Error reading votos.json:', err);
        votos = [0, 0, 0, 0];
    }
} else {
    // Initialize file
    fs.writeFileSync(VOTOS_FILE, JSON.stringify(votos));
}

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send current votes to new client
    ws.send(JSON.stringify({ type: 'UPDATE_VOTOS', data: votos }));

    ws.on('message', (message) => {
        try {
            const parsed = JSON.parse(message);

            if (parsed.type === 'VOTAR') {
                const index = parsed.index;
                if (index >= 0 && index < votos.length) {
                    votos[index]++;

                    // Save to file
                    fs.writeFileSync(VOTOS_FILE, JSON.stringify(votos));

                    // Broadcast to all clients
                    const updateMsg = JSON.stringify({ type: 'UPDATE_VOTOS', data: votos });
                    wss.clients.forEach((client) => {
                        if (client.readyState === 1) { // WebSocket.OPEN is 1
                            client.send(updateMsg);
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
