// HACK: en desarrollo usamos la URL relativa /api/send-email que Vercel
// resuelve automáticamente. En local necesitás correr `vercel dev` para
// que las funciones serverless estén disponibles.

export const sendArquetipoEmail = async (
  email: string,
  arquetipo: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, arquetipo }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Error desconocido" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error enviando email:", error);
    return { success: false, error: "No se pudo conectar con el servidor" };
  }
};