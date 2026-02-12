import React, { useMemo, useState, useEffect, useContext } from "react";
import Table from "@/components/table";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { userContext } from "./_app";
import isAuth from "@/components/isAuth";
import { FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";

function Products(props) {
  const router = useRouter();
  const [productsList, setProductsList] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [selectedNewSeller, setSelectedNewSeller] = useState([]);
  const [popupData, setPopupData] = useState({});
  const [viewPopup, setviewPopup] = useState(false);
  const { t } = useTranslation();



  useEffect(() => {
    if (user?._id) {
      getProduct();
    }
  }, [user]);

  const getProduct = async () => {
    props.loader(true);
    let url;
    if (user?.type === "ADMIN") {
      url = "getProduct";
    } else if (user?.type === "SELLER") {
      url = `getProduct?seller_id=${user?._id}`;
    }
    // `getProduct?seller_id=${user?._id}`
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        if (res.status) {
          console.log("res================>", res);
          setProductsList(res.data);
          const selectednewIds = res.data.map((f) => {
            if (f.sponsered && f._id) return f._id;
          });
          console.log(selectednewIds);
          setSelectedNewSeller(selectednewIds);
        }

      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const deleteProduct = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text:
        "You want to proceed with the deletion? change this to You want to proceed with the delete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(function (result) {
      if (result.isConfirmed) {
        const data = {
          _id,
        };

        props.loader(true);
        Api("delete", `deleteProduct/${_id}`, data, router).then(
          (res) => {
            console.log("res================>", res.data?.meaasge);
            props.loader(false);

            if (res?.status) {
              getProduct();
              props.toaster({ type: "success", message: res.data?.meaasge });
            } else {
              console.log(res?.data?.message);
              props.toaster({ type: "error", message: res?.data?.meaasge });
            }
          },
          (err) => {
            props.loader(false);
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.meaasge });
            props.toaster({ type: "error", message: err?.meaasge });
          }
        );
      } else if (result.isDenied) {
        // setFullUserDetail({})
      }
    });
  };

  const addNewItem = async () => {
    const { _id, sponsered, is_verified, is_quality } = popupData;
    const data = {
      sponsered,
      is_verified,
      is_quality,
      id: _id,
    };
    props.loader(true);
    Api("post", "updateProduct", data, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res.status) {
          props.toaster({
            type: "success",
            message: "Item updated successfully",
          });
          setPopupData({});
          setviewPopup(false);
          getProduct();
          // if (sponsered) {
          //     props.toaster({ type: "success", message: 'Item added successfully in sponsore items' });
          // } else {
          //     props.toaster({ type: "success", message: 'Item removed successfully from sponsore items' });
          // }
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const image = ({ value, row }) => {
    console.log(row.original);
    return (
      <div className="p-4 flex items-center justify-center">
        {row.original &&
          row.original.varients &&
          row.original.varients.length > 0 && (
            <img
              className="h-[76px] w-[76px] rounded-[10px] object-contain"
              src={row.original.varients[0].image[0]}
            />
          )}
      </div>
    );
  };

  const productName = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const category = ({ row, value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const price = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const bestSeller = ({ value, row }) => {
    return (
      <div className="p-4 flex items-center justify-center">
        <input
          className="h-5 w-5 text-black"
          type="checkbox"
          checked={selectedNewSeller.includes(row?.original?._id)}
          onChange={(e) => {
            console.log(e);
            console.log(selectedNewSeller);
            if (!selectedNewSeller.includes(row?.original?._id)) {
              selectedNewSeller.push(row?.original?._id);
              setSelectedNewSeller([...selectedNewSeller]);
              addNewItem(row?.original?._id, true);
            } else {
              const newData = selectedNewSeller.filter(
                (f) => f !== row?.original?._id
              );
              console.log(newData);
              setSelectedNewSeller(newData);
              addNewItem(row?.original?._id, false);
            }
          }}
        />
      </div>
    );
  };

  const piece = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-custom-black text-sm font-semibold">63</p>
      </div>
    );
  };

  const availableColor = ({ value }) => {
    return (
      <div className="p-4 flex  items-center justify-center gap-2">
        {value.map((item, i) => (
          <p
            key={i}
            className=" text-base font-normal  rounded-full h-5 w-5 border border-black"
            style={{ background: item?.color }}
          ></p>
        ))}
      </div>
    );
  };

  const actionHandler = ({ value, row }) => {
    return (
      <div className="bg-custom-offWhiteColor flex items-center  justify-evenly  border border-custom-offWhite rounded-[10px] mr-[10px]">
        <div
          className="py-[10px] w-[50%] items-center flex justify-center cursor-pointer"
          onClick={() => {
            router.push(`add-product?id=${row.original._id}`);
          }}
        >
          <FiEdit className="text-[22px]  " />
        </div>
        <div className="py-[10px] border-l-[1px] border-custom-offWhite w-[50%] items-center flex justify-center">
          <RiDeleteBinLine
            className="text-[red] text-[24px] cursor-pointer"
            onClick={() => deleteProduct(row.original._id)}
          />
        </div>
        <div className="py-[10px] border-l-[1px] border-custom-offWhite w-[50%] items-center flex justify-center">
          <FaEye
            className="text-black text-[24px] cursor-pointer"
            onClick={() => {
              setPopupData(row.original);
              setviewPopup(true);
            }}
          />
        </div>
      </div>
    );
  };

  const actionHandler2 = ({ value, row }) => {
    return (
      <div className="bg-custom-offWhiteColor flex items-center  justify-evenly  border border-custom-offWhite rounded-[10px] mr-[10px]">
        <div
          className="py-[10px] w-[50%] items-center flex justify-center cursor-pointer"
          onClick={() => {
            router.push(`add-product?id=${row.original._id}`);
          }}
        >
          <FiEdit className="text-[22px]  " />
        </div>
        <div className="py-[10px] border-l-[1px] border-custom-offWhite w-[50%] items-center flex justify-center">
          <RiDeleteBinLine
            className="text-[red] text-[24px] cursor-pointer"
            onClick={() => deleteProduct(row.original._id)}
          />
        </div>
        <div className="py-[10px] border-l-[1px] border-custom-offWhite w-[50%] items-center flex justify-center">
          <FaEye
            className="text-black text-[24px] cursor-pointer"
            onClick={() => {
              setPopupData(row.original);
              setviewPopup(true);
            }}
          />
        </div>
      </div>
    );
  };

  const columns3 = useMemo(
    () => [
      {
        Header: t("image"),
        accessor: "username",
        Cell: image,
      },
      {
        Header: t("productname"),
        accessor: "name",
        Cell: productName,
      },
      {
        Header: t("category"),
        accessor: "categoryName",
        Cell: category,
      },
      {
        Header: t("price"),
        accessor: "price",
        Cell: price,
      },
      {
        Header: t("availableColor"),
        accessor: "varients",
        Cell: availableColor,
      },
      {
        Header: t("action"),
        Cell: actionHandler,
      },
    ]
    [selectedNewSeller, t]
  );

  const columns1 = useMemo(
    () => [
      {
        Header: t("image"),
        accessor: "username",
        Cell: image,
      },
      {
        Header: t("productname"),
        accessor: "name",
        Cell: productName,
      },
      {
        Header: t("category"),
        accessor: "categoryName",
        Cell: category,
      },
      {
        Header: t("price"),
        accessor: "offer",
        Cell: price,
      },
      {
        Header: t("availableColor"),
        accessor: "varients",
        Cell: availableColor,
      },
      {
        Header: t("action"),
        Cell: user?.type === "SELLER" ? actionHandler : actionHandler2,
      },
    ],
    [selectedNewSeller, t]
  );

  return (
    <div className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 ">
      {/* pb-[120px] */}
      {viewPopup && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
          <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
            <div
              className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
              onClick={() => setviewPopup(!viewPopup)}
            >
              <RxCrossCircled className="h-full w-full font-semibold " />
            </div>

            <div className="md:px-5 py-10">
              <div className=" w-full flex gap-2 pb-5">
                <img
                  src={popupData?.varients[0].image[0]}
                  className="h-[76px] w-[76px] rounded-[10px]"
                />
                <div className="col-span-2 w-full flex flex-col justify-start items-start">
                  <p className="text-base font-bold text-custom-black">
                    {popupData?.name}
                  </p>
                  <p className="text-base font-semibold text-custom-newBlack pt-2">
                    {popupData?.email}
                  </p>
                  <p className="text-sm font-semibold text-custom-black pt-2">
                    {popupData?.number}
                  </p>
                </div>
              </div>

              {user?.type === "ADMIN" && (
                <FormGroup>
                  <FormControlLabel
                    className="!text-black"
                    control={
                      <Checkbox
                        checked={popupData?.sponsered}
                        onChange={(e, sponsered) => {
                          setPopupData({ ...popupData, sponsered });
                        }}
                      />
                    }
                    label="is sponsered?"
                  />
                  <FormControlLabel
                    className="!text-black"
                    control={
                      <Checkbox
                        checked={popupData?.is_verified}
                        onChange={(e, is_verified) => {
                          setPopupData({ ...popupData, is_verified });
                        }}
                      />
                    }
                    label="is verified?"
                  />
                  <FormControlLabel
                    className="!text-black"
                    control={
                      <Checkbox
                        checked={popupData?.is_quality}
                        onChange={(e, is_quality) => {
                          setPopupData({ ...popupData, is_quality });
                        }}
                      />
                    }
                    label="is quality?"
                  />
                </FormGroup>
              )}

              {user?.type === "SELLER" && (
                <FormGroup>
                  <FormControlLabel
                    className="!text-black"
                    control={
                      <Checkbox
                        checked={popupData?.sponsered}
                        onChange={(e, sponsered) => {
                          setPopupData({ ...popupData, sponsered });
                        }}
                      />
                    }
                    label="is sponsered?"
                  />
                  {/* <FormControlLabel className='!text-black' control={<Checkbox checked={popupData?.is_verified} onChange={(e, is_verified) => { setPopupData({ ...popupData, is_verified }) }} />} label="is verified?" /> */}
                  {/* <FormControlLabel className='!text-black' control={<Checkbox checked={popupData?.is_quality} onChange={(e, is_quality) => { setPopupData({ ...popupData, is_quality }) }} />} label="is quality?" /> */}
                </FormGroup>
              )}

              <div className="flex flex-row justify-start items-start pt-5 gap-5">
                <button
                  className="text-white text-lg font-bold w-full h-[50px] rounded-[12px] bg-custom-red"
                  onClick={() => {
                    addNewItem();
                  }}
                >
                  Submit
                </button>
                {/* <button className='text-white text-lg font-bold w-full h-[50px] rounded-[12px] bg-custom-lightRed'>Cancel</button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:pt-[0px] pt-[0px] h-full">
        <p className="text-white font-bold md:text-[32px] text-2xl md:pb-0 pb-3">
          {t("AllProduct")}
        </p>

        <div className="bg-white h-full pt-5 md:pb-32 pb-28  md:px-5  rounded-[12px] overflow-scroll md:mt-9 mt-5">
          {/* md:mr-[10px]  shadow-2xl*/}
          {productsList?.length > 0 && <div className="">
            <Table
              columns={user?.type === "SELLER" ? columns1 : columns1}
              data={productsList}
            />
          </div>}
          {productsList?.length === 0 && (
            <div className="h-[500px] flex justify-center items-center">
              <p className="text-2xl text-black font-normal text-center">
                {t("NoProducts")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default isAuth(Products);
