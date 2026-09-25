import QRCode from 'qrcode';

// CRC16-CCITT (0x1021) calculator for valid Brazilian PIX EMV code
function crc16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatEmvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export function generatePixPayload({
  key,
  receiverName,
  city,
  amount,
  txid = 'TIUBA',
}: {
  key: string;
  receiverName: string;
  city: string;
  amount: number;
  txid?: string;
}): string {
  // Normalize string inputs for EMV spec
  const cleanKey = key.replace(/[^a-zA-Z0-9@.+_-]/g, '');
  const cleanName = receiverName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .substring(0, 25)
    .toUpperCase();
  const cleanCity = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .substring(0, 15)
    .toUpperCase();
  const cleanAmount = amount.toFixed(2);
  const cleanTxid = txid.replace(/[^a-zA-Z0-9]/g, '').substring(0, 25) || 'TIUBA';

  // 26: Merchant Account Information - Pix
  const gui = formatEmvField('00', 'br.gov.bcb.pix');
  const chave = formatEmvField('01', cleanKey);
  const merchantAccountInfo = formatEmvField('26', `${gui}${chave}`);

  // 62: Additional Data Field Template
  const txidField = formatEmvField('05', cleanTxid);
  const additionalData = formatEmvField('62', txidField);

  let raw = '';
  raw += formatEmvField('00', '01'); // Payload Format Indicator
  raw += formatEmvField('01', '12'); // Dynamic / Static
  raw += merchantAccountInfo;
  raw += formatEmvField('52', '0000'); // Merchant Category Code
  raw += formatEmvField('53', '986'); // Transaction Currency (BRL)
  raw += formatEmvField('54', cleanAmount); // Transaction Amount
  raw += formatEmvField('58', 'BR'); // Country Code
  raw += formatEmvField('59', cleanName); // Merchant Name
  raw += formatEmvField('60', cleanCity); // Merchant City
  raw += additionalData;
  raw += '6304'; // CRC16 placeholder

  const checksum = crc16(raw);
  return `${raw}${checksum}`;
}

export async function generatePixQrCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      margin: 1,
      width: 320,
      color: {
        dark: '#090c0a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Error generating PIX QR Code:', err);
    return '';
  }
}

export function generateWhatsAppProofUrl({
  whatsappNumber,
  orderNumber,
  totalAmount,
  customerName,
}: {
  whatsappNumber: string;
  orderNumber: string;
  totalAmount: number;
  customerName: string;
}): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const message = `Olá Tiúba Reserve! 🌿🍯\n\nAcabei de efetuar o pagamento via PIX para o meu pedido *#${orderNumber}*.\n\n*Cliente:* ${customerName}\n*Valor Total:* R$ ${totalAmount.toFixed(2).replace('.', ',')}\n\nEstou anexando o comprovante de pagamento nesta mensagem para confirmação. Aguardo o envio dos meus méis! ✨`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateSommelierWhatsAppUrl({
  whatsappNumber,
  productName,
}: {
  whatsappNumber: string;
  productName?: string;
}): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  let message = `Olá Sommelier Tiúba Reserve! 🍯\n\nGostaria de uma consultoria personalizada sobre os méis raros de abelha Tiúba (Melipona fasciculata).`;
  if (productName) {
    message += ` Tenho dúvidas específicas sobre o *${productName}*. Pode me orientar na harmonização e escolha da safra?`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
