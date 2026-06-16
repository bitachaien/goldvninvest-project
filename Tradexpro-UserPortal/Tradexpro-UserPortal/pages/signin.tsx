import type { GetServerSideProps, NextPage } from "next";
import * as Yup from "yup";
import {
  GetUserInfoByTokenAction,
  SigninAction,
  SocialSigninAction,
  useCapchaInitialize,
} from "state/actions/user";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";

import AppleSignin from "react-apple-signin-auth";
//@ts-ignore
import FacebookLogin from "react-facebook-login";
import Link from "next/link";
import { authPageRequireCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import { destroyCookie } from "nookies";
import { RootState } from "state/store";
import {
  CAPTCHA_TYPE_GEETESTCAPTCHA,
  CAPTCHA_TYPE_RECAPTCHA,
  LOGIN_WITH_APPLE,
  LOGIN_WITH_FACEBOOK,
} from "helpers/core-constants";
import { socialSigninApi } from "service/user";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { LOGIN_WITH_GOOGLE } from "helpers/core-constants";
import { FaApple, FaFacebook, FaFacebookF } from "react-icons/fa";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const Signin: NextPage = () => {
  const { settings } = useSelector((state: RootState) => state.common);
  const { geeTest, captchaData } = useCapchaInitialize();
  const { t } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState<any>(false);
  const dispatch = useDispatch();

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

  const authHandler = (err: any, data: any) => {
    try {
      console.log("data", err, data);
    } catch (error) {
      console.log("authHandler", error);
    }
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
                    {t("Please Sign In To Your Account")}
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
                    {t("Sign In")}
                  </p>
                  <p className="  tradex-text-xl lg:tradex-text-2xl tradex-text-title">
                    {t("Don’t have an account ? ")}{" "}
                    <Link href="/signup">
                      <span className=" tradex-text-primary tradex-font-bold tradex-cursor-pointer">
                        {t("Sign Up")}
                      </span>
                    </Link>
                  </p>
                </div>
                <div className=" tradex-space-y-4 tradex-w-full">
                  <div className=" tradex-space-y-6">
                    <Formik
                      initialValues={{
                        email: "",
                        password: "",
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
                          .min(6)
                          .required(t("Password is required")),
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
                            await dispatch(
                              SigninAction(local_value, setProcessing)
                            );
                            await dispatch(GetUserInfoByTokenAction());
                          });
                        } else {
                          const response: any = await dispatch(
                            SigninAction(values, setProcessing)
                          );
                          if (!response?.success) {
                            resetCaptcha();
                          }
                          await dispatch(GetUserInfoByTokenAction());
                        }
                      }}
                    >
                      {({ errors, touched, setFieldValue }) => (
                        //@ts-ignore
                        <Form className="tradex-space-y-6">
                          <div className="tradex-space-y-2">
                            <div className=" tradex-space-y-6">
                              <div className="tradex-relative">
                                <Field
                                  type="email"
                                  name="email"
                                  id="email"
                                  className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
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
                              </div>

                              <div className="tradex-relative">
                                <Field
                                  type={showPassword ? "text" : "password"}
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
                                <span
                                  className=" tradex-absolute tradex-top-1/2 -tradex-translate-y-1/2 tradex-right-[10px]  "
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <i className="fa fa-eye toggle-password"></i>
                                  ) : (
                                    <i className="fa fa-eye-slash toggle-password"></i>
                                  )}
                                </span>
                              </div>
                            </div>

                            <Link href="/forgot-password">
                              <a className=" tradex-text-base tradex-font-semibold !tradex-text-body !tradex-underline tradex-block">
                                {t("Forgot Password?")}
                              </a>
                            </Link>
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
                            // onClick={() => resetCaptcha()}
                            type="submit"
                            disabled={processing}
                            className="tradex-text-base tradex-font-semibold tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                          >
                            {processing ? (
                              <>
                                <span role="status" aria-hidden="true"></span>
                                <span>{t("Please wait")}</span>
                              </>
                            ) : (
                              t("Sign In")
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
  try {
    await authPageRequireCheck(ctx);
  } catch (error) {
    destroyCookie(ctx, "token");
  }
  return {
    props: {},
  };
};

export default Signin;
