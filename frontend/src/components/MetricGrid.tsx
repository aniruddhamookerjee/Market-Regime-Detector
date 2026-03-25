import React from "react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface MetricGridProps {
  metrics?: { 
    avg_return: number; 
    volatility: number; 
    momentum: number; 
    trend_signal: number;
  };
  isLoading?: boolean;
}

const renderValue = (label: string, value: number | undefined) => {
  if (value === undefined) return <div className="text-2xl font-mono text-muted-foreground">-</div>;
  
  let formattedValue = "";
  let colorClass = "text-muted-foreground";
  let Icon = Minus;

  if (label === "Avg Return") {
    formattedValue = `${(value > 0 ? "+" : "")}${value.toFixed(2)}%`;
    if (value > 0) { colorClass = "text-[color:var(--regime-bull)]"; Icon = ArrowUpRight; }
    else if (value < 0) { colorClass = "text-[color:var(--regime-bear)]"; Icon = ArrowDownRight; }
  } else if (label === "Volatility") {
    formattedValue = `${value.toFixed(2)}%`;
    colorClass = "text-foreground";
    Icon = Minus;
  } else if (label === "Momentum") {
    formattedValue = `${(value > 0 ? "+" : "")}${value.toFixed(3)}`;
    if (value > 0) { colorClass = "text-[color:var(--regime-bull)]"; Icon = ArrowUpRight; }
    else if (value < 0) { colorClass = "text-[color:var(--regime-bear)]"; Icon = ArrowDownRight; }
  } else if (label === "Trend Signal") {
    formattedValue = `${(value > 0 ? "+" : "")}${value.toFixed(2)}`;
    if (value > 0) { colorClass = "text-[color:var(--regime-bull)]"; Icon = ArrowUpRight; }
    else if (value < 0) { colorClass = "text-[color:var(--regime-bear)]"; Icon = ArrowDownRight; }
  }

  return (
    <div className="flex items-center gap-1 z-10 relative">
      {label !== "Volatility" && <Icon className={`h-4 w-4 ${colorClass}`} />}
      <span className={`text-2xl font-mono font-bold ${colorClass}`}>
        {formattedValue}
      </span>
    </div>
  );
};

export const MetricGrid: React.FC<MetricGridProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-[#171b26] border-none shadow-none">
            <CardContent className="p-4 flex flex-col justify-center space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <Card className="bg-[#171b26] border-none shadow-none relative overflow-hidden">
        <CardContent className="p-4 flex flex-col justify-center space-y-1 h-full min-h-[100px]">
          <span className="text-sm font-medium text-muted-foreground z-10">Avg Return</span>
          {renderValue("Avg Return", metrics?.avg_return)}
          <span className="text-[10px] text-muted-foreground/50 absolute bottom-3 z-10">mean daily return in this regime</span>
        </CardContent>
      </Card>
      <Card className="bg-[#171b26] border-none shadow-none relative overflow-hidden">
        <CardContent className="p-4 flex flex-col justify-center space-y-1 h-full min-h-[100px]">
          <span className="text-sm font-medium text-muted-foreground z-10">Volatility</span>
          {renderValue("Volatility", metrics?.volatility)}
          <span className="text-[10px] text-muted-foreground/50 absolute bottom-3 z-10">avg 20-day rolling std dev</span>
        </CardContent>
      </Card>
      <Card className="bg-[#171b26] border-none shadow-none relative overflow-hidden">
        <CardContent className="p-4 flex flex-col justify-center space-y-1 h-full min-h-[100px]">
          <span className="text-sm font-medium text-muted-foreground z-10">Momentum</span>
          {renderValue("Momentum", metrics?.momentum)}
          <span className="text-[10px] text-muted-foreground/50 absolute bottom-3 z-10">10-day price change</span>
        </CardContent>
      </Card>
      <Card className="bg-[#171b26] border-none shadow-none relative overflow-hidden">
        <CardContent className="p-4 flex flex-col justify-center space-y-1 h-full min-h-[100px]">
          <span className="text-sm font-medium text-muted-foreground z-10">Trend Signal</span>
          {renderValue("Trend Signal", metrics?.trend_signal)}
          <span className="text-[10px] text-muted-foreground/50 absolute bottom-3 z-10">short MA minus long MA</span>
        </CardContent>
      </Card>
    </div>
  );
};
