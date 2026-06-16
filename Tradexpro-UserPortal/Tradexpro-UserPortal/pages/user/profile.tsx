import type { GetServerSideProps, NextPage } from "next";
import ProfileComp from "components/profile/profile";
import { parseCookies } from "nookies";

import { GetUserInfoByTokenServer } from "service/user";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import ImageComponent from "components/common/ImageComponent";
import ProfileHeader from "components/profile/ProfileHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Link from "next/link";
import UserProfileSidebar from "components/profile/UserProfileSidebar";

const Profile: NextPage = ({ user, profileActivity }: any) => {
  const { t } = useTranslation("common");

  return (
    <>
      <div className="tradex-relative">
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <UserProfileSidebar
                photo={user?.photo}
                first_name={user?.first_name}
                last_name={user?.last_name}
                email={user?.email}
                showUserInfo={true}
              />
              <div className="lg:tradex-col-span-2 tradex-space-y-6">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("User Profile")}
                    </h2>
                  </div>
                  <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                    <div className=" tradex-space-y-2">
                      <p className=" tradex-input-label">{t("Name")}</p>
                      <div className=" tradex-input-field">
                        <span>
                          {user?.first_name
                            ? user?.first_name + " " + user?.last_name
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <p className=" tradex-input-label">{t("Nickname")}</p>
                      <div className=" tradex-input-field">
                        <span>{user?.nickname ? user?.nickname : "N/A"}</span>
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <p className=" tradex-input-label">{t("Country")}</p>
                      <div className=" tradex-input-field">
                        <span>
                          {user?.country_name
                            ? user?.country_name
                            : user?.country
                            ? user?.country
                            : t("N/A")}
                        </span>
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <p className=" tradex-input-label">{t("Email")}</p>
                      <div className=" tradex-input-field">
                        <span>{user?.email ? user?.email : t("N/A")}</span>
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <p className=" tradex-input-label">
                        {t("Email Verification")}
                      </p>
                      <div className=" tradex-input-field">
                        {user?.is_verified ? (
                          <span className=" tradex-text-base tradex-text-white tradex-flex tradex-justify-center tradex-items-center tradex-min-w-[75px] tradex-min-h-[24px] tradex-rounded-[3px] tradex-bg-green-700">
                            {t("Active")}
                          </span>
                        ) : (
                          <span className="tradex-text-base tradex-text-white tradex-flex tradex-justify-center tradex-items-center tradex-min-w-[75px] tradex-min-h-[24px] tradex-rounded-[3px] tradex-bg-red-700">
                            {t("Inactive")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <p className=" tradex-input-label">{t("Phone")}</p>
                      <div className=" tradex-input-field">
                        <span>
                          {user?.phone ? "+" + user?.phone : t("N/A")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <h2 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                    {t("Profile Activity")}
                  </h2>

                  <div className=" tradex-overflow-x-auto">
                    <table className="tradex-w-full">
                      <thead className="">
                        <tr className="tradex-h-[44px]">
                          <th className=" tradex-text-xl tradex-leading-6 tradex-text-title tradex-font-medium tradex-pr-4 last:tradex-pr-4">
                            {t("Source")}
                          </th>
                          <th className=" tradex-text-xl tradex-leading-6 tradex-text-title tradex-font-medium tradex-pr-4 last:tradex-pr-4">
                            {t("Ip Address")}:
                          </th>
                          <th className=" tradex-text-xl tradex-leading-6 tradex-text-title tradex-font-medium tradex-pr-4 last:tradex-pr-4">
                            {t("Time:")}
                          </th>
                          <th className=" tradex-text-xl tradex-leading-6 tradex-text-title tradex-font-medium tradex-pr-4 last:tradex-pr-4">
                            {t("Action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {profileActivity?.map((item: any, index: number) => (
                          <tr
                            key={`userAct${index}`}
                            className="tradex-border-y tradex-h-[50px] tradex-border-background-primary"
                          >
                            <td className="tradex-text-lg tradex-leading-[22px] tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {item.source}
                            </td>
                            <td className="tradex-text-lg tradex-leading-[22px] tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {item.ip_address}
                            </td>
                            <td className="tradex-text-lg tradex-leading-[22px] tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {moment(item.created_at).format("DD MMM YYYY")}
                            </td>
                            <td className="tradex-text-lg tradex-leading-[22px] tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              <span className=" tradex-cursor-pointer tradex-text-primary">
                                {t("Login")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
  await SSRAuthCheck(ctx, "/user/profile");
  const cookies = parseCookies(ctx);
  const response = await GetUserInfoByTokenServer(cookies.token);

  return {
    props: {
      user: response.user,
      profileActivity: response.activityLog,
    },
  };
};
export default Profile;
