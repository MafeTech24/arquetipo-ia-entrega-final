import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Clock, Target, ArrowRight, BrainCircuit, Users, BarChart3 } from "lucide-react";
import posthog from "posthog-js";

const features = [
  {
    icon: BrainCircuit,
    title: "IA Generativa Avanzada",
    description: "Algoritmos entrenados para identificar patrones de comportamiento y necesidades reales de mercado.",
  },
  {
    icon: Clock,
    title: "Rapidez Increíble",
    description: "Obtené en menos de 5 minutos un perfil detallado que antes tomaba días de investigación.",
  },
  {
    icon: Target,
    title: "Precisión Estratégica",
    description: "Arquetipos accionables que alinean tu marketing con lo que tus clientes realmente buscan.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = (source: string) => {
    posthog.capture("cta_empezar_clicked", { source });
    navigate("/crear");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30">
      {/* Background blobs for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(280_90%_65%)]/5 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            Arquetipo<span className="text-primary font-extrabold uppercase ml-0.5">IA</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center mr-8">
          <a href="#caracteristicas" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Características</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Cómo funciona</a>
        </div>
        <button
          onClick={() => handleStart("nav")}
          className="px-6 py-2 rounded-full border border-primary/30 text-sm font-semibold hover:bg-primary/10 transition-all active:scale-95"
        >
          Iniciar Sesión
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col text-left">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <BrainCircuit className="w-4 h-4" />
                Nueva Generación de Buyer Personas
              </span>
            </div>

            <h1 className="animate-fade-in-up-delay-1 font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
              Define a tu <br />
              <span className="gradient-text glow-text">Cliente Ideal</span> <br />
              con Inteligencia
            </h1>

            <p className="animate-fade-in-up-delay-2 mt-8 text-xl text-muted-foreground leading-relaxed max-w-xl">
              Dejá de adivinar quién es tu audiencia. Nuestra IA procesa datos complejos para entregarte arquetipos humanos, reales y listos para convertir.
            </p>

            <div className="animate-fade-in-up-delay-3 mt-10 flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => handleStart("hero")}
                className="group gradient-primary text-primary-foreground font-bold px-10 py-5 rounded-2xl text-lg shadow-[0_20px_40px_-15px_hsl(var(--primary)/.5)] hover:shadow-[0_25px_50px_-12px_hsl(var(--primary)/.6)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Crear mi Arquetipo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex -space-x-3 items-center ml-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" />
                  </div>
                ))}
                <span className="ml-5 text-sm font-medium text-muted-foreground italic">+500 consultores ya lo usan</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-float animate-fade-in-up-delay-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-card overflow-hidden rounded-[2.5rem] border-primary/20 aspect-square lg:aspect-auto lg:h-[600px] shadow-2xl">
              <img 
                src="/hero_arquetipo_ia_1776738938683.png" 
                alt="Inteligencia Artificial y Arquetipos" 
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" 
              />
              {/* Floating UI element */}
              <div className="absolute bottom-8 left-8 right-8 glass-card p-6 border-white/10 bg-black/40 backdrop-blur-md animate-fade-in-up-delay-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Arquetipo Generado</p>
                    <p className="text-xs text-white/60">"Emprendedor Tecnológico, 32 años"</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features / Social Proof */}
        <div id="caracteristicas" className="mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir Arquetipo<span className="text-primary">IA</span>?</h2>
            <p className="text-muted-foreground text-lg">Tecnología de vanguardia para consultores de marketing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`group glass-card-hover p-10 text-left animate-fade-in-up-delay-${i + 1} overflow-hidden relative`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-24 h-24" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="mt-40 glass-card p-12 md:p-20 text-center border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">¿Listo para conocer a tu cliente?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Unite a los profesionales que ya están transformando sus estrategias con datos precisos.
          </p>
          <button
            onClick={() => handleStart("cta_bottom")}
            className="gradient-primary text-primary-foreground font-bold px-12 py-5 rounded-2xl text-xl shadow-xl hover:scale-105 transition-all"
          >
            Empezar Gratis
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-lg font-bold">ArquetipoIA</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 ArquetipoIA. Diseñado para visionarios digitales.</p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacidad</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

