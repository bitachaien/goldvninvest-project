import Footer from "components/common/footer";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { TradeDetails } from "components/P2P/P2pProfile/TradeDetails";
import { FeedbackTable } from "components/P2P/P2pProfile/FeedbackTable";
import { ProfileHeader } from "components/P2P/P2pProfile/ProfileHeader";
import { PaymentTable } from "components/P2P/P2pProfile/PaymentTable";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { userCenterAction } from "state/actions/p2p";
import SectionLoading from "components/common/SectionLoading";
import useTranslation from "next-translate/useTranslation";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const P2pProfile = () => {
  const { t } = useTranslation("common");

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>();
  useEffect(() => {
    userCenterAction(setLoading, setDetails);
  }, []);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <P2PSidebar />
              <div className=" tradex-col-span-2 tradex-space-y-8">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-flex tradex-flex-col sm:tradex-flex-row tradex-gap-4 sm:tradex-justify-between sm:tradex-items-center">
                    <h4 className=" tradex-text-[40px] tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                      {t("User center")}
                    </h4>
                    {!loading && (
                      <div className=" tradex-px-3 tradex-py-2 tradex-border tradex-border-background-primary tradex-rounded tradex-flex tradex-items-center tradex-gap-2.5">
                        <div className=" tradex-min-w-8">
                          <img
                            src="https://api-tradex.nftarttoken.xyz/images/avatars/yellow-hat.png"
                            alt=""
                            className=" tradex-max-w-8 tradex-max-h-8 tradex-h-8 tradex-w-8 tradex-rounded-full"
                          />
                        </div>
                        <p className=" tradex-text-lg tradex-leading-6 tradex-text-title tradex-font-semibold">
                          {details?.user?.first_name} {details?.user?.last_name}
                        </p>
                      </div>
                    )}
                  </div>
                  {!loading && (
                    <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-4">
                      <div className=" tradex-space-y-2">
                        <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                          {t("30d Trades")}
                        </p>
                        <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                          {details?.completion_rate_30d
                            ? details?.completion_rate_30d
                            : 0}{" "}
                          %
                        </div>
                      </div>
                      <div className=" tradex-space-y-2">
                        <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                          {t("First order at")}
                        </p>
                        <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                          {details?.first_order_at} {t("days ago")}
                        </div>
                      </div>
                      <div className=" tradex-space-y-2">
                        <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                          {t("Negative reviews")}
                        </p>
                        <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                          {details?.negative}
                        </div>
                      </div>
                      <div className=" tradex-space-y-2">
                        <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                          {t("Positive reviews")}
                        </p>
                        <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                          {details?.positive}
                        </div>
                      </div>
                      <div className=" tradex-space-y-2 sm:tradex-col-span-2">
                        <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                          {t("Positive reviews percentage")}
                        </p>
                        <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                          {details?.positive_feedback}%
                        </div>
                      </div>
                      <div className=" tradex-space-y-2">
                        <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                          {t("Total trades")}
                        </p>
                        <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                          {details?.total_trade}
                        </div>
                      </div>
                      <div className=" tradex-space-y-2">
                        <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                          {t("Registered at")}
                        </p>
                        <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                          {details?.user_register_at} {t("days ago")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {loading ? (
                  <SectionLoading />
                ) : (
                  <>
                    <PaymentTable />
                    <FeedbackTable details={details} />
                  </>
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
export default P2pProfile;
