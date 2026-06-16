import { CustomAccordion } from "components/common/CustomAccordion";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

export const P2pFaq = ({ data }: any) => {
  const { t } = useTranslation("common");
  return (
    <div className=" tradex-pt-[85px]">
      <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
        <div className=" tradex-max-w-[400px]">
          <h2 className="tradex-text-[24px] tradex-leading-[32px] md:tradex-text-[32px] md:tradex-leading-[48px] xl:tradex-text-[48px] xl:tradex-leading-[56px] !tradex-text-title">
            {t("Frequently Asked Questions")}
          </h2>
        </div>
        <div>
          {data.p2p_faq.map((faqIten: any, index: any) => (
            <span key={index}>
              <CustomAccordion faqIten={faqIten} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
