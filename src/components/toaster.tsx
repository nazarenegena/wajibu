import { Toaster as Sonner } from "sonner";
import { useTheme } from "./ThemeProvider";

export function Toaster() {
  const { resolved } = useTheme();

  return (
    <Sonner
      position="top-center"
      closeButton
      theme={resolved}
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !border-border !font-sans",
        },
      }}
    />
  );
}