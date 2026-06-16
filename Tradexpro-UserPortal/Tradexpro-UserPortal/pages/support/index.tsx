import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import CustomPagination from "components/Pagination/CustomPagination";
import PaginationGlobal from "components/Pagination/PaginationGlobal";
import StartTrending from "components/StartTrending";
import SupportHeader from "components/Support/SupportHeader";
import SupportHeaderCard from "components/Support/SupportHeaderCard";
import SupportLeftSidebar from "components/Support/SupportLeftSidebar";
import { SupportTicketFilter } from "components/Support/SupportTicketFilter";
import { SupportTicketItem } from "components/Support/SupportTicketItem";
import { SupportCard } from "components/Support/support-card";
import { TicketBox } from "components/Support/ticket-box";
import { TicketFilter } from "components/Support/ticket-filter";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import SupportSidebar from "layout/supportSidebar";
import {
  SSRAuthCheck,
  pageAvailabilityCheck,
} from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  knowledgebaseSupportProjectList,
  supportTicketList,
} from "service/knowledgebase";
import { customPage, landingPage, landingPageSlug } from "service/landing-page";

const Support = () => {
  const { t } = useTranslation("common");
  const [fullDashboar, setFullDashboard] = useState<any>();
  const [loading, setloading] = useState<any>(false);
  const [ticket_list, setTicket_list] = useState<any>();
  const [projectList, setProjectList] = useState([]);
  const [filter, setfilter] = useState<any>({
    project: "",
    status: "",
    from: "",
    to: "",
  });
  const getDashbaordData = async () => {
    setloading(true);

    const DashboardData = await supportTicketList(5, 1, "", "", "", "", "");
    setFullDashboard(DashboardData.data);
    setTicket_list(DashboardData?.data?.ticket_list);
    setloading(false);
  };

  const getProjectList = async () => {
    const { data } = await knowledgebaseSupportProjectList();
    setProjectList(data?.project_list);
  };
  const searchDashboardData = async (query: any) => {
    setloading(true);
    const DashboardData = await supportTicketList(5, 1, query, "", "", "", "");
    setFullDashboard(DashboardData.data);
    setTicket_list(DashboardData?.data?.ticket_list);
    setloading(false);
  };
  const FilterDashboardData = async () => {
    setloading(true);

    const DashboardData = await supportTicketList(
      5,
      1,
      "",
      filter.status,
      filter.project,
      filter.from,
      filter.to
    );
    setFullDashboard(DashboardData.data);
    setTicket_list(DashboardData?.data?.ticket_list);
    setloading(false);
  };

  useEffect(() => {
    getDashbaordData();
    getProjectList();
  }, []);

  const handlePageClick = async (event: any) => {
    setloading(true);

    const response = await supportTicketList(
      5,
      parseInt(event.selected + 1),
      "",
      "",
      "",
      "",
      ""
    );
    setFullDashboard(response.data);
    setTicket_list(response?.data?.ticket_list);
    setloading(false);
  };
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6">
              <div className="lg:tradex-col-span-3">
                <SupportLeftSidebar />
              </div>
              <div className=" lg:tradex-col-span-9">
                <div className=" tradex-space-y-9">
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                    <h4 className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                      {t("Support Dashboard")}
                    </h4>
                    <div className=" tradex-grid sm:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-6">
                      <SupportHeaderCard
                        content="Total Ticket"
                        icon_name="fas fa-ticket-alt"
                        title={fullDashboar?.ticket_count?.total_ticket_count}
                        img="/total_ticker.png"
                      />
                      <SupportHeaderCard
                        content="Pending Ticket"
                        icon_name="fas fa-clock"
                        title={
                          fullDashboar?.ticket_count?.total_pending_ticket_count
                        }
                        img={"/pending_ticket.png"}
                      />
                      <SupportHeaderCard
                        content="Open Ticket"
                        icon_name="fas fa-folder-open"
                        title={
                          fullDashboar?.ticket_count?.total_open_ticket_count
                        }
                        img={"/open_ticket.png"}
                      />
                      <SupportHeaderCard
                        content="Close Ticket"
                        icon_name="fas fa-check-circle"
                        title={
                          fullDashboar?.ticket_count
                            ?.total_close_forever_ticket_count
                        }
                        img={"/close_ticket.png"}
                      />
                    </div>
                  </div>
                  <div className=" tradex-space-y-4">
                    <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                      <div className=" tradex-space-y-6">
                        <div className=" tradex-space-y-4">
                          <h3 className=" tradex-text-2xl tradex-leading-7 !tradex-text-title">
                            {t("Search Ticket")}
                          </h3>
                          <input
                            placeholder={t(
                              "Search Ticket ID or Title or Puchase Code"
                            )}
                            className=" placeholder:!tradex-text-body tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md !tradex-bg-transparent"
                            type="text"
                            onChange={(e) => {
                              setTimeout(() => {
                                searchDashboardData(e.target.value);
                              }, 1000);
                            }}
                          />
                        </div>
                        <SupportTicketFilter
                          filter={filter}
                          projectList={projectList}
                          setfilter={setfilter}
                          FilterDashboardData={FilterDashboardData}
                        />
                      </div>
                    </div>
                  </div>
                  {loading ? (
                    <SectionLoading />
                  ) : (
                    <div className=" tradex-space-y-5">
                      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                        {ticket_list?.data?.map((ticket: any, index: any) => (
                          <SupportTicketItem key={index} ticket={ticket} />
                        ))}
                        {ticket_list?.data.length === 0 && <NoItemFound />}
                      </div>
                      {ticket_list?.data.length > 0 && (
                        <CustomPagination
                        className="!tradex-justify-start "
                          per_page={ticket_list?.per_page}
                          current_page={ticket_list?.current_page}
                          total={ticket_list?.total}
                          handlePageClick={handlePageClick}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/support");
  const { data } = await landingPage(ctx.locale);
  const commonRes = await pageAvailabilityCheck();
  if (parseInt(commonRes.knowledgebase_support_module) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      socialData: data?.media_list ? data?.media_list : [],
    },
  };
};
export default Support;
