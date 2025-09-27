from escpos.printer import Usb

VENDOR_ID = 0x1FC9
PRODUCT_ID = 0x2016

p = Usb(VENDOR_ID, PRODUCT_ID, interface=0, in_ep=0x81, out_ep=0x03)

# Seleccionar codepage PC858 y enviar todos los bytes 0x80–0x8F
raw_bytes = bytes([0x1B, 0x74, 0x13])
p._raw(raw_bytes)
p._raw(b"\xA4")
p._raw(b"\x1D\x21\x00")  # tamaño normal
p.text("Hola mundo USB\n")

# Texto doble ancho y doble alto
p._raw(b"\x1D\x21\x11")  # 2x2
p.text("Ticket GRANDE\n")

# Texto triple (si tu impresora lo soporta)
p._raw(b"\x1D\x21\x22")  # 3x3
p.text("Ticket más grande\n")

# Texto 4x4 (muchas impresoras lo limitan a 2x2)
p._raw(b"\x1D\x21\x33")
p.text("SUPER GRANDE\n")

# Volver a normal
p._raw(b"\x1D\x21\x00")
p.text("Final normal\n")
p.text("{:<15}{:<10}{:>10}\n".format("Producto", "Cant", "Precio"))
p.text("{:<15}{:<10}{:>10}\n".format("Pan", "2", "$1000"))
p.text("{:<15}{:<10}{:>10}\n".format("Leche", "1", "$1500"))
p.cut()


p.cut()