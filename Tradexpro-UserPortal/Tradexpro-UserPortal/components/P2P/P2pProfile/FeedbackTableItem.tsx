import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function FeedbackTableItem({
  img,
  name,
  feedback_type,
  feedback,
}: any) {
  const { t } = useTranslation("common");
  return (
    <div className=" tradex-p-5 tradex-rounded tradex-space-y-3 tradex-border tradex-border-background-primary">
      <div className=" tradex-flex tradex-justify-between tradex-gap-5 tradex-items-center tradex-pb-2 tradex-border-b tradex-border-background-primary">
        <div className=" tradex-flex tradex-gap-3 tradex-items-center">
          <div className=" tradex-min-w-[30px]">
            <img
              src={img || "/user.jpeg"}
              className=" tradex-w-full tradex-h-full tradex-max-w-[30px] tradex-max-h-[30px] tradex-object-cover tradex-object-center tradex-rounded-full"
              alt=""
            />
          </div>
          <p className=" tradex-text-base tradex-leading-[22px] tradex-text-title">
            {name}
          </p>
        </div>
        {parseInt(feedback_type) === 1 ? (
          <p>
            <span className=" tradex-text-green-600">{t("Positive")}</span>
          </p>
        ) : (
          <p>
            <span className="tradex-text-red-600">{t("Negetive")}</span>
          </p>
        )}
      </div>
      <p className=" tradex-text-body">{feedback}</p>
    </div>
  );
}
