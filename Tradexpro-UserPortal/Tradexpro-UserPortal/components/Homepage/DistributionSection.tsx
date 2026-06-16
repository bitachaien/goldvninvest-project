import useTranslation from "next-translate/useTranslation";
import { FaApple, FaGoogle, FaWindows, FaLinux, FaMap } from "react-icons/fa";

import React from "react";
import BlockComponent from "components/Animation/block-component";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import PlayStoreQr from "components/PlayStoreQr";

const DistributionSection = ({ landing }: any) => {
  const { t } = useTranslation("common");
  const { theme } = useSelector((state: RootState) => state.common);
  const staticDatas = [
    {
      name: "App Store",
      icon: "icon/apple.svg",
      url: landing?.apple_store_link,
    },
    {
      name: "Google Play",
      icon: "icon/google-play.svg",
      url: landing?.google_store_link,
    },
    {
      name: "MacOS",
      icon: "icon/Mocos.svg",
      url: landing?.macos_store_link,
    },
    {
      name: "Windows",
      icon: "icon/windows.svg",
      url: landing?.windows_store_link,
    },
    {
      name: "Linux",
      icon: "icon/linux.svg",
      url: landing?.linux_store_link,
    },
    {
      name: "Api",
      icon: "icon/Api.svg",
      url: landing?.api_link,
    },
  ];
  console.log("landing", landing);

  return (
    <>
      {parseInt(landing?.landing_fourth_section_status) === 1 &&
        parseInt(landing?.download_link_display_type) === 1 && (
          <section className="tradex-relative tradex-z-10 tradex-pt-[60px] md:tradex-pt-[120px]">
            <div className=" tradex-container">
              <div className=" tradex-flex tradex-flex-col lg:tradex-flex-row  tradex-gap-10">
                <div className="lg:tradex-max-w-[500px] xl:tradex-max-w-[695px] xl:tradex-min-w-[695px] tradex-space-y-6 md:tradex-space-y-12">
                  <div className=" tradex-space-y-4 md:tradex-space-y-10">
                    <div className=" tradex-space-y-2 md:tradex-space-y-4">
                      <h3 className="tradex-max-w-[547px] tradex-text-[24px] tradex-leading-[32px]  md:tradex-text-[32px] md:tradex-leading-[48px] xl:tradex-text-[48px] xl:tradex-leading-[60px] !tradex-text-title tradex-font-bold">
                        {landing?.trade_anywhere_title ||
                          "Tradexpro: Trade With Anytime Anywhere"}
                      </h3>
                    </div>

                    <div className=" tradex-flex tradex-items-center tradex-gap-6 md:tradex-gap-12">
                      <PlayStoreQr storeUrl={landing?.google_store_link} />
                      <div className=" tradex-space-y-3">
                        <p className=" tradex-text-base tradex-leading-6 !tradex-text-body">
                          {t("Scan Now to Download")}
                        </p>
                        <p className=" tradex-text-xl tradex-leading-6 !tradex-text-title">
                          {t("Scan Now to Download")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" tradex-flex tradex-items-center tradex-flex-wrap tradex-gap-6">
                    <a
                      href={landing?.apple_store_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="tradex-min-w-[88px] tradex-min-h-[80px] tradex-bg-background-primary tradex-rounded-lg tradex-border tradex-border-background-card tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-3 tradex-transition-all tradex-duration-[260ms] tradex-ease-[cubic-bezier(0.42,0,0.58,1)] tradex-delay-[0s] hover:tradex-shadow-[2px_2px_50px_0px_#0000000F]">
                        <span className=" tradex-block tradex-max-h-[30px]">
                          <svg
                            width="25"
                            height="29"
                            viewBox="0 0 25 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className=" tradex-fill-title"
                          >
                            <path
                              d="M18.0795 0C18.147 0 18.2145 0 18.2858 0C18.4513 2.04514 17.6707 3.57327 16.722 4.67988C15.7911 5.77886 14.5164 6.84473 12.4547 6.683C12.3172 4.66715 13.0991 3.25236 14.0465 2.14829C14.9252 1.11935 16.5361 0.20375 18.0795 0Z"
                              fill="inherit"
                            />
                            <path
                              d="M24.3214 21.2866C24.3214 21.307 24.3214 21.3248 24.3214 21.3439C23.7419 23.0987 22.9155 24.6027 21.9069 25.9983C20.9862 27.2654 19.858 28.9705 17.8434 28.9705C16.1026 28.9705 14.9463 27.8512 13.1622 27.8206C11.275 27.7901 10.2371 28.7566 8.51163 28.9998C8.31424 28.9998 8.11686 28.9998 7.9233 28.9998C6.65623 28.8165 5.63366 27.813 4.8887 26.9089C2.69202 24.2372 0.994524 20.7862 0.678711 16.3699C0.678711 15.9369 0.678711 15.5052 0.678711 15.0722C0.812422 11.9116 2.34819 9.34178 4.38951 8.09636C5.46684 7.43417 6.94784 6.87004 8.59695 7.12218C9.30371 7.23169 10.0257 7.47365 10.6586 7.71305C11.2584 7.94354 12.0085 8.35232 12.7191 8.33067C13.2004 8.31666 13.6792 8.06579 14.1644 7.88879C15.5856 7.37559 16.9787 6.78726 18.815 7.0636C21.0219 7.39724 22.5882 8.37779 23.556 9.89063C21.6892 11.0787 20.2132 12.8692 20.4654 15.9267C20.6895 18.7041 22.3042 20.329 24.3214 21.2866Z"
                              fill="inherit"
                            />
                          </svg>
                        </span>
                        <p className=" tradex-text-xs tradex-font-medium !tradex-text-title">
                          {t("App Store")}
                        </p>
                      </div>
                    </a>

                    <a
                      href={landing?.google_store_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="tradex-min-w-[88px] tradex-min-h-[80px] tradex-bg-background-primary tradex-rounded-lg tradex-border tradex-border-background-card tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-3 tradex-transition-all tradex-duration-[260ms] tradex-ease-[cubic-bezier(0.42,0,0.58,1)] tradex-delay-[0s] hover:tradex-shadow-[2px_2px_50px_0px_#0000000F]">
                        <img
                          src="/google_icon.png"
                          className="tradex-max-h-[30px]"
                          alt=""
                        />
                        <p className=" tradex-text-xs tradex-font-medium !tradex-text-title">
                          {t("Google Play")}
                        </p>
                      </div>
                    </a>
                    <a
                      href={landing?.android_store_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="tradex-min-w-[88px] tradex-min-h-[80px] tradex-bg-background-primary tradex-rounded-lg tradex-border tradex-border-background-card tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-3 tradex-transition-all tradex-duration-[260ms] tradex-ease-[cubic-bezier(0.42,0,0.58,1)] tradex-delay-[0s] hover:tradex-shadow-[2px_2px_50px_0px_#0000000F]">
                        <img
                          src="/android_icon.png"
                          className="tradex-max-h-[30px]"
                          alt=""
                        />
                        <p className=" tradex-text-xs tradex-font-medium !tradex-text-title">
                          {t("Android APK")}
                        </p>
                      </div>
                    </a>
                    <a
                      href={landing?.api_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="tradex-min-w-[88px] tradex-min-h-[80px] tradex-bg-background-primary tradex-rounded-lg tradex-border tradex-border-background-card tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-3 tradex-transition-all tradex-duration-[260ms] tradex-ease-[cubic-bezier(0.42,0,0.58,1)] tradex-delay-[0s] hover:tradex-shadow-[2px_2px_50px_0px_#0000000F]">
                        <span className=" tradex-block tradex-max-h-[30px]">
                          <svg
                            width="31"
                            height="30"
                            viewBox="0 0 31 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className=" tradex-fill-title"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M20.7212 4.55428C19.3517 4.76179 18.2393 5.43122 17.8546 5.81592L16.3629 7.30774L23.1926 14.1376L24.6845 12.6457C25.0691 12.261 25.7385 11.1486 25.946 9.77911C26.1443 8.47003 25.9083 7.03983 24.6845 5.81593C23.4605 4.59202 22.0303 4.35594 20.7212 4.55428ZM20.3755 2.27261C22.2395 1.99018 24.4632 2.33108 26.3162 4.18414C28.1693 6.03718 28.5102 8.26081 28.2277 10.1248C27.9545 11.9283 27.0854 13.5084 26.3162 14.2774L24.0085 16.5853C23.5578 17.0359 22.8274 17.0359 22.3768 16.5853L13.9152 8.12364C13.6987 7.90725 13.5771 7.61376 13.5771 7.30774C13.5771 7.00172 13.6987 6.70823 13.9152 6.49184L16.2229 4.18415C16.9919 3.41493 18.572 2.54586 20.3755 2.27261Z"
                              fill="inherit"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M30.1616 0.337952C30.6122 0.788556 30.6122 1.51915 30.1616 1.96975L26.3154 5.81593C25.8648 6.26653 25.1343 6.26673 24.6837 5.81613C24.233 5.36553 24.233 4.63474 24.6837 4.18413L28.5298 0.337952C28.9805 -0.112651 29.7109 -0.112651 30.1616 0.337952Z"
                              fill="inherit"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.80722 13.0771C8.11324 13.0771 8.40673 13.1987 8.62312 13.4152L17.0846 21.8768C17.5353 22.3274 17.5353 23.0578 17.0846 23.5085L14.7771 25.8162C14.0078 26.5854 12.4278 27.4545 10.6243 27.7277C8.7603 28.0102 6.53666 27.6693 4.68361 25.8162M4.68361 25.8162C2.83057 23.9632 2.4897 21.7395 2.77212 19.8755C3.04538 18.072 3.91444 16.4921 4.68358 15.7229L6.99132 13.4152C7.20771 13.1987 7.5012 13.0771 7.80722 13.0771M7.80722 15.8629L6.31544 17.3546C5.93073 17.7393 5.26129 18.8517 5.05378 20.2212C4.85544 21.5303 5.09151 22.9605 6.31541 24.1845C7.53931 25.4083 8.96954 25.6445 10.2786 25.4462C11.6482 25.2386 12.7605 24.5691 13.1452 24.1845L14.6371 22.6926L7.80722 15.8629Z"
                              fill="inherit"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18.6238 17.2611C19.0744 17.7117 19.0744 18.4421 18.6238 18.8928L15.5468 21.9697C15.0962 22.4203 14.3657 22.4203 13.9151 21.9697C13.4645 21.5191 13.4645 20.7886 13.9151 20.338L16.9921 17.2611C17.4427 16.8104 18.1731 16.8104 18.6238 17.2611Z"
                              fill="inherit"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.31535 24.1842C6.76595 24.6348 6.76653 25.3652 6.31593 25.8159L2.46975 29.662C2.01915 30.1127 1.28856 30.1127 0.837952 29.662C0.387349 29.2114 0.387349 28.481 0.837952 28.0303L4.68413 24.1842C5.13474 23.7335 5.86474 23.7335 6.31535 24.1842Z"
                              fill="inherit"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13.239 11.8763C13.6897 12.3269 13.6897 13.0574 13.239 13.508L10.1621 16.585C9.71153 17.0356 8.98094 17.0356 8.53034 16.585C8.07973 16.1344 8.07973 15.4039 8.53034 14.9533L11.6073 11.8763C12.0579 11.4257 12.7884 11.4257 13.239 11.8763Z"
                              fill="inherit"
                            />
                          </svg>
                        </span>
                        <p className=" tradex-text-xs tradex-font-medium !tradex-text-title">
                          {t("API")}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
                <div>
                  <img
                    src={
                      landing?.trade_anywhere_left_img ||
                      "/trade_anywhere_right.png"
                    }
                    alt=""
                  />
                </div>
              </div>
            </div>
          </section>
        )}
    </>
  );
};

export default DistributionSection;
