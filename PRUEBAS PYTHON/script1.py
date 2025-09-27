from escpos.printer import File

# Crear impresora virtual que escribe a un archivo
# NOTA: Usa modo binario, no lo abras con Notepad, se verá "raro"
p = File("demo_escpos.bin")

# Reset
p._raw(b"\x1B\x40")  # ESC @

# Texto normal
p.text("Texto normal\n")

# Texto en cursiva (no todas las impresoras lo soportan)
p._raw(b"\x1B\x34")   # ESC 4 -> italics ON
p.text("Texto en cursiva\n")
p._raw(b"\x1B\x35")   # ESC 5 -> italics OFF

# Texto en negrita
p.set(bold=True)
p.text("Texto en negrita\n")
p.set(bold=False)

# Texto subrayado
p.set(underline=1)
p.text("Texto subrayado\n")
p.set(underline=0)

# Texto en diferentes tamaños
p.set(width=2, height=2)
p.text("Texto doble ancho y alto\n")
p.set(width=1, height=1)

p.set(width=2, height=1)
p.text("Texto doble ancho\n")

p.set(width=1, height=2)
p.text("Texto doble alto\n")

# Línea final y corte
p.text("\n\n")
p.cut()

p.close()

print("Archivo demo_escpos.bin generado. Envíalo a la impresora para probar.")
