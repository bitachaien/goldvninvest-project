import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import useTranslation from "next-translate/useTranslation";
import {
  FcSettings,
  FcApproval,
  FcPortraitMode,
  FcNeutralTrading,
} from "react-icons/fc";
import P2PAdvantageCard from "./P2PAdvantageCard";

export const P2pAdvantage = ({ data }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className=" tradex-relative tradex-pt-[85px]">
      <div
        className={`tradex-z-[-1] tradex-top-0 tradex-absolute tradex-left-0 tradex-w-[214px] tradex-h-[214px] tradex-rounded-full tradex-bg-primary tradex-blur-[300px]`}
      />
      <div
        className={`tradex-z-[-1] tradex-top-0 tradex-absolute tradex-left-1/2 -tradex-translate-x-1/2 tradex-w-[214px] tradex-h-[214px] tradex-rounded-full tradex-bg-primary tradex-blur-[300px]`}
      />
      <h2 className="!tradex-text-[24px] !tradex-leading-[32px] md:!tradex-text-[32px] md:!tradex-leading-[48px] xl:tradex-text-[40px] xl:tradex-leading-[54px] !tradex-text-title">
        {t("Advantage of P2P Exchange")}
      </h2>
      <div className=" tradex-pt-10 tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
        <div className=" tradex-space-y-6">
          {data?.p2p_advantage_1_heading && (
            <P2PAdvantageCard
              icon={data?.p2p_advantage_1_icon}
              heading={data?.p2p_advantage_1_heading}
              des={data?.p2p_advantage_1_des}
            />
          )}
          {data?.p2p_advantage_2_heading && (
            <P2PAdvantageCard
              icon={data?.p2p_advantage_2_icon}
              heading={data?.p2p_advantage_2_heading}
              des={data?.p2p_advantage_2_des}
            />
          )}
          {data?.p2p_advantage_3_heading && (
            <P2PAdvantageCard
              icon={data?.p2p_advantage_3_icon}
              heading={data?.p2p_advantage_3_heading}
              des={data?.p2p_advantage_3_des}
            />
          )}
          {data?.p2p_advantage_4_heading && (
            <P2PAdvantageCard
              icon={data?.p2p_advantage_4_icon}
              heading={data?.p2p_advantage_4_heading}
              des={data?.p2p_advantage_4_des}
            />
          )}
        </div>
        <div className=" tradex-flex tradex-justify-center md:tradex-justify-end">
          <img
            className="tradex-max-h-[580px]"
            src={data?.p2p_advantage_right_image}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
