import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import mercadopago from "mercadopago";
import { sendTelegramMessage } from "../../lib/telegram";

export const GET: APIRoute = async ({ url }) => {
  const payment_id = url.searchParams.get("payment_id");

  const payment = await mercadopago.payment.findById(Number(payment_id));
  const metadata = payment.body.metadata;
  const { videoPath, email } = metadata;

  const token = jwt.sign({ videoPath }, import.meta.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  const downloadLink = `https://tusitio.com/api/descargar?token=${token}`;

  await sendTelegramMessage(`✅ Pago recibido. Enlace de descarga: ${downloadLink}`);

  return new Response("¡Pago exitoso! Revisa tu correo y Telegram.");
};
