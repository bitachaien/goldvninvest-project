import { CUstomSelect } from "components/common/CUstomSelect";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { HiRefresh } from "react-icons/hi";

export const P2pFilter = ({ filters, setFilters, settings }: any) => {
  const [currency, setCurrency] = useState([]);
  const [country, setCountry] = useState([]);
  const [payment, setPayment] = useState([]);

  const { t } = useTranslation("common");

  const handleCurrency = (e: any) => {
    setFilters({ ...filters, currency: e.value });
  };
  const handleCountry = (e: any) => {
    setFilters({ ...filters, country: e.value });
  };
  const handlePayment = (e: any) => {
    setFilters({ ...filters, payment_method: e.value });
  };
  useEffect(() => {
    let currency: any = [];
    currency.push({
      value: "all",
      label: "All",
    });
    let country: any = [];
    country.push({
      value: "all",
      label: "All",
    });
    let payment: any = [];
    payment.push({
      value: "all",
      label: "All",
    });
    settings?.currency?.map((item: any) =>
      currency.push({
        value: item.currency_code,
        label: item.currency_code,
      })
    );
    settings?.country?.map((item: any) =>
      country.push({
        value: item.key,
        label: item.value,
      })
    );
    settings?.payment_method?.map((item: any) =>
      payment.push({
        value: item?.uid,
        label: item?.name,
      })
    );
    setCurrency(currency);
    setCountry(country);
    setPayment(payment);
  }, [settings]);
  return (
    <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-6">
      <div className="tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
          {t("Amount")}
        </label>

        <input
          type="text"
          placeholder={t("Enter amount EUR")}
          value={filters.amount}
          onChange={(e) => {
            setFilters({
              ...filters,
              amount: e.target.value,
            });
          }}
          className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md !tradex-bg-transparent"
        />
      </div>
      <div>
        <div className="form-group p2pSelectFilter tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
            {" "}
            {t("Fiat")}
          </label>
          <CUstomSelect options={currency} handleFunction={handleCurrency} />
        </div>
      </div>
      <div>
        <div className="form-group p2pSelectFilter tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
            {" "}
            {t("Payment")}
          </label>
          <CUstomSelect options={payment} handleFunction={handlePayment} />
        </div>
      </div>
      <div>
        <div className="form-group p2pSelectFilter tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
            {t("Available Region(s)")}
          </label>
          <CUstomSelect options={country} handleFunction={handleCountry} />
        </div>
      </div>
    </div>
  );
};
