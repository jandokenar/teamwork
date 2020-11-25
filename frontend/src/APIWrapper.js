import axios from "axios";
import url from "./constants.js"

export const Login = (email, password) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "post",
            url: `${url}/user/login`,
            credentials: "include",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                email,
                password,
            },
        };
        axios(options).then((res) => {
            if (res.data.token) {
                localStorage.setItem("accessToken", res.data.token);
                resolve();
            } else {
                localStorage.removeItem("accessToken");
                reject("Wrong email or password");
            }
        }).catch(() => {
            reject("Request denied");
        });
    })   
}
