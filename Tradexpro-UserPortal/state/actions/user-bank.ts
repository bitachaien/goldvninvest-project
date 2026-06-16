import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import {
  addEditDynamicBankDetailsApi,
  deleteBankItemApi,
  getBankDetailsApi,
  getDynamicBankFormListApi,
  getUserBankListApi,
} from "service/user-bank";

export const useGetDynamicBankFormList = () => {
  const [loading, setLoading] = useState(false);
  const [bankFormLists, setBankFormLists] = useState([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchBankFormLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDynamicBankFormListApi();
      setBankFormLists(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      setBankFormLists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankFormLists();
  }, []);

  return {
    loading,
    bankFormLists,
    error,
    refetch: fetchBankFormLists,
  };
};
export const useAddEditBankDetailsAction = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (payload: any) => {
    try {
      setLoading(true);
      const response = await addEditDynamicBankDetailsApi(payload);

      if (response?.success) {
        toast.success(response.message);
        router.push("/user/bank/list");
      } else {
        toast.error(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleSubmit, loading };
};

export const useGetBankListAction = () => {
  const [loading, setLoading] = useState(false);
  const [userBankLists, setUserBankLists] = useState([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserBankLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserBankListApi();
      setUserBankLists(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      setUserBankLists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBankLists();
  }, []);

  return {
    loading,
    userBankLists,
    error,
    refetch: fetchUserBankLists,
  };
};

export const useDeleteBank = () => {
  const [loading, setLoading] = useState(false);

  const deleteBankAction = useCallback(async (id: any) => {
    try {
      setLoading(true);
      const response = await deleteBankItemApi(id);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteBankAction, loading };
};

export const useGetBankDetails = (id?: string | number) => {
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getBankDetailsApi(id);
        if (res.success) {
          setBankDetails(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  return { loading, bankDetails, error };
};
