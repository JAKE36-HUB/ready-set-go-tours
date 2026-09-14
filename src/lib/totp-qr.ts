import QRCode from "qrcode"

const ISSUER = "Ready Set Go Safari"

export async function generateAuthenticatorQr(secret: string, email?: string): Promise<string> {
  const account = email ?? "admin"
  const uri = `otpauth://totp/${encodeURIComponent(ISSUER)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=6&period=30`
  return QRCode.toDataURL(uri, { width: 512, margin: 1, errorCorrectionLevel: "M" })
}