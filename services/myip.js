import axios from "axios";
import { Api } from "./service";

export default async function getip() {
    return axios.get('https://ipinfo.io?token=c8ac68e6bdb4a8').then(data => {
        return data.data
        console.log(data)
    })
    return Api("get", `userip`, "", '').then(
        (res) => {
            console.log(res);
            return res.data
        },
        (err) => {
            console.log(err);

        }
    );

    // return res.data
}