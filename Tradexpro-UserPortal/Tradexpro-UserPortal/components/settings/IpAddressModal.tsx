import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  GenerateSecretKey,
  ShowGeneratedSecretKey,
  addWhiteListApi,
} from "service/settings";
import { SetupGoogle2faAction } from "state/actions/settings";
import { setSecretKeySettings } from "state/reducer/common";

const IpAddressModal = ({
  isWhiteListModalOpen,
  setIsWhiteListModalOpen,
  getWhiteListsHandler,
}: any) => {
  const [ipAddress, setIpAddress] = useState<any>("");
  const [isAddWhiteListLoading, setIsAddWhiteListLoading] =
    useState<any>(false);
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!ipAddress) {
      toast.error("Add Ip Address");
      return;
    }
    setIsAddWhiteListLoading(true);
    let value = {
      ip: ipAddress,
      status: 1,
      trade: 1,
      withdrawal: 1,
    };
    const response = await addWhiteListApi(value);
    if (!response.success) {
      toast.error(response.message);
      setIsAddWhiteListLoading(false);

      return;
    }
    toast.success(response.message);
    setIsWhiteListModalOpen(false);
    setIsAddWhiteListLoading(false);
    getWhiteListsHandler(1);
  };

  return (
    <>
      <div className="modal d-block">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <form method="post" className="w-full">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="newIpAddressLabel">
                  {t("Add New Ip Address")}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setIsWhiteListModalOpen(false)}
                  disabled={isAddWhiteListLoading}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="form-group col-12">
                    <label>Ip Address</label>
                    <input
                      placeholder={t("Enter Ip Address")}
                      type="text"
                      className="form-control w-full h-46"
                      name="Ip address"
                      value={ipAddress}
                      onChange={(e: any) => setIpAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsWhiteListModalOpen(false)}
                  disabled={isAddWhiteListLoading}
                >
                  {t("Close")}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary bg-primary-color"
                  onClick={handleSubmit}
                  disabled={isAddWhiteListLoading}
                >
                  {isAddWhiteListLoading ? t("Loading..") : t("Submit")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default IpAddressModal;
