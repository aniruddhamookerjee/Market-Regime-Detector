import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RegimeCard } from "../components/RegimeCard";
import { PriceChart } from "../components/PriceChart";
import { MetricGrid } from "../components/MetricGrid";
import { RegimeTimeline } from "../components/RegimeTimeline";
import { StrategyPanel } from "../components/StrategyPanel";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Download } from "lucide-react";

export const Dashboard = () => {
  const [ticker, setTicker] = useState("^NSEI");
  const [model, setModel] = useState("GMM");
  const [period, setPeriod] = useState("5Y");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, model_type: model.toLowerCase(), period: period.toLowerCase() })
      });
      if (!res.ok) throw new Error("Analysis failed or invalid ticker.");
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!data?.chartData) return;
    const cd = data.chartData;
    const header = "Date,Close_Price,Regime,Regime_Probability,Returns,Volatility,Momentum,Trend_Signal";
    const rows = cd.dates.map((date: string, i: number) => {
      const getVal = (arr: any) => (arr && arr[i] !== undefined) ? arr[i] : 0;
      return [
        date,
        cd.prices[i].toFixed(2),
        cd.regimes[i],
        (cd.confidences[i] * 100).toFixed(1),
        (getVal(cd.returns) * 100).toFixed(4),
        (getVal(cd.volatility) * 100).toFixed(4),
        getVal(cd.momentum).toFixed(4),
        getVal(cd.trend_signal).toFixed(4)
      ].join(",");
    });
    
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    const today = new Date().toISOString().split("T")[0];
    a.download = `RegimeRadar_${ticker.replace("^", "")}_${period}_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    handleAnalyze();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/40 bg-[#1c1f2a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm bg-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">RegimeRadar</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="text-primary hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/history" className="hover:text-foreground transition-colors">History</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <section className="flex flex-col md:flex-row items-center gap-4 bg-[#171b26] p-4 rounded-2xl border border-border/50">
          <div className="w-full md:w-48">
            <Input 
              value={ticker} 
              onChange={e => setTicker(e.target.value.toUpperCase())}
              placeholder="Ticker e.g. ^NSEI"
              className="font-mono bg-[#1c1f2a]"
            />
          </div>
          <div className="w-full md:w-32">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-[#1c1f2a]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GMM">GMM</SelectItem>
                <SelectItem value="KMeans">KMeans</SelectItem>
                <SelectItem value="HMM">HMM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs value={period} onValueChange={setPeriod} className="w-full md:w-auto">
            <TabsList className="bg-[#1c1f2a]">
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="3Y">3Y</TabsTrigger>
              <TabsTrigger value="5Y">5Y</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-full md:w-auto flex items-center gap-2 md:gap-4 ml-auto">
            <Button 
              variant="outline" 
              onClick={handleExport} 
              disabled={!data || isLoading}
              className="bg-[#1c1f2a] border-border/50 text-muted-foreground w-full md:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="analyze" 
              onClick={handleAnalyze} 
              isLoading={isLoading}
              className="w-full md:w-32"
            >
              Analyze
            </Button>
          </div>
        </section>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive pulse-active" />
            {error} - Please verify the ticker symbol.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <RegimeCard 
              isLoading={isLoading || !data} 
              regime={data?.currentRegime?.label}
              confidence={data?.currentRegime?.confidence}
              transitionRisk={data?.currentRegime?.transition_risk}
              currentStreakDays={data?.currentRegime?.current_streak_days}
              previousRegime={data?.currentRegime?.previous_regime}
              probabilities={data?.currentRegime?.probabilities}
            />
            <div className="flex-1 hidden lg:block">
              <StrategyPanel isLoading={isLoading || !data} strategy={data?.recommendation} />
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-6">
            <PriceChart 
              isLoading={isLoading || !data}
              dates={data?.chartData?.dates || []}
              prices={data?.chartData?.prices || []}
              regimes={data?.chartData?.regimes || []}
              confidences={data?.chartData?.confidences || []}
            />
          </div>
        </div>

        <MetricGrid isLoading={isLoading || !data} metrics={data?.metrics} />

        <div className="block lg:hidden">
          <StrategyPanel isLoading={isLoading || !data} strategy={data?.recommendation} />
        </div>

        <section className="bg-[#0a0e18] p-6 rounded-2xl border border-border/30">
          <RegimeTimeline history={data?.history || []} activeId={data?.history?.[data.history.length - 1]?.id} />
        </section>
      </main>
    </div>
  );
};
