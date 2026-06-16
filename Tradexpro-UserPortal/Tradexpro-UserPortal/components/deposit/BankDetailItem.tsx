import useTranslation from "next-translate/useTranslation";
import React from "react";

type BankDetailItemProps = {
  title: string;
  content: string;
};

export default function BankDetailItem({
  title,
  content,
}: BankDetailItemProps) {
  const { t } = useTranslation("common");

  return (
    <div className="tradex-space-y-1">
      <p className=" tradex-text-base tradex-text-title tradex-font-semibold">
        {t(title)}{" "}
      </p>
      <p className="tradex-text-sm tradex-text-body">{content}</p>
    </div>
  );
}
