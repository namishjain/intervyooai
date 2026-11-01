import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function googleLogin(credential){
    const response = await api.post("/api/auth/google",{
        credential
    })
    return response.data
}

export async function logout(){
    const response = await api.get("/api/auth/logout")
    return response.data
}

export async function getMe(){
    const response = await api.get("/api/auth/get-me")
    return response.data
}
