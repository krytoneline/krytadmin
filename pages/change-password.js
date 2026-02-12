import { Api } from "@/services/service";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { AiFillLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function ChangePassword(props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();

  const Submit = () => {
    if (password === "") {
      props.toaster({ type: "error", message: "New Password is required" });
      return;
    }

    if (confirmPassword === "") {
      props.toaster({ type: "error", message: "Confirm Password is required" });
      return;
    }

    if (confirmPassword !== password) {
      props.toaster({
        type: "error",
        message: "Your password is not matched with confirm password",
      });
      return;
    }

    const data = {
      password,
    };
    Api("post", "profile/changePassword", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setPassword("");
          setConfirmPassword("");
          props.toaster({ type: "success", message: res?.data?.message });
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  return (
    <>
      <div className="w-full h-full bg-transparent md:pt-6 pt-3 pb-5 px-4 md:px-6">
        {/* Page Title */}
        <p className="text-white font-bold md:text-[32px] text-2xl">
          {t("Change Password")}
        </p>

        <section className="bg-white h-full rounded-xl shadow-md md:mt-8 mt-4 p-5 overflow-y-auto">
          <div className="w-full mx-auto max-w-md">
            {/* Heading */}
            <p className="text-black text-2xl md:text-3xl font-bold text-center mb-6">
              {t("Change Password")}
            </p>

            {/* Form */}
            <div className="space-y-4">
              {/* New Password */}
              <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black">
                <AiFillLock className="text-gray-500 h-5 w-5" />

                <input
                  placeholder={t("New Password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-2 text-black text-sm md:text-base outline-none bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div
                  className="cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black">
                <AiFillLock className="text-gray-500 h-5 w-5" />

                <input
                  placeholder={t("Confirm Password")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-2 text-black text-sm md:text-base outline-none bg-transparent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div
                  className="cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={Submit}
                type="button"
                className="w-full bg-black text-white py-3 rounded-lg text-base md:text-lg font-semibold hover:opacity-90 transition"
              >
                {t("Submit")}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* <div className="w-full flex items-center md:my-10 my-5 justify-center px-2 md:px-0">
                <div className="h-full w-full flex flex-col justify-center items-end">
                    <div className="w-full mx-auto max-w-2xl h-full">
                        <div className="flex w-full items-center justify-center h-full">
                            <div className="flex w-full px-3 flex-col justify-center items-center md:px-7 shadow-xl  border rounded-xl  ">
                                <p className="text-black text-3xl font-bold my-5">Change Password</p>
                                <div className="mb-3 block flex-col md:flex w-full justify-start ">
                                    <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange ">
                                        <AiFillLock className=" text-custom-gray h-5 w-5 ml-2" />
                                        <input
                                            placeholder="New Password"
                                            type="password"
                                            className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                                            value={password}
                                            onChange={(text) => {
                                                setPassword(text.target.value);
                                            }}
                                        />
                                    </div>

                                    <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange mt-4">
                                        <AiFillLock className=" text-custom-gray h-5 w-5 ml-2" />
                                        <input
                                            placeholder="Confirm Password"
                                            type="password"
                                            className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                                            value={confirmPassword}
                                            onChange={(text) => {
                                                setConfirmPassword(text.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center w-full items-center sm:my-5 my-2">
                                    <button
                                        onClick={Submit}
                                        type="button"
                                        className="text-white bg-black  sm:py-5 py-2 w-full rounded-2xl text-xl"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
    </>
  );
}

export default ChangePassword;
