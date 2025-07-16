import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [classifications, setClassifications] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('http://localhost:3001/netsuite/classification', {
                params: { parent: false },
            })
            .then((response) => {
                const data = response.data
                setClassifications(data);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch classifications');
            });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Classifications</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="list-disc list-inside space-y-2">
                {classifications.map((item, idx) => (
                    <li
                        key={idx}
                        className="cursor-pointer text-blue-600 hover:underline"
                        onClick={() => navigate(`/category/${item.id}`)}
                    >
                        {item.name || 'Unnamed classification'}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
