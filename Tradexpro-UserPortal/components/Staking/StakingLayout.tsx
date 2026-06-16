import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import React from "react";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import useTranslation from "next-translate/useTranslation";

export default function StakingLayout({ children }: any) {
  const { t } = useTranslation("common");
  return (
    <div className={` tradex-relative`}>
      <section className="tradex-pt-[50px] tradex-relative">
        <TopLeftInnerPageCircle />
        <TopRightInnerPageCircle />
        <div className=" tradex-container tradex-relative">
          {children}
        </div>
      </section>
      <StartTrending />
      <BottomLeftInnerPageCircle />
      <BottomRigtInnerPageCircle />
    </div>
  );
}
