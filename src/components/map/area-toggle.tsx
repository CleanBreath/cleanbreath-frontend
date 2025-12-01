"use client";

import { Cigarette, CigaretteOff, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AreaToggleProps {
  showNonSmoking: boolean;
  showSmoking: boolean;
  showApartments: boolean;
  onNonSmokingToggle: () => void;
  onSmokingToggle: () => void;
  onApartmentToggle: () => void;
}

export function AreaToggle({
  showNonSmoking,
  showSmoking,
  showApartments,
  onNonSmokingToggle,
  onSmokingToggle,
  onApartmentToggle,
}: AreaToggleProps) {
  return (
    <div className="absolute right-4 top-4 z-30 flex flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        size="sm"
        onClick={onNonSmokingToggle}
        className={cn(
          "gap-2 rounded-full border-2 bg-background/90 shadow-lg backdrop-blur-sm transition-all",
          showNonSmoking
            ? "border-green-500 bg-green-500 text-white hover:bg-green-600 hover:text-white"
            : "border-muted-foreground/20 text-muted-foreground hover:border-green-500 hover:text-green-600"
        )}
      >
        <CigaretteOff size={16} />
        <span className="hidden sm:inline">금연구역</span>
        <span
          className={cn(
            "ml-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
            showNonSmoking
              ? "bg-white/20 text-white"
              : "bg-muted text-muted-foreground"
          )}
        >
          {showNonSmoking ? "ON" : "OFF"}
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onSmokingToggle}
        className={cn(
          "gap-2 rounded-full border-2 bg-background/90 shadow-lg backdrop-blur-sm transition-all",
          showSmoking
            ? "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:text-white"
            : "border-muted-foreground/20 text-muted-foreground hover:border-red-500 hover:text-red-600"
        )}
      >
        <Cigarette size={16} />
        <span className="hidden sm:inline">흡연구역</span>
        <span
          className={cn(
            "ml-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
            showSmoking
              ? "bg-white/20 text-white"
              : "bg-muted text-muted-foreground"
          )}
        >
          {showSmoking ? "ON" : "OFF"}
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onApartmentToggle}
        className={cn(
          "gap-2 rounded-full border-2 bg-background/90 shadow-lg backdrop-blur-sm transition-all",
          showApartments
            ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            : "border-muted-foreground/20 text-muted-foreground hover:border-blue-500 hover:text-blue-600"
        )}
      >
        <Building2 size={16} />
        <span className="hidden sm:inline">아파트</span>
        <span
          className={cn(
            "ml-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
            showApartments
              ? "bg-white/20 text-white"
              : "bg-muted text-muted-foreground"
          )}
        >
          {showApartments ? "ON" : "OFF"}
        </span>
      </Button>
    </div>
  );
}
