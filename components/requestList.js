import React, { useContext, useMemo } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import moment from "moment";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { Api } from "@/services/service";
import { useRouter } from 'next/router'
import { userContext } from "@/pages/_app";
import { useTranslation } from 'react-i18next';

const RequestList = (props) => {
  console.log(props)
  const router = useRouter()
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useContext(userContext);
  console.log(user)
  const { t } = useTranslation();

  const deleteProduct = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the deletion? change this to You want to proceed with the delete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    })
      .then(function (result) {
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
                props.getOrderBySeller()
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

  const updateWalletRequest = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the completion? change this to You want to proceed with the complete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Complete"
    })
      .then(function (result) {
        if (result.isConfirmed) {

          const data = {
            request_id: _id,
            status: "Completed"
          };

          props.loader(true);
          Api("post", `UpdateWalletStatus`, data, router).then(
            (res) => {
              console.log("res================>", res.data?.meaasge);
              props.loader(false);

              if (res?.success) {
                props.getOrderBySeller()
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

  return (
    <div className="mb-3">
      <div className="border-[2px]  border-custom-blue">

        <div className="bg-white w-full flex justify-between items-center  md:px-5 md:p-3 p-1">
          <div>
            <p className="text-black text-semibold md:text-base text-xs">{moment(props?.data?.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</p>
            <p className="text-black font-semibold md:text-base text-xs">{props?.data?.note}</p>
          </div>

          <div className="flex justify-center items-center md:gap-5 gap-3">
            <div className="flex flex-col justify-center items-center">
              <p className="text-black font-semibold md:text-base text-xs">€{props?.data?.amount}</p>
              {props?.data?.status === 'Pending' && user?.type === 'SELLER' && <p className="text-yellow-600 font-semibold md:text-base text-xs">{props?.data?.status}</p>}
              {props?.data?.status === 'Completed' && user?.type === 'SELLER' && <p className="text-green-800 font-semibold md:text-base text-xs">{props?.data?.status}</p>}
              {props?.data?.status === 'Pending' && user?.type === 'ADMIN' && <button className="h-[38px] md:w-[110px] w-[90px] bg-yellow-600 text-white md:text-base text-sm font-normal rounded-[8px]" onClick={() => updateWalletRequest(props?.data?._id)}>{t("Complete")}</button>}
              {props?.data?.status === 'Completed' && user?.type === 'ADMIN' && <button className="h-[38px] md:w-[110px] w-[90px] bg-green-800 text-white md:text-base text-sm font-normal rounded-[8px]">{t("Completed")}</button>}
            </div>
            <div className="md:h-10 h-8 md:w-10 w-8 bg-custom-blue rounded items-center flex justify-center cursor-pointer" onClick={() => deleteProduct(props?.data?._id)}>
              <RiDeleteBinLine className="text-white md:text-[24px] text-xl" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RequestList;
