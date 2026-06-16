import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function FiatHistoryModal({ setIsModalOpen, modalItem }: any) {
  const { t } = useTranslation("common");
  return (
    <div id="demo-modal" className="gift-card-modal">
      <div className="gift-card-modal__content section-padding-custom w-auto min-w-50-p">
        <h2>{t(modalItem.title)}</h2>

        <div className=" tradex-py-8 tradex-max-h-[60vh] tradex-overflow-y-auto">
          {modalItem.isBankRecipt ? (
            <div className="w-full text-center">
              <img
                className="w-full max-w-600"
                src={modalItem.img_link}
                alt="Bank Recipt"
              />
            </div>
          ) : (
            <p>{modalItem.note}</p>
          )}
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
