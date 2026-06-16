import { formateData } from "common";
import {
  TICKET_STATUS_CLOSE,
  TICKET_STATUS_OPEN,
  TICKET_STATUS_PENDING,
} from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";

export const TicketUserInfo = ({ ticketDetails }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className=" tradex-space-y-2 tradex-pb-4 tradex-border-b tradex-border-background-primary">
      <p className=" tradex-text-base tradex-leading-[22px] tradex-text-body">
        <span className=" tradex-text-title tradex-font-semibold tradex-mr-1">
          {t("Assign To:")}
        </span>
        {ticketDetails?.agent?.first_name ? (
          <span>
            {ticketDetails?.agent?.first_name +
              " " +
              ticketDetails?.agent?.last_name}
          </span>
        ) : (
          <span>{t("Not Assign")}</span>
        )}
      </p>
      <p className=" tradex-text-base tradex-leading-[22px] tradex-text-body">
        <b className="tradex-text-title tradex-font-semibold tradex-mr-1">
          {t("Created At:")}{" "}
        </b>
        <span>{formateData(ticketDetails?.created_at)}</span>
      </p>
    </div>
  );
};
