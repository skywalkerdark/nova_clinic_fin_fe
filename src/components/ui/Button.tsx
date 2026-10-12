import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Убедись, что путь к cn корректен
import { Slot } from "radix-ui";

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-white hover:bg-primary-hover shadow-sm",
                // Алиас для старого primary:
                primary:
                    "bg-primary text-white hover:bg-primary-hover shadow-sm",

                outline:
                    "border-border bg-background text-primary hover:bg-primary/10 dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-muted hover:text-foreground",

                destructive: "bg-red-600 text-white hover:bg-red-700",
                // Алиас для старого danger:
                danger: "bg-red-600 text-white hover:bg-red-700",

                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                xs: "h-6 px-2 text-xs",
                sm: "h-7 px-2.5 text-xs",
                lg: "h-10 px-5",
                icon: "size-8",
                "icon-xs": "size-6",
                "icon-sm": "size-7",
                "icon-lg": "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot.Root : "button";

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
