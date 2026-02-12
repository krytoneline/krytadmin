import React, { useContext, useMemo } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import moment from "moment";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "@/pages/_app";
import { useTranslation } from "react-i18next";

const RequestList = (props) => {
  console.log(props);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useContext(userContext);
  console.log(user);
  const { t } = useTranslation();

  const deleteProduct = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the deletion? change this to You want to proceed with the delete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(function (result) {
      if (result.isConfirmed) {
        const data = {
          request_id: _id,
        };

        props.loader(true);
        Api("post", `deleteWalletRequest`, data, router).then(
          (res) => {
            console.log("res================>", res.data?.meaasge);
            props.loader(false);

            if (res?.success) {
              props.getOrderBySeller();
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
          },
        );
      } else if (result.isDenied) {
        // setFullUserDetail({})
      }
    });
  };

  const updateWalletRequest = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the completion? change this to You want to proceed with the complete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Complete",
    }).then(function (result) {
      if (result.isConfirmed) {
        const data = {
          request_id: _id,
          status: "Completed",
        };

        props.loader(true);
        Api("post", `UpdateWalletStatus`, data, router).then(
          (res) => {
            console.log("res================>", res.data?.meaasge);
            props.loader(false);

            if (res?.success) {
              props.getOrderBySeller();
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
          },
        );
      } else if (result.isDenied) {
        // setFullUserDetail({})
      }
    });
  };

  return (
    <div className="mb-3">
      <div className="border border-gray-300 rounded-xl bg-white shadow-sm hover:shadow-md transition">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:px-5 px-3 py-3">
          {/* Left Section */}
          <div className="flex-1">
            <p className="text-gray-500 text-xs md:text-sm">
              {moment(props?.data?.createdAt).format("DD-MM-YYYY, HH:mm:ss")}
            </p>

            <p className="text-black font-semibold text-sm md:text-base break-words">
              {props?.data?.note || "No note"}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-between md:justify-end gap-4">
            {/* Amount + Status */}
            <div className="flex flex-col items-end">
              <p className="text-black font-bold text-sm md:text-base">
                €{props?.data?.amount}
              </p>

              {/* Seller Status Badge */}
              {user?.type === "SELLER" && props?.data?.status === "Pending" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                  Pending
                </span>
              )}

              {user?.type === "SELLER" &&
                props?.data?.status === "Completed" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black text-white">
                    Completed
                  </span>
                )}

              {/* Admin Buttons */}
              {user?.type === "ADMIN" && props?.data?.status === "Pending" && (
                <button
                  className="mt-1 h-[34px] px-3 bg-black text-white text-xs md:text-sm rounded-lg hover:opacity-90"
                  onClick={() => updateWalletRequest(props?.data?._id)}
                >
                  {t("Complete")}
                </button>
              )}

              {user?.type === "ADMIN" &&
                props?.data?.status === "Completed" && (
                  <button className="mt-1 h-[34px] px-3 bg-gray-800 text-white text-xs md:text-sm rounded-lg cursor-default">
                    {t("Completed")}
                  </button>
                )}
            </div>

            {/* Delete Button */}
            <div
              className="h-9 w-9 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition"
              onClick={() => deleteProduct(props?.data?._id)}
            >
              <RiDeleteBinLine className="text-lg text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestList;
