import { copyTextById } from "common";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import BankDetailItem from "./BankDetailItem";

const BankDetails = ({ bankInfo, methodName = "" }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="tradex-p-5 tradex-rounded tradex-border tradex-border-background-primary tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-3 tradex-gap-x-4 tradex-gap-y-6">
      {methodName && (
        <BankDetailItem title={t("Method Name")} content={methodName ?? ""} />
      )}
      {Object.entries(bankInfo).map(([key, field]: any) => (
        <BankDetailItem
          key={key}
          title={field.title}
          content={field.value ?? ""}
        />
      ))}
    </div>
  );
};

export default BankDetails;
