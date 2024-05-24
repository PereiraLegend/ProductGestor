import { createContext } from "react";
import { setCookie } from "nookies";
import { signInRequest } from ""

type AuthContextType = {
    isAuthenticated: boolean;
}

type SingInData = {
    nome: string,
    password: string
}

type User = {
    nome: string,
    password: string
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider ({ children }) {
    const [user, setUser] = useState<User | null>(null)

    const isAuthenticated = false

    async function singIn({nome, password}: SingInData) {
        const { token, user } = await signInRequest({
            nome,
            password
        })

        setCookie(undefined, 'blogchan.token', token, {
            maxAge: 60 * 60 * 1, //1 hora
        })

        setUser(user)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}