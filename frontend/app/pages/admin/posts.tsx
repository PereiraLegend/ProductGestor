// pages/admin/posts.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/post')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Posts</h1>
        {/* Implementar a exibição dos posts e funcionalidades de CRUD aqui */}
      </div>
    </Layout>
  );
};

export default AdminPosts;
