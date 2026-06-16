import useTranslation from "next-translate/useTranslation";

export const PaymentMethodTable = () => {
  const { t } = useTranslation("common");

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table mt-4">
              <thead>
                <tr>
                  <th scope="col">{t(`Type/Coin`)}</th>
                  <th scope="col">{t(`Fiat amount`)}</th>
                  <th scope="col">{t("Price")}</th>
                  <th scope="col">{t(`Crypto amount`)}</th>
                  <th scope="col">{t(`Counterparty`)}</th>
                  <th scope="col">{t(`Status`)}</th>
                  <th scope="col">{t(`Operation`)}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="tableRow">
                  <td>
                    <div className="tableImg d-flex align-items-center">
                      <img
                        src="https://api-tradex.nftarttoken.xyz/images/avatars/yellow-hat.png"
                        alt=""
                      />
                      <h6 className="ml-2">{t(`Chirik34`)}</h6>
                    </div>
                  </td>
                  <td>
                    <h6 className="mx-2">{t(`12,233.34 EUR`)}</h6>
                  </td>
                  <td>{t(`113.60 BDT`)}</td>
                  <td>{t(`157.89 USDT`)}</td>
                  <td>
                    <a href="">{t(`riralam`)}</a>
                  </td>
                  <td>
                    <h6>{t("Cancelled")}</h6>
                  </td>
                  <td>
                    <p className="text-warning">{t(`Contact`)}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
