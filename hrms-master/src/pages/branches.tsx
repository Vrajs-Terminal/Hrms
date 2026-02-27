import { useState, useEffect } from 'react';
import {
    Plus, Map, ArrowUp, ArrowDown, GripVertical, Trash2, Check, X
} from 'lucide-react';
import api from '../lib/axios';
import './branches.css';

interface Branch {
    id: number;
    name: string;
    code: string;
    type: 'Metro' | 'Non-Metro';
}

export default function Branches() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(res.data);
        } catch (error) {
            console.error('Failed to fetch branches', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const [newBranch, setNewBranch] = useState({
        name: '',
        code: '',
        type: 'Metro' as 'Metro' | 'Non-Metro',
    });

    const [isReordering, setIsReordering] = useState(false);

    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleAddBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newBranch.name && newBranch.code) {
            try {
                const res = await api.post('/branches', newBranch);
                setBranches([...branches, res.data]);
                setNewBranch({ name: '', code: '', type: 'Metro' });
            } catch (error: any) {
                alert(error.response?.data?.error || 'Failed to add branch');
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/branches/${id}`);
            setBranches(branches.filter(b => b.id !== id));
            setDeletingId(null);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete branch');
            setDeletingId(null);
        }
    };

    const moveBranch = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            const newBranches = [...branches];
            [newBranches[index - 1], newBranches[index]] = [newBranches[index], newBranches[index - 1]];
            setBranches(newBranches);
        } else if (direction === 'down' && index < branches.length - 1) {
            const newBranches = [...branches];
            [newBranches[index + 1], newBranches[index]] = [newBranches[index], newBranches[index + 1]];
            setBranches(newBranches);
        }
    };

    if (isLoading) {
        return <div className="branches-container setup-container" style={{ padding: '2rem' }}>Loading branches...</div>;
    }

    return (
        <div className="branches-container setup-container">
            <div className="branches-header setup-header">
                <div>
                    <h1>Branches</h1>
                    <p>Manage all your company branches and locations</p>
                </div>
                <div className="actions-row">
                    <button className={`btn-secondary ${isReordering ? 'active-reorder' : ''}`} onClick={() => setIsReordering(!isReordering)}>
                        <GripVertical size={16} />
                        {isReordering ? 'Done Reordering' : 'Change Order'}
                    </button>
                </div>
            </div>

            <div className="branches-layout">
                {/* Branches List */}
                <div className="branches-list-card">
                    <div className="branches-list">
                        {branches.map((branch, index) => (
                            <div className="branch-item" key={branch.id}>
                                <div className="bi-left">
                                    <div className="bi-icon">
                                        <Map size={20} />
                                    </div>
                                    <div className="bi-details">
                                        <h4>{branch.name}</h4>
                                        <p>Code: {branch.code}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span className={`bi-type-badge ${branch.type.toLowerCase()}`}>
                                        {branch.type}
                                    </span>

                                    {isReordering ? (
                                        <div className="sort-actions">
                                            <button
                                                style={{ border: 'none', background: 'transparent', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                                                onClick={() => moveBranch(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                <ArrowUp size={14} color={index === 0 ? '#cbd5e1' : '#64748b'} />
                                            </button>
                                            <button
                                                style={{ border: 'none', background: 'transparent', cursor: index === branches.length - 1 ? 'not-allowed' : 'pointer' }}
                                                onClick={() => moveBranch(index, 'down')}
                                                disabled={index === branches.length - 1}
                                            >
                                                <ArrowDown size={14} color={index === branches.length - 1 ? '#cbd5e1' : '#64748b'} />
                                            </button>
                                        </div>
                                    ) : deletingId === branch.id ? (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 500 }}>Delete?</span>
                                            <button onClick={() => handleDelete(branch.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#22c55e', padding: '4px' }} title="Confirm">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => setDeletingId(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', padding: '4px' }} title="Cancel">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeletingId(branch.id)}
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                            title="Delete Branch"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Branch Form Card */}
                <div className="branch-form-card" id="branch-form">
                    <h3>Add New Branch</h3>
                    <form onSubmit={handleAddBranch}>
                        <div className="form-group">
                            <label>Branch Name *</label>
                            <input
                                type="text"
                                value={newBranch.name}
                                onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                                required
                                placeholder="e.g. Noida Main Office"
                            />
                        </div>
                        <div className="form-group">
                            <label>Branch Code *</label>
                            <input
                                type="text"
                                value={newBranch.code}
                                onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                                required
                                placeholder="e.g. DEL-01"
                            />
                        </div>
                        <div className="form-group">
                            <label>Branch Type *</label>
                            <select
                                value={newBranch.type}
                                onChange={(e) => setNewBranch({ ...newBranch, type: e.target.value as 'Metro' | 'Non-Metro' })}
                                required
                            >
                                <option value="Metro">Metro</option>
                                <option value="Non-Metro">Non-Metro</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-save" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                            <Plus size={18} />
                            Save Branch
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
