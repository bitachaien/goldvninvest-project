import { copyTextById } from "common";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import BankDetailItem from "./BankDetailItem";

const BankDetails = ({ bankInfo }: any) => {
  const { t } = useTranslation("common");
  return (
    <div className=" tradex-p-5 tradex-rounded tradex-border tradex-border-background-primary tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-3 tradex-gap-x-4 tradex-gap-y-6">
      <BankDetailItem title="Account Number" content={bankInfo.iban ?? ""} />
      <BankDetailItem title="Bank name" content={bankInfo.bank_name ?? ""} />
      <BankDetailItem
        title="Bank address"
        content={bankInfo.bank_address ?? ""}
      />
      <BankDetailItem
        title="Account holder name"
        content={bankInfo.account_holder_name ?? ""}
      />
      <BankDetailItem
        title="Account holder address"
        content={bankInfo.account_holder_address ?? ""}
      />
      <BankDetailItem title="Swift code" content={bankInfo.swift_code ?? ""} />
    </div>
  );
};

export default BankDetails;
