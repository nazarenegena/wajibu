import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ErrorStateProps {
  title: string;
  message: string;
  retryLabel: string;
  backLabel: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorState({
  title,
  message,
  retryLabel,
  backLabel,
  onRetry,
  onBack,
}: ErrorStateProps) {
  return (
    <Card
      role="alert"
      className="border-destructive/40 bg-destructive/5 ring-destructive/20"
    >
      <CardHeader className="gap-1">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle className="size-4" />
          </span>
          <CardTitle className="leading-snug">{title}</CardTitle>
        </div>
        <CardDescription className="mt-2 leading-relaxed">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {onRetry ? (
          <Button onClick={onRetry}>{retryLabel}</Button>
        ) : null}
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            {backLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}