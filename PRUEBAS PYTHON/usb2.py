import win32print

PRINTER_NAME = "XP-80C"

def send_raw(printer_name, data: bytes):
    hprinter = win32print.OpenPrinter(printer_name)
    try:
        job = win32print.StartDocPrinter(hprinter, 1, ("Test Codepage", None, "RAW"))
        win32print.StartPagePrinter(hprinter)
        win32print.WritePrinter(hprinter, data)
        win32print.EndPagePrinter(hprinter)
        win32print.EndDocPrinter(hprinter)
    finally:
        win32print.ClosePrinter(hprinter)


ESC = b"\x1B"
RESET = ESC + b"@"

def set_codepage(n: int) -> bytes:
    return ESC + b"t" + bytes([n])


# Code pages específicos que mencionaste
codepages_to_test = [19, 33, 53, 71, 72, 73, 255] + list(range(50, 90))


def build_test():
    parts = []
    for cp in codepages_to_test:
        parts.append(RESET)
        parts.append(set_codepage(cp))
        parts.append(b"\n=== CODE PAGE %d ===\n" % cp)

        # Texto con ñ y acentos para referencia
        parts.append(b"Texto: Espanol, nino, corazon, cafe\n")

        # Solo caracteres ASCII 155–165
        row = []
        for i in range(155, 166):
            row.append(bytes([i]))
        parts.append(b"ASCII 155-165: " + b''.join(row) + b"\n\n")

    return b"".join(parts)


if __name__ == "__main__":
    data = build_test()
    send_raw(PRINTER_NAME, data)
    print("Prueba enviada a", PRINTER_NAME)
