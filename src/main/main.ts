/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import database from '../database/database';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});


ipcMain.handle('database:getProducts', async () => {
  try {
    return database.getProducts();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
});

ipcMain.handle('database:updateProductStock', async (event, productId: number, newStock: number) => {
  try {
    return database.updateProductStock(productId, newStock);
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:createSale', async (event, saleData: any) => {
  try {
    return database.createSale(saleData);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:getSalesWithItems', async () => {
  try {
    return database.getSalesWithItems();
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return [];
  }
});

ipcMain.handle('database:getProduct', async (event, id: number) => {
  try {
    return database.getProduct(id);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
});

ipcMain.handle('database:addProduct', async (event, productData: any) => {
  try {
    return database.addProduct(productData);
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:updateProduct', async (event, productId: number, productData: any) => {
  try {
    return database.updateProduct(productId, productData);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:deleteProduct', async (event, productId: number) => {
  try {
    return database.deleteProduct(productId);
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return { success: false, error: error.message };
  }
});

// Novos handlers para caixa
ipcMain.handle('database:openCashRegister', async (event, initialAmount: number) => {
  try {
    return database.openCashRegister(initialAmount);
  } catch (error) {
    console.error('Erro ao abrir caixa:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:closeCashRegister', async (event, finalAmount: number, observations: string) => {
  try {
    return database.closeCashRegister(finalAmount, observations);
  } catch (error) {
    console.error('Erro ao fechar caixa:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:getOpenCashRegister', async () => {
  try {
    return database.getOpenCashRegister();
  } catch (error) {
    console.error('Erro ao buscar caixa aberto:', error);
    return null;
  }
});

ipcMain.handle('database:getCashRegisters', async () => {
  try {
    return database.getCashRegisters();
  } catch (error) {
    console.error('Erro ao buscar caixas:', error);
    return [];
  }
});

ipcMain.handle('database:addCashEntry', async (event, amount: number, description: string) => {
  try {
    return database.addCashEntry(amount, description);
  } catch (error) {
    console.error('Erro ao adicionar entrada:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:addCashWithdrawal', async (event, amount: number, description: string) => {
  try {
    return database.addCashWithdrawal(amount, description);
  } catch (error) {
    console.error('Erro ao adicionar saída:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('database:getMonthlyReport', async (event, year: number, month: number) => {
  try {
    return database.getMonthlyReport(year, month);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return null;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1400,
    height: 900,
    icon: getAssetPath('Person.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    database.close();
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    
    
    createWindow();
    app.on('activate', () => {
      
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);