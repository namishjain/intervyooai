import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { getMe } from "./services/auth.api";
import { getErrorMessage } from "../../lib/error-message";

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sessionError, setSessionError] = useState("")

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (!data?.user) {
                    throw new Error("The server returned invalid account information.")
                }
                setUser(data.user)
                setSessionError("")
            } catch (err) {
                if (err.response?.status === 401) {
                    setUser(null)
                } else {
                    setSessionError(getErrorMessage(err, "Unable to verify your sign-in session. Please try again."))
                }
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading,sessionError,setSessionError}}>
            {children}
        </AuthContext.Provider>
    )

}