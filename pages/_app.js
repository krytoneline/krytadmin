import Layout from "@/components/layouts";
import Loader from "@/components/loader";
import Toaster from "@/components/toaster";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

import { ni18nConfig } from "@/ni18n.config";
import CountryLanguage from 'country-language';
// import { getCountryLanguages } from "@ladjs/country-language";
import { useTranslation } from "react-i18next";
import { appWithI18Next } from "ni18n";
import getip from "@/services/myip";
import Head from "next/head";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export const userContext = createContext();
export const languageConstext = createContext();

function App({ Component, pageProps }) {


  const [globallang, setgloballang] = useState("en");
  const { i18n } = useTranslation();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });
  const router = useRouter();
  useEffect(() => {
    setToast(toast);
    if (!!toast.message) {
      setTimeout(() => {
        setToast({ type: "", message: "" });
      }, 5000);
    }
  }, [toast]);

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    const user = localStorage.getItem("userDetail");
    console.log("drfdtftfyfgyhftgytgfygf", user);
    if (user) {
      setUser(JSON.parse(user));
      // if (JSON.parse(user)?.id === "6450e9bef4d2cc08c2ec0431") {
      //   router.push("/festaevent");
      // } else {
      // router.push("/");
      // }
    } else {
      if (router.route !== "/login" && router.route !== "/signup") {
        router.push("/login");
      }
    }

    // let country = ['IN', 'FR']

    // if (!country.includes(myip.country)) {
    //   router.replace("/error");
    //   // alert('This web is not available in your country')
    // }

    const myip = await getip();
    console.log("myip==============> data ::", myip);
    CountryLanguage.getCountryLanguages(
      myip.country,
      async function (err, languages) {
        if (err) {
          console.log(err);
        } else {
          console.log("language-------------------------->", languages);
          let l = {}
          if (languages.length > 0) {
            const supportedLngs = ["en", "es", "de", "el", "fr"];
            l = languages.find((f) => supportedLngs.includes(f.iso639_1));
            console.log("l-------------------------->", l);
            if (l?.iso639_1) localStorage.setItem("LANGUAGE", l.iso639_1);

          }
          const iplang = localStorage.getItem("LANGUAGE");
          console.log("iplang", iplang);
          if (iplang) {
            i18n.changeLanguage(iplang);
            setgloballang(iplang)
          } else {
            // if (l?.iso639_1) {
            //   i18n.changeLanguage(l.iso639_1);
            //   setgloballang(l.iso639_1)
            // }
            // if (l?.iso639_1) {
            i18n.changeLanguage('en');
            setgloballang('en')
            // }

          }
        }
      }
    );
  };

  return (
    <>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPALPAYMENT, currency: "EUR" }}>
        <Head>
          <link rel="icon" href="/icons/logo.png" type="image/png" sizes="36x36" />
        </Head>

        <languageConstext.Provider value={[globallang, setgloballang]}>
          <userContext.Provider value={[user, setUser]}>
            <Loader open={open} />
            <div className="fixed right-5 top-20 min-w-max z-50">
              {!!toast.message && (
                <Toaster type={toast.type} message={toast.message} />
              )}
            </div>
            <Layout loader={setOpen} toaster={setToast}>
              <Loader open={open} />
              <div className="fixed right-5 top-20 min-w-max">
                {!!toast.message && (
                  <Toaster type={toast.type} message={toast.message} />
                )}
              </div>
              {user && <Component
                {...pageProps}
                loader={setOpen}
                toaster={setToast}
                user={user}
              />}
            </Layout>
          </userContext.Provider>
        </languageConstext.Provider>
      </PayPalScriptProvider>
    </>
  )
}

export default appWithI18Next(App, ni18nConfig)