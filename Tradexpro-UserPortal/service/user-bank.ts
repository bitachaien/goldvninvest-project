import request from "lib/request";

export const getDynamicBankFormListApi = async () => {
  const { data } = await request.get("/get-bank-form");
  return data;
};

export const addEditDynamicBankDetailsApi = async (payload: any) => {
  const { data } = await request.post("/bank-submit", payload);
  return data;
};

export const getUserBankListApi = async () => {
  const { data } = await request.get("/get-bank-list");
  return data;
};

export const deleteBankItemApi = async (id: any) => {
  const { data } = await request.get(`/bank-delete-${id}`);
  return data;
};

export const getBankDetailsApi = async (id: any) => {
  const { data } = await request.get(`/get-user-bank-${id}`);
  return data;
};
