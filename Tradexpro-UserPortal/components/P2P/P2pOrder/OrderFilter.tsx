import { CUstomSelect } from "components/common/CUstomSelect";
import {
  NEGATIVE,
  POSITIVE,
  RECEIVE,
  SEND,
  TRADE_STATUS_CANCELED,
  TRADE_STATUS_CANCELED_TIME_EXPIRED,
  TRADE_STATUS_ESCROW,
  TRADE_STATUS_PAYMENT_DONE,
  TRADE_STATUS_REFUNDED_BY_ADMIN,
  TRADE_STATUS_RELEASED_BY_ADMIN,
  TRADE_STATUS_TRANSFER_DONE,
} from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { TbFileTime } from "react-icons/tb";

export const OrderFilter = ({
  setSelectedStatus,
  filterData,
  setSelectedCoins,
  setFromData,
  setToData,
}: any) => {
  const { t } = useTranslation("common");

  const [coins, setCoins] = useState([]);
  const options = [
    { value: TRADE_STATUS_CANCELED_TIME_EXPIRED, label: "Expired" },
    { value: TRADE_STATUS_ESCROW, label: "Escrow" },
    { value: TRADE_STATUS_PAYMENT_DONE, label: "Payment Done" },
    { value: TRADE_STATUS_TRANSFER_DONE, label: "Transfer Done" },
    { value: TRADE_STATUS_CANCELED, label: "Canceled" },
    { value: TRADE_STATUS_REFUNDED_BY_ADMIN, label: "Refunded by admin" },
    { value: TRADE_STATUS_RELEASED_BY_ADMIN, label: "Released by admin" },
  ];
  useEffect(() => {
    let myCoins: any = [];
    filterData?.coins?.map((coin: any) => {
      const obj = {
        value: coin.coin_type,
        label: coin?.coin_type,
      };
      myCoins.push(obj);
    });

    setCoins(myCoins);
  }, [filterData?.coins]);
  return (
    <div className="tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-6">
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("Coins")}:
        </label>
        <CUstomSelect
          options={coins}
          isSearchable={false}
          placeholder={t("All Coins")}
          handleFunction={(e: any) => {
            setSelectedCoins(e);
          }}
        />
      </div>
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("Order Type")}:
        </label>
        <CUstomSelect
          options={options}
          isSearchable={false}
          // placeholder="Buy/Sell"
          handleFunction={(e: any) => {
            setSelectedStatus(e.value);
          }}
        />
      </div>
      {/* <div className="tradex-space-y-2">
          <label>Status:</label>
          <CUstomSelect
            options={options}
            isSearchable={false}
            placeholder="All Status"
            handleFunction={(e: any) => {
              setSelectedStatus(e.value);
            }}
          />
        </div> */}
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("From")}:
        </label>
        <input
          className=" tradex-block !tradex-bg-transparent tradex-w-full tradex-px-1 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
          type="date"
          name="to_date"
          onChange={(e) => {
            setFromData(e.target.value);
          }}
        />
      </div>
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("To")}:
        </label>
        <input
          className="tradex-block !tradex-bg-transparent tradex-w-full tradex-px-1 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
          type="date"
          name="to_date"
          onChange={(e) => {
            setToData(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
