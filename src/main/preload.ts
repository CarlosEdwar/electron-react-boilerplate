// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  
  database: {
    getProducts: () => ipcRenderer.invoke('database:getProducts'),
    getProduct: (id: number) => ipcRenderer.invoke('database:getProduct', id),
    addProduct: (productData: any) => ipcRenderer.invoke('database:addProduct', productData),
    updateProduct: (productId: number, productData: any) => 
      ipcRenderer.invoke('database:updateProduct', productId, productData),
    deleteProduct: (productId: number) => ipcRenderer.invoke('database:deleteProduct', productId),
    updateProductStock: (productId: number, newStock: number) => 
      ipcRenderer.invoke('database:updateProductStock', productId, newStock),
    createSale: (saleData: any) => ipcRenderer.invoke('database:createSale', saleData),
    getSalesWithItems: () => ipcRenderer.invoke('database:getSalesWithItems'),
    
  
    openCashRegister: (initialAmount: number) => 
      ipcRenderer.invoke('database:openCashRegister', initialAmount),
    closeCashRegister: (finalAmount: number, observations: string) => 
      ipcRenderer.invoke('database:closeCashRegister', finalAmount, observations),
    getOpenCashRegister: () => ipcRenderer.invoke('database:getOpenCashRegister'),
    getCashRegisters: () => ipcRenderer.invoke('database:getCashRegisters'),
    addCashEntry: (amount: number, description: string) => 
      ipcRenderer.invoke('database:addCashEntry', amount, description),
    addCashWithdrawal: (amount: number, description: string) => 
      ipcRenderer.invoke('database:addCashWithdrawal', amount, description),
    getMonthlyReport: (year: number, month: number) => 
      ipcRenderer.invoke('database:getMonthlyReport', year, month),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;