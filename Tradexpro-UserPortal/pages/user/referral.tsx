import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import Loading from "components/common/loading";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { getReferral } from "service/refer";

const Referral: NextPage = () => {
  const [referral, setReferral] = useState<any>();
  const [allData, setAllData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");
  const selectReference: any = useRef();

  useEffect(() => {
    getReferral().then((res) => {
      const code = res.data.data.url;
      setReferral(process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL + "signup?" + code);
      setAllData(res.data.data);
      setLoading(false);
    });
    return () => {
      setReferral(null);
    };
  }, []);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10 tradex-space-y-6">
            <div className=" tradex-flex tradex-gap-6 tradex-items-center">
              <h2 className="!tradex-text-title tradex-text-3xl sm:tradex-text-[40px] sm:tradex-leading-[48px] tradex-font-bold tradex-text-nowrap">
                {t("Referrals")}
              </h2>
              <hr className=" tradex-w-full tradex-bg-background-primary" />
            </div>
            <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
              <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                  <h2 className=" tradex-text-xl tradex-leading-6 tradex-font-bold !tradex-text-title">
                    {t("Invite your friends")}
                  </h2>
                </div>
                <div className=" tradex-w-full tradex-input-field tradex-flex tradex-justify-between tradex-items-center tradex-gap-6">
                  <input
                    ref={selectReference}
                    onClick={() => {
                      navigator.clipboard.writeText(referral);
                      toast.success(t("Copied to clipboard"));
                      selectReference.current.select();
                    }}
                    type="url"
                    className=" tradex-bg-transparent !tradex-border-none tradex-text-sm tradex-text-body tradex-w-full tradex-text-ellipsis tradex-overflow-hidden"
                    id="url"
                    defaultValue={referral}
                    readOnly
                  />
                  <button
                    type="button"
                    className=" tradex-text-xl tradex-text-primary tradex-min-w-[20px]"
                    onClick={() => {
                      navigator.clipboard.writeText(referral);
                      toast.success(t("Copied to clipboard"));
                      selectReference.current.select();
                    }}
                  >
                    <i className="fa fa-clone" />
                  </button>
                </div>
              </div>
              <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-flex tradex-justify-between">
                  <div className=" tradex-space-y-2">
                    <p className=" tradex-text-sm tradex-leading-4 tradex-text-title">
                      {t("Total Rewards")}
                    </p>
                    <p className=" tradex-text-xl tradex-leading-6 tradex-text-title tradex-font-bold">
                      {parseFloat(allData?.total_reward).toFixed(6)}
                    </p>
                  </div>
                  <div className=" tradex-space-y-2">
                    <p className=" tradex-text-sm tradex-leading-4 tradex-text-title">
                      {t("Total Invited")}
                    </p>
                    <p className=" tradex-text-xl tradex-leading-6 tradex-text-title tradex-font-bold">
                      {allData?.count_referrals}
                    </p>
                  </div>
                </div>
                <div className=" tradex-space-y-3">
                  <p className=" tradex-text-base tradex-text-title tradex-font-bold">
                    {t("My Referrals")}
                  </p>
                  <div className=" tradex-grid tradex-grid-cols-3 tradex-gap-4">
                    <div className="tradex-space-y-1">
                      <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                        {t("Level 1")}
                      </p>
                      <p className=" tradex-h-[25px] tradex-rounded tradex-bg-background-primary tradex-px-3 tradex-flex tradex-items-center tradex-text-xs tradex-leading-[14px] tradex-text-body">
                        {allData?.referralLevel[1]}
                      </p>
                    </div>
                    <div className="tradex-space-y-1">
                      <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                        {t("Level 2")}
                      </p>
                      <p className=" tradex-h-[25px] tradex-rounded tradex-bg-background-primary tradex-px-3 tradex-flex tradex-items-center tradex-text-xs tradex-leading-[14px] tradex-text-body">
                        {allData?.referralLevel[2]}
                      </p>
                    </div>
                    <div className="tradex-space-y-1">
                      <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                        {t("Level 3")}
                      </p>
                      <p className=" tradex-h-[25px] tradex-rounded tradex-bg-background-primary tradex-px-3 tradex-flex tradex-items-center tradex-text-xs tradex-leading-[14px] tradex-text-body">
                        {allData?.referralLevel[3]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <p className=" tradex-text-xl tradex-leading-6 tradex-font-medium tradex-text-title">
                {t("My References")}
              </p>
              <div className=" tradex-overflow-x-auto">
                <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                        {t("Full Name")}
                      </th>
                      <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                        {t("Email")}
                      </th>
                      <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                        {t("Level")}
                      </th>
                      <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                        {t("Joining Date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData?.referrals?.map((data: any, index: number) => (
                      <tr
                        key={index}
                        className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                      >
                        <td className="tradex-h-11 tradex-pr-4 last:tradex-pr-0 tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                          {data?.full_name}
                        </td>
                        <td className="tradex-h-11 tradex-pr-4 last:tradex-pr-0 tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                          {data?.email}
                        </td>
                        <td className="tradex-h-11 tradex-pr-4 last:tradex-pr-0 tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                          {data?.level}
                        </td>
                        <td className="tradex-h-11 tradex-pr-4 last:tradex-pr-0 tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                          {data?.joining_date}
                        </td>
                      </tr>
                    ))}
                    {allData?.referrals.length == 0 && (
                      <td colSpan={5} className=" tradex-text-center">
                        <div className=" tradex-p-5 tradex-text-center">
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
                      </td>
                    )}
                  </tbody>
                </table>
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
  await SSRAuthCheck(ctx, "/user/referral");
  return {
    props: {},
  };
};

export default Referral;
