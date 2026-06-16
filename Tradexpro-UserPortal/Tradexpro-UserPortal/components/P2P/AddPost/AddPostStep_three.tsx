import { CUstomSelect } from "components/common/CUstomSelect";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { BsQuestionSquareFill } from "react-icons/bs";

export const AddPostThree = ({
  setAddStep,
  terms,
  setTerms,
  auto_reply,
  setAuto_reply,
  data,
  selectedCountry,
  setSelectedCountry,
  uid,
  registerDays,
  coinHolding,
  setregisterDays,
  setcoinHolding,
  createUpdateP2pAdsAction,
  UpdateP2pAdsAction,
}: any) => {
  const [Countries, setCountries] = useState([]);
  const { t } = useTranslation("common");
  const handleCountry = (e: any) => {
    setSelectedCountry(e);
  };
  useEffect(() => {
    let country: any = [];
    data?.data?.country?.map((asset: any) => {
      const obj = {
        value: asset.key,
        label: asset.key,
      };
      country.push(obj);
    });
    setCountries(country);
  }, [data.data.payment_method, data.data.payment_time]);
  return (
    <div>
      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
        <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
          <h2 className=" tradex-text-2xl tradex-leading-[30px] tradex-font-bold !tradex-text-title">
            {uid ? "Edit ads" : "Post ads"}
          </h2>
        </div>
        <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-6">
          <div className="tradex-space-y-2 sm:tradex-col-span-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Available Region[s]")}
            </label>
            <CUstomSelect
              options={Countries}
              isSearchable={true}
              isMulti={true}
              placeholder={t("All Region[s]")}
              handleFunction={handleCountry}
              defaultValue={selectedCountry}
            />
          </div>
          <div className="tradex-space-y-2 ">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {" "}
              {t("Terms [Optional]")}
            </label>

            <textarea
              placeholder={t("Terms will be displayed the counterparty")}
              value={terms}
              onChange={(e) => {
                setTerms(e.target.value);
              }}
              className="tradex-w-full !tradex-bg-transparent tradex-px-2.5 tradex-py-1.5 tradex-min-h-20 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body"
            ></textarea>
          </div>
          <div className="tradex-space-y-2 ">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {" "}
              {t("Auto-reply [Optional]")}
            </label>

            <textarea
              placeholder={t("Terms will be displayed the counterparty")}
              value={auto_reply}
              onChange={(e) => {
                setAuto_reply(e.target.value);
              }}
              className="tradex-w-full !tradex-bg-transparent tradex-px-2.5 tradex-py-1.5 tradex-min-h-20 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body"
            ></textarea>
          </div>
          <div className=" sm:tradex-col-span-2">
            <p className=" tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold">
              {" "}
              {t("Counterparty Conditions")}
            </p>
          </div>

          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Register days")}
            </label>

            <input
              type="number"
              value={registerDays}
              onChange={(e) => {
                setregisterDays(e.target.value);
              }}
              className="tradex-w-full !tradex-bg-transparent tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body"
            />
            <small className=" tradex-text-body">
              {t(
                "Adding counterparty requirements will reduce the exposure of your Ad"
              )}
            </small>
          </div>
          {/* <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Coin holding")}
            </label>

            <input
              type="number"
              value={coinHolding}
              className="tradex-w-full !tradex-bg-transparent tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body"
              onChange={(e) => {
                setcoinHolding(e.target.value);
              }}
            />
          </div> */}
        </div>
      </div>
      <div className="tradex-mt-5 tradex-flex tradex-gap-6 tradex-items-center">
        <button
          onClick={() => setAddStep("stepTwo")}
          className=" tradex-min-h-12 tradex-min-w-[157px] tradex-bg-body tradex-text-background-main tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-text-base tradex-leading-[22px] tradex-font-bold"
        >
          {t("Previous")}
        </button>
        <button
          className="tradex-min-h-12 tradex-min-w-[157px] tradex-bg-primary tradex-text-white tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-text-base tradex-leading-[22px] tradex-font-bold"
          onClick={uid ? UpdateP2pAdsAction : createUpdateP2pAdsAction}
        >
          {uid ? t("Edit") : t("Create")}
        </button>
      </div>
    </div>
  );
};
