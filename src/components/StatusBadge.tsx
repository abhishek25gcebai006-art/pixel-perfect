import { DOC_STATUS_LABEL, type DocStatus } from "@/lib/gigsaathi";
import { cn } from "@/lib/utils";

const tone: Record<DocStatus, string> = {
  verified: "bg-mint/15 text-mint",
  pending: "bg-accent/15 text-accent",
  expiring: "bg-warn/15 text-warn",
  expired: "bg-rose/15 text-rose",
};

export function StatusBadge({ status, className }: { status: DocStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tone[status],
        className,
      )}
    >
      {DOC_STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-hairline bg-glass px-3 py-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-warn/30 bg-warn/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-warn uppercase",
        className,
      )}
    >
      Demo data
    </span>
  );
}
