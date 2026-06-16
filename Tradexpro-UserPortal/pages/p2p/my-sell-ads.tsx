import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import { P2pDataTable } from "components/P2P/P2pHome/P2pDataTable";
import { P2pFilter } from "components/P2P/P2pHome/P2pFilter";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { OrderFilter } from "components/P2P/P2pOrder/OrderFilter";
import { OrderTable } from "components/P2P/P2pOrder/OrderTable";
import CustomPagination from "components/Pagination/CustomPagination";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { BUY, SELL } from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { myP2pOrderAction, userAdsFilterChangeAction } from "state/actions/p2p";
import { RootState } from "state/store";

const P2pOrder = () => {
  const { t } = useTranslation("common");
  const adsType = 2;
  const [settings, setSettings] = useState<any>([]);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const [filters, setFilters] = useState({
    type: SELL,
    amount: 0,
    coin: "all",
    currency: "all",
    payment_method: "all",
    country: "all",
    per_page: 5,
    page: 1,
    status: "all",
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    userAdsFilterChangeAction(
      filters.type,
      filters.amount,
      filters.coin,
      filters.currency,
      filters.payment_method,
      filters.status,
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
    userAdsFilterChangeAction(
      filters.type,
      filters.amount,
      filters.coin,
      filters.currency,
      filters.payment_method,
      filters.status,
      filters.country,
      filters.per_page,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      setSettings
    );
  }, [filters]);

  const handlePageClick = (event: any) => {
    userAdsFilterChangeAction(
      filters.type,
      filters.amount,
      filters.coin,
      filters.currency,
      filters.payment_method,
      filters.status,
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
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <P2PSidebar />
              <div className="lg:tradex-col-span-2">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <div className="">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("My Sell Order History")}
                    </h2>
                  </div>
                  <div>
                    {processing ? (
                      <div>
                        <SectionLoading />
                      </div>
                    ) : (
                      <P2pDataTable
                        history={history}
                        filters={filters}
                        isLoggedIn={isLoggedIn}
                        action={false}
                        payment={false}
                        edit={true}
                        adsType={adsType}
                        statusChange={true}
                        deleteBtn={true}
                      />
                    )}
                  </div>
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
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};
export default P2pOrder;
