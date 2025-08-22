import React, { useState, useEffect, useMemo, useContext } from 'react'
import Table, { indexID } from '@/components/table'
import { Api } from '@/services/service';
import { useRouter } from 'next/router'
import moment from 'moment';
import ActivityList from '@/components/activityList';
import { RxCrossCircled } from 'react-icons/rx'
import { userContext } from './_app';
import { useTranslation } from 'react-i18next';

function Wallet(props) {
    const router = useRouter()
    const [userRquestList, setUserRquestList] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [viewRquest, setViewRquest] = useState(false)
    const [addRquestData, setAddRquestData] = useState({
        amount: "",
        note: "",
    })
    const [user, setUser] = useContext(userContext);
    const { t } = useTranslation();

    useEffect(() => {
        getOrderBySeller()
        getProfile()
    }, [])

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
            }
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

    const info = ({ value, row }) => {
        //console.log(row.original._id)
        return (
            <div className=" p-4  flex items-center  justify-center">
                <button className="h-[38px] w-[93px] bg-[#00000020] text-black text-base	font-normal rounded-[8px]" onClick={() => {
                    // setOpenCart(true)
                    // setCartData(row.original)
                }}>See</button>
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
                accessor: 'user.username',
                Cell: name
            },
            {
                Header: "E-mail",
                accessor: 'user.email',
                Cell: email
            },
            {
                Header: "DATE",
                accessor: 'user.createdAt',
                Cell: date
            },
            {
                Header: "Mobile",
                accessor: 'user.number',
                Cell: mobile
            },
            {
                Header: "See Details",
                // accessor: "view",
                Cell: info,
            },
        ],
        []
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
                    })
                    setViewRquest(false)
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
            <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">{t("Wallet")}</p>

            <div className='md:pb-32 pb-28 h-full  overflow-scroll md:mt-9 mt-5'>
                {/* shadow-2xl  */}

                {user?.type === 'SELLER' && <div className="bg-custom-red relative flex flex-col justify-center cursor-pointer mb-5" >
                    <div className="bg-customGray w-full flex justify-between items-center  md:py-5 py-2  rounded-md md:px-5 px-1">
                        <p className="font-bold md:text-lg text-base text-center text-white">{t("Wallet")}</p>
                        <div>
                            <p className="text-white md:text-lg text-base font-bold text-center">
                                €{profileData?.wallet}
                            </p>

                        </div>
                    </div>

                    <div className='flex justify-center items-center md:gap-5 gap-2 md:pb-5 pb-2 md:px-0 px-1'>
                        <button className="h-[38px] w-[180px] bg-custom-red text-white md:text-base text-sm font-normal rounded-[8px]"
                            onClick={() => {
                                setViewRquest(true)
                                // setPopupData(row.original)
                            }}
                        >{t("Withdrawal Request")}</button>
                        <button className="h-[38px] w-[180px] bg-custom-red text-white md:text-base text-sm font-normal rounded-[8px]"
                            onClick={() => { router.push('/my-request') }}
                        >{t("My Request")}</button>
                    </div>

                </div>}

                <div className='flex justify-between items-center mb-5'>
                    <p className="font-bold md:text-lg text-sm text-black">{t("Transanction History")}</p>
                    {user?.type === 'ADMIN' && <button className="h-[38px] md:w-[180px] w-[90px] bg-custom-red text-white md:text-base text-sm font-normal rounded-[8px]" onClick={() => { router.push('/my-request') }}
                    >{t("All Request")}</button>}
                </div>

                {viewRquest && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                        <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
                            <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                onClick={() => setViewRquest(!viewRquest)}>
                                <RxCrossCircled className="h-full w-full font-semibold " />
                            </div>

                            <div className='px-5 py-10'>

                                <form className='w-full' onSubmit={submit}>
                                    <p className="text-custom-darkGray text-base font-normal pb-1">
                                        {t("Request for money")}
                                    </p>
                                    <input
                                        className="bg-transparent w-full md:h-[46px] h-[40px] px-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                                        type="number"
                                        placeholder="Request for money"
                                        value={addRquestData.amount}
                                        onChange={(e) => {
                                            setAddRquestData({
                                                ...addRquestData,
                                                amount: e.target.value,
                                            });
                                        }}
                                        required
                                    />

                                    <div className="pt-5">
                                        <p className="text-custom-darkGray text-base font-normal pb-1">
                                            {t("Note")}
                                        </p>
                                        <div className="relative">
                                            <textarea
                                                className="bg-transparent w-full px-5 py-2 border border-custom-newGrayColor rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                                                rows={4}
                                                placeholder="Note"
                                                value={addRquestData.note}
                                                onChange={(e) =>
                                                    setAddRquestData({
                                                        ...addRquestData,
                                                        note: e.target.value,
                                                    })
                                                }
                                            />

                                        </div>
                                    </div>

                                    <button className="bg-custom-red  md:h-[50px] h-[40px] w-full rounded-[5px] md:text-xl text-base text-white font-normal mt-5" type="submit">{t("Submit")}</button>
                                </form>

                            </div>
                        </div>
                    </div>
                )}


                <div className=''>
                    {userRquestList.map((item, i) => (
                        <ActivityList {...props} data={item} key={i} />
                    ))}
                    {/* <Table columns={columns} data={userRquestList} /> */}
                </div>
            </div>
        </section>
    )
}

export default Wallet
