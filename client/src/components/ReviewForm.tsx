import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReviewMutation = trpc.reviews.add.useMutation({
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso! Obrigado!");
      setName("");
      setRating(0);
      setComment("");
    },
      onError: (error: any) => {
        toast.error(`Erro ao enviar avaliação: ${error?.message || 'Erro desconhecido'}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, insira seu nome");
      return;
    }

    if (rating === 0) {
      toast.error("Por favor, selecione uma classificação");
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate a simple visitor ID (in production, use actual visitor tracking)
      const visitorId = localStorage.getItem('visitorId') || `visitor-${Date.now()}`;
      localStorage.setItem('visitorId', visitorId);

      await submitReviewMutation.mutateAsync({
        visitorId,
        name: name.trim(),
        rating,
        comment: comment.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Deixe sua Avaliação</CardTitle>
        <CardDescription>
          Sua opinião nos ajuda a melhorar a ferramenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold">
              Seu Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-9 text-sm"
            />
          </div>

          {/* Star Rating */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              Classificação
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {rating === 1 && "Precisa melhorar"}
                {rating === 2 && "Ruim"}
                {rating === 3 && "Bom"}
                {rating === 4 && "Muito Bom"}
                {rating === 5 && "Excelente!"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm font-semibold">
              Comentário (Opcional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Compartilhe sua experiência com a ferramenta..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 text-sm min-h-24 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
