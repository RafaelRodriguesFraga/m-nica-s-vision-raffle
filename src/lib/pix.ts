function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function generatePixPayload(
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  amount: number,
  transactionId: string = "***"
): string {
  const formatLen = (id: string, value: string) => {
    const len = value.length.toString().padStart(2, "0");
    return `${id}${len}${value}`;
  };

  const safeName = removeAccents(merchantName).substring(0, 25).toUpperCase();
  const safeCity = removeAccents(merchantCity).substring(0, 15).toUpperCase();
  const safeTxId = removeAccents(transactionId).replace(/[^a-zA-Z0-9]/g, "").substring(0, 25) || "***";

  const payloadKey = formatLen("00", "BR.GOV.BCB.PIX") + formatLen("01", pixKey);
  const accountInfo = formatLen("26", payloadKey);
  const merchantCat = formatLen("52", "0000");
  const currency = formatLen("53", "986");
  const amountStr = formatLen("54", amount.toFixed(2));
  const country = formatLen("58", "BR");
  const name = formatLen("59", safeName);
  const city = formatLen("60", safeCity);
  const txIdField = formatLen("62", formatLen("05", safeTxId));

  const payload = [
    formatLen("00", "01"),
    accountInfo,
    merchantCat,
    currency,
    amountStr,
    country,
    name,
    city,
    txIdField,
    "6304", // Prefixo do CRC16
  ].join("");

  return payload + crc16(payload);
}