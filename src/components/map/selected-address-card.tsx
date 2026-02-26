"use client";

import * as motion from "motion/react-client";
import { X, Cigarette, CigaretteOff, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMapStore } from "@/store/map-store";

export function SelectedAddressCard() {
  const selectedAddress = useMapStore((state) => state.selectedAddress);
  const clearSelection = useMapStore((state) => state.clearSelection);

  if (!selectedAddress) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
    >
      <Card className="border-0 bg-background/95 shadow-2xl backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                selectedAddress.category === "SMOKING"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {selectedAddress.category === "SMOKING" ? (
                <Cigarette size={22} className="text-white" />
              ) : (
                <CigaretteOff size={22} className="text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight">
                  {selectedAddress.addressName}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 rounded-full"
                  onClick={clearSelection}
                >
                  <X size={14} />
                </Button>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={12} />
                <span className="truncate">{selectedAddress.buildingName}</span>
              </div>
              <Badge
                className={`mt-2 ${
                  selectedAddress.category === "SMOKING"
                    ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300"
                    : "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                }`}
              >
                {selectedAddress.category === "SMOKING"
                  ? "흡연구역"
                  : "금연구역"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
