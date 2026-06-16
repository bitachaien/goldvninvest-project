import type { GetServerSideProps, NextPage } from "next";
import { BiShapeCircle } from "react-icons/bi";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { FaArrowRight, FaPeopleArrows } from "react-icons/fa";
import { AiOutlineUpload, AiOutlineDownload } from "react-icons/ai";
import moment from "moment";
import WalletOverviewSidebar from "layout/WalletOverviewSidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWalletOverviewDataApi } from "service/wallet-overview";
import SectionLoading from "components/common/SectionLoading";
import WalletOverviewHeader from "components/wallet-overview/WalletOverviewHeader";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { useRouter } from "next/router";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import WalletSidebar from "components/wallet/WalletSidebar";
import WalletLayout from "components/wallet/WalletLayout";
const WalletOverview: NextPage = () => {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);
  const router = useRouter();
  const [coinType, setCoinType] = useState("");

  const [walletOverviewData, setWalletOverviewData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWalletOverviewData();
  }, [coinType]);

  const getWalletOverviewData = async () => {
    setLoading(true);
    const response = await getWalletOverviewDataApi(coinType);
    if (!response.success) {
      setLoading(false);
      return;
    }

    setWalletOverviewData(response.data);
    setLoading(false);
  };

  return (
    <>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {t("Wallet Overview")}
            </h2>
          </div>
          {loading ? (
            <SectionLoading />
          ) : (
            Object.keys(walletOverviewData).length > 0 && (
              <>
                <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 tradex-gap-6">
                  <div className=" tradex-px-2 tradex-py-4 tradex-rounded-lg tradex-border tradex-border-background-primary tradex-space-y-4">
                    <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-pb-3 tradex-border-b tradex-border-background-primary">
                      <div className=" tradex-flex tradex-items-center tradex-gap-2">
                        <div className=" tradex-w-[11px] tradex-h-[11px] tradex-rounded-full tradex-bg-primary"></div>
                        <p className=" tradex-text-sm tradex-leading-4 tradex-font-bold tradex-text-primary">
                          {t("Estimated Balance")}
                        </p>
                      </div>
                      <div className=" tradex-flex tradex-items-center tradex-gap-2.5 tradex-text-sm !tradex-text-body">
                        <span>
                          {walletOverviewData?.selected_coin ?? "N/A"}
                        </span>
                        {walletOverviewData?.coins?.length > 0 && (
                          <div className="dropdown">
                            <button
                              className="dropdown-toggle wallet-overview-dropdown-tab-menu-btn"
                              type="button"
                              id="dropdownMenuButton"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            ></button>
                            <div
                              className="dropdown-menu shadow bg-main-clr min-w-4r"
                              aria-labelledby="dropdownMenuButton"
                            >
                              {walletOverviewData?.coins.map(
                                (item: any, index: any) => (
                                  <div
                                    className="dropdown-item px-1 cursor-pointer text-primary wallet-dropdown-item"
                                    key={index}
                                    onClick={() => setCoinType(item)}
                                  >
                                    {item}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <h3 className=" tradex-text-xl tradex-leading-6 !tradex-text-title tradex-font-bold">{`${
                        walletOverviewData?.total ?? "0.00000000"
                      } ${walletOverviewData?.selected_coin ?? "N/A"}`}</h3>
                      <p className=" tradex-text-sm tradex-leading-[14px] !tradex-text-body">{`${
                        walletOverviewData?.total_usd
                          ? parseFloat(walletOverviewData?.total_usd).toFixed(2)
                          : "0.00"
                      }`}</p>
                    </div>
                  </div>
                  <div className=" tradex-px-2 tradex-py-4 tradex-rounded-lg tradex-border tradex-border-background-primary tradex-space-y-4">
                    <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-pb-3 tradex-border-b tradex-border-background-primary">
                      <Link href="/user/my-wallet">
                        <div className=" tradex-cursor-pointer tradex-flex tradex-items-center tradex-gap-2">
                          <div className=" tradex-w-[11px] tradex-h-[11px] tradex-rounded-full tradex-bg-primary"></div>
                          <p className=" tradex-text-sm tradex-leading-4 tradex-font-bold tradex-text-primary">
                            {t("Spot")}
                          </p>
                        </div>
                      </Link>
                      <div className=" tradex-w-[25px] tradex-h-[25px] tradex-rounded tradex-bg-background-primary"></div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <h3 className=" tradex-text-xl tradex-leading-6 !tradex-text-title tradex-font-bold">
                        {`${
                          walletOverviewData?.spot_wallet
                            ? parseFloat(
                                walletOverviewData?.spot_wallet
                              ).toFixed(8)
                            : "0.0000000"
                        } `}{" "}
                        {`${walletOverviewData?.selected_coin ?? "N/A"}`}
                      </h3>
                      <p className=" tradex-text-sm tradex-leading-[14px] !tradex-text-body">
                        {" "}
                        {`${
                          walletOverviewData?.spot_wallet_usd
                            ? parseFloat(
                                walletOverviewData?.spot_wallet_usd
                              ).toFixed(2)
                            : "0.00"
                        }`}
                      </p>
                    </div>
                  </div>
                  {Number(settings?.enable_future_trade) === 1 && (
                    <div className=" tradex-px-2 tradex-py-4 tradex-rounded-lg tradex-border tradex-border-background-primary tradex-space-y-4">
                      <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-pb-3 tradex-border-b tradex-border-background-primary">
                        <Link href={"/futures/wallet-list"}>
                          <div className=" tradex-flex tradex-items-center tradex-gap-2 tradex-cursor-pointer">
                            <div className=" tradex-w-[11px] tradex-h-[11px] tradex-rounded-full tradex-bg-primary"></div>
                            <p className=" tradex-text-sm tradex-leading-4 tradex-font-bold tradex-text-primary">
                              {t("Futures")}
                            </p>
                          </div>
                        </Link>
                        <div className=" tradex-w-[25px] tradex-h-[25px] tradex-rounded tradex-bg-background-primary"></div>
                      </div>
                      <div className=" tradex-space-y-2">
                        <h3 className=" tradex-text-xl tradex-leading-6 !tradex-text-title tradex-font-bold">
                          {`${
                            walletOverviewData?.future_wallet
                              ? parseFloat(
                                  walletOverviewData?.future_wallet
                                ).toFixed(8)
                              : "0.0000000"
                          } `}{" "}
                          {`${walletOverviewData?.selected_coin ?? "N/A"}`}
                        </h3>
                        <p className=" tradex-text-sm tradex-leading-[14px] !tradex-text-body">{`${
                          walletOverviewData?.future_wallet_usd
                            ? parseFloat(
                                walletOverviewData?.future_wallet_usd
                              ).toFixed(2)
                            : "0.00"
                        }`}</p>
                      </div>
                    </div>
                  )}
                  {parseInt(settings?.p2p_module) === 1 && (
                    <div className=" tradex-px-2 tradex-py-4 tradex-rounded-lg tradex-border tradex-border-background-primary tradex-space-y-4">
                      <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-pb-3 tradex-border-b tradex-border-background-primary">
                        <Link href={"/p2p/p2p-wallet"}>
                          <div className=" tradex-cursor-pointer tradex-flex tradex-items-center tradex-gap-2">
                            <div className=" tradex-w-[11px] tradex-h-[11px] tradex-rounded-full tradex-bg-primary"></div>
                            <p className=" tradex-text-sm tradex-leading-4 tradex-font-bold tradex-text-primary">
                              {t("P2P")}
                            </p>
                          </div>
                        </Link>
                        <div className=" tradex-w-[25px] tradex-h-[25px] tradex-rounded tradex-bg-background-primary"></div>
                      </div>
                      <div className=" tradex-space-y-2">
                        <h3 className=" tradex-text-xl tradex-leading-6 !tradex-text-title tradex-font-bold">
                          {`${
                            walletOverviewData?.p2p_wallet
                              ? parseFloat(
                                  walletOverviewData?.p2p_wallet
                                ).toFixed(8)
                              : "0.0000000"
                          } `}{" "}
                          {`${walletOverviewData?.selected_coin ?? "N/A"}`}
                        </h3>
                        <p className=" tradex-text-sm tradex-leading-[14px] !tradex-text-body">{`${
                          walletOverviewData?.p2p_wallet_usd
                            ? parseFloat(
                                walletOverviewData?.p2p_wallet_usd
                              ).toFixed(2)
                            : "0.00"
                        }`}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          )}
        </div>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-flex tradex-justify-between tradex-items-center">
            <p className=" tradex-text-xl tradex-leading-6 tradex-font-medium tradex-text-title">
              {t("Recent Transactions")}
            </p>
            <Link href={`/user/transaction-history`}>
              <a className="tradex-bg-primary tradex-min-w-fit tradex-py-2 tradex-px-3 md:tradex-py-3 md:tradex-px-6 tradex-flex tradex-gap-2 tradex-items-center tradex-text-xs md:tradex-text-base md:tradex-leading-6 tradex-font-semibold !tradex-text-white tradex-rounded-lg hover:tradex-bg-primary hover:!tradex-text-white hover:tradex-border-primary">
                <span>{t("View More")}</span>
                <span>
                  <FaArrowRight size={14} />
                </span>
              </a>
            </Link>
          </div>
          {loading ? (
            <SectionLoading />
          ) : (
            <div>
              {walletOverviewData?.withdraw?.length > 0 ||
              walletOverviewData?.deposit?.length > 0 ? (
                <table className="table">
                  <tbody>
                    {/* for withdraw */}
                    {walletOverviewData?.withdraw.map(
                      (item: any, index: any) => (
                        <tr key={index}>
                          <td className="p-2 align-middle">
                            <div className="d-flex gap-10 align-items-center">
                              <div className="d-flex justify-content-center align-items-center bg-main-clr rounded w-36 h-36">
                                <AiOutlineUpload size={16} />
                              </div>
                              <div>
                                <span className="d-block">{t("Withdraw")}</span>
                                <small>
                                  {moment(item.created_at).format(
                                    "YYYY-MM-DD  hh:mm:ss"
                                  )}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 text-right align-middle">
                            <div>
                              <span className="d-block">
                                -{parseFloat(item?.amount).toFixed(8)}{" "}
                                {item?.coin_type}
                              </span>
                              <small>
                                <span className="completed-btn-status"></span>{" "}
                                {t("Completed")}
                              </small>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                    {/* for deposit */}
                    {walletOverviewData?.deposit?.length > 0 &&
                      walletOverviewData?.deposit.map(
                        (item: any, index: any) => (
                          <tr key={index}>
                            <td className="p-2 align-middle">
                              <div className="d-flex gap-10 align-items-center">
                                <div className="d-flex justify-content-center align-items-center bg-main-clr rounded w-36 h-36">
                                  <AiOutlineDownload size={16} />
                                </div>
                                <div>
                                  <span className="d-block">
                                    {t("Deposit")}
                                  </span>
                                  <small>
                                    {moment(item.created_at).format(
                                      "YYYY-MM-DD  hh:mm:ss"
                                    )}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 text-right align-middle">
                              <div>
                                <span className="d-block">
                                  +{parseFloat(item?.amount).toFixed(8)}{" "}
                                  {item?.coin_type}
                                </span>
                                <small>
                                  <span className="completed-btn-status"></span>{" "}
                                  {t("Completed")}
                                </small>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              ) : (
                <div className="p-3 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="tradex-mx-auto tradex-h-20 tradex-w-20 tradex-text-muted-400"
                    width="1em"
                    height="1em"
                    viewBox="0 0 48 48"
                  >
                    <circle
                      cx="27.569"
                      cy="23.856"
                      r="7.378"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></circle>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m32.786 29.073l1.88 1.88m-1.156 1.155l2.311-2.312l6.505 6.505l-2.312 2.312z"
                    ></path>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M43.5 31.234V12.55a3.16 3.16 0 0 0-3.162-3.163H7.662A3.16 3.16 0 0 0 4.5 12.55v18.973a3.16 3.16 0 0 0 3.162 3.162h22.195"
                    ></path>
                  </svg>
                  <p className="tradex-text-base tradex-font-medium">{`${"No Item Found"} `}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </WalletLayout>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/wallet-overview");

  return {
    props: {},
  };
};

export default WalletOverview;
