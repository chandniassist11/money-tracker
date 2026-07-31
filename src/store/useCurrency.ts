import { useAppSelector } from "./index";
import type { Currency } from "../types";

export const useCurrency = (): Currency =>
  useAppSelector((s) => s.settings.currency);
