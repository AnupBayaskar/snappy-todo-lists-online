import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold hover:shadow-lg hover:scale-105 active:scale-95 shadow-md",
        destructive:
          "bg-gradient-to-r from-brand-danger to-red-600 text-white font-semibold hover:shadow-lg hover:scale-105 active:scale-95 shadow-md",
        outline:
          "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm rounded-lg",
        link: "text-brand-primary underline-offset-4 hover:underline hover:text-brand-primary-dark",
        premium: "bg-gradient-to-r from-brand-primary via-brand-accent to-purple-600 text-white font-bold hover:shadow-glow hover:scale-110 active:scale-95 shadow-lg relative overflow-hidden",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-13 rounded-xl px-8 py-4 text-base font-semibold",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
