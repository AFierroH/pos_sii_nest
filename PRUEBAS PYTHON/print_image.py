from escpos.printer import Usb
from PIL import Image, ImageDraw, ImageFont

# Configuración de la impresora
VENDOR_ID = 0x1FC9
PRODUCT_ID = 0x2016
p = Usb(VENDOR_ID, PRODUCT_ID, interface=0, in_ep=0x81, out_ep=0x03)

# Crear una imagen en blanco
width, height = 384, 200
image = Image.new('1', (width, height), 255)
draw = ImageDraw.Draw(image)

# Cargar una fuente que soporte caracteres latinos
font = ImageFont.load_default()

# Escribir texto en la imagen
draw.text((10, 10), "¡Hola, mundo! ¿Cómo estás?", font=font, fill=0)
draw.text((10, 40), "Ñandú y piñón", font=font, fill=0)

# Dibujar un círculo negro
draw.ellipse((150, 70, 180, 100), fill=0)

# Guardar la imagen
image.save('ticket.png')
img = Image.open('logo.png').resize((400, 200))
img.save('logo2.png')
# Imprimir la imagen
p.image(img)
p.store_image("logo2.png", n=0)
p.cut()