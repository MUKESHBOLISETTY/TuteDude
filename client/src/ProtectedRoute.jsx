import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        if (user) {
            return children;
        }
    }, [user]);
    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }
};

export default ProtectedRoute;