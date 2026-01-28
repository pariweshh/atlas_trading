import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "bullish" | "bearish" | "neutral" | "outline"
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300",
    bullish: "bg-green-500/10 text-green-500 border border-green-500/20",
    bearish: "bg-red-500/10 text-red-500 border border-red-500/20",
    neutral: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    outline: "border border-zinc-700 text-zinc-300",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
