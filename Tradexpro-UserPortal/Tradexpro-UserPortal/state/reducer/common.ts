import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type commonType = {
  settings: {};
  theme: "";
};

const initialState: any = {
  settings: {},
  theme: "",
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<commonType>) => {
      state.settings = action.payload;
    },
    setThemeColor: (state, action: any) => {
      state.theme = action.payload;
    },
    setSecretKeySettings: (state, action: any) => {
      state.settings = {
        ...state.settings,
        secret_key_available: action.payload,
      };
    },
  },
});

export const { setSettings, setThemeColor, setSecretKeySettings } = commonSlice.actions;
export default commonSlice.reducer;
