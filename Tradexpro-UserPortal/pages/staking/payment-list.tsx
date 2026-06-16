import { formateData } from "common";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import StakingHeader from "components/Staking/StakingHeader";
import StakingLayout from "components/Staking/StakingLayout";
import StakingSidebar from "components/Staking/StakingSidebar";
import { StakingTopBar } from "components/Staking/common/TopBar";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { GetPaymentListAction } from "state/actions/staking";

const PaymentList = ({}: any) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const { t } = useTranslation("common");
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    GetPaymentListAction(
      5,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory
    );
  };

  useEffect(() => {
    GetPaymentListAction(5, 1, setHistory, setProcessing, setStillHistory);
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
                  {t("My Investments")}
                </h2>
              </div>
              <div className="tradex-relative tradex-z-10">
                {processing ? (
                  <SectionLoading />
                ) : (
                  <div className=" tradex-overflow-x-auto">
                    <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                      <thead>
                        <tr>
                          <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                            {t("Coin Type")}
                          </th>
                          <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                            {t("Payment Date")}
                          </th>
                          <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                            {t("Total Amount")}
                          </th>
                          <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                            {t("Total Interest")}
                          </th>
                          <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                            {t("Total Invested")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {history?.length > 0 &&
                          history?.map((item: any, index: any) => (
                            <tr
                              className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                              key={index}
                            >
                              <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                <div className="tableImg d-flex align-items-center">
                                  <h6 className="">{item?.coin_type}</h6>
                                </div>
                              </td>
                              <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                <h6 className="mx-2">
                                  {formateData(item.created_at)}
                                </h6>
                              </td>
                              <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                {item?.total_amount}
                              </td>
                              <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                {item?.total_bonus}
                              </td>
                              <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                                {item?.total_investment}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {history?.length == 0 && <NoItemFound />}
                    {history?.length > 0 && (
                      <div
                        className="pagination-wrapper"
                        id="assetBalances_paginate"
                      >
                        <span>
                          {stillHistory?.links?.map(
                            (link: any, index: number) =>
                              link.label === "&laquo; Previous" ? (
                                <a
                                  key={index}
                                  className="paginate-button"
                                  onClick={() => {
                                    if (link.url) LinkTopaginationString(link);
                                  }}
                                >
                                  <i className="fa fa-angle-left"></i>
                                </a>
                              ) : link.label === "Next &raquo;" ? (
                                <a
                                  className="paginate-button"
                                  onClick={() => LinkTopaginationString(link)}
                                  key={index}
                                >
                                  <i className="fa fa-angle-right"></i>
                                </a>
                              ) : (
                                <a
                                  className={`paginate_button paginate-number ${
                                    link.active === true && "text-warning"
                                  }`}
                                  aria-controls="assetBalances"
                                  data-dt-idx="1"
                                  onClick={() => LinkTopaginationString(link)}
                                  key={index}
                                >
                                  {link.label}
                                </a>
                              )
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </StakingLayout>

      <Footer />
    </>
  );
};
export default PaymentList;
