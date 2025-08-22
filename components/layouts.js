/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";
import { userContext } from "@/pages/_app";

const Layout = ({ children, loader, toaster }) => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false)
  const [user, setUser] = useContext(userContext);

  return (
    <div className="h-screen max-w-screen bg-custom-lightGray">

      <div className="md:h-[20vh] h-[15vh] w-full bg-custom-red"
      // style={{
      //   backgroundImage: `url("/headerBackground.png")`,
      //   backgroundSize: "cover",
      // }}
      >

        <div className="max-w-screen flex  relative ">
          {
            !(router.pathname.includes('/login') || router.pathname.includes('/signup') ||
              router.pathname.includes('/privacy-policy') ||
              router.pathname.includes('/error') ||
              router.pathname.includes('/terms-condition')) &&
            <>
              {(user?.type === "ADMIN" || (user?.type === "SELLER" && (user?.subscription?.expiry_date && (user?.subscription?.expiry_date && new Date() < new Date(user?.subscription?.expiry_date))))) &&
                <SidePannel setOpenTab={setOpenTab} openTab={openTab} />
              }
            </>
          }
          <div className={
            !(router.pathname.includes('/login') || router.pathname.includes('/signup') ||
              router.pathname.includes('/privacy-policy') ||
              router.pathname.includes('/error') ||
              router.pathname.includes('/terms-condition')

            ) && ((user?.type === "ADMIN" || (user?.type === "SELLER" && (user?.subscription?.expiry_date && new Date() < new Date(user?.subscription?.expiry_date))
            ))) ? "w-full xl:pl-[300px] md:pl-[250px] sm:pl-[200px]" : "w-full"}>
            <main className={"w-full h-screen relative overflow-hidden"}>
              {
                !(router.pathname.includes('/login') || router.pathname.includes('/signup') ||
                  router.pathname.includes('/privacy-policy') ||
                  router.pathname.includes('/error') ||
                  router.pathname.includes('/terms-condition')) &&
                <Navbar setOpenTab={setOpenTab} openTab={openTab} />
              }
              {children}
            </main>
          </div>
          {/* <div className="w-full xl:pl-[300px] md:pl-[250px] sm:pl-[200px]">
            <main className={"w-full min-h-screen relative overflow-hidden z-90"}>
              {
                !(router.pathname.includes('/login') || router.pathname.includes('/signup') ||
                  router.pathname.includes('/privacy-policy') ||
                  router.pathname.includes('/terms-condition')) &&
                <Navbar setOpenTab={setOpenTab} openTab={openTab} />
              }
            </main>
          </div> */}
        </div>
      </div>
      {/* <div className="w-full xl:pl-[300px] md:pl-[250px] sm:pl-[200px] ">
            <main className={"w-full min-h-screen relative overflow-hidden md:pt-[70px] z-0"}>
              {children}
            </main>
          </div> */}

    </div>
  );
};

export default Layout;
