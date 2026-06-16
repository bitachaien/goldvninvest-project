import { formatDate } from "common";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import CustomPagination from "components/Pagination/CustomPagination";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import moment from "moment";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { useGetProfileActivityListAction } from "state/actions/user";

const ProfileActivity = () => {
  const { t } = useTranslation("common");

  const { loading, lists, handlePagination } =
    useGetProfileActivityListAction();

  const profileActivity = lists?.data || [];

  return (
    <>
      <div className="tradex-relative">
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <UserProfileSidebar showUserInfo={false} />
              <div className="lg:tradex-col-span-2 tradex-space-y-6">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-5 tradex-border-b tradex-border-background-primary">
                    <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4 tradex-justify-between md:tradex-items-center">
                      <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                        {t("Profile Activity")}
                      </h2>
                    </div>
                  </div>
                  <div className=" tradex-overflow-x-auto">
                    {loading ? (
                      <SectionLoading />
                    ) : (
                      <>
                        <table className="tradex-w-full">
                          <thead className="">
                            <tr className="tradex-h-[44px]">
                              <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {t("Device")}
                              </th>
                              <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {t("Ip Address")}
                              </th>
                              <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {t("Browser")}
                              </th>
                              <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {t("OS")}
                              </th>
                              <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {t("Location")}
                              </th>
                              <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {t("Time")}
                              </th>
                              <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {t("Action")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {profileActivity?.map(
                              (item: any, index: number) => (
                                <tr
                                  key={`userAct${index}`}
                                  className="tradex-border-y tradex-h-[50px] tradex-border-background-primary"
                                >
                                  <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                    {item.source}
                                  </td>
                                  <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                    {item.ip_address}
                                  </td>
                                  <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                    {item.browser}
                                  </td>
                                  <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                    {item.os}
                                  </td>
                                  <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                    {item.location}
                                  </td>
                                  <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                    {formatDate(item.created_at)}
                                  </td>
                                  <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                    <span className=" tradex-cursor-pointer tradex-text-primary">
                                      {t("Login")}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                            {profileActivity?.length == 0 && (
                              <tr>
                                <td colSpan={4}>
                                  <div className=" tradex-p-5 tradex-text-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      aria-hidden="true"
                                      role="img"
                                      className="tradex-mx-auto tradex-h-20 tradex-w-20 tradex-text-muted-400"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 48 48"
                                    >
                                      <circle
                                        cx="27.569"
                                        cy="23.856"
                                        r="7.378"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></circle>
                                      <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m32.786 29.073l1.88 1.88m-1.156 1.155l2.311-2.312l6.505 6.505l-2.312 2.312z"
                                      ></path>
                                      <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M43.5 31.234V12.55a3.16 3.16 0 0 0-3.162-3.163H7.662A3.16 3.16 0 0 0 4.5 12.55v18.973a3.16 3.16 0 0 0 3.162 3.162h22.195"
                                      ></path>
                                    </svg>
                                    <p className="tradex-text-base tradex-font-medium tradex-text-title">
                                      {t("No Item Found")}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        {profileActivity?.length > 0 && (
                          <CustomPagination
                            per_page={lists?.per_page}
                            current_page={lists?.current_page}
                            total={lists?.total}
                            handlePageClick={handlePagination}
                          />
                        )}
                      </>
                    )}
                  </div>
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
  await SSRAuthCheck(ctx, "/user/profile-activity");

  return {
    props: {},
  };
};
export default ProfileActivity;
