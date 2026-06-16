import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import MarketIndex from "components/FutureTrades/home/market-index/MarketIndex";
import TopCharts from "components/FutureTrades/home/top-charts/TopCharts";
import TradeSections from "components/FutureTrades/home/trade-sections/TradeSections";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import request from "lib/request";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getExchangeMarketDetails } from "service/futureTrade";
import { listenMessagesFutureMarketData } from "state/actions/exchange";

export default function Index() {
  const { t } = useTranslation("common");
  const [tradeDatas, setTradeDatas] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    getTradeSectionData();
  }, []);

  const getTradeSectionData = async () => {
    const data: any = await getExchangeMarketDetails("assets");
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setTradeDatas(data.data);
  };
  return (
    <>
      <div className=" tradex-relative">
        <section className=" tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                  {t("Crypto Futures Market")}
                </h2>
              </div>

              {tradeDatas?.coins?.length > 0 && (
                <TopCharts tradeDatas={tradeDatas} />
              )}
            </div>
            <TradeSections />
            <MarketIndex tradeDatas={tradeDatas} />
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </>
  );
}
