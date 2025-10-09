import { app, BrowserWindow, ipcMain } from 'electron';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
console.log("Electron main script iniciado");

function createWindow() {
   console.log("Creando ventana principal...");
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // si quieres usar Node en renderer
      contextIsolation: false
    }
  });

  if (!app.isPackaged) {
    console.log("Cargando Vite dev server...");
  mainWindow.loadURL('http://localhost:5173'); // coincide con el puerto de Vite
} else {
   console.log("Cargando archivo local...");
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
}
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});



// Handler para imprimir bytes raw por TCP (impresora térmica en red)
ipcMain.handle('print-raw', async (ev, { base64Ticket, opts = {} }) => {
  const PRINTER_IP = opts.ip || '192.168.200.169';
  const PRINTER_PORT = opts.port || 9100;
  const ticketBuffer = Buffer.from(base64Ticket, 'base64');

  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let errored = false;
    client.setTimeout(7000);

    client.connect(PRINTER_PORT, PRINTER_IP, () => {
      client.write(ticketBuffer, (err) => {
        if (err) { errored = true; client.destroy(); return reject({ ok:false, msg: err.message }); }
        setTimeout(()=> client.end(), 200);
      });
    });

    client.on('close', () => {
      if(!errored) resolve({ ok: true, printer:`${PRINTER_IP}:${PRINTER_PORT}` });
    });

    client.on('error', (err) => {
      errored = true; client.destroy(); reject({ ok:false, msg: err.message });
    });

    client.on('timeout', () => {
      errored = true; client.destroy(); reject({ ok:false, msg: 'timeout' });
    });
  });
});

// Handler para listar impresoras del sistema (opcional)
ipcMain.handle('list-printers', (ev) => {
  const webContents = ev.sender;
  const printers = webContents.getPrinters();
  return printers;
});

// Opcional: handler que llama a tu backend Nest para emitir DTE y, si opts.imprimir, lo imprime

ipcMain.handle('emitir-dte', async (ev, payload) => {
  try {
    // Llama a tu API Nest (ajusta URL)
    const resp = await axios.post('http://localhost:3000/dte/emitir', payload, { timeout: 10000 });
    const data = resp.data;
    // Si pides imprimir desde el frontend (usarImpresora true), main ejecuta print-raw
    if (payload.imprimirDesdeElectron || payload.usarImpresora) {
      if (data.ticketBase64) {
        // opts: ip/port si quieres permitir seleccionar impresora en UI
        const printResult = await ipcMain.invoke ? null : null; // no usado — usar directa llamada:
        // en vez de invoke, llamamos directamente a la función print-raw
        const result = await (async () => {
          // copiamos la lógica de print-raw para evitar recursividad
          const PRINTER_IP = payload.printerIp || '192.168.200.169';
          const PRINTER_PORT = payload.printerPort || 9100;
          const ticketBuffer = Buffer.from(data.ticketBase64, 'base64');
          return new Promise((resolve, reject) => {
            const client = new net.Socket();
            let errored = false;
            client.setTimeout(7000);
            client.connect(PRINTER_PORT, PRINTER_IP, () => {
              client.write(ticketBuffer, (err) => {
                if (err) { errored = true; client.destroy(); return reject({ ok:false, msg: err.message }); }
                setTimeout(()=> client.end(), 200);
              });
            });
            client.on('close', () => { if(!errored) resolve({ ok:true }) });
            client.on('error', (err) => { errored = true; client.destroy(); reject({ ok:false, msg: err.message }) });
            client.on('timeout', ()=> { errored = true; client.destroy(); reject({ ok:false, msg:'timeout' }) });
          });
        })();
        return { ...data, printed: result };
      }
    }
    return data;
  } catch (err) {
    console.error('emitir-dte error', err.message || err);
    throw err;
  }
});
