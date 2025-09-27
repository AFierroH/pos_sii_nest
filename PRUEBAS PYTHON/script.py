import win32print

PRINTER_NAME = "XP-80C"  # o el nombre que tu impresora tenga en Windows


def send_raw(printer_name, data: bytes):
    hprinter = win32print.OpenPrinter(printer_name)
    try:
        job = win32print.StartDocPrinter(hprinter, 1, ("CP858 Test", None, "RAW"))
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
    # Seleccionar página de código 19 (PC858)
    parts.append(set_codepage(19))
    parts.append(b"\n=== USANDO CP858 (ESC t 19) ===\n")

    # Texto con acentos y ñ (como cadena de Python)
    texto = "Español: áéíóú ñ Ñ ÁÉÍÓÚ"
    try:
        # convertir a bytes en CP858
        btexto = texto.encode("cp858")
    except Exception as e:
        print("Error al codificar en cp858:", e)
        btexto = texto.encode("latin1", errors="replace")

    parts.append(btexto + b"\n")

    # Opcional: imprimir todos los bytes 128–255 para ver cómo quedan
    # (no es lo más útil en ticket, pero para prueba)
    ext = bytes(range(128, 256))
    parts.append(ext + b"\n" + b"\n" + b"\n" + b"\n" + b"\n" + b"\n")

    # Corte
    parts.append(CUT_FULL)
    return b"".join(parts)


if __name__ == "__main__":
    data = build_test()
    send_raw(PRINTER_NAME, data)
    print("Prueba CP858 enviada a", PRINTER_NAME)
