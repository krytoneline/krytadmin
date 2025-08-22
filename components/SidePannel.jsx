
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { AiOutlineBulb } from 'react-icons/ai'
import { MdDashboard } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { FiPackage } from 'react-icons/fi'
import { FaSackDollar } from 'react-icons/fa6'
import { MdSupportAgent, MdContentPaste } from 'react-icons/md'
import { VscFeedback } from 'react-icons/vsc'
import { ImCross } from 'react-icons/im'
import { userContext } from '@/pages/_app'
import { BiSolidCategory } from "react-icons/bi";
import { MdSubscriptions, MdPayments, MdOutlineTouchApp, MdCleaningServices } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdOutlineColorLens } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { IoIosContact } from 'react-icons/io'
import { FaCircleQuestion } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { useTranslation } from 'react-i18next'
import { HiWallet } from "react-icons/hi2";
import { IoBusiness } from "react-icons/io5";
import { MdOutlineContentPaste } from "react-icons/md";

const SidePannel = ({ setOpenTab, openTab }) => {
    const [user, setUser] = useContext(userContext)
    const router = useRouter();
    const { t } = useTranslation();

    const logOutHandler = () => {
        localStorage.removeItem("PBuser")
        localStorage.removeItem("token")
        setUser({})
        router.push('/login')
    }

    const menuItems = [
        {
            href: "/",
            title: t("dashboard"),
            img: <MdDashboard className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/products",
            title: t("products"),
            img: <AiFillProduct className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/add-product",
            title: t("add_product"),
            img: <AiFillProduct className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/queries",
            title: t("queries"),
            img: <FaCircleQuestion className='text-3xl' />,
            access: ["ADMIN"],
        },
        {
            href: "/orders",
            title: t("orders"),
            img: <FaShoppingBag className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/business-inquiry",
            title: t("Business Inquiry"),
            img: <IoBusiness className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/price-management",
            title: t("price_management"),
            img: <MdSubscriptions className='text-3xl' />,
            access: ["ADMIN"],
        },

        {
            href: "/sellers",
            title: t("sellers"),
            img: <FaUserTie className='text-3xl' />,
            access: ["ADMIN"],
        },
        {
            href: "/categories",
            title: t("categories"),
            img: <BiSolidCategory className='text-3xl' />,
            access: ["ADMIN"],
        },
        {
            href: "/settings",
            title: t("settings"),
            img: <IoSettings className='text-3xl' />,
            access: ["ADMIN"],
        },
        {
            href: "/wallet",
            title: t("Wallet"),
            img: <HiWallet className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/subscriber",
            title: t("Subscriber"),
            img: <MdSubscriptions className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/content-management",
            title: t("Contents"),
            img: <MdOutlineContentPaste className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },

        {
            href: "/support-help",
            title: t("Support"),
            img: <MdOutlineContentPaste className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
    ];


    return (
        <>

            <div className='xl:w-[300px] fixed top-0 left-0 z-20  md:w-[250px] sm:w-[200px] hidden sm:grid grid-rows-5 h-screen '>
                <div className='p-5'>
                    <div className='bg-white  rounded-[12px] overflow-y-auto p-5'>

                        <div className='pt-5 pb-7 row-span-1 w-full flex items-center justify-center cursor-pointer border-b-2 border-b-white' onClick={(() => router.push('/'))}>
                            <img src="/icons/main-logo.png" alt="" className='w-[182px] h-[44px] object-cover object-center' />
                        </div>

                        <div className='flex flex-col justify-between row-span-4  w-full md:h-[580px] overflow-auto no-scrollbar'>
                            <ul className='w-full flex flex-col text-left'>
                                {menuItems.map((item, i) => (
                                    <Link key={i} href={item.href} className={`${item?.access?.includes(user?.type) ? 'flex' : 'hidden'}  items-center w-full cursor-pointer group hover:bg-custom-red hover:text-white border-t-2 border-b-2 border-white ${router.pathname === item.href ? 'bg-custom-red text-white rounded-[12px]' : 'text-custom-red'}`}>
                                        <div className=' py-3 pl-6 font-semibold flex items-center gap-4 w-full'>
                                            <div className='w-6'>
                                                {item?.img}
                                            </div>
                                            {item?.title}
                                        </div>
                                    </Link>))}

                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-full absolute top-0 left-0 z-40 sm:hidden flex flex-col h-screen max-h-screen overflow-hidden bg-custom-red ${openTab ? 'scale-x-100' : 'scale-x-0'} transition-all duration-300 origin-left`}>
                <div className=' row-span-1  w-full text-white  relative '>
                    <ImCross className='absolute top-4 right-4 z-40 text-2xl' onClick={() => setOpenTab(!openTab)} />
                    <div className='flex items-center gap-3 w-full  p-3'>
                        <div className='bg-white p-1 rounded overflow-hidden'>
                            <img src="/icons/main-logo.png" alt="" className='w-[182px] h-[44px] object-contain' />
                        </div>
                        <div className='flex flex-col text-left justify-center'>
                            {/* <p className='text-lg font-semibold'>
                                Octopusgifts
                            </p> */}
                            <p className='-mt-2 text-sm'>{user?.fullName}</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-start row-span-2 h-full  w-full'>
                    {/* <div className=' row-span-1 w-full flex items-center justify-center cursor-pointer text-white border-b border-b-white' onClick={(() => router.push('/'))}>
                        <img src="/Logo.png" alt="" className='w-[200px]  object-contain' />
                    </div> */}
                    <ul className='w-full h-full flex flex-col text-left justify-start items-center border-t-2 border-white'>
                        {menuItems.map((item, i) => (
                            <li key={i} className={`${item?.access?.includes(user?.type) ? 'flex' : 'hidden'} w-full items-center text-white cursor-pointer group hover:bg-custom-lightGray hover:text-custom-blue  border-b-2 border-white`}>
                                <div className=' py-2 pl-6 font-semibold flex items-center gap-4 ' onClick={() => setOpenTab(!openTab)}>
                                    <div className='w-6'>
                                        {item?.img}
                                    </div>
                                    <Link href={item.href} >{item?.title}</Link>
                                </div>
                            </li>))}

                    </ul>
                </div>
            </div>

        </>
    )
}

export default SidePannel