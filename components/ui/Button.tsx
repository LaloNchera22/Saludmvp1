import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showArrow?: boolean;
}

export function Button({ children, showArrow = true, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        bg-foreground text-background
        hover:bg-sereza-turquoise hover:text-foreground
        transition-colors duration-200
        text-[11px] font-black uppercase tracking-[0.4em]
        px-8 py-4
        border border-foreground
        ${className}
      `}
      {...props}
    >
      <span>{children}</span>
      {showArrow && <span className="ml-3 font-mono text-[14px] leading-none">→</span>}
    </button>
  );
}
