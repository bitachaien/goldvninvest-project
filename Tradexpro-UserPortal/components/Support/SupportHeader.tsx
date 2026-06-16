import React from "react";
import SupportMenuNav from "./SupportMenuNav";

export default function SupportHeader({
  title,
  imageUrl,
  getDashbaordData,
}: any) {
  return (
    <div>
      <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
        <div className="profle-are-top container-4xl">
          <h2 className="wallet-overview-header-title">{title}</h2>
        </div>
        <SupportMenuNav getDashbaordData={getDashbaordData} />
      </div>
    </div>
  );
}
