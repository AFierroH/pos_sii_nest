import win32print

PRINTER_NAME = "XP-80C"

def send_raw(printer_name, data: bytes):
    hprinter = win32print.OpenPrinter(printer_name)
    try:
        job = win32print.StartDocPrinter(hprinter, 1, ("Test Codepage CP1252", None, "RAW"))
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

    # Usar tabla Windows CP1252 (n=16) y regional Spain I (n=7)
    parts.append(set_codepage(16))   # ESC t 16
    parts.append(ESC + b"R" + bytes([7]))  # Spain I
    parts.append(b"\n=== CODE PAGE 16 (CP1252) + Spain I ===\n\n")

    # Texto de prueba con Ñ y tildes
    texto = "España: Ñ ñ Á É Í Ó Ú á é í ó ú ü Ü"
    parts.append(texto.encode("cp1252"))
    parts.append(b"\n\n")

    # También imprimir todos los bytes 32–255 para verificar
    chars = []
    for i in range(32, 256):
        chars.append(bytes([i]))
    parts.append(b''.join(chars) + b"\n\n")

    # Corte de papel
    parts.append(CUT_FULL)
    return b"".join(parts)


if __name__ == "__main__":
    data = build_test()
    send_raw(PRINTER_NAME, data)
    print("Prueba enviada a", PRINTER_NAME)
