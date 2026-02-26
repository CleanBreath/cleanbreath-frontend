"use client";

import * as motion from "motion/react-client";
import { X, Building2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMapStore } from "@/store/map-store";

export function SelectedApartmentCard() {
  const selectedApartment = useMapStore((state) => state.selectedApartment);
  const setSelectedApartment = useMapStore(
    (state) => state.setSelectedApartment,
  );

  if (!selectedApartment) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
    >
      <Card className="border-0 bg-background/95 shadow-2xl backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-sm">
              <Building2 size={22} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight">
                  {selectedApartment.apartmentName}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 rounded-full"
                  onClick={() => setSelectedApartment(null)}
                >
                  <X size={14} />
                </Button>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={12} />
                <span className="truncate">{selectedApartment.address}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
                  {selectedApartment.numberOfBuilding}개 동
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
                  {selectedApartment.numberOfHouseholds}세대
                </Badge>
              </div>

              {/* 금연구역 지정 범위 */}
              {selectedApartment.path.length > 0 && (
                <div className="mt-3 space-y-1.5 rounded-lg bg-muted/50 p-2.5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    금연구역 지정 범위
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                        selectedApartment.path[0].hallway === "YES"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>복도</span>
                      <Badge
                        variant="secondary"
                        className={`h-4 px-1.5 text-[10px] ${
                          selectedApartment.path[0].hallway === "YES"
                            ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-background"
                        }`}
                      >
                        {selectedApartment.path[0].hallway === "YES"
                          ? "지정"
                          : "미지정"}
                      </Badge>
                    </div>
                    <div
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                        selectedApartment.path[0].stairs === "YES"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>계단</span>
                      <Badge
                        variant="secondary"
                        className={`h-4 px-1.5 text-[10px] ${
                          selectedApartment.path[0].stairs === "YES"
                            ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-background"
                        }`}
                      >
                        {selectedApartment.path[0].stairs === "YES"
                          ? "지정"
                          : "미지정"}
                      </Badge>
                    </div>
                    <div
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                        selectedApartment.path[0].elevator === "YES"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>엘리베이터</span>
                      <Badge
                        variant="secondary"
                        className={`h-4 px-1.5 text-[10px] ${
                          selectedApartment.path[0].elevator === "YES"
                            ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-background"
                        }`}
                      >
                        {selectedApartment.path[0].elevator === "YES"
                          ? "지정"
                          : "미지정"}
                      </Badge>
                    </div>
                    <div
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                        selectedApartment.path[0].undergroundParkingLot ===
                        "YES"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>지하주차장</span>
                      <Badge
                        variant="secondary"
                        className={`h-4 px-1.5 text-[10px] ${
                          selectedApartment.path[0].undergroundParkingLot ===
                          "YES"
                            ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-background"
                        }`}
                      >
                        {selectedApartment.path[0].undergroundParkingLot ===
                        "YES"
                          ? "지정"
                          : "미지정"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
