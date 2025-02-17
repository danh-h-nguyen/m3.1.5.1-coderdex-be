import React from "react";
import {
  alpha,
  createTheme,
  CssBaseline,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material";
// ======
import customizeComponents from "./customizations";
// ======

const PRIMARY = {
  lighter: "#C8FACD", // Màu sáng nhất
  light: "#A3F5B0", // Màu sáng (nhẹ)
  main: "#4CAF50", // Màu chính
  dark: "#388E3C", // Màu tối (dark)
  darker: "#2C6B2F", // Màu tối hơn (darker)
  contrastText: "#FFF", // Màu chữ khi đặt trên nền primary
};

const SECONDARY = {
  lighter: "#D6E4FF", // Màu sáng nhất
  light: "#ADC6FF", // Màu sáng (nhẹ)
  main: "#1976D2", // Màu chính
  dark: "#1565C0", // Màu tối (dark)
  darker: "#0D47A1", // Màu tối hơn (darker)
  contrastText: "#FFF", // Màu chữ khi đặt trên nền secondary
};

const SUCCESS = {
  lighter: "#E9FCD4", // Màu sáng nhất
  light: "#C1F2A2", // Màu sáng (nhẹ)
  main: "#4CAF50", // Màu chính (green)
  dark: "#388E3C", // Màu tối (dark)
  darker: "#2C6B2F", // Màu tối hơn (darker)
  contrastText: "#FFF", // Màu chữ khi đặt trên nền success
};

const GREY = {
  0: "#FFFFFF", // Trắng
  100: "#F7F7F7", // Màu xám sáng nhất
  200: "#E0E0E0", // Màu xám sáng
  300: "#BDBDBD", // Màu xám vừa
  400: "#9E9E9E", // Màu xám trung bình
  500: "#757575", // Màu xám chuẩn
  600: "#616161", // Màu xám tối
  700: "#424242", // Màu xám tối hơn
  800: "#212121", // Màu xám rất tối
  900: "#121212", // Màu xám gần như đen
  500_8: alpha("#919EAB", 0.08), // Xám với độ trong suốt 8%
  500_12: alpha("#919EAB", 0.12), // Xám với độ trong suốt 12%
  500_16: alpha("#919EAB", 0.16), // Xám với độ trong suốt 16%
  500_24: alpha("#919EAB", 0.24), // Xám với độ trong suốt 24%
  500_32: alpha("#919EAB", 0.32), // Xám với độ trong suốt 32%
  500_48: alpha("#919EAB", 0.48), // Xám với độ trong suốt 48%
  500_56: alpha("#919EAB", 0.56), // Xám với độ trong suốt 56%
  500_80: alpha("#919EAB", 0.8), // Xám với độ trong suốt 80%
};

function ThemeProvider({ children }) {
  const themeOptions = {
    palette: {
      primary: PRIMARY,
      secondary: SECONDARY,
      success: SUCCESS,
      text: {
        primary: GREY[800],
        secondary: GREY[600],
        disabled: GREY[500],
      },

      background: {
        paper: "#fff",
        default: "#fff",
        neutral: GREY[200],
      },

      action: {
        active: GREY[600],
        hover: GREY[500_8],
        selected: GREY[500_16],
        disabled: GREY[500_80],
        disabledBackground: GREY[500_24],
        focus: GREY[500_24],
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
      },
    },
    shape: { borderRadius: 8 },
  };

  const theme = createTheme(themeOptions);

  theme.components = customizeComponents(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export default ThemeProvider;
