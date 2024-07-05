import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}: any) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}


export default function useTmAuth(){
    return useContext(AuthContext);
}