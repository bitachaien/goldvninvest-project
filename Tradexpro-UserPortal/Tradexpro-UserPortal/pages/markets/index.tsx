import { CUstomSelect } from "components/common/CUstomSelect";
import MarketsCards from "components/markets/MarketsCards";
import TradesTable from "components/markets/TradesTable";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCurrenyApi, getMarketCardDatasApi } from "service/markets";
import Footer from "components/common/footer";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

async function listenMessages(setMarketsCardData: any) {
  //@ts-ignore
  window.Pusher = Pusher;
  //@ts-ignore
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "test",
    wsHost: process.env.NEXT_PUBLIC_HOST_SOCKET,
    wsPort: process.env.NEXT_PUBLIC_WSS_PORT
      ? process.env.NEXT_PUBLIC_WSS_PORT
      : 6006,
    wssPort: 443,
    forceTLS: false,
    cluster: "mt1",
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  //@ts-ignore
  window.Echo.channel(`market-overview-coin-statistic-list-data`).listen(
    ".market-overview-coin-statistic-list",
    (e: any) => {
      setMarketsCardData(e);
    }
  );
}

export default function Index() {
  const { t } = useTranslation("common");
  const [marketsCardData, setMarketsCardData] = useState<any>();
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [allCurrency, setAllCurrency] = useState([
    {
      label: "USD",
      value: "USD",
    },
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState({
    label: "USD",
    value: "USD",
  });

  useEffect(() => {
    getCurreny();
  }, []);

  useEffect(() => {
    getMarketCardDatas(selectedCurrency.value);
  }, [selectedCurrency]);

  useEffect(() => {
    listenMessages(setMarketsCardData);
  }, []);

  const getCurreny = async () => {
    const data = await getCurrenyApi();
    if (!data.success) {
      toast.error(data.message);
    }
    setAllCurrency(data.data);
  };
  const getMarketCardDatas = async (currency_type: any) => {
    const data = await getMarketCardDatasApi(currency_type);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setMarketsCardData(data.data);
  };

  const handleCoinType = (data: any) => {
    setSelectedCurrency(data);
  };

  return (
    <>
      <div className=" tradex-relative">
        <section className=" tradex-pt-[50px] tradex-relative">
          <div className=" tradex-container">
            <TopLeftInnerPageCircle />
            <div className=" tradex-space-y-12 tradex-relative tradex-z-10">
              <h2 className="!tradex-text-title tradex-text-3xl sm:tradex-text-[40px] sm:tradex-leading-[48px] tradex-font-bold">
                {t("Markets Overview")}
              </h2>
              <div className="tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-5 tradex-relative tradex-z-10">
                {marketsCardData?.highlight_coin.length > 0 && (
                  <div className="">
                    <div className="tradex-shadow-[2px_2px_29px_0px_#00000012] tradex-p-3 tradex-rounded-lg tradex-h-full  tradex-bg-background-main tradex-border-2 tradex-border-background-primary">
                      <MarketsCards
                        title={t("Highlight Coin")}
                        cardItems={marketsCardData?.highlight_coin}
                      />
                    </div>
                  </div>
                )}
                {marketsCardData?.new_listing.length > 0 && (
                  <div className="">
                    <div className="tradex-shadow-[2px_2px_29px_0px_#00000012] tradex-p-3 tradex-rounded-lg tradex-h-full  tradex-bg-background-main tradex-border-2 tradex-border-background-primary">
                      <MarketsCards
                        title={t("New Listing")}
                        cardItems={marketsCardData?.new_listing}
                      />
                    </div>
                  </div>
                )}
                {marketsCardData?.top_gainer_coin.length > 0 && (
                  <div className="">
                    <div className="tradex-shadow-[2px_2px_29px_0px_#00000012] tradex-p-3 tradex-rounded-lg tradex-h-full  tradex-bg-background-main tradex-border-2 tradex-border-background-primary">
                      <MarketsCards
                        title={t("Top Gainer Coin")}
                        cardItems={marketsCardData?.top_gainer_coin}
                      />
                    </div>
                  </div>
                )}
                {marketsCardData?.top_volume_coin.length > 0 && (
                  <div className="">
                    <div className="tradex-shadow-[2px_2px_29px_0px_#00000012] tradex-p-3 tradex-rounded-lg tradex-h-full  tradex-bg-background-main tradex-border-2 tradex-border-background-primary">
                      <MarketsCards
                        title={t("Top Volume Coin")}
                        cardItems={marketsCardData?.top_volume_coin}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <TopRightInnerPageCircle />
          </div>
          <div className=" tradex-relative tradex-z-10">
            {/* trade section start*/}
            <TradesTable selectedCurrency={selectedCurrency} />
            {/* trade section end */}
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>
      <Footer isTopPaddingEnable={true} />
    </>
  );
}
