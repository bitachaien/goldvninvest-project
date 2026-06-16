import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { P2pAdvantage } from "components/P2P/P2pHome/P2pAdvantage";
import { P2pDataTable } from "components/P2P/P2pHome/P2pDataTable";
import { P2pFaq } from "components/P2P/P2pHome/p2pFAQ";
import { P2pFilter } from "components/P2P/P2pHome/P2pFilter";
import { P2pPaymentMethod } from "components/P2P/P2pHome/P2pPaymentMethod";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import { P2pTab } from "components/P2P/P2pHome/P2pTab";
import { P2pWork } from "components/P2P/P2pHome/P2pWork";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import CustomPagination from "components/Pagination/CustomPagination";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { BUY, SELL } from "helpers/core-constants";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAdsMarketSettings } from "service/p2p";
import { landingPageAction, landingSettingsAction } from "state/actions/p2p";
import { RootState } from "state/store";

const P2P = ({ data }: any) => {
  const { t } = useTranslation("common");
  const [processing, setProcessing] = useState<boolean>(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  const [settings, setSettings] = useState<any>([]);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const [filters, setFilters] = useState<any>({
    type: BUY,
    amount: 0,
    coin: null,
    currency: "all",
    payment_method: "all",
    country: "all",
    per_page: 10,
    page: 1,
  });
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    landingPageAction(
      filters.type,
      filters.amount,
      filters.coin,
      filters.currency,
      filters.payment_method,
      filters.country,
      filters.per_page,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      setSettings
    );
  };
  useEffect(() => {
    landingSettingsAction(
      setProcessing,
      setSettings,
      setFilters,
      filters,
      data
    );
  }, []);
  const changeBackground = () => {
    const elements = document.getElementsByClassName("p2p_bg");

    // Loop through the elements and add the background image
    for (let i = 0; i < elements.length; i++) {
      //@ts-ignore
      elements[i].style.backgroundImage = `url('${data?.p2p_banner_img}')`;
    }
  };
  useEffect(() => {
    changeBackground();
  }, []);
  useEffect(() => {
    filters.coin &&
      landingPageAction(
        filters.type,
        filters.amount,
        filters.coin,
        filters.currency,
        filters.payment_method,
        filters.country,
        filters.per_page,
        filters.page,
        setHistory,
        setProcessing,
        setStillHistory,
        setSettings
      );
  }, [filters]);

  const handlePageClick = (event: any) => {
    landingPageAction(
      filters.type,
      filters.amount,
      filters.coin,
      filters.currency,
      filters.payment_method,
      filters.country,
      filters.per_page,
      parseInt(event.selected + 1),
      setHistory,
      setProcessing,
      setStillHistory,
      setSettings
    );
  };
  return (
    <>
      <div className=" tradex-relative">
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-max-w-[723px] tradex-mx-auto tradex-text-center tradex-space-y-4">
              <h2 className=" tradex-text-[32px] !tradex-leading-[48px] xl:tradex-text-[40px] xl:tradex-leading-[54px] !tradex-text-title">
                {data?.p2p_banner_header ||
                  t(
                    `Tradexpro Peer-to-Peer Ecosystem  unlimited   payment system`
                  )}
              </h2>
              <p className=" tradex-text-base md:tradex-text-xl tradex-leading-[28px] !tradex-text-body">
                {data?.p2p_banner_des ||
                  t(
                    `Is the largest centralized exchange globally. However, it is also a major player in the P2P trading space`
                  )}
              </p>
            </div>
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6 tradex-pt-[50px]">
              {isLoggedIn && (
                <div className=" lg:tradex-col-span-3">
                  <P2PSidebar />
                </div>
              )}
              <div
                className={
                  isLoggedIn ? "lg:tradex-col-span-9" : "lg:tradex-col-span-12"
                }
              >
                <div className=" tradex-w-full tradex-space-y-6">
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-6">
                    <div className=" tradex-border-b-[3px] tradex-border-background-primary tradex-flex tradex-items-center tradex-gap-8">
                      <button
                        onClick={() => {
                          setFilters({ ...filters, type: BUY });
                        }}
                        className={`${
                          parseInt(filters.type) === BUY
                            ? " tradex-text-primary tradex-border-primary tradex-border-b-[3px] -tradex-mb-[3px]"
                            : "tradex-text-title"
                        } tradex-min-w-10 tradex-text-left tradex-text-base tradex-leading-[22px] tradex-font-bold tradex-pb-2.5 `}
                      >
                        {t("Buy")}
                      </button>
                      <button
                        onClick={() => {
                          setFilters({ ...filters, type: SELL });
                        }}
                        className={`${
                          parseInt(filters.type) === SELL
                            ? " tradex-text-primary tradex-border-primary tradex-border-b-[3px] -tradex-mb-[3px]"
                            : "tradex-text-title"
                        } tradex-min-w-10 tradex-text-left tradex-text-base tradex-leading-[22px] tradex-font-bold tradex-pb-2.5 `}
                      >
                        {t("Sell")}
                      </button>
                    </div>
                    <div className=" tradex-flex tradex-gap-3 tradex-flex-nowrap tradex-overflow-x-auto p2p-custom-scrollbar tradex-pb-4">
                      {settings?.assets?.map((coinName: any, index: any) => (
                        <div
                          key={index}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              coin: coinName?.coin_type,
                            });
                          }}
                          className={` ${
                            filters.coin === coinName?.coin_type
                              ? "tradex-border-primary tradex-text-primary"
                              : "tradex-text-body tradex-border-background-primary "
                          } tradex-cursor-pointer tradex-py-[5px] tradex-text-nowrap tradex-px-[15px] tradex-rounded-[3px] tradex-w-fit tradex-border tradex-text-sm tradex-leading-[22px] tradex-font-semibold `}
                        >
                          <span>{coinName?.coin_type}</span>
                        </div>
                      ))}
                    </div>
                    <P2pFilter
                      setFilters={setFilters}
                      filters={filters}
                      settings={settings}
                    />
                  </div>
                  <div>
                    <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                      {processing ? (
                        <div>
                          <SectionLoading />
                        </div>
                      ) : (
                        <>
                          <P2pDataTable
                            history={history}
                            filters={filters}
                            isLoggedIn={isLoggedIn}
                          />
                        </>
                      )}
                    </div>
                    <div className=" tradex-pt-6">
                      {!processing && history?.length > 0 && (
                        <CustomPagination
                          per_page={stillHistory?.per_page}
                          current_page={stillHistory?.current_page}
                          total={stillHistory?.total}
                          handlePageClick={handlePageClick}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`tradex-z-[-1] tradex-top-[900px] tradex-absolute tradex-left-0 tradex-w-[214px] tradex-h-[214px] tradex-rounded-full tradex-bg-primary tradex-blur-[300px]`}
            />
            <div
              className={`tradex-z-[-1] tradex-top-[900px] tradex-absolute tradex-right-0 tradex-w-[214px] tradex-h-[214px] tradex-rounded-full tradex-bg-primary tradex-blur-[300px]`}
            />
            <P2pWork data={data} />
            <P2pAdvantage data={data} />
            <P2pPaymentMethod data={data} />
            {data?.p2p_faq.length > 0 && <P2pFaq data={data} />}
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { data } = await getAdsMarketSettings();
  return {
    props: {
      data: data,
    },
  };
};
export default P2P;
