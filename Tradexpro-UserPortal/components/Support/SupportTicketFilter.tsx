//@ts-ignore
import DatePicker from "react-datepicker";
import useTranslation from "next-translate/useTranslation";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendarDate } from "react-icons/ci";

export const SupportTicketFilter = ({
  filter,
  setfilter,
  projectList,
  FilterDashboardData,
}: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-6">
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("Select Project")}
        </label>
        <div className="cp-select-area">
          <select
            name="project"
            className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md !tradex-bg-background-main"
            onChange={(e: any) => {
              setfilter({
                ...filter,
                project: e.target.value,
              });
            }}
          >
            <option>{t("Select Project")}</option>
            {projectList.map((project: any, index: any) => (
              <option key={index} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("Select Status")}
        </label>
        <div className="cp-select-area">
          <select
            name="status"
            className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md !tradex-bg-background-main"
            onChange={(e: any) => {
              setfilter({
                ...filter,
                status: e.target.value,
              });
            }}
          >
            <option>{t("Select Status")}</option>
            <option value="1">{t("Pending")}</option>
            <option value="2">{t("Open")}</option>
            <option value="3">{t("Close")}</option>
            <option value="4">{t("Close Forever")}</option>
          </select>
        </div>
      </div>
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("From")}
        </label>
        <div className=" tradex-w-full tradex-relative">
          <input
            className="ico-phase-date-type tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md !tradex-bg-transparent"
            type="date"
            name="from_date"
            onChange={(e: any) => {
              setfilter({
                ...filter,
                from: e.target.value,
              });
            }}
          />
          <span className=" tradex-pointer-events-none tradex-absolute tradex-right-[10px] -tradex-translate-y-1/2 tradex-top-1/2">
            <CiCalendarDate size={20} className=" tradex-text-body" />
          </span>
        </div>
      </div>
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("To")}
        </label>
        <div className=" tradex-w-full tradex-relative">
          <input
            className="ico-phase-date-type tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md !tradex-bg-transparent"
            type="date"
            name="to_date"
            onChange={(e: any) => {
              setfilter({
                ...filter,
                to: e.target.value,
              });
            }}
          />
          <span className=" tradex-pointer-events-none tradex-absolute tradex-right-[10px] -tradex-translate-y-1/2 tradex-top-1/2">
            <CiCalendarDate size={20} className=" tradex-text-body" />
          </span>
        </div>
      </div>

      <button
        type="button"
        className=" tradex-group hover:tradex-bg-primary hover:tradex-text-white tradex-border tradex-border-primary tradex-rounded-md tradex-min-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-text-primary tradex-text-base tradex-font-semibold tradex-gap-3"
        onClick={FilterDashboardData}
      >
        <span>
          <svg
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=" tradex-fill-primary group-hover:tradex-fill-white tradex-w-5"
          >
            <path
              d="M0.857115 3.42846C0.383748 3.42846 0 3.81221 0 4.28558C0 4.75894 0.383748 5.14269 0.857115 5.14269V3.42846ZM0.857115 14.8567C0.383748 14.8567 0 15.2404 0 15.7138C0 16.1871 0.383748 16.5709 0.857115 16.5709V14.8567ZM7.71404 16.5709C8.18741 16.5709 8.57115 16.1871 8.57115 15.7138C8.57115 15.2404 8.18741 14.8567 7.71404 14.8567V16.5709ZM21.4279 16.5709C21.9012 16.5709 22.285 16.1871 22.285 15.7138C22.285 15.2404 21.9012 14.8567 21.4279 14.8567V16.5709ZM14.571 3.42846C14.0976 3.42846 13.7138 3.81221 13.7138 4.28558C13.7138 4.75894 14.0976 5.14269 14.571 5.14269V3.42846ZM21.4279 5.14269C21.9012 5.14269 22.285 4.75894 22.285 4.28558C22.285 3.81221 21.9012 3.42846 21.4279 3.42846V5.14269ZM0.857115 5.14269H4.28558V3.42846H0.857115V5.14269ZM0.857115 16.5709H7.71404V14.8567H0.857115V16.5709ZM17.9994 16.5709H21.4279V14.8567H17.9994V16.5709ZM14.571 5.14269H21.4279V3.42846H14.571V5.14269ZM17.1423 15.7138C17.1423 17.1339 15.991 18.2851 14.571 18.2851V19.9994C16.9379 19.9994 18.8565 18.0807 18.8565 15.7138H17.1423ZM14.571 18.2851C13.1509 18.2851 11.9996 17.1339 11.9996 15.7138H10.2854C10.2854 18.0807 12.2041 19.9994 14.571 19.9994V18.2851ZM11.9996 15.7138C11.9996 14.2937 13.1509 13.1424 14.571 13.1424V11.4282C12.2041 11.4282 10.2854 13.3469 10.2854 15.7138H11.9996ZM14.571 13.1424C15.991 13.1424 17.1423 14.2937 17.1423 15.7138H18.8565C18.8565 13.3469 16.9379 11.4282 14.571 11.4282V13.1424ZM10.2854 4.28558C10.2854 5.70569 9.13411 6.85692 7.71404 6.85692V8.57115C10.0809 8.57115 11.9996 6.65244 11.9996 4.28558H10.2854ZM7.71404 6.85692C6.29392 6.85692 5.14269 5.70569 5.14269 4.28558H3.42846C3.42846 6.65244 5.34718 8.57115 7.71404 8.57115V6.85692ZM5.14269 4.28558C5.14269 2.86546 6.29392 1.71423 7.71404 1.71423V0C5.34718 0 3.42846 1.91872 3.42846 4.28558H5.14269ZM7.71404 1.71423C9.13411 1.71423 10.2854 2.86546 10.2854 4.28558H11.9996C11.9996 1.91872 10.0809 0 7.71404 0V1.71423Z"
              fill="inherit"
            />
          </svg>
        </span>
        <span>{t("Filter Ticket")}</span>
      </button>
    </div>
  );
};
