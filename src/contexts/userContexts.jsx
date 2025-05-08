// import { createContext, useContext, useState, useEffect } from "react";

// export const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Load user from localStorage on initial mount
//     useEffect(() => {
//         setLoading(true);
//         try {
//             const storedUser = localStorage.getItem('userSession');
//             if (storedUser) {
//                 const userData = JSON.parse(storedUser);
//                 if (typeof userData === 'object' && userData !== null) {
//                     // Ensure boolean conversion for IsAdministrator
//                     const normalizedUser = {
//                         ...userData,
//                         IsAdministrator: Boolean(userData.IsAdministrator),
//                         isAdmin: Boolean(userData.IsAdministrator)
//                     };
//                     setUser(normalizedUser);
//                 } else {
//                     console.warn("Invalid user data in localStorage");
//                     localStorage.removeItem('userSession');
//                 }
//             }
//         } catch (error) {
//             console.error("Failed to parse user session:", error);
//             localStorage.removeItem('userSession');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // Login function with proper boolean handling
//     const loginUser = (apiResponse) => {
//         if (!apiResponse?.result?.[0]) {
//             console.warn("Invalid API response format");
//             return;
//         }

//         const apiUser = apiResponse.result[0];
        
//         // Create normalized user object with proper boolean conversion
//         const normalizedUser = {
//             ...apiUser,
//             IsAdministrator: Boolean(apiUser.IsAdministrator),
//             isAdmin: Boolean(apiUser.IsAdministrator)
//         };

//         setUser(normalizedUser);
//         localStorage.setItem('userSession', JSON.stringify(normalizedUser));
//         setLoading(false);
//     };

//     const logoutUser = () => {
//         setUser(null);
//         localStorage.removeItem('userSession');
//         localStorage.removeItem('rememberMe');
//         setLoading(false);
//     };

//     // Admin check that looks at both possible properties
//     const isAdmin = () => {
//         if (!user) return false;
//         return Boolean(user.IsAdministrator ?? user.isAdmin);
//     };

//     const contextValue = {
//         user,
//         loading,
//         loginUser,
//         logoutUser,
//         isAdmin
//     };

//     return (
//         <UserContext.Provider value={contextValue}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUserContext = () => {
//     const context = useContext(UserContext);
//     if (context === undefined) {
//         throw new Error('useUserContext must be used within a UserProvider');
//     }
//     return context;
// };

// export const useUser = () => useUserContext();

// import { createContext, useContext, useState, useEffect } from "react";

// export const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Load user from localStorage on initial mount
//     useEffect(() => {
//         setLoading(true);
//         try {
//             const storedUser = localStorage.getItem('userSession');
//             if (storedUser) {
//                 const userData = JSON.parse(storedUser);
//                 if (typeof userData === 'object' && userData !== null) {
//                     // Ensure boolean conversion for IsAdministrator
//                     const normalizedUser = {
//                         ...userData,
//                         IsAdministrator: Boolean(userData.IsAdministrator),
//                         isAdmin: Boolean(userData.IsAdministrator)
//                     };
//                     setUser(normalizedUser);
//                 } else {
//                     console.warn("Invalid user data in localStorage");
//                     localStorage.removeItem('userSession');
//                 }
//             }
//         } catch (error) {
//             console.error("Failed to parse user session:", error);
//             localStorage.removeItem('userSession');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // Login function with proper boolean handling
//     const loginUser = (apiResponse) => {
//         if (!apiResponse?.result?.[0]) {
//             console.warn("Invalid API response format");
//             return;
//         }
//         const apiUser = apiResponse.result[0];
//         // Create normalized user object with proper boolean conversion
//         const normalizedUser = {
//             ...apiUser,
//             IsAdministrator: Boolean(apiUser.IsAdministrator),
//             isAdmin: Boolean(apiUser.IsAdministrator),
//             email: apiUser.Email,
//             userName: apiUser.UserName,
//             providerId: apiUser.provider_id,
//             group_name: apiUser.group_name,
//             unit: apiUser.group_name, // Also store as unit for backward compatibility
//             fullName: apiUser.surname, // Fixing typo in original code (was sumame)
//             firstname: apiUser.firstname,
//             surname: apiUser.surname
//         };
//         setUser(normalizedUser);
//         localStorage.setItem('userSession', JSON.stringify(normalizedUser));
//         setLoading(false);
//     };

//     const logoutUser = () => {
//         setUser(null);
//         localStorage.removeItem('userSession');
//         localStorage.removeItem('rememberMe');
//         setLoading(false);
//     };

//     // Admin check that looks at both possible properties
//     const isAdmin = () => {
//         if (!user) return false;
//         return Boolean(user.isAdmin); // Use the isAdmin property directly
//     };

//     const contextValue = {
//         user,
//         loading,
//         loginUser,
//         logoutUser,
//         isAdmin
//     };

//     return (
//         <UserContext.Provider value={contextValue}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUserContext = () => {
//     const context = useContext(UserContext);
//     if (context === undefined) {
//         throw new Error('useUserContext must be used within a UserProvider');
//     }
//     return context;
// };

// export const useUser = () => useUserContext();

import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('userSession');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (typeof userData === 'object' && userData !== null) {
                    const normalizedUser = {
                        ...userData,
                        IsAdministrator: Boolean(userData.IsAdministrator),
                        isAdmin: Boolean(userData.IsAdministrator),
                        group_name: userData.group_name || '',
                        unit: userData.group_name || ''
                    };
                    setUser(normalizedUser);
                } else {
                    console.warn("Invalid user data in localStorage");
                    localStorage.removeItem('userSession');
                }
            }
        } catch (error) {
            console.error("Failed to parse user session:", error);
            localStorage.removeItem('userSession');
        } finally {
            setLoading(false);
        }
    }, []);

    const loginUser = (apiResponse) => {
        if (!apiResponse?.result?.[0]) {
            console.warn("Invalid API response format");
            return;
        }
        const apiUser = apiResponse.result[0];
        const normalizedUser = {
            ...apiUser,
            IsAdministrator: Boolean(apiUser.IsAdministrator),
            isAdmin: Boolean(apiUser.IsAdministrator),
            email: apiUser.Email,
            userName: apiUser.UserName,
            providerId: apiUser.provider_id,
            group_name: apiUser.group_name || '',
            unit: apiUser.group_name || '',
            fullName: apiUser.surname,
            firstname: apiUser.firstname,
            surname: apiUser.surname
        };
        setUser(normalizedUser);
        localStorage.setItem('userSession', JSON.stringify(normalizedUser));
        setLoading(false);
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('userSession');
        localStorage.removeItem('rememberMe');
        setLoading(false);
    };

    const isAdmin = () => {
        if (!user) return false;
        return Boolean(user.isAdmin);
    };

    const contextValue = {
        user,
        loading,
        loginUser,
        logoutUser,
        isAdmin
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

export const useUser = () => useUserContext();