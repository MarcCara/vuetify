const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simple demo; use preload in production
        },
    });

    // Check if we are in dev mode (e.g. via env var or arg)
    // For this exercise, we can try to load the dev server URL first
    // or fall back to dist/index.html

    const devUrl = 'http://localhost:3000'; // Default Vite port
    // Note: If running via Docker mapped to 8080, use 8080.
    // If running locally with 'npm run dev', Vite usually picks 3000.

    // We'll try to load the local dev server.
    // In a real scenario, we'd wait for it to be ready.
    // For production build (packaged), we load index.html.

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        // Production behavior
        // When packaged, usually resources are in app.asar/dist or similar
        // win.loadFile(path.join(__dirname, '../dist/index.html'));

        // For this specific task, let's allow loading the dev server easily
        // or the built file.
        win.loadURL('http://localhost:3000').catch(() => {
            win.loadFile(path.join(__dirname, '../dist/index.html'));
        });
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
