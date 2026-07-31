import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "danger" | "outline";
}

export function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles =
        "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 cursor-pointer";

    const variants = {
        primary:
            "bg-primary hover:bg-primary-hover text-white shadow-sm font-semibold",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        outline: "border border-primary text-primary hover:bg-primary/10",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
