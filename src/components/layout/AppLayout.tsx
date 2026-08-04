import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Upload,
  BarChart3,
  Landmark,
  Sparkles,
  Package as PackageIcon,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/features/Logo";
import { useApp } from "@/store/AppStore";
import { computeScores } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const NAV = [
  { to: "/app", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/app/assessment", label: "Assessment", icon: ClipboardList },
  { to: "/app/documents", label: "Documents", icon: Upload },
  { to: "/app/analysis", label: "Analysis", icon: BarChart3 },
  { to: "/app/lenders", label: "Lenders", icon: Landmark },
  { to: "/app/coach", label: "Coach", icon: Sparkles },
  { to: "/app/package", label: "Package", icon: PackageIcon },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { state, logout } = useApp();
  const navigate = useNavigate();
  const scores = computeScores(state);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card/60 lg:flex lg:flex-col">
        <div className="p-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="m-3 rounded-xl bg-primary-soft p-4">
          <p className="text-xs font-medium text-muted-foreground">Completion</p>
          <p className="font-display text-2xl font-800 text-primary">{scores.completion}%</p>
        </div>
        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </aside>

      <div className="flex-1">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur lg:hidden">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">Ready</p>
              <p className="text-sm font-800 text-primary">{scores.completion}%</p>
            </div>
            <button onClick={handleLogout} className="rounded-full p-2 hover:bg-muted">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex gap-1 overflow-x-auto border-t border-border bg-card/95 px-2 py-2 backdrop-blur scrollbar-none lg:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex min-w-[64px] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
