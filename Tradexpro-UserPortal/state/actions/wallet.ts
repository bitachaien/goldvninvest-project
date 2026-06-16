import React from "react";
import {
  WalletListApi,
  WalletDepositApi,
  WalletWithdrawApi,
  WalletWithdrawProcessApi,
  GetWalletAddress,
} from "service/wallet";
import { toast } from "react-toastify";

export const WalletListApiAction = async (
  url: string,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setProcessing(true);
  const response = await WalletListApi(url);
  setProcessing(false);
  return response.data;
};
export const SearchObjectArrayFuesJS = (
  array: any,
  setArray: React.Dispatch<React.SetStateAction<any>>,
  search: string
) => {
  if (!search) setArray(array.data);
  const newArray = array.data.filter((item: any) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });
  setArray(newArray);
};

export const WalletDepositApiAction = async (coin_type: any) => {
  const response = await WalletDepositApi(coin_type);

  return response;
};

export const WalletWithdrawApiAction = async (coin_type: any) => {
  const response = await WalletWithdrawApi(coin_type);

  return response;
};

export const WalletWithdrawProcessApiAction = async (
  credential: any,
  setProcessing: React.Dispatch<React.SetStateAction<any>>
) => {
  setProcessing(true);
  const response = await WalletWithdrawProcessApi(credential);
  if (response.success === true) {
    toast.success(response.message);
  } else {
    toast.error(response.message);
  }
  setProcessing(false);
  return response;
};
export const GetWalletAddressAction = async (
  credential: any,
  setNetwork: any,
  setDependecy: any
) => {
  const response = await GetWalletAddress(credential);
  if (response.success === true) {
    toast.success(response.message);
    setNetwork(response.data);
    setDependecy(Math.random() * 1000);
  } else {
    toast.error(response.message);
  }
  return response;
};
