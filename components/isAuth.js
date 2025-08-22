
import { useEffect } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
    return function IsAuth(props) {
        const router = useRouter();
        console.log(router)
        let auth = false;
        let user
        let u
        let isSubscribe = false
        if (typeof window !== "undefined") {
            user = localStorage.getItem("userDetail");
            if (user) {
                u = JSON.parse(user)
            }
        }
        if (user) {
            // const u = JSON.parse(user)
            const token = localStorage.getItem("token");
            if (router?.pathname === '/' || router?.pathname === '/products' || router?.pathname === '/add-product' || router?.pathname === '/queries' || router?.pathname === '/orders') {
                auth = token && (u?.type === 'ADMIN' || u?.type === 'SELLER') ? true : false
            } else {
                auth = token && u?.type === 'ADMIN' ? true : false
            }

            if (u?.type === "SELLER") {
                console.log(user?.subscription?.expiry_date)
                console.log(new Date() < new Date(user?.subscription?.expiry_date))
                if ((u?.subscription?.expiry_date && u?.subscription?.expiry_date && new Date() < new Date(u?.subscription?.expiry_date))) {
                    auth = true
                    isSubscribe = true
                } else {
                    auth = false
                    isSubscribe = false
                }
            } else {
                isSubscribe = true
            }
        }
        useEffect(() => {
            console.log(auth)
            console.log(isSubscribe)
            console.log(user)
            // router.replace('/subscriber')
            if (u?.subscription && !isSubscribe) {
                console.log(isSubscribe)
                router.replace('/subscriber')
                return
            } else {
                if (!auth) {
                    localStorage.clear();
                    router.replace('/login')
                }
            }
            console.log(auth)


        }, []);

        // if (!auth) {
        //     return <div></div>;
        // }

        return <Component {...props} />;
    };
}

export default isAuth