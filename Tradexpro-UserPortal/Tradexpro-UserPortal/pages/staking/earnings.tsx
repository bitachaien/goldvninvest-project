import StakingHeader from "components/Staking/StakingHeader";
import StakingLayout from "components/Staking/StakingLayout";
import StakingSidebar from "components/Staking/StakingSidebar";
import { StakingTopBar } from "components/Staking/common/TopBar";
import Footer from "components/common/footer";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { earningsAction } from "state/actions/staking";

const NoDataFound = () => {
  return (
    <div className=" tradex-p-4 tradex-h-full tradex-w-full tradex-flex  tradex-flex-col tradex-justify-center tradex-items-center text-center">
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
      <p className="tradex-text-base tradex-font-medium">{`${"No data available"} `}</p>
    </div>
  );
};

const Earnings = () => {
  const [statsDetails, setStatsDetails] = useState<any>();
  const { t } = useTranslation("common");
  useEffect(() => {
    earningsAction(setStatsDetails);
  }, []);
  return (
    <>
      <StakingLayout>
        <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
          <StakingSidebar />
          <div className="lg:tradex-col-span-2 tradex-space-y-6">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                  {t("My Earnings")}
                </h2>
              </div>
              <div className=" tradex-space-y-6 sm:tradex-space-y-0 sm:tradex-grid sm:tradex-grid-cols-2 tradex-gap-6 ">
                <div className=" tradex-border tradex-border-background-primary tradex-p-3 tradex-rounded-md tradex-h-full  ">
                  <h5 className="!tradex-text-title tradex-text-base tradex-font-semibold tradex-mb-3 tradex-pb-3 tradex-border-b tradex-border-border-one">
                    {t("Total Investment")}
                  </h5>
                  {statsDetails?.total_investment.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <div className=" tradex-overflow-x-auto tradex-w-full">
                      <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                        <thead>
                          <tr className="tradex-h-[44px]">
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Coin Type")}
                            </th>
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Total Bonus")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {statsDetails?.total_investment?.map(
                            (item: any, index: any) => (
                              <tr
                                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                                key={index}
                              >
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <div className="tableImg d-flex align-items-center">
                                    <p>{item?.coin_type}</p>
                                  </div>
                                </td>
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <p className="mx-2">
                                    {parseFloat(item?.total_investment)}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className=" tradex-border tradex-border-background-primary tradex-p-3 tradex-rounded-md tradex-h-full  ">
                  <h5 className="!tradex-text-title tradex-text-base tradex-font-semibold tradex-mb-3 tradex-pb-3 tradex-border-b tradex-border-border-one">
                    {t("Disputed Investment")}
                  </h5>
                  {statsDetails?.total_paid_investment.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <div className=" tradex-overflow-x-auto tradex-w-full">
                      <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                        <thead>
                          <tr className="tradex-h-[44px]">
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Coin Type")}
                            </th>
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Total Bonus")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {statsDetails?.total_paid_investment?.map(
                            (item: any, index: any) => (
                              <tr
                                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                                key={index}
                              >
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <div className="tableImg d-flex align-items-center">
                                    <p>{item?.coin_type}</p>
                                  </div>
                                </td>
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <p className="mx-2">
                                    {parseFloat(item?.total_investment)}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className=" tradex-border tradex-border-background-primary tradex-p-3 tradex-rounded-md tradex-h-full  ">
                  <h5 className="!tradex-text-title tradex-text-base tradex-font-semibold tradex-mb-3 tradex-pb-3 tradex-border-b tradex-border-border-one">
                    {t("Total Running Investment")}
                  </h5>
                  {statsDetails?.total_running_investment.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <div className=" tradex-overflow-x-auto tradex-w-full">
                      <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                        <thead>
                          <tr className="tradex-h-[44px]">
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Coin Type")}
                            </th>
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Total Bonus")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {statsDetails?.total_running_investment?.map(
                            (item: any, index: any) => (
                              <tr
                                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                                key={index}
                              >
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <div className="tableImg d-flex align-items-center">
                                    <p>{item?.coin_type}</p>
                                  </div>
                                </td>
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <p className="mx-2">
                                    {parseFloat(item?.total_investment)}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className=" tradex-border tradex-border-background-primary tradex-p-3 tradex-rounded-md tradex-h-full  ">
                  <h5 className="!tradex-text-title tradex-text-base tradex-font-semibold tradex-mb-3 tradex-pb-3 tradex-border-b tradex-border-border-one">
                    {t("Total Dispributable Investment")}
                  </h5>
                  {statsDetails?.total_unpaid_investment.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <div className=" tradex-overflow-x-auto tradex-w-full">
                      <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                        <thead>
                          <tr className="tradex-h-[44px]">
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Coin Type")}
                            </th>
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Total Bonus")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {statsDetails?.total_unpaid_investment?.map(
                            (item: any, index: any) => (
                              <tr
                                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                                key={index}
                              >
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <div className="tableImg d-flex align-items-center">
                                    <p>{item?.coin_type}</p>
                                  </div>
                                </td>
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <p className="mx-2">
                                    {parseFloat(item?.total_investment)}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className=" tradex-col-span-2 tradex-border tradex-border-background-primary tradex-p-3 tradex-rounded-md tradex-h-full  ">
                  <h5 className="!tradex-text-title tradex-text-base tradex-font-semibold tradex-mb-3 tradex-pb-3 tradex-border-b tradex-border-border-one">
                    {t("Total Investment Cancelled")}
                  </h5>
                  {statsDetails?.total_cancel_investment.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <div className=" tradex-overflow-x-auto tradex-w-full">
                      <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                        <thead>
                          <tr className="tradex-h-[44px]">
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Coin Type")}
                            </th>
                            <th className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                              {t("Total Bonus")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {statsDetails?.total_cancel_investment?.map(
                            (item: any, index: any) => (
                              <tr
                                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                                key={index}
                              >
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <div className="tableImg d-flex align-items-center">
                                    <p>{item?.coin_type}</p>
                                  </div>
                                </td>
                                <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                  <p className="mx-2">
                                    {parseFloat(item?.total_investment)}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </StakingLayout>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/staking");

  return {
    props: {},
  };
};
export default Earnings;
