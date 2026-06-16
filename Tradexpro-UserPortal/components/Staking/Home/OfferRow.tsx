import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OfferRow = ({ offers, item, isLoggedIn }: any) => {
  const { t } = useTranslation("common");

  const [selectedDays, setSelectedDays] = useState(0);
  const [selectedData, setSelectedData] = useState<any>();
  useEffect(() => {
    setSelectedData(offers?.offer_list[item][0]);
  }, []);
  return (
    <tr className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]">
      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
        <div className="tableImg d-flex align-items-center">
          <img
            src={selectedData?.coin_icon}
            alt=""
            className="min-h-25 min-w-25"
          />
          <h5>{item}</h5>
        </div>
      </td>

      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
        <h6 className="">
          {selectedData?.minimum_investment} {item}
        </h6>
      </td>
      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
        <h6 className="">{selectedData?.offer_percentage}%</h6>
      </td>

      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
        <div className=" tradex-flex tradex-gap-2 tradex-items-center tradex-flex-wrap">
          {offers?.offer_list[item]?.map((offer: any, index: any) => (
            <div
              className={
                selectedDays === index ? "StakingDaysActive" : "StakingDays"
              }
              key={index}
              onClick={() => {
                setSelectedDays(index);
                setSelectedData(offer);
              }}
            >
              {offer?.period} {t("Days")}
            </div>
          ))}
        </div>
      </td>
      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
        {isLoggedIn && (
          <Link href={`/staking/locked-staking/${item}/${selectedData?.uid}`}>
            <button className="tableButton">{t("Stake now")}</button>
          </Link>
        )}
      </td>
    </tr>
  );
};

export default OfferRow;
