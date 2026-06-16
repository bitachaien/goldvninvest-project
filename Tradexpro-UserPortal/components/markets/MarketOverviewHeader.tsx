import React from "react";

export default function MarketOverviewHeader({ title, imageUrl }: any) {
  return (
    <div>
      <div className="my-0 market-overview-header-main bg_cover_dashboard">
        <div className="profle-are-top container-4xl">
          <h2 className="wallet-overview-header-title">{title}</h2>
        </div>
      </div>
    </div>
  );
}
