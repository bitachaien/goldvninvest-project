import type { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { ResetPasswordAction, useCapchaInitialize } from "state/actions/user";
import Link from "next/link";
//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import {
  CAPTCHA_TYPE_GEETESTCAPTCHA,
  CAPTCHA_TYPE_RECAPTCHA,
} from "helpers/core-constants";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
const ResetPassword: NextPage = () => {
  const { t } = useTranslation("common");
  const { geeTest, captchaData } = useCapchaInitialize();

  const [processing, setProcessing] = useState(false);
  const { settings } = useSelector((state: RootState) => state.common);

  let captcha: any;
  const setCaptchaRef = (ref: any) => {
    if (ref) {
      return (captcha = ref);
    }
  };
  const resetCaptcha = () => {
    captcha?.reset();
  };

  return (
    <>
      <div
        className={` tradex-relative tradex-min-h-screen tradex-overflow-hidden -tradex-mt-[80px] tradex-flex tradex-justify-center tradex-items-center`}
      >
        <TopLeftInnerPageCircle />
        <TopRightInnerPageCircle />
        <section className="tradex-relative tradex-w-full">
          <div className=" tradex-container tradex-relative">
            <div className=" tradex-flex tradex-gap-[60px] tradex-items-center lg:tradex-px-[40px]">
              <div className=" tradex-hidden lg:tradex-block tradex-max-w-[452px] tradex-space-y-12 tradex-min-w-[452px]">
                <div className=" tradex-space-y-6">
                  <h4 className=" tradex-text-[40px] tradex-leading-[48px] !tradex-text-title tradex-font-bold">
                    {t("Welcome To")}{" "}
                    <Link href={`/`}>
                      <span className=" tradex-text-primary tradex-cursor-pointer">
                        {settings.app_title}
                      </span>
                    </Link>
                  </h4>
                  <p className="tradex-text-xl tradex-leading-[24px] tradex-text-title tradex-font-medium">
                    {t(
                      "Please enter the new password and code to reset the password"
                    )}
                  </p>
                </div>
                <div className=" tradex-flex tradex-justify-center">
                  <Link href={`/`}>
                    <img
                      src={settings.login_background || "/auth_page_img.png"}
                      className=" tradex-max-w-[375px] tradex-object-cover tradex-object-center tradex-cursor-pointer"
                      alt=""
                    />
                  </Link>
                </div>
              </div>
              <div className=" tradex-px-4 lg:tradex-px-12 tradex-pb-12 tradex-pt-[60px]  lg:tradex-pt-[120px] tradex-rounded-lg tradex-shadow-[10px_10px_100px_3px_#B5B5B538] tradex-bg-background-main tradex-w-full tradex-flex tradex-flex-col tradex-items-center tradex-gap-8">
                <div className=" tradex-space-y-4 tradex-text-center">
                  <p className=" tradex-text-[30px] tradex-leading-[36px] tradex-font-bold tradex-text-title">
                    {t("Reset Password")}
                  </p>
                  <p className="  tradex-text-xl lg:tradex-text-2xl tradex-text-title">
                    {t("Return to")}{" "}
                    <Link href="/signin">
                      <span className=" tradex-text-primary tradex-font-bold tradex-cursor-pointer">
                        {t("Sign In")}
                      </span>
                    </Link>
                  </p>
                </div>
                <div className=" tradex-space-y-4 tradex-w-full">
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                      password_confirmation: "",
                      token: "",
                      recapcha:
                        parseInt(captchaData?.select_captcha_type) !==
                        CAPTCHA_TYPE_RECAPTCHA
                          ? "ksmaldkmalksmdlkamsdlk"
                          : "",
                    }}
                    validationSchema={Yup.object({
                      email: Yup.string()
                        .email(t("Invalid email address"))
                        .required(t("Email is required")),
                      password: Yup.string()
                        .min(6, t("Password must be at least 6 characters"))
                        .required(t("Password is required")),
                      password_confirmation: Yup.string()
                        .oneOf(
                          [Yup.ref("password"), null],
                          t("Passwords must match")
                        )
                        .required(t("Password confirmation is required")),
                      token: Yup.string().required(t("Code is required")),
                      recapcha: Yup.string()
                        .min(6)
                        .required(t("Recapcha is required")),
                    })}
                    onSubmit={async (values) => {
                      if (
                        parseInt(captchaData?.select_captcha_type) ===
                        CAPTCHA_TYPE_GEETESTCAPTCHA
                      ) {
                        geeTest.showCaptcha();
                        geeTest.onSuccess(async () => {
                          var result = geeTest.getValidate();
                          let local_value: any = values;
                          local_value.lot_number = result.lot_number;
                          local_value.captcha_output = result.captcha_output;
                          local_value.pass_token = result.pass_token;
                          local_value.gen_time = result.gen_time;
                          await ResetPasswordAction(local_value, setProcessing);
                        });
                      } else {
                        await ResetPasswordAction(values, setProcessing);
                      }
                    }}
                  >
                    {({ errors, touched, setFieldValue }) => (
                      <Form className=" tradex-space-y-6">
                        <div className="tradex-relative">
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
                              touched.email && errors.email ? "is-invalid" : ""
                            }`}
                          />
                          <label
                            htmlFor="email"
                            className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                          >
                            {t("Email")}
                          </label>
                        </div>

                        <div className="tradex-relative">
                          <Field
                            type="password"
                            name="password"
                            id="password"
                            className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
                              touched.password && errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          <label
                            htmlFor="password"
                            className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                          >
                            {t("Password")}
                          </label>
                        </div>

                        <div className="tradex-relative">
                          <Field
                            type="password"
                            name="password_confirmation"
                            id="password_confirmation"
                            className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
                              touched.password_confirmation &&
                              errors.password_confirmation
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          <label
                            htmlFor="password_confirmation"
                            className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                          >
                            {t("Confirmation Password")}
                          </label>
                        </div>

                        <div className="tradex-relative">
                          <Field
                            type="token"
                            name="token"
                            id="token"
                            className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
                              touched.token && errors.token ? "is-invalid" : ""
                            }`}
                          />
                          <label
                            htmlFor="token"
                            className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                          >
                            {t("Code")}
                          </label>
                        </div>

                        {captchaData?.NOCAPTCHA_SITEKEY &&
                          parseInt(captchaData?.select_captcha_type) ===
                            CAPTCHA_TYPE_RECAPTCHA && (
                            <ReCAPTCHA
                              ref={(r: any) => setCaptchaRef(r)}
                              sitekey={captchaData?.NOCAPTCHA_SITEKEY}
                              render="explicit"
                              onChange={(response: any) => {
                                setFieldValue("recapcha", response);
                              }}
                            />
                          )}
                        <button
                          onClick={() => resetCaptcha()}
                          type="submit"
                          className="tradex-text-base tradex-font-semibold tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                        >
                          {processing ? (
                            <>
                              <span role="status" aria-hidden="true"></span>
                              <span>{t("Please wait")}</span>
                            </>
                          ) : (
                            t("Submit")
                          )}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  // await authPageRequireCheck(ctx);
  return {
    props: {},
  };
};
export default ResetPassword;
