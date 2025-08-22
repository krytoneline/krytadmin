import React, { useMemo, useState, useEffect } from 'react'
import Table, { indexID } from '@/components/table'
import { Api } from '@/services/service';
import { useRouter } from 'next/router'
import moment from 'moment';
import { RxCrossCircled } from 'react-icons/rx'
import isAuth from '@/components/isAuth';
import { useTranslation } from 'react-i18next';

function Queries(props) {
    const router = useRouter()
    const [GetInTouchData, setGetInTouchData] = useState([]);
    const [viewPopup, setviewPopup] = useState(false)
    const [popupData, setPopupData] = useState({});
    const [selctDate, setSelctDate] = useState(new Date())
    const { t } = useTranslation();

    useEffect(() => {
        getInTouch();
    }, []);

    const getInTouch = (selctedDate) => {
        props.loader(true);
        const data = {

        }
        if (selctedDate) {
            data.curDate = moment(new Date(selctedDate)).format()
        }
        Api("post", "get-getInTouch", data, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setGetInTouchData(res?.data);
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
            }
        );
    };

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

    function dates({ value }) {
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

    const info = ({ value, row }) => {
        //console.log(row.original._id)
        return (
            <div className=" p-4  flex items-center  justify-center">
                <button className="h-[38px] w-[93px] bg-[#00000020] text-black text-base	font-normal rounded-[8px]" onClick={() => {
                    setviewPopup(true)
                    setPopupData(row.original)
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
                accessor: 'first_name',
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
                Cell: dates
            },
            {
                Header: t("mobile_number"),
                accessor: 'phone',
                Cell: mobile
            },
            {
                Header: t("queries"),
                // accessor: "view",
                Cell: info,
            },
        ],
        [t]
    );

    return (
        <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
            <p className="text-white font-bold md:text-[32px] text-2xl md:pb-0 pb-3">{t("quries")}</p>

            <section className='px-5 pt-5 md:pb-32 pb-28 bg-white h-full rounded-[12px] overflow-scroll md:mt-9 mt-5'>
                {/* shadow-2xl */}
                <div className='bg-white border border-custom-lightGrayColor w-full md:h-[70px] rounded-[10px] md:py-0 py-5 md:px-0 px-5'>
                    <div className='md:grid md:grid-cols-10 grid-cols-1 w-full h-full '>
                        <div className='flex md:justify-center justify-start items-center md:border-r md:border-r-custom-lightGrayColor'>
                            <img className='w-[20px] h-[23px]' src='/filterImg.png' />
                        </div>
                        <div className='flex md:justify-center justify-start items-center md:border-r md:border-r-custom-lightGrayColor  md:pt-0 pt-5 md:pb-0 pb-3'>
                            <p className='text-custom-black text-sm	font-bold'>{t("filter_by")}</p>
                        </div>
                        <div className='col-span-8 flex md:flex-row flex-col md:justify-between justify-start md:items-center items-start'>
                            <input className='md:px-5 text-black outline-none' value={selctDate} type='date' onChange={(e) => {
                                console.log(e)
                                setSelctDate(e.target.value);
                                getInTouch(e.target.value)
                            }} placeholder='Date' />
                            <button className="h-[38px] w-[110px] bg-custom-red text-white text-base font-normal rounded-[8px] md:mr-5 md:mt-0 mt-5" onClick={() => { getInTouch(); setSelctDate('') }}>{t("reset")}</button>
                        </div>
                    </div>
                </div>

                {viewPopup && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                        <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
                            <div
                                className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                onClick={() => setviewPopup(!viewPopup)}
                            >
                                <RxCrossCircled className="h-full w-full font-semibold " />
                            </div>

                            <div className='px-5 py-10'>
                                <p className="text-base font-bold text-custom-black text-center">{t("queries")}</p>
                                <p className="text-base font-normal text-custom-black text-center">
                                    {popupData.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className=''>
                    <Table columns={columns} data={GetInTouchData} />
                </div>
            </section>
        </section >
    )
}

export default isAuth(Queries)
