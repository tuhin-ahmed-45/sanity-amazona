import { StoreProvider } from "@/utils/store";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SnackbarProvider } from "notistack";
import "../styles/globals.css";

const clientSideEmotionCache = createCache({ key: "css" });

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <StoreProvider>
          <Component {...pageProps} />
          <PayPalScriptProvider deferLoading={true}></PayPalScriptProvider>
        </StoreProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;
