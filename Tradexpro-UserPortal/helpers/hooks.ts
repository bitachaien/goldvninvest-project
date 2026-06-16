import useTranslation from "next-translate/useTranslation";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export const useApi = (apiFunction: any, options: any = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  const memoizedApiFunction = useCallback(apiFunction, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await memoizedApiFunction();
      if (isMounted) {
        setData(response);
        setError(null);
      }
    } catch (error: any) {
      if (isMounted) {
        setError(error);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [memoizedApiFunction, refreshIndex]);

  const refreshData = () => {
    setRefreshIndex((prevIndex) => prevIndex + 1);
  };

  const resetData = () => {
    setData(options.initialData || null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, fetchData, refreshData, resetData };
};
export const usePostApiFunction = (apiFunction: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (...args: any) => {
    try {
      setLoading(true);
      const responseData = await apiFunction(...args);
      setData(responseData);
      setError(null);
    } catch (error) {
      //@ts-ignore
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, postData, resetData };
};

export const useAppTitle = () => {
  const { settings } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation("common");
  return settings?.app_title || t("Your Company");
};
