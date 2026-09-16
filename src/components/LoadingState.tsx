import { LoaderCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Card aria-live="polite" aria-busy="true" className="overflow-hidden">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <LoaderCircle className="size-5 animate-spin text-primary" />
          <p className="text-base font-medium text-foreground">{message}</p>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-lg border border-border/60 p-4"
            >
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}