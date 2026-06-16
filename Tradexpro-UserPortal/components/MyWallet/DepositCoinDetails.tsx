import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import DipositQrCode from "./diposit-qr-code";
import DipositAddressCopyField from "./diposit-address-copy-field";
import TokenAddressBox from "./TokenAddressBox";
import { toast } from "react-toastify";
import { GetWalletAddress } from "service/wallet";

export default function DepositCoinDetails({
  coinDetails,
  selectedCoinType,
  address,
  setAddress,
}: any) {
  const { t } = useTranslation("common");
  const [isGettingAddress, setIsGettingAddress] = useState<boolean>(false);
  const [selectedNetworkType, setSelectedNetworkType] = useState<any>("");
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

  const getNetworkAddress = async (network_type: string) => {
    if (!selectedCoinType) {
      toast.error("Please select a coin type first.");
      return;
    }

    setIsGettingAddress(true);
    setAddress("");
    setSelectedNetworkType("");
    try {
      const response = await GetWalletAddress({
        coin_type: selectedCoinType,
        network_type,
      });

      if (!response?.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setAddress(response.data?.address || "");
      setSelectedNetworkType(network_type);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsGettingAddress(false);
    }
  };

  const checkIsShowAddressForNetwork = () => {
    if (coinDetails?.coin_payment_networks?.length > 0 && !selectedNetworkType)
      return false;

    return true;
  };

  return (
    <>
      {coinDetails?.memo && (
        <div className=" tradex-space-y-2">
          <p className="tradex-input-label tradex-mb-0">{t("Memo")}</p>
          <div className="tradex-input-field">
            <p className="tradex-text-sm tradex-text-body tradex-overflow-hidden tradex-text-ellipsis">
              {coinDetails?.memo}
            </p>
          </div>
        </div>
      )}

      {coinDetails?.coin_payment_networks?.length > 0 && (
        <div className="tradex-space-y-2">
          <p className="tradex-input-label tradex-mb-0">
            {t("Select Network")}
          </p>
          <select
            name="currency"
            className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
            onChange={(e) => {
              getNetworkAddress(e.target.value);
            }}
          >
            <option value="">{t("Select Network")}</option>
            {coinDetails?.coin_payment_networks?.map(
              (item: any, index: number) => (
                <option value={item.network_type} key={index}>
                  {item?.network_name}
                </option>
              )
            )}
          </select>
        </div>
      )}
      {checkIsShowAddressForNetwork() && (
        <>
          <div className="tradex-space-y-2">
            <p className="tradex-input-label tradex-mb-0">
              {t("Deposit Address")}
            </p>
            <p className="tradex-input-field !tradex-h-auto tradex-py-[14px] !tradex-text-sm">
              {t("Only send")} ${selectedCoinType ?? ""} $
              {coinDetails?.network?.name
                ? `(${coinDetails?.network?.name})`
                : ""}{" "}
              {t("to this address")}
              {t(
                "Sending any others asset to this adress may result in the loss of your deposit!"
              )}
            </p>
          </div>
          {!isGettingAddress &&
            (address ? (
              <div className=" tradex-flex tradex-justify-center tradex-items-center tradex-flex-col tradex-space-y-4">
                <DipositQrCode address={address} />

                <DipositAddressCopyField address={address} />
              </div>
            ) : (
              <p className="tradex-input-field !tradex-text-sm !tradex-items-center tradex-justify-center">
                {t("No address found!")}
              </p>
            ))}
          {coinDetails?.token_address && (
            <TokenAddressBox token_address={coinDetails?.token_address} />
          )}
        </>
      )}
    </>
  );
}
