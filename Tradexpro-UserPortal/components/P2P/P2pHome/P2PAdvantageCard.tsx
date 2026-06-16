import React from "react";

export default function P2PAdvantageCard({ icon, heading, des }: any) {
  return (
    <div className=" tradex-p-4 tradex-flex tradex-gap-3 tradex-rounded-lg tradex-border tradex-border-background-primary hover:tradex-bg-background-card">
      <div className=" tradex-min-w-10">
        <img src={icon} height={40} width={40} />
      </div>
      <div className=" tradex-space-y-2">
        <h5 className=" tradex-text-lg md:tradex-text-2xl tradex-leading-6 !tradex-text-title">
          {heading}
        </h5>
        <p className=" tradex-text-sm md:tradex-text-base tradex-leading-[22px] !tradex-text-body">
          {des}
        </p>
      </div>
    </div>
  );
}
