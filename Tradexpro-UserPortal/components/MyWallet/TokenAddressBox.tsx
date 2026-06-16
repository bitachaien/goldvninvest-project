import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function TokenAddressBox({ token_address }: any) {
  const { t } = useTranslation("common");
  return (
    <div className="accordion" id="accordionExample">
      <div className="">
        <div className="card">
          <div className="card-header" id="headingOne">
            <h5 className="mb-0 header-align">
              <button
                className="btn btn-link collapsed"
                data-toggle="collapse"
                data-target={`#collapseTokenAddress`}
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                {t("Display Contract Address")}
              </button>
              <i className={`fas fa-caret-down mright-5`}></i>
            </h5>
          </div>

          <div
            id={`collapseTokenAddress`}
            className={`collapse`}
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
          >
            <div className="tradex-input-field">
              <p className="tradex-text-sm tradex-text-body tradex-overflow-hidden tradex-text-ellipsis">
                {token_address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
