import type { GetServerSideProps, NextPage } from "next";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";
import Link from "next/link";
import { UserSettingsAction } from "state/actions/settings";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import ProfileHeader from "components/profile/ProfileHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
import LoginIcon from "components/icons/LoginIcon";
import AuthenticatorIcon from "components/icons/AuthenticatorIcon";
import PhoneIcon from "components/icons/PhoneIcon";
import EmailIcon from "components/icons/EmailIcon";
const Security: NextPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation("common");
  const [languageList, setLanguageList] = useState<any>([]);
  const [settings, setSettings] = useState<any>();
  const dispatch = useDispatch();
  const makeEmailSecure = (email: string) => {
    const [first, ...rest] = email.split("@");
    return first[0] + "*****" + "@" + rest.join("@");
  };
  const makePhoneNumberSecure = (phoneNumber: string) => {
    const middleNumbers = phoneNumber.slice(2, 9);
    return phoneNumber.replace(middleNumbers, "*******");
  };

  useEffect(() => {
    dispatch(UserSettingsAction(setSettings));
    return () => {
      setSettings(null);
      setLanguageList([]);
    };
  }, []);
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
                showUserInfo={false}
              />
              <div className="lg:tradex-col-span-2 tradex-space-y-6">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("Profile Security Status")}
                    </h2>
                  </div>
                  <div className=" tradex-space-y-6">
                    <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                      <div className=" tradex-flex tradex-justify-between tradex-items-center">
                        <div className=" tradex-flex tradex-items-center tradex-gap-3">
                          <AuthenticatorIcon />
                          <div className=" tradex-space-y-1">
                            <p className=" tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-title">
                              {t("Google Authenticator (Recommended)")}
                            </p>
                            <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                              {t("Protect your account and transactions")}
                            </p>
                          </div>
                        </div>
                        {settings?.user?.google2fa === 1 ? (
                          <Link href="/user/settings">
                            <a className=" tradex-py-3 tradex-px-8 tradex-rounded tradex-bg-red-700 !tradex-text-white tradex-text-sm tradex-leading-4 tradex-font-semibold">
                              {t("Disable")}
                            </a>
                          </Link>
                        ) : (
                          <Link href="/user/settings">
                            <a className=" tradex-py-3 tradex-px-8 tradex-rounded tradex-bg-primary !tradex-text-white tradex-text-sm tradex-leading-4 tradex-font-semibold">
                              {t("Enable")}
                            </a>
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <div className=" tradex-flex tradex-items-center tradex-gap-3">
                        <PhoneIcon />
                        <div className=" tradex-space-y-1">
                          <p className=" tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-title">
                            {t("Phone Number Verification")}
                          </p>
                          <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                            {t("Protect your account and transactions")}
                          </p>
                        </div>
                      </div>

                      <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-gap-6">
                        <div className=" tradex-w-full tradex-flex tradex-items-center tradex-pl-5 tradex-min-h-11 tradex-rounded tradex-border tradex-border-background-primary">
                          {user.phone ? (
                            <span className=" tradex-text-sm tradex-leading-5 tradex-text-title tradex-font-semibold">
                              {makePhoneNumberSecure(user?.phone)}
                            </span>
                          ) : (
                            <span className=" tradex-text-sm tradex-leading-5 tradex-text-red-600 tradex-font-semibold">
                              {t("No phone number added")}
                            </span>
                          )}
                        </div>
                        <div className=" tradex-min-w-[110px]">
                          {parseInt(user.phone_verified) === 0 ? (
                            <Link href="/user/phone-verification">
                              <a className="tradex-py-3 tradex-px-8 tradex-rounded tradex-bg-primary !tradex-text-white tradex-text-sm tradex-leading-4 tradex-font-semibold">
                                {t("Verify")}?
                              </a>
                            </Link>
                          ) : (
                            <button className="tradex-py-3 tradex-px-8 tradex-rounded tradex-bg-primary !tradex-text-white tradex-text-sm tradex-leading-4 tradex-font-semibold">
                              {t("Verified")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className=" tradex-space-y-2">
                      <div className=" tradex-flex tradex-items-center tradex-gap-3">
                        <EmailIcon />
                        <div className=" tradex-space-y-1">
                          <p className=" tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-title">
                            {t("Email Address Verification")}
                          </p>
                          <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                            {t("Protect your account and transactions")}
                          </p>
                        </div>
                      </div>

                      <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-gap-6">
                        <div className=" tradex-w-full tradex-flex tradex-items-center tradex-pl-5 tradex-min-h-11 tradex-rounded tradex-border tradex-border-background-primary">
                          {user.email ? (
                            <span className=" tradex-text-sm tradex-leading-5 tradex-text-title tradex-font-semibold">
                              {makeEmailSecure(user.email)}
                            </span>
                          ) : (
                            <span className=" tradex-text-sm tradex-leading-5 tradex-text-red-600 tradex-font-semibold">
                              {t("No email address added")}
                            </span>
                          )}
                        </div>
                        <div className=" tradex-min-w-[110px]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <div className=" tradex-flex tradex-justify-between tradex-items-center">
                    <div className=" tradex-flex tradex-items-center tradex-gap-3">
                      <LoginIcon />
                      <div className=" tradex-space-y-1">
                        <p className=" tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-title">
                          {t("Login Password")}
                        </p>
                        <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                          {t(
                            `Login password is used to log in to your account.`
                          )}
                        </p>
                      </div>
                    </div>

                    <Link href="/user/change-password">
                      <a className=" tradex-py-3 tradex-px-8 tradex-rounded tradex-bg-primary !tradex-text-white tradex-text-sm tradex-leading-4 tradex-font-semibold">
                        {t("Change")}
                      </a>
                    </Link>
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
  await SSRAuthCheck(ctx, "/user/security");
  return {
    props: {},
  };
};
export default Security;
