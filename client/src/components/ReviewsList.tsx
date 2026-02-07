import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ReviewsList() {
  const { data: reviews, isLoading } = trpc.reviews.list.useQuery();
  const { data: stats } = trpc.reviews.stats.useQuery();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Carregando avaliações...</div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = stats?.averageRating || 0;
  const totalReviews = reviews?.length || 0;

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            Avaliações dos Usuários
          </CardTitle>
          <CardDescription>
            {totalReviews} avaliações | Média: {averageRating.toFixed(1)} ⭐
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Reviews List */}
      {totalReviews === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Nenhuma avaliação ainda. Seja o primeiro a avaliar!
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews?.map((review) => (
            <Card key={review.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-sm">{review.name}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-sm text-muted-foreground mb-2 italic">
                        "{review.comment}"
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-xs whitespace-nowrap ${
                      review.rating >= 4
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-200 dark:border-green-900"
                        : review.rating >= 3
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-900"
                        : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-200 dark:border-orange-900"
                    }`}
                  >
                    {review.rating === 5 && "Excelente"}
                    {review.rating === 4 && "Muito Bom"}
                    {review.rating === 3 && "Bom"}
                    {review.rating === 2 && "Ruim"}
                    {review.rating === 1 && "Precisa melhorar"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
