import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Clock, Target } from "lucide-react";
import posthog from "posthog-js";

const features = [
  {
    icon: Zap,
    title: "Potenciado por IA",
    description: "Generación inteligente basada en datos reales de mercado.",
  },
  {
    icon: Clock,
    title: "En 5 minutos",
    description: "Completá un formulario simple y obtené tu arquetipo al instante.",
  },
  {
    icon: Target,
    title: "Resultados profesionales",
    description: "Arquetipos listos para usar en tu estrategia de marketing.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">ArquetipoIA</span>
        </div>
        <button
          onClick={() => {
            // ANALYTICS: CTA secundario del nav — mide intención temprana
            posthog.capture("cta_empezar_clicked", { source: "nav" });
            navigate("/crear");
          }}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Empezar
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 md:pt-32 pb-20 max-w-4xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Herramienta para freelancers y consultores
          </span>
        </div>

        <h1 className="animate-fade-in-up-delay-1 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground">
          Creá tu{" "}
          <span className="gradient-text">Arquetipo de Cliente</span>{" "}
          en 5 minutos
        </h1>

        <p className="animate-fade-in-up-delay-2 mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Potenciado por IA. Sin plantillas genéricas. Generá Buyer Personas profesionales y accionables para tu estrategia de marketing.
        </p>

        <div className="animate-fade-in-up-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              // ANALYTICS: CTA principal del hero — métrica de activación clave
              // source: "hero" permite distinguirlo del botón del nav en el dashboard
              posthog.capture("cta_empezar_clicked", { source: "hero" });
              navigate("/crear");
            }}
            className="gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg text-lg shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)] transition-all duration-300 hover:scale-105"
          >
            Empezar ahora
          </button>
        </div>

        {/* Features */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`glass-card-hover p-6 text-left animate-fade-in-up-delay-${i + 1}`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground border-t border-border/30">
        <p>© 2025 ArquetipoIA. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Landing;
