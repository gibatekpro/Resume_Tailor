import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from './AuthProvider';

//The props for the RequireAuth component were defined
interface RequireAuthProps {
    children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        //useEffect is used to handle side effects
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            //onAuthStateChanged listens for changes in the user's sign-in state
            setIsAuthenticated(!!user);
        });

        //cleanup function to unsubscribe from onAuthStateChanged
        return () => unsubscribe();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // or any loading spinner
    }

    if (!isAuthenticated) {
        //Redirect to the login page if the user is not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

