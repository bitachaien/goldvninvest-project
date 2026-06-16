import React from "react";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

export const SingleLaunchPool = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <div className="container singleLaunch">
        <div className="singleLaunchPadHero">
          <div className="singleLaunchPadHeroFlex">
            <div className="">
              <Image
                className="singleLaunchPadImg"
                src="/launchpad.png"
                height={150}
                width={205}
                layout="fixed"
                alt="---"
              />
            </div>
            <div className="">
              <div className="singleLaunchPadTitle">
                <h2>{t("STEPN")}</h2>
                <div className="singleLaunchPadStatus">
                  <i className="fa-sharp fa-solid fa-circle-check"></i>
                  <p> {t("FINISHED")}</p>
                </div>
              </div>

              <div className="singleLaunchPadLinkList">
                <p>
                  {t("STEPN - A Move-to-Earn Health and Fitness Application")}
                </p>
                <div className="linkLists">
                  <Link href="/">
                    <div>
                      <i className="fa-sharp fa-solid fa-link"></i>
                      <p>{t("Website")}</p>
                    </div>
                  </Link>

                  <Link href="/">
                    <div>
                      <i className="fa-solid fa-receipt"></i>
                      <p>{t("Whitepaper")}</p>
                    </div>
                  </Link>

                  <Link href="/">
                    <div>
                      <i className="fa-sharp fa-solid fa-lightbulb"></i>
                      <p>{t("GMT Research Report")}</p>
                    </div>
                  </Link>

                  <Link href="/">
                    <div>
                      <i className="fa-sharp fa-solid fa-book"></i>
                      <p>{t("View detailed rules")}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="endtimeSingleLaunch">
            <p>{t("End Time :")}</p>
            <p>{t("2022-03-09")}</p>
          </div>
        </div>

        <div className="singlePoolTabs">
          <ul className="mb-3 nav nav-pills " id="pills-tab" role="tablist">
            <li className="tabs-item">
              <a
                className="active"
                id="pills-home-tab"
                data-toggle="pill"
                href="#pills-home"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                {t("BNB Pool")}
              </a>
            </li>
            <li className="tabs-item">
              <a
                className=""
                id="pills-profile-tab"
                data-toggle="pill"
                href="#pills-profile"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                {t("CAKE Pool")}
              </a>
            </li>
            <li className="tabs-item">
              <a
                className=""
                id="pills-contact-tab"
                data-toggle="pill"
                href="#pills-contact"
                role="tab"
                aria-controls="pills-contact"
                aria-selected="false"
              >
                {t("BUSD Pool")}
              </a>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div className="launchCoinDetails launchPoolTab row mt-5">
                <div className="col-md-3 mb-5">
                  <p>{t("Total BNB Pool Rewards")}</p>
                  <span>{t("2,100,000.0000 GAL")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Staking Token")}</p>
                  <span>{t("BNB")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Farming Period")}</p>
                  <span>{t("30 Days")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Today’s GAL Pool Rewards")}</p>
                  <span>{t("45,652.1700 GAL")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Total BNB Staked")}</p>
                  <span>{t("6,924,524.7741 BNB")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("BNB Annual Percentage Yield")}</p>
                  <span>{t("4.50 %")}</span>
                </div>
              </div>

              <div className="row fundSection">
                <div>
                  <div className="mt-5">
                    <div className="myFundTitle">
                      <Image
                        src="/busd.svg"
                        alt="--"
                        layout="fixed"
                        width={35}
                        height={30}
                      />
                      <h2>{t("My Funds")}</h2>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h6 className="mb-3">{t("BUSD Staked")}</h6>
                    <div className="myFundTitle">
                      <p>---</p>
                      <h2>{t("BUSD")}</h2>
                    </div>
                    <p>
                      {t(
                        "Your staked BUSD has been automatically transferred back to your spot account"
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mt-5">
                    <div className="myFundTitle">
                      <Image
                        src="/gal.svg"
                        alt="--"
                        layout="fixed"
                        width={35}
                        height={30}
                      />
                      <h2>{t("My Rewards")}</h2>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h6 className="mb-3">{t("Total Rewards Received")}</h6>
                    <div className="myFundTitle">
                      <p>---</p>
                      <h2>{t("GAL")}</h2>
                    </div>
                    <p>
                      {t("Your rewards have been sent to your spot account")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div className="launchCoinDetails launchPoolTab row mt-5">
                <div className="col-md-3 mb-5">
                  <p>{t("Total BNB Pool Rewards")}</p>
                  <span>{t("2,100,000.0000 GAL")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Staking Token")}</p>
                  <span>{t("BNB")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Farming Period")}</p>
                  <span>{t("30 Days")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Today’s GAL Pool Rewards")}</p>
                  <span>{t("45,652.1700 GAL")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Total BNB Staked")}</p>
                  <span>{t("6,924,524.7741 BNB")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("BNB Annual Percentage Yield")}</p>
                  <span>{t("4.50 %")}</span>
                </div>
              </div>

              <div className="row fundSection">
                <div>
                  <div className="mt-5">
                    <div className="myFundTitle">
                      <Image
                        src="/cake.svg"
                        alt="--"
                        layout="fixed"
                        width={35}
                        height={30}
                      />
                      <h2>{t("My Funds")}</h2>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h6 className="mb-3">{t("BUSD Staked")}</h6>
                    <div className="myFundTitle">
                      <p>---</p>
                      <h2>{t("BUSD")}</h2>
                    </div>
                    <p>
                      {t(
                        "Your staked BUSD has been automatically transferred back to your spot account"
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mt-5">
                    <div className="myFundTitle">
                      <Image
                        src="/gal.svg"
                        alt="--"
                        layout="fixed"
                        width={35}
                        height={30}
                      />
                      <h2>{t("My Rewards")}</h2>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h6 className="mb-3">{t("Total Rewards Received")}</h6>
                    <div className="myFundTitle">
                      <p>---</p>
                      <h2>{t("GAL")}</h2>
                    </div>
                    <p>
                      {t("Your rewards have been sent to your spot account")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              <div className="launchCoinDetails launchPoolTab row mt-5">
                <div className="col-md-3 mb-5">
                  <p>{t("Total BNB Pool Rewards")}</p>
                  <span>{t("2,100,000.0000 GAL")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Staking Token")}</p>
                  <span>{t("BNB")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Farming Period")}</p>
                  <span>{t("30 Days")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Today’s GAL Pool Rewards")}</p>
                  <span>{t("45,652.1700 GAL")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("Total BNB Staked")}</p>
                  <span>{t("6,924,524.7741 BNB")}</span>
                </div>
                <div className="col-md-3">
                  <p>{t("BNB Annual Percentage Yield")}</p>
                  <span>4.50 %</span>
                </div>
              </div>

              <div className="row fundSection">
                <div>
                  <div className="mt-5">
                    <div className="myFundTitle">
                      <Image
                        src="/busd.svg"
                        alt="--"
                        layout="fixed"
                        width={35}
                        height={30}
                      />
                      <h2>{t("My Funds")}</h2>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h6 className="mb-3">{t("BUSD Staked")}</h6>
                    <div className="myFundTitle">
                      <p>---</p>
                      <h2>{t("BUSD")}</h2>
                    </div>
                    <p>
                      {t(
                        "Your staked BUSD has been automatically transferred back to your spot account"
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mt-5">
                    <div className="myFundTitle">
                      <Image
                        src="/gal.svg"
                        alt="--"
                        layout="fixed"
                        width={35}
                        height={30}
                      />
                      <h2>{t("My Rewards")}</h2>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h6 className="mb-3">{t("Total Rewards Received")}</h6>
                    <div className="myFundTitle">
                      <p>---</p>
                      <h2>{t("GAL")}</h2>
                    </div>
                    <p>
                      {t("Your rewards have been sent to your spot account")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
