import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  ref?: React.Ref<HTMLButtonElement>
}

function Button({ className, variant = "default", size = "default", ref, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-red-100/80",
        variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
        variant === "outline" && "border border-gray-300 bg-white hover:bg-gray-100",
        variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
        variant === "ghost" && "hover:bg-gray-100",
        variant === "link" && "text-blue-600 underline-offset-4 hover:underline",
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 px-3",
        size === "lg" && "h-11 px-8",
        size === "icon" && "h-10 w-10",
        className
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Button }