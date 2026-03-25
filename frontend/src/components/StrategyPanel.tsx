import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export interface StrategyData {
  name: string;
  action: string[];
  riskLevel: "Low" | "Medium" | "High";
  indicatorsToWatch: string[];
}

export interface StrategyPanelProps {
  strategy?: StrategyData;
  isLoading?: boolean;
}

export const StrategyPanel: React.FC<StrategyPanelProps> = ({ strategy, isLoading }) => {
  if (isLoading || !strategy) {
    return (
      <Card className="bg-[#1c1f2a] border-none shadow-none h-full relative">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-border/15" />
      </Card>
    );
  }

  const riskVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Low: "secondary",
    Medium: "default",
    High: "destructive"
  };

  return (
    <Card className="bg-[#1c1f2a] border border-border/10 shadow-lg relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-border/20" />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-foreground">
            {strategy.name}
          </CardTitle>
          <Badge variant={riskVariantMap[strategy.riskLevel] || "outline"}>
            {strategy.riskLevel} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Action Plan</h4>
          <ul className="space-y-2">
            {strategy.action.map((act, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90 leading-tight">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 flex-1">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Indicators</h4>
          <ul className="space-y-2">
            {strategy.indicatorsToWatch.map((ind, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Activity className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                <span>{ind}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 mt-auto">
          <Link to="#" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 group">
            Learn more about this strategy
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
