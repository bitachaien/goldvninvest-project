import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { MyWalletProcessSidebar } from "service/wallet";
import {
  WalletDepositApiAction,
  WalletWithdrawApiAction,
} from "state/actions/wallet";

import { BiArrowBack } from "react-icons/bi";
import FAQ from "components/FAQ";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import DepositCoinDetails from "./DepositCoinDetails";
import WithdrawForm from "./WithdrawForm";

export default function WithdrawComp({ coinLists = [] }: any) {
  const router = useRouter();

  const [selectedCoinType, setSelectedCoinType] = useState<any>("");

  const [isGettingCoinDetails, setIsGettingCoinDetails] =
    useState<boolean>(false);
  const [coinDetails, setCoinDetails] = useState<any>(null);
  const { t } = useTranslation("common");

  const options = coinLists.map((item: any) => ({
    value: item?.coin_type,
    label: (
      <div className="tradex-flex tradex-gap-2 tradex-items-center">
        <img
          src={item?.coin_icon || "/bitcoin.png"}
          alt={item?.name}
          width="25px"
          height="25px"
          className="tradex-max-w-[25px] tradex-max-h-[25px] tradex-object-cover tradex-object-center"
        />
        <span>{item?.name}</span>
      </div>
    ),
  }));

  const handleChange = (selectedOption: any) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, coin_type: selectedOption.value },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (!router?.query?.coin_type) return;
    getCoinDetailsByCoinType(router?.query?.coin_type);
  }, [router?.query?.coin_type]);

  const getCoinDetailsByCoinType = async (coinType: any) => {
    if (!coinType) return;

    setIsGettingCoinDetails(true);
    setSelectedCoinType("");
    setCoinDetails(null);

    try {
      const response = await WalletWithdrawApiAction(coinType);

      if (!response?.success) {
        toast.error(response?.message);
        return;
      }

      setCoinDetails(response.data);
      setSelectedCoinType(coinType);
    } catch (error) {
      toast.error("Failed to fetch coin details.");
    } finally {
      setIsGettingCoinDetails(false);
    }
  };

  return (
    <div className="tradex-space-y-6">
      <div className=" tradex-space-y-2">
        <label className=" tradex-input-label tradex-mb-0 tradex-flex tradex-justify-between tradex-items-center">
          <span>{t("Select coin")}</span>
          {coinDetails?.wallet?.id && (
            <span className=" tradex-text-sm">
              {t("Total")}: {coinDetails?.wallet?.balance}{" "}
              {coinDetails?.wallet?.coin_type}
            </span>
          )}
        </label>

        <Select
          placeholder={t("Select Coin")}
          classNamePrefix="deposit-withdraw-select"
          options={options}
          isSearchable={false}
          value={options.find(
            (option: any) => option.value === selectedCoinType
          )}
          onChange={handleChange}
          isDisabled={isGettingCoinDetails}
          //   menuIsOpen
        />
        {parseFloat(coinDetails?.wallet?.balance) <= 0 && (
          <p className=" text-xs tradex-text-red-500 tradex-font-medium">
            {t("You do not have sufficient balance")}
          </p>
        )}
      </div>
      {selectedCoinType &&
        coinDetails &&
        parseFloat(coinDetails?.wallet?.balance) > 0 && (
          <WithdrawForm
            coinDetails={coinDetails}
            selectedCoinType={selectedCoinType}
            setSelectedCoinType={setSelectedCoinType}
            getCoinDetailsByCoinType={getCoinDetailsByCoinType}
          />
        )}
    </div>
  );
}
