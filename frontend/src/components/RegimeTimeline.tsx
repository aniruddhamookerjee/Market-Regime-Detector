import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  regime: "Bull" | "Bear" | "Sideways" | "Volatile";
  startDate: string;
  endDate: string;
  duration: string;
  confidence: number;
}

interface RegimeTimelineProps {
  history: TimelineEvent[];
  activeId?: string;
}

export const RegimeTimeline: React.FC<RegimeTimelineProps> = ({ history, activeId }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!history || history.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Regime History</h3>
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {history.map((item) => {
          const regimeColorVar = `var(--regime-${item.regime.toLowerCase()})`;
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/regime/${item.id}`, { state: item })}
              className={cn(
                "flex-shrink-0 snap-start rounded-full px-4 py-2 border transition-colors hover:bg-surface-container-highest",
                "bg-[#171b26]", 
                isActive ? "border-primary" : "border-border/50"
              )}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: regimeColorVar }} 
                />
                <span className="text-sm font-semibold uppercase">{item.regime}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {item.startDate} &mdash; {item.endDate}
                </span>
                <span className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-0.5 rounded ml-2">
                  {item.duration}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
