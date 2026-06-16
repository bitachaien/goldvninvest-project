import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { copyTextById, formateZert } from "common";
import { GetWalletAddressAction } from "state/actions/wallet";
import Qr from "components/common/qr";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import QRCode from "react-qr-code";

export const DipositComponent = ({
  responseData,
  router,
  setDependecy,
  fullPage,
}: any) => {
  const { t } = useTranslation("common");
  const [selectedNetwork, setSelectedNetwork] = useState(
    responseData?.data && responseData?.data[0]
  );
  const [initialHit, setInitialHit] = useState(false);
  const selectAddressCopy: any = React.useRef(null);
  useEffect(() => {
    if (responseData?.data && responseData?.data[0] && initialHit === false) {
      setSelectedNetwork(responseData?.data[0]);
      setInitialHit(true);
    }
  }, [responseData?.data[0]]);
  const checkNetworkFunc = (networkId: any) => {
    if (networkId == 4) {
      return `(ERC20 Token)`;
    }
    if (networkId == 5) {
      return `(BEP20 Token)`;
    }
    if (networkId == 6) {
      return `(TRC20 Token)`;
    }
    return "";
  };

  return (
    <>
      <div className="tradex-space-y-6">
        <div className=" tradex-space-y-2">
          <p className=" tradex-input-label tradex-mb-0">
            {t("Total Balance")}
          </p>
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <div className=" tradex-flex tradex-gap-2 tradex-items-center">
              <img
                className=" tradex-max-w-[25px] tradex-max-h-[25px] tradex-object-cover tradex-object-center"
                src={responseData?.deposit?.coin_icon || "/bitcoin.png"}
                alt="coin"
                width="25px"
                height="25px"
              />
              <p className=" tradex-text-sm tradex-text-body">
                {responseData?.deposit?.coin_type}
              </p>
            </div>

            <p className="tradex-text-sm tradex-text-body">
              {responseData?.deposit?.balance
                ? parseFloat(responseData?.deposit?.balance).toFixed(10) +
                  " " +
                  responseData?.deposit?.coin_type
                : "Loading.."}
            </p>
          </div>
        </div>

        {responseData?.memo && (
          <div className=" tradex-space-y-2">
            <p className="tradex-input-label tradex-mb-0">{t("Memo")}</p>
            <div className="tradex-input-field">
              <p className="tradex-text-sm tradex-text-body tradex-overflow-hidden tradex-text-ellipsis">
                {responseData?.memo}
              </p>
            </div>
          </div>
        )}

        {responseData?.wallet.coin_type == "USDT" &&
          parseInt(responseData?.wallet.network) === 1 && (
            <div className="tradex-space-y-2">
              <p className="tradex-input-label tradex-mb-0">
                {t("Select Network")}
              </p>

              <select
                name="currency"
                className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
                onChange={(e) => {
                  const findObje = responseData?.data?.find(
                    (x: any) => x.id === parseInt(e.target.value)
                  );
                  setDependecy(Math.random() * 100);
                  setSelectedNetwork(findObje);
                }}
              >
                {responseData?.data?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item?.network_name}
                  </option>
                ))}
              </select>
            </div>
          )}

        <div className="tradex-space-y-2">
          <p className="tradex-input-label tradex-mb-0">
            {t("Deposit Address")}
          </p>
          {(responseData?.deposit?.coin_type ||
            responseData?.deposit?.network) && (
            <p className="tradex-input-field !tradex-h-auto tradex-py-[14px] !tradex-text-sm">
              {t(
                `Only send ${
                  responseData?.deposit?.coin_type ?? ""
                } ${checkNetworkFunc(
                  responseData?.deposit?.network
                )} to this address. Sending any others asset to this adress may result in the loss of your deposit!`
              )}
            </p>
          )}
        </div>

        <div className="tradex-space-y-4">
          <div className=" tradex-flex tradex-justify-center tradex-items-center tradex-flex-col tradex-space-y-4">
            {responseData?.address && (
              <div className="qr-background">
                <QRCode
                  className="qrCodeBg rounded"
                  value={responseData?.address}
                  size={150}
                />
              </div>
            )}
            {selectedNetwork?.address &&
              responseData?.wallet.coin_type === "USDT" && (
                <div className="qr-background">
                  <QRCode
                    className="qrCodeBg rounded"
                    value={selectedNetwork?.address}
                    size={150}
                  />
                </div>
              )}

            {selectedNetwork?.address ? (
              <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
                <input
                  onClick={() => {
                    copyTextById(
                      responseData?.wallet.coin_type == "USDT"
                        ? selectedNetwork?.address
                        : responseData?.address
                    );
                    selectAddressCopy?.current.select();
                  }}
                  className=" !tradex-border-none tradex-bg-transparent tradex-text-sm tradex-w-full"
                  ref={selectAddressCopy}
                  type="text"
                  value={
                    responseData?.wallet.coin_type == "USDT"
                      ? selectedNetwork?.address
                      : responseData?.address
                  }
                />

                <span
                  className="tradex-inline-block tradex-min-w-[20px]"
                  onClick={() => {
                    copyTextById(
                      responseData?.wallet.coin_type == "USDT"
                        ? selectedNetwork?.address
                        : responseData?.address
                    );
                    selectAddressCopy?.current?.select();
                  }}
                >
                  <i className="fa fa-clone"></i>
                </span>
              </div>
            ) : responseData?.address ? (
              <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
                <input
                  className=" !tradex-border-none tradex-bg-transparent tradex-text-sm tradex-w-full"
                  onClick={() => {
                    copyTextById(
                      responseData?.wallet.coin_type == "USDT"
                        ? selectedNetwork?.address
                        : responseData?.address
                    );
                    selectAddressCopy?.current.select();
                  }}
                  ref={selectAddressCopy}
                  type="text"
                  value={responseData?.address}
                />

                <span
                  className=" tradex-inline-block tradex-min-w-[20px]"
                  onClick={() => {
                    copyTextById(responseData?.address);
                    selectAddressCopy?.current?.select();
                  }}
                >
                  <i className="fa fa-clone"></i>
                </span>
              </div>
            ) : (
              <p
                ref={selectAddressCopy}
                id="url-copy"
                className="tradex-input-field !tradex-text-sm !tradex-items-center tradex-justify-center"
              >
                {t("No address found!")}
              </p>
            )}
          </div>

          {!selectedNetwork?.address &&
            responseData?.wallet.coin_type == "USDT" &&
            parseInt(responseData?.wallet.network) === 1 && (
              <button
                className=" tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                onClick={() => {
                  GetWalletAddressAction(
                    {
                      wallet_id: router.query.coin_id,
                      network_type: selectedNetwork?.network_type ?? "",
                    },
                    setSelectedNetwork,
                    setDependecy
                  );
                }}
              >
                {t("Get address")}
              </button>
            )}
        </div>
        {responseData?.token_address && (
          <div className="accordion" id="accordionExample">
            <div className="">
              <div className="card">
                <div className="card-header" id="headingOne">
                  <h5 className="mb-0 header-align">
                    <button
                      className="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target={`#collapseTokenAddress`}
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      {t("Display Contract Address")}
                    </button>
                    <i className={`fas fa-caret-down mright-5`}></i>
                  </h5>
                </div>

                <div
                  id={`collapseTokenAddress`}
                  className={`collapse`}
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <div className="tradex-input-field">
                    <p className="tradex-text-sm tradex-text-body tradex-overflow-hidden tradex-text-ellipsis">
                      {responseData?.token_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
