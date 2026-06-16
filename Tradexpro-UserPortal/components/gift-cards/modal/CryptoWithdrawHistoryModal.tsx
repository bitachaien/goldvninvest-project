import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function CryptoWithdrawHistoryModal({
  setIsModalOpen,
  modalItem,
}: any) {
  return (
    <div id="demo-modal" className="gift-card-modal">
      <div className="gift-card-modal__content section-padding-custom w-auto min-w-50-p">
        <h2 className="tradex-text-xl tradex-text-title">{modalItem.title}</h2>

        <div className=" tradex-pt-4 tradex-max-h-[60vh] tradex-overflow-y-auto">
          <p>{modalItem.note}</p>
        </div>

        <span
          className="gift-card-modal__close text-45 pointer"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </span>
      </div>
    </div>
  );
}
