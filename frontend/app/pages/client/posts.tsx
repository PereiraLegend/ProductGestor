// pages/client/posts.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

const ClientPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/post')
      .then(response => {
        setPosts(response.data);
        setFilteredPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, selectedSystem]);

  const filterPosts = () => {
    let filtered = posts;
    if (selectedSystem) {
      filtered = filtered.filter(post => post.sistema === selectedSystem);
    }
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.titulo.toLowerCase().includes(searchTermLower) || 
        post.descricao.toLowerCase().includes(searchTermLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }
    setFilteredPosts(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Meus Posts</h1>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por título, descrição ou tag"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todos os sistemas</option>
            {/* Inserir opções de sistemas aqui */}
          </select>
        </div>
        {filteredPosts.length === 0 ? (
          <p>Nenhum post encontrado.</p>
        ) : (
          filteredPosts.map(post => (
            <div key={post._id} className="mb-4 p-4 border rounded">
              <h2 className="text-xl font-bold">{post.titulo}</h2>
              <p>{post.descricao}</p>
              <p className="text-sm text-gray-500">{post.tags.join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ClientPosts;
