import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

export const getIcon = (name: string): LucideIcon => {
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Icons.Wallet;
};
