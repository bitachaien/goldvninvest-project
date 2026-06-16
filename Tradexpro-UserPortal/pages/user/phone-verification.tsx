import type { GetServerSideProps, NextPage } from "next";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { RootState } from "state/store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import {
  SendPhoneVerificationSmsAction,
  VerifyPhoneAction,
} from "state/actions/user";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import ImageComponent from "components/common/ImageComponent";
import ProfileHeader from "components/profile/ProfileHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
import PhoneVerficationSvg from "components/icons/PhoneVerficationSvg";
import PhoneVerifyCheckSvg from "components/icons/PhoneVerifyCheckSvg";

const PhoneVerification: NextPage = () => {
  const { t } = useTranslation("common");
  const { user } = useSelector((state: RootState) => state.user);
  const [ShowOtpSection, setShowOtpSection] = useState(false);
  const [isChangeNumber, setIsChangeNumber] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [verifyProcess, setVerifyProcess] = useState(false);
  const [otp, setOtp] = useState<number>(0);
  const sendCode = () => {
    SendPhoneVerificationSmsAction(setShowOtpSection, setProcessing);
  };
  const verifyCode = () => {
    VerifyPhoneAction(otp, setVerifyProcess, setShowOtpSection);
    setIsChangeNumber(false);
  };
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
                <div className=" tradex-h-full tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("Phone Verification")}
                    </h2>
                  </div>
                  <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-5 tradex-items-center">
                    <div className=" md:tradex-col-span-2">
                      {user?.phone_verified == 1 && !isChangeNumber ? (
                        <div className="tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-4 tradex-bg-background-primary tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-4 tradex-pb-8 tradex-rounded-lg">
                          <PhoneVerifyCheckSvg />
                          <div className=" tradex-space-y-2 tradex-text-center">
                            <p className=" tradex-text-2xl tradex-leading-[30px] tradex-text-title tradex-font-semibold">
                              {t("Your Phone number has been verified.")}
                            </p>
                            <p className=" tradex-text-sm tradex-leading-4 tradex-text-body">
                              <span
                                className=" tradex-text-primary tradex-underline"
                                onClick={() => setIsChangeNumber(true)}
                              >{`Click here `}</span>{" "}
                              {t("to change the Phone number.")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-4 tradex-bg-background-primary tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-4 tradex-pb-8 tradex-rounded-lg">
                          {user?.phone ? (
                            <div className=" tradex-space-y-4">
                              <div className="tradex-space-y-2">
                                <label className="tradex-input-label">
                                  {t("Phone number")}
                                </label>
                                <input
                                  type="text"
                                  value={user?.phone}
                                  className="tradex-input-field !tradex-bg-background-main"
                                  disabled
                                />
                              </div>
                              <button
                                className=" tradex-py-2.5 tradex-rounded-lg tradex-bg-primary tradex-w-full tradex-text-sm tradex-leading-5 tradex-font-bold tradex-text-white"
                                onClick={sendCode}
                              >
                                {processing ? (
                                  <>
                                    <span>{t("Please wait")}</span>
                                  </>
                                ) : ShowOtpSection ? (
                                  t("Resend SMS")
                                ) : (
                                  t("Send SMS")
                                )}
                              </button>
                              {ShowOtpSection && (
                                <p className="tradex-text-sm tradex-leading-4 tradex-text-body">
                                  {t(
                                    "If you did not receive the code, click the Resend SMS button."
                                  )}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className=" tradex-text-center tradex-text-2xl tradex-leading-[30px] tradex-text-title tradex-font-semibold">
                              {t("Please add your mobile number first from")}
                              <br />
                              <Link href={`/user/edit-profile`}>
                                <a className=" !tradex-text-primary !tradex-underline">
                                  {t("edit profile")}
                                </a>
                              </Link>
                            </p>
                          )}
                          {ShowOtpSection && (
                            <div className=" tradex-space-y-4 tradex-w-full">
                              <div className="tradex-space-y-2">
                                <label
                                  htmlFor="number"
                                  className="tradex-input-label"
                                >
                                  {t("Verify Code")}
                                </label>
                                <input
                                  type="text"
                                  className="tradex-input-field !tradex-bg-background-main"
                                  id=""
                                  onChange={(event) => {
                                    setOtp(parseInt(event.target.value));
                                  }}
                                />
                              </div>
                              <button
                                type="submit"
                                className="tradex-py-2.5 tradex-rounded-lg tradex-bg-primary tradex-w-full tradex-text-sm tradex-leading-5 tradex-font-bold tradex-text-white"
                                onClick={verifyCode}
                              >
                                {verifyProcess ? (
                                  <span>{t("Please wait")}</span>
                                ) : (
                                  t("Verify")
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className=" md:tradex-col-span-3">
                      <PhoneVerficationSvg />
                    </div>
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
  await SSRAuthCheck(ctx, "/user/phone-verification");
  return {
    props: {},
  };
};

export default PhoneVerification;
