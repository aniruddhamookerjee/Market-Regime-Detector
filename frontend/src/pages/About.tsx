import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <header className="border-b border-border/40 bg-[#1c1f2a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">RegimeRadar</h1>
          <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/history" className="hover:text-foreground transition-colors">History</Link>
            <Link to="/about" className="text-primary hover:text-primary transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 space-y-12">
        <section>
          <h2 className="text-lg font-bold mb-4">How It Works: The Pipeline</h2>
          <div className="flex flex-wrap items-center gap-3 p-6 bg-[#111827] rounded-xl border border-border/50 shadow-inner">
            {["Raw Data", "Features", "ML Model", "Regimes", "Visualization", "Decision", "Web App"].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div className="px-4 py-2 bg-[#1c1f2a] rounded-lg text-sm font-semibold border border-primary/20 text-primary uppercase tracking-wide">
                  {step}
                </div>
                {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4">Model Comparison</h2>
          <div className="w-full overflow-x-auto rounded-xl border border-border/50 bg-[#111827]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1c1f2a] text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Model</th>
                  <th className="px-6 py-3 font-semibold">Complexity</th>
                  <th className="px-6 py-3 font-semibold">Accuracy</th>
                  <th className="px-6 py-3 font-semibold">Handles Overlap</th>
                  <th className="px-6 py-3 font-semibold">Time-Aware</th>
                  <th className="px-6 py-3 font-semibold">Recommended Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <tr className="hover:bg-[#1c1f2a]/50">
                  <td className="px-6 py-4 font-semibold text-primary">GMM</td>
                  <td className="px-6 py-4">Medium</td>
                  <td className="px-6 py-4">High</td>
                  <td className="px-6 py-4 text-primary">Yes</td>
                  <td className="px-6 py-4 text-muted-foreground">No</td>
                  <td className="px-6 py-4 text-xs font-mono">Default choice for statistical regimes</td>
                </tr>
                <tr className="hover:bg-[#1c1f2a]/50">
                  <td className="px-6 py-4 font-semibold">KMeans</td>
                  <td className="px-6 py-4">Low</td>
                  <td className="px-6 py-4 text-muted-foreground">Medium</td>
                  <td className="px-6 py-4 text-destructive">No</td>
                  <td className="px-6 py-4 text-muted-foreground">No</td>
                  <td className="px-6 py-4 text-xs font-mono">Fast exploratory baseline</td>
                </tr>
                <tr className="hover:bg-[#1c1f2a]/50">
                  <td className="px-6 py-4 font-semibold">HMM</td>
                  <td className="px-6 py-4 text-destructive">High</td>
                  <td className="px-6 py-4 text-primary">Very High</td>
                  <td className="px-6 py-4 text-primary">Yes</td>
                  <td className="px-6 py-4 text-primary">Yes</td>
                  <td className="px-6 py-4 text-xs font-mono">Advanced temporal sequences</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#171b26] border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#e29100]">
                <span className="text-lg">⚠️</span> Past Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Market regimes are identified retrospectively. The model's "Current Regime" is an estimate and does not guarantee future results.
            </CardContent>
          </Card>
          <Card className="bg-[#171b26] border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#e29100]">
                <span className="text-lg">⚠️</span> Delay Lag
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              GMM and KMeans models evaluate static data points without temporal correlation, leading to potential misclassification at transition boundaries.
            </CardContent>
          </Card>
          <Card className="bg-[#171b26] border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#e29100]">
                <span className="text-lg">⚠️</span> Overfitting
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              High-component HMMs are prone to overfitting to extreme singular events, classifying them as ongoing structural regimes.
            </CardContent>
          </Card>
        </section>

        <section className="pt-4 border-t border-border/20">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Built With</h2>
          <div className="flex flex-wrap gap-2">
            {["Python", "FastAPI", "yfinance", "scikit-learn", "hmmlearn", "React", "Recharts", "Tailwind", "shadcn/ui"].map(tech => (
              <Badge key={tech} variant="secondary" className="bg-[#1c1f2a] text-foreground font-mono font-medium hover:bg-[#262a35] px-3 py-1 cursor-default">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
