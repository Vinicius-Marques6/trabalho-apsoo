const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Cria a janela do navegador.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.on('resize', () => {
    win.webContents.invalidate();
  });
    

  Menu.setApplicationMenu(null);

  if (isDev) {
    // --- MODO DE DESENVOLVIMENTO ---
    // Carrega a URL do servidor Vite (da pasta 'play')
    // Certifique-se de que esta é a porta correta que o Vite usa.
    console.log('Running in development, loading Vite server...');
    win.loadURL('http://localhost:5173'); // Porta padrão do Vite/React

    // Abre o DevTools (opcional).
    win.webContents.openDevTools();
  } else {
    // --- MODO DE PRODUÇÃO ---
    // Carrega o index.html compilado da pasta 'play'
    // A configuração do 'electron-builder' (próximo passo)
    // copiará o build do 'play' para dentro do pacote.
    console.log('Running in production, loading built file...');
    win.loadFile(path.join(process.resourcesPath, 'play-dist', 'index.html'));

    win.webContents.openDevTools();
  }
}

// Este método será chamado quando o Electron terminar
// a inicialização e estiver pronto para criar janelas do navegador.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // No macOS é comum recriar uma janela no aplicativo quando o
    // ícone do dock é clicado e não há outras janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Encerre quando todas as janelas forem fechadas, exceto no macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('minimize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.handle('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  }
});

ipcMain.handle('close-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});