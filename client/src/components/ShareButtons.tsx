import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Instagram, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ShareButtonsProps {
  title?: string;
  text?: string;
  url?: string;
}

export default function ShareButtons({
  title = "Linux Partition Calculator",
  text = "Otimize o particionamento do seu disco para múltiplas distribuições Linux com inteligência artificial.",
  url = typeof window !== "undefined" ? window.location.href : "",
}: ShareButtonsProps) {
  const trackShareMutation = trpc.shares.track.useMutation();

  const handleShare = async (platform: "whatsapp" | "facebook" | "instagram" | "email") => {
    // Get or create visitor ID
    const visitorId = localStorage.getItem('visitorId') || `visitor-${Date.now()}`;
    localStorage.setItem('visitorId', visitorId);

    // Track the share
    await trackShareMutation.mutateAsync({
      visitorId,
      platform,
    });

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent(title);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "instagram":
        // Instagram doesn't support direct sharing via URL, show toast
        toast.info("Copie o link e compartilhe no Instagram");
        navigator.clipboard.writeText(url);
        return;
      case "email":
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      toast.success(`Compartilhado no ${platform}!`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => handleShare("whatsapp")}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
        title="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>

      <Button
        onClick={() => handleShare("facebook")}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white"
        title="Compartilhar no Facebook"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>

      <Button
        onClick={() => handleShare("instagram")}
        size="sm"
        className="bg-pink-600 hover:bg-pink-700 text-white"
        title="Compartilhar no Instagram"
      >
        <Instagram className="w-4 h-4 mr-2" />
        Instagram
      </Button>

      <Button
        onClick={() => handleShare("email")}
        size="sm"
        className="bg-slate-600 hover:bg-slate-700 text-white"
        title="Compartilhar por Email"
      >
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>

      {/* Copy Link Button */}
      <Button
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.success("Link copiado!");
        }}
        size="sm"
        variant="outline"
        title="Copiar link"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Copiar Link
      </Button>
    </div>
  );
}
