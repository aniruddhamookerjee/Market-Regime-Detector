import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        bull: "border-transparent text-[color:var(--regime-bull)] bg-[color:color-mix(in_srgb,var(--regime-bull)_15%,transparent)]",
        bear: "border-transparent text-[color:var(--regime-bear)] bg-[color:color-mix(in_srgb,var(--regime-bear)_15%,transparent)]",
        sideways: "border-transparent text-[color:var(--regime-sideways)] bg-[color:color-mix(in_srgb,var(--regime-sideways)_15%,transparent)]",
        volatile: "border-transparent text-[color:var(--regime-volatile)] bg-[color:color-mix(in_srgb,var(--regime-volatile)_15%,transparent)]",
        neutral: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
