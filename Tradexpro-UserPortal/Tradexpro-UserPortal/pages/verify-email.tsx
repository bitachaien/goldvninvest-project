import type { GetServerSideProps, NextPage } from "next";
import * as Yup from "yup";
import { VerifyEmailAction, useCapchaInitialize } from "state/actions/user";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import { authPageRequireCheck } from "middlewares/ssr-authentication-check";
import { resendEmailApi } from "service/user";
import useTranslation from "next-translate/useTranslation";
import { RootState } from "state/store";
import {
  CAPTCHA_TYPE_GEETESTCAPTCHA,
  CAPTCHA_TYPE_RECAPTCHA,
} from "helpers/core-constants";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
const Signin: NextPage = () => {
  const { t } = useTranslation("common");
  const { logo } = useSelector((state: RootState) => state.user);
  const [dependency, setDependency] = useState<any>("");
  const { settings } = useSelector((state: RootState) => state.common);
  const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(0);
  const { geeTest, captchaData } = useCapchaInitialize();

  const foo = useRef();

  const resendEmail = async (email: string) => {
    const response = await resendEmailApi(email);
    setDependency(Math.random);
    setSeconds(60);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };
  let captcha: any;
  const setCaptchaRef = (ref: any) => {
    if (ref) {
      return (captcha = ref);
    }
  };
  const resetCaptcha = () => {
    captcha?.reset();
  };
  useEffect(() => {
    function tick() {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }
    //@ts-ignore
    foo.current = setInterval(() => tick(), 1000);
  }, [dependency]);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(foo.current);
    }
  }, [seconds]);
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
                    {t("Please Verify Your Email")}
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
                    {t("Verify Email")}
                  </p>
                  <p className="  tradex-text-xl lg:tradex-text-2xl tradex-text-title">
                    {t("Don’t have an account")}?{" "}
                    <Link href="/signup">
                      <span className=" tradex-text-primary tradex-font-bold tradex-cursor-pointer">
                        {t("Sign Up")}
                      </span>
                    </Link>
                  </p>
                </div>
                <div className=" tradex-space-y-4 tradex-w-full">
                  <Formik
                    initialValues={{
                      email: "",
                      verify_code: "",
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
                      verify_code: Yup.string()
                        .min(6)
                        .required(t("Code is required")),
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
                            VerifyEmailAction(local_value, setProcessing)
                          );
                        });
                      } else {
                        await dispatch(
                          VerifyEmailAction(values, setProcessing)
                        );
                      }
                    }}
                  >
                    {({ errors, touched, setFieldValue, values }: any) => (
                      <Form className=" tradex-space-y-6">
                        <div className=" tradex-space-y-2">
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
                          {values.email && (
                            <div className="resend-container">
                              <button
                                className=" tradex-px-3 tradex-py-1.5 tradex-rounded-sm tradex-bg-primary tradex-text-white tradex-text-sm tradex-font-bold"
                                type="button"
                                disabled={seconds !== 0}
                                onClick={() => {
                                  resendEmail(values.email);
                                }}
                              >
                                {seconds !== 0 ? (
                                  <>
                                    {t("Resend after")}
                                    {seconds} {t("sec")}
                                  </>
                                ) : (
                                  t("Resend email")
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="tradex-relative">
                          <Field
                            type={"number"}
                            name="verify_code"
                            id="verify_code"
                            className={`tradex-block tradex-px-2.5 tradex-pb-2.5 tradex-pt-4 tradex-w-full tradex-text-sm tradex-text-body tradex-bg-transparent tradex-rounded-lg tradex-border-1 tradex-border-background-primary tradex-appearance-none focus:tradex-outline-0 focus:tradex-ring-0 tradex-peer ${
                              touched.verify_code && errors.verify_code
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          <label
                            htmlFor="verify_code"
                            className="tradex-absolute tradex-text-sm tradex-text-body tradex-duration-300 tradex-transform -tradex-translate-y-4 tradex-scale-75 tradex-top-2 tradex-z-10 tradex-origin-[0] tradex-bg-background-main tradex-px-2 peer-focus:tradex-px-2   peer-placeholder-shown:tradex-scale-100 peer-placeholder-shown:-tradex-translate-y-1/2 peer-placeholder-shown:tradex-top-1/2 peer-focus:tradex-top-2 peer-focus:tradex-scale-75 peer-focus:-tradex-translate-y-4 rtl:peer-focus:tradex-translate-x-1/4 rtl:tradex-peer-focus:left-auto tradex-start-1"
                          >
                            {t("Code")}
                          </label>
                        </div>
                        <ErrorMessage
                          name="verify_code"
                          component="div"
                          className="red-text"
                        />

                        <div className="form-group">
                          <p className="invalid-feedback">{t("Message")}</p>
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
                              <span role="status" aria-hidden="true"></span>
                              <span>{t("Please wait")}</span>
                            </>
                          ) : (
                            t("Verify Email")
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
  await authPageRequireCheck(ctx);
  return {
    props: {},
  };
};

export default Signin;
