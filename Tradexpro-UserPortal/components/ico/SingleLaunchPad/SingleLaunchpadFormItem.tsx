import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SingleLaunchpadFormItem({ title, content }: any) {
  const { t } = useTranslation("common");

  return (
    <div className=" tradex-space-y-1">
      <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-normal">
        {t(title)}
      </p>
      <div className=" tradex-text-sm tradex-leading-[16px] tradex-font-semibold tradex-text-title tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent">
        <span>{content}</span>
      </div>
    </div>
  );
}
