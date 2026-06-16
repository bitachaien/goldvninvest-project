import type { GetServerSideProps, NextPage } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { useEffect, useState } from "react";
import {
  UserSettingsAction,
  Google2faLoginAction,
  UpdateCurrencyAction,
} from "state/actions/settings";
import GoogleAuthModal from "components/settings/GoogleAuthModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import SecretKeyModal from "components/settings/SecretKeyModal";
import { toast } from "react-toastify";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import SecuritySettingsSvg from "components/icons/SecuritySettingsSvg";

const Settings: NextPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const [settings, setSettings] = useState<any>();
  const { settings: settingsReducer } = useSelector(
    (state: RootState) => state.common
  );
  useEffect(() => {
    dispatch(UserSettingsAction(setSettings));

    return () => {
      setSettings(null);
    };
  }, []);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D]  tradex-px-5 md:tradex-px-10 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                {t("Security Settings")}
              </h2>
              <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                <div className="tradex-rounded-lg tradex-border tradex-border-background-primary tradex-p-6 tradex-space-y-12">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <p className=" tradex-text-[22px] tradex-leading-[26px] tradex-font-bold !tradex-text-title">
                      {t("Google Authentication Settings")}
                    </p>
                  </div>
                  <div className=" tradex-flex tradex-justify-center tradex-items-center">
                    <SecuritySettingsSvg />
                  </div>
                  <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-items-start tradex-justify-between tradex-gap-6">
                    <div className=" tradex-space-y-3">
                      <p className=" tradex-text-xl tradex-leading-6 tradex-font-bold tradex-text-title">
                        {t("Authenticator app")}
                      </p>
                      <div className="">
                        {settings?.user?.google2fa === 0 ? (
                          <button
                            data-toggle="modal"
                            data-target="#exampleModal"
                            className="tradex-py-2.5 tradex-px-8 tradex-bg-primary tradex-rounded !tradex-text-white tradex-text-sm tradex-leading-5 tradex-font-semibold"
                          >
                            {t("Set up")}
                          </button>
                        ) : (
                          <button
                            data-toggle="modal"
                            data-target="#exampleModal"
                            className=" tradex-text-sm tradex-leading-4 tradex-font-medium tradex-underline tradex-text-primary"
                          >
                            {t("Remove Google Authentication")}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className=" tradex-space-y-2 tradex-max-w-[270px]">
                      <p className=" tradex-text-xl tradex-leading-6 tradex-font-bold tradex-text-title">
                        {t("Security")}
                      </p>

                      <p className="tradex-text-sm tradex-leading-4 tradex-text-body">
                        {parseInt(settings?.user?.g2f_enabled) === 1
                          ? t(
                              "Please turn off this option to disable two factor authentication"
                            )
                          : t(
                              "Please turn on this option to enable two factor authentication"
                            )}
                      </p>

                      <form>
                        <label className="tradex-inline-flex tradex-items-center tradex-cursor-pointer">
                          <input
                            type="checkbox"
                            name="google_login_enable"
                            className="tradex-sr-only tradex-peer"
                            checked={
                              parseInt(settings?.user?.g2f_enabled) === 1
                                ? true
                                : false
                            }
                            onChange={async (e) => {
                              const settingsResponse =
                                await Google2faLoginAction();
                              if (settingsResponse?.success === false) return;
                              setSettings({
                                ...settings,
                                user: settingsResponse,
                              });
                            }}
                          />
                          <div className="tradex-relative tradex-w-11 tradex-h-6 tradex-bg-primary/30 peer-checked:after:tradex-translate-x-full   tradex-rounded-full tradex-peer tradex-peer-checked:tradex-after:translate-x-full  after:tradex-content-[''] after:tradex-absolute after:tradex-top-[2px] after:tradex-start-[2px] after:tradex-bg-primary after:tradex-rounded-full after:tradex-h-5 after:tradex-w-5 after:tradex-transition-all  peer-checked:tradex-bg-primary/30"></div>
                        </label>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="tradex-rounded-lg tradex-border tradex-border-background-primary tradex-p-6 tradex-space-y-12">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <p className=" tradex-text-[22px] tradex-leading-[26px] tradex-font-bold !tradex-text-title">
                      {t("Preference Settings")}
                    </p>
                  </div>
                  <div className="tradex-space-y-2">
                    <label className="tradex-input-label tradex-mb-0">
                      {t("Currency")}
                    </label>
                    <div className="cp-user-preferance-setting border-0">
                      <select
                        name="currency"
                        className="tradex-input-field !tradex-bg-background-main !tradex-border-solid !tradex-border !tradex-border-background-primary"
                        onChange={(e) => {
                          dispatch(UpdateCurrencyAction(e.target.value));
                        }}
                      >
                        <option value={``}>{t("Select Currency")}</option>
                        {settings?.fiat_currency?.map(
                          (currency: any, index: any) => (
                            <option
                              key={index}
                              selected={
                                settingsReducer.currency === currency.code
                              }
                              defaultChecked={
                                settingsReducer.currency === currency.lang
                              }
                              value={currency.code}
                            >
                              {currency.name}
                            </option>
                          )
                        )}
                      </select>
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
      <GoogleAuthModal settings={settings} setSettings={setSettings} />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/settings");
  return {
    props: {},
  };
};

export default Settings;
