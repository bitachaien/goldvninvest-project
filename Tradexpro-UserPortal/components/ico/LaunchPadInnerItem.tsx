import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function LaunchPadInnerItem({ title, content, classes }: any) {
  const { t } = useTranslation("common");

  return (
    <div
      className={` tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-flex tradex-justify-between tradex-items-center tradex-gap-6 ${classes}`}
    >
      <p className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold">
        {t(title)}
      </p>
      <p className="tradex-text-base tradex-leading-5 tradex-text-primary tradex-font-medium">
        {content}
      </p>
    </div>
  );
}
