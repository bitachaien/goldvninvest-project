import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { OrderFilter } from "components/P2P/P2pOrder/OrderFilter";
import { OrderTable } from "components/P2P/P2pOrder/OrderTable";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { myP2pDisputeAction, myP2pOrderAction } from "state/actions/p2p";

const P2pOrder = () => {
  const [selectedMenu, setselectedMenu] = useState<any>(1);
  const { t } = useTranslation("common");

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6">
              <div className="lg:tradex-col-span-3">
                <P2PSidebar />
              </div>
              <div className=" lg:tradex-col-span-9">
                {selectedMenu === 1 && (
                  <OrderTable
                    actionFunction={myP2pOrderAction}
                    filter={true}
                    selectedMenu={selectedMenu}
                    setselectedMenu={setselectedMenu}
                  />
                )}
                {selectedMenu === 2 && (
                  <OrderTable
                    actionFunction={myP2pDisputeAction}
                    selectedMenu={selectedMenu}
                    setselectedMenu={setselectedMenu}
                  />
                )}
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
