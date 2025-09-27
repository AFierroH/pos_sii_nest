import win32print

PRINTER_NAME = "XP-80C"

def send_raw(printer_name, data: bytes):
    hprinter = win32print.OpenPrinter(printer_name)
    try:
        job = win32print.StartDocPrinter(hprinter, 1, ("Voucher", None, "RAW"))
        win32print.StartPagePrinter(hprinter)
        win32print.WritePrinter(hprinter, data)
        win32print.EndPagePrinter(hprinter)
        win32print.EndDocPrinter(hprinter)
    finally:
        win32print.ClosePrinter(hprinter)


# -------------------
# ESC/POS helpers
# -------------------
ESC = b"\x1B"
GS = b"\x1D"

RESET = ESC + b"@"
CUT_FULL = GS + b"V\x00"

# Rotación 90° (puede que tu POS-80C no lo soporte)
ROTATE_ON = ESC + b"V\x01"
ROTATE_OFF = ESC + b"V\x00"

text = (b"*** MINI VOUCHER ***\n" +
    b"Producto X    $1000\n" +
    b"Producto Y    $2000\n" +
    b"TOTAL         $3000\n")


# -------------------
# Voucher mini rotado (sin corte aquí)
# -------------------
voucher_mini = (
    RESET +
    ROTATE_ON +
    text[::-1] +
    ROTATE_OFF +
    b"\n\n" +
    CUT_FULL
)

# -------------------
# Voucher normal (este sí incluye el corte final)
# -------------------
voucher_normal = (
    RESET +
    b"====== VOUCHER NORMAL ======\n" +
    b"Item A          $1500\n" +
    b"Item B          $2500\n" +
    b"TOTAL           $4000\n" +
    b"\n\n" +
    CUT_FULL
)


if __name__ == "__main__":
    # Enviar ambos en la misma tanda
    send_raw(PRINTER_NAME, voucher_mini + voucher_normal)
    print("Vouchers enviados a", PRINTER_NAME)
