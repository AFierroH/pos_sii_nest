/* import { app, BrowserWindow, ipcMain } from 'electron';
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
    const resp = await axios.post('http://localhost:3000/dte/emitir', payload, { timeout: 10000 });
    const data = resp.data;

    // si viene el ticket y se pidió imprimir:
    if (data.ticketBase64 && (payload.imprimirDesdeElectron || payload.usarImpresora)) {
      const PRINTER_IP = payload.printerIp || '192.168.200.169';
      const PRINTER_PORT = payload.printerPort || 9100;
      const ticketBuffer = Buffer.from(data.ticketBase64, 'base64');

      console.log(`[Electron] Enviando ticket a ${PRINTER_IP}:${PRINTER_PORT}...`);

      return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let errored = false;
        client.setTimeout(7000);

        client.connect(PRINTER_PORT, PRINTER_IP, () => {
          client.write(ticketBuffer, (err) => {
            if (err) {
              errored = true;
              client.destroy();
              console.error('[Electron] Error al escribir en socket:', err);
              return reject({ ok: false, msg: err.message });
            }
            setTimeout(() => client.end(), 200);
          });
        });

        client.on('close', () => {
          if (!errored) {
            console.log('[Electron] Ticket enviado correctamente.');
            resolve({ ...data, printed: true });
          }
        });

        client.on('error', (err) => {
          errored = true;
          client.destroy();
          console.error('[Electron] Error al conectar a la impresora:', err);
          reject({ ok: false, msg: err.message });
        });

        client.on('timeout', () => {
          errored = true;
          client.destroy();
          console.error('[Electron] Timeout al imprimir.');
          reject({ ok: false, msg: 'timeout' });
        });
      });
    }

    // Si no hay ticket o no se pidió imprimir
    return data;
  } catch (err) {
    console.error('[Electron] emitir-dte error:', err.message || err);
    throw err;
  }
});
 */

// electron.js
// electron.js
/* import { app, BrowserWindow, ipcMain } from 'electron'
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,    // ✅ acceso a require() desde Vue
      contextIsolation: false,  // ✅ no hay sandbox
    },
  })

  // Si usas Vite:
  win.loadURL('http://localhost:5173')
  // Si estás en build: win.loadFile(path.join(__dirname, 'dist/index.html'))

  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

// 🔹 Canal IPC para imprimir desde el frontend
ipcMain.handle('imprimir-ticket', async (event, data) => {
  try {
    const client = new net.Socket()
    const ticket = Buffer.from("1B4068656C6C6F20776F726C640A1D564200", "hex")

    await new Promise((resolve, reject) => {
      client.connect(9100, "192.168.200.169", () => {
        client.write(ticket, () => {
          console.log("✅ Enviado a la impresora!")
          client.end()
          resolve()
        })
      })
      client.on('error', reject)
    })

    return { ok: true }
  } catch (err) {
    console.error("❌ Error al imprimir:", err)
    return { ok: false, error: err.message }
  }
})

ipcMain.handle('print-raw', async (event, { base64Ticket, opts }) => {
  try {
    const { ip, port } = opts
    const client = new net.Socket()
    const buffer = Buffer.from(base64Ticket, 'base64')

    await new Promise((resolve, reject) => {
      client.connect(port, ip, () => {
        client.write(buffer, () => {
          console.log(`🖨️ Ticket enviado a ${ip}:${port}`)
          client.end()
          resolve()
        })
      })
      client.on('error', reject)
    })

    return { ok: true }
  } catch (err) {
    console.error("❌ Error al imprimir (print-raw):", err)
    return { ok: false, error: err.message }
  }
})
 */
/* 
import { app, BrowserWindow, ipcMain } from 'electron'
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // más seguro
      contextIsolation: true, // usa contextBridge
    },
  })

  win.loadURL('http://localhost:5173')
  // win.loadFile(path.join(__dirname, 'dist/index.html'))
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

// ✅ Canal IPC desde el frontend
ipcMain.handle('print-raw', async (event, { base64Ticket, opts }) => {
  try {
    const ip = opts.ip || '192.168.200.169'
    const port = opts.port || 9100
    const buffer = Buffer.from(base64Ticket, 'base64')

    const client = new net.Socket()
    await new Promise((resolve, reject) => {
      client.connect(port, ip, () => {
        client.write(buffer, () => {
          console.log(`✅ Ticket enviado a ${ip}:${port}`)
          client.end()
          resolve()
        })
      })
      client.on('error', reject)
    })
    return { ok: true }
  } catch (err) {
    console.error('❌ Error al imprimir:', err)
    return { ok: false, error: err.message }
  }
})
 */

import { app, BrowserWindow, ipcMain } from "electron";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false, // más seguro
    }
  });

  win.loadURL("http://localhost:5173");
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Reemplaza el handler print-raw por este:
ipcMain.handle("print-raw", async (event, { ticketBase64, opts }) => {
  return new Promise((resolve, reject) => {
    try {
      const buffer = Buffer.from(ticketBase64, "base64");
      const client = new net.Socket();
      client.connect(opts.port, opts.ip, () => {
        client.write(buffer, () => {
          client.end();
          resolve("Enviado correctamente");
        });
      });
      client.on("error", (err) => reject(err.message));
    } catch (err) {
      reject(err.message);
    }
  });
});