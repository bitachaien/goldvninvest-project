import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import DipositQrCode from "./diposit-qr-code";
import DipositAddressCopyField from "./diposit-address-copy-field";
import TokenAddressBox from "./TokenAddressBox";
import { toast } from "react-toastify";
import { getFeeAmountApi, GetWalletAddress } from "service/wallet";
import { FaHome } from "react-icons/fa";
import { ImListNumbered } from "react-icons/im";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import WalletGoogleAuthForWithdraw from "components/wallet/WalletGoogleAuthForWithdraw";
import { WalletWithdrawProcessApiAction } from "state/actions/wallet";
import { useRouter } from "next/router";
export default function WithdrawForm({
  coinDetails,
  selectedCoinType,
  setSelectedCoinType,
  getCoinDetailsByCoinType,
}: any) {
  const { settings } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation("common");
  const router = useRouter();
  //   const [isGettingAddress, setIsGettingAddress] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [selectedNetworkType, setSelectedNetworkType] = useState<any>("");
  const [address, setAddress] = useState<any>("");
  const [isFeeFetchFailed, setisFeeFetchFailed] = useState<boolean>(false);
  const [fee, setFee] = useState<any>({});
  const [amount, setAmount] = useState<any>("");
  const [memo, setMemo] = useState<any>("");
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = React.useState(false);

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

  const schema: any = (networks: any, maxAmount: any) =>
    yup.object().shape({
      selectedNetworkType:
        networks?.length > 0
          ? yup.string().required("Network is required")
          : yup.string(),
      address: yup.string().required("Address is required"),
      amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than 0")
        .max(maxAmount, `Amount cannot exceed ${maxAmount}`)
        .required("Amount is required"),
      memo: yup.string().optional(),
      code:
        parseInt(settings.two_factor_withdraw) === 1
          ? yup.string().required("Code is required")
          : yup.string().optional(),
    });

  const validateField = async (field: any, value: any) => {
    try {
      const validationSchema = schema(
        coinDetails?.coin_payment_networks,
        coinDetails?.wallet?.balance
      );
      await validationSchema.validateAt(field, { [field]: value });
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    } catch (error: any) {
      setErrors((prev: any) => ({ ...prev, [field]: error.message }));
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      getFeeAmount();
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [amount, address]);

  const checkIsValid = () => {
    if (isFeeFetchFailed) return false;
    if (Object.keys(errors).length === 0) return false;
    if (errors?.address || errors?.amount || errors?.selectedNetworkType)
      return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!checkIsValid()) return;
    let value = {
      coin_type: selectedCoinType,
      address: address,
      amount: amount,
      memo: memo,
      code: code,
      network_type: selectedNetworkType,
      network_id: coinDetails?.network?.id,
    };
    const response = await WalletWithdrawProcessApiAction(value, setProcessing);
    if (response.success) {
      // getCoinDetailsByCoinType(selectedCoinType);
      resetForm();
      router.push("/user/wallet-history?type=withdrawal");
    }
  };

  const resetForm = () => {
    setCode("");
    setSelectedNetworkType("");
    setAddress("");
    setisFeeFetchFailed(false);
    setFee({});
    setAmount("");
    setMemo("");
    setErrors({});

    setSelectedCoinType("");
  };

  const getFeeAmount = async () => {
    if (!selectedCoinType || !address || !amount) return;

    await validateField("amount", amount);

    if (amount > coinDetails?.wallet?.balance) return;

    let value = {
      coin_type: selectedCoinType,
      address: address,
      amount: amount,
    };
    setisFeeFetchFailed(false);
    try {
      const response = await getFeeAmountApi(value);
      if (!response.success) {
        toast.error(response.message);
        setisFeeFetchFailed(true);
        return;
      }
      setFee(response.data);
    } catch (error) {
      toast.error("Failed to fetch fee");
      setisFeeFetchFailed(true);
    }
  };

  return (
    <>
      {coinDetails?.coin_payment_networks?.length > 0 && (
        <div className="tradex-space-y-2">
          <p className="tradex-input-label tradex-mb-0">
            {t("Select Network")}
          </p>
          <select
            name="currency"
            className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
            onChange={(e) => {
              setSelectedNetworkType(e.target.value);
            }}
            onBlur={() =>
              validateField("selectedNetworkType", selectedNetworkType)
            }
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
          {errors?.selectedNetworkType && (
            <p className="tradex-text-red-600 tradex-text-xs">
              {errors?.selectedNetworkType}
            </p>
          )}
        </div>
      )}
      <div className="tradex-space-y-2">
        <p className="tradex-input-label">{t("Address")}</p>
        <div className=" tradex-space-y-1">
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <input
              type="text"
              className=" tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm"
              id="address"
              name="address"
              placeholder={t("Address")}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              onBlur={() => validateField("address", address)}
            />
            <span className="input-address-bar-btn">
              <FaHome />
            </span>
          </div>
          {errors?.address && (
            <p className="tradex-text-red-600 tradex-text-xs">
              {errors?.address}
            </p>
          )}
          <p className=" tradex-text-yellow-500 tradex-text-xs">
            {t(
              `Only enter a ${selectedCoinType} ${
                coinDetails?.network?.name
                  ? `(${coinDetails?.network?.name})`
                  : ""
              } address in this field. Otherwise the asset you withdraw, may be lost.`
            )}
          </p>
        </div>
      </div>

      <div className="tradex-space-y-2">
        <p className="tradex-input-label">{t("Amount")}</p>
        <div className=" tradex-space-y-1">
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <input
              type="number"
              className="tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm"
              id="amountWithdrawal"
              name="amount"
              placeholder={t("AMOUNT To Withdraw")}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              onBlur={() => validateField("amount", amount)}
            />
            <span className="input-address-bar-btn">
              <ImListNumbered />
            </span>
          </div>

          {errors?.amount && (
            <p className="tradex-text-red-600 tradex-text-xs">
              {errors?.amount}
            </p>
          )}

          {Object.keys(fee).length > 0 && (
            <p className="tradex-text-body tradex-text-xs">
              {t(
                `You will be charged ${fee?.fees} ${fee?.coin_type} as Withdrawal Fee for this withdrawal.`
              )}
            </p>
          )}
          {/* {responseData?.wallet?.withdrawal_fees_type ==
            WITHDRAW_FESS_PERCENT && (
            <p className=" tradex-text-xs tradex-text-body">
              <span className=" tradex-mr-2">
                {t("Fees ")}
                {parseFloat(responseData?.wallet?.withdrawal_fees).toFixed(8)} %
              </span>
              <span className="tradex-mr-2">
                {t("Min withdraw ")}{" "}
                {parseFloat(responseData?.wallet?.minimum_withdrawal).toFixed(
                  5
                )}
                {responseData?.wallet?.coin_type}
              </span>
              <span className="tradex-mr-2">
                {t("Max withdraw")}{" "}
                {parseFloat(responseData?.wallet?.maximum_withdrawal)}{" "}
                {responseData?.wallet?.coin_type}
              </span>
            </p>
          )} */}
        </div>
      </div>
      <div className="tradex-space-y-2">
        <p className=" tradex-input-label">
          {t("Memo")} ({t("optional")})
        </p>
        <div className=" tradex-space-y-1">
          <input
            type="text"
            className="tradex-input-field tradex-text-sm"
            id="memo"
            name="memo"
            placeholder={t("Memo if needed")}
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
            }}
            onBlur={() => validateField("memo", memo)}
          />

          <p className=" tradex-text-xs tradex-text-body">
            {t(
              `Add your memo if needed but please ensure it that's correct, otherwise you lost coin.`
            )}
          </p>
        </div>
      </div>

      <WalletGoogleAuthForWithdraw
        handleSubmit={handleSubmit}
        code={code}
        setCode={setCode}
        processing={processing}
      />

      {parseInt(settings.two_factor_withdraw) === 1 ? (
        <button
          type="button"
          className={` ${
            (!checkIsValid() || processing) && "tradex-cursor-not-allowed"
          } tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white`}
          data-target="#exampleModal"
          disabled={!checkIsValid() || processing}
          data-toggle="modal"
        >
          {t("Withdraw")}
        </button>
      ) : (
        <button
          className={` ${
            (!checkIsValid() || processing) && "tradex-cursor-not-allowed"
          } tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white`}
          type="button"
          disabled={!checkIsValid() || processing}
          onClick={handleSubmit}
        >
          {t("Withdraw")}
        </button>
      )}
    </>
  );
}
