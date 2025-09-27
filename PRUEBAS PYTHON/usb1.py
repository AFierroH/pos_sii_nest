import win32print

# Nombre de la impresora tal como aparece en Windows
printer_name = "XP-80C"

# Comandos ESC/POS
ESC = b'\x1b'   # Escape
CUT = ESC + b'@\x1dV\x00'  # Corte completo (algunos drivers aceptan b'\x1dV\x00')

# Texto a imprimir
text = "Hola mundo ESC/POS\n".encode('cp437')  # Codificación común de impresoras POS

# Abrir la impresora
hPrinter = win32print.OpenPrinter(printer_name)
try:
    hJob = win32print.StartDocPrinter(hPrinter, 1, ("Test", None, "RAW"))
    win32print.StartPagePrinter(hPrinter)

    # Enviar texto
    win32print.WritePrinter(hPrinter, text)
    win32print.WritePrinter(hPrinter, text)
    win32print.WritePrinter(hPrinter, text)
    win32print.WritePrinter(hPrinter, text)
    win32print.WritePrinter(hPrinter, text)
    # Enviar corte
    win32print.WritePrinter(hPrinter, CUT)

    win32print.EndPagePrinter(hPrinter)
    win32print.EndDocPrinter(hPrinter)
finally:
    win32print.ClosePrinter(hPrinter)
