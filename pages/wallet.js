import React, { useState, useEffect, useMemo, useContext } from "react";
import Table, { indexID } from "@/components/table";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import ActivityList from "@/components/activityList";
import { RxCrossCircled } from "react-icons/rx";
import { userContext } from "./_app";
import { useTranslation } from "react-i18next";

function Wallet(props) {
  const router = useRouter();
  const [userRquestList, setUserRquestList] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [viewRquest, setViewRquest] = useState(false);
  const [addRquestData, setAddRquestData] = useState({
    amount: "",
    note: "",
  });
  const [user, setUser] = useContext(userContext);
  const { t } = useTranslation();

  useEffect(() => {
    getOrderBySeller();
    getProfile();
  }, []);

  const getOrderBySeller = async () => {
    props.loader(true);
    Api("get", "getTransaction", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setUserRquestList(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const getProfile = async () => {
    props.loader(true);
    Api("get", "getProfile", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setProfileData(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  function name({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal text-center">
          {value}
        </p>
      </div>
    );
  }

  function email({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal text-center">
          {value}
        </p>
      </div>
    );
  }

  function date({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal text-center">
          {moment(value).format("DD MMM YYYY")}
        </p>
      </div>
    );
  }

  function mobile({ value }) {
    return (
      <div>
        <p className="text-custom-black text-base font-normal text-center">
          {value}
        </p>
      </div>
    );
  }

  const info = ({ value, row }) => {
    //console.log(row.original._id)
    return (
      <div className=" p-4  flex items-center  justify-center">
        <button
          className="h-[38px] w-[93px] bg-[#00000020] text-black text-base	font-normal rounded-[8px]"
          onClick={() => {
            // setOpenCart(true)
            // setCartData(row.original)
          }}
        >
          See
        </button>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        // accessor: "_id",
        Cell: indexID,
      },
      {
        Header: "NAME",
        accessor: "user.username",
        Cell: name,
      },
      {
        Header: "E-mail",
        accessor: "user.email",
        Cell: email,
      },
      {
        Header: "DATE",
        accessor: "user.createdAt",
        Cell: date,
      },
      {
        Header: "Mobile",
        accessor: "user.number",
        Cell: mobile,
      },
      {
        Header: "See Details",
        // accessor: "view",
        Cell: info,
      },
    ],
    [],
  );

  const submit = async (e) => {
    e.preventDefault();
    props.loader(true);
    Api("post", "createWalletRequest", addRquestData, router).then(
      (res) => {
        props.loader(false);
        console.log("res================> category ", res);
        if (res.success) {
          setAddRquestData({
            amount: "",
            note: "",
          });
          setViewRquest(false);
          // router.push("/products");
          props.toaster({ type: "success", message: res.data?.message });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  return (
    <section className="w-full h-full bg-transparent md:pt-6 pt-3 pb-5 px-4 md:px-6">
      {/* Title */}
      <p className="text-white font-bold md:text-[32px] text-2xl">
        {t("Wallet")}
      </p>

      <div className="md:pb-32 pb-24 h-full overflow-y-auto md:mt-8 mt-4 space-y-5">
        {/* Wallet Card (Seller) */}
        {user?.type === "SELLER" && (
          <div className="bg-customGray rounded-xl shadow-lg p-4 md:p-6">
            {/* Balance */}
            <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
              <p className="font-semibold md:text-lg text-base text-white">
                {t("Wallet Balance")}
              </p>
              <p className="text-white md:text-xl text-lg font-bold">
                €{profileData?.wallet}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3">
              <button
                className="h-[40px] w-full md:w-[180px] bg-custom-red text-white text-sm md:text-base rounded-lg"
                onClick={() => setViewRquest(true)}
              >
                {t("Withdrawal Request")}
              </button>

              <button
                className="h-[40px] w-full md:w-[180px] bg-custom-red text-white text-sm md:text-base rounded-lg"
                onClick={() => router.push("/my-request")}
              >
                {t("My Request")}
              </button>
            </div>
          </div>
        )}

        {/* Transaction Header */}
        <div className="flex justify-between items-center">
          <p className="font-bold md:text-lg text-sm text-black">
            {t("Transaction History")}
          </p>

          {user?.type === "ADMIN" && (
            <button
              className="h-[38px] md:w-[160px] w-[100px] bg-custom-red text-white text-sm md:text-base rounded-lg"
              onClick={() => router.push("/my-request")}
            >
              {t("All Request")}
            </button>
          )}
        </div>

        {/* Popup */}
        {viewRquest && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
              {/* Close */}
              <div
                className="absolute top-3 right-3 w-8 h-8 cursor-pointer text-gray-700"
                onClick={() => setViewRquest(false)}
              >
                <RxCrossCircled className="w-full h-full" />
              </div>

              <div className="px-6 py-8">
                <form className="w-full space-y-4" onSubmit={submit}>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("Request for money")}
                    </p>
                    <input
                      type="number"
                      className="w-full h-[42px] px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-300"
                      placeholder="Enter amount"
                      value={addRquestData.amount}
                      onChange={(e) =>
                        setAddRquestData({
                          ...addRquestData,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t("Note")}</p>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-300"
                      placeholder="Write note..."
                      value={addRquestData.note}
                      onChange={(e) =>
                        setAddRquestData({
                          ...addRquestData,
                          note: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    className="bg-custom-red h-[44px] w-full rounded-lg text-white text-base font-medium"
                    type="submit"
                  >
                    {t("Submit")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Activity List */}
        <div className="space-y-3">
          {userRquestList.map((item, i) => (
            <ActivityList {...props} data={item} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Wallet;
