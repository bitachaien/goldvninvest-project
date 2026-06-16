import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function WithdrawTopCardItem({ title, content, img }: any) {
  const { t } = useTranslation("common");

  return (
    <div className=" tradex-group hover:tradex-shadow-[4px_4px_50px_0px_#8C8C8C30] tradex-rounded-lg tradex-border tradex-border-background-primary tradex-bg-background-main tradex-min-h-[130px] tradex-flex tradex-items-center tradex-gap-3 tradex-p-4">
      <div className=" tradex-w-[60px] tradex-h-[60px] tradex-min-w-[60px] tradex-bg-background-main tradex-flex tradex-justify-center tradex-items-center tradex-rounded-lg tradex-border tradex-border-background-primary">
        <img src={img} className=" tradex-max-w-11" alt="" />
      </div>
      <div className=" tradex-space-y-2">
        <p className=" tradex-text-title  group-hover:tradex-text-primary tradex-text-xl tradex-leading-6 tradex-font-bold">
          {title}
        </p>
        <p className=" tradex-text-base tradex-leading-5 tradex-text-body">
          {t(content)}
        </p>
      </div>
    </div>
  );
}
