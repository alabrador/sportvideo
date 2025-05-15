import type { APIRoute } from "astro";
import mercadopago from "mercadopago";

export const POST: APIRoute = async ({ request }) => {
  const { predio, cancha, fecha, hora, email } = await request.json();

  const videoPath = `${predio}/${cancha}/${fecha}/${hora}.mp4`;

  const preference = await mercadopago.preferences.create({
    items: [
      {
        title: `Video partido ${predio} - ${cancha}`,
        quantity: 1,
        unit_price: 2.99,
      },
    ],
    payer: { email },
    back_urls: {
      success: `https://sportvideo.vercel.app/api/pago-exitoso`,
      pending: `https://sportvideo.vercel.app/pendiente`,
      failure: `https://sportvideo.vercel.app/error`,
    },
    auto_return: "approved",
    metadata: { videoPath, email },
  });

  return new Response(
    JSON.stringify({
      init_point: preference.body.init_point,
      preview_url: `/previews/${videoPath}`, // asumiendo un video corto de muestra
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
