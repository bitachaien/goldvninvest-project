import useTranslation from "next-translate/useTranslation";
import P2pPaymentMethodItem from "./P2pPaymentMethodItem";

export const P2pPaymentMethod = ({ data }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className=" tradex-pt-[85px]">
      <div className=" tradex-text-center">
        <h2 className="tradex-text-[24px] tradex-leading-[32px] md:tradex-text-[32px] md:tradex-leading-[48px] xl:tradex-text-[40px] xl:tradex-leading-[54px] !tradex-text-title">
          {t("Top Payment Methods")}
        </h2>
      </div>
      <div className=" tradex-pt-8">
        <div className=" tradex-grid tradex-grid-cols-2 md:tradex-grid-cols-3 lg:tradex-grid-cols-4 xl:tradex-grid-cols-6 tradex-gap-6">
          {data.payment_method_landing.map((data: any, index: any) => (
            <P2pPaymentMethodItem
              logo={data?.logo}
              name={data?.name}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
