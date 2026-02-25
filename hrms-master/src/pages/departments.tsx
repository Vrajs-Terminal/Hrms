import { useState } from 'react';
import {
    Plus, GripVertical, Building2, Layers, ChevronLeft, ChevronRight
} from 'lucide-react';
import './departments.css';

interface Department {
    id: number;
    name: string;
}

interface BranchGroup {
    branchId: number;
    branchName: string;
    branchCode: string;
    departments: Department[];
}

export default function Departments() {
    // Initial State: Departments linked within Branches
    const [branchGroups, setBranchGroups] = useState<BranchGroup[]>([
        {
            branchId: 1,
            branchName: 'Delhi Head Office',
            branchCode: 'DEL-HQ-01',
            departments: [
                { id: 101, name: 'Human Resources' },
                { id: 102, name: 'Engineering' },
                { id: 103, name: 'Sales' }
            ]
        },
        {
            branchId: 2,
            branchName: 'Mumbai Branch',
            branchCode: 'MUM-02',
            departments: [
                { id: 201, name: 'Marketing' },
                { id: 202, name: 'Operations' }
            ]
        }
    ]);

    // Form State
    const [selectedBranchId, setSelectedBranchId] = useState<number>(branchGroups[0]?.branchId || 0);
    const [deptCount, setDeptCount] = useState<number>(1);
    const [newDepartments, setNewDepartments] = useState<string[]>(['']);

    // Toggle Reorder Mode
    const [isReordering, setIsReordering] = useState(false);

    const moveDept = (branchId: number, deptIndex: number, direction: 'left' | 'right') => {
        setBranchGroups(prevGroups => prevGroups.map(group => {
            if (group.branchId !== branchId) return group;

            const newDepts = [...group.departments];
            if (direction === 'left' && deptIndex > 0) {
                [newDepts[deptIndex - 1], newDepts[deptIndex]] = [newDepts[deptIndex], newDepts[deptIndex - 1]];
            } else if (direction === 'right' && deptIndex < newDepts.length - 1) {
                [newDepts[deptIndex + 1], newDepts[deptIndex]] = [newDepts[deptIndex], newDepts[deptIndex + 1]];
            }
            return { ...group, departments: newDepts };
        }));
    };

    const handleDeptCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value) || 1;
        const validCount = Math.max(1, count); // At least 1
        setDeptCount(validCount);

        // Adjust the inputs array length safely
        if (validCount > newDepartments.length) {
            setNewDepartments([...newDepartments, ...Array(validCount - newDepartments.length).fill('')]);
        } else {
            setNewDepartments(newDepartments.slice(0, validCount));
        }
    };

    const handleDeptNameChange = (index: number, value: string) => {
        const updated = [...newDepartments];
        updated[index] = value;
        setNewDepartments(updated);
    };

    const handleAddDepartments = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out empty names
        const validNames = newDepartments.filter(n => n.trim() !== '');
        if (validNames.length === 0) {
            alert("Please enter at least one department name.");
            return;
        }

        const updatedGroups = branchGroups.map(group => {
            if (group.branchId === selectedBranchId) {
                const newObjs = validNames.map((name, i) => ({
                    id: Date.now() + i, // Generate unique IDs
                    name: name.trim()
                }));
                return { ...group, departments: [...group.departments, ...newObjs] };
            }
            return group;
        });

        setBranchGroups(updatedGroups);

        // Reset form
        setDeptCount(1);
        setNewDepartments(['']);
        alert("Departments Added Successfully");
    };

    return (
        <div className="dept-container setup-container">
            <div className="dept-header setup-header">
                <div>
                    <h1>Departments</h1>
                    <p>Organize internal departments linked to specific branches</p>
                </div>
                <div className="actions-row">
                    <button className={`btn-secondary ${isReordering ? 'active-reorder' : ''}`} onClick={() => setIsReordering(!isReordering)}>
                        <GripVertical size={16} />
                        {isReordering ? 'Done Reordering' : 'Change Order'}
                    </button>
                </div>
            </div>

            <div className="dept-layout">
                {/* Visual Branch -> Departments Grouping */}
                <div className="branch-groups">
                    {branchGroups.map((group) => (
                        <div className="branch-group-card" key={group.branchId}>
                            <div className="bgc-header">
                                <h3><Building2 size={18} color="#3b82f6" /> {group.branchName} <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 400 }}>({group.branchCode})</span></h3>
                                <span className="bgc-badge">{group.departments.length} Departments</span>
                            </div>

                            <div className="dept-grid">
                                {group.departments.map((dept, deptIndex) => (
                                    <div className="dept-item-box" key={dept.id}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Layers size={16} color="#94a3b8" />
                                            <span>{dept.name}</span>
                                        </div>
                                        {isReordering && (
                                            <div className="sort-actions-hz">
                                                <button
                                                    style={{ border: 'none', background: 'transparent', cursor: deptIndex === 0 ? 'not-allowed' : 'pointer', padding: '4px' }}
                                                    onClick={() => moveDept(group.branchId, deptIndex, 'left')}
                                                    disabled={deptIndex === 0}
                                                >
                                                    <ChevronLeft size={16} color={deptIndex === 0 ? '#cbd5e1' : '#64748b'} />
                                                </button>
                                                <button
                                                    style={{ border: 'none', background: 'transparent', cursor: deptIndex === group.departments.length - 1 ? 'not-allowed' : 'pointer', padding: '4px' }}
                                                    onClick={() => moveDept(group.branchId, deptIndex, 'right')}
                                                    disabled={deptIndex === group.departments.length - 1}
                                                >
                                                    <ChevronRight size={16} color={deptIndex === group.departments.length - 1 ? '#cbd5e1' : '#64748b'} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {group.departments.length === 0 && (
                                    <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No departments linked yet.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form to Add Multiple Departments */}
                <div className="dept-form-card" id="dept-form">
                    <h3>Add New Departments</h3>
                    <form onSubmit={handleAddDepartments}>
                        <div className="form-group">
                            <label>Select Branch *</label>
                            <select
                                value={selectedBranchId}
                                onChange={(e) => setSelectedBranchId(parseInt(e.target.value))}
                                required
                            >
                                {branchGroups.map(bg => (
                                    <option key={bg.branchId} value={bg.branchId}>
                                        {bg.branchName} ({bg.branchCode})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>How many departments to create?</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={deptCount}
                                onChange={handleDeptCountChange}
                                required
                            />
                        </div>

                        <div className="dept-inputs-container" style={{ marginTop: '20px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                                Department Names
                            </label>
                            {newDepartments.map((deptName, index) => (
                                <div className="dept-input-row" key={index}>
                                    <span>{index + 1}</span>
                                    <input
                                        type="text"
                                        placeholder={`e.g.Sales Team ${index + 1} `}
                                        value={deptName}
                                        onChange={(e) => handleDeptNameChange(index, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn-save" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}>
                            <Plus size={18} />
                            Save {deptCount > 1 ? `${deptCount} Departments` : 'Department'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
