import { useLocation } from "react-router-dom";
import { navigationItems } from "../constants/navigation";

export const usePageTitle = (): string => {
  const { pathname } = useLocation();
  const match = navigationItems.find((item) => pathname.startsWith(item.path));
  return match?.name ?? "Money Tracker";
};
