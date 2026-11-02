import { useContext } from "react";
import { AuthContext } from "../auth-context";
import {googleLogin,logout} from "../services/auth.api"

export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const {user, setUser, loading, setLoading, sessionError, setSessionError} = context

    const handleGoogleLogin = async (credential) => {
        setLoading(true)
        setSessionError("")
        try{
            const data = await googleLogin(credential)
            if (!data?.user) {
                throw new Error("The server returned invalid account information.")
            }
            setUser(data.user)
            return data
        } finally{
            setLoading(false)
        }
    }
    const handleLogout = async ()=>{
        await logout()
        setUser(null)
    }

    return {user,loading,sessionError,handleGoogleLogin,handleLogout}
}