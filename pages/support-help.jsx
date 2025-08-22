import moment from 'moment'
import React, { useMemo, useState, useEffect, useContext } from 'react'
// import Table from '@/src/components/Table/table'
import { BsChevronDown, BsChevronLeft, BsEmojiSmile, BsSearch } from 'react-icons/bs'
import { AiOutlineSend, AiTwotoneMessage } from 'react-icons/ai'
import { socket } from '@/utils/socket'
import { userContext } from './_app'
import { useRouter } from 'next/router'
// import Table from '@/components/table'
import { useTranslation } from 'react-i18next';
import Table from '@/components/table'

const SupportHelp = (props) => {
    const router = useRouter();
    const { cuser } = router.query
    const [chatBox, setChatBox] = useState(false)
    const [text, setText] = useState('');
    const [tab, setTab] = useState('HELPSUPPORT')
    const [charArray, setChatArray] = useState([])
    const [charUserList, setChatUserList] = useState([])
    const [maincharUserList, setMainChatUserList] = useState([])
    const [selectUser, setSelectUser] = useState({})
    const [user, setUser] = useContext(userContext)
    const [fiterValue, setFiltervalue] = useState('')

    const { t } = useTranslation();

    useEffect(() => {
        // socket.emit('joinadmin')

        return () => {
            socket.off('allmessages');
            socket.off('messages');
            socket.off('joinRoom');
            socket.off('joinadmin');
            socket.off('join');
        };
    }, [])

    useEffect(() => {

        // if (!!user) {
        // getChat()
        // }
        getChatUserList()
        // socket.on('allmessages', message => {
        //     console.log('mymessage==========>', message[0]);
        //     console.log('mymessage========>', `6544ccf960fe2c0d7fe3d23a${selectUser._id}`)
        //     if (message.length > 0) {
        //         if (message[0].support_user === `6544ccf960fe2c0d7fe3d23a${selectUser._id}`) {
        //             setMessages(message);
        //         }
        //     }

        // });
        return () => {
            // socket.off('joinRoom');
            // socket.off('messages');
            // socket.off('updateConnection');
            // socket.off('allmessages');
            // socket.off('connect', () => { });
            // socket.on('disconnect', () => {
            //     console.log('Disconnected from server');
            // });
        };
    }, [user])



    useEffect(() => {
        // socket.on('connect', () => {
        //   console.log('Connected to Socket.io Server');
        // });

        socket.on('error', error => {
            console.error('Socket.io Error:', error);
        });


        socket.on('userlist', list => {
            console.log('list =>', list)
            setChatUserList(list)
            // const newarray = []
            // const newarray2 = []
            // list.forEach(element => {
            //     if (element.satisfied) {
            //         newarray2.push(element)
            //     } else {
            //         newarray.push(element)
            //     }
            // });
            // const nnn = newarray.sort((a, b) => b.userId.completedDelivery - a.userId.completedDelivery)
            // setChatUserList([...nnn, ...newarray2])
            // setMainChatUserList([...nnn, ...newarray2])
            // if (cuser) {
            //     const newuser = list.find(f => f.support_user === cuser)
            //     setSelectUser(newuser)
            //     setChatBox(true)
            //     getChat(newuser)
            // }
            // const sU = localStorage.getItem('selectedUser')
            // if (sU) {
            //     const newuser = list.find(f => f.support_id === sU)
            //     setSelectUser(newuser)
            // }
            // if (message.length > 0) {
            //     setChatArray(message);
            // }
        });

        socket.on('messages', message => {
            console.log(message)
            setSelectUser(message.con)
            if (message.getAllChat.length > 0) {
                setChatArray(message.getAllChat);
            }
        });
        socket.on('updateConnection', message => {
            console.log(message)
            // setChatArray(message);
            getChatUserList()
            // getSupport(false);
        });

        socket.on('allmessages', message => {
            console.log(message)
            setChatArray(message);
        });

    }, [socket]);

    const statusHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='py-1 px-5 border-2 border-custom-blue rounded-md'>{600}</p>
            </div>
        )
    }

    const nameHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='font-semibold text-md '>{value}</p>
            </div>
        )
    }

    const onoffline = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className={`font-semibold text-md ${value === 'online' ? 'text-green-700' : 'text-red-700'}`}>{value}</p>
            </div>
        )
    }

    const idHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center gap-4'>
                <p className='font-semibold text-md text-black'>#{value}</p>
            </div>
        )
    }

    const actionHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <button onClick={() => {
                    socket.emit('join', row.original.support_id);
                    setSelectUser(row.original);
                    setChatBox(true)
                    getChat(row.original)
                    localStorage.setItem('selectedUser', row.original.support_id)
                }} className='py-2  px-5 flex items-center justify-center mx-auto text-black text-lg text-center bg-[#00000020] rounded-md'>
                    {t("Chat")}
                </button>
            </div>
        )
    }

    const Refund = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className={`py-3 px-5   rounded-md text-white ${value ? 'bg-green-700' : 'bg-red-700'}`}>{value ? 'Satisfied' : 'Pending'}</p>
            </div>
        )
    }



    const columns = useMemo(
        () => [
            {
                Header: t("UserId"),
                accessor: "customer._id",
                Cell: idHandler
            },
            {
                Header: t("UserName"),
                accessor: "customer.username",
                Cell: nameHandler
            },
            {
                Header: t("Message"),
                accessor: "lastmsg",
                Cell: nameHandler
            },
            // {
            //     Header: "On/Offline",
            //     accessor: "userId.online",
            //     Cell: onoffline
            // },
            // {
            //     Header: "Query",
            //     accessor: "query",
            //     Cell: nameHandler
            // },
            // {
            //     Header: "Sub Query",
            //     accessor: "sub_query",
            //     Cell: nameHandler
            // },
            // {
            //     Header: "Status",
            //     accessor: "satisfied",
            //     Cell: Refund
            // },
            {
                Header: t("Action"),
                accessor: "more",
                Cell: actionHandler
            },
        ],
        [charUserList]
    );



    const filterData = (type) => {
        let pending = []
        let resolved = []
        maincharUserList.forEach(element => {
            if (element.satisfied) {
                resolved.push(element)
            } else {
                pending.push(element)
            }
        });
        if (type === '') {
            setChatUserList([...pending, ...resolved])
        }
        if (type === 'true') {
            setChatUserList([...resolved])
        }
        if (type === 'false') {
            setChatUserList([...pending])
        }

    }

    const getChat = (item) => {
        // if (item.sender) {

        const payloads = {
            conn_id: item.conn_id
        };
        socket.emit('joinRoom', payloads);
        // }
    };

    const getChatUserList = () => {
        socket.emit('join', user._id)
        let type =''
        if(user.type === 'ADMIN'){
            type='adminsupport'
        }else{
            type='sellersupport'
        }
        socket.emit('chatuser', { id: user._id, type, from: 'admin' });
    };


    const createChat = message => {
        // const payloads = {
        //     message: message,
        //     receiver: selectUser.userId._id,
        //     sender: '6544ccf960fe2c0d7fe3d23a',
        //     support_id: selectUser.support_id,
        //     connection: selectUser.connection,
        //     key: 'userSocket',
        // };
        const payloads = {
            receiver: selectUser.customer._id,
            message: message,
            sender: selectUser.user._id,
            connection: selectUser._id,
            conn_id: selectUser.conn_id,
            type: 'sellersupport',
            to: 'customer'
        };
        socket.emit('createMessage', payloads);
        // setNewMessage('');
    };

    const satisfied = (message, type) => {
        const payloads = {
            type: type || false,
            message: message,
            receiver: selectUser.userId._id,
            sender: '6544ccf960fe2c0d7fe3d23a',
            support_id: selectUser.support_id,
            connection: selectUser.connection,
            key: 'userSocket',
        };
        console.log(payloads);
        socket.emit('satisfied', payloads);
        // setNewMessage('');
    };
    const satisfiedDirect = (message, type, item) => {
        const payloads = {
            type: type || false,
            message: message,
            receiver: item.userId._id,
            sender: '6544ccf960fe2c0d7fe3d23a',
            support_id: item.support_id,
            connection: item.connection,
            key: 'userSocket',
        };
        console.log(payloads);
        socket.emit('satisfied', payloads);
        // setNewMessage('');
    };

    return (
        <>
            <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
                <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">{t("Support")}</p>

                <section className='px-5 pt-5 md:pb-32 pb-28 bg-white h-full rounded-[12px] overflow-scroll md:mt-9 mt-5'>
                    <div className=' w-full space-y-4'>

                        {chatBox && <div className={` z-50 fixed right-10 bottom-20 shadow-2xl w-[300px] md:w-[450px]  bg-white rounded-xl overflow-hidden`}>
                            <div className='relative'>

                                <div className='p-4 bg-black flex items-center gap-3'>
                                    <div className='text-white max-w-[320px]' onClick={() => {
                                        setSelectUser({});
                                        setChatArray([])
                                        setChatBox(false);
                                        socket.off('join');
                                        localStorage.removeItem('selectedUser')
                                    }}>
                                        <BsChevronLeft className='text-2xl font-bold' />
                                    </div>
                                    <div className=' flex items-center gap-3'>
                                        <div>
                                            <p className='text-md rounded-md p-2 text-white text-right font-medium '>{selectUser?.customer?.username}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className=' h-[400px] w-full p-2 overflow-scroll space-y-3 chatbox'>
                                    {charArray.map((msg, idx) => (
                                        msg?.sender._id === selectUser?.user._id ?
                                            <div key={idx}>
                                                <div className='pl-4 grid grid-cols-12 gap-2  w-full  '>
                                                    <div className='text-white  col-span-12 flex flex-col items-end'>
                                                        <p className='text-md  bg-black rounded-md p-2  text-right font-medium max-w-max'>{msg.message}</p>
                                                        <p className='text-[10px] text-black  rounded-md   text-right font-medium max-w-max'>{moment(msg.msgtime).format('DD-MM-YYYY, hh:mm A')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div key={idx}>
                                                <div className='pr-4 gap-1 grid grid-cols-12  w-full '>

                                                    <div className='text-black col-span-10'>
                                                        <p className='text-md font-medium bg-gray-300 p-2 text-left rounded-md max-w-max'>{msg.message}</p>
                                                        <p className='text-[10px] text-black max-w-20 rounded-md   text-left font-medium max-w-max'>{moment(msg.msgtime).format('DD-MM-YYYY, hh:mm A')}</p>
                                                    </div>
                                                </div>
                                            </div>))}
                                </div>

                                <div className='bg-white h-[50px]  z-50 w-full bottom-0 right-0 border-t-2 border-gray-300 '>
                                    <div className='w-full h-full flex gap-2 items-center justify-between text-gray-400 p-2'>
                                        <input type="text" value={text} className='text-md font-medium outline-none w-full h-full' placeholder='type message' onChange={(e) => setText(e.target.value)} />
                                        {text && <div className=' flex justify-end items-center'>
                                            <div className=' w-10 h-10 p-3 cursor-pointer flex gap-3 rounded-full  text-white bg-custom-blue '
                                                onClick={() => {
                                                    createChat(text)
                                                    setText('')
                                                }}>
                                                <AiOutlineSend className=' w-full h-full' />
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {tab === 'HELPSUPPORT' &&
                            <Table columns={columns} data={charUserList} />
                        }

                    </div>
                </section>
            </section>

            {/* <section className=" w-full h-full  bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
                <div className='md:pt-[0px] pt-[0px] h-full overflow-scroll no-scrollbar'>
                    <p className="text-white font-bold md:text-[32px] text-2xl md:pb-0 pb-3">Support</p>
                    <div className=' w-full space-y-4'>

                        {chatBox && <div className={` z-50 fixed right-10 bottom-20 shadow-2xl w-[300px] md:w-[450px]  bg-white rounded-xl overflow-hidden`}>
                            <div className='relative'>

                                <div className='p-4 bg-black flex items-center gap-3'>
                                    <div className='text-white max-w-[320px]' onClick={() => {
                                        setSelectUser({});
                                        setChatArray([])
                                        setChatBox(false);
                                        socket.off('join');
                                        localStorage.removeItem('selectedUser')
                                    }}>
                                        <BsChevronLeft className='text-2xl font-bold' />
                                    </div>
                                    <div className=' flex items-center gap-3'>
                                        <div>
                                            <p className='text-md rounded-md p-2 text-white text-right font-medium '>{selectUser?.customer?.username}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className=' h-[400px] w-full p-2 overflow-scroll space-y-3 chatbox'>
                                    {charArray.map((msg, idx) => (
                                        msg?.sender._id === selectUser?.user._id ?
                                            <div key={idx}>
                                                <div className='pl-4 grid grid-cols-12 gap-2  w-full  '>
                                                    <div className='text-white  col-span-12 flex flex-col items-end'>
                                                        <p className='text-md  bg-black rounded-md p-2  text-right font-medium max-w-max'>{msg.message}</p>
                                                        <p className='text-[10px] text-black  rounded-md   text-right font-medium max-w-max'>{moment(msg.msgtime).format('DD-MM-YYYY, hh:mm A')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div key={idx}>
                                                <div className='pr-4 gap-1 grid grid-cols-12  w-full '>

                                                    <div className='text-black col-span-10'>
                                                        <p className='text-md font-medium bg-gray-300 p-2 text-left rounded-md max-w-max'>{msg.message}</p>
                                                        <p className='text-[10px] text-black max-w-20 rounded-md   text-left font-medium max-w-max'>{moment(msg.msgtime).format('DD-MM-YYYY, hh:mm A')}</p>
                                                    </div>
                                                </div>
                                            </div>))}
                                </div>

                                <div className='bg-white h-[50px]  z-50 w-full bottom-0 right-0 border-t-2 border-gray-300 '>
                                    <div className='w-full h-full flex gap-2 items-center justify-between text-gray-400 p-2'>
                                        <input type="text" value={text} className='text-md font-medium outline-none w-full h-full' placeholder='type message' onChange={(e) => setText(e.target.value)} />
                                        {text && <div className=' flex justify-end items-center'>
                                            <div className=' w-10 h-10 p-3 cursor-pointer flex gap-3 rounded-full  text-white bg-custom-blue '
                                                onClick={() => {
                                                    createChat(text)
                                                    setText('')
                                                }}>
                                                <AiOutlineSend className=' w-full h-full' />
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {tab === 'HELPSUPPORT' &&
                            <Table columns={columns} data={charUserList} />
                        }

                    </div>
                </div>
            </section > */}
        </>
    )
}

export default SupportHelp