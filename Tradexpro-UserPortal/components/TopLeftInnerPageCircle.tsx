import React from "react";

export default function TopLeftInnerPageCircle({ className }: any) {
  return (
    <div>
      <div
        className={`tradex-z-[-1] tradex-top-0 tradex-absolute tradex-left-0 tradex-w-[335px] tradex-h-[335px] tradex-rounded-full tradex-bg-primary/30 tradex-blur-[140px] ${className}`}
      />
      <img
        src="/inner_banner_top_left_circle.png"
        className=" tradex-absolute tradex-top-[30px] tradex-left-[40px]"
        alt=""
      />
      <img
        src="/inner_banner_top_left_small_circle.png"
        className={`tradex-z-[-1] tradex-absolute tradex-top-[212px] tradex-left-[100px] ${className}`}
        alt=""
      />
    </div>
  );
}
