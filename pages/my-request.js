import React, { useState, useEffect } from 'react'
import { Api } from '@/services/service';
import { useRouter } from 'next/router'
import { RxCrossCircled } from 'react-icons/rx'
import RequestList from '@/components/requestList';
import { useTranslation } from 'react-i18next';

function MyRequest(props) {
    const router = useRouter()
    const [userRquestList, setUserRquestList] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [viewRquest, setViewRquest] = useState(false)
    const [addRquestData, setAddRquestData] = useState({
        amount: "",
        note: "",
    })
    const { t } = useTranslation();

    useEffect(() => {
        getOrderBySeller()
        // getProfile()
    }, [])

    const getOrderBySeller = async () => {
        props.loader(true);
        Api("get", "getWalletRequest", "", router).then(
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

    // const getProfile = async () => {
    //     props.loader(true);
    //     Api("get", "getProfile", "", router).then(
    //         (res) => {
    //             props.loader(false);
    //             console.log("res================>", res);
    //             setProfileData(res.data);
    //         },
    //         (err) => {
    //             props.loader(false);
    //             console.log(err);
    //             props.toaster({ type: "error", message: err?.message });
    //         }
    //     );
    // };

    // const submit = async (e) => {
    //     e.preventDefault();
    //     props.loader(true);
    //     Api("post", "createWalletRequest", addRquestData, router).then(
    //         (res) => {
    //             props.loader(false);
    //             console.log("res================> category ", res);
    //             if (res.success) {
    //                 setAddRquestData({
    //                     amount: "",
    //                     note: "",
    //                 })
    //                 setViewRquest(false)
    //                 // router.push("/products");
    //                 props.toaster({ type: "success", message: res.data?.message });
    //             } else {
    //                 props.toaster({ type: "error", message: res?.data?.message });
    //             }
    //         },
    //         (err) => {
    //             props.loader(false);
    //             console.log(err);
    //             props.toaster({ type: "error", message: err?.message });
    //         }
    //     );
    // };

    return (
        <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
            <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">{t("My Request")}</p>

            <div className='md:pb-32 pb-28 h-full  overflow-scroll md:mt-9 mt-5'>
                {/* shadow-2xl  */}

                <div className="bg-custom-red relative flex flex-col justify-center cursor-pointer mb-5" >
                    <div className="bg-customGray w-full flex justify-between items-center  md:py-5 py-2  rounded-md md:px-5 px-1">
                        <p className="font-bold md:text-lg text-base text-center text-white">{t("My Request")}</p>
                        {/* <div>
                            <p className="text-white md:text-lg text-base font-bold text-center">
                                ${profileData?.wallet}
                            </p>
                        </div> */}
                    </div>
                </div>

                {/* {viewRquest && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                        <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
                            <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                onClick={() => setViewRquest(!viewRquest)}>
                                <RxCrossCircled className="h-full w-full font-semibold " />
                            </div>

                            <div className='px-5 py-10'>

                                <form className='w-full' onSubmit={submit}>
                                    <p className="text-custom-darkGray text-base font-normal pb-1">
                                        Rquest for money
                                    </p>
                                    <input
                                        className="bg-transparent w-full md:h-[46px] h-[40px] px-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                                        type="number"
                                        placeholder="Rquest for money"
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
                                            Note
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

                                    <button className="bg-custom-gray  md:h-[50px] h-[40px] w-full rounded-[5px] md:text-xl text-base text-white font-normal mt-5" type="submit">Submit</button>
                                </form>

                            </div>
                        </div>
                    </div>
                )} */}


                <div className=''>
                    {userRquestList.map((item, i) => (
                        <RequestList {...props} data={item} key={i} getOrderBySeller={getOrderBySeller} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MyRequest
