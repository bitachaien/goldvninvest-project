import { formateData } from "common";
import BackButton from "components/P2P/BackButton";
import StakingHeader from "components/Staking/StakingHeader";
import StakingLayout from "components/Staking/StakingLayout";
import StakingSidebar from "components/Staking/StakingSidebar";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import { STAKING_TERMS_TYPE_STRICT } from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { TotalInvestmentBonus } from "service/staking";
import {
  GetOfferlistDetailsAction,
  InvesmentSubmitAction,
} from "state/actions/staking";

const LockedStaking = () => {
  const [loading, setLoading] = useState(false);
  const [offerList, setofferList] = useState([]);
  const [totalBonus, setTotalBonus] = useState(null);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [isChecked, setisChecked] = useState(false);
  const [amount, setAmount] = useState(0);
  const [autoRenew, setAutoRenew] = useState(1);
  const [details, setDetails] = useState<any>();
  const router = useRouter();
  const { uid, coin } = router.query;
  const handleCheckboxChange = (event: any) => {
    setisChecked(event.target.checked);
  };
  const [selectedDayUid, setSelectedDayUid] = useState(uid);
  const { t } = useTranslation("common");

  const handleAutoRenewChange = (event: any) => {
    if (event.target.checked) {
      setAutoRenew(2);
    } else {
      setAutoRenew(1);
    }
  };
  useEffect(() => {
    uid && GetOfferlistDetailsAction(uid, setDetails, setLoading, setofferList);
    setSelectedDayUid(uid);
  }, [uid]);
  const getBonus = async () => {
    const response = await TotalInvestmentBonus(uid, amount);
    if (response.success) {
      setTotalBonus(response?.data?.total_bonus);
    }
  };
  useEffect(() => {
    if (!amount || amount < 0) {
      return;
    }

    getBonus();
  }, [amount, uid]);
  return (
    <>
      <StakingLayout>
        <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
          <StakingSidebar />
          <div className="lg:tradex-col-span-2 tradex-space-y-6">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                  {t("Staking")}
                </h2>
              </div>
              <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                <div className="tradex-border tradex-border-background-primary tradex-rounded-lg tradex-p-4">
                  <div>
                    <div className="tableImg d-flex align-items-center">
                      <img src={details?.coin_icon} alt="" />
                      <h5>{details?.coin_type}</h5>
                    </div>

                    <div className=" tradex-mt-3">
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p>{t("Type")}</p>
                        <h6 className=" !tradex-text-primary">
                          {details?.terms_type === STAKING_TERMS_TYPE_STRICT
                            ? t("Locked")
                            : t("Flexible")}
                        </h6>
                      </div>
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p>{t("Duration")}</p>

                        <div className="tradex-max-w-[200px] tradex-flex tradex-items-center tradex-overflow-x-auto tradex-gap-4 tradex-text-sm !tradex-text-title tradex-font-bold">
                          {offerList?.map((offer: any, index: any) => (
                            <div
                              className={
                                selectedDayUid === offer?.uid
                                  ? " tradex-cursor-pointer tradex-text-primary "
                                  : "tradex-cursor-pointer tradex-text-title"
                              }
                              key={index}
                              onClick={() => {
                                router.push(
                                  `/staking/locked-staking/${coin}/${offer?.uid}`
                                );
                              }}
                            >
                              {offer?.period} {t("Days")}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p className=" !tradex-text-sm !tradex-text-body">
                          {t("Stake Date")}
                        </p>
                        <h6 className=" !tradex-text-sm !tradex-text-body">
                          {formateData(details?.stake_date)}
                        </h6>
                      </div>
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p className=" !tradex-text-sm !tradex-text-body">
                          {t("Value Date")}
                        </p>
                        <h6 className=" !tradex-text-sm !tradex-text-body">
                          {formateData(details?.value_date)}
                        </h6>
                      </div>
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p className=" !tradex-text-sm !tradex-text-body">
                          {t("Interest Period")}
                        </p>
                        <h6 className=" !tradex-text-sm !tradex-text-body">
                          {details?.interest_period} {t("Days")}
                        </h6>
                      </div>
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p className=" !tradex-text-sm !tradex-text-body">
                          {t("Interest End Date")}
                        </p>
                        <h6 className=" !tradex-text-sm !tradex-text-body">
                          {details?.interest_end_date}
                        </h6>
                      </div>
                      {details?.terms_type !== STAKING_TERMS_TYPE_STRICT && (
                        <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                          <p className=" !tradex-text-sm !tradex-text-body">
                            {t("Minimum Maturity Period")}
                          </p>
                          <h6 className=" !tradex-text-sm !tradex-text-body">
                            {details?.minimum_maturity_period} {t("Day")}
                          </h6>
                        </div>
                      )}
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p className=" !tradex-text-sm !tradex-text-body">
                          {t("Minimum Amount")}
                        </p>
                        <h6 className=" !tradex-text-sm !tradex-text-body">
                          {details?.minimum_investment}
                        </h6>
                      </div>
                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2 tradex-border-b tradex-border-background-primary">
                        <p className=" !tradex-text-sm !tradex-text-body">
                          {t("Maximum Amount")}
                        </p>
                        <h6 className=" !tradex-text-sm !tradex-text-body">
                          {!parseFloat(details?.total_investment_amount)
                            ? parseFloat(details?.maximum_investment) - 0
                            : parseFloat(details?.maximum_investment) -
                              parseFloat(details?.total_investment_amount)}
                        </h6>
                      </div>

                      <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-py-2">
                        <p className=" !tradex-text-sm !tradex-text-body">
                          {t("Estimated Interest")}
                        </p>
                        <h6 className=" !tradex-text-sm !tradex-text-body">
                          {totalBonus}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tradex-border tradex-border-background-primary tradex-rounded-lg tradex-p-4">
                  <form>
                    <div>
                      <label>{t("Lock Amount")}</label>
                      <div className="P2psearchBox position-relative">
                        <input
                          type="number"
                          placeholder=""
                          defaultValue={amount}
                          onChange={(e: any) => {
                            setAmount(e.target.value);
                          }}
                        />
                        {/* <p className="limitBalance my-2">
                        Available Amount 500000.3215
                      </p> */}
                        <button>
                          <span className="ml-3 text-muted">
                            {details?.coin_type}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="">
                      <div className="pt-5">
                        <h5 className="mb-4">{t("Terms and Conditions")}</h5>
                        {parseFloat(details?.user_minimum_holding_amount) >
                          0 && (
                          <div className="">
                            <b>
                              - {t("You must have atlest")}{" "}
                              {parseFloat(details?.user_minimum_holding_amount)}{" "}
                              {details?.coin_type} {t("in your account")}
                            </b>
                          </div>
                        )}
                        {parseFloat(details?.registration_before) > 0 && (
                          <div className="">
                            <b>
                              - {t("You must have registered before")}{" "}
                              {parseFloat(details?.registration_before)}{" "}
                              {t("days")}
                            </b>
                          </div>
                        )}
                        {parseFloat(details?.phone_verification) > 0 && (
                          <div className="">
                            <b>- {t("You must have verified phone number")} </b>
                          </div>
                        )}
                        {parseFloat(details?.kyc_verification) > 0 && (
                          <div className="">
                            <b>
                              -{" "}
                              {t(
                                "You must have completed your KYC Verification"
                              )}
                            </b>
                          </div>
                        )}

                        <div
                          dangerouslySetInnerHTML={{
                            // __html: clean(details.description),
                            __html: details?.terms_condition,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="form-group mt-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeCheck"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="agreeCheck"
                        >
                          {t("I agree to the terms and conditions")}
                        </label>
                      </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-center">
                      <button
                        className="primary-btn-outline w-100 "
                        type="button"
                        disabled={isChecked ? false : true}
                        onClick={() => {
                          InvesmentSubmitAction(
                            uid,
                            autoRenew,
                            amount,
                            setbuttonLoading,
                            router
                          );
                        }}
                      >
                        {buttonLoading ? "Please wait" : "Confirm"}
                      </button>
                    </div>
                  </form>
                </div>
                <div className=" md:tradex-col-span-2 tradex-border tradex-border-background-primary tradex-rounded-lg tradex-p-4 tradex-space-y-4">
                  <div className=" tradex-pb-3 tradex-border-b tradex-border-background-primary">
                    <h4 className=" tradex-text-base tradex-leading-6 tradex-font-semibold !tradex-text-title">
                      {t("Enable Auto Staking")}
                    </h4>

                    <label className="tradex-inline-flex tradex-items-center tradex-cursor-pointer">
                      <input
                        className="tradex-sr-only tradex-peer"
                        type="checkbox"
                        checked={autoRenew === 1 ? false : true}
                        name="auto_renew_status"
                        onChange={handleAutoRenewChange}
                      />
                      <div className="tradex-relative tradex-w-11 tradex-h-6 tradex-bg-primary/30 peer-checked:after:tradex-translate-x-full   tradex-rounded-full tradex-peer tradex-peer-checked:tradex-after:translate-x-full  after:tradex-content-[''] after:tradex-absolute after:tradex-top-[2px] after:tradex-start-[2px] after:tradex-bg-primary after:tradex-rounded-full after:tradex-h-5 after:tradex-w-5 after:tradex-transition-all  peer-checked:tradex-bg-primary/30"></div>
                    </label>
                    <p className=" tradex-text-sm tradex-leading-[22px] tradex-text-body">
                      {t(
                        "Auto Staking is a feature that lets you earn staking rewards automatically without any manual effort."
                      )}
                    </p>
                  </div>
                  <div className=" tradex-flex tradex-justify-between tradex-items-center">
                    <h4 className="tradex-text-base tradex-leading-6 tradex-font-semibold !tradex-text-title">
                      {t("Est. APR")}
                    </h4>
                    <p className="tradex-text-base tradex-leading-6 tradex-font-semibold !tradex-text-green-600">
                      {details?.offer_percentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StakingLayout>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/staking");

  return {
    props: {},
  };
};
export default LockedStaking;
