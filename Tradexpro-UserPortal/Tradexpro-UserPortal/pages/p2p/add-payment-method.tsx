import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { CUstomSelect } from "components/common/CUstomSelect";
import Footer from "components/common/footer";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import {
  PAYMENT_METHOD_BANK,
  PAYMENT_METHOD_CARD,
  PAYMENT_METHOD_CARD_TYPE_CREDIT,
  PAYMENT_METHOD_CARD_TYPE_DEBIT,
  PAYMENT_METHOD_MOBILE,
} from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { useCreatePaymentMethods } from "state/actions/p2p";

const AddPaymentMethod = () => {
  const {
    paymentMethods,
    setPaymentMethods,
    handleSelectedMethod,
    selectedMethods,
    setSelectedMethods,
    setSubmitData,
    SubmitData,
    handleCardSelectedMethod,
    submitData,
    uid,
    editData,
  } = useCreatePaymentMethods();
  const { t } = useTranslation("common");
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <P2PSidebar />
              <div className=" lg:tradex-col-span-2 tradex-space-y-8 tradex-h-full">
                <div className="tradex-h-full tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                      {uid ? t("Edit payment method") : t("Add payment method")}
                    </h2>
                    <Link href={`/p2p/p2p-profile`}>
                      <div className=" tradex-flex tradex-gap-3 tradex-items-center tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body tradex-cursor-pointer">
                        <IoArrowBack />
                        {t("Back")}
                      </div>
                    </Link>
                  </div>
                  <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-4">
                    {!uid && (
                      <div className="tradex-space-y-2">
                        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                          {t("Select payment method")}
                        </label>
                        <CUstomSelect
                          options={paymentMethods}
                          isSearchable={true}
                          handleFunction={handleSelectedMethod}
                          defaultValue={selectedMethods}
                        />
                      </div>
                    )}
                    <div className="tradex-space-y-2">
                      <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                        {t("Account name")}
                      </label>

                      <input
                        type="text"
                        value={SubmitData.username}
                        onChange={(e) => {
                          setSubmitData({
                            ...SubmitData,
                            username: e.target.value,
                          });
                        }}
                        placeholder={t("Enter your account name")}
                        className="tradex-block tradex-w-full !tradex-bg-transparent tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
                      />
                    </div>

                    {selectedMethods?.payment_type === PAYMENT_METHOD_BANK && (
                      <>
                        <div className="tradex-space-y-2">
                          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                            {t("Bank Name")}
                          </label>

                          <input
                            type="text"
                            placeholder={t("Enter the name of your bank")}
                            value={SubmitData.bank_name}
                            onChange={(e) => {
                              setSubmitData({
                                ...SubmitData,
                                bank_name: e.target.value,
                              });
                            }}
                            className="tradex-block !tradex-bg-transparent tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
                          />
                        </div>
                        <div className="tradex-space-y-2">
                          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                            {t("Bank Account number")}
                          </label>

                          <input
                            type="text"
                            placeholder={t("Enter bank account number")}
                            value={SubmitData.bank_account_number}
                            onChange={(e) => {
                              setSubmitData({
                                ...SubmitData,
                                bank_account_number: e.target.value,
                              });
                            }}
                            className="tradex-block !tradex-bg-transparent tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
                          />
                        </div>
                        <div className="tradex-space-y-2">
                          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                            {t("Account opening branch")}
                          </label>
                          <input
                            type="text"
                            placeholder={t("Enter bank opening branch name")}
                            value={SubmitData.account_opening_branch}
                            onChange={(e) => {
                              setSubmitData({
                                ...SubmitData,
                                account_opening_branch: e.target.value,
                              });
                            }}
                            className="tradex-block !tradex-bg-transparent tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
                          />
                        </div>
                        <div className="tradex-space-y-2">
                          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                            {t("Transaction Referance")}
                          </label>

                          <input
                            type="text"
                            placeholder={t("Enter transaction referance")}
                            value={SubmitData.transaction_reference}
                            onChange={(e) => {
                              setSubmitData({
                                ...SubmitData,
                                transaction_reference: e.target.value,
                              });
                            }}
                            className="tradex-block !tradex-bg-transparent tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
                          />
                        </div>
                      </>
                    )}
                    {selectedMethods?.payment_type === PAYMENT_METHOD_CARD && (
                      <>
                        <div className="tradex-space-y-2">
                          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                            {t("Card number")}
                          </label>
                          <input
                            type="text"
                            placeholder={t("Enter Card Number")}
                            value={SubmitData.card_number}
                            onChange={(e) => {
                              setSubmitData({
                                ...SubmitData,
                                card_number: e.target.value,
                              });
                            }}
                            className="tradex-block !tradex-bg-transparent tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
                          />
                        </div>
                        <div className="tradex-space-y-2">
                          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                            {t("Card Type")}
                          </label>
                          <CUstomSelect
                            options={[
                              {
                                value: PAYMENT_METHOD_CARD_TYPE_DEBIT,
                                label: "Debit card",
                              },
                              {
                                value: PAYMENT_METHOD_CARD_TYPE_CREDIT,
                                label: "Credit card",
                              },
                            ]}
                            isSearchable={true}
                            handleFunction={handleCardSelectedMethod}
                            defaultValue={
                              uid
                                ? {
                                    value: SubmitData.card_type,
                                    label:
                                      parseInt(SubmitData.card_type) ===
                                      PAYMENT_METHOD_CARD_TYPE_DEBIT
                                        ? "Debit card"
                                        : "Credit card",
                                  }
                                : null
                            }
                          />
                        </div>
                      </>
                    )}
                    {selectedMethods?.payment_type ===
                      PAYMENT_METHOD_MOBILE && (
                      <>
                        <div className="tradex-space-y-2">
                          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                            {t("Mobile number")}
                          </label>

                          <input
                            type="text"
                            placeholder={t("Enter Mobile Number")}
                            value={SubmitData.mobile_account_number}
                            onChange={(e) => {
                              setSubmitData({
                                ...SubmitData,
                                mobile_account_number: e.target.value,
                              });
                            }}
                            className="tradex-block !tradex-bg-transparent tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <button
                      className=" tradex-min-h-[48px] tradex-w-full tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-bg-primary tradex-text-white tradex-text-base tradex-leading-6 tradex-font-bold"
                      onClick={uid ? editData : submitData}
                    >
                      {t("Confirm")}
                    </button>
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};
export default AddPaymentMethod;
