import { useContext } from "react";
import { AuthContext } from "../auth-context";
import {googleLogin,logout} from "../services/auth.api"

export const useAuth = ()=>{
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context

    const handleGoogleLogin = async (credential) => {
        setLoading(true)
        try{
            const data = await googleLogin(credential)
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

    return {user,loading,handleGoogleLogin,handleLogout}
}