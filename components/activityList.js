import React, { useMemo } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import moment from "moment";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";

const ActivityList = (props) => {
  console.log(props)
  const [open, setOpen] = React.useState(false);


  return (
    <div className="mb-3">
      <div className="border-[2px]  border-custom-red">

        <div className="bg-white w-full flex justify-between items-center  md:px-5 md:p-3 p-1">
          <div>
            <p className="text-black text-semibold md:text-base text-xs">{moment(props?.data?.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</p>
            <p className="text-black font-semibold md:text-base text-xs">{props?.data?.notification}</p>
          </div>

          {props?.data?.transactionType === 'CREDIT' && <div className="flex justify-center items-center">
            <IoIosAdd className={`w-6 h-6 text-green-800`} />
            <p className="text-green-800 font-semibold md:text-base text-xs"> €{props?.data?.amount}</p>
          </div>}
          {props?.data?.transactionType === 'DEBIT' && <div className="flex justify-center items-center">
            <IoIosRemove className={`w-6 h-6 text-red-600`} />
            <p className="text-red-600 font-semibold md:text-base text-xs"> €{props?.data?.amount}</p>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
