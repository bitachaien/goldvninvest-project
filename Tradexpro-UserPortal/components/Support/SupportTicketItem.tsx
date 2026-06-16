import { formateData, formateDateMunite } from "common";
import {
  TICKET_STATUS_CLOSE,
  TICKET_STATUS_OPEN,
  TICKET_STATUS_PENDING,
} from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import SupportTicketItemBadge from "./SupportTicketItemBadge";

export const SupportTicketItem = ({ ticket }: any) => {
  const { t } = useTranslation("common");

  return (
    <Link href={"/support/" + ticket?.unique_code}>
      <div
        className={` tradex-cursor-pointer tradex-rounded-md tradex-border ${
          ticket.is_seen_by_user === 1
            ? " tradex-border-background-primary"
            : "tradex-border-primary"
        }`}
      >
        <div className=" tradex-grid tradex-grid-cols-1 sm:tradex-grid-cols-12 tradex-gap-5">
          <div className=" sm:tradex-col-span-7 lg:tradex-col-span-9">
            <div className="  tradex-p-4  tradex-gap-y-8 tradex-flex tradex-flex-col tradex-justify-between tradex-h-full">
              <div className=" tradex-space-y-3">
                <div className=" tradex-flex tradex-gap-2 lg:tradex-gap-8 tradex-items-start tradex-justify-between">
                  <div className=" tradex-flex tradex-items-start tradex-gap-1">
                    <h6 className=" tradex-text-sm sm:tradex-text-base tradex-leading-6 !tradex-text-title">
                      <span className="mr-1"># {ticket?.id}</span>
                      <span>{ticket?.title}</span>
                      <div className=" tradex-ml-1.5 tradex-inline-block">
                        {ticket?.status === TICKET_STATUS_PENDING ? (
                          <SupportTicketItemBadge
                            title={t("Pending")}
                            className="tradex-bg-yellow-500"
                          />
                        ) : ticket?.status === TICKET_STATUS_OPEN ? (
                          <SupportTicketItemBadge
                            title={t("Open")}
                            className="tradex-bg-green-500"
                          />
                        ) : ticket?.status === TICKET_STATUS_CLOSE ? (
                          <SupportTicketItemBadge
                            title={t("Close")}
                            className="tradex-bg-red-500"
                          />
                        ) : (
                          <SupportTicketItemBadge
                            title={t("Close forever")}
                            className="tradex-bg-red-500"
                          />
                        )}
                      </div>
                    </h6>
                  </div>
                  <span className=" tradex-whitespace-nowrap tradex-text-xs sm:tradex-text-sm tradex-text-body">
                    {formateDateMunite(ticket?.updated_at)}
                  </span>
                </div>

                <p className=" tradex-text-sm tradex-leading-[22px] tradex-text-body tradex-line-clamp-3">
                  {ticket?.description}
                </p>
              </div>
              <p className=" tradex-flex tradex-items-center tradex-gap-1 tradex-text-base tradex-text-primary tradex-cursor-pointer tradex-font-medium">
                <span>{t("Message")}</span>
                <span>
                  <FaArrowRight size={12} />
                </span>
              </p>
            </div>
          </div>
          <div className="sm:tradex-col-span-5 lg:tradex-col-span-3 tradex-border-l-2 tradex-border-background-primary ">
            <div className="tradex-h-full tradex-flex tradex-flex-col tradex-justify-evenly">
              <p className=" tradex-pl-2 tradex-pt-2  tradex-pr-2 tradex-border-b tradex-pb-3 tradex-text-sm tradex-leading-[22px] tradex-text-body">
                <span className=" tradex-font-semibold tradex-text-title tradex-mr-1">
                  {t("Assign To:")}
                </span>
                {ticket?.agent_name ? (
                  <span>{ticket?.agent_name}</span>
                ) : (
                  <span>{t("Not Assign")}</span>
                )}
              </p>
              <p className=" tradex-pl-2 tradex-pt-2 tradex-pr-2 tradex-border-b tradex-pb-3 tradex-text-sm tradex-leading-[22px]">
                <span className="tradex-font-semibold tradex-text-title tradex-mr-1">
                  {t("Ticket Created At:")}{" "}
                </span>
                <span>{formateData(ticket?.created_at)}</span>
              </p>
              <p className=" tradex-pl-2 tradex-pt-2 tradex-pr-2 tradex-pb-3 tradex-text-sm tradex-leading-[22px]">
                <span className="tradex-font-semibold tradex-text-title tradex-mr-1">
                  {t("Project Name:")}
                </span>
                <span>{ticket?.project?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
