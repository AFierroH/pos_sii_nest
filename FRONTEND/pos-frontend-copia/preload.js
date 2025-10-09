// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  emitirDte: (payload) => ipcRenderer.invoke('emitir-dte', payload), // llama a Nest y si pedir imprimir -> main lo imprime
  printRaw: (base64Ticket, opts) => ipcRenderer.invoke('print-raw', { base64Ticket, opts }),
  listSystemPrinters: () => ipcRenderer.invoke('list-printers'),
});
