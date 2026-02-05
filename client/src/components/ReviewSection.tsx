import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, Users, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  timestamp: number;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  totalUsers: number;
  totalShares: number;
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    totalUsers: 1,
    totalShares: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
    isAnonymous: false,
    country: "🌍",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Load reviews and stats from localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem("partition_reviews");
    const savedStats = localStorage.getItem("partition_stats");

    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error("Error loading reviews:", e);
      }
    }

    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Error loading stats:", e);
      }
    }

    // Increment user count
    const lastVisit = localStorage.getItem("last_visit");
    const now = Date.now();
    if (!lastVisit || now - parseInt(lastVisit) > 24 * 60 * 60 * 1000) {
      setStats((prev) => {
        const updated = {
          ...prev,
          totalUsers: prev.totalUsers + 1,
        };
        localStorage.setItem("partition_stats", JSON.stringify(updated));
        localStorage.setItem("last_visit", now.toString());
        return updated;
      });
    }
  }, []);

  const handleSubmitReview = () => {
    if (!formData.isAnonymous && !formData.name.trim()) {
      toast.error("Por favor, insira um nome ou marque como anônimo");
      return;
    }
    if (!formData.comment.trim()) {
      toast.error("Por favor, insira um comentário");
      return;
    }

    const displayName = formData.isAnonymous ? `${formData.country} Anônimo` : formData.name;
    const newReview: Review = {
      id: Date.now().toString(),
      name: displayName,
      rating: formData.rating,
      comment: formData.comment,
      timestamp: Date.now(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Calculate new average rating
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / updatedReviews.length;

    const updatedStats = {
      ...stats,
      totalReviews: updatedReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
    };

    setStats(updatedStats);
    localStorage.setItem("partition_reviews", JSON.stringify(updatedReviews));
    localStorage.setItem("partition_stats", JSON.stringify(updatedStats));

    setFormData({ name: "", rating: 5, comment: "", isAnonymous: false, country: "🌍" });
    toast.success("Avaliação enviada com sucesso!");
  };

  const handleShare = (platform: string) => {
    const updatedStats = {
      ...stats,
      totalShares: stats.totalShares + 1,
    };
    setStats(updatedStats);
    localStorage.setItem("partition_stats", JSON.stringify(updatedStats));
    toast.success(`Compartilhado no ${platform}!`);
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`transition-colors ${
              interactive ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <Star
              size={20}
              className={
                star <= (interactive ? hoveredRating || formData.rating : rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalUsers}
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-2">
                <Users size={16} /> Usuários
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.totalShares}
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-2">
                <Share2 size={16} /> Compartilhamentos
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalReviews}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Avaliações</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.averageRating.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Classificação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Deixe sua Avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Seu Nome</label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={formData.isAnonymous}
                className="flex-1"
              />
              <button
                onClick={() =>
                  setFormData({ ...formData, isAnonymous: !formData.isAnonymous })
                }
                className={`px-3 py-2 rounded border transition-colors ${formData.isAnonymous ? "bg-blue-100 border-blue-300 text-blue-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                title="Comentar como anonimo"
              >
                {formData.country} {formData.isAnonymous ? "Anonimo" : "Nomeado"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Classificação</label>
            <div className="mt-2">{renderStars(0, true)}</div>
          </div>

          <div>
            <label className="text-sm font-medium">Comentário</label>
            <Textarea
              placeholder="Compartilhe sua experiência com a calculadora..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="mt-1 min-h-24"
            />
          </div>

          <Button onClick={handleSubmitReview} className="w-full">
            <Send size={16} className="mr-2" />
            Enviar Avaliação
          </Button>
        </CardContent>
      </Card>

      {/* Share Section */}
      <Card>
        <CardHeader>
          <CardTitle>Compartilhe com Seus Amigos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const url = window.location.href;
                const text = `Confira esta incrível calculadora de particionamento Linux! ${url}`;
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(text)}`,
                  "_blank"
                );
                handleShare("WhatsApp");
              }}
              className="flex items-center justify-center gap-2"
            >
              <span>💬</span>
              WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const url = window.location.href;
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                  "_blank"
                );
                handleShare("Facebook");
              }}
              className="flex items-center justify-center gap-2"
            >
              <span>👍</span>
              Facebook
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const text = "Confira esta calculadora de particionamento Linux!";
                navigator.clipboard.writeText(text);
                toast.success("Texto copiado para Instagram!");
                handleShare("Instagram");
              }}
              className="flex items-center justify-center gap-2"
            >
              <span>📷</span>
              Instagram
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const subject = "Calculadora de Particionamento Linux";
                const body = `Confira esta incrível calculadora: ${window.location.href}`;
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                handleShare("Email");
              }}
              className="flex items-center justify-center gap-2"
            >
              <span>✉️</span>
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.timestamp).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
