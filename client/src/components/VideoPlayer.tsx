import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, User } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  channel: string;
  tags?: string[];
  timestamps?: Array<{
    time: string;
    label: string;
  }>;
}

export default function VideoPlayer({
  title,
  description,
  youtubeId,
  duration,
  channel,
  tags = [],
  timestamps = []
}: VideoPlayerProps) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative bg-black aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            {duration}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-4 h-4" />
            {channel}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {timestamps.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Play className="w-4 h-4" />
              Timestamps
            </h4>
            <ul className="space-y-1">
              {timestamps.map((ts, idx) => (
                <li key={idx} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}&t=${timeToSeconds(ts.time)}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {ts.time}
                    </span>
                    <span>{ts.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function timeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}
