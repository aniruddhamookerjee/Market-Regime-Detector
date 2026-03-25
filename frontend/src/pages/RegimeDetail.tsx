import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { StrategyPanel } from "../components/StrategyPanel";

export const RegimeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const regimeData = location.state || {
    regime: "BULL", startDate: "2023-01-01", endDate: "2023-12-31", duration: "365 days"
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <header className="border-b border-border/40 bg-[#1c1f2a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">RegimeRadar</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/history" className="hover:text-foreground transition-colors">History</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <span>&gt;</span>
          <span className="text-foreground font-semibold">{regimeData.regime}</span>
          <span>({regimeData.startDate} - {regimeData.endDate})</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["Duration", "Mean Return", "Std Dev", "Max Drawdown", "Sharpe"].map(stat => (
            <Card key={stat} className="bg-[#171b26] border-none">
              <CardContent className="p-4 flex flex-col justify-center space-y-1">
                <span className="text-xs font-medium text-muted-foreground">{stat}</span>
                <span className="text-xl font-mono font-bold text-foreground">
                  {stat === "Duration" ? regimeData.duration : "0.00"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#111827]">
            <CardHeader>
              <CardTitle>What this meant</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              During this period, the market exhibited strong {regimeData.regime.toLowerCase()} characteristics. 
              Volatility was constrained within expected statistical boundaries, and momentum indicators 
              remained structurally sound. The regime shift was detected via our Gaussian Mixture Model (GMM) 
              identifying a distinct transition in the underlying return distribution.
            </CardContent>
          </Card>
          <StrategyPanel 
            strategy={{
              name: `Ideal ${regimeData.regime} Strategy`,
              action: ["Increase exposure to high-beta assets", "Implement trailing stop-losses"],
              riskLevel: "Medium",
              indicatorsToWatch: ["RSI Divergence", "MACD Crossover", "VIX compression"]
            }} 
          />
        </div>
      </main>
    </div>
  );
};
