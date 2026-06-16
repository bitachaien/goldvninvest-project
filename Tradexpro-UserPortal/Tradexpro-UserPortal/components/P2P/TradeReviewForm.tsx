import { NEGATIVE, POSITIVE } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function TradeReviewForm({
  setFeedback,
  feedback,
  feedbackType,
  setfeedbackType,
  submitHandler,
  headingText,
}: any) {
  const { t } = useTranslation("common");
  return (
    <div className="tradex-col-span-2  tradex-space-y-6">
      <div className="tradex-px-3 tradex-py-4 tradex-border tradex-border-background-primary tradex-rounded tradex-space-y-4">
        <div className="tradex-space-y-4">
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t(headingText)}
            </label>

            <textarea
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
              }}
              className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-bg-transparent !tradex-border !tradex-border-background-primary tradex-rounded-md"
              placeholder=""
            ></textarea>
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Review type")}
            </label>

            <div className=" tradex-flex tradex-items-center tradex-gap-4">
              <div
                className={`${
                  feedbackType === POSITIVE
                    ? "tradex-bg-primary !tradex-text-white"
                    : "tradex-text-primary"
                } tradex-text-sm tradex-leading-[22px] tradex-font-semibold tradex-min-h-8 tradex-w-full tradex-rounded tradex-border tradex-border-primary tradex-flex tradex-items-center tradex-justify-center`}
                onClick={() => {
                  setfeedbackType(POSITIVE);
                }}
              >
                {t("Positive")}
              </div>
              <div
                className={`${
                  feedbackType === NEGATIVE
                    ? "tradex-bg-primary !tradex-text-white"
                    : "tradex-text-primary"
                } tradex-text-sm tradex-leading-[22px] tradex-font-semibold tradex-min-h-8 tradex-w-full tradex-rounded tradex-border tradex-border-primary tradex-flex tradex-items-center tradex-justify-center`}
                onClick={() => {
                  setfeedbackType(NEGATIVE);
                }}
              >
                {t("Negative")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className=" tradex-bg-primary !tradex-text-white tradex-text-base tradex-leading-[22px] tradex-font-semibold tradex-min-h-12 tradex-w-full tradex-rounded tradex-border tradex-border-primary tradex-flex tradex-items-center tradex-justify-center"
        onClick={submitHandler}
      >
        {t("Submit review")}
      </button>
    </div>
  );
}
