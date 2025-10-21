// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  emitirDte: (payload) => ipcRenderer.invoke('emitir-dte', payload), // llama a Nest y si pedir imprimir -> main lo imprime
  printRaw: (ticketBase64, opts) => ipcRenderer.invoke('print-raw', { ticketBase64, opts }),
  listSystemPrinters: () => ipcRenderer.invoke('list-printers'),
  imprimirTicket: (data) => ipcRenderer.invoke('imprimir-ticket', data),
  onImpresionCompletada: (callback) => ipcRenderer.on('impresion-completada', callback),
});
