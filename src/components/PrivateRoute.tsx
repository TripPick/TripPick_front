import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '@/lib/api';

const PrivateRoute = () => {
    const isLogin = getAccessToken(); 

    return isLogin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;