import React from "react";
import MarketsCardItem from "./MarketsCardItem";
import useTranslation from "next-translate/useTranslation";

export default function MarketsCards({ title, cardItems }: any) {
  const { t } = useTranslation("common");

  return (
    <div>
      <p className=" !tradex-text-title tradex-text-base tradex-leading-5 tradex-font-medium tradex-mb-4 tradex-pb-3 tradex-border-b  tradex-border-background-primary">
        {title}
      </p>

      <div className=" tradex-space-y-4">
        {cardItems?.length > 0
          ? cardItems.map((item: any, index: any) => (
              <div key={index}>
                <MarketsCardItem item={item} />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
