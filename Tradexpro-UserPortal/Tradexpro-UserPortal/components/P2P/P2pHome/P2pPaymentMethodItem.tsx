import React, { useState } from "react";

export default function P2pPaymentMethodItem({ logo, name }: any) {
  const [src, setSrc] = useState(logo || "./p2p_payment_icon.png");
  return (
    <div className=" tradex-min-h-[120px] md:tradex-min-h-[170px] tradex-rounded-lg tradex-flex tradex-flex-col tradex-gap-2.5 md:tradex-gap-6 tradex-justify-center tradex-items-center tradex-border tradex-border-background-primary">
      <div className=" tradex-min-h-10 tradex-min-w-10">
        <img
          src={src}
          alt="logo"
          className="tradex-max-w-10 tradex-max-h-10 tradex-object-cover tradex-object-center tradex-w-full tradex-h-full"
          onError={() => {
            setSrc("./p2p_payment_icon.png");
          }}
        />
      </div>
      <p className=" tradex-text-base md:tradex-text-2xl tradex-leading-6 !tradex-text-title tradex-font-bold">
        {name}
      </p>
    </div>
  );
}
