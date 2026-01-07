import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        development: "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400",
        design: "border-transparent bg-pink-500/10 text-pink-600 dark:text-pink-400",
        productivity: "border-transparent bg-green-500/10 text-green-600 dark:text-green-400",
        communication: "border-transparent bg-orange-500/10 text-orange-600 dark:text-orange-400",
        analytics: "border-transparent bg-purple-500/10 text-purple-600 dark:text-purple-400",
        other: "border-transparent bg-gray-500/10 text-gray-600 dark:text-gray-400",
        pending: "border-transparent bg-warning/10 text-warning",
        approved: "border-transparent bg-success/10 text-success",
        rejected: "border-transparent bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
