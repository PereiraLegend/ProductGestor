// pages/admin/systems.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

const AdminSystems = () => {
  const [systems, setSystems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/sistema')
      .then(response => {
        setSystems(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Sistemas</h1>
        {/* Implementar a exibição dos sistemas e funcionalidades de CRUD aqui */}
      </div>
    </Layout>
  );
};

export default AdminSystems;
