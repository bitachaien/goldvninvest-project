import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GenerateSecretKey, ShowGeneratedSecretKey } from "service/settings";
import { SetupGoogle2faAction } from "state/actions/settings";
import { setSecretKeySettings } from "state/reducer/common";
import { RootState } from "state/store";

const SecretKeyModal = ({
  isKeyGenerate,
  setIsSecretKeyAvailable,
  generateSecret2faEnable,
  setIsSecretKeyModalOpen,
  settings,
}: any) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [password, setPassword] = useState<any>("");
  const [code, setCode] = useState<any>("");
  const [secretKey, setSecretKey] = useState<any>("");
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isKeyGenerate) {
      const response = await GenerateSecretKey(password, code);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setSecretKey(response?.data?.secret_key || "");
      dispatch(setSecretKeySettings(1));
      return;
    }
    const response = await ShowGeneratedSecretKey(password, code);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    setSecretKey(response?.data?.secret_key || "");
    setIsSecretKeyAvailable(true);
  };
  return (
    <>
      <div className="modal d-block">
        <div
          className="modal-dialog modal-dialog-centered secret-key-dialog"
          role="document"
        >
          {secretKey ? (
            <div className="modal-content w-full">
              <div className="modal-header">
                <h5 className="modal-title" id="secretKeyLabel">
                  {t("Secret Key")}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setIsSecretKeyModalOpen(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="border rounded d-flex flex-wrap py-2 px-3 align-items-center justify-content-between gap-10">
                      <p className="word-break-all">
                        Secret Key: <strong> {secretKey}</strong>
                      </p>
                      <span
                        onClick={() => {
                          navigator.clipboard.writeText(secretKey);
                          toast.success("Successfully copied");
                        }}
                        className="cursor-pointer"
                      >
                        <i className="fa fa-clone"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsSecretKeyModalOpen(false)}
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          ) : (
            <form method="post" className="w-full">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="secretKeyLabel">
                    {t("Secret Key")}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setIsSecretKeyModalOpen(false)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <input
                        placeholder={t("Password")}
                        type="password"
                        className="form-control h-46"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    {generateSecret2faEnable == 1 &&
                      (!settings?.user?.google2fa_secret ? (
                        <div className="col-12  mt-4">
                          <div className="text-center d-flex gap-5 align-items-center">
                            <h5>{t("Google two factor is required.")}</h5>
                            <Link
                              href={"/user/settings"}
                              onClick={() => setIsSecretKeyModalOpen(false)}
                            >
                              <h5 className="cursor-pointer text-underline">
                                [{t("Set Two Factor")}]
                              </h5>
                            </Link>{" "}
                          </div>
                        </div>
                      ) : (
                        <div className="col-12 mt-4">
                          <input
                            placeholder={t("Google Authentication Code")}
                            type="text"
                            className="form-control h-46"
                            name="otp"
                            value={code}
                            onChange={(e) => {
                              setCode(e.target.value);
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsSecretKeyModalOpen(false)}
                  >
                    {t("Close")}
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    {isKeyGenerate ? t("Geneate") : t("Show")}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default SecretKeyModal;
