// pages/register.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../components/Layout';

const Register = () => {
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [regra, setRegra] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/usuario/register', { nome, password, regra });
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <h1 className="text-xl font-bold mb-4">Registro</h1>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full mb-4 p-2 border rounded"
          />
          <select
            value={regra}
            onChange={(e) => setRegra(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Selecione a regra</option>
            <option value="Admin">Admin</option>
            <option value="Cliente">Cliente</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Registrar
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
