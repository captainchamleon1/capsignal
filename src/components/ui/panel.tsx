import { cn } from "@/lib/utils";

type PanelProps = {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
  interactive?: boolean;
  padding?: "default" | "sm" | "none";
};

const paddingClasses = {
  default: "p-6 md:p-8",
  sm: "p-5 md:p-6",
  none: "",
};

export function Panel({
  children,
  className,
  muted,
  interactive,
  padding = "default",
}: PanelProps) {
  return (
    <div
      className={cn(
        muted ? "panel-muted" : interactive ? "panel-interactive" : "panel",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
