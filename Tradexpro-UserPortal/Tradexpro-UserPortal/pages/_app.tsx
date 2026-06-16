import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../state/store";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "/public/style/app.css";
import "/public/style/new-style.css";
import "/public/style/total.css";
import "/public/style/responsive.css";
import "/public/style/reactSelect.css";
import "../styles/nprogress.css";
import '../styles/globals.css';
import Layout from "layout/index";
import NProgress from "nprogress";
import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { checkDarkMode, rootThemeCheck } from "helpers/functions";
import { unlistenAllChannels } from "state/actions/exchange";
import BlankLayout from "layout/BlankLayout";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // rootThemeCheck();
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, []);
  useEffect(() => {
    Router.events.on("routeChangeStart", () => unlistenAllChannels());
  }, [router.pathname]);
  if (router.pathname === "/maintenance") {
    return (
      <>
        <Component {...pageProps} />
      </>
    );
  } else {
    return (
      <>
        <Provider store={store}>
          <BlankLayout>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </BlankLayout>
        </Provider>
      </>
    );
  }
}

export default MyApp;
