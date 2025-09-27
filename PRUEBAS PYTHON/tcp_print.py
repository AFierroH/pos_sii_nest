import socket

def send_to_printer(host, port, data: bytes):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(5)
    try:
        s.connect((host, port))
        s.sendall(data)
    finally:
        s.close()
