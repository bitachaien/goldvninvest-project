import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { BsFillMoonFill, BsFillSunFill, BsBarChartLine } from "react-icons/bs";
import { FaPeopleArrows } from "react-icons/fa";
import { BiLineChart, BiShapeCircle } from "react-icons/bi";
import OutsideClickHandler from "react-outside-click-handler";
import { RootState } from "state/store";
import useTranslation from "next-translate/useTranslation";
import { notification } from "service/notification";
import { useRouter } from "next/router";
import {
  changeLayout,
  changeThemeSettingsDashboard,
  checkThemeState,
  darkModeToggle,
  swapGreenToRedAndRedToGeen,
} from "helpers/functions";
import { IoMdGlobe } from "react-icons/io";
import {
  AiOutlineAppstore,
  AiOutlineClose,
  AiOutlineLineChart,
  AiOutlineLogin,
  AiOutlineSetting,
} from "react-icons/ai";
import {
  EXCHANGE_LAYOUT_ONE,
  EXCHANGE_LAYOUT_THREE,
  EXCHANGE_LAYOUT_TWO,
} from "helpers/core-constants";
import { FiChevronDown, FiSettings } from "react-icons/fi";
import { AiFillCaretDown } from "react-icons/ai";

const UnAuthNav = ({
  setThemeColor,
  ThemeColor,
  showSettings,
  layout,
  setLayout,
}: any) => {
  const { isLoggedIn, user, logo } = useSelector(
    (state: RootState) => state.user
  );
  const containerRef = useRef<any>(null);
  const router = useRouter();
  const [theme, setTheme] = useState(0);
  const { settings } = useSelector((state: RootState) => state.common);
  const { currentPair } = useSelector((state: RootState) => state.exchange);
  const { navbar } = settings;
  const [active, setActive] = useState(false);
  const [notificationData, setNotification] = useState<any>([]);
  const [languageActive, setLanguageActive] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const { t } = useTranslation("common");
  const getNotifications = async () => {
    const data = await notification();
    setNotification(data.data.data);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event: any) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsSettingsDropdownOpen(false);
    }
  };
  useEffect(() => {
    checkThemeState(setTheme, dispatch);
    isLoggedIn && getNotifications();
  }, [isLoggedIn]);
  useEffect(() => {
    if (router.locale === "ar") {
      document.body.classList.add("rtl-style");
    } else {
      document.body.classList.remove("rtl-style");
    }
  }, [router.locale]);

  const handleSpotTradeUrl = () => {
    let spotUrl = `/exchange/dashboard`;
    if (currentPair && router.locale !== "en") {
      return `/${router.locale}/${spotUrl}?coin_pair=${currentPair}`;
    }

    if (!currentPair && router.locale !== "en") {
      return `/${router.locale}/${spotUrl}`;
    }

    if (currentPair && router.locale == "en") {
      return `${spotUrl}?coin_pair=${currentPair}`;
    }

    return spotUrl;
  };

  return (
    <div className="">
      <div className="cp-user-top-bar position-fixed !tradex-bg-gradient-to-r !tradex-from-primary-10  !tradex-to-background-primary !tradex-to-40% !tradex-shadow-[2px_2px_32px_0px_#8F8F8F26]">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-20">
              <div className="cp-user-logo">
                <Link href="/">
                  <a>
                    <img
                      src={logo || "/green_logo.png"}
                      className="img-fluid cp-user-logo-large"
                      style={{ maxHeight: "50px" }}
                      alt=""
                    />
                  </a>
                </Link>
              </div>
              <div
                style={{
                  height: "16px",
                  background: "#1d1d1d14",
                  width: "1px",
                }}
              />

              <div className="main-menu">
                <ul>
                  <li>
                    <a
                      className="flex h-48 gap-2"
                      href="#"
                      aria-expanded="true"
                    >
                      {/* <span className="cp-user-icon">
                        <BsBarChartLine />
                      </span> */}
                      <span>{t("Exchange")}</span>
                      <div>
                        <AiFillCaretDown size={12} />
                      </div>
                    </a>

                    <ul className="lang-list dropdown-menu-main exchange-list-position">
                      <Link href={handleSpotTradeUrl()}>
                        <li>
                          <a className="cursor-pointer">
                            <div className="py-1 menu-hover">
                              <span className="cp-user-icon">
                                {" "}
                                <BiShapeCircle />{" "}
                              </span>{" "}
                              <span>{t("Spot Trading")}</span>{" "}
                            </div>
                          </a>
                        </li>
                      </Link>
                      {parseInt(settings?.p2p_module) === 1 && (
                        <li>
                          <Link href="/p2p">
                            <a className="py-1 menu-hover">
                              {" "}
                              <span className="cp-user-icon">
                                <FaPeopleArrows />
                              </span>
                              <span>{t("P2P Trading")}</span>{" "}
                            </a>
                          </Link>
                        </li>
                      )}
                      {Number(settings?.enable_future_trade) === 1 && (
                        <Link
                          href={
                            router.locale !== "en"
                              ? `/${router.locale}/futures/exchange`
                              : "/futures/exchange"
                          }
                        >
                          <li
                            className={
                              router.pathname == "/futures/exchange"
                                ? "cp-user-active-page"
                                : ""
                            }
                          >
                            <a href="" className="menu-hover">
                              <span className="cp-user-icon">
                                {" "}
                                <BiShapeCircle />{" "}
                              </span>{" "}
                              <span>{t("Futures Trading")}</span>
                            </a>
                          </li>
                        </Link>
                      )}
                    </ul>
                  </li>
                  <li
                    className={
                      router.pathname == "/markets" ? "cp-user-active-page" : ""
                    }
                  >
                    <Link href="/markets">
                      <a>
                        {/* <span className="cp-user-icon">
                          <BiLineChart />
                        </span> */}
                        <span>{t("Markets")}</span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="d-none d-lg-flex align-items-center">
              <nav className="main-menu">
                <ul>
                  <li>
                    <Link href={`/signin?redirect=${router.asPath}`}>
                      {t("Login")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup">
                      <a className="gap-4 tradex-flex tradex-items-center !tradex-bg-black tradex-rounded-[90px] tradex-py-[9px] tradex-px-5 tradex-text-sm tradex-font-medium tradex-leading-[130%] ">
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-16 w-16"
                        >
                          <path
                            d="M13.5 6.379V3h-3v3.379l-2.94-2.94-2.12 2.122L7.878 8H4v3h6.75V8h2.5v3H20V8h-3.879l2.44-2.44-2.122-2.12L13.5 6.378zM4 13.5V20h6.75v-6.5H4zM13.25 20H20v-6.5h-6.75V20z"
                            fill="currentColor"
                          ></path>
                        </svg> */}
                        <span className="!tradex-text-white">
                          {t("Sign up")}
                        </span>{" "}
                      </a>
                    </Link>
                  </li>

                  <li className="hm-notify">
                    <a
                      className=" tradex-w-[40px] tradex-h-[40px] tradex-rounded-full !tradex-bg-border-one tradex-flex tradex-justify-center tradex-items-center"
                      href="#"
                      aria-expanded="true"
                    >
                      <span className="">
                        <IoMdGlobe size={25} />
                      </span>
                    </a>
                    <ul className="dropdown-menu-main display-grid w-370 display-grid grid-temp-col-2 w-370 lang-list-position">
                      {settings?.LanguageList?.map((item: any, index: any) => (
                        <li key={index}>
                          <Link href={router.asPath} locale={item.key}>
                            <a className="py-1 menu-hover">{item.name}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li
                    onClick={() => {
                      darkModeToggle(settings, setTheme, dispatch);
                    }}
                  >
                    <a
                      href="#"
                      className=" tradex-w-[40px] tradex-h-[40px] tradex-rounded-full !tradex-bg-border-one tradex-flex tradex-justify-center tradex-items-center"
                    >
                      {theme === 0 ? (
                        <>
                          <BsFillSunFill size={20} />
                        </>
                      ) : (
                        <>
                          <BsFillMoonFill size={14} />
                        </>
                      )}
                    </a>
                  </li>
                  {showSettings && (
                    <li ref={containerRef}>
                      <div>
                        <span
                          className="pointer"
                          onClick={() =>
                            setIsSettingsDropdownOpen((prev) => !prev)
                          }
                        >
                          <AiOutlineSetting size={20} className="mr-2" />
                        </span>
                        {isSettingsDropdownOpen && (
                          <div className="settings-dropdown">
                            <div className="settings-dropdown-header">
                              <p>{t("Theme")}</p>
                              <label className="gift-card-buy-switch mb-0">
                                <input
                                  type="checkbox"
                                  onChange={() => {
                                    darkModeToggle(
                                      settings,
                                      setTheme,
                                      dispatch
                                    );
                                  }}
                                  checked={theme === 0}
                                />
                                <span className="gift-card-buy-slider gift-card-buy"></span>
                              </label>
                            </div>
                            <div className="pb-3 border-bottom text-left">
                              <p className="mt-2 text-14 font-medium">
                                {t("Style Settings")}
                              </p>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="exampleRadios"
                                  id="exampleRadios1"
                                  checked={ThemeColor.chooseColor === 1}
                                  onChange={() => {
                                    changeThemeSettingsDashboard(
                                      "#32d777",
                                      "#d63031",
                                      setThemeColor,
                                      ThemeColor,
                                      1
                                    );
                                  }}
                                  // value="option1"
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadios1"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex gap-5">
                                      <span className="margin-right-auto">
                                        {t("Fresh")}
                                      </span>
                                      <span className="settings-dropdown-color-box bg-32d777"></span>
                                      <span className="settings-dropdown-color-box bg-d63031"></span>
                                    </span>
                                  </span>
                                </label>
                              </div>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="exampleRadios"
                                  id="exampleRadios3"
                                  checked={ThemeColor.chooseColor === 2}
                                  value="option1"
                                  onChange={() => {
                                    changeThemeSettingsDashboard(
                                      "#3498db",
                                      "#9b59b6",
                                      setThemeColor,
                                      ThemeColor,
                                      2
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadios3"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex gap-5">
                                      <span className="margin-right-auto text-14">
                                        {t("Traditional")}
                                      </span>
                                      <span className="settings-dropdown-color-box bg-3498db"></span>
                                      <span className="settings-dropdown-color-box bg-9b59b6"></span>
                                    </span>
                                  </span>
                                </label>
                              </div>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="exampleRadios"
                                  id="exampleRadios2"
                                  value="option1"
                                  checked={ThemeColor.chooseColor === 3}
                                  onChange={() => {
                                    changeThemeSettingsDashboard(
                                      "#f39c12",
                                      "#d35400",
                                      setThemeColor,
                                      ThemeColor,
                                      3
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadios2"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex gap-5">
                                      <span className="margin-right-auto">
                                        {t("Color Vision Deficiency")}
                                      </span>
                                      <span className="settings-dropdown-color-box bg-f39c12"></span>
                                      <span className="settings-dropdown-color-box bg-d35400"></span>
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="pb-3 border-bottom text-left">
                              <p className="mt-2 text-14 font-medium">
                                {t("Color Preference")}
                              </p>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="exampleRadios1"
                                  id="exampleRadios4"
                                  value="option1"
                                  checked={ThemeColor.redGreenUpDown === 1}
                                  onChange={() => {
                                    swapGreenToRedAndRedToGeen(
                                      setThemeColor,
                                      ThemeColor,
                                      1
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadios4"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex">
                                      <span className="margin-right-auto">
                                        {t("Green Up/Red Down")}
                                      </span>
                                      <span>
                                        <svg
                                          stroke="currentColor"
                                          fill="currentColor"
                                          strokeWidth="0"
                                          viewBox="0 0 16 16"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="text-58bd7d"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                                          ></path>
                                        </svg>
                                      </span>
                                      <span>
                                        <svg
                                          stroke="currentColor"
                                          fill="currentColor"
                                          strokeWidth="0"
                                          viewBox="0 0 16 16"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="text-fa0000"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                                          ></path>
                                        </svg>
                                      </span>
                                    </span>
                                  </span>
                                </label>
                              </div>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="exampleRadios1"
                                  id="exampleRadios5"
                                  value="option1"
                                  checked={ThemeColor.redGreenUpDown === 2}
                                  onChange={() => {
                                    swapGreenToRedAndRedToGeen(
                                      setThemeColor,
                                      ThemeColor,
                                      2
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadios5"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex">
                                      <span className="margin-right-auto text-14">
                                        {t("Green Down/Red Up")}
                                      </span>
                                      <span>
                                        <svg
                                          stroke="currentColor"
                                          fill="currentColor"
                                          strokeWidth="0"
                                          viewBox="0 0 16 16"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="text-fa0000"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                                          ></path>
                                        </svg>
                                      </span>
                                      <span>
                                        <svg
                                          stroke="currentColor"
                                          fill="currentColor"
                                          strokeWidth="0"
                                          viewBox="0 0 16 16"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="text-58bd7d"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                                          ></path>
                                        </svg>
                                      </span>
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="pb-3 border-bottom text-left">
                              <p className="mt-2 text-14 font-medium">Layout</p>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="layout1"
                                  id="exampleRadiosLayout1"
                                  value="option1"
                                  checked={layout === EXCHANGE_LAYOUT_ONE}
                                  onChange={() => {
                                    changeLayout(
                                      EXCHANGE_LAYOUT_ONE,
                                      setLayout
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadiosLayout1"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex">
                                      <span className="margin-right-auto">
                                        {t("Layout one")}
                                      </span>
                                      <div>
                                        <img src="/layout_one.png" width={50} />
                                      </div>
                                    </span>
                                  </span>
                                </label>
                              </div>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="layout1"
                                  id="exampleRadiosLayout2"
                                  value="option1"
                                  checked={layout === EXCHANGE_LAYOUT_TWO}
                                  onChange={() => {
                                    changeLayout(
                                      EXCHANGE_LAYOUT_TWO,
                                      setLayout
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadiosLayout2"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex">
                                      <span className="margin-right-auto text-14">
                                        {t("Layout two")}
                                      </span>
                                      <div>
                                        <img src="/layout_two.png" width={50} />
                                      </div>
                                    </span>
                                  </span>
                                </label>
                              </div>
                              <div className="form-check py-1">
                                <input
                                  className="form-check-input radio-scale"
                                  type="radio"
                                  name="layout1"
                                  id="exampleRadiosLayout3"
                                  value="option1"
                                  checked={layout === EXCHANGE_LAYOUT_THREE}
                                  onChange={() => {
                                    changeLayout(
                                      EXCHANGE_LAYOUT_THREE,
                                      setLayout
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label w-full"
                                  htmlFor="exampleRadiosLayout3"
                                >
                                  <span className="w-full d-inline-block">
                                    <span className="d-flex">
                                      <span className="margin-right-auto text-14">
                                        {t("Layout three")}
                                      </span>
                                      <div>
                                        <img
                                          src="/layout_three.png"
                                          width={50}
                                        />
                                      </div>
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            <div className="d-xl-none d-block">
              <div className="cp-user-top-bar-right">
                <div
                  className="cp-user-sidebar-toggler-s2"
                  onClick={() => {
                    setActive(active ? false : true);
                    setLanguageActive(false);
                  }}
                >
                  <img src="/menu.svg" className="img-fluid" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OutsideClickHandler onOutsideClick={() => setActive(false)}>
        <div className={`cp-user-sidebar w-full ${active ? "active" : ""}`}>
          <div className="cp-user-sidebar-menu cp-user-sidebar-menu-mobile scrollbar-inner">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div className="navbar-collapse">
                <ul className="navbar-nav mr-auto">
                  <li className="text-right">
                    <span onClick={() => setActive(false)}>
                      <AiOutlineClose size={20} />
                    </span>
                  </li>
                  {navbar?.trade?.status && (
                    <li
                      className={
                        router.pathname == "/exchange/dashboard" ||
                        router.pathname == "/p2p" ||
                        router.pathname == "/futures/exchange"
                          ? "active-navbar nav-item dropdown"
                          : "nav-item dropdown"
                      }
                    >
                      <a
                        className="nav-link text-primary-color-two d-flex align-items-center justify-content-between"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {navbar?.trade?.name ? (
                          navbar?.trade?.name
                        ) : (
                          <div className="d-flex align-items-center gap-5">
                            <span>
                              <BsBarChartLine />
                            </span>
                            <span className="line-h-19">{t("Exchange")}</span>
                          </div>
                        )}
                        <FiChevronDown size={20} />
                      </a>
                      <ul
                        className="dropdown-menu bg-transparent border-0 py-0 my-0"
                        aria-labelledby="navbarDropdown"
                      >
                        {navbar?.trade?.status && (
                          <Link href={handleSpotTradeUrl()}>
                            <li
                              className={
                                router.pathname == "/exchange/dashboard"
                                  ? "active-navbar"
                                  : ""
                              }
                            >
                              <a
                                className="px-3 py-2 text-primary-color-two cursor-pointer"
                                onClick={() => setActive(false)}
                              >
                                <span>{t("Spot Trading")}</span>
                              </a>
                            </li>
                          </Link>
                        )}
                        {parseInt(settings?.p2p_module) === 1 && (
                          <Link href={isLoggedIn ? "/p2p" : "/signin"}>
                            <li
                              className={
                                router.pathname == "/p2p" ? "active-navbar" : ""
                              }
                            >
                              <span
                                className="px-3 py-2 text-primary-color-two"
                                onClick={() => setActive(false)}
                              >
                                <span>{t("P2P Trading")}</span>
                              </span>
                            </li>
                          </Link>
                        )}
                        {Number(settings?.enable_future_trade) === 1 && (
                          <Link
                            href={
                              router.locale !== "en"
                                ? `/${router.locale}/futures/exchange`
                                : "/futures/exchange"
                            }
                          >
                            <li
                              className={
                                router.pathname == "/futures/exchange"
                                  ? "active-navbar"
                                  : ""
                              }
                            >
                              <span
                                className="px-3 py-2 text-primary-color-two"
                                onClick={() => setActive(false)}
                              >
                                <span>{t("Futures Trading")}</span>
                              </span>
                            </li>
                          </Link>
                        )}
                      </ul>
                    </li>
                  )}

                  <li
                    className={
                      router.pathname == "/markets"
                        ? "active-navbar nav-item"
                        : "nav-item"
                    }
                  >
                    <Link href="/markets">
                      <a className="nav-link text-primary-color-two">
                        <div className="d-flex align-items-center gap-5">
                          <span>
                            <BiLineChart />
                          </span>
                          <span className="line-h-19">{t("Markets")}</span>
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/signin">
                      <a className="nav-link text-primary-color-two">
                        <div className="d-flex align-items-center gap-5">
                          <span>
                            <AiOutlineLogin />
                          </span>
                          <span className="line-h-19">{t("Login")}</span>
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/signup">
                      <a className="nav-link text-primary-color-two">
                        <div className="d-flex align-items-center gap-5">
                          <span>
                            <AiOutlineAppstore />
                          </span>
                          <span className="line-h-19">{t("Sign up")}</span>
                        </div>
                      </a>
                    </Link>
                  </li>

                  <li>
                    <div className="d-flex gap-10 align-items-center justify-content-between py-3">
                      <div className="d-flex align-items-center gap-5">
                        <span>
                          <FiSettings size={16} />
                        </span>
                        <p className="text-16 text-primary-color-two line-h-19">
                          {t("Theme")}
                        </p>
                      </div>
                      <label className="gift-card-buy-switch mb-0">
                        <input
                          type="checkbox"
                          onChange={() => {
                            darkModeToggle(settings, setTheme, dispatch);
                          }}
                          checked={theme === 0}
                        />
                        <span className="gift-card-buy-slider gift-card-buy"></span>
                      </label>
                    </div>
                  </li>
                  <li className={"nav-item"}>
                    <div className="d-flex gap-5 align-items-center py-3">
                      <span
                        className=""
                        onClick={() => {
                          setLanguageActive(true);
                          setActive(false);
                        }}
                      >
                        <IoMdGlobe size={20} />
                      </span>
                      <span
                        className="text-primary-color-two text-16 leading-18"
                        onClick={() => {
                          setLanguageActive(true);
                          setActive(false);
                        }}
                      >
                        {
                          settings?.LanguageList?.find(
                            (item: any) => item.key === router.locale
                          )?.name
                        }
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </OutsideClickHandler>
      {languageActive && (
        <div
          className={`cp-user-sidebar w-full ${languageActive ? "active" : ""}`}
        >
          <div className="cp-user-sidebar-menu cp-user-sidebar-menu-mobile scrollbar-inner">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div className="navbar-collapse">
                <ul className="navbar-nav mr-auto">
                  <li className="text-right">
                    <span onClick={() => setLanguageActive(false)}>
                      <AiOutlineClose size={20} />
                    </span>
                  </li>
                  {settings?.LanguageList?.map((item: any, index: any) => (
                    <li
                      className={
                        item.key === router.locale
                          ? "active-navbar nav-item"
                          : "nav-item"
                      }
                      key={index}
                      onClick={() => setLanguageActive(false)}
                    >
                      <Link href={router.asPath} locale={item.key}>
                        <a className="nav-link text-primary-color-two">
                          {item.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnAuthNav;
