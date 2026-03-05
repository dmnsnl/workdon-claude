"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import type { MapMarker } from "./map-view";

const MapView = lazy(() =>
  import("./map-view").then((mod) => ({ default: mod.MapView }))
);

interface SearchMapToggleProps {
  markers: MapMarker[];
}

export function SearchMapToggle({ markers }: SearchMapToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "list";

  const toggleView = useCallback(
    (newView: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newView === "list") {
        params.delete("view");
      } else {
        params.set("view", newView);
      }
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div>
      <div className="flex gap-1 mb-4">
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => toggleView("list")}
        >
          List
        </Button>
        <Button
          variant={view === "map" ? "default" : "outline"}
          size="sm"
          onClick={() => toggleView("map")}
          disabled={markers.length === 0}
        >
          Map{markers.length > 0 ? ` (${markers.length})` : ""}
        </Button>
      </div>

      {view === "map" && markers.length > 0 && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[400px] rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">Loading map…</p>
            </div>
          }
        >
          <MapView markers={markers} className="h-[500px]" />
        </Suspense>
      )}
    </div>
  );
}
