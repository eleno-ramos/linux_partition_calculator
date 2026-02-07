import { useEffect, useRef } from "react";

interface CountryData {
  name: string;
  lat: number;
  lng: number;
  count: number;
  color?: string;
}

interface AnimatedGlobeProps {
  countries: CountryData[];
  onCountryHover?: (country: string | null) => void;
}

export default function AnimatedGlobe({ countries, onCountryHover }: AnimatedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    let animationId: number;

    const drawGlobe = () => {
      // Limpar canvas
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      // Salvar contexto
      ctx.save();

      // Mover para o centro
      ctx.translate(centerX, centerY);

      // Rotacionar globo
      ctx.rotate((rotationRef.current * Math.PI) / 180);

      // Desenhar círculo do globo
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Desenhar grade (linhas de latitude e longitude)
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 0.5;

      // Linhas de latitude
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = (lat / 90) * radius;
        const x_scale = Math.sqrt(radius * radius - y * y);
        ctx.beginPath();
        ctx.moveTo(-x_scale, y);
        ctx.lineTo(x_scale, y);
        ctx.stroke();
      }

      // Linhas de longitude
      for (let lng = -180; lng <= 180; lng += 30) {
        const angle = (lng * Math.PI) / 180;
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const rad = (lat * Math.PI) / 180;
          const x = radius * Math.cos(rad) * Math.cos(angle);
          const y = radius * Math.sin(rad);
          if (lat === -90) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Desenhar continentes (simplificado com círculos)
      const continents = [
        { lat: 45, lng: -100, size: 25, name: "North America" },
        { lat: 0, lng: -60, size: 20, name: "South America" },
        { lat: 50, lng: 15, size: 22, name: "Europe" },
        { lat: 0, lng: 20, size: 18, name: "Africa" },
        { lat: 30, lng: 100, size: 25, name: "Asia" },
        { lat: -25, lng: 135, size: 15, name: "Australia" },
      ];

      continents.forEach((continent) => {
        const rad_lat = (continent.lat * Math.PI) / 180;
        const rad_lng = (continent.lng * Math.PI) / 180;

        const x = radius * Math.cos(rad_lat) * Math.cos(rad_lng);
        const y = radius * Math.sin(rad_lat);

        ctx.fillStyle = "#1e40af";
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, continent.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Desenhar pontos de visitantes
      countries.forEach((country) => {
        const rad_lat = (country.lat * Math.PI) / 180;
        const rad_lng = (country.lng * Math.PI) / 180;

        const x = radius * Math.cos(rad_lat) * Math.cos(rad_lng);
        const y = radius * Math.sin(rad_lat);

        // Calcular tamanho do ponto baseado no número de visitantes
        const size = Math.min(2 + (country.count / 1000) * 3, 8);

        // Desenhar ponto com glow
        ctx.fillStyle = country.color || "#3b82f6";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, size + 2, 0, Math.PI * 2);
        ctx.fill();

        // Ponto interno
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Restaurar contexto
      ctx.restore();

      // Atualizar rotação
      rotationRef.current += 0.1;
      if (rotationRef.current >= 360) {
        rotationRef.current = 0;
      }

      animationId = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [countries]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="rounded-full shadow-2xl border-4 border-slate-700 dark:border-slate-600"
      />
      <p className="text-xs text-muted-foreground text-center">
        Globo animado mostrando visitantes por país
      </p>
    </div>
  );
}
