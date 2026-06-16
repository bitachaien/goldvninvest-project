import request from "lib/request";

export const UserSettingsApi = async () => {
  const { data } = await request.get("/user-setting");
  return data;
};

export const Google2faSetupApi = async (credentials: {
  setup: string;
  code: string;
  google2fa_secret: string;
}) => {
  const { data } = await request.post("/google2fa-setup", credentials);
  return data;
};

export const LanguageListApi = async () => {
  const { data } = await request.get("/language-list");
  return data;
};

export const Google2faLoginApi = async () => {
  const { data } = await request.get("/setup-google2fa-login");
  return data;
};

export const LanguageSetupApi = async (credentials: { language: string }) => {
  const { data } = await request.post("/language-setup", credentials);
  return data;
};

export const UpdateCurrency = async (code: string) => {
  const { data } = await request.post("/update-currency", { code: code });
  return data;
};

export const GenerateSecretKey = async (password: any, code: any) => {
  const { data } = await request.post("/generate-secret-key", {
    password: password,
    code: code,
  });
  return data;
};

export const ShowGeneratedSecretKey = async (password: any, code: any) => {
  const { data } = await request.post("/show-secret-key", {
    password: password,
    code: code,
  });
  return data;
};

export const getApiSettingsApi = async () => {
  const { data } = await request.get("/get-api-settings");
  return data;
};

export const updateApiSettingsApi = async (value: any) => {
  const { data } = await request.post("/update-api-settings", value);
  return data;
};

export const addWhiteListApi = async (value: any) => {
  const { data } = await request.post("/add-api-white-list", value);
  return data;
};

export const getWhiteListsApi = async (page: any, limit: any, search: any) => {
  const { data } = await request.get(
    `/get-api-white-list?page=${page}&limit=${limit}&search=${search}`
  );
  return data;
};

export const updateWhiteListApi = async (id: any, type: any, value: any) => {
  const { data } = await request.get(`/white-list-${id}-${type}-${value}`);
  return data;
};

export const deleteWhiteListApi = async (id: any) => {
  const { data } = await request.get(`/api-white-list-delete-${id}`);
  return data;
};
