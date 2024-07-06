'use client'

import axios from "axios";
import { useEffect, useState } from "react";

const UsuariosCliente = () => {
    const [dados, setDados] = useState([]);
    const [sistema, setSistema] = useState([]);
    const [dadosPost, setDadosPost] = useState([]);
    const [postsFiltrados, setPostsFiltrados] = useState([]);

    const token = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];

    useEffect(() => {
        axios.get('http://localhost:5001/api/usuario/me', {
            headers: {
                "authorization": `${token}`
            }
        })
        .then(response => {
            console.log("Dados do usuário:", response.data);
            setDados(response.data);
            const sistemas = response.data.sistema.flat();
            setSistema(sistemas || []);
            console.log("Sistemas do usuário:", sistemas);
        })
        .catch(error => {
            console.error(`Erro ao buscar dados da API: ${error}`);
            alert(`Erro ao carregar os dados da página: ${error.message}`);
        });
    }, [token]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/post', {
            headers: {
                "authorization": `${token}`
            }
        })
        .then(response => {
            console.log("Dados dos posts:", response.data);
            setDadosPost(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [token]);

    useEffect(() => {
        if (sistema.length > 0 && dadosPost.length > 0) {
            console.log("Dados de post: ", dadosPost);
            console.log("Sistemas do usuário: ", sistema);

            const postsFiltrados = dadosPost.filter(post => {
                console.log("Verificando post:", post);
                const match = post.sistema.some(sistemaPost => {
                    console.log("Comparando sistemaPost:", sistemaPost, "com sistemas do usuário:", sistema);
                    return sistemaPost.some(subSistemaPost => sistema.includes(subSistemaPost));
                });
                console.log("Post match:", match);
                return match;
            });

            postsFiltrados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPostsFiltrados(postsFiltrados);
            console.log("Posts filtrados:", postsFiltrados);
        }
    }, [sistema, dadosPost]);

    const handleDownload = async (sistema) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/sistema/nome/${sistema}/id`, {
                headers: {
                    "authorization": `${token}`
                }
            });
            const { id } = response.data;
            
            const downloadResponse = await axios.get(`http://localhost:5001/api/sistema/${id}/download`, {
                headers: {
                    "authorization": `${token}`
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${sistema}-documentacao.pdf`); // Nome do arquivo de download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(`Erro ao buscar ID do sistema: ${error}`);
            alert(`Erro ao buscar ID do sistema: ${error.message}`);
        }
    };

    return (
        <div>
            <div className="bg-blue-300 p-2 rounded-lg mt-4">
                <div className="font-bold text-2xl pb-2">
                    Sistema(s) do Cliente:
                </div>
                <div className="flex pb-2 pl-1 ">
                    {sistema.length > 0 ? (
                        sistema.map((sistema, index) => (
                            <div className="ml-1 mr-1 p-1 rounded-lg bg-slate-200" key={index}>{sistema}</div>
                        ))
                    ) : (
                        <div>Nenhum sistema encontrado</div>
                    )}
                </div>
            </div>
                
            <div className="flex justify-between">
                <div className="bg-yellow-200 p-3 rounded-lg mt-4 w-[49%]">
                    <div className="font-bold text-2xl pb-2">
                        Documentações:
                    </div>
                    <div>
                        {sistema.length > 0 ? (
                            sistema.map((sistema, index) => (
                                <div key={index} className="mb-2">
                                    <button 
                                        className="bg-blue-500 text-white pt-1 pb-1 pl-2 pr-2 rounded hover:cursor-pointer hover:bg-blue-600"
                                        onClick={() => handleDownload(sistema)}
                                    >
                                        Baixar Documentação {sistema}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div>Nenhuma documentação encontrada</div>
                        )}
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

            <div className="bg-blue-300 p-2 mt-4 rounded-lg">
                <div className="font-bold text-2xl pt-2 pb-2 pl-2">
                    Postagens:
                </div>
                <div>
                    {postsFiltrados.length > 0 ? (
                        postsFiltrados.map((post, index) => (
                            <div key={index} className="mb-2 m-3 bg-slate-300 p-3 rounded-lg">
                                <div className="font-bold text-xl">{post.titulo}</div>
                                <div className="pt-2 pb-2">Sistema: {post.sistema}</div>
                                <div>{post.descricao}</div>
                                <div className="text-sm text-gray-700 pt-2 pb-2">{new Date(post.createdAt).toLocaleString()}</div>
                            </div>
                        ))
                    ) : (
                        <div>Nenhuma postagem encontrada</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UsuariosCliente;
