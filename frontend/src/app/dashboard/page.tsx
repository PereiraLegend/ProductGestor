import CabecalhoUser from "@/components/CabecalhoUser"
import TesteSistemas from "@/components/TesteSistemas"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function dashboard() {
    const session = await getServerSession(authOptions)

    if (!session || session?.user?.role !== "USER") {
        redirect("/")
    }
    return (
        <div>
            <CabecalhoUser />
            <div>Olá, {session?.user?.name}</div>
            <div>Dashboard User</div>
            <div><TesteSistemas /></div>
        </div>
    )
}