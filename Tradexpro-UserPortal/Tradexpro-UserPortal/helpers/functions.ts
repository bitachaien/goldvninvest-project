import { setThemeColor } from "state/reducer/common";
import { DEFAULT_PRIMARY_COLOR } from "./core-constants";
export const changeThemeSettingsDashboard = (
  tradeGreen: string,
  tradeRed: string,
  setThemeColor: any,
  ThemeColor: any,
  chooseColor: number
) => {
  const checkRedGreen = localStorage.getItem("chart-up-down");
  if (checkRedGreen === "1") {
    document.documentElement.style.setProperty("--trade-green", tradeGreen);
    document.documentElement.style.setProperty("--trade-red", tradeRed);
  } else {
    document.documentElement.style.setProperty("--trade-green", tradeRed);
    document.documentElement.style.setProperty("--trade-red", tradeGreen);
  }
  localStorage.setItem("tradeGreen", tradeGreen);
  localStorage.setItem("tradeRed", tradeRed);
  localStorage.setItem("chooseColor", chooseColor.toString());
  setThemeColor((prevThemeColor: any) => ({
    ...prevThemeColor,
    green: tradeGreen,
    red: tradeRed,
    chooseColor: chooseColor,
  }));
};

export const changeLayout = (layoutNumber: number, setLayout: any) => {
  localStorage.setItem("layout-trade", layoutNumber.toString());
  setLayout(layoutNumber);
};
export const swapGreenToRedAndRedToGeen = (
  setThemeColor: any,
  ThemeColor: any,
  redGreenUpDown: number
) => {
  const tradeGreen = localStorage.getItem("tradeGreen");
  const tradeRed = localStorage.getItem("tradeRed");
  if (redGreenUpDown === 2) {
    localStorage.setItem("chart-up-down", "2");
    setThemeColor((prevThemeColor: any) => ({
      ...prevThemeColor,
      green: tradeRed ? tradeRed : "#d63031",
      red: tradeGreen ? tradeGreen : "#32d777",
      redGreenUpDown: redGreenUpDown,
    }));
    document.documentElement.style.setProperty(
      "--trade-green",
      tradeRed ? tradeRed : "#d63031"
    );
    document.documentElement.style.setProperty(
      "--trade-red",
      tradeGreen ? tradeGreen : "#32d777"
    );
  } else {
    localStorage.setItem("chart-up-down", "1");
    setThemeColor((prevThemeColor: any) => ({
      ...prevThemeColor,
      green: tradeGreen ? tradeGreen : "#32d777",
      red: tradeRed ? tradeRed : "#d63031",
      redGreenUpDown: redGreenUpDown,
    }));
    document.documentElement.style.setProperty(
      "--trade-green",
      tradeGreen ? tradeGreen : "#32d777"
    );
    document.documentElement.style.setProperty(
      "--trade-red",
      tradeRed ? tradeRed : "#d63031"
    );
  }
};
export const checkDashboardThemeSettings = (
  setThemeColor: any,
  ThemeColor: any,
  setLayout: any
) => {
  const tradeGreen = localStorage.getItem("tradeGreen");
  const tradeRed = localStorage.getItem("tradeRed");
  const layoutTrade = localStorage.getItem("layout-trade");
  const getColorNumber = localStorage.getItem("chooseColor");

  const checkRedGreen = localStorage.getItem("chart-up-down");
  setLayout(layoutTrade ? Number(layoutTrade) : 1);
  if (checkRedGreen === null) {
    localStorage.setItem("chart-up-down", "1");
  }

  if (Number(checkRedGreen) === 2) {
    document.documentElement.style.setProperty(
      "--trade-green",
      tradeRed ? tradeRed : "#d63031"
    );
    document.documentElement.style.setProperty(
      "--trade-red",
      tradeGreen ? tradeGreen : "#32d777"
    );

    setThemeColor({
      redGreenUpDown: checkRedGreen ? Number(checkRedGreen) : 2,
      red: tradeGreen ? tradeGreen : "#32d777",
      green: tradeRed ? tradeRed : "#d63031",
      chooseColor: getColorNumber ? Number(getColorNumber) : 1,
    });
  } else {
    document.documentElement.style.setProperty(
      "--trade-green",
      tradeGreen ? tradeGreen : "#32d777"
    );
    document.documentElement.style.setProperty(
      "--trade-red",
      tradeRed ? tradeRed : "#d63031"
    );

    setThemeColor({
      redGreenUpDown: checkRedGreen ? Number(checkRedGreen) : 1,
      green: tradeGreen ? tradeGreen : "#32d777",
      red: tradeRed ? tradeRed : "#d63031",
      chooseColor: getColorNumber ? Number(getColorNumber) : 1,
    });
  }
};

export function hexToRgb(hex: any) {
  if (!hex) return "";
  // Remove the hash sign if it's included
  hex = hex.replace(/^#/, "");

  // Parse the hex value into individual color components
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
}

export const checkDarkMode = (settings: any, dispatch: any) => {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    localStorage.setItem("theme", "light");
    dispatch(setThemeColor("light"));
    document.documentElement.setAttribute("data-theme", "light");
    settings.theme_color.map((themeColors: any) => {
      if (themeColors.name == "--primary-color") {
        localStorage.setItem("--primary-color", themeColors.value);

        document.documentElement.style.setProperty(
          themeColors.name,
          themeColors.value
            ? hexToRgb(themeColors.value)
            : hexToRgb(DEFAULT_PRIMARY_COLOR[settings.default_theme_color])
        );
      } else if (!themeColors.value) {
        return;
      } else {
        document.documentElement.style.setProperty(
          themeColors.name,
          themeColors.value
        );
      }
    });
  } else {
    localStorage.setItem("theme", "dark");
    dispatch(setThemeColor("dark"));
    document.documentElement.setAttribute("data-theme", "dark");
    settings.dark_theme_color.map((themeColors: any) => {
      if (themeColors.name == "--primary-color") {
        localStorage.setItem("--primary-color", themeColors.value);
        document.documentElement.style.setProperty(
          themeColors.name,
          themeColors.value
            ? hexToRgb(themeColors.value)
            : hexToRgb(DEFAULT_PRIMARY_COLOR[settings.default_theme_color])
        );
      } else if (!themeColors.value) {
        return;
      } else {
        document.documentElement.style.setProperty(
          themeColors.name,
          themeColors.value
        );
      }
    });
  }
};
export const checkDarkModeWithoutSettings = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    localStorage.setItem("theme", "light");
    // dispatch(setTheme("light"));

    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    localStorage.setItem("theme", "dark");
    // dispatch(setTheme("dark"));
    document.documentElement.setAttribute("data-theme", "dark");
  }
};
export const darkModeToggle = (settings: any, setTheme: any, dispatch: any) => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    setTheme(1);
    dispatch(setThemeColor("light"));
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    settings.theme_color.map((theme_color: any) => {
      if (theme_color.name == "--primary-color") {
        document.documentElement.style.setProperty(
          theme_color.name,
          theme_color.value
            ? hexToRgb(theme_color.value)
            : hexToRgb(DEFAULT_PRIMARY_COLOR[settings.default_theme_color])
        );
      } else if (!theme_color.value) {
        return;
      } else {
        document.documentElement.style.setProperty(
          theme_color.name,
          theme_color.value
        );
      }
    });
  } else {
    setTheme(0);
    dispatch(setThemeColor("dark"));

    document.documentElement.setAttribute("data-theme", "dark");
    settings.dark_theme_color.map((theme_color: any) => {
      if (theme_color.name == "--primary-color") {
        document.documentElement.style.setProperty(
          theme_color.name,
          theme_color.value
            ? hexToRgb(theme_color.value)
            : hexToRgb(DEFAULT_PRIMARY_COLOR[settings.default_theme_color])
        );
      } else if (!theme_color.value) {
        return;
      } else {
        document.documentElement.style.setProperty(
          theme_color.name,
          theme_color.value
        );
      }
    });
    localStorage.setItem("theme", "dark");
  }
};

export const darkModeToggleDashboard = (dispatch: any) => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    dispatch(setThemeColor("light"));
    localStorage.setItem("theme", "light");
  } else {
    dispatch(setThemeColor("dark"));
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
};
export const checkThemeState = (setTheme: any, dispatch: any) => {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    setTheme(1);
    // dispatch(setTheme("light"));
  } else {
    setTheme(0);
    // dispatch(setTheme("light"));
  }
};
export const rootThemeCheck = (default_theme_mode: string) => {
  const theme = localStorage.getItem("theme");
  if (!theme) {
    localStorage.setItem("theme", default_theme_mode);
    document.documentElement.setAttribute("data-theme", default_theme_mode);
    return;
  }
  if (theme === "light") {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }
};

export function isApiLocalhost(): boolean {
  const api_url = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (!api_url) {
    throw new Error(`env NEXT_PUBLIC_BASE_URL value not found`);
  }
  if (api_url.includes("localhost") || api_url.includes("127.0.0.1")) {
    return true;
  } else return false;
}
