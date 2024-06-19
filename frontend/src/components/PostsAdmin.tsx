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

const PostsAdmin = () => {
    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [ordenacao, setOrdenacao] = useState({ coluna: null, ascendente: true });
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    //const [email, setEmail] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tags, setTags] = useState('');
    const [atualPage, setAtualPage] = useState(1);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [postId, setPostId] = useState(null);
    const [editTitulo, setEditTitulo] = useState('');
    const [editDescricao, setEditDescricao] = useState('');
    const [editTag, setEditTag] = useState('');

    const [sistema, setSistema] = useState([])
    const [selectSistema, setSelectSistema] = useState(null)

    const token = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];

    useEffect(() => {
        axios.get('http://localhost:5001/api/post', {
            headers: {
                "authorization": `${token}`
            }
        })
            .then(response => {
                setDados(response.data);
                setDadosFiltrados(response.data);
                console.log("Dados carregados com sucesso");
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
                alert('Erro ao buscar dados da API: ' + error.message);
            });
    }, [token]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/sistema', {
            headers: {
                "authorization": `${token}`
            }
        })
            .then(response => {
                setSistema(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [token]);

    const handleSistemaChange = (selectedSistema) => {
        setSelectSistema(selectedSistema)
    }

    const btnAlterar = (post) => {
        setPostId(post._id);
        setEditTitulo(post.titulo);
        setEditDescricao(post.descricao);
        setEditTag(post.tags);
        setSelectSistema(post.sistema.map(sistema => ({ value: sistema, label: sistema })))
        setIsEditOpen(true);
    };

    const btnDeletar = (id) => {
        axios.delete(`http://localhost:5001/api/post/${id}`, {
            headers: {
                "authorization": `${token}`
            }
        })
            .then(response => {
                setDadosFiltrados(prevData => prevData.filter(item => item._id !== id));
                alert(`Usuário com ID ${id} deletado com sucesso!`);
                setItemToDelete(null);
            })
            .catch(error => {
                console.error(`Erro ao deletar usuário com ID ${id}:`, error);
                alert(`Erro ao deletar usuário com ID ${id}: ` + error.message);
            });
    };

    const btnDelete = (id) => {
        setItemToDelete(id);
    };

    const handleFiltroChange = (event) => {
        const valorFiltro = event.target.value;
        setFiltro(valorFiltro);
        const dadosFiltrados = dados.filter(item =>
            item.titulo.toLowerCase().includes(valorFiltro.toLowerCase()) ||
            item.tags.toLowerCase().includes(valorFiltro.toLowerCase())
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

        const sistemaLabels = Array.isArray(selectSistema) ? selectSistema.map(sistema => sistema.label) : [];
        // const sistemasSelecionados = selectSistema.map((sistema) => sistema.value);

        const postData = {
            titulo,
            descricao,
            tags,
            sistema: selectSistema ? selectSistema.value : null,
        };

        try {
            const response = await axios.post('http://localhost:5001/api/post', postData, {
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
                setDescricao('');
                setTags('');
                setSelectSistema(null)
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

        const sistemaLabels = Array.isArray(selectSistema) ? selectSistema.map(sistema => sistema.label) : [];

        const postData = {
            titulo: editTitulo,
            descricao: editDescricao,
            tags: editTag,
            sistema: selectSistema ? selectSistema.value : null,
        };

        try {
            const response = await axios.put(`http://localhost:5001/api/post/${postId}`, postData, {
                headers: {
                    "authorization": `${token}`
                }
            });

            if (response.status === 200) {
                const result = response.data;
                setDados(prevData => prevData.map(item => (item._id === postId ? { ...item, ...result } : item)));
                setDadosFiltrados(prevData => prevData.map(item => (item._id === postId ? { ...item, ...result } : item)));
                setIsEditOpen(false);
                setEditTitulo('');
                setEditDescricao('');
                setEditTag('');
                setSelectSistema([]);
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
                            placeholder="Buscar Usuário..."
                            className="border pl-2 pr-2 rounded mr-2"
                            value={filtro}
                            onChange={handleFiltroChange}
                        />
                        <button className="bg-[#4F46E5] text-white p-4 rounded mr-2" title="Ordenar por Titulo" onClick={() => funcOrdenacao('titulo')}>
                            <FaArrowDown />
                        </button>
                        <button className="bg-[#4F46E5] text-white p-4 rounded" title="Ordenar por Sistema" onClick={() => funcOrdenacao('sistema')}>
                            <MdGroups />
                        </button>
                    </div>
                    <div className="flex bg-[#4F46E5] text-white p-0 rounded items-center justify-center pr-2 pl-1 cursor-pointer"
                        title='Cadastrar Usuário'
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
                                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => funcOrdenacao('titulo')}>Post</th>
                                {/* <th className="py-2 px-4 border-b cursor-pointer" onClick={() => funcOrdenacao('descricao')}>Descricao</th> */}
                                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => funcOrdenacao('tags')}>Tags</th>
                                {/* <th className="py-2 px-4 border-b">Sistemas</th> */}
                                <th className="py-2 px-4 border-b">Data Criação</th>
                                <th className="py-2 px-4 border-b">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedData().map((post, index) => (
                                <tr key={post._id} className='flex-row justify-evenly'>
                                    <td className="py-2 px-4 border-b">{numeroLinha(index)}</td>
                                    <div className='flex flex-col pt-4'>
                                        <td className="py-2 px-4 text-xl">{post.titulo}</td>
                                        <td className="py-2 px-4 text-2sm text-gray-500">{post.sistema}</td>
                                        <td className="py-2 px-4 border-b">{post.descricao}</td>
                                    </div>
                                    <td className="py-2 px-4 border-b">{post.tags}</td>
                                    <td className="py-2 px-4 border-b">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="bg-blue-500 text-white p-2 rounded mr-2" title="Editar" onClick={() => btnAlterar(post)}>
                                            <MdEditSquare />
                                        </button>
                                        <button className="bg-red-500 text-white p-2 rounded" title="Deletar" onClick={() => btnDelete(post._id)}>
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
                        <h2 className="text-xl mb-4">Cadastrar Usuário</h2>
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
                                <label htmlFor="tags" className="block font-bold mb-2">Tags</label>
                                <input
                                    id="tags"
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="sistema" className="block font-bold mb-2">Sistema</label>
                                <Select
                                    options={sistema.map((sistema) => ({ value: sistema.nome, label: sistema.nome }))}
                                    value={selectSistema}
                                    onChange={handleSistemaChange}
                                    isMulti={false}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="descricao" className="block font-bold mb-2">Descrição</label>
                                <textarea
                                    id="descricao"
                                    type="text"
                                    className="border p-2 rounded w-full h-[200px]"
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-xl mb-4">Confirmação</h2>
                        <p>Tem certeza de que deseja excluir este usuário?</p>
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
                        <h2 className="text-xl mb-4">Editar Usuário</h2>
                        <form onSubmit={AlterarFormulario}>
                            <div className="mb-4">
                                <label htmlFor="titulo" className="block font-bold mb-2">Titulo</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={editTitulo}
                                    onChange={e => setEditTitulo(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="sistema" className="block font-bold mb-2">Sistemas</label>
                                <Select
                                    options={sistema.map((sistema) => ({ value: sistema.nome, label: sistema.nome }))}
                                    value={selectSistema}
                                    onChange={handleSistemaChange}
                                    isMulti={false}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="descricao" className="block font-bold mb-2">Descricao</label>
                                <textarea
                                    id="descricao"
                                    type="descricao"
                                    className="border p-2 rounded w-full h-[200px]"
                                    value={editDescricao}
                                    onChange={e => setEditDescricao(e.target.value)}
                                />
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

export default PostsAdmin;