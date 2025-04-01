import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'react-router-dom';

const AdminReferralTree = () => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');
  const { userId } = useParams();

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/admin/referral-tree?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const { nodes, edges } = res.data;
        setElements([...nodes, ...edges]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tree:', err);
        setLoading(false);
      });
  }, [userId, token]);

  if (loading) return <p className="text-white p-6">Loading tree...</p>;

  return (
    <div className="h-screen bg-gray-900 p-4">
      <ReactFlow
        elements={elements}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnScroll
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default AdminReferralTree;
