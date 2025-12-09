unit Unit1;

{$mode objfpc}{$H+}

interface

uses
  Windows, Classes, SysUtils, Forms, Controls, Graphics, LCLIntf, LCLType, Dialogs, StdCtrls,
  Winsock, LazUTF8, LConvEncoding, ctypes,
  libusb1;

type
  { TForm1 }

  TForm1 = class(TForm)
    // Botones (Puedes borrar visualmente los que no uses, pero deja estos en código)
    btnLAN: TButton;
    btnUSB: TButton;
    btnPractica: TButton; // <--- EL NUEVO BOTÓN IMPORTANTE

    // Eventos
    procedure btnCutClick(Sender: TObject);
    procedure btnLANClick(Sender: TObject);
    procedure btnUSBClick(Sender: TObject);
    procedure btnLogoClick(Sender: TObject);
    procedure btntestimgClick(Sender: TObject);
    procedure btnDeleteLogoClick(Sender: TObject);
    procedure btnPracticaClick(Sender: TObject); // <--- EVENTO DEL NUEVO BOTÓN

  private
    // Declaraciones de métodos privados (Para que se vean entre sí)
    procedure SendTCP(const Host: string; Port: Word; const Data: TBytes);
    procedure SendUSB(const Data: TBytes);
    function  GetImageBytes(FilePath: string): TBytes;
    procedure RunPracticaDemo(const SendType: string);
    procedure PrintAll(const SendType: string);
    procedure PrintBitmapDirect(FilePath: string);
    procedure StoreLogoNV(LogoID: Byte; FilePath: string);
  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}

{==============================================================================
  1. FUNCIONES DE AYUDA (HELPERS)
  Deben ir PRIMERO para que el resto del código las pueda usar.
==============================================================================}

function ToBytes(const Arr: array of Byte): TBytes;
var i: Integer;
begin
  SetLength(Result, Length(Arr));
  for i := 0 to High(Arr) do Result[i] := Arr[i];
end;

function ConcatBytes(const A, B: TBytes): TBytes;
begin
  SetLength(Result, Length(A) + Length(B));
  if Length(A) > 0 then Move(A[0], Result[0], Length(A));
  if Length(B) > 0 then Move(B[0], Result[Length(A)], Length(B));
end;

// Formatear Dinero (Ej: 2500 -> $2.500)
function FormatMoney(Amount: Double): string;
var FS: TFormatSettings;
begin
  FS := DefaultFormatSettings;
  FS.ThousandSeparator := '.';
  FS.DecimalSeparator := ',';
  Result := FormatFloat('$#,##0', Amount, FS);
end;

// Formatear Decimales (Ej: 10.23)
function FormatDec(Amount: Double): string;
var FS: TFormatSettings;
begin
  FS := DefaultFormatSettings;
  FS.DecimalSeparator := '.';
  Result := FormatFloat('0.00', Amount, FS);
end;

{==============================================================================
  2. FUNCIONES DE IMAGEN Y COMUNICACIÓN BASE
==============================================================================}

function TForm1.GetImageBytes(FilePath: string): TBytes;
var
  Bmp: TBitmap;
  X, Y: Integer;
  ByteVal: Byte;
  BitIndex, ImgWidthBytes: Integer;
  Header, ImgData: TBytes;
  PixelColor: TColor;
begin
  SetLength(Result, 0);
  if not FileExists(FilePath) then
  begin
    ShowMessage('Falta archivo: ' + FilePath);
    Exit;
  end;

  Bmp := TBitmap.Create;
  try
    Bmp.LoadFromFile(FilePath);
    Bmp.PixelFormat := pf24bit;
    ImgWidthBytes := (Bmp.Width + 7) div 8;

    SetLength(Header, 8);
    Header[0] := $1D; Header[1] := $76; Header[2] := $30; Header[3] := $00;
    Header[4] := ImgWidthBytes mod 256; Header[5] := ImgWidthBytes div 256;
    Header[6] := Bmp.Height mod 256; Header[7] := Bmp.Height div 256;

    SetLength(ImgData, ImgWidthBytes * Bmp.Height);
    FillChar(ImgData[0], Length(ImgData), 0);

    for Y := 0 to Bmp.Height - 1 do
    begin
      for X := 0 to ImgWidthBytes - 1 do
      begin
        ByteVal := 0;
        for BitIndex := 0 to 7 do
        begin
          if ((X * 8) + BitIndex) < Bmp.Width then
          begin
            PixelColor := Bmp.Canvas.Pixels[(X * 8) + BitIndex, Y];
            if (Red(PixelColor) < 128) and (Green(PixelColor) < 128) then
              ByteVal := ByteVal or (1 shl (7 - BitIndex));
          end;
        end;
        ImgData[(Y * ImgWidthBytes) + X] := ByteVal;
      end;
    end;
    Result := ConcatBytes(Header, ImgData);
  finally
    Bmp.Free;
  end;
end;

procedure TForm1.SendUSB(const Data: TBytes);
var
  ctx: plibusb_context;
  DevHandle: plibusb_device_handle;
  r, transferred: Integer;
const
  MY_VID = $1FC9; MY_PID = $2016; MY_EP = $03;
begin
  ctx := nil; DevHandle := nil; transferred := 0;
  r := libusb_init(@ctx);
  if r < 0 then begin ShowMessage('Err Init USB'); Exit; end;

  try
    DevHandle := libusb_open_device_with_vid_pid(ctx, MY_VID, MY_PID);
    if DevHandle = nil then begin ShowMessage('Impresora no encontrada (USB)'); Exit; end;
    try
      r := libusb_claim_interface(DevHandle, 0);
      if Length(Data) > 0 then
        libusb_bulk_transfer(DevHandle, MY_EP, @Data[0], Length(Data), transferred, 5000);
      libusb_release_interface(DevHandle, 0);
    finally
      libusb_close(DevHandle);
    end;
  finally
    libusb_exit(ctx);
  end;
end;

procedure TForm1.SendTCP(const Host: string; Port: Word; const Data: TBytes);
var
  WSA: WSAData;
  Sock: TSocket;
  Addr: TSockAddrIn;
begin
  if WSAStartup($0202, WSA) <> 0 then Exit;
  try
    Sock := socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if Sock <> INVALID_SOCKET then
    begin
      Addr.sin_family := AF_INET;
      Addr.sin_port   := htons(Port);
      Addr.sin_addr.S_addr := inet_addr(PAnsiChar(AnsiString(Host)));
      if connect(Sock, Addr, SizeOf(Addr)) = 0 then
        send(Sock, Data[0], Length(Data), 0);
      closesocket(Sock);
    end;
  finally
    WSACleanup;
  end;
end;

{==============================================================================
  3. LÓGICA PRINCIPAL (TU TAREA DE PRÁCTICA)
  Aquí ya se reconocen todas las funciones de arriba.
==============================================================================}

procedure TForm1.RunPracticaDemo(const SendType: string);
const
  ESC = 27; GS = 29; FS = 28;
var
  Buffer: TBytes;

  procedure AddCmd(const A: array of Byte);
  begin
    Buffer := ConcatBytes(Buffer, ToBytes(A));
  end;

  procedure AddText(S: string);
  var Raw: string; Tmp: TBytes;
  begin
    Raw := UTF8ToCP1252(S);
    SetLength(Tmp, Length(Raw));
    if Length(Raw)>0 then Move(Raw[1], Tmp[0], Length(Raw));
    Buffer := ConcatBytes(Buffer, Tmp);
  end;

  procedure AddLine(S: string);
  begin
    AddText(S + LineEnding);
  end;

begin
  SetLength(Buffer, 0);

  // 1. INICIALIZACIÓN
  AddCmd([$1B, $40]);
  AddCmd([ESC, $74, $10]);

  // 2. HEADER CON LOGO
  AddCmd([ESC, $61, 1]); // Centrar

  // Intenta poner el logo (si existe el archivo)
  Buffer := ConcatBytes(Buffer, GetImageBytes('logo2.bmp'));

  AddLine('');

  // 3. TEXTOS
  AddCmd([ESC, $61, 0]); // Izquierda
  AddLine('1. TEXTO NORMAL: Prueba estandar.');
  AddLine('');

  // Negrita
  AddCmd([ESC, $45, 1]);
  AddLine('2. TEXTO EN NEGRITA: BOLD ON');
  AddCmd([ESC, $45, 0]);
  AddLine('');

  // Subrayado
  AddCmd([ESC, $2D, 1]);
  AddLine('3. TEXTO SUBRAYADO');
  AddCmd([ESC, $2D, 0]);
  AddLine('');

  // Inverso
  AddCmd([GS, $42, 1]);
  AddLine('4. TEXTO INVERSO (RESALTADO)');
  AddCmd([GS, $42, 0]);
  AddLine('');

  // 4. TAMAÑOS
  AddLine('5. TAMANOS:');
  AddCmd([GS, $21, $10]); AddLine('Doble Ancho');
  AddCmd([GS, $21, $01]); AddLine('Doble Alto');
  AddCmd([GS, $21, $11]); AddLine('GIGANTE');
  AddCmd([GS, $21, $00]); // Reset
  AddLine('');

  // 5. FORMATO NÚMEROS (Aquí usamos las funciones Helper)
  AddLine('6. NUMEROS:');
  AddLine('Decimal: ' + FormatDec(10.23));
  AddLine('Pesos: ' + FormatMoney(2500));
  AddLine('');

  // 6. POSICIONAMIENTO
  AddCmd([ESC, $24, 160, 0]);
  AddLine('7. TEXTO MOVIDO AL CENTRO');
  AddLine('');

  // 7. CÓDIGO DE BARRAS
  AddLine('8. BARCODE:');
  AddCmd([GS, $6B, 4, 10, 49, 50, 51, 52, 53, 65, 66, 67, 48, 0]);
  AddLine('   12345ABC0');

  // FIN
  AddLine('');
  AddLine('--- FIN DEMO ---');
  AddCmd([$1D, $56, $42, 0]); // Corte

  if SendType = 'LAN' then
    SendTCP('192.168.1.169', 9100, Buffer)
  else
    SendUSB(Buffer);
end;

{==============================================================================
  4. EVENTOS DE BOTONES
==============================================================================}

// BOTÓN NUEVO: "DEMO PRACTICA"
procedure TForm1.btnPracticaClick(Sender: TObject);
begin
  // Elige aquí por dónde quieres mandar la demo
  RunPracticaDemo('USB');
end;

// Botones Antiguos (Reciclados)
procedure TForm1.btnUSBClick(Sender: TObject);
begin
  RunPracticaDemo('USB');
end;

procedure TForm1.btnLANClick(Sender: TObject);
begin
  RunPracticaDemo('LAN');
end;

procedure TForm1.btnCutClick(Sender: TObject);
begin
  SendUSB(ToBytes([$1D, $56, $42, $00]));
end;

procedure TForm1.btnLogoClick(Sender: TObject);
var Total: TBytes;
begin
   // Imprimir solo logo rápido
   Total := ConcatBytes(ToBytes([$1B, $40, $1B, $61, 1]), GetImageBytes('logo2.bmp'));
   Total := ConcatBytes(Total, ToBytes([$1B, $64, 5, $1D, $56, $42, 0]));
   SendUSB(Total);
end;

// Métodos Legacy (Vacíos o de relleno)
procedure TForm1.PrintAll(const SendType: string); begin end;
procedure TForm1.PrintBitmapDirect(FilePath: string); begin end;
procedure TForm1.StoreLogoNV(LogoID: Byte; FilePath: string);
// Copia aquí el código antiguo de StoreLogoNV si alguna vez lo necesitas
begin end;
procedure TForm1.btntestimgClick(Sender: TObject); begin end;
procedure TForm1.btnDeleteLogoClick(Sender: TObject); begin end;

end.
