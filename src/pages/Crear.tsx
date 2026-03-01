import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import FormField from "@/components/FormField";
import CheckboxGroup from "@/components/CheckboxGroup";
import { ArquetipoData, emptyArquetipo } from "@/types/arquetipo";
import { toast } from "sonner";
import posthog from "posthog-js";
import { sendArquetipoEmail } from "@/lib/email";

const stepLabels = ["Perfil", "Preferencias", "Hábitos", "Psicología"];

const Crear = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ArquetipoData>(emptyArquetipo);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof ArquetipoData>(key: K, value: ArquetipoData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const stepNames = ["perfil", "preferencias", "habitos", "psicologia"];

  const next = () => {
    if (step < 4) {
      posthog.capture("wizard_step_completed", {
        step,
        step_name: stepNames[step - 1],
      });
      setStep(step + 1);
    }
  };

  const prev = () => step > 1 && setStep(step - 1);

  const generateArchetype = async () => {
    posthog.capture("arquetipo_generation_started", {
      fields_filled: Object.values(data).filter((v) =>
        Array.isArray(v) ? v.length > 0 : v !== ""
      ).length,
      has_email: !!email,
    });

    setLoading(true);
    const startTime = Date.now();
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === "INSERT_YOUR_GEMINI_API_KEY_HERE") {
      toast.error("API Key de Gemini no configurada en .env");
      setLoading(false);
      return;
    }

    const systemPrompt = "Sos un experto en marketing digital. Con los datos del formulario generá un arquetipo de cliente completo. Respondé SOLO con JSON válido, sin markdown, sin explicaciones, con estos campos: nombre, edad, residencia, ocupacion, nivel_educativo, estado_civil, modalidad_laboral, nivel_socioeconomico, pasatiempos, contenido_digital, temas_sociales, que_busca_en_marca, redes, frecuencia, influencers, ecommerce, busca_en_servicio, sentimientos, evita, valores, miedos, deseos.";

    const userPrompt = `Datos del formulario:
    - Nombre sugerido: ${data.nombre}
    - Edad: ${data.edad}
    - Residencia: ${data.residencia}
    - Ocupación: ${data.ocupacion}
    - Nivel educativo: ${data.nivel_educativo}
    - Estado civil: ${data.estado_civil}
    - Modalidad laboral: ${data.modalidad_laboral}
    - Nivel socioeconómico: ${data.nivel_socioeconomico}
    - Pasatiempos: ${data.pasatiempos}
    - Costumbres: ${data.costumbres}
    - Contenido digital: ${data.contenido_digital}
    - Temas sociales: ${data.temas_sociales}
    - Lo que busca en una marca: ${data.que_busca_en_marca}
    - Redes: ${data.redes.join(", ")}
    - Frecuencia: ${data.frecuencia}
    - Participación: ${data.participacion}
    - Influencers: ${data.influencers}
    - E-commerce: ${data.ecommerce}
    - Busca en servicio: ${data.busca_en_servicio}
    - Sentimientos: ${data.sentimientos}
    - Evita: ${data.evita}
    - Valores: ${data.valores}
    - Miedos: ${data.miedos}
    - Deseos: ${data.deseos}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          }),
        }
      );

      if (!response.ok) throw new Error("Error en la respuesta de Gemini");

      const result = await response.json();
      const textResponse = result.candidates[0].content.parts[0].text;
      const jsonText = textResponse.replace(/```json|```/g, "").trim();
      const archetypeResult = JSON.parse(jsonText);

      posthog.capture("arquetipo_generated_successfully", {
        generation_time_ms: Date.now() - startTime,
        nombre: archetypeResult.nombre,
      });

      // ANALYTICS + EMAIL: si el usuario dejó su email, enviamos el arquetipo
      if (email) {
        const emailResult = await sendArquetipoEmail(email, archetypeResult);
        if (emailResult.success) {
          posthog.capture("arquetipo_email_sent", { nombre: archetypeResult.nombre });
          toast.success("¡Arquetipo enviado a tu email!");
        } else {
          // Fail silencioso — el producto sigue funcionando aunque falle el email
          console.warn("Email no enviado:", emailResult.error);
          posthog.capture("arquetipo_email_failed", { error: emailResult.error });
        }
      }

      navigate("/resultado", { state: archetypeResult });
    } catch (error) {
      console.error("Gemini Error:", error);
      posthog.capture("arquetipo_generation_failed", {
        error_message: error instanceof Error ? error.message : "unknown",
        generation_time_ms: Date.now() - startTime,
      });
      toast.error("Hubo un error, intentá de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          disabled={loading}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground">ArquetipoIA</span>
        </div>
      </nav>

      <main className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <ProgressBar currentStep={step} totalSteps={4} labels={stepLabels} />

        <div className="glass-card p-6 md:p-8 animate-fade-in-up">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {step === 1 && "Perfil básico"}
            {step === 2 && "Preferencias y hábitos"}
            {step === 3 && "Hábitos sociales"}
            {step === 4 && "Factores psicológicos"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {step === 1 && (
              <>
                <FormField label="Nombre y apellido" value={data.nombre} onChange={(v) => update("nombre", v)} placeholder="Ej: Laura Torres" />
                <FormField label="Edad" value={data.edad} onChange={(v) => update("edad", v)} placeholder="Ej: 35" />
                <FormField label="Residencia" value={data.residencia} onChange={(v) => update("residencia", v)} placeholder="Ej: Córdoba Capital" />
                <FormField label="Ocupación" value={data.ocupacion} onChange={(v) => update("ocupacion", v)} placeholder="Ej: Dueña de negocio" />
                <FormField label="Nivel educativo" value={data.nivel_educativo} onChange={(v) => update("nivel_educativo", v)} type="select" options={["Primario", "Secundario completo", "Terciario", "Universitario", "Posgrado"]} />
                <FormField label="Estado civil" value={data.estado_civil} onChange={(v) => update("estado_civil", v)} type="select" options={["Soltero/a", "En pareja", "Casado/a", "Divorciado/a", "Viudo/a"]} />
                <FormField label="Modalidad laboral" value={data.modalidad_laboral} onChange={(v) => update("modalidad_laboral", v)} type="select" options={["Relación de dependencia", "Independiente", "Freelancer", "Desempleado/a", "Estudiante"]} />
                <FormField label="Nivel socioeconómico" value={data.nivel_socioeconomico} onChange={(v) => update("nivel_socioeconomico", v)} type="select" options={["Bajo", "Medio-bajo", "Medio", "Medio-alto", "Alto"]} />

                {/* EMAIL: campo opcional para recibir el arquetipo por correo */}
                <div className="md:col-span-2">
                  <FormField
                    label="Tu email (opcional)"
                    value={email}
                    onChange={setEmail}
                    placeholder="Recibí tu arquetipo en tu correo"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5 ml-0.5">
                    Si completás este campo, te enviamos el arquetipo generado a tu email.
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="md:col-span-2">
                  <FormField label="Pasatiempos" value={data.pasatiempos} onChange={(v) => update("pasatiempos", v)} type="textarea" placeholder="¿Qué hace en su tiempo libre?" />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Costumbres" value={data.costumbres} onChange={(v) => update("costumbres", v)} type="textarea" placeholder="Rutinas y hábitos diarios" />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Contenido digital que consume" value={data.contenido_digital} onChange={(v) => update("contenido_digital", v)} type="textarea" placeholder="Tipo de contenido que prefiere" />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Temas sociales que le interesan" value={data.temas_sociales} onChange={(v) => update("temas_sociales", v)} placeholder="Ej: Emprendimiento, bienestar" />
                </div>
                <div className="md:col-span-2">
                  <FormField label="¿Qué busca en una marca o empresa?" value={data.que_busca_en_marca} onChange={(v) => update("que_busca_en_marca", v)} type="textarea" placeholder="Confianza, cercanía, resultados..." />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="md:col-span-2">
                  <CheckboxGroup
                    label="Redes y sitios que usa"
                    options={["Instagram", "Facebook", "TikTok", "LinkedIn", "X", "YouTube"]}
                    selected={data.redes}
                    onChange={(v) => update("redes", v)}
                  />
                </div>
                <FormField label="Frecuencia de uso" value={data.frecuencia} onChange={(v) => update("frecuencia", v)} type="select" options={["Varias veces al día", "Una vez al día", "Algunos días por semana", "Pocas veces al mes"]} />
                <FormField label="¿Cómo participa?" value={data.participacion} onChange={(v) => update("participacion", v)} placeholder="Ej: Comenta, da likes, comparte" />
                <div className="md:col-span-2">
                  <FormField label="Cuentas o influencers que sigue" value={data.influencers} onChange={(v) => update("influencers", v)} placeholder="Ej: Coaches de negocios, emprendedoras" />
                </div>
                <div className="md:col-span-2">
                  <FormField label="¿Le interesa el comercio electrónico?" value={data.ecommerce} onChange={(v) => update("ecommerce", v)} placeholder="Ej: Compra por Instagram y Mercado Libre" />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="md:col-span-2">
                  <FormField label="¿Qué busca en un producto/servicio digital?" value={data.busca_en_servicio} onChange={(v) => update("busca_en_servicio", v)} type="textarea" placeholder="Simplicidad, resultados rápidos..." />
                </div>
                <div className="md:col-span-2">
                  <FormField label="¿Qué sentimientos desea sentir?" value={data.sentimientos} onChange={(v) => update("sentimientos", v)} placeholder="Seguridad, orgullo, pertenencia..." />
                </div>
                <div className="md:col-span-2">
                  <FormField label="¿Qué experiencias evita en redes?" value={data.evita} onChange={(v) => update("evita", v)} placeholder="Contenido técnico, agresivo..." />
                </div>
                <FormField label="Valores" value={data.valores} onChange={(v) => update("valores", v)} placeholder="Familia, esfuerzo, autenticidad..." />
                <FormField label="Miedos" value={data.miedos} onChange={(v) => update("miedos", v)} placeholder="Perder dinero, fracasar..." />
                <div className="md:col-span-2">
                  <FormField label="Deseos" value={data.deseos} onChange={(v) => update("deseos", v)} type="textarea" placeholder="¿Qué quiere lograr?" />
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
            <button
              onClick={prev}
              disabled={step === 1 || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            {step < 4 ? (
              <button
                onClick={next}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={generateArchetype}
                disabled={loading}
                className="flex items-center gap-2 gradient-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando tu arquetipo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar Arquetipo con IA
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Crear;
