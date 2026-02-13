import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface MilestoneConfig {
  value: number;
  message: string;
  icon?: string;
}

const MILESTONES: MilestoneConfig[] = [
  { value: 100, message: "🎉 Parabéns! Atingimos 100 visitantes!" },
  { value: 500, message: "🚀 Incrível! 500 visitantes no site!" },
  { value: 1000, message: "⭐ Milestone! 1.000 visitantes alcançados!" },
  { value: 5000, message: "🔥 Wow! 5.000 visitantes! Obrigado!" },
  { value: 10000, message: "👑 Épico! 10.000 visitantes! Vocês são incríveis!" },
  { value: 50000, message: "🌟 Lendário! 50.000 visitantes! Muito obrigado!" },
  { value: 100000, message: "🏆 Histórico! 100.000 visitantes! Você é parte da história!" },
];

export function useMilestoneNotification(currentVisitors: number) {
  const notifiedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Verificar se atingiu algum milestone
    MILESTONES.forEach((milestone) => {
      if (
        currentVisitors >= milestone.value &&
        !notifiedMilestones.current.has(milestone.value)
      ) {
        notifiedMilestones.current.add(milestone.value);

        // Mostrar notificação
        toast.success(milestone.message, {
          duration: 5000,
          position: "top-center",
          richColors: true,
        });

        // Opcional: Reproduzir som (descomente se desejar)
        // playNotificationSound();
      }
    });
  }, [currentVisitors]);

  return notifiedMilestones.current;
}

// Função auxiliar para reproduzir som (opcional)
export function playNotificationSound() {
  // Usar Web Audio API para criar um som simples
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.warn("Não foi possível reproduzir som de notificação:", error);
  }
}
