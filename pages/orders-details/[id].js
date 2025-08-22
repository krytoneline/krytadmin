import React, { useEffect, useState } from 'react'
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import { produce } from 'immer';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

function OrdersDetails(props) {
    const router = useRouter();
    console.log(router)
    const [productsId, setProductsId] = useState({});
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState([]);
    const [cartData, setCartData] = useState([]);
    const [selecteSize, setSelecteSize] = useState({});
    const [selectedImageList, setSelectedImageList] = useState([]);
    const [fragranceList, setFragranceList] = useState([]);
    const [selectFragranceSearch, setSelectFragranceSearch] = useState([]);
    const [selectFragranceList, setSelectFragranceList] = useState([]);
    const [mainProductsData, setMainProductsData] = useState({});
    const { t } = useTranslation();

    useEffect(() => {
        let cart = localStorage.getItem("addCartDetail");
        if (cart) {
            setCartData(JSON.parse(cart));
        }
        if (router?.query?.id) {
            getProductById()
        }
    }, [router?.query?.id])


    const getProductById = async () => {
        props.loader(true);
        Api("get", `getProductRequest/${router?.query?.id}`, '', router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setMainProductsData(res?.data)
                const d = res.data.productDetail.find(f => f._id === router?.query?.product_id)
                console.log(d)
                setProductsId(d);

                setSelectedImageList(d?.image)
                setSelectedImage(d.image[0])

            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const imageOnError = (event) => {
        event.currentTarget.src = '/default-product-image.png';
        // event.currentTarget.className = "error";
    };

    return (
        <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
            <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">{t("Orders Details")}</p>

            <section className='px-5 pt-5 md:pb-32 pb-28 bg-white h-full rounded-[12px] overflow-scroll md:mt-9 mt-5'>
                <div className="grid md:grid-cols-2 grid-cols-1 w-full md:gap-0 gap-5">
                    <div className='w-full'>
                        <div className='grid md:grid-cols-3 grid-cols-1 w-full md:gap-5 md:pb-10'>
                            <div className='w-full md:h-[300px] flex md:flex-col flex-row overflow-y-auto overflow-x-hidden md:order-1 order-2 md:pt-0 pt-5'>
                                {selectedImageList?.map((item, i) => (<div key={i} className='slider  md:block flex md:gap-5 gap-2 w-full'>
                                    <img className={`md:!w-[85%] w-[93px] object-contain md:mb-5 bg-custom-offWhite rounded-[20px]  ${selectedImage === item ? 'border border-black' : ''}`} src={item || '/default-product-image.png'} onClick={() => {
                                        setSelectedImage(item)
                                        imageOnError()
                                    }} />
                                </div>
                                ))}
                            </div>
                            <div className="col-span-2  md:order-2 order-1  w-full bg-custom-offWhite flex flex-col justify-center items-center md:h-max">
                                <img className=" w-full  object-contain" src={selectedImage || '/default-product-image.png'} onError={imageOnError} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-start items-start md:px-20 px-0 md:pt-5 md:pb-5'>
                        <p className='text-black md:text-3xl md:leading-[40px] text-base font-normal md:pt-0 pt-0'>{productsId?.product?.name}</p>
                        <p className='text-black text-xl font-normal md:pt-5 pt-3'>€{selecteSize?.rate || productsId?.price}</p>
                        {productsId?.color && <div className='flex justify-start items-center pt-[6px] mt-2'>
                            <p className='text-black text-base font-normal'>{t("Colour")}: <span className='font-bold'>{productsId?.color}</span></p>
                        </div>}
                        <div className='flex flex-col justify-start items-start'>
                            {mainProductsData?.category_type === 'Products' && <p className='text-black text-base font-normal md:mt-5 mt-3 '>{t("Qty")}: <span className='font-bold'>{productsId?.qty || 0}</span></p>}
                            {mainProductsData?.rooms && <p className='text-black text-base font-normal md:mt-5 mt-3 '>{t("Rooms")}: <span className='font-bold'>{mainProductsData?.rooms}</span></p>}
                            {productsId?.days && <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Duration")}: <span className='font-bold'>{productsId?.days}</span></p>}
                            {productsId?.start_date && <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Start Date")}: <span className='font-bold'>{moment(new Date(productsId?.start_date)).format('DD MMM YYYY, h:mm:ss a')}</span></p>}
                            {productsId?.end_date && <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("End Date")}: <span className='font-bold'>{moment(new Date(productsId?.end_date)).format('DD MMM YYYY, h:mm:ss a')}</span></p>}
                        </div>
                    </div>
                </div>

                {mainProductsData?.category_type === 'Products' && <div className='w-full'>
                    <p className='text-black font-bold text-2xl md:mb-0 mb-2 md:mt-0 mt-5'>{t("Shipping Address")}</p>
                    <div className='grid grid-cols-2 w-full  justify-center items-center'>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("First Name")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{mainProductsData?.user?.shiping_address?.firstName}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Address")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{mainProductsData?.user?.shiping_address?.address}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Pin Code")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{mainProductsData?.user?.shiping_address?.pinCode}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Phone Number")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{mainProductsData?.user?.shiping_address?.phoneNumber}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("City")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{mainProductsData?.user?.shiping_address?.city}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Country")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{mainProductsData?.user?.shiping_address?.country?.label}</p>
                    </div>
                </div>}

                <div className='w-full'>
                    <p className='text-black font-bold text-2xl md:mb-0 mb-2 md:mt-5 mt-5'>{t("Customer Details")}</p>
                    <div className='grid grid-cols-2 w-full  justify-center items-center'>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("First Name")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{mainProductsData?.user?.username}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Email")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'><a href={`mailto:${mainProductsData?.user?.email}`}>{mainProductsData?.user?.email}</a></p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'>{t("Phone Number")}</p>
                        <p className='text-black text-base font-normal md:pt-5 pt-3'><a href={`tel:${mainProductsData?.user?.number}`}>{mainProductsData?.user?.number}</a></p>
                    </div>
                </div>

            </section>
        </section>
    )
}

export default OrdersDetails
