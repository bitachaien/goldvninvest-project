import Footer from "components/common/footer";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { TradeSteps } from "components/P2P/Trade/AddPostStep";
import { SupportChat } from "components/Support/support-chat";
import {
  getP2pOrderDetailsAction,
  paymentP2pOrderAction,
  releaseP2pOrderAction,
  submitTradeFeedback,
} from "state/actions/p2p";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { formateData } from "common";
import useTranslation from "next-translate/useTranslation";
import {
  BUY,
  NEGATIVE,
  POSITIVE,
  SELL,
  TRADE_STATUS_CANCELED,
  TRADE_STATUS_CANCELED_TIME_EXPIRED,
  TRADE_STATUS_ESCROW,
  TRADE_STATUS_PAYMENT_DONE,
  TRADE_STATUS_REFUNDED_BY_ADMIN,
  TRADE_STATUS_RELEASED_BY_ADMIN,
  TRADE_STATUS_TRANSFER_DONE,
} from "helpers/core-constants";
import Timer from "components/P2P/P2pHome/Timer";
import SectionLoading from "components/common/SectionLoading";
import TradeCancel from "components/P2P/P2pHome/TradeCancel";
import TradeDispute from "components/P2P/P2pHome/TradeDispute";
import { TradeChat } from "components/P2P/Trade/trade-chat";
import { sendMessageTrade } from "service/p2p";
import { useDispatch, useSelector } from "react-redux";
import { setP2pDetailsOrder, setTradeChat } from "state/reducer/user";
import { RootState } from "state/store";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import BackButton from "../../../components/P2P/BackButton";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { toast } from "react-toastify";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { IoArrowBack } from "react-icons/io5";
import TradeReviewForm from "components/P2P/TradeReviewForm";

let socketCall = 0;

const Trading = () => {
  const { t } = useTranslation("common");
  const inputRef = useRef(null);
  const { p2pDetails: details } = useSelector((state: RootState) => state.user);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<any>();
  const [feedbackType, setfeedbackType] = useState<any>(POSITIVE);
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const { uid }: any = router.query;
  const sendMessage = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("order_uid", uid);
    formData.append("message", message);
    file && formData.append("file", file);
    setMessage("");
    setFile(null);
    await sendMessageTrade(formData);
  };
  async function listenMessages() {
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
      `Order-Status-${localStorage.getItem("user_id")}${uid}`
    ).listen(".OrderStatus", (e: any) => {
      dispatch(setP2pDetailsOrder(e.order));
    });
    //@ts-ignore
    window.Echo.channel(
      `New-Message-${localStorage.getItem("user_id")}-${uid}`
    ).listen(".Conversation", (e: any) => {
      dispatch(setTradeChat(e.data));
    });
    // channel: New - Message - { user_id } - { order_uid };
    // event: Conversation;
  }
  useEffect(() => {
    if (socketCall === 0 && uid) {
      listenMessages();
    }
    socketCall = 1;
  }, [socketCall, uid]);
  useEffect(() => {
    uid && getDetails();
  }, [uid]);
  const getDetails = () => {
    getP2pOrderDetailsAction(uid.toString(), setStep, setLoading, dispatch);
  };
  const handleFileChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    if (fileObj.size > 2 * 1024 * 1024) {
      toast.error(t("File size must be less than 2MB"));
      return;
    }
    event;
    setDoc(event.target.files[0]);
  };
  const handleClick = () => {
    // 👇️ open file input box on click of other element
    //@ts-ignore
    inputRef.current.click();
  };
  if (loading) {
    return (
      <div className="container w-100 h-100">
        <SectionLoading />
      </div>
    );
  }
  // if (details === null) {
  //   return (
  //     <div className="container w-100 h-100">
  //       <NoItemFound />
  //     </div>
  //   );
  // }
  return (
    <>
      <div className=" tradex-relative">
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6 tradex-pt-[50px]">
              <div className=" lg:tradex-col-span-3">
                <P2PSidebar />
              </div>
              <div className="lg:tradex-col-span-9">
                <div className=" tradex-w-full tradex-space-y-6">
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-6">
                    <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                      {details?.user_type === BUY && (
                        <h3 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                          {"Buy"} {details?.order?.coin_type} from{" "}
                          {details?.user_seller?.nickname}
                        </h3>
                      )}

                      {details?.user_type === SELL && (
                        <h3 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                          {"Sell"} {details?.order?.coin_type} to{" "}
                          {details?.user_buyer?.nickname}
                        </h3>
                      )}
                      <div
                        onClick={() => {
                          router.back();
                        }}
                        className=" tradex-flex tradex-gap-3 tradex-items-center tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body tradex-cursor-pointer"
                      >
                        <IoArrowBack />
                        {t("Back")}
                      </div>
                    </div>
                    <div className=" tradex-grid lg:tradex-grid-cols-2 tradex-gap-4">
                      <div className="tradex-h-fit tradex-grid sm:tradex-grid-cols-2 tradex-gap-4">
                        <div className="sm:tradex-col-span-2 tradex-grid sm:tradex-grid-cols-2 tradex-gap-4 tradex-pb-4 tradex-border-b tradex-border-background-primary">
                          <div className="tradex-space-y-2">
                            <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                              {t("Order number")}
                            </p>

                            <div className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                              {details?.order?.order_id}
                            </div>
                          </div>
                          <div className="tradex-space-y-2">
                            <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                              {t("Time Created")}
                            </p>

                            <div className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                              {formateData(details?.order?.created_at)}
                            </div>
                          </div>
                        </div>
                        {details?.order?.payment_sleep && (
                          <div className=" sm:tradex-col-span-2 tradex-flex tradex-justify-between tradex-items-center tradex-gap-6">
                            <span className=" tradex-text-xl tradex-leading-6 tradex-font-bold tradex-text-title">
                              {t("Deposit Proof")}:
                            </span>
                            <a
                              href={details?.order?.payment_sleep}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" tradex-text-base tradex-leading-[22px] tradex-font-semibold tradex-min-h-11 tradex-min-w-[120px] tradex-rounded tradex-bg-primary !tradex-text-white tradex-flex tradex-justify-center tradex-items-center"
                            >
                              {t("View")}
                            </a>
                          </div>
                        )}

                        {/* order.status */}
                        {details?.order < 4 && (
                          <TradeSteps step={step} order={details?.order} />
                        )}
                        <div className=" sm:tradex-col-span-2 tradex-px-3 tradex-py-4 tradex-border tradex-border-background-primary tradex-rounded tradex-space-y-4">
                          <h4 className="tradex-text-xl tradex-leading-6 tradex-font-semibold !tradex-text-title">
                            {t("Confirm order info")}{" "}
                          </h4>
                          <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-4">
                            <div className="tradex-space-y-2">
                              <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                {t("Amount")}
                              </p>
                              <div className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                {" "}
                                {parseFloat(details?.order?.amount).toFixed(
                                  8
                                )}{" "}
                                {details?.order?.coin_type}
                              </div>
                            </div>
                            <div className="tradex-space-y-2">
                              <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                {t("Price")}
                              </p>
                              <div className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                {" "}
                                {parseFloat(details?.order?.price).toFixed(
                                  8
                                )}{" "}
                                {details?.order?.currency}
                              </div>
                            </div>
                          </div>
                        </div>
                        {parseInt(details?.order?.is_reported) !== 0 && (
                          <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                            <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                              {t("Seller created dispute against order")}
                            </h4>
                          </div>
                        )}
                        {parseInt(details?.order?.status) ===
                          TRADE_STATUS_CANCELED && (
                          <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                            <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                              {t("Trade canceled")}
                            </h4>
                          </div>
                        )}
                        {parseInt(details?.order?.status) ===
                          TRADE_STATUS_CANCELED_TIME_EXPIRED &&
                          parseInt(details?.order?.is_reported) === 0 && (
                            <div className=" sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                              <h4 className=" !tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                                {t("Trade time expired")}
                              </h4>
                            </div>
                          )}
                        {parseInt(details?.order?.status) ===
                          TRADE_STATUS_REFUNDED_BY_ADMIN &&
                          parseInt(details?.order?.is_reported) === 0 && (
                            <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                              <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                                {t("Trade payment hasbeen refunded by admin")}
                              </h4>
                            </div>
                          )}
                        {parseInt(details?.order?.status) ===
                          TRADE_STATUS_RELEASED_BY_ADMIN &&
                          parseInt(details?.order?.is_reported) === 0 && (
                            <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                              <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                                {t("Trade hasbeen released by admin")}
                              </h4>
                            </div>
                          )}
                        {parseInt(details?.order?.is_reported) === 0 && (
                          <>
                            {details?.order?.status === TRADE_STATUS_ESCROW && (
                              <>
                                {details.user_type === BUY && (
                                  <>
                                    <div className=" sm:tradex-col-span-2">
                                      {details?.due_minute && (
                                        <Timer
                                          // endTime={details?.order?.payment_expired_time}
                                          // current_time={details?.current_time}
                                          getDetails={getDetails}
                                          seconds={details?.due_minute}
                                        />
                                      )}
                                    </div>
                                    <div className="sm:tradex-col-span-2 tradex-px-3 tradex-py-4 tradex-border tradex-border-background-primary tradex-rounded tradex-space-y-4">
                                      <div className="tradex-input-label !tradex-text-primary !tradex-text-sm !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                        {t(
                                          `Transfer the fund to the seller account provided below`
                                        )}
                                      </div>
                                      <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-4">
                                        {details?.payment_methods?.username && (
                                          <div className="tradex-space-y-2">
                                            <span className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                              {t("Account Name")}
                                            </span>
                                            <span className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                              {
                                                details?.payment_methods
                                                  ?.username
                                              }
                                            </span>
                                          </div>
                                        )}
                                        {details?.payment_methods
                                          ?.admin_pamynt_method?.name && (
                                          <div className="tradex-space-y-2">
                                            <span className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                              {t("Payment Method Name")}
                                            </span>
                                            <span className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                              {
                                                details?.payment_methods
                                                  ?.admin_pamynt_method?.name
                                              }
                                            </span>
                                          </div>
                                        )}
                                        {details?.payment_methods
                                          ?.bank_name && (
                                          <div className="tradex-space-y-2">
                                            <span className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                              {t("Bank Name")}
                                            </span>
                                            <span className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                              {
                                                details?.payment_methods
                                                  ?.bank_name
                                              }
                                            </span>
                                          </div>
                                        )}
                                        {details?.payment_methods
                                          ?.bank_account_number && (
                                          <div className="tradex-space-y-2">
                                            <span className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                              {t("Bank Account Number")}
                                            </span>
                                            <span className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                              {
                                                details?.payment_methods
                                                  ?.bank_account_number
                                              }
                                            </span>
                                          </div>
                                        )}
                                        {details?.payment_methods
                                          ?.card_number && (
                                          <div className="tradex-space-y-2">
                                            <span className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                              {t("Card Number")}
                                            </span>
                                            <span className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                              {
                                                details?.payment_methods
                                                  ?.card_number
                                              }
                                            </span>
                                          </div>
                                        )}
                                        {details?.payment_methods
                                          ?.mobile_account_number && (
                                          <div className="tradex-space-y-2">
                                            <span className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                              {t("Mobile Number")}
                                            </span>
                                            <span className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                              {
                                                details?.payment_methods
                                                  ?.mobile_account_number
                                              }
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="tradex-space-y-2">
                                        <div className="">
                                          <span className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
                                            {t("Select document")}
                                          </span>
                                        </div>
                                        <div className="tradex-flex tradex-items-center tradex-justify-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-16 !tradex-border !tradex-border-background-primary tradex-rounded-md">
                                          {/* @ts-ignore */}
                                          <label
                                            htmlFor="upload-photo"
                                            onClick={handleClick}
                                            className=" !tradex-mb-0"
                                          >
                                            {/* @ts-ignore */}
                                            {doc ? doc.name : t("Browse")}
                                          </label>
                                          <input
                                            ref={inputRef}
                                            type="file"
                                            onChange={handleFileChange}
                                            className="d-none"
                                          />
                                        </div>
                                      </div>
                                      <div className=" tradex-flex tradex-flex-col sm:tradex-flex-row tradex-items-center tradex-gap-6">
                                        <button
                                          className="tradex-w-full tradex-px-3 tradex-text-nowrap tradex-text-base tradex-font-semibold tradex-min-h-12 tradex-flex tradex-items-center tradex-justify-center tradex-bg-primary !tradex-text-white tradex-rounded"
                                          disabled={!doc}
                                          onClick={() => {
                                            paymentP2pOrderAction(
                                              details?.order?.uid,
                                              doc,
                                              setStep
                                            );
                                          }}
                                        >
                                          {t("Pay and notify seller")}
                                        </button>
                                        <a
                                          data-toggle="modal"
                                          data-target="#exampleModal"
                                          onClick={() => {}}
                                          className="tradex-w-full"
                                        >
                                          <button className="tradex-w-full tradex-px-3 tradex-text-base tradex-font-semibold tradex-min-h-12 tradex-flex tradex-items-center tradex-justify-center tradex-border tradex-border-primary !tradex-text-primary tradex-rounded">
                                            {t("Cancel")}
                                          </button>
                                        </a>
                                      </div>
                                      <TradeCancel uid={uid} />
                                    </div>
                                  </>
                                )}
                                {details.user_type === SELL && (
                                  <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                                    <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                                      {t("Waiting for payment")}
                                    </h4>
                                  </div>
                                )}
                              </>
                            )}
                            {details?.order?.status ===
                              TRADE_STATUS_PAYMENT_DONE && (
                              <>
                                {details.user_type === BUY && (
                                  <>
                                    <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                                      <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                                        {t("Waiting for releasing order")}
                                      </h4>
                                    </div>
                                    {parseInt(details?.order?.is_reported) ===
                                      0 && (
                                      <a
                                        data-toggle="modal"
                                        data-target="#exampleModal1"
                                        onClick={() => {}}
                                        className=" sm:tradex-col-span-2"
                                      >
                                        <button
                                          disabled={
                                            parseInt(
                                              details?.order?.is_queue
                                            ) === 1
                                          }
                                          className=" tradex-w-full tradex-text-base tradex-font-semibold tradex-min-h-12 tradex-flex tradex-items-center tradex-justify-center tradex-bg-primary !tradex-text-white tradex-rounded"
                                          onClick={() => {}}
                                        >
                                          {t("Dispute")}
                                        </button>
                                      </a>
                                    )}
                                    <TradeDispute uid={uid} />
                                  </>
                                )}
                                {details.user_type === SELL && (
                                  <div className="sm:tradex-col-span-2 tradex-flex tradex-flex-col sm:tradex-flex-row tradex-items-center tradex-gap-4">
                                    <button
                                      className="tradex-w-full tradex-px-3 tradex-text-base tradex-font-semibold tradex-min-h-12 tradex-flex tradex-items-center tradex-justify-center tradex-bg-primary !tradex-text-white tradex-rounded"
                                      // disabled={parseInt(details?.order?.is_queue) === 1}
                                      onClick={() => {
                                        releaseP2pOrderAction(uid, dispatch);
                                      }}
                                    >
                                      {t("Release")}
                                    </button>
                                    {parseInt(details?.order?.is_reported) ===
                                      0 && (
                                      <a
                                        data-toggle="modal"
                                        data-target="#exampleModal1"
                                        onClick={() => {}}
                                        className="tradex-w-full"
                                      >
                                        <button
                                          // disabled={
                                          //   parseInt(details?.order?.is_queue) === 1
                                          // }
                                          className="tradex-w-full tradex-px-3 tradex-text-base tradex-font-semibold tradex-min-h-12 tradex-flex tradex-items-center tradex-justify-center tradex-border tradex-border-primary !tradex-text-primary tradex-rounded"
                                          onClick={() => {}}
                                        >
                                          {t("Dispute")}
                                        </button>
                                      </a>
                                    )}

                                    <TradeDispute uid={uid} />
                                  </div>
                                )}
                              </>
                            )}
                            {details?.order?.status ===
                              TRADE_STATUS_TRANSFER_DONE && (
                              <>
                                {details.user_type === BUY && (
                                  <>
                                    <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                                      <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                                        {t("Trade completed")}
                                      </h4>
                                    </div>

                                    {details?.order?.seller_feedback && (
                                      <div className="sm:tradex-col-span-2 tradex-flex tradex-gap-1 tradex-text-sm tradex-leading-4 tradex-text-body">
                                        <p className=" tradex-font-bold">
                                          {t("Seller Feedback:")}
                                        </p>
                                        <p>{details?.order?.seller_feedback}</p>
                                      </div>
                                    )}
                                    {details?.order?.buyer_feedback ===
                                      null && (
                                      <>
                                        <TradeReviewForm
                                          setFeedback={setFeedback}
                                          feedback={feedback}
                                          feedbackType={feedbackType}
                                          setfeedbackType={setfeedbackType}
                                          submitHandler={() => {
                                            submitTradeFeedback(
                                              details?.order?.uid,
                                              feedbackType,
                                              feedback
                                            );
                                          }}
                                          headingText={
                                            "Submit review about seller"
                                          }
                                        />
                                      </>
                                    )}
                                  </>
                                )}
                                {details.user_type === SELL && (
                                  <>
                                    <div className="sm:tradex-col-span-2 tradex-p-5 tradex-border tradex-border-background-primary tradex-rounded tradex-min-h-[87px] tradex-flex tradex-justify-center tradex-items-center">
                                      <h4 className="!tradex-text-sm tradex-leading-4 !tradex-font-medium !tradex-text-body">
                                        {t("Trade completed")}
                                      </h4>
                                    </div>

                                    {details?.order?.buyer_feedback && (
                                      <div className="sm:tradex-col-span-2 tradex-flex tradex-gap-1 tradex-text-sm tradex-leading-4 tradex-text-body">
                                        <p className=" tradex-font-bold">
                                          {t("Buyer Feedback:")}
                                        </p>
                                        <p>{details?.order?.buyer_feedback}</p>
                                      </div>
                                    )}
                                    {details?.order?.seller_feedback ===
                                      null && (
                                      <TradeReviewForm
                                        setFeedback={setFeedback}
                                        feedback={feedback}
                                        feedbackType={feedbackType}
                                        setfeedbackType={setfeedbackType}
                                        submitHandler={() => {
                                          submitTradeFeedback(
                                            details?.order?.uid,
                                            feedbackType,
                                            feedback
                                          );
                                        }}
                                        headingText={
                                          "Submit review about buyer"
                                        }
                                      />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <div>
                        <TradeChat
                          col="col-lg-12"
                          details={details}
                          sendMessage={sendMessage}
                          setMessage={setMessage}
                          setFile={setFile}
                          message={message}
                        />
                      </div>
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
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");
  return {
    props: {},
  };
};
export default Trading;
