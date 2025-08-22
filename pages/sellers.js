import React, { useMemo, useState, useEffect } from 'react'
import Table, { indexID } from '@/components/table'
import { Api } from '@/services/service';
import { useRouter } from 'next/router'
import moment from 'moment';
import Dialog from "@mui/material/Dialog";
import { IoCloseCircleOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Navigation } from 'swiper/modules';
import isAuth from '@/components/isAuth';
import { RxCrossCircled } from 'react-icons/rx'
import { useTranslation } from 'react-i18next';

function Sellers(props) {
    const router = useRouter()
    const [sellersData, setSellersData] = useState([]);
    const [viewPopup, setviewPopup] = useState(false)
    const [popupData, setPopupData] = useState({});
    const [driverdata, setdriverdata] = useState([]);
    const [currentIndex, setCuurentIndex] = useState(0)
    const [viewRquest, setViewRquest] = useState(false)
    const [addRquestData, setAddRquestData] = useState('')
    const [selctDate, setSelctDate] = useState(new Date())
    const { t } = useTranslation();

    useEffect(() => {
        getuserlist()
    }, [])

    const handleClose = () => {
        setviewPopup(false);
        setPopupData({})
        setdriverdata([])
    };

    // const singleData = [
    //     {
    //         img: driverdata?.docimg
    //     },
    //     {
    //         img: driverdata?.vehicleimg
    //     },
    // ]

    const getuserlist = async (selctedDate) => {
        const data = {

        }
        if (selctedDate) {
            data.curDate = moment(new Date(selctedDate)).format()
        }
        props.loader(true);
        Api("post", "getSellerList", data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setSellersData(res.data);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const updateStatus = async (id, verification) => {
        props.loader(true);
        Api("post", 'updateStore', { id, verification }, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                getuserlist()
                if (verification === 'Suspend') {
                    props.toaster({ type: "success", message: "seller suspended successfully" });
                }
                if (verification === 'Verified') {
                    props.toaster({ type: "success", message: "seller Verified successfully" });
                }
                setviewPopup(false)
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    function name({ value }) {
        return (
            < div>
                <p className='text-custom-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function email({ value }) {
        return (
            < div>
                <p className='text-custom-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function date({ value }) {
        return (
            < div>
                <p className='text-custom-black text-base font-normal text-center'>{moment(value).format('DD MMM YYYY')}</p>
            </div>
        )
    }

    function mobile({ value }) {
        return (
            < div>
                <p className='text-custom-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function status({ value }) {
        return (
            < div>
                <p className='text-custom-black text-base font-normal text-center'>Status</p>
            </div>
        )
    }

    function wallet({ value }) {
        return (
            < div className='flex flex-col justify-center items-center'>
                <p className='text-custom-black text-base font-normal text-center'>{value || 0}</p>
                {/* <button className="h-[38px] w-[93px] bg-[#FE3E0020] text-custom-red text-base	font-normal rounded-[8px] mt-1"
                    onClick={() => {
                        setViewRquest(true)
                        // setPopupData(row.original)
                    }}
                >Rquest</button> */}
            </div>
        )
    }

    const info = ({ value, row }) => {
        console.log(row.original)
        return (
            <div className=" p-4  flex items-center  justify-center">
                <button className="h-[38px] w-[93px] bg-[#00000020] text-custom-red text-base	font-normal rounded-[8px]" onClick={() => {
                    setviewPopup(true)
                    setPopupData(row.original)
                    setdriverdata([
                        {
                            img: row.original?.store?.identity
                        },
                        {
                            img: row.original?.store?.kbis
                        }
                    ])
                }}>{t("see")}</button>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            {
                Header: t("id"),
                // accessor: "_id",
                Cell: indexID,
            },
            {
                Header: t("name"),
                accessor: 'username',
                Cell: name
            },
            {
                Header: t("email"),
                accessor: 'email',
                Cell: email
            },
            {
                Header: t("date"),
                accessor: 'createdAt',
                Cell: date
            },
            {
                Header: t("mobile_number"),
                accessor: 'number',
                Cell: mobile
            },
            // {
            //     Header: "Status",
            //     accessor: 'status',
            //     Cell: status
            // },
            {
                Header: t("wallet"),
                accessor: "wallet",
                Cell: wallet,
            },
            {
                Header: t("see_details"),
                // accessor: "view",
                Cell: info,
            },
        ],
        [t]
    );

    const submit = async (e) => {
        e.preventDefault();

        return
        const data = {
            // ...addProductsData,
            // userid: user?._id,
            // varients,
        };
        console.log(data);

        props.loader(true);
        Api("post", "createProduct", data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================> category ", res);
                if (res.status) {
                    setAddRquestData('')
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
            }
        );
    };

    return (
        <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
            <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">{t("Sellers")}</p>

            <section className='px-5 pt-5 md:pb-32 pb-28 bg-white h-full rounded-[12px] overflow-scroll md:mt-9 mt-5'>
                {/* shadow-2xl  */}
                <div className='bg-white border border-custom-lightGrayColor w-full md:h-[70px] rounded-[10px] md:py-0 py-5 md:px-0 px-5'>
                    <div className='md:grid md:grid-cols-10 grid-cols-1 w-full h-full '>
                        <div className='flex md:justify-center justify-start items-center md:border-r md:border-r-custom-lightGrayColor'>
                            <img className='w-[20px] h-[23px]' src='/filterImg.png' />
                        </div>
                        <div className='flex md:justify-center justify-start items-center md:border-r md:border-r-custom-lightGrayColor md:pt-0 pt-5 md:pb-0 pb-3'>
                            <p className='text-custom-black text-sm	font-bold'>{t("filter_by")}</p>
                        </div>
                        <div className='col-span-8 flex md:flex-row flex-col md:justify-between justify-start md:items-center items-start'>
                            <input className='md:px-5 text-black outline-none' type='date' placeholder='Date'
                                value={selctDate}
                                onChange={(e) => {
                                    setSelctDate(e.target.value);
                                    getuserlist(e.target.value)
                                }} />
                            <button className="h-[38px] w-[110px] bg-custom-red text-white text-base	font-normal rounded-[8px] md:mr-5 md:mt-0 mt-5" onClick={() => { getuserlist(); setSelctDate('') }}>{t("reset")}</button>
                        </div>
                    </div>
                </div>

                {viewPopup && (
                    <Dialog open={viewPopup} onClose={handleClose} maxWidth='md'>
                        <div className="p-5  bg-white relative overflow-hidden">
                            <IoCloseCircleOutline
                                className="text-black h-8 w-8 absolute right-2 top-2"
                                onClick={handleClose}
                            />
                            <div className="md:flex justify-between border-b-2 border-b-gray-300 py-2">
                                <div className="">

                                    <div className="md:flex flex-row justify-start items-start">
                                        <Avatar
                                            // alt={singleData.username}
                                            // src={singleData.profile}
                                            sx={{ width: 60, height: 60 }}
                                        />
                                        <div className="flex flex-col justify-start items-start md:pl-5">
                                            <p className="text-base font-bold text-custom-black md:pt-0 pt-2">{popupData?.username}</p>
                                            <p className="text-base font-semibold text-custom-newBlack pt-2">{popupData?.email}</p>
                                            <p className="text-sm font-semibold text-custom-black pt-2">{popupData?.number}</p>
                                        </div>
                                    </div>

                                </div>

                                {<div className="flex md:justify-center justify-start items-center min-w-[400px] md:border-l-2 md:border-l-gray-300">
                                    <div className="flex flex-col justify-start items-start md:pl-5 md:w-[80%]">
                                        <div className="flex justify-between items-center w-full md:pt-0 pt-2">
                                            <p className="text-sm font-normal text-custom-black">{t("total_order")}</p>
                                            <p className="text-sm font-normal text-custom-black">{popupData?.order || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center w-full pt-2">
                                            <p className="text-sm font-normal text-custom-black">{t("total_earning")}</p>
                                            <p className="text-sm font-normal text-custom-black">{popupData?.earning || 0}</p>
                                        </div>
                                        {popupData?.subscription?.plan?.plantype && <div className="flex justify-between items-center w-full pt-2">
                                            <p className="text-sm font-normal text-custom-black">{t("subscription_name")}</p>
                                            <p className="text-sm font-bold text-custom-black ml-2">{popupData?.subscription?.plan?.plantype}</p>
                                        </div>}
                                        {popupData?.subscription?.expiry_date && <div className="flex justify-between items-center w-full pt-2">
                                            <p className="text-sm font-normal text-custom-black">{t("expiry_date")}</p>
                                            <p className="text-sm font-bold text-custom-black ml-2">{moment(popupData?.subscription?.expiry_date).format('DD MMM YYYY, h:mm:ss a')}</p>
                                        </div>}
                                    </div>
                                </div>}
                            </div>
                            <p className="text-custom-black text-base font-bold pt-2">
                                {t("uploaded_document")}
                            </p>


                            <Swiper navigation={true} modules={[Navigation]} className="mySwiper mt-5 md:w-[880px] w-68" onRealIndexChange={(newindex) => setCuurentIndex(newindex.activeIndex)} onSlideChange={() => console.log('slide change')}
                                onSwiper={(swiper) => console.log(swiper)}>
                                {driverdata?.map((item, i) => (<SwiperSlide onKeyUpCapture={i}>
                                    <div className="w-full flex justify-center">
                                        <div className="md:w-80 md:h-64 w-60 h-48 relative rounded-lg">
                                            <img
                                                src={item?.img}
                                                alt="icon"
                                                layout="responsive"
                                                className="rounded-sm md:w-80 md:h-64 w-60 h-48 object-contain"
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>))}

                            </Swiper>

                            <div className="md:h-12">
                                <div className="flex  mt-5  justify-center  gap-5">
                                    {popupData?.store?.verification != 'Verified' &&
                                        <button className='text-white text-lg font-bold w-[274px] h-[50px] rounded-[12px] bg-custom-lightBlue'
                                            onClick={() => {
                                                updateStatus(popupData?.store._id, "Verified");
                                            }}
                                        >{t("verify")}</button>}
                                    {popupData?.store?.verification != 'Suspend' &&
                                        <button className='text-white text-lg font-bold w-[274px] h-[50px] rounded-[12px] bg-custom-lightRed'
                                            onClick={() => {
                                                updateStatus(popupData?.store._id, "Suspend");
                                            }}
                                        >{t("suspend")}</button>}
                                </div>

                            </div>

                        </div>
                    </Dialog>
                )}

                {viewRquest && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                        <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
                            <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                onClick={() => setViewRquest(!viewRquest)}>
                                <RxCrossCircled className="h-full w-full font-semibold " />
                            </div>

                            <div className='px-5 py-10'>

                                <form className='w-full' onSubmit={F}>
                                    <p className="text-custom-darkGray text-base font-normal pb-1">
                                        Rquest for money
                                    </p>
                                    <input
                                        className="bg-transparent w-full md:h-[46px] h-[40px] px-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                                        type="number"
                                        placeholder="Rquest for money"
                                        value={addRquestData}
                                        onChange={(e) => {
                                            setAddRquestData(e.target.value)
                                        }}
                                        required
                                    />
                                    <button className="bg-custom-gray  md:h-[50px] h-[40px] w-full rounded-[5px] md:text-xl text-base text-white font-normal mt-5" type="submit">Submit</button>
                                </form>

                            </div>
                        </div>
                    </div>
                )}

                <div className=''>
                    <Table columns={columns} data={sellersData} />
                </div>
            </section>
        </section >
    )
}

export default isAuth(Sellers)
