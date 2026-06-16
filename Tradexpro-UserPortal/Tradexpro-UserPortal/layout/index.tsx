import Navbar from "components/common/Navbar";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import {
  CommonLandingCustomSettings,
  commomSettings,
  customPage,
  landingPage,
} from "service/landing-page";
import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { GetUserInfoByTokenAction } from "state/actions/user";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "state/store";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import CookieAccept from "components/common/cookie-accept";
import Head from "next/head";
import {
  setCopyright_text,
  setCustomPageData,
  setLoading,
  setLogo,
  setOneNotification,
  setSocialData,
} from "state/reducer/user";
import { setSettings } from "state/reducer/common";
import Loading from "components/common/loading";
import { checkDarkMode, hexToRgb, rootThemeCheck } from "helpers/functions";
import { DEFAULT_PRIMARY_COLOR } from "helpers/core-constants";
async function listenMessages(dispatch: any) {
  //@ts-ignore
  window.Pusher = Pusher;
  //@ts-ignore
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "test",
    wsHost: process.env.NEXT_PUBLIC_HOST_SOCKET,
    wsPort: process.env.NEXT_PUBLIC_WSS_PORT
      ? process.env.NEXT_PUBLIC_WSS_PORT
      : 6006,
    wssPort: 443,
    forceTLS: false,
    cluster: "mt1",
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  //@ts-ignore
  window.Echo.channel(
    `usernotification_${localStorage.getItem("user_id")}`
  ).listen(".receive_notification", (e: any) => {
    //  dispatch(setChatico(e.data));
    dispatch(setOneNotification(e?.notification_details));
  });
}
let socketCall = 0;
const Index = ({ children }: any) => {
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [showterms, setShowTerms] = useState(false);
  const [metaData, setMetaData] = useState({
    app_title: "",
    copyright_text: "",
    exchange_url: "",
    favicon: "",
    login_logo: "",
    logo: "",
    maintenance_mode: "no",
  });
  const { isLoading, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const { settings } = useSelector((state: RootState) => state.common);

  const dispatch = useDispatch();
  const router = useRouter();
  const getCommonSettings = async () => {
    try {
      dispatch(setLoading(true));

      const { data: CommonLanding } = await CommonLandingCustomSettings("en");
      {
        CommonLanding?.common_settings.default_theme_mode &&
          rootThemeCheck(CommonLanding?.common_settings.default_theme_mode);
      }
      dispatch(setLogo(CommonLanding?.common_settings.logo));
      localStorage.setItem("animateLogo", CommonLanding?.common_settings.logo);
      localStorage.setItem(
        "animateEnable",
        CommonLanding?.common_settings.loading_animation
      );
      dispatch(setSettings(CommonLanding?.common_settings));
      dispatch(setCustomPageData(CommonLanding.custom_page_settings));
      dispatch(
        setCopyright_text(CommonLanding?.landing_settings?.copyright_text)
      );
      dispatch(
        setSocialData(CommonLanding?.landing_settings?.media_list ?? [])
      );
      setMetaData(CommonLanding?.common_settings);
      checkDarkMode(CommonLanding?.common_settings, dispatch);

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (!settings || !settings?.google_analytics_tracking_id) {
      return;
    }

    ReactGA.initialize(settings?.google_analytics_tracking_id);

    ReactGA.send({
      hitType: "pageview",
      page: router.pathname,
      title: settings?.app_title,
    });
  }, [settings]);
  useEffect(() => {
    if (socketCall === 0) {
      listenMessages(dispatch);
    }
    socketCall = 1;
  });
  useEffect(() => {
    const color =
      localStorage.getItem("--primary-color") || DEFAULT_PRIMARY_COLOR["green"];
    document.documentElement.style.setProperty(
      "--primary-color",
      hexToRgb(color)
    );
    getCommonSettings();
  }, []);
  useEffect(() => {
    const path = router.pathname;
    if (
      path === "/signup" ||
      path === "/signin" ||
      path === "/exchange/dashboard" ||
      path === "/forgot-password" ||
      path === "/reset-password" ||
      path === "/g2f-verify" ||
      path === "/" ||
      path === "/verify-email" ||
      path === "user/notification" ||
      path === "/demo-trade" ||
      path === "/demo-trade/user/my-wallet"
    ) {
      setNavbarVisible(false);
    } else {
      setNavbarVisible(true);
    }
  }, [router.pathname]);
  const iUnderStand = () => {
    Cookies.set("terms", "yes");
    setShowTerms(false);
  };
  useEffect(() => {
    const token = Cookies.get("token");
    const terms = Cookies.get("terms");
    if (terms === "yes" && settings.cookie_status == "0") {
      setShowTerms(false);
    } else if (terms != "yes" && settings.cookie_status == "1") {
      setShowTerms(true);
    }
    if (token) {
      dispatch(GetUserInfoByTokenAction());
    }
  }, [isLoggedIn, settings.cookie_status]);

  if (isLoading)
    return (
      <>
        <Head>
          <title>
            {metaData?.app_title || process.env.NEXT_PUBLIC_APP_NAME}
          </title>
          <link
            rel="icon"
            href={metaData?.favicon || process.env.NEXT_PUBLIC_FAVICON}
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="title"
            property="og:title"
            content={
              settings?.seo_social_title || process.env.NEXT_PUBLIC_SEO_TITLE
            }
          />

          <meta
            name="description"
            property="og:description"
            content={
              settings?.seo_meta_description || process.env.NEXT_PUBLIC_SEO_DES
            }
          />
          <meta
            name="keywords"
            property="og:keywords"
            content={
              settings?.seo_meta_keywords ||
              process.env.NEXT_PUBLIC_SEO_KEYWORDS
            }
          />
          <meta name="robots" content="index,follow" />
        </Head>
        <Loading />

        <h1 className="sr-only">{process.env.NEXT_PUBLIC_SEO_TITLE}</h1>
        <h2 className="sr-only">{process.env.NEXT_PUBLIC_SEO_DES}</h2>
      </>
    );

  return navbarVisible ? (
    <div>
      <Head>
        <title>{metaData?.app_title || process.env.NEXT_PUBLIC_APP_NAME}</title>
        <link
          rel="icon"
          href={metaData?.favicon || process.env.NEXT_PUBLIC_FAVICON}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="title"
          property="og:title"
          content={settings?.seo_social_title}
        />

        <meta
          name="description"
          property="og:description"
          content={settings?.seo_meta_description}
        />
        <meta
          name="keywords"
          property="og:keywords"
          content={settings?.seo_meta_keywords}
        />
        <meta name="robots" content="index,follow" />
        <meta name="image" property="og:image" content={settings?.seo_image} />
      </Head>
      <Navbar settings={settings} isLoggedIn={isLoggedIn} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="tradex-mt-[68px]">{children}</div>
      {showterms && <CookieAccept iUnderStand={iUnderStand} />}
    </div>
  ) : (
    <>
      <Head>
        <title>{metaData?.app_title || process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="title"
          property="og:title"
          content={settings?.seo_social_title}
        />

        <meta
          name="description"
          property="og:description"
          content={settings?.seo_meta_description}
        />
        <meta
          name="keywords"
          property="og:keywords"
          content={settings?.seo_meta_keywords}
        />
        <meta name="robots" content="index,follow" />
        <meta name="image" property="og:image" content={settings?.seo_image} />
        <link
          rel="icon"
          href={metaData?.favicon || process.env.NEXT_PUBLIC_FAVICON}
        />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="tradex-mt-[68px]">{children}</div>
      {showterms && <CookieAccept iUnderStand={iUnderStand} />}
    </>
  );
};

export default Index;
