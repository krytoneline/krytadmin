import { userContext } from "@/pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiSignOutFill } from "react-icons/pi";


import { useTranslation } from "react-i18next";
import { useSyncLanguage } from "ni18n";
import { languageConstext } from "@/pages/_app";
// import { useTranslation } from "react-i18next";

const Navbar = ({ setOpenTab, openTab }) => {
  const [globallang, setgloballang] = useContext(languageConstext);
  console.log("language ::", globallang);

  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [lang, setLang] = useState(null);
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  useSyncLanguage(lang);
  console.log(lang);

  const handleClick = (langauage) => {
    try {
      setLang(langauage);
      const languageData = langauage || "en"
      console.log(languageData);
      i18n.changeLanguage(languageData);
      setgloballang(languageData);
      localStorage.setItem("LANGUAGE", languageData);
    } catch (error) {
      console.log("language error ::", error);

    }
  };


  useEffect(() => {
    // const iplang = localStorage.getItem("LANGUAGE");
    // console.log('iplang',iplang)
    if (globallang) {
      setLang(globallang);
      console.log("globallang", globallang);
    }
  }, [globallang]);

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
    // event.currentTarget.className = "error";
  };

  return (
    <nav className="w-full  z-20 text-white rounded-b-[30px] sticky top-0 max-w-screen">
      <div className="w-full py-1 px-5 flex items-center justify-between">
        {/* shadow-2xl */}
        <div className="md:hidden bg-white p-1 rounded">
          {/* w-14 */}
          <img
            className="w-[182px] h-[44px] object-contain"
            src="/icons/main-logo.png"
            alt=""
          />
        </div>
        {user?.token && (
          <div className=" w-full md:flex items-center gap-3 hidden  justify-between  cursor-pointer">
            <div className="flex items-center gap-3  cursor-pointer">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={user?.profile || "/userprofile.png"}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={imageOnError}
                />
              </div>
              <div className="flex flex-col text-left justify-center p-0">
                <p className="text-lg font-semibold">
                  {t(user?.username)}
                  {/* test */}
                </p>
              </div>
            </div>

            <div className="ml-auto bg-custom-red border border-white px-5 py-2 rounded-md">
              <select
                className="bg-custom-red text-white cursor-pointer outline-none"
                value={lang}
                onChange={(e) => handleClick(e.target.value)}>

                <option value={"en"} >English</option>
                <option value={"fr"} >French</option>
                {/* <option>Greek</option>
                    <option>Spanish</option> */}
              </select>
            </div>


            {user?.token ? (
              <div
                className="p-3 flex gap-2 items-center cursor-pointer"
                onClick={logOut}
              >
                <p>{t("SignOut")}</p>
                <div className="p-2 bg-white rounded-full">
                  <PiSignOutFill className="text-3xl text-black" />
                </div>
              </div>
            ) : (
              <Link href={"/login"}>
                <div className="p-3 items-center">
                  <p>{t("LogIn")}</p>
                </div>
              </Link>
            )}
          </div>
        )}
        <div className="md:hidden">
          <GiHamburgerMenu
            className="text-2xl "
            onClick={() => setOpenTab(!openTab)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
