import { Navigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

const GuestOnly = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-loading" role="status">Loading<span>...</span></div>
            </main>
        )
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return children
}

export default GuestOnly
