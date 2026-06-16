import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import React from "react";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import useTranslation from "next-translate/useTranslation";
import ReportSidebar from "./ReportSidebar";

export default function ReportLayout({ children }: any) {
  const { t } = useTranslation("common");
  return (
    <div className={` tradex-relative`}>
      <section className="tradex-pt-[50px] tradex-relative">
        <TopLeftInnerPageCircle />
        <TopRightInnerPageCircle />
        <div className=" tradex-container tradex-relative tradex-z-10">
          <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
            <ReportSidebar />
            <div className=" lg:tradex-col-span-2 tradex-space-y-6">
              {children}
            </div>
          </div>
        </div>
      </section>
      <StartTrending />
      <BottomLeftInnerPageCircle />
      <BottomRigtInnerPageCircle />
    </div>
  );
}
