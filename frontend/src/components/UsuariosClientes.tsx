'use client'

import axios from "axios";
import { useEffect, useState } from "react";

const UsuariosCliente = () => {
    const [dados, setDados] = useState([])
    const [sistema, setSistemas] = useState([])

    const token = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
    
    useEffect(() => {
        axios.get('http://localhost:5001/api/usuario/me', {
            headers: {
                "authorization": `${token}`
            }
        })
        .then(response => {
            setDados(response.data)
            const sistemas = response.data.sistema.map(sublist => sublist)
            setSistemas(sistemas || [])
            console.log("Dados carregados com sucesso!")
        })
        .catch(error => {
            console.error(`Error ao buscar dados da API: ${error}`)
            alert(`Erro a carregar os dados da página: ${error.message}`)
        })
    }, [token])

    console.log("dados: ",dados)

    return(
        <div>
            <div className="bg-blue-400 p-2 rounded-lg mt-4">
                    <div className="font-bold text-lg">
                        Sistema(s) do Cliente:
                    </div>
                    <div className="flex">
                        {sistema.length > 0 ? (
                            sistema.map((sistema, index) => (
                                <div className="ml-1 mr-1 p-1 rounded-lg bg-slate-200" key={index}>{sistema}</div>
                            ))
                        ) : (
                            <div> Nenhum sistema encontrado</div>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-between">
                    <div className="bg-yellow-200 p-2 rounded-lg mt-4 w-[49%]">
                        <div className="font-bold">
                            Documentações:
                        </div>
                        <div>
                            Documentações ...
                        </div>
                    </div>

                    <div className="bg-yellow-200 p-2 rounded-lg mt-4 w-[49%]">
                        <div className="font-bold">
                            Boletos:
                        </div>
                        <div>
                            Boletos...
                        </div>
                    </div>
                </div>

                <div className="bg-green-200 p-2 mt-4 rounded-lg">
                    <div className="font-bold">
                        Postagens:
                    </div>
                    <div>
                        Postagens...
                    </div>
                </div>

        </div>
    )
}
export default UsuariosCliente