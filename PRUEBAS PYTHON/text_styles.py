import win32print

PRINTER_NAME = "XP-80C"

def send_raw(printer_name, data: bytes):
    hprinter = win32print.OpenPrinter(printer_name)
    try:
        job = win32print.StartDocPrinter(hprinter, 1, ("Test Codepage 33", None, "RAW"))
        win32print.StartPagePrinter(hprinter)
        win32print.WritePrinter(hprinter, data)
        win32print.EndPagePrinter(hprinter)
        win32print.EndDocPrinter(hprinter)
    finally:
        win32print.ClosePrinter(hprinter)


ESC = b"\x1B"
GS = b"\x1D"
RESET = ESC + b"@"
CUT_FULL = GS + b"V\x00"

def set_codepage(n: int) -> bytes:
    return ESC + b"t" + bytes([n])


def build_test():
    parts = []
    parts.append(RESET)
    parts.append(ESC + b"t" + bytes([19]))

    # Character set regional (Spain)
    parts.append(ESC + b"R" + bytes([7]))
    parts.append(b"\n=== CODE PAGE 19 SPAINN ===\n\n")

    # Generar caracteres 0–255 en la misma línea
    chars = []
    for i in range(256):
        chars.append(bytes([i]))
    parts.append(b''.join(chars) + b"\n\n")
    parts.append(b"\n\n")
    parts.append(b"\n\n")
    # Corte de papel
    parts.append(CUT_FULL)
    return b"".join(parts)


if __name__ == "__main__":
    data = build_test()
    send_raw(PRINTER_NAME, data)
    print("Prueba enviada a", PRINTER_NAME)
