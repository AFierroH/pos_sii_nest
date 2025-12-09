import sys
import os
import ctypes
import socket
import struct
import tkinter as tk
from tkinter import messagebox
from PIL import Image

# --- CONFIGURACIÓN HARDWARE ---
VID = 0x1FC9
PID = 0x2016
EP_OUT = 0x03

# --- CARGAR DLL (Igual que en Pascal, carga manual robusta) ---
dll_name = "libusb-1.0.dll"
if not os.path.exists(dll_name):
    messagebox.showerror("Error", f"Falta {dll_name} junto al script.")
    sys.exit(1)

try:
    libusb = ctypes.CDLL(os.path.abspath(dll_name))
except Exception as e:
    messagebox.showerror("Error DLL", f"Error cargando DLL: {e}")
    sys.exit(1)

# --- TIPOS CTYPES ---
p_context = ctypes.c_void_p
p_handle = ctypes.c_void_p

libusb.libusb_init.argtypes = [ctypes.POINTER(p_context)]
libusb.libusb_open_device_with_vid_pid.argtypes = [p_context, ctypes.c_uint16, ctypes.c_uint16]
libusb.libusb_open_device_with_vid_pid.restype = p_handle
libusb.libusb_claim_interface.argtypes = [p_handle, ctypes.c_int]
libusb.libusb_bulk_transfer.argtypes = [p_handle, ctypes.c_uint8, ctypes.POINTER(ctypes.c_ubyte), ctypes.c_int,
                                        ctypes.POINTER(ctypes.c_int), ctypes.c_uint]
libusb.libusb_release_interface.argtypes = [p_handle, ctypes.c_int]
libusb.libusb_close.argtypes = [p_handle]
libusb.libusb_exit.argtypes = [p_context]


# --- FUNCIONES HELPER (Equivalentes a Pascal) ---

def format_money(amount):
    """Pascal: FormatFloat('$#,##0', Amount) -> $2.500"""
    return "${:,.0f}".format(amount).replace(",", ".")


def format_dec(amount):
    """Pascal: FormatFloat('0.00', Amount) -> 10.23"""
    return "{:.2f}".format(amount)


def get_image_bytes(filepath):
    """Convierte BMP a comandos ESC/POS (GS v 0)"""
    if not os.path.exists(filepath): return b''
    try:
        img = Image.open(filepath).convert('RGB')
        w, h = img.size
        # Ancho en bytes (redondeo arriba)
        wb = (w + 7) // 8

        # Cabecera: GS v 0 m xL xH yL yH
        header = b'\x1d\x76\x30\x00' + wb.to_bytes(2, 'little') + h.to_bytes(2, 'little')

        data = bytearray(wb * h)
        pixels = img.load()

        for y in range(h):
            for x in range(wb):
                byte_val = 0
                for b in range(8):
                    real_x = x * 8 + b
                    if real_x < w:
                        r, g, _ = pixels[real_x, y]
                        # Si es oscuro (<128), bit = 1
                        if r < 128 and g < 128:
                            byte_val |= (1 << (7 - b))
                data[y * wb + x] = byte_val

        return header + data
    except:
        return b''


# --- ENVÍO HARDWARE ---

def send_usb(data):
    ctx = p_context(0)
    if libusb.libusb_init(ctypes.byref(ctx)) < 0: return

    try:
        handle = libusb.libusb_open_device_with_vid_pid(ctx, VID, PID)
        if not handle:
            messagebox.showerror("Error", "Impresora USB no encontrada.")
            return

        try:
            libusb.libusb_claim_interface(handle, 0)

            # Enviar datos
            transferred = ctypes.c_int(0)
            c_data = (ctypes.c_ubyte * len(data)).from_buffer_copy(data)
            libusb.libusb_bulk_transfer(handle, EP_OUT, c_data, len(data), ctypes.byref(transferred), 5000)

            libusb.libusb_release_interface(handle, 0)
        finally:
            libusb.libusb_close(handle)
    finally:
        libusb.libusb_exit(ctx)


def send_lan(host, data):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(3)
            s.connect((host, 9100))
            s.sendall(data)
    except Exception as e:
        messagebox.showerror("Error LAN", str(e))


# --- LÓGICA PRINCIPAL (Igual a RunPracticaDemo) ---

def run_practica_demo(mode):
    buffer = bytearray()

    # Helpers internos para escribir rápido
    def add_cmd(b):
        buffer.extend(b)

    def add_line(text):
        buffer.extend((text + '\n').encode('cp1252', 'ignore'))

    def add_text(text):
        buffer.extend(text.encode('cp1252', 'ignore'))

    # 1. INICIALIZACIÓN
    add_cmd(b'\x1b\x40')  # Reset
    add_cmd(b'\x1b\x74\x10')  # CodePage 1252 (Español)

    # 2. HEADER CON LOGO
    add_cmd(b'\x1b\x61\x01')  # Centrar

    # Intenta poner el logo
    img = get_image_bytes('logo2.bmp')
    if img: add_cmd(img)

    add_line('')

    # 3. TEXTOS
    add_cmd(b'\x1b\x61\x00')  # Izquierda
    add_line('1. TEXTO NORMAL: Prueba estandar.')
    add_line('')

    # Negrita
    add_cmd(b'\x1b\x45\x01')  # ESC E 1
    add_line('2. TEXTO EN NEGRITA: BOLD ON')
    add_cmd(b'\x1b\x45\x00')  # Off
    add_line('')

    # Subrayado
    add_cmd(b'\x1b\x2d\x01')  # ESC - 1
    add_line('3. TEXTO SUBRAYADO')
    add_cmd(b'\x1b\x2d\x00')  # Off
    add_line('')

    # Inverso
    add_cmd(b'\x1d\x42\x01')  # GS B 1
    add_line('4. TEXTO INVERSO (RESALTADO)')
    add_cmd(b'\x1d\x42\x00')  # Off
    add_line('')

    # 4. TAMAÑOS
    add_line('5. TAMANOS:')

    add_cmd(b'\x1d\x21\x00');
    add_text('Normal - ')

    add_cmd(b'\x1d\x21\x10');
    add_line('Doble Ancho')

    add_cmd(b'\x1d\x21\x01');
    add_line('Doble Alto')

    add_cmd(b'\x1d\x21\x11');
    add_line('GIGANTE (2x2)')

    add_cmd(b'\x1d\x21\x00')  # Reset
    add_line('')

    # 5. FORMATO NÚMEROS
    add_line('6. NUMEROS:')
    add_line(f'Decimal: {format_dec(10.23)}')
    add_line(f'Pesos: {format_money(2500)}')
    add_line('')

    # 6. POSICIONAMIENTO
    # ESC $ nL nH (160 = 0xA0)
    add_cmd(b'\x1b\x24\xa0\x00')
    add_line('7. TEXTO MOVIDO AL CENTRO')
    add_line('')

    # 7. CÓDIGO DE BARRAS (Code39)
    add_line('8. BARCODE:')
    # GS k 4 "12345ABC" NUL
    add_cmd(b'\x1d\x6b\x04' + b'12345ABC' + b'\x00')
    add_line('')
    add_line('   12345ABC0')

    # FIN
    add_line('')
    add_line('--- FIN DEMO PYTHON ---')
    add_cmd(b'\x1d\x56\x42\x00')  # Corte

    # ENVIAR
    if mode == 'LAN':
        # Cambia IP si es necesario
        send_lan('192.168.1.169', buffer)
    else:
        send_usb(buffer)


# --- GUI ---
def main():
    root = tk.Tk()
    root.title("Practica Python 3.13")
    root.geometry("300x200")

    tk.Label(root, text="DEMO PRÁCTICA", font=("Arial", 14, "bold")).pack(pady=15)

    btn_usb = tk.Button(root, text="Imprimir (USB)",
                        font=("Arial", 10), bg="#e1e1e1",
                        command=lambda: run_practica_demo('USB'))
    btn_usb.pack(pady=5, fill='x', padx=30)

    btn_lan = tk.Button(root, text="Imprimir (LAN)",
                        font=("Arial", 10), bg="#e1e1e1",
                        command=lambda: run_practica_demo('LAN'))
    btn_lan.pack(pady=5, fill='x', padx=30)

    root.mainloop()


if __name__ == "__main__":
    main()