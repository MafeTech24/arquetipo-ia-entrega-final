import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Copy, Plus, Sparkles, User, Heart, Share2, Brain, Download } from "lucide-react";
import { mockResultado, ArquetipoData } from "@/types/arquetipo";
import { toast } from "sonner";
import jsPDF from "jspdf";
import posthog from "posthog-js";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

const SectionCard = ({ icon, title, children, delay = 0 }: SectionCardProps) => (
  <div
    className="glass-card p-6 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
  >
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

// Normaliza cualquier valor (string, array, number, undefined) a texto seguro
const safeValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

const DataRow = ({ label, value }: { label: string; value: unknown }) => (
  <div className="py-2.5 border-b border-border/30 last:border-0 flex flex-col sm:flex-row sm:items-start gap-1">
    <span className="text-sm text-muted-foreground shrink-0 sm:w-44">{label}</span>
    <span className="text-sm text-foreground">{safeValue(value)}</span>
  </div>
);

// Normaliza el arquetipo devuelto por Gemini al formato ArquetipoData esperado
const normalizeData = (raw: Record<string, unknown>): ArquetipoData => {
  const redes = raw.redes;
  const redesNormalized: string[] = Array.isArray(redes)
    ? redes.map(String)
    : typeof redes === "string"
    ? redes.split(",").map((r) => r.trim()).filter(Boolean)
    : [];

  return {
    nombre: String(raw.nombre || ""),
    edad: String(raw.edad || ""),
    residencia: String(raw.residencia || ""),
    ocupacion: String(raw.ocupacion || ""),
    nivel_educativo: String(raw.nivel_educativo || ""),
    estado_civil: String(raw.estado_civil || ""),
    modalidad_laboral: String(raw.modalidad_laboral || ""),
    nivel_socioeconomico: String(raw.nivel_socioeconomico || ""),
    pasatiempos: String(raw.pasatiempos || ""),
    costumbres: String(raw.costumbres || ""),
    contenido_digital: String(raw.contenido_digital || ""),
    temas_sociales: String(raw.temas_sociales || ""),
    que_busca_en_marca: String(raw.que_busca_en_marca || ""),
    redes: redesNormalized,
    frecuencia: String(raw.frecuencia || ""),
    participacion: String(raw.participacion || ""),
    influencers: String(raw.influencers || ""),
    ecommerce: String(raw.ecommerce || ""),
    busca_en_servicio: String(raw.busca_en_servicio || ""),
    sentimientos: String(raw.sentimientos || ""),
    evita: String(raw.evita || ""),
    valores: String(raw.valores || ""),
    miedos: String(raw.miedos || ""),
    deseos: String(raw.deseos || ""),
  };
};

const Resultado = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rawState = location.state as Record<string, unknown> | null;

  // Debug: ver exactamente qué llega desde Gemini en la consola del navegador
  useEffect(() => {
    console.log("[Resultado] location.state recibido:", rawState);
  }, [rawState]);

  const d: ArquetipoData = rawState ? normalizeData(rawState) : mockResultado;

  useEffect(() => {
    if (!rawState) {
      toast.info("Mostrando datos de ejemplo. Generá tu arquetipo en el paso 4.");
    }
  }, [rawState]);

  const initials = (d.nombre || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const copyJSON = async () => {
    const jsonStr = JSON.stringify(d, null, 2);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonStr);
      } else {
        // Fallback para entornos HTTP (desarrollo local sin HTTPS)
        const textarea = document.createElement("textarea");
        textarea.value = jsonStr;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("JSON copiado al portapapeles ✓");
      // ANALYTICS: métrica de retención — quien copia el JSON encontró valor real
      posthog.capture("json_copied", { nombre: d.nombre });
    } catch (err) {
      console.error("Error al copiar:", err);
      toast.error("No se pudo copiar. Intentá de nuevo.");
    }
  };

  const downloadPDF = () => {
    const toastId = toast.loading("Generando PDF profesional...");

    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210; // A4 width mm
      const margin = 16;
      const colW = (W - margin * 2 - 8) / 2;

      // ── Helpers ──────────────────────────────────────────────
      const hex = (h: string) => {
        const r = parseInt(h.slice(1, 3), 16);
        const g = parseInt(h.slice(3, 5), 16);
        const b = parseInt(h.slice(5, 7), 16);
        return [r, g, b] as [number, number, number];
      };

      const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
        pdf.setFontSize(fontSize);
        return pdf.splitTextToSize(text || "—", maxWidth);
      };

      // ── Background ───────────────────────────────────────────
      pdf.setFillColor(...hex("#0A0A14"));
      pdf.rect(0, 0, 210, 297, "F");

      // ── Header band ──────────────────────────────────────────
      pdf.setFillColor(...hex("#1a133a"));
      pdf.roundedRect(margin, 10, W - margin * 2, 52, 4, 4, "F");

      // Avatar circle
      pdf.setFillColor(...hex("#7C3AED"));
      pdf.circle(W / 2, 30, 10, "F");
      pdf.setTextColor(...hex("#FFFFFF"));
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(initials, W / 2, 33.5, { align: "center" });

      // Name
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...hex("#F0EEFF"));
      pdf.text(d.nombre || "", W / 2, 50, { align: "center" });

      // Subtitle
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...hex("#9b8ec4"));
      const subtitle = [d.ocupacion, d.residencia, `${d.edad} años`].filter(Boolean).join("  •  ");
      pdf.text(subtitle, W / 2, 57, { align: "center" });

      // ── Card draw helper ─────────────────────────────────────
      type Field = { label: string; value: unknown };

      // Pre-calculates the natural height of a card WITHOUT drawing it
      const calcCardH = (w: number, fields: Field[]): number => {
        const lineH = 7;
        const innerPad = 5;
        let totalLines = 0;
        fields.forEach((f) => {
          const val = safeValue(f.value);
          totalLines += wrapText(val, w - innerPad * 2 - 28, 8).length;
        });
        return 12 + fields.length * lineH + totalLines * 1.5 + innerPad * 2;
      };

      // Draws a card; if fixedH is provided the container uses that height
      const drawCard = (x: number, y: number, w: number, title: string, fields: Field[], fixedH?: number): number => {
        const lineH = 7;
        const innerPad = 5;
        const cardH = fixedH ?? calcCardH(w, fields);

        // Card bg
        pdf.setFillColor(...hex("#16102e"));
        pdf.roundedRect(x, y, w, cardH, 3, 3, "F");
        // Card border
        pdf.setDrawColor(...hex("#2e2060"));
        pdf.setLineWidth(0.3);
        pdf.roundedRect(x, y, w, cardH, 3, 3, "S");

        // Title accent bar
        pdf.setFillColor(...hex("#7C3AED"));
        pdf.roundedRect(x + innerPad, y + innerPad, 2.5, 6, 1, 1, "F");

        // Title text
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(...hex("#D4C8FF"));
        pdf.text(title, x + innerPad + 5, y + innerPad + 5.5);

        // Divider
        pdf.setDrawColor(...hex("#2e2060"));
        pdf.setLineWidth(0.2);
        pdf.line(x + innerPad, y + innerPad + 9, x + w - innerPad, y + innerPad + 9);

        // Fields
        let curY = y + innerPad + 14;
        fields.forEach((f) => {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7.5);
          pdf.setTextColor(...hex("#7a6fa0"));
          pdf.text(f.label, x + innerPad, curY);

          const val = safeValue(f.value);
          const lines = wrapText(val, w - innerPad * 2 - 30, 8);
          pdf.setTextColor(...hex("#e2daf7"));
          pdf.setFontSize(8);
          pdf.text(lines, x + innerPad + 30, curY);
          curY += lineH + (lines.length - 1) * 3.5;
        });

        return cardH;
      };

      // ── Cards layout — equal height per row ──────────────────
      const startY = 70;
      const gap = 6;
      const col1x = margin;
      const col2x = margin + colW + 8;

      // Row 1 fields
      const row1Fields1: Field[] = [
        { label: "Educación", value: d.nivel_educativo },
        { label: "Estado civil", value: d.estado_civil },
        { label: "Modalidad", value: d.modalidad_laboral },
        { label: "Nivel socioec.", value: d.nivel_socioeconomico },
      ];
      const row1Fields2: Field[] = [
        { label: "Pasatiempos", value: d.pasatiempos },
        { label: "Contenido", value: d.contenido_digital },
        { label: "Temas", value: d.temas_sociales },
        { label: "Busca en marca", value: d.que_busca_en_marca },
      ];
      const row1H = Math.max(calcCardH(colW, row1Fields1), calcCardH(colW, row1Fields2));
      drawCard(col1x, startY, colW, "Perfil", row1Fields1, row1H);
      drawCard(col2x, startY, colW, "Preferencias", row1Fields2, row1H);

      // Row 2 fields
      const row2Y = startY + row1H + gap;
      const row2Fields1: Field[] = [
        { label: "Redes", value: d.redes },
        { label: "Frecuencia", value: d.frecuencia },
        { label: "Influencers", value: d.influencers },
        { label: "E-commerce", value: d.ecommerce },
      ];
      const row2Fields2: Field[] = [
        { label: "Busca en serv.", value: d.busca_en_servicio },
        { label: "Sentimientos", value: d.sentimientos },
        { label: "Evita", value: d.evita },
        { label: "Valores", value: d.valores },
        { label: "Miedos", value: d.miedos },
        { label: "Deseos", value: d.deseos },
      ];
      const row2H = Math.max(calcCardH(colW, row2Fields1), calcCardH(colW, row2Fields2));
      drawCard(col1x, row2Y, colW, "Hábitos Sociales", row2Fields1, row2H);
      drawCard(col2x, row2Y, colW, "Factores Psicológicos", row2Fields2, row2H);

      // Footer
      const footerY = row2Y + row2H + 8;
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(7);
      pdf.setTextColor(...hex("#4a3d80"));
      pdf.text("Generado con ArquetipoIA · arquetipo-ia.vercel.app", W / 2, footerY, { align: "center" });

      pdf.save(`Arquetipo-${(d.nombre || "resultado").replace(/\s+/g, "-")}.pdf`);
      toast.dismiss(toastId);
      toast.success("¡PDF descargado con éxito!");
      // ANALYTICS: descarga de PDF — señal de intención de uso profesional (Pro feature)
      posthog.capture("pdf_downloaded", { nombre: d.nombre });
    } catch (error) {
      console.error("PDF error:", error);
      toast.dismiss(toastId);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground">ArquetipoIA</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={copyJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <Copy className="w-4 h-4" />
            <span>Copiar JSON</span>
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-foreground border border-border hover:bg-secondary/80 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
          <button
            onClick={() => navigate("/crear")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>
      </nav>

      <main className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up pt-8">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mx-auto mb-6 shadow-[0_0_40px_-5px_hsl(var(--primary)/0.4)]">
            {initials}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {d.nombre}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-lg text-muted-foreground">
            <span>{d.ocupacion}</span>
            <span className="text-primary/40 hidden sm:inline">•</span>
            <span>{d.residencia}</span>
            <span className="text-primary/40 hidden sm:inline">•</span>
            <span>{d.edad} años</span>
          </div>
        </div>

        {/* Cards — 4 secciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard icon={<User className="w-4 h-4 text-primary" />} title="Perfil" delay={100}>
            <DataRow label="Nivel educativo" value={d.nivel_educativo} />
            <DataRow label="Estado civil" value={d.estado_civil} />
            <DataRow label="Modalidad laboral" value={d.modalidad_laboral} />
            <DataRow label="Nivel socioeconómico" value={d.nivel_socioeconomico} />
          </SectionCard>

          <SectionCard icon={<Heart className="w-4 h-4 text-primary" />} title="Preferencias" delay={200}>
            <DataRow label="Pasatiempos" value={d.pasatiempos} />
            <DataRow label="Contenido digital" value={d.contenido_digital} />
            <DataRow label="Temas sociales" value={d.temas_sociales} />
            <DataRow label="Busca en una marca" value={d.que_busca_en_marca} />
          </SectionCard>

          <SectionCard icon={<Share2 className="w-4 h-4 text-primary" />} title="Hábitos Sociales" delay={300}>
            <DataRow label="Redes" value={d.redes} />
            <DataRow label="Frecuencia" value={d.frecuencia} />
            <DataRow label="Influencers" value={d.influencers} />
            <DataRow label="E-commerce" value={d.ecommerce} />
          </SectionCard>

          <SectionCard icon={<Brain className="w-4 h-4 text-primary" />} title="Factores Psicológicos" delay={400}>
            <DataRow label="Busca en servicio" value={d.busca_en_servicio} />
            <DataRow label="Sentimientos" value={d.sentimientos} />
            <DataRow label="Evita" value={d.evita} />
            <DataRow label="Valores" value={d.valores} />
            <DataRow label="Miedos" value={d.miedos} />
            <DataRow label="Deseos" value={d.deseos} />
          </SectionCard>
        </div>
      </main>
    </div>
  );
};

export default Resultado;
