import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { copyTextById, formateZert } from "common";
import { GetWalletAddressAction } from "state/actions/wallet";
import Qr from "components/common/qr";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import QRCode from "react-qr-code";
import { GetWalletAddress } from "service/wallet";
import { toast } from "react-toastify";
import DipositQrCode from "./diposit-qr-code";
import DipositAddressCopyField from "./diposit-address-copy-field";
import SectionLoading from "components/common/SectionLoading";

export const DipositComponent = ({
  responseData,
  router,
  setDependecy,
  fullPage,
}: any) => {
  const { t } = useTranslation("common");
  const [selectedNetwork, setSelectedNetwork] = useState(
    responseData?.coin_payment_networks &&
      responseData?.coin_payment_networks[0]
  );

  const [selctedNetworkAddress, setSelctedNetworkAddress] =
    useState<string>("");
  const [initialHit, setInitialHit] = useState(false);

  const [isGettingAddress, setIsGettingAddress] = useState<boolean>(false);
  useEffect(() => {
    if (
      responseData?.coin_payment_networks &&
      responseData?.coin_payment_networks[0] &&
      initialHit === false
    ) {
      setSelectedNetwork(responseData?.coin_payment_networks[0]);
      setInitialHit(true);
    }
  }, [responseData?.coin_payment_networks]);
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

  useEffect(() => {
    if (!selectedNetwork?.network_type) return;
    getNetworkAddress(router.query.coin_type, selectedNetwork?.network_type);
  }, [selectedNetwork?.network_type]);

  const getNetworkAddress = async (coin_type: string, network_type: string) => {
    setSelctedNetworkAddress("");
    let credential = {
      coin_type: coin_type,
      network_type: network_type,
    };
    try {
      setIsGettingAddress(true);
      const response = await GetWalletAddress(credential);

      if (response.success === true) {
        toast.success(response.message);
        setSelctedNetworkAddress(response?.data?.address);
      } else {
        toast.error(response.message);
      }
      setIsGettingAddress(false);
    } catch (e) {
      toast.error("Something went wrong");
      setIsGettingAddress(false);
    }
  };

  const isCoinPaymentAndUsdtType = (coin_type: string, network_id: number) => {
    if (coin_type === "USDT" && network_id === 1) return true;
    return false;
  };

  if (!responseData) return <SectionLoading />;

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
                ? responseData?.deposit?.balance +
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

        {isCoinPaymentAndUsdtType(
          responseData?.wallet?.coin_type,
          Number(responseData?.network?.id)
        ) && (
          <div className="tradex-space-y-2">
            <p className="tradex-input-label tradex-mb-0">
              {t("Select Network")}
            </p>

            <select
              name="currency"
              className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
              onChange={(e) => {
                const findObje = responseData?.coin_payment_networks?.find(
                  (x: any) => x.network_type === e.target.value
                );
                // setDependecy(Math.random() * 100);
                setSelectedNetwork(findObje);
              }}
            >
              {responseData?.coin_payment_networks?.map(
                (item: any, index: number) => (
                  <option value={item.network_type} key={index}>
                    {item?.network_name}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        <div className="tradex-space-y-2">
          <p className="tradex-input-label tradex-mb-0">
            {t("Deposit Address")}
          </p>
          {(responseData?.deposit?.coin_type || responseData?.network?.id) && (
            <p className="tradex-input-field !tradex-h-auto tradex-py-[14px] !tradex-text-sm">
              {t(
                `Only send ${
                  responseData?.deposit?.coin_type ?? ""
                } ${checkNetworkFunc(
                  responseData?.network?.id
                )} to this address. Sending any others asset to this adress may result in the loss of your deposit!`
              )}
            </p>
          )}
        </div>
        {!isGettingAddress && (
          <>
            {responseData?.address || selctedNetworkAddress ? (
              <div className=" tradex-flex tradex-justify-center tradex-items-center tradex-flex-col tradex-space-y-4">
                {responseData?.address && (
                  <DipositQrCode address={responseData?.address} />
                )}
                {selctedNetworkAddress &&
                  isCoinPaymentAndUsdtType(
                    responseData?.wallet?.coin_type,
                    Number(responseData?.network?.id)
                  ) && <DipositQrCode address={selctedNetworkAddress} />}

                {responseData?.address && (
                  <DipositAddressCopyField address={responseData?.address} />
                )}
                {selctedNetworkAddress && (
                  <DipositAddressCopyField address={selctedNetworkAddress} />
                )}
              </div>
            ) : (
              <p className="tradex-input-field !tradex-text-sm !tradex-items-center tradex-justify-center">
                {t("No address found!")}
              </p>
            )}
          </>
        )}

        {/* <div className="tradex-space-y-4">
          {!selectedNetwork?.address &&
            responseData?.wallet.coin_type == "USDT" &&
            parseInt(responseData?.network?.id) === 1 && (
              <button
                className=" tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                onClick={() => {
                  GetWalletAddressAction(
                    {
                      coin_type: router.query.coin_type,
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
        </div> */}
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
