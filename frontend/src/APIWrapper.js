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
export const SignUp = (name, email, password) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "post",
            url: `${url}/user/`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                name,
                email,
                password,
                role: "admin",
            },   
        }
        axios(options).then((res) => {
            resolve();
        }).catch(() => {
            reject();
        })       
    })
}

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
            resolve(res.data);
        }).catch((e) => {
            reject(e);
        });
    })
}

export const GetAllUsers = () => {
    const request = axios.get(`${url}/user/all`)
    return request.then(response => response.data)
}

export const ModifyUserData = (replacementData, accessToken) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "put",
            url: `${url}/user/`,
            credentials: "include",
            withCredentials: true,
            headers: {
                authentication: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            data: {
                replacementData,
            }
        };
        axios(options).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            reject(e);
        });
    })
}

export const DeleteOneUser = async (id) => {
    const response = await axios.delete(`${url}/user/`, { data: { id: id } });
    return response.data;
}

export const GetAllBooks = async (setBooks) => {
    const req = `${url}/book/all/`;
    
    const resp = await axios.get(`${req}`);
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
export const AddBook = async (bookObject) => {
    const response = await axios.post(`${url}/book/`, bookObject);
    return response.data;
};

export const DeleteOneBook = async (isbn, id) => {
    const response = await axios.delete(`${url}/book/`, {data:{isbn: isbn, id: id}});
    return response.data;
}

export const UpdateOneBook = async (bookObject) => {
    await axios.put(`${url}/book/`, bookObject);
}
