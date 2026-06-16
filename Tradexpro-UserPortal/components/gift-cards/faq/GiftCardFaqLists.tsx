import React from "react";
import GiftCardsFaq from "./GiftCardsFaq";
import useTranslation from "next-translate/useTranslation";
type faq = {
  question: string;
  answer: string;
};
export default function GiftCardFaqLists({ faqLists }: any) {
  const { t } = useTranslation("common");
  return (
    <>
      {faqLists?.length > 0 && (
        <div className="py-80">
          <div className="container-4xl">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="!tradex-text-title tradex-text-xl tradex-font-semibold">{t("Faq")}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              {faqLists.map((item: faq, index: number) => (
                <GiftCardsFaq key={index} faq={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
