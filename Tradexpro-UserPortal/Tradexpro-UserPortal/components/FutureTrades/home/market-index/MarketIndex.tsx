import React from "react";

import MarketIndexCard from "./MarketIndexCard";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import useTranslation from "next-translate/useTranslation";

export default function MarketIndex({ tradeDatas }: any) {
  const { t } = useTranslation("common");
  return (
    <div className=" tradex-pt-[70px]">
      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
        <p className=" tradex-text-xl tradex-leading-6 tradex-font-medium tradex-text-title tradex-pb-3 tradex-border-b tradex-border-background-primary">
          {t("Market Index")}
        </p>

        <div className="">
          {Object.keys(tradeDatas).length !== 0 ? (
            <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-4">
              {tradeDatas?.coins?.map((item: any, index: any) => (
                <div className="" key={index}>
                  <MarketIndexCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <NoItemFound />
          )}
        </div>
      </div>
    </div>
  );
}
