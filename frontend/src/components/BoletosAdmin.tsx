'use client'; // Adicione essa linha no topo do arquivo

import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaTrash } from 'react-icons/fa';
import { MdEditSquare, MdGroups } from 'react-icons/md';
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb';
import { IoIosAdd } from 'react-icons/io';
import { GiOfficeChair } from 'react-icons/gi';
import axios from 'axios';
//import { cookies } from 'next/headers';
import Select from "react-select"

const BoletosAdmin = () => {
    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [ordenacao, setOrdenacao] = useState({ coluna: null, ascendente: true });
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [arquivo, setArquivo] = useState(null)
    const [atualPage, setAtualPage] = useState(1);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [boletoId, setBoletoId] = useState(null);
    const [editTitulo, setEditTitulo] = useState('');
    const [editVencimento, setEditVencimento] = useState('');
    const [editArquivo, setEditArquivo] = useState(null)
    const [arquivoAtual, setArquivoAtual] = useState(null)
    const [usuario, setUsuario] = useState([])
    const [selectUsuario, setSelectUsuario] = useState(null)


    const token = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];

    useEffect(() => {
        axios.get('http://localhost:5001/api/boleto', {
            headers: {
                "authorization": `${token}`
            }
        })
            .then(response => {
                setDados(response.data);
                setDadosFiltrados(response.data);
                console.log("Deu certo")
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
                alert('Erro ao buscar dados da API: ' + error.message);
            });
    }, [token]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/usuario/all', {
            headers: {
                "authorization": `${token}`
            }
        })
            .then(response => {
                setUsuario(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [token]);

    const handleUsuarioChange = (selectedUsuario) => {
        setSelectUsuario(selectedUsuario)
    }

    const btnAlterar = (sistema) => {
        setSistemaId(sistema._id)
        setEditNome(sistema.nome);
        setEditDepartamento(sistema.descricao);
        setArquivoAtual(sistema.documentacaoAr);
        setIsEditOpen(true);
    };

    const btnDeletar = (id) => {
        axios.delete(`http://localhost:5001/api/sistema/${id}`, {
            headers: {
                "authorization": `${token}`
            }
        })
            .then(response => {
                setDadosFiltrados(prevData => prevData.filter(item => item._id !== id));
                alert(`Item com ID ${id} deletado com sucesso!`);
                setItemToDelete(null)
            })
            .catch(error => {
                console.error(`Erro ao deletar item com ID ${id}:`, error);
                alert(`Erro ao deletar item com ID ${id}: ` + error.message);
            });
    };

    const handleDownload = (id) => {
        axios.get(`http://localhost:5001/api/sistema/${id}/download`, {
            headers: {
                "authorization": `${token}`
            },
            responseType: 'blob' // Isso é necessário para lidar com a resposta do arquivo
        })
            .then(response => {
                // Cria um link temporário para o download do arquivo
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `documento.pdf`); // Nome do arquivo a ser baixado
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error(`Erro ao baixar o arquivo do sistema com ID ${id}:`, error);
                alert(`Erro ao baixar o arquivo do sistema com ID ${id}: ` + error.message);
            });
    };


    const btnDelete = (id) => {
        setItemToDelete(id);
    };

    const handleFiltroChange = (event) => {
        const valorFiltro = event.target.value;
        setFiltro(valorFiltro);
        const dadosFiltrados = dados.filter(item =>
            item.nome.toLowerCase().includes(valorFiltro.toLowerCase()) ||
            item.descricao.toLowerCase().includes(valorFiltro.toLowerCase())
        );
        setDadosFiltrados(dadosFiltrados);
    };

    const funcOrdenacao = (coluna) => {
        setOrdenacao(prevState => ({
            coluna,
            ascendente: prevState.coluna === coluna ? !prevState.ascendente : true
        }));

        const ordenarPor = (a, b) => {
            if (a[coluna] < b[coluna]) return -1;
            if (a[coluna] > b[coluna]) return 1;
            return 0;
        };

        const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
            const multiplicador = ordenacao.ascendente ? 1 : -1;
            return multiplicador * ordenarPor(a, b);
        });

        setDadosFiltrados(dadosOrdenados);
    };

    const EnviarFormulario = async (e) => {
        e.preventDefault();

        // const sistemaData = {
        //     nome,
        //     descricao: departamento,
        //     arquivo: arquivo
        // };

        const usuarioData = new FormData();
        usuarioData.append('titulo', titulo);
        usuarioData.append('vencimento', vencimento);
        usuarioData.append('usuario', usuario)
        usuarioData.append('boletoAr', arquivo);

        try {
            const response = await axios.post('http://localhost:5001/api/boleto', usuarioData, {
                headers: {
                    "authorization": `${token}`
                }
            });

            if (response.status === 201) {
                const result = response.data;
                setDados([...dados, result]);
                setDadosFiltrados([...dados, result]);
                setIsOpen(false);
                setTitulo('');
                setVencimento('');
                setArquivo(null)
                alert('Cadastro realizado com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao cadastrar. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar. Por favor, tente novamente.');
        }
    };

    const AlterarFormulario = async (e) => {
        e.preventDefault();

        // const sistemaData = {
        //     nome: editNome,
        //     descricao: editDepartamento,
        //     arquivo: editArquivo
        // };

        const sistemaData = new
        
         FormData();
        sistemaData.append('nome', editNome);
        sistemaData.append('descricao', editDepartamento);
        sistemaData.append('documentacaoAr', editArquivo);

        try {
            const response = await axios.put(`http://localhost:5001/api/sistema/${sistemaId}`, sistemaData, {
                headers: {
                    "authorization": `${token}`
                }
            });

            if (response.status === 200) {
                const result = response.data;
                setDados(prevData => prevData.map(item => (item._id === sistemaId ? { ...item, ...result } : item)));
                setDadosFiltrados(prevData => prevData.map(item => (item._id === sistemaId ? { ...item, ...result } : item)));
                setIsEditOpen(false);
                setEditNome('');
                setEditDepartamento('');
                setEditArquivo(null)
                alert('Alteração realizada com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao alterar. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao alterar. Por favor, tente novamente.');
        }
    };

    const itemsPorPage = 10;
    const totalPages = Math.ceil(dadosFiltrados.length / itemsPorPage);

    const getPaginatedData = () => {
        const inicial = (atualPage - 1) * itemsPorPage;
        const final = inicial + itemsPorPage;
        return dadosFiltrados.slice(inicial, final);
    };

    const proximaPage = () => {
        setAtualPage(anteriorPage => Math.min(anteriorPage + 1, totalPages));
    };

    const anteriorPage = () => {
        setAtualPage(anteriorPage => Math.max(anteriorPage - 1, 1));
    };

    const numeroLinha = (index) => {
        return (atualPage - 1) * itemsPorPage + index + 1;
    };

    return (
        <div>
            <div className="p-5">
                <div className="flex justify-between mb-4">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Buscar Sistema..."
                            className="border pl-2 pr-2 rounded mr-2"
                            value={filtro}
                            onChange={handleFiltroChange}
                        />
                        <button className="bg-[#4F46E5] text-white p-4 rounded mr-2" title="Ordenar por Nome" onClick={() => funcOrdenacao('nome')}>
                            <FaArrowDown />
                        </button>
                        <button className="bg-[#4F46E5] text-white p-4 rounded" title="Ordenar por Departamento" onClick={() => funcOrdenacao('descricao')}>
                            <MdGroups />
                        </button>
                    </div>
                    <div className="flex bg-[#4F46E5] text-white p-0 rounded items-center justify-center pr-2 pl-1 cursor-pointer"
                        title='Cadastrar Sistema'
                        onClick={() => setIsOpen(true)}>
                        <div>
                            <IoIosAdd />
                        </div>
                        <div>
                            Cadastrar
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">#</th>
                                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => funcOrdenacao('titulo')}>Titulo</th>
                                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => funcOrdenacao('vencimento')}>Vencimento</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Usuario</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Data Criação</th>
                                <th className="py-2 px-4 border-b">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedData().map((boleto, index) => (
                                <tr key={boleto._id}>
                                    <td className="py-2 px-4 border-b">{numeroLinha(index)}</td>
                                    <td className="py-2 px-4 border-b">{boleto.titulo}</td>
                                    <td className="py-2 px-4 border-b">{boleto.vencimento}</td>
                                    <td className="py-2 px-4 border-b">{boleto.usuario}</td>
                                    <td className="py-2 px-4 border-b">{new Date(boleto.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="bg-blue-500 text-white p-2 rounded mr-2" title="Editar" onClick={() => btnAlterar(sistema)}>
                                            <MdEditSquare />
                                        </button>
                                        <button className="bg-red-500 text-white p-2 rounded" title="Deletar" onClick={() => btnDelete(sistema._id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <button
                        className="bg-[#4F46E5] text-white p-2 rounded"
                        onClick={anteriorPage}
                        disabled={atualPage === 1}
                    >
                        <TbPlayerTrackPrevFilled />
                    </button>
                    <span className="self-center pr-3 pl-3">
                        {atualPage} de {totalPages}
                    </span>
                    <button
                        className="bg-[#4F46E5] text-white p-2 rounded"
                        onClick={proximaPage}
                        disabled={atualPage === totalPages}
                    >
                        <TbPlayerTrackNextFilled />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-xl mb-4">Cadastrar Boleto</h2>
                        <form onSubmit={EnviarFormulario}>
                            <div className="mb-4">
                                <label htmlFor="titulo" className="block font-bold mb-2">Titulo</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="vencimento" className="block font-bold mb-2">Vencimento</label>
                                <input
                                    id="vencimento"
                                    type="date"
                                    className="border p-2 rounded w-full"
                                    value={vencimento}
                                    onChange={e => setVencimento(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="usuario" className="block font-bold mb-2">Usuário</label>
                                <Select
                                    options={usuario.map((usuario) => ({ value: usuario.nome, label: usuario.nome }))}
                                    value={selectUsuario}
                                    onChange={handleUsuarioChange}
                                    isMulti={false}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="arquivo" className="block font-bold mb-2">Boleto Arquivo</label>
                                <input
                                    id="arquivo"
                                    type="file"
                                    className="border p-2 rounded w-full"
                                    //value={arquivo}
                                    onChange={e => setArquivo(e.target.files[0])}
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white p-2 rounded"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-500 text-white p-2 rounded"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {itemToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50d">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-xl mb-4">Confirmação</h2>
                        <p>Tem certeza de que deseja excluir este item?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-500 text-white p-2 rounded"
                                onClick={() => setItemToDelete(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-red-500 text-white p-2 rounded"
                                onClick={() => btnDeletar(itemToDelete)}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-xl mb-4">Editar Sistema</h2>
                        <form onSubmit={AlterarFormulario}>
                            <div className="mb-4">
                                <label htmlFor="nome" className="block font-bold mb-2">Nome</label>
                                <input
                                    id="nome"
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={editNome}
                                    onChange={e => setEditNome(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="descricao" className="block font-bold mb-2">Descrição</label>
                                <input
                                    id="descricao"
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={editDepartamento}
                                    onChange={e => setEditDepartamento(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="arquivo" className="block font-bold mb-2">Documentação Arquivo</label>
                                <input
                                    id="arquivo"
                                    type="file"
                                    className="border p-2 rounded w-full"
                                    //value={editArquivo}
                                    onChange={e => setEditArquivo(e.target.files[0])}
                                />
                                {arquivoAtual && (
                                    <div className="mt-2">
                                        <div onClick={() => handleDownload(sistemaId)} className="text-blue-500 hover:underline cursor-pointer">
                                            Baixar arquivo atual
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white p-2 rounded"
                                    onClick={() => setIsEditOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-500 text-white p-2 rounded"
                                >
                                    Editar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoletosAdmin;
