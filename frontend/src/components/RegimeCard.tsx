import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

export interface RegimeCardProps {
  regime?: "Bull" | "Bear" | "Sideways" | "Volatile";
  confidence?: number;
  transitionRisk?: number;
  currentStreakDays?: number;
  previousRegime?: string;
  probabilities?: Record<string, number>;
  isLoading: boolean;
}

export const RegimeCard: React.FC<RegimeCardProps> = ({ 
  regime, 
  confidence = 0, 
  transitionRisk,
  currentStreakDays,
  previousRegime,
  probabilities,
  isLoading 
}) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setAnimatedConfidence(confidence * 100), 100);
    } else {
      setAnimatedConfidence(0);
    }
  }, [confidence, isLoading]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  const regimeColorVar = regime ? `var(--regime-${regime.toLowerCase()})` : "var(--text-secondary)";
  const isHighConfidence = confidence > 0.8;

  return (
    <Card 
      regime={regime?.toLowerCase() as any} 
      className={isHighConfidence ? "pulse-active" : ""}
    >
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Current Regime
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div 
            className="text-4xl font-bold uppercase tracking-tight"
            style={{ color: regimeColorVar }}
          >
            {regime || "UNKNOWN"}
          </div>
          <div className="text-2xl font-mono text-foreground font-bold">
            {(confidence * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="pt-2 relative">
          <div 
            className="absolute text-[10px] text-muted-foreground font-mono"
            style={{ left: "80%", transform: "translateX(-50%)", bottom: "14px" }}
          >
            Threshold: 80%
          </div>
          <div className="w-full h-2 bg-[#1f2937] rounded-full relative overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-out"
              style={{ width: `${animatedConfidence}%`, backgroundColor: regimeColorVar }}
            />
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-white z-10"
              style={{ left: "80%", transform: "translateX(-50%)" }}
            />
          </div>
        </div>

        {probabilities && (
          <div className="pt-2 space-y-1.5 font-mono text-[10px] sm:text-xs">
            {Object.entries(probabilities)
              .sort(([, a], [, b]) => b - a)
              .map(([name, val]) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-16 text-muted-foreground uppercase">{name}</div>
                  <div className="flex-1 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${val}%`, backgroundColor: `var(--regime-${name.toLowerCase()})` }} 
                    />
                  </div>
                  <div className="w-12 text-right text-foreground">{val.toFixed(1)}%</div>
                </div>
              ))}
          </div>
        )}

        <div className="pt-3 space-y-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Active for</span>
            <span className="font-mono text-foreground">{currentStreakDays || 0} days</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Transition Risk</span>
              <span className="font-mono" style={{ color: "var(--regime-volatile)" }}>
                {transitionRisk?.toFixed(1) || "0.0"}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ width: `${transitionRisk || 0}%`, backgroundColor: "var(--regime-volatile)" }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground">Previous</span>
            {previousRegime && previousRegime !== "None" ? (
              <Badge variant={previousRegime.toLowerCase() as any} className="uppercase text-[10px]">
                {previousRegime}
              </Badge>
            ) : (
              <span className="font-mono text-muted-foreground">-</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
