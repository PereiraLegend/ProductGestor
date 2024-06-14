import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "****" },
                password: { label: "Senha", type: "password", placeholder: "****" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                try {
                    const response = await fetch(`${process.env.API_URL}/usuario/login`, {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" },
                    });

                    if (response.status !== 200) {
                        return null;
                    }

                    const authData = await response.json();
                    console.log("token------:", authData.token);
                    console.log("email------:", authData.email);
                    console.log("regra------:", authData.regra);
                    console.log("nome-------:", authData.nome)

                    if (!authData.token || !authData.email) {
                        return null;
                    }

                    cookies().set("jwt", authData.token);
                    return {
                        id: authData.id,
                        name: authData.nome,
                        email: authData.email,
                        role: authData.regra,
                    };
                } catch (error) {
                    console.error(`Erro de autorização: ${error}`)
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            console.log("JWT Callback - Token:", token);
            return token;
        },
        async session({ session, token }) {
            if(token) {
                session.user.role = token.role;
            }
            console.log("Session Callback - Session:", session);
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
