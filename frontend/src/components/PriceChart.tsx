import React, { useMemo } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

export interface PriceChartProps {
  dates: string[];
  prices: number[];
  regimes: string[];
  confidences?: number[];
  isLoading?: boolean;
  onRegionClick?: (regime: string, dateRange: [string, string]) => void;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  dates, 
  prices, 
  regimes, 
  confidences = [],
  isLoading,
  onRegionClick 
}) => {
  const data = useMemo(() => {
    return dates.map((date, i) => ({
      date,
      price: prices[i],
      regime: regimes[i] || "Unknown",
      confidence: confidences[i] || 0
    }));
  }, [dates, prices, regimes, confidences]);

  const regimeBlocks = useMemo(() => {
    const blocks: { regime: string; start: string; end: string }[] = [];
    if (data.length === 0) return blocks;

    let currentRegime = data[0].regime;
    let startIdx = 0;

    for (let i = 1; i < data.length; i++) {
      if (data[i].regime !== currentRegime) {
        blocks.push({
          regime: currentRegime,
          start: data[startIdx].date,
          end: data[i - 1].date,
        });
        currentRegime = data[i].regime;
        startIdx = i;
      }
    }
    blocks.push({
      regime: currentRegime,
      start: data[startIdx].date,
      end: data[data.length - 1].date,
    });
    return blocks;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      return (
        <div className="bg-[#171b26] border border-border p-3 rounded-lg shadow-xl">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-lg font-mono font-bold text-foreground mb-2">
            ${pt.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant={pt.regime.toLowerCase() as any} className="uppercase text-[10px]">
              {pt.regime}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              {(pt.confidence * 100).toFixed(0)}% Conf
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => (
    <div className="flex items-center justify-center gap-4 text-xs font-medium mt-2">
      {[
        { label: "Bull", color: "var(--regime-bull)" },
        { label: "Bear", color: "var(--regime-bear)" },
        { label: "Sideways", color: "var(--regime-sideways)" },
        { label: "Volatile", color: "var(--regime-volatile)" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm opacity-50" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card className="w-full bg-[#111827]">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#111827] border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Price History & Regimes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} onClick={(eOuter) => {
              const e = eOuter as any;
              if (e && e.activePayload && onRegionClick) {
                const pt = e.activePayload[0].payload;
                onRegionClick(pt.regime, [pt.date, pt.date]);
              }
            }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={50}
                tickFormatter={(val) => {
                  if (!val) return '';
                  const d = new Date(val);
                  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }}
              />
              <YAxis 
                domain={[
                  (dataMin: number) => (dataMin * 0.95), 
                  (dataMax: number) => (dataMax * 1.05)
                ]} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                width={80}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
              
              {regimeBlocks.map((block, idx) => (
                <ReferenceArea
                  key={idx}
                  x1={block.start}
                  x2={block.end}
                  fill={`var(--regime-${block.regime.toLowerCase()})`}
                  fillOpacity={0.15}
                  ifOverflow="hidden"
                />
              ))}

              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#priceGradient)" 
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {renderLegend()}
      </CardContent>
    </Card>
  );
};
