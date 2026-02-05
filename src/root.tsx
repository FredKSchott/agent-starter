import { ModalProvider } from "@/providers/ModalProvider";
import { TooltipProvider } from "@/providers/TooltipProvider";
import App from '@/app';

export const Root = () => {
  return (
    <TooltipProvider>
      <ModalProvider><App /></ModalProvider>
    </TooltipProvider>
  );
};
