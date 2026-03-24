/**
 * Custom Chakra UI theme for HealthMate
 * Uses a green/blue health-oriented color palette
 */
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  // Brand colors — green/blue health palette
  colors: {
    brand: {
      50: "#e6f7ef",
      100: "#b3e8d0",
      200: "#80d8b1",
      300: "#4dc992",
      400: "#26bd7b",
      500: "#00b164", // primary green
      600: "#009f5a",
      700: "#007c46",
      800: "#005a33",
      900: "#00381f",
    },
    accent: {
      50: "#e8f4fd",
      100: "#bee3f8",
      200: "#90cdf4",
      300: "#63b3ed",
      400: "#4299e1",
      500: "#3182ce", // primary blue
      600: "#2b6cb0",
      700: "#2c5282",
      800: "#2a4365",
      900: "#1a365d",
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
});

export default theme;
