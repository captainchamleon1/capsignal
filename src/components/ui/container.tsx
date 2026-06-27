import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
  narrow?: boolean;
};

export function Container({ children, className, wide, narrow }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-5 lg:px-10",
        narrow && "max-w-(--width-narrow)",
        wide && "max-w-(--width-wide)",
        !wide && !narrow && "max-w-(--width-content)",
        className,
      )}
    >
      {children}
    </div>
  );
}
