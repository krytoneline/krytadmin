import isAuth from '@/components/isAuth';
import React, { useMemo, useState, useEffect, useContext } from "react";
import Table, { indexID } from '@/components/table';
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import moment from "moment";
import { userContext } from "./_app";
import { useTranslation } from 'react-i18next';

function pricemanagement(props) {

  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [plandata, setplandata] = useState([]);
  const { t } = useTranslation();
  const [data, setData] = useState({
    plantype: "",
    price: "",
    month: "",
    // device: "",
    currency: "",
    // is_best: "",
    extra_feature: [{ key: "" }],
  });

  const actionHandler = ({ row }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
      <>
        <div className="p-4 flex items-center justify-center">
          <button
            className="h-[38px] w-[89px] bg-custom-red text-white font-normal Poppins"
            onClick={() => {
              setData({
                ...row.original,
                extra_feature:
                  row?.original?.extra_feature?.length > 0
                    ? row?.original?.extra_feature
                    : [{ key: "" }],
              });
            }}
          >
            {t("edit")}
          </button>

          <button
            className="h-[38px] w-[89px] bg-custom-orange border px-5 py-1 text-white bg-custom-lightRedColor font-normal Poppins ml-[20px]"
            onClick={() => setConfirmDelete(true)}
          >
            {t("delete")}
          </button>
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

            <div className="bg-white p-6 shadow-lg rounded-lg z-10">
              <p className="text-black text-center mb-4">
                Are you sure you want to delete this plan?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-custom-orange bg-custom-lightRedColor text-white px-4 py-2 rounded"
                  onClick={() => {
                    deleteProduct(row.original._id);
                    setConfirmDelete(false);
                  }}
                >
                  {t("delete")}
                </button>
                <button
                  className="bg-custom-red text-white px-4 py-2 rounded"
                  onClick={() => setConfirmDelete(false)}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    getplan();
  }, []);
  const getplan = async () => {
    props.loader(true);
    Api("get", "getallplan", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setplandata(res.data);
        // setmainList(res.data)
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const deleteProduct = (id) => {
    props.loader(true);

    Api("delete", `/deleteplan/${id}`, null, router)
      .then((response) => {
        console.log("Product deleted successfully:", response);

        props.loader(false);
        getplan();

        props.toaster({
          type: "success",
          message: "Plan deleted successfully!",
        });
      })
      .catch((error) => {
        console.error(
          "Error deleting product:",
          error.response || error.message || error
        );

        props.loader(false);
        props.toaster({
          type: "error",
          message: "Failed to delete the product.",
        });
      });
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(data);

    let method = "post";
    let url = "/postplan";

    if (data._id) {
      url = `/updateplan/${data._id}`;
      method = "put";
    }

    // if (
    //   !data.plantype &&
    //   !data.currency &&
    //   !data.price &&
    //   !data.month &&
    //   !data.device &&
    //   !data.is_best
    // ) {
    //   props.toaster({
    //     type: "error",
    //     message: "All fields are required. Please fill out the form.",
    //   });
    //   return;
    // }

    // if (!data.is_best) {
    //   props.toaster({ type: "error", message: "Best seller is required" });
    //   return;
    // } else if (data.is_best === "true") {
    //   data.is_best = true;
    //   props.toaster({ type: "success", message: "Best seller added" });
    // } else if (data.is_best === "false") {
    //   data.is_best = false;
    //   props.toaster({ type: "info", message: "Best seller not selected" });
    // }

    // if (!data.plantype) {
    //   props.toaster({ type: "error", message: "Plan is required" });
    //   return;
    // }

    // if (!data.currency) {
    //   props.toaster({ type: "error", message: "Currency is required" });
    //   return;
    // }

    // if (!data.price) {
    //   props.toaster({ type: "error", message: "Price is required" });
    //   return;
    // }

    // if (!data.month) {
    //   props.toaster({ type: "error", message: "Month is required" });
    //   return;
    // }

    // if (!data.device) {
    //   props.toaster({ type: "error", message: "Device is required" });
    //   return;
    // }

    Api(method, url, data, router)
      .then(
        (res) => {
          console.log("Post service", res);

          setData({
            plantype: "",
            price: "",
            month: "",
            // device: "",
            currency: "",
            // is_best: "",
            extra_feature: [{ key: "" }],
          });

          getplan();

          props.toaster({
            type: "success",
            message: `Plan successfully ${data._id ? 'updated' : 'added'}`,
          });
        },
        (err) => {
          console.error(err);
          props.loader(false);
          props.toaster({ type: "error", message: err?.message });
        }
      )
      .catch((error) => {
        console.error("Unexpected error:", error);
        props.toaster({ type: "error", message: "Something went wrong" });
      });
  };

  function studentName({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  const columns = useMemo(
    () => [
      {
        Header: t("no"),
        Cell: indexID,
      },
      {
        Header: t("plan"),
        accessor: "plantype",
        Cell: studentName,
      },
      {
        Header: t("currency"),
        accessor: "currency",
        Cell: studentName,
      },
      {
        Header: t("price"),
        accessor: "price",
        Cell: studentName,
      },
      {
        Header: t("month"),
        accessor: "month",
        Cell: studentName,
      },
      {
        Header: t("device"),
        accessor: "device",
        Cell: studentName,
      },
      {
        Header: t("action"),
        accessor: "more",
        Cell: actionHandler,
      },
    ],
    [t]
  );

  return (
    <section className="w-full h-full  bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
      <div className="md:pt-[0px] pt-[0px] h-full overflow-scroll no-scrollbar">
        <p className="text-white font-bold md:text-[32px] text-2xl md:pb-0 pb-3">
          {t("price_management")}
        </p>

        <div className="bg-white min-h-screen py-10 mt-11 px-5   overflow-scroll">
          <form className="w-full rounded-[10px] border-custom-red border-[1px] p-5" onSubmit={submit}>
            {/* mt-5 */}
            <div className='flex md:flex-row flex-col justify-start items-center md:gap-10 md:mb-5 mb-3'>
              <p className="text-md md:text-[24px] font-bold text-black md:w-[300px] w-full">
                {t("subscription_name")}
              </p>
              {/* <select
                className="h-[40px] md:w-[320px] w-full text-black  border-custom-lightRedColor border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                value={data.plantype}
                onChange={(e) => {
                  setData({ ...data, plantype: e.target.value });
                }}
              >
                <option value="">Select Type of subscription</option>
                <option value="Basic Individual Plan">
                  Basic Individual Plan
                </option>
                <option value="Premium Individual Plan">
                  Premium Individual Plan
                </option>
                <option value="Educational School Plan">
                  Educational School Plan
                </option>
              </select> */}
              <input
                className="h-[40px] md:w-[320px] w-full border-custom-red text-black  border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                placeholder={t("Subscription name")}
                value={data.plantype}
                onChange={(e) => {
                  setData({ ...data, plantype: e.target.value });
                }}
                required
              />
            </div>

            <div className='flex md:flex-row flex-col justify-start items-center md:gap-10 md:mb-5 mb-3'>
              <p className="md:text-[24px] text-md font-bold text-black md:w-[300px] w-full">
                {t("currency")}
              </p>
              <select
                className="h-[40px] md:w-[320px] w-full text-black border-custom-red border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                value={data.currency}
                onChange={(e) => {
                  setData({ ...data, currency: e.target.value });
                }}
                required
              >
                <option value="">{t("select_currency")}</option>
                <option value="€">€ (EURO)</option>
                <option value="£">£ (GBP)</option>
                <option value="$">$ (DOLLOR)</option>
              </select>
            </div>

            <div className='flex md:flex-row flex-col justify-start items-center md:gap-10 md:mb-5 mb-3'>
              <p className="md:text-[24px] text-md  font-bold text-black md:w-[300px] w-full">
                {t("price")}
              </p>
              <input
                className="h-[40px] md:w-[320px] w-full border-custom-red text-black  border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                placeholder={t("Price")}
                value={data.price}
                onChange={(e) => {
                  setData({ ...data, price: e.target.value });
                }}
                required
              ></input>
            </div>

            <div className='flex md:flex-row flex-col justify-start items-center md:gap-10 md:mb-0 mb-3'>
              <p className="md:text-[24px] text-md font-bold text-black md:w-[300px] w-full">
                {t("month")}
              </p>
              <div className="flex md:flex-row flex-col md:w-auto w-full">
                <input
                  className="h-[40px] md:w-[320px] w-full border-custom-red text-black  border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                  placeholder={t("Month")}
                  type="number"
                  min={1}
                  value={data.month}
                  onChange={(e) => {
                    const d = e.target.value;
                    console.log(d);
                    if ((d > 0 && d < 13) || d === "") {
                      setData({ ...data, month: d });
                    }
                  }}
                  required
                ></input>
                <p className="self-center md:ml-[10px] md:pt-0 pt-2">{t("(use 1 to 12 only)")}</p>
              </div>
            </div>

            {/* <div className='flex md:flex-row flex-col justify-start items-center md:gap-10 md:mb-0 mb-3'>
              <p className="md:text-[24px] text-md font-bold text-black md:w-[300px] w-full">
                Best Seller
              </p>
              <select
                className="h-[40px] md:w-[320px] w-full border-custom-lightRed  text-black border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                value={data.is_best}
                onChange={(e) => {
                  setData({ ...data, is_best: e.target.value });
                }}
              >
                <option value="">Select Best Seller</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div> */}

            <div className='flex md:flex-row flex-col justify-start  md:gap-10 md:-0 mb-0'>
              <p className="md:text-[24px] text-md font-bold text-black md:w-[300px] w-full md:mt-5">
                {t("extra_feature")}
              </p>
              <div className=''>
                {data.extra_feature.map((item, i) => (
                  <div
                    key={i}
                    className="md:my-[20px]  md:mx-0 flex flex-col gap-5 md:gap-0 md:flex-row"
                  >
                    <div className="flex justify-end items-center gap-3">
                      <span className="text-black">{i + 1}</span>
                      <input
                        className="h-[40px] md:w-[320px] w-full border-custom-red text-black border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                        placeholder={t("New Feature")}
                        type="text"
                        value={item.key}
                        onChange={(e) => {
                          console.log(e.target.value);
                          item.key = e.target.value;
                          console.log(item);
                          setData({ ...data });
                        }}
                        required
                      ></input>
                    </div>
                    <p
                      className="self-center  md:ml-[10px] bg-custom-red text-white p-2 rounded-md cursor-pointer text-center md:w-[150px] w-full"
                      onClick={() => {
                        const d = data.extra_feature.filter(
                          (f) => f.key !== item.key
                        );
                        console.log(d);
                        setData({ ...data, extra_feature: d });
                      }}
                    >
                      {t("remove_feature")}
                    </p>
                    {data.extra_feature.length === i + 1 && (
                      <p
                        className="self-center md:ml-[10px] bg-custom-red text-white p-2 rounded-md cursor-pointer text-center md:w-[150px] w-full"
                        onClick={() => {
                          data.extra_feature.push({ key: "" });
                          setData({ ...data });
                        }}
                      >
                        {t("add_more_feature")}
                      </p>
                    )}
                  </div>
                ))}
                <div>
                  <button
                    className="bg-custom-red text-white h-[47px] md:w-[144px] w-full rounded-[5px] text-xl font-normal flex justify-center items-center mt-5 md:mb-5" type="submit"
                  // onClick={() => submit()}
                  >
                    {data._id ? t("update") : t("submit")}
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="md:ml-20  flex flex-row ">
              <div className="my-[20px] mx-3 md:mx-0">
                <p className="text-md pt-2 md:pt-0 md:text-[24px] font-bold text-black my-[20px]">
                  Subscription type
                </p>
                <p className="md:text-[24px] text-md pt-2 md:pt-0 font-bold text-black my-[20px]">
                  Currency
                </p>
                <p className="md:text-[24px] text-md pt-6 md:pt-0 font-bold text-black my-[20px]">
                  Price
                </p>
                <p className="md:text-[24px] text-md pt-6 md:pt-0 font-bold text-black my-[20px]">
                  Month
                </p>
                <p className="md:text-[24px] text-md pt-5 md:pt-0 font-bold text-black my-[20px]">
                  Number of Device
                </p>
                <p className="md:text-[24px] text-md pt-12 md:pt-0 font-bold text-black my-[20px]">
                  Best Seller
                </p>
                <p className=" md:text-[24px] text-md pt-4 md:pt-0 font-bold text-black my-[20px]">
                  Extra Feature
                </p>
              </div>
              <div className="md:ml-[150px] my-[20px]">
                <div className="my-[20px] mx-3 md:mx-0">
                  <select
                    className="h-[40px] md:w-[320px] w-full text-black  border-custom-lightRedColor border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                    value={data.plantype}
                    onChange={(e) => {
                      setData({ ...data, plantype: e.target.value });
                    }}
                  >
                    <option value="">Select Type of subscription</option>
                    <option value="Basic Individual Plan">
                      Basic Individual Plan
                    </option>
                    <option value="Premium Individual Plan">
                      Premium Individual Plan
                    </option>
                    <option value="Educational School Plan">
                      Educational School Plan
                    </option>
                  </select>
                </div>
                <div className="my-[20px] mx-3 md:mx-0">
                  <select
                    className="h-[40px] md:w-[320px] w-full text-black border-custom-lightRed border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                    value={data.currency}
                    onChange={(e) => {
                      setData({ ...data, currency: e.target.value });
                    }}
                  >
                    <option value="">Select Currency Type</option>
                    <option value="€">€ (EURO)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="$">$ (DOLLOR)</option>
                  </select>
                </div>
                <div className="my-[20px] mx-3 md:mx-0">
                  <input
                    className="h-[40px] md:w-[320px] w-full border-custom-lightRed text-black  border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                    placeholder="Price"
                    value={data.price}
                    onChange={(e) => {
                      setData({ ...data, price: e.target.value });
                    }}
                  ></input>
                </div>
                <div className="my-[20px] mx-3 md:mx-0 flex">
                  <input
                    className="h-[40px] md:w-[320px] w-full border-custom-lightRed text-black  border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                    placeholder="Month"
                    type="number"
                    min={1}
                    value={data.month}
                    onChange={(e) => {
                      const d = e.target.value;
                      console.log(d);
                      if ((d > 0 && d < 13) || d === "") {
                        setData({ ...data, month: d });
                      }
                    }}
                  ></input>
                  <p className="self-center ml-[10px]">{"(use 1 to 12 only)"}</p>
                </div>
                <div className="my-[20px] mx-3 md:mx-0 flex flex-col md:flex-row">
                  <input
                    className="h-[40px] md:w-[320px] w-full border-custom-lightRed text-black border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                    placeholder="Number of Device"
                    type="number"
                    value={data.device}
                    onChange={(e) => {
                      setData({ ...data, device: e.target.value });
                    }}
                  ></input>
                  <p className="self-center ml-[10px]">
                    {"(use 0 for unlimited device)"}
                  </p>
                </div>
                <div className="my-[20px] mx-3 md:mx-0 ">
                  <select
                    className="h-[40px] md:w-[320px] w-full border-custom-lightRed  text-black border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                    value={data.is_best}
                    onChange={(e) => {
                      setData({ ...data, is_best: e.target.value });
                    }}
                  >
                    <option value="">Select Best Seller</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                {data.extra_feature.map((item, i) => (
                  <div
                    key={i}
                    className="my-[20px] mx-3 md:mx-0 flex flex-col gap-5 md:gap-0 md:flex-row"
                  >
                    <div className="flex justify-end items-center gap-3">
                      <span className="text-black">{i + 1}</span>
                      <input
                        className="h-[40px] md:w-[320px] w-full border-custom-lightRed text-black border-[1.5px] outline-none rounded-[5px] pl-[10px] md:mt-0 mt-2"
                        placeholder="New Feature"
                        type="text"
                        value={item.key}
                        onChange={(e) => {
                          console.log(e.target.value);
                          item.key = e.target.value;
                          console.log(item);
                          setData({ ...data });
                        }}
                      ></input>
                    </div>
                    <p
                      className="self-center  ml-[10px] bg-custom-darkGrayColor text-white p-2 rounded-md cursor-pointer"
                      onClick={() => {
                        const d = data.extra_feature.filter(
                          (f) => f.key !== item.key
                        );
                        console.log(d);
                        setData({ ...data, extra_feature: d });
                      }}
                    >
                      Remove Feature
                    </p>
                    {data.extra_feature.length === i + 1 && (
                      <p
                        className="self-center ml-[10px] bg-custom-darkGrayColor text-white p-2 rounded-md cursor-pointer"
                        onClick={() => {
                          data.extra_feature.push({ key: "" });
                          setData({ ...data });
                        }}
                      >
                        Add more Feature
                      </p>
                    )}
                  </div>
                ))}
                <div>
                  <button
                    className="bg-custom-darkGrayColor text-white md:ml-20 ml-12 h-[47px] w-[144px] rounded-[5px] text-xl font-normal flex justify-center items-center my-5"
                    onClick={() => submit()}
                  >
                    {data._id ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div> */}
          </form>
          <div className="py-5">
            <Table columns={columns} data={plandata} />
          </div>
        </div>

      </div>
    </section >
  );
}

export default isAuth(pricemanagement)