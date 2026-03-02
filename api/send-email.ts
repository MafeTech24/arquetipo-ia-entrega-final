import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS para desarrollo local
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, arquetipo } = req.body;

  if (!email || !arquetipo) {
    return res.status(400).json({ error: "Faltan datos: email y arquetipo son requeridos" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY no configurada en el servidor" });
  }

  // SUPUESTO: el dominio de envío es onboarding@resend.dev (dominio de prueba gratuito de Resend)
  // DECISIÓN POSTERGADA: configurar dominio propio para enviar a cualquier email cuando escale
  // HACK: en plan gratuito de Resend solo se puede enviar al email del owner de la cuenta.
  // Por eso enviamos siempre a mafe4024@gmail.com como notificación interna de nuevo arquetipo generado.
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ArquetipoIA <onboarding@resend.dev>",
      to: ["mafe4024@gmail.com"],
      subject: `Nuevo arquetipo generado: ${arquetipo.nombre} (solicitado por ${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A14; color: #f0eeff; padding: 32px; border-radius: 12px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7C3AED; font-size: 24px; margin: 0;">✦ ArquetipoIA</h1>
            <p style="color: #9b8ec4; margin: 8px 0 0;">Tu Arquetipo de Cliente está listo</p>
          </div>

          <!-- Nombre y datos básicos -->
          <div style="background: #16102e; border: 1px solid #2e2060; border-radius: 8px; padding: 24px; margin-bottom: 16px; text-align: center;">
            <div style="width: 60px; height: 60px; background: #7C3AED; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 20px; font-weight: bold;">
                ${(arquetipo.nombre || "").split(" ").map((n: string) => n[0]).join("").toUpperCase()}
              </span>
            </div>
            <h2 style="color: #F0EEFF; font-size: 28px; margin: 0 0 8px;">${arquetipo.nombre}</h2>
            <p style="color: #9b8ec4; margin: 0;">${arquetipo.ocupacion} • ${arquetipo.residencia} • ${arquetipo.edad} años</p>
          </div>

          <!-- Perfil -->
          <div style="background: #16102e; border: 1px solid #2e2060; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="color: #7C3AED; margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">👤 Perfil</h3>
            ${row("Nivel educativo", arquetipo.nivel_educativo)}
            ${row("Estado civil", arquetipo.estado_civil)}
            ${row("Modalidad laboral", arquetipo.modalidad_laboral)}
            ${row("Nivel socioeconómico", arquetipo.nivel_socioeconomico)}
          </div>

          <!-- Preferencias -->
          <div style="background: #16102e; border: 1px solid #2e2060; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="color: #7C3AED; margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">❤️ Preferencias</h3>
            ${row("Pasatiempos", arquetipo.pasatiempos)}
            ${row("Contenido digital", arquetipo.contenido_digital)}
            ${row("Temas sociales", arquetipo.temas_sociales)}
            ${row("Busca en una marca", arquetipo.que_busca_en_marca)}
          </div>

          <!-- Hábitos Sociales -->
          <div style="background: #16102e; border: 1px solid #2e2060; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="color: #7C3AED; margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">📱 Hábitos Sociales</h3>
            ${row("Redes", Array.isArray(arquetipo.redes) ? arquetipo.redes.join(", ") : arquetipo.redes)}
            ${row("Frecuencia", arquetipo.frecuencia)}
            ${row("Influencers", arquetipo.influencers)}
            ${row("E-commerce", arquetipo.ecommerce)}
          </div>

          <!-- Factores Psicológicos -->
          <div style="background: #16102e; border: 1px solid #2e2060; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
            <h3 style="color: #7C3AED; margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">🧠 Factores Psicológicos</h3>
            ${row("Busca en servicio", arquetipo.busca_en_servicio)}
            ${row("Sentimientos", arquetipo.sentimientos)}
            ${row("Evita", arquetipo.evita)}
            ${row("Valores", arquetipo.valores)}
            ${row("Miedos", arquetipo.miedos)}
            ${row("Deseos", arquetipo.deseos)}
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #2e2060; padding-top: 24px;">
            <p style="color: #4a3d80; font-size: 12px; margin: 0;">
              Generado con ArquetipoIA · Herramienta para freelancers y consultores
            </p>
          </div>
        </div>
      `,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Resend error:", data);
    return res.status(500).json({ error: "Error al enviar el email", details: data });
  }

  return res.status(200).json({ success: true, id: data.id });
}

// Helper para filas del email
function row(label: string, value: string) {
  return `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2e2060;">
      <span style="color: #7a6fa0; font-size: 13px; min-width: 140px;">${label}</span>
      <span style="color: #e2daf7; font-size: 13px; text-align: right;">${value || "—"}</span>
    </div>
  `;
}