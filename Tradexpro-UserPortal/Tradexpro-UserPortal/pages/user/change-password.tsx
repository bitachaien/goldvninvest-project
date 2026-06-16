import type { GetServerSideProps, NextPage } from "next";
import ProfileSidebar from "layout/profile-sidebar";
import React from "react";
import * as Yup from "yup";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { ChangePasswordAction } from "state/actions/user";
import { useDispatch } from "react-redux";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import ProfileHeader from "components/profile/ProfileHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
import ResetPageIcon from "components/icons/ResetPageIcon";
const PhoneVerification: NextPage = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <UserProfileSidebar />
              <div className="lg:tradex-col-span-2 tradex-space-y-6">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("Reset Password")}
                    </h2>
                  </div>
                  <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-4 tradex-items-center">
                    <div>
                      <Formik
                        initialValues={{
                          old_password: "",
                          password: "",
                          password_confirmation: "",
                        }}
                        validationSchema={Yup.object({
                          old_password: Yup.string().required(
                            "Password is required"
                          ),
                          password: Yup.string()
                            .min(8, "Password must be at least 8 characters")
                            .required("Password is required"),
                          password_confirmation: Yup.string()
                            .oneOf(
                              [Yup.ref("password"), null],
                              "Passwords must match"
                            )
                            .required("Password confirmation is required"),
                        })}
                        onSubmit={async (values) => {
                          await dispatch(ChangePasswordAction(values));
                        }}
                      >
                        {({ errors, touched }) => (
                          <Form className="tradex-space-y-12">
                            <div className=" tradex-space-y-6">
                              <div className="tradex-space-y-2">
                                <label className="tradex-input-label">
                                  {t("Old password")}
                                </label>
                                <Field
                                  name="old_password"
                                  id="old_password"
                                  type="password"
                                  placeholder={t("Old password")}
                                  className={`tradex-input-field ${
                                    touched.old_password &&
                                    errors.old_password &&
                                    " !tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  }`}
                                />

                                <ErrorMessage
                                  name="old_password"
                                  component="div"
                                  className=" !tradex-text-red-500"
                                />
                              </div>

                              <div className="tradex-space-y-2">
                                <label className="tradex-input-label">
                                  {t("New Password")}
                                </label>
                                <Field
                                  name="password"
                                  id="password"
                                  type="password"
                                  placeholder={t("New Password")}
                                  className={`tradex-input-field ${
                                    touched.password &&
                                    errors.password &&
                                    "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  }`}
                                />
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className=" !tradex-text-red-500"
                                />
                              </div>

                              <div className="tradex-space-y-2">
                                <label className="tradex-input-label">
                                  {t("Password Conformation")}
                                </label>
                                <Field
                                  name="password_confirmation"
                                  id="password_confirmation"
                                  type="password"
                                  placeholder={t("Re Enter New Password")}
                                  className={`tradex-input-field ${
                                    touched.password_confirmation &&
                                    errors.password_confirmation &&
                                    "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  }`}
                                />
                                <ErrorMessage
                                  name="password_confirmation"
                                  component="div"
                                  className=" !tradex-text-red-500"
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              className=" tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                            >
                              <span className=" tradex-text-base tradex-font-semibold">
                                {t("Change Password")}
                              </span>
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div>
                      <ResetPageIcon />
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
  await SSRAuthCheck(ctx, "/user/change-password");
  return {
    props: {},
  };
};

export default PhoneVerification;
