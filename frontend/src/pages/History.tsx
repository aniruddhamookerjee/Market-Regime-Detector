import { useState } from "react";
import { Link } from "react-router-dom";

export const History = () => {
  const [filter, setFilter] = useState("All");
  const data: any[] = [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <header className="border-b border-border/40 bg-[#1c1f2a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">RegimeRadar</h1>
          <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/history" className="text-primary hover:text-primary transition-colors">History</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 space-y-6">
        <div className="flex gap-2">
          {["All", "Bull", "Bear", "Sideways", "Volatile"].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-[#171b26] text-muted-foreground border-border/50 hover:bg-[#1c1f2a]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-border/50 bg-[#111827]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#1c1f2a] text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Date From</th>
                <th className="px-6 py-3 font-semibold">Date To</th>
                <th className="px-6 py-3 font-semibold">Duration</th>
                <th className="px-6 py-3 font-semibold">Regime</th>
                <th className="px-6 py-3 font-semibold">Avg Return</th>
                <th className="px-6 py-3 font-semibold">Volatility</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#1c1f2a] flex items-center justify-center mb-3">
                        <span className="text-xl">📊</span>
                      </div>
                      <p>No historical data loaded yet.</p>
                      <p className="text-xs mt-1 opacity-70">Run an analysis on the Dashboard to populate history.</p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
