import React, { useEffect, useState } from "react";
import { getOfferListAction } from "state/actions/staking";
import OfferRow from "./OfferRow";
import SectionLoading from "components/common/SectionLoading";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import useTranslation from "next-translate/useTranslation";

const OfferTable = ({ isLoggedIn }: any) => {
  const { t } = useTranslation("common");

  const [offers, setOffers] = useState<any>([]);
  const [loading, setloading] = useState<any>(false);
  useEffect(() => {
    getOfferListAction(setOffers, setloading);
  }, []);
  return (
    <div className="!tradex-overflow-x-auto">
      {loading ? (
        <SectionLoading />
      ) : (
        <>
          {offers?.coin_type?.length > 0 ? (
            <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
              <thead>
                <tr >
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Token")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Minimum Amount")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Est. APR")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Duration Days")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {offers?.coin_type?.map((item: any, index: any) => (
                  <OfferRow
                    key={index}
                    offers={offers}
                    item={item}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <NoItemFound />
          )}
        </>
      )}
    </div>
  );
};

export default OfferTable;
