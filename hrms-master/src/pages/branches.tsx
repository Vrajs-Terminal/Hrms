import { useState } from 'react';
import {
    Plus, Map, ArrowUp, ArrowDown, GripVertical
} from 'lucide-react';
import './branches.css';

interface Branch {
    id: number;
    name: string;
    code: string;
    type: 'Metro' | 'Non-Metro';
}

export default function Branches() {
    const [branches, setBranches] = useState<Branch[]>([
        { id: 1, name: 'Delhi Head Office', code: 'DEL-HQ-01', type: 'Metro' },
        { id: 2, name: 'Mumbai Branch', code: 'MUM-02', type: 'Metro' },
        { id: 3, name: 'Pune Development Center', code: 'PUNE-03', type: 'Non-Metro' }
    ]);

    const [newBranch, setNewBranch] = useState({
        name: '',
        code: '',
        type: 'Metro' as 'Metro' | 'Non-Metro',
    });

    const [isReordering, setIsReordering] = useState(false);

    const handleAddBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBranch.name && newBranch.code) {
            setBranches([...branches, { id: Date.now(), ...newBranch }]);
            setNewBranch({ name: '', code: '', type: 'Metro' });
            alert("Branch Added Successfully");
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

                                    {isReordering && (
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
