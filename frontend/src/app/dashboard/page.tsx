import CabecalhoUser from "@/components/CabecalhoUser"
//import TesteSistemas from "@/components/TesteSistemas"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import UsuariosCliente from "@/components/UsuariosClientes"

export default async function dashboard() {
    const session = await getServerSession(authOptions)

    if (!session || session?.user?.role !== "USER") {
        redirect("/")
    }
    return (
        <div>
            <CabecalhoUser />
            <div className="pl-3 pr-3">
                <div className="flex items-center justify-center text-xl pt-5 font-bold">
                    Olá, seja bem vindo(a) {session?.user?.name}
                </div>

                <UsuariosCliente/>
            </div>
        </div>
    )
}