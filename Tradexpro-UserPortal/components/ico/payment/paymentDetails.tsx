import BankDetailItem from "components/deposit/BankDetailItem";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { TokenPriceInfo } from "service/launchpad";

const PaymentDetails = ({
  currency,
  amount,
  phase_id,
  payer_wallet,
  token_id,
  payment_method,
  data,
  setData,
}: any) => {
  const { t } = useTranslation("common");
  const getTokenInfo = async () => {
    const response = await TokenPriceInfo(
      amount,
      phase_id,
      payer_wallet,
      currency,
      payer_wallet,
      token_id,
      payment_method
    );
    setData(response.data);
  };
  useEffect(() => {
    getTokenInfo();
  }, [currency, amount, phase_id]);
  return (
    <div className="tradex-space-y-4">
      <h1 className=" tradex-text-xl !tradex-text-title">
        {t("Payment Details")}
      </h1>
      {data ? (
        <div className="tradex-p-5 tradex-rounded tradex-border tradex-border-background-primary tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-3 tradex-gap-x-4 tradex-gap-y-6">
          <BankDetailItem
            title="Token Price"
            content={data.token_price ?? ""}
          />
          <BankDetailItem
            title="Token Currency"
            content={data.token_currency ?? ""}
          />
          <BankDetailItem
            title="Token Amount"
            content={data.token_amount ?? ""}
          />
          <BankDetailItem
            title="Total Token Price"
            content={data.token_total_price ?? ""}
          />
          <BankDetailItem title="Pay Amount" content={data.pay_amount ?? ""} />
          <BankDetailItem
            title="Pay Currency"
            content={data.pay_currency ?? ""}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PaymentDetails;
