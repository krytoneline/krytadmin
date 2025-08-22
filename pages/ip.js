import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Ip() {
    const [ip, setIp] = useState('');

    useEffect(() => {
        const fetchIp = async () => {
            const res = await axios.get("https://ipinfo.io/?format=jsonp");
            console.log(res.data);
            // console.log(ip)
            // const res = await fetch('/api/get-ip');
            // const data = await res.json();
            // setIp(data.ip);
        };

        fetchIp();
    }, []);

    return (
        <div>
            <h1 className='text-black'>Your IP Address</h1>
            <p className='text-black'>{ip}</p>
        </div>
    )
}

export default Ip
