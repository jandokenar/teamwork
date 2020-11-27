import axios from "axios";
import url from "./constants.js"

export const RenewAccessToken = () => (
    new Promise((resolve, reject) => {
        console.log("Renew token");
        const options = {
            method: "post",
            url: `${url}/user/refresh`,
            credentials: "include",
            withCredentials: true,
            headers: {
                authentication: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        };
        axios(options).then((res) => {
            if (res.data.token) {
                localStorage.setItem("accessToken", res.data.token);
                resolve();
            } else {
                localStorage.removeItem("accessToken");
                reject();
            }
        }).catch(() => {
            reject();
        });
    })
);
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
export const Logout = () => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "post",
            url: `${url}/user/logout`,
            credentials: "include",
            withCredentials: true,
        };
        axios(options).then((res) => {
            localStorage.removeItem("accessToken");
            resolve();
        }).catch(() => {
            localStorage.removeItem("accessToken");
            reject("Request denied");
        });
    })   
}
export const Signup = () => {}
export const GetUserData = (accessToken) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "get",
            url: `${url}/user/`,
            credentials: "include",
            withCredentials: true,
            headers: {
                authentication: `Bearer ${accessToken}`,
            },
        };
        axios(options).then((res) => {
            console.log(res);
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
            reject(e);
        });
    })
}
export const GetAllBooks = async (setBooks) => {
  const req = `${url}/book/all/`;

  const resp = await axios.get(req);
  if (resp) {
    setBooks(resp.data);
  }
}

export const GetBook = async (setBook, isbn) => {
    const req = `${url}/book/${isbn}`;
    
    const resp = await axios.get(req);
    if (resp) {
      setBook(resp.data);
    }
  }

  export const BorrowBook = async (context, isbn, copyId, setBookUpdate) => {
    const options = {
        method: "post",
        url: `${url}/user/borrow/`,
        credentials: "include",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            authentication: `Bearer ${context.accessToken}`,
        },
        data: {
            id: context.currentUser.id,
            isbn,
            copy: copyId,
        },
    };
    
    const resp = await axios(options);
    if (resp) {
        setBookUpdate(false);
    }
  }

  export const ReturnBook = async (context, isbn, copyId, setBookUpdate) => {
    const options = {
        method: "post",
        url: `${url}/user/return/`,
        credentials: "include",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            authentication: `Bearer ${context.accessToken}`,
        },
        data: {
            id: context.currentUser.id,
            isbn,
            copy: copyId,
        },
    };
    
    const resp = await axios(options);
    if (resp) {
        setBookUpdate(false);
    }
  }

  export const ReserveBook = async (context, isbn, copyId, setBookUpdate) => {
    const options = {
        method: "put",
        url: `${url}/user/reserve/`,
        credentials: "include",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            authentication: `Bearer ${context.accessToken}`,
        },
        data: {
            id: context.currentUser.id,
            isbn,
            copy: copyId,
        },
    };
    
    const resp = await axios(options);
    if (resp) {
        setBookUpdate(false);
    }
  }
