import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Briefcase,
  FileText,
  Gauge,
  HeartHandshake,
  IndianRupee,
  LogOut,
  Shield,
  Sparkles,
  User,
  Wand2,
} from "lucide-react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { notificationsQuery, profileQuery, rolesQuery } from "@/lib/queries";
import { Aurora } from "@/components/Aurora";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/benefits", label: "Benefits", icon: HeartHandshake },
  { to: "/find-work", label: "Find Work", icon: Briefcase },
  { to: "/matching", label: "Platform match", icon: Wand2 },
  { to: "/plans", label: "Plans", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const MOBILE_NAV = NAV.filter((n) =>
  ["/dashboard", "/earnings", "/documents", "/benefits", "/profile"].includes(n.to),
);

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery(profileQuery);
  const { data: roles } = useQuery(rolesQuery);
  const { data: notifications } = useQuery(notificationsQuery);

  const unread = (notifications ?? []).filter((n) => !n.is_read).length;
  const isAdmin = (roles ?? []).includes("admin");
  const initials =
    (profile?.full_name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "GS";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative min-h-screen">
      <Aurora />
      <div className="mx-auto flex max-w-7xl gap-5 px-3 pt-4 pb-24 sm:px-6 lg:pb-8">
        <aside className="panel sticky top-4 hidden h-[calc(100vh-2rem)] w-56 shrink-0 flex-col rounded-2xl p-3 lg:flex">
          <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-extrabold">
              G
            </span>
            <span>
              <span className="block leading-none font-bold">GigSaathi</span>
              <span className="text-[11px] text-muted-foreground">Worker dashboard</span>
            </span>
          </Link>

          <nav className="mt-6 flex flex-col gap-1 text-sm">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-glass hover:text-foreground"
                activeProps={{ className: "bg-glass-strong text-foreground font-semibold" }}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-glass hover:text-foreground"
                activeProps={{ className: "bg-glass-strong text-foreground font-semibold" }}
              >
                <Shield className="size-4" />
                Admin
              </Link>
            )}
          </nav>

          <button
            onClick={signOut}
            className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="panel mb-5 flex items-center justify-between rounded-2xl px-4 py-3">
            <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
              <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-extrabold">
                G
              </span>
              <span className="font-extrabold tracking-tight">GigSaathi</span>
            </Link>
            <p className="hidden text-sm text-muted-foreground lg:block">
              {profile?.city ? `${profile.city}${profile.state ? `, ${profile.state}` : ""}` : "India"}
            </p>
            <div className="flex items-center gap-2">
              <Link
                to="/notifications"
                className="relative grid size-9 place-items-center rounded-full border border-hairline bg-glass transition-colors hover:bg-glass-strong"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-rose text-[10px] font-bold text-foreground">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold"
                aria-label="Profile"
              >
                {initials}
              </Link>
            </div>
          </header>

          {children}
        </div>
      </div>

      <nav className="panel fixed inset-x-0 bottom-0 z-40 flex justify-around rounded-none border-x-0 border-b-0 px-2 py-2 lg:hidden">
        {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg py-1 text-[10px] text-muted-foreground",
            )}
            activeProps={{ className: "text-accent" }}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("panel rounded-2xl p-4 sm:p-5", className)}>{children}</section>;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
}: {
  icon?: typeof Sparkles;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline px-6 py-12 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-glass">
        <Icon className="size-5 text-muted-foreground" />
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
