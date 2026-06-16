import { CUstomSelect } from "components/common/CUstomSelect";
import { FIXED_PRICE, FLOAT_PRICE } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { BsPlusLg, BsQuestionSquareFill } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";

export const AddPostOne = ({
  setAddStep,
  data,
  setSelectedAsset,
  selectedAsset,
  setselectedCurrency,
  selectedCurrency,
  pricePoint,
  priceType,
  setPriceType,
  setPricePoint,
  uid,
}: any) => {
  const { t } = useTranslation("common");

  const [AssetOptions, setAssetOptions] = useState([]);
  const [CurrencyOptions, setCurrencyOptions] = useState([]);

  const handleCurrency = (e: any) => {
    setselectedCurrency(e);
  };
  const handleAsset = (e: any) => {
    setSelectedAsset(e);
  };
  useEffect(() => {
    let myAssets: any = [];
    let myCurrency: any = [];
    data?.data?.currency?.map((asset: any) => {
      const obj = {
        value: asset.currency_code,
        label: asset.currency_code,
      };
      myCurrency.push(obj);
    });
    data?.data?.assets?.map((asset: any) => {
      const obj = {
        value: asset.coin_type,
        label: asset.coin_type,
      };
      myAssets.push(obj);
    });
    setAssetOptions(myAssets);
    setCurrencyOptions(myCurrency);
  }, [data?.data?.assets]);
  return (
    <div>
      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
        <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
          <h2 className=" tradex-text-2xl tradex-leading-[30px] tradex-font-bold !tradex-text-title">
            {uid ? "Edit ads" : "Post ads"}
          </h2>
        </div>
        <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-6">
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {" "}
              {t("Asset")}:
            </label>
            <CUstomSelect
              options={AssetOptions}
              isSearchable={true}
              disable={uid ? true : false}
              handleFunction={handleAsset}
              defaultValue={selectedAsset}
            />
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {" "}
              {t("With Fiat")}:
            </label>
            <CUstomSelect
              options={CurrencyOptions}
              isSearchable={true}
              disable={uid ? true : false}
              handleFunction={handleCurrency}
              defaultValue={selectedCurrency}
            />
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {" "}
              {t("Your Price")}
            </label>
            <h5 className=" tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body">
              {selectedCurrency?.value} {parseFloat(pricePoint.highest_price)}
            </h5>
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Lowest Order Price")}
            </label>
            <h5 className="tradex-flex tradex-items-center tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body">
              {selectedCurrency?.value} {parseFloat(pricePoint.lowest_price)}
            </h5>
          </div>

          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Price Type")}
            </label>
            <div className="d-flex gap-20">
              <div className="adFromCheckBox">
                <input
                  type="radio"
                  name="optradio"
                  checked={priceType === FIXED_PRICE}
                  onChange={() => setPriceType(FIXED_PRICE)}
                  className=" tradex-accent-primary"
                />
                <p className=" tradex-text-body tradex-font-bold">
                  {t("Fixed")}
                </p>
              </div>
              <div className="adFromCheckBox">
                <input
                  type="radio"
                  name="optradio"
                  checked={priceType === FLOAT_PRICE}
                  onChange={() => setPriceType(FLOAT_PRICE)}
                  className=" tradex-accent-primary"
                />
                <p className=" tradex-text-body tradex-font-bold">
                  {t("Floating")}
                </p>
              </div>
            </div>
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {priceType === FIXED_PRICE ? "Fixed" : "Floating"}
            </label>
            <span className="tradex-flex tradex-items-center tradex-gap-3 tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body">
              <button
                onClick={() =>
                  setPricePoint({
                    ...pricePoint,
                    price: Math.max(
                      0,
                      parseFloat(pricePoint.price) - 1
                    ).toFixed(2),
                  })
                }
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={pricePoint.price}
                className=" tradex-w-full !tradex-bg-transparent !tradex-border-0 tradex-px-1 tradex-text-center tradex-font-bold tradex-text-body"
                onChange={(e) =>
                  setPricePoint({ ...pricePoint, price: e.target.value })
                }
              />
              {priceType === FLOAT_PRICE && "%"}
              <button
                onClick={() =>
                  setPricePoint({
                    ...pricePoint,
                    price: (parseFloat(pricePoint.price) + 1).toFixed(2),
                  })
                }
              >
                <BsPlusLg />
              </button>
            </span>
          </div>
        </div>
      </div>

      <div className=" tradex-mt-5">
        {selectedAsset &&
        selectedCurrency &&
        pricePoint.highest_price &&
        pricePoint.lowest_price ? (
          <button
            onClick={() => setAddStep("stepTwo")}
            className=" tradex-min-h-12 tradex-min-w-[157px] tradex-bg-primary tradex-text-white tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-text-base tradex-leading-[22px] tradex-font-bold"
          >
            {t("Next")}
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
