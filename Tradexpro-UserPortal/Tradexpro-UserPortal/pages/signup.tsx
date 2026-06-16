import type { GetServerSideProps, NextPage } from "next";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import {
  SignupAction,
  SocialSigninAction,
  useCapchaInitialize,
  GetUserInfoByTokenAction,
} from "state/actions/user";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useRouter } from "next/router";
import { authPageRequireCheck } from "middlewares/ssr-authentication-check";
//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import useTranslation from "next-translate/useTranslation";
import { RootState } from "state/store";

//@ts-ignore
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import {
  LOGIN_WITH_APPLE,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE,
} from "helpers/core-constants";
import { FaApple, FaFacebook, FaFacebookF } from "react-icons/fa";

//@ts-ignore
import AppleSignin from "react-apple-signin-auth";

//@ts-ignore
import FacebookLogin from "react-facebook-login";

import {
  CAPTCHA_TYPE_GEETESTCAPTCHA,
  CAPTCHA_TYPE_RECAPTCHA,
} from "helpers/core-constants";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const Signup: NextPage = () => {
  const { logo } = useSelector((state: RootState) => state.user);
  const { settings } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch();
  const { geeTest, captchaData } = useCapchaInitialize();

  const { t } = useTranslation("common");
  const router = useRouter();

  const { ref_code } = router.query;
  const [processing, setProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm_password: false,
  });

  let captcha: any;
  const setCaptchaRef = (ref: any) => {
    if (ref) {
      return (captcha = ref);
    }
  };
  const resetCaptcha = () => {
    captcha?.reset();
  };

  const responseFacebook = async (response: any) => {
    if (!response || response.status == "unknown") {
      return;
    }

    if (!response?.accessToken) {
      toast.error(`Invalid access token`);
      return;
    }

    const data = {
      login_type: LOGIN_WITH_FACEBOOK,
      access_token: response?.accessToken,
    };
    const res: any = await dispatch(SocialSigninAction(data, setProcessing));

    if (!res?.success) {
      resetCaptcha();
    }
    await dispatch(GetUserInfoByTokenAction());
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      toast.error(`Invalid access token`);
      return;
    }

    const data = {
      login_type: LOGIN_WITH_GOOGLE,
      access_token: credentialResponse?.credential,
    };
    const res: any = await dispatch(SocialSigninAction(data, setProcessing));

    if (!res?.success) {
      resetCaptcha();
    }
    await dispatch(GetUserInfoByTokenAction());
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
                    {t("Create a new account")}
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
                    {t("Sign Up")}
                  </p>
                  <p className="  tradex-text-xl lg:tradex-text-2xl tradex-text-title">
                    {t("Already have an account?")}{" "}
                    <Link href="/signin">
                      <span className=" tradex-text-primary tradex-font-bold tradex-cursor-pointer">
                        {t("Sign In")}
                      </span>
                    </Link>
                  </p>
                </div>
                <div className=" tradex-space-y-4 tradex-w-full">
                  <div className=" tradex-space-y-6">
                    <Formik
                      initialValues={{
                        email: "",
                        first_name: "",
                        last_name: "",
                        password: "",
                        password_confirmation: "",
                        phone: "",
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
                        first_name: Yup.string()
                          .min(2)
                          .required(t("First name is required")),
                        last_name: Yup.string()
                          .min(2)
                          .required(t("Last name is required")),
                        password: Yup.string()
                          .min(8)
                          .required(t("Password is required")),
                        password_confirmation: Yup.string()
                          .oneOf(
                            [Yup.ref("password"), null],
                            t("Passwords must match")
                          )
                          .required("Confirm password is required"),
                        recapcha: Yup.string()
                          .min(6)
                          .required(t("Recapcha is required")),
                      })}
                      onSubmit={async (values) => {
                        let newValues: any = {
                          email: values.email,
                          first_name: values.first_name,
                          last_name: values.last_name,
                          password: values.password,
                          password_confirmation: values.password_confirmation,
                          recapcha: values.recapcha,
                        };

                        if (values.phone) {
                          newValues = {
                            ...newValues,
                            phone: values.phone,
                          };
                        }

                        if (
                          parseInt(captchaData?.select_captcha_type) ===
                          CAPTCHA_TYPE_GEETESTCAPTCHA
                        ) {
                          geeTest.showCaptcha();
                          geeTest.onSuccess(async () => {
                            var result = geeTest.getValidate();
                            let local_value: any = newValues;
                            local_value.lot_number = result.lot_number;
                            local_value.captcha_output = result.captcha_output;
                            local_value.pass_token = result.pass_token;
                            local_value.gen_time = result.gen_time;
                            dispatch(
                              SignupAction(local_value, setProcessing, ref_code)
                            );
                          });
                        } else {
                          dispatch(
                            SignupAction(newValues, setProcessing, ref_code)
                          );
                        }
                      }}
                    >
                      {({ errors, touched, setFieldValue }) => (
                        <Form className=" tradex-space-y-6">
                          <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6 ">
                            <div className=" tradex-relative">
                              <Field
                                type="text"
                                name="first_name"
                                id="first_name"
                                className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 !tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
                                  touched.first_name && errors.first_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              <label
                                htmlFor="first_name"
                                className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                              >
                                {t("First Name")}
                              </label>
                              {touched.first_name && errors.first_name && (
                                <div className="invalid-feedback">
                                  {errors.first_name}
                                </div>
                              )}
                            </div>

                            <div className=" tradex-relative">
                              <Field
                                type="text"
                                name="last_name"
                                id="last_name"
                                className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 !tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
                                  touched.last_name && errors.last_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              <label
                                htmlFor="last_name"
                                className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                              >
                                {t("Last Name")}
                              </label>
                              {touched.last_name && errors.last_name && (
                                <div className="invalid-feedback">
                                  {errors.last_name}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className=" tradex-relative">
                            <Field
                              type="email"
                              name="email"
                              id="email"
                              className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 !tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer  ${
                                touched.email && errors.email
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <label
                              htmlFor="email"
                              className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                            >
                              {t("Email")}
                            </label>
                            {touched.email && errors.email && (
                              <div className="invalid-feedback">
                                {errors.email}
                              </div>
                            )}
                          </div>
                          <div className=" tradex-relative">
                            <PhoneInput
                              country={"us"}
                              inputStyle={{ paddingLeft: 50 }}
                              // value={user?.phone}
                              onChange={(phone: any) => {
                                setFieldValue("phone", phone);
                              }}
                              inputClass="tradex-input-field !tradex-pl-[50px] !tradex-text-sm !tradex-bg-transparent !tradex-rounded-lg !tradex-border !tradex-border-solid !tradex-border-background-primary"
                              dropdownClass="!tradex-bg-background-primary"
                              buttonClass="!tradex-bg-background-primary hover:!tradex-bg-background-primary !tradex-border-background-primary"
                            />
                          </div>
                          <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6 ">
                            <div className=" tradex-relative tradex-h-fit">
                              <div>
                                <Field
                                  type={
                                    showPassword.password ? "text" : "password"
                                  }
                                  name="password"
                                  id="password"
                                  className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 !tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
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

                                {touched.password && errors.password && (
                                  <div className="invalid-feedback">
                                    {errors.password}
                                  </div>
                                )}
                              </div>
                              <span
                                className={`tradex-absolute tradex-top-1/2 -tradex-translate-y-1/2 tradex-right-[10px]  ${
                                  touched.password && errors.password
                                    ? "top-35-p"
                                    : "top-50-p"
                                }`}
                                onClick={() =>
                                  setShowPassword({
                                    ...showPassword,
                                    password: !showPassword.password,
                                  })
                                }
                              >
                                <i className="fa fa-eye-slash toggle-password"></i>
                              </span>
                            </div>

                            <div className=" tradex-relative  tradex-h-fit">
                              <Field
                                type={
                                  showPassword.confirm_password
                                    ? "text"
                                    : "password"
                                }
                                name="password_confirmation"
                                id="password_confirmation"
                                className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 !tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
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

                              {touched.password_confirmation &&
                                errors.password_confirmation && (
                                  <div className="invalid-feedback">
                                    {errors.password_confirmation}
                                  </div>
                                )}

                              <span
                                className={`tradex-absolute tradex-top-1/2 -tradex-translate-y-1/2 tradex-right-[10px]  ${
                                  touched.password_confirmation &&
                                  errors.password_confirmation
                                    ? "top-35-p"
                                    : "top-50-p"
                                }`}
                                onClick={() =>
                                  setShowPassword({
                                    ...showPassword,
                                    confirm_password:
                                      !showPassword.confirm_password,
                                  })
                                }
                              >
                                <i className="fa fa-eye-slash toggle-password"></i>
                              </span>
                            </div>
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
                            disabled={processing}
                            className="tradex-text-base tradex-font-semibold tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                          >
                            {processing ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-md"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span>{t("Please wait")}</span>
                              </>
                            ) : (
                              t("Sign Up")
                            )}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div>
                    {(settings.social_login_google_enable == 1 ||
                      settings.social_login_facebook_enable == 1 ||
                      settings.social_login_apple_enable == 1) &&
                      settings.social_login_enable && (
                        <div className="mt-5">
                          <p className="text-center text-16">
                            {t("Or continue with")}
                          </p>

                          <div className="mt-3 d-flex justify-content-center align-items-center gap-10">
                            {settings.social_login_google_enable == 1 && (
                              <GoogleLogin
                                onSuccess={(credentialResponse: any) => {
                                  handleGoogleLogin(credentialResponse);
                                }}
                                type="icon"
                                shape="circle"
                                size="large"
                                theme="filled_black"
                                onError={() => {
                                  console.log("Login Failed");
                                }}
                                useOneTap
                              />
                            )}
                            {settings.social_login_facebook_enable == 1 && (
                              <FacebookLogin
                                appId={`${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
                                autoLoad={false}
                                fields="name,email,picture"
                                // onClick={componentClicked}
                                callback={responseFacebook}
                                icon={<FaFacebookF size={20} color="blue" />}
                                textButton={""}
                                cssClass={"facebook-button-cls"}
                              />
                            )}

                            {settings.social_login_apple_enable == 1 && (
                              <AppleSignin
                                authOptions={{
                                  clientId: `${process.env.NEXT_PUBLIC_APPLE_CLIENT_ID}`,

                                  scope: "name email",

                                  redirectURI: `${
                                    settings.social_login_apple_redirect_url ||
                                    process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI
                                  }`,

                                  state: "",

                                  nonce: "nonce",

                                  usePopup: true,
                                }} // REQUIRED
                                uiType="dark"
                                className="apple-auth-btn"
                                noDefaultStyle={false}
                                buttonExtraChildren="Continue with Apple"
                                onSuccess={async (response: any) => {
                                  if (!response?.authorization?.id_token) {
                                    toast.error(`Invalid access token`);
                                    return;
                                  }
                                  const data = {
                                    login_type: LOGIN_WITH_APPLE,
                                    access_token:
                                      response?.authorization?.id_token,
                                  };
                                  const res: any = await dispatch(
                                    SocialSigninAction(data, setProcessing)
                                  );

                                  if (!res?.success) {
                                    resetCaptcha();
                                  }
                                  await dispatch(GetUserInfoByTokenAction());
                                }}
                                onError={(error: any) => setProcessing(false)}
                                skipScript={false}
                                render={(props: any) => (
                                  <button
                                    {...props}
                                    className="apple-auth-btn !tradex-text-black"
                                  >
                                    <FaApple size={26} />
                                  </button>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                  </div>
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
  await authPageRequireCheck(ctx);
  return {
    props: {},
  };
};

export default Signup;
