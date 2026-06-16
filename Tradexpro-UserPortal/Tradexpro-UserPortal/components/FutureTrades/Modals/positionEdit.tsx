import { CROSS, ISOLATED } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { updateProfitLongShortAction } from "state/actions/futureTrade";

const PositionEdit = ({ item }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any>({
    D: 0,
    stop_loss: 0,
  });
  const { t } = useTranslation("common");
  const toggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        id=""
        data-toggle="pill"
        role="tab"
        aria-controls="pills-transfer-1"
        aria-selected="true"
        onClick={toggle}
      >
        <AiOutlineEdit size={24} className="ml-3" />
      </div>
      {isModalOpen && (
        <div id="demo-modal" className="gift-card-modal">
          <div className="future-modal__content section-padding-custom">
            <h3>{t("TP/SL for entire positon")}</h3>
            <div className="mb-3">
              <div className="position-content">
                <span>{t("Symbol")}</span>
                <span>{item?.profit_loss_calculation?.symbol}</span>
              </div>
              <div className="position-content">
                <span>{t("Entry Price")}</span>
                <span>
                  {item?.entry_price}
                  {item?.profit_loss_calculation?.base_coin_type}
                </span>
              </div>
              <div className="position-content">
                <span>{t("Mark Price")}</span>
                <span>
                  {item?.profit_loss_calculation?.market_price}
                  {item?.profit_loss_calculation?.base_coin_type}
                </span>
              </div>
            </div>
            <div>
              <div className="mt-3 boxShadow position-input">
                <label className="">{t("Take Profit")}</label>
                <input
                  name="take_profit"
                  type="number"
                  placeholder="0"
                  className=""
                  value={data?.take_profit}
                  onChange={(e) => {
                    setData({
                      ...data,
                      take_profit: Number(e.target.value),
                    });
                  }}
                />
                <span className="text-warning blns">
                  <span className="trade_coin_type">{t("MARK")}</span>
                </span>
              </div>
              <div className="mt-3 boxShadow position-input">
                <label className="">{t("Stop loss")}</label>
                <input
                  name="price"
                  type="number"
                  placeholder="0"
                  className=""
                  value={data?.stop_loss}
                  onChange={(e) => {
                    setData({
                      ...data,
                      stop_loss: Number(e.target.value),
                    });
                  }}
                />
                <span className="text-warning blns">
                  <span className="trade_coin_type">{t("MARK")}</span>
                </span>
              </div>
            </div>

            <div className="position-button-area">
              <button
                className="primary-btn w-98-p margin-2"
                onClick={closeModal}
              >
                {t("Close")}
              </button>
              <button
                className="primary-btn w-98-p margin-2"
                onClick={async () => {
                  await updateProfitLongShortAction(
                    item?.uid,
                    data.take_profit,
                    data.stop_loss,
                    setData
                  );
                  await setIsModalOpen(false);
                }}
              >
                {t("Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PositionEdit;
