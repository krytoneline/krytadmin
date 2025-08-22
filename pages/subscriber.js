import { Api } from '@/services/service';
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { userContext } from './_app';
import ListItemButton from "@mui/material/ListItemButton";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Collapse from "@mui/material/Collapse";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import {
    Elements,
    useElements,
    useStripe,
    ElementProps,
    PaymentElement,
    Ele,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from '@/components/Checkout/stripe';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
import { RxCrossCircled } from 'react-icons/rx'
import moment from 'moment';
import { IoCheckmarkSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { MdErrorOutline } from "react-icons/md";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Subscriber(props) {
    const router = useRouter()
    const [plandata, setplandata] = useState([]);
    const [user, setUser] = useContext(userContext);
    console.log(user)
    const [showans, setshowans] = useState(null);
    const [planid, setplanid] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [price, setPrice] = useState("0");
    const [openPopup, setOpenPopup] = useState(false);

    const [subscribedServicesPopup, setSubscribedServicesPopup] = useState(false);
    const { t } = useTranslation();

    const [showPayments, setShowPayments] = useState(false);

    useEffect(() => {
        getplan();
        // const user = localStorage.getItem("userDetail");
        // if (user) {
        //   getuserbyid();
        // }
    }, []);


    useEffect(() => {
        if (user?.type === 'SELLER') {
            if ((user?.subscription?.expiry_date && user?.subscription?.expiry_date && new Date() < new Date(user?.subscription?.expiry_date))) {
                setSubscribedServicesPopup(false)
            } else {
                if (user.email) {
                    setSubscribedServicesPopup(true)
                }
            }
        }
    }, [user]);

    useEffect(() => {
        if (router.query.clientSecret) {

            buySubscription()
        }
    }, [router]);

    // const buySubscription = () => {
    //     console.log('cbs')
    //     setOpenPopup(true)
    // }

    const buySubscription = async (type) => {
        console.log('cbs')
        // return
        let plan = localStorage.getItem("plan");
        let d = JSON.parse(plan)
        let exdate = new Date()
        exdate.setMonth(exdate.getMonth() + d?.month)
        let data = {
            subscription: {
                plan: d,
                expiry_date: moment(exdate).format()
            },
        };
        if (type) {
            data = { ...data, trial_subscription: true }
        }
        console.log(data);
        props.loader(true);
        Api("put", "updateplaninuser", data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================> category ", res);
                if (res.status) {
                    setOpenPopup(true)
                    setUser({ ...user, subscription: res.data.newresponse.subscription, trial_subscription: res.data.newresponse.trial_subscription })
                    localStorage.setItem("userDetail", JSON.stringify({ ...user, subscription: res.data.newresponse.subscription }));
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

    const getplan = async () => {
        props.loader(true);
        Api("get", "getallplan", "", router).then(
            (res) => {
                props.loader(false);
                let newdata = res.data
                if (user?.user_type) {
                    let requireType = []
                    if (user.user_type === 'for Basic & Premium Individual Plans Only') {
                        requireType = ["Basic Individual Plan", "Premium Individual Plan"]
                    } else {
                        requireType = ["Educational School Plan"]
                    }
                    newdata = res.data.filter(f => requireType.includes(f.plantype))
                }
                setplandata(newdata);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const appearance = {
        theme: "stripe",
        // theme: "default",
        // layout: "tabs",
        // paymentMethodOrder: ["apple_pay", "google_pay", "card"],
    };

    const options = {
        clientSecret,
        appearance,
    };

    const payment = (item) => {
        const cur = {
            "$": "USD",
            "£": "GBP",
            "€": "EUR"
        }

        const data = {
            price: item.price,
            currency: 'EUR'
        };
        console.log(data);
        props.loader(true);
        Api("post", `poststripe`, data, router).then(
            (res) => {
                props.loader(false);
                console.log("Payment called", res);
                setClientSecret(res.clientSecret);
                setShowPayment(true)
                setPrice(res.price);
            },
            (err) => {
                console.log(err);
                props.loader(false);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <>
            <div className="w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
                <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">{t("Subscription")}</p>

                <section className='md:px-5 px-3 md:pt-5 pt-3 md:pb-32 pb-28 bg-white h-full rounded-[12px] overflow-scroll md:mt-9 mt-5'>
                    <p className='text-black md:text-4xl text-2xl font-bold text-center'>{t("Our Subscription Plans")}</p>
                    <p className='text-black font-light md:text-base text-base text-center md:pt-3 pt-3'>{t("Pick an account plan that fits your workflow")}</p>

                    <div className='grid md:grid-cols-3 grid-cols-1 w-full gap-5 mt-5'>

                        {plandata.map((item, i) => (<div key={i} className='w-full'>
                            <div className='border-[3px] border-custom-newBlackColor rounded-[20px] p-5 bg-[#24243010] w-full'>
                                <p className='text-black md:text-[25px] text-xl font-medium'>{item?.plantype}</p>
                                {/* {t("Pro")} */}

                                <p className='md:text-[50px] text-2xl text-custom-red font-bold md:pt-5 pt-3'>{item?.currency}{item?.price}
                                    {item.month < 12 && <text className="text-sm text-black ml-2">/{item.month} {t("months")}</text>}
                                    {item.month === 12 && <text className="text-sm text-black ml-2">/1 {t("year")}</text>}
                                </p>
                                {/* <p className='text-black md:text-[19px] text-base font-light md:pt-5 pt-3'>{item?.plantype}</p> */}
                                <div className='md:pt-5 pt-3 md:pb-2  md:px-5'>
                                    {item?.extra_feature.map((plan, idx) => (
                                        <div key={idx} className='flex justify-start items-center gap-3 pb-3'>
                                            <IoCheckmarkSharp className='w-[20px] h-[20px] text-black' />
                                            <p className='text-black md:text-[19px] text-base font-semibold'>{plan?.key}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className='bg-custom-red w-full h-[39px] rounded-[20px] text-white md:text-lg text-base font-medium'
                                    onClick={() => {
                                        localStorage.setItem('plan', JSON.stringify(item))
                                        if (item?.plantype === 'Trial') {
                                            if (!user.trial_subscription) {
                                                buySubscription('trial')
                                            } else {
                                                props.toaster({ type: "error", message: 'You have already used this trial plan' });
                                            }
                                        } else {
                                            // buySubscription()
                                            setShowPayments(true)
                                        }
                                    }}
                                >{t("Buy Now")}</button>
                            </div>

                            {showPayments && <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                                <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto max-h-screen overflow-auto">
                                    <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                        onClick={() => { setShowPayments(false) }}
                                    >
                                        <RxCrossCircled className="h-full w-full font-semibold " />
                                    </div>
                                    <div className='px-5 py-5'>
                                        <p className='text-black font-bold text-2xl mb-5'>{t("PayPal Payment")}</p>

                                        <PayPalButtons
                                            mobileOpen={true}
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    intent: "CAPTURE",
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: item?.price, // Set the transaction amount
                                                            },
                                                        },
                                                    ],
                                                    payer: {
                                                        name: {
                                                            given_name: user?.store?.firstName,
                                                            surname: user?.store?.lastName,
                                                        },
                                                        phone: {
                                                            phone_type: "MOBILE",
                                                            phone_number: {
                                                                national_number: user?.store?.phone,
                                                            },
                                                        },
                                                        address: {
                                                            address_line_1: user?.store?.address,
                                                            address_line_2: user?.store?.address,
                                                            admin_area_1: user?.store?.city,
                                                            admin_area_2: user?.store?.city,
                                                            country_code: user?.store?.country?.value,
                                                        },
                                                        email_address: user?.store?.email,
                                                    },

                                                    application_context: {
                                                        shipping_preference: "NO_SHIPPING", // 🚫 No shipping address
                                                        user_action: "PAY_NOW", // Button shows "Pay Now" instead of "Continue"
                                                    },

                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then((details) => {
                                                    // localStorage.setItem('plan', JSON.stringify(item))
                                                    buySubscription()
                                                    // window.open("_blank");
                                                    // alert(`Transaction completed by ${details.payer.name.given_name}`);
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>}




                        </div>))}
                    </div>
                </section>

                {openPopup && (<div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                    <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
                        <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer" onClick={() => setOpenPopup(!openPopup)}>
                            <RxCrossCircled className="h-full w-full font-semibold " />
                        </div>

                        <div className='px-5 py-10'>
                            <p className="text-base font-bold text-custom-black text-center">Subscription plan successfully saved</p>
                            {/* <p className="text-base font-normal text-custom-black text-center">
                                    {popupData.description}
                                </p> */}

                            <button className="bg-custom-red h-[45px] w-full rounded-[12px] NunitoSans text-white font-normal text-base mt-5" onClick={() => { router.replace('/'); setOpenPopup(false) }}>OK</button>
                        </div>
                    </div>
                </div>)}

                {subscribedServicesPopup && (<div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                    <div className="relative w-[300px] md:w-[600px] h-auto  bg-white rounded-[15px] m-auto">
                        <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer" onClick={() => setSubscribedServicesPopup(!subscribedServicesPopup)}>
                            <RxCrossCircled className="h-full w-full font-semibold " />
                        </div>

                        <div className='px-5 py-10 flex flex-col justify-center items-center'>
                            {/* <img className='w-[64px] h-[64px] object-contain' src='/image-4.png' /> */}
                            <div className='bg-custom-red w-[64px] h-[64px] rounded-full flex justify-center items-center'>
                                <MdErrorOutline className='text-white w-[40px] h-[40px] rotate-180' />
                            </div>
                            <p className="text-xl font-semibold text-black text-center md:pt-5 pt-3">{t("You have not subscribed to the services.")}</p>
                            <p className="text-sm font-medium text-black text-center md:pt-5 pt-3">{t("For use our services please subscribe to our services for using the features of our website.")}</p>
                            <button className="bg-custom-red h-[37px] w-[99px] rounded-[5px] NunitoSans text-white font-medium text-sm md:mt-5 mt-3" onClick={() => { setSubscribedServicesPopup(false) }}>{t("OK")}</button>
                        </div>
                    </div>
                </div>)}

            </div>

            {showPayment && <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                <div className="relative w-max h-auto  bg-white rounded-[15px] mx-auto">
                    <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                        onClick={() => { setShowPayment(false) }}
                    >
                        <RxCrossCircled className="h-full w-full font-semibold " />
                    </div>
                    <div>
                        <Elements options={options} stripe={stripePromise} key={clientSecret}>
                            <CheckoutForm
                                price={price}
                                loader={props.loader}
                                clientSecret={clientSecret}
                                currency={'€'}
                                // planid={planid}
                                month={planid.month}
                            />
                        </Elements>
                    </div>
                </div>
            </div>}



        </>
    )
}

export default Subscriber
