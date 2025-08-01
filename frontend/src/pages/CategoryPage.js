import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CategoryPage() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:3001/netsuite/classification', {
                params: { parent: true, parentId: id },
            })
            .then((res) => setItems(res.data))
            .catch((err) => {
                // console.error(err);
                setError('Failed to fetch category data');
            });
    }, [id]);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Category: {id}</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="list-disc list-inside space-y-2">
                {items.map((item, idx) => (
                    <li key={idx}>{item.name || 'Unnamed item'}</li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryPage;
