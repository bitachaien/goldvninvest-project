import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  children,
  className = "tradex-bg-green-500",
}: BadgeProps) {
  return (
    <span
      className={` tradex-px-2 tradex-py-0.5 tradex-font-bold tradex-rounded-full tradex-text-xs tradex-inline-flex tradex-justify-center tradex-items-center tradex-gap-2 tradex-text-white ${className}`}
    >
      {children}
    </span>
  );
}
