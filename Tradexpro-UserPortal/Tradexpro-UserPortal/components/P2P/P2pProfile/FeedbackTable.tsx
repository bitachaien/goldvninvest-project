import { NoItemFound } from "components/NoItemFound/NoItemFound";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import FeedbackTableItem from "./FeedbackTableItem";

export const FeedbackTable = ({ details }: any) => {
  const { t } = useTranslation("common");

  const [active, setActive] = useState(0);
  return (
    <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
      <div>
        <div className=" tradex-flex tradex-items-center tradex-border-b tradex-border-background-primary  tradex-gap-6 tradex-text-base tradex-leading-[22px] tradex-text-body tradex-font-semibold">
          <a
            className={`${
              active === 0
                ? " tradex-border-b tradex-border-primary tradex-text-title -tradex-mb-[1px]"
                : "tradex-border-background-primary "
            } tradex-pb-3 tradex-min-w-[40px] tradex-cursor-pointer tradex-text-center`}
            onClick={() => {
              setActive(0);
            }}
          >
            {t("All")}
          </a>

          <a
            className={`${
              active === 1
                ? " tradex-border-b tradex-border-primary tradex-text-title -tradex-mb-[1px]"
                : "tradex-border-background-primary "
            } tradex-pb-3  tradex-min-w-[40px] tradex-cursor-pointer tradex-text-center`}
            onClick={() => {
              setActive(1);
            }}
          >
            {t("Positive")}
          </a>

          <a
            className={`${
              active === 2
                ? " tradex-border-b tradex-border-primary tradex-text-title -tradex-mb-[1px]"
                : "tradex-border-background-primary "
            } tradex-pb-3  tradex-min-w-[40px] tradex-cursor-pointer tradex-text-center`}
            onClick={() => {
              setActive(2);
            }}
          >
            {t("Negative")}
          </a>
        </div>
        <div className=" tradex-mt-6">
          {active === 0 && (
            <>
              {details?.feedback_list?.length === 0 && (
                <div className=" tradex-p-4">
                  <NoItemFound msg="No review found" />
                </div>
              )}
              <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-5">
                {details?.feedback_list?.map(
                  (list: any, index: any) =>
                    list.feedback && (
                      <FeedbackTableItem
                        img={list?.user_img}
                        name={list?.user_name}
                        feedback_type={list.feedback_type}
                        feedback={list?.feedback}
                        key={index}
                      />
                    )
                )}
              </div>
            </>
          )}
          {active === 1 && (
            <>
              {details?.positive_feedback_list?.length === 0 && (
                <div className="tradex-p-4">
                  <NoItemFound msg="No review found" />
                </div>
              )}
              <div className="tradex-grid sm:tradex-grid-cols-2 tradex-gap-5">
                {details?.positive_feedback_list?.map(
                  (list: any, index: any) =>
                    list.feedback && (
                      <FeedbackTableItem
                        img={list?.user_img}
                        name={list?.user_name}
                        feedback_type={list.feedback_type}
                        feedback={list?.feedback}
                        key={index}
                      />
                    )
                )}
              </div>
            </>
          )}
          {active === 2 && (
            <>
              {details?.negative_feedback_list?.length === 0 && (
                <div className="tradex-p-4">
                  <NoItemFound msg="No review found" />
                </div>
              )}
              <div className="tradex-grid sm:tradex-grid-cols-2 tradex-gap-5">
                {details?.negative_feedback_list?.map(
                  (list: any, index: any) =>
                    list.feedback && (
                      <FeedbackTableItem
                        img={list?.user_img}
                        name={list?.user_name}
                        feedback_type={list.feedback_type}
                        feedback={list?.feedback}
                        key={index}
                      />
                    )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
