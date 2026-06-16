import React from "react";

export default function TopRightInnerPageCircle({ className }: any) {
  return (
    <div>
      <div
        className={`tradex-z-[-1] tradex-top-0 tradex-absolute tradex-right-0 tradex-w-[335px] tradex-h-[335px] tradex-rounded-full tradex-bg-primary/30 tradex-blur-[140px] ${className}`}
      />
      <img
        src="/inner_banner_top_right.png"
        className={`tradex-z-[-1] tradex-absolute tradex-top-0 tradex-right-0 ${className}`}
        alt=""
      />
      <img
        src="/inner_banner_top_left_circle.png"
        className={`tradex-z-[-1] tradex-absolute tradex-top-[65px] tradex-right-[50px] ${className}`}
        alt=""
      />
      <img
        src="/inner_banner_top_left_small_circle.png"
        className={`tradex-z-[-1] tradex-absolute tradex-top-[235px] tradex-right-[105px] ${className}`}
        alt=""
      />
    </div>
  );
}
