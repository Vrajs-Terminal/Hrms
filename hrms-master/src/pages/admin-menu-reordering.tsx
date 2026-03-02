import { useState, useEffect } from 'react';
import { GripVertical, Save, ChevronUp, ChevronDown, LayoutDashboard, Settings, Users, Calculator, Activity, RefreshCcw, Megaphone, ClipboardList, BarChart2, Factory, BookOpen, Monitor, Grid, Headphones, Loader2 } from 'lucide-react';
import './admin-menu-reordering.css';

interface MenuItem {
    id: string;
    name: string;
    iconName: string;
    order: number;
}

const getDefaultMenuItems = (): MenuItem[] => {
    return [
        { id: '1', name: 'Dashboard', iconName: 'LayoutDashboard', order: 1 },
        { id: '2', name: 'Company Settings', iconName: 'Settings', order: 2 },
        { id: '3', name: 'Core HRMS', iconName: 'Users', order: 3 },
        { id: '4', name: 'Finance & Accounting', iconName: 'Calculator', order: 4 },
        { id: '5', name: 'Productivity & Tracking', iconName: 'Activity', order: 5 },
        { id: '6', name: 'CRM', iconName: 'RefreshCcw', order: 6 },
        { id: '7', name: 'Effective Communication', iconName: 'Megaphone', order: 7 },
        { id: '8', name: 'Orders & Visits', iconName: 'ClipboardList', order: 8 },
        { id: '9', name: 'Analytics & Reports', iconName: 'BarChart2', order: 9 },
        { id: '10', name: 'Industry Modules', iconName: 'Factory', order: 10 },
        { id: '11', name: 'Knowledge Center', iconName: 'BookOpen', order: 11 },
        { id: '12', name: 'Assets & Resources', iconName: 'Monitor', order: 12 },

        { id: '13', name: 'Other Utilities', iconName: 'Grid', order: 13 },
        { id: '14', name: 'Contact Support Team', iconName: 'Headphones', order: 14 },
    ];
};

const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case 'LayoutDashboard': return LayoutDashboard;
        case 'Settings': return Settings;
        case 'Users': return Users;
        case 'Calculator': return Calculator;
        case 'Activity': return Activity;
        case 'RefreshCcw': return RefreshCcw;
        case 'Megaphone': return Megaphone;
        case 'ClipboardList': return ClipboardList;
        case 'BarChart2': return BarChart2;
        case 'Factory': return Factory;
        case 'BookOpen': return BookOpen;
        case 'Monitor': return Monitor;
        case 'Grid': return Grid;
        case 'Headphones': return Headphones;
        default: return Grid;
    }
};

export default function AdminMenuReordering() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5001/api/settings/ADMIN_MENU_ORDER');
            if (res.ok) {
                const data = await res.json();
                if (data && data.value && Array.isArray(data.value)) {
                    setMenuItems(data.value);
                } else {
                    setMenuItems(getDefaultMenuItems());
                }
            } else {
                setMenuItems(getDefaultMenuItems());
            }
        } catch (error) {
            console.error("Error loading menu order", error);
            setMenuItems(getDefaultMenuItems());
        } finally {
            setIsLoading(false);
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === menuItems.length - 1)
        ) {
            return;
        }

        const newItems = [...menuItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap items
        const temp = newItems[index];
        newItems[index] = newItems[targetIndex];
        newItems[targetIndex] = temp;

        // Update order numbers sequentially
        newItems.forEach((item, i) => {
            item.order = i + 1;
        });

        setMenuItems(newItems);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('http://localhost:5001/api/settings/ADMIN_MENU_ORDER', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: menuItems })
            });

            if (res.ok) {
                alert('Menu order saved successfully!');
                // Dispatch event so Sidebar can auto-refresh
                window.dispatchEvent(new Event('menuOrderChanged'));
            } else {
                alert('Failed to save menu order.');
            }
        } catch (error) {
            console.error("Error saving menu order", error);
            alert('Network error while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="menu-reorder-layout">
            <div className="reorder-container">
                <div className="reorder-header">
                    <div className="reorder-header-info">
                        <h2>Admin Menu Reordering</h2>
                        <p>Customize the order of modules in the left sidebar.</p>
                    </div>
                    <button className="btn-primary" onClick={handleSave} disabled={isLoading || isSaving}>
                        {isSaving ? <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        {isSaving ? 'Saving...' : 'Save Order'}
                    </button>
                </div>

                <div className="menu-list">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                            <Loader2 className="spinner" size={24} style={{ margin: '0 auto', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                            <div style={{ marginTop: '10px' }}>Loading menu configuration...</div>
                        </div>
                    ) : menuItems.map((item, index) => {
                        const Icon = getIconComponent(item.iconName);
                        return (
                            <div key={item.id} className="menu-item-row">
                                <div className="menu-item-left">
                                    <div className="drag-handle" title="Drag to reorder (Coming Soon)">
                                        <GripVertical size={18} />
                                    </div>
                                    <div className="menu-icon-wrapper">
                                        <Icon size={18} />
                                    </div>
                                    <div className="menu-item-name">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="menu-item-actions">
                                    <div className="order-badge">
                                        {item.order}
                                    </div>
                                    <div className="move-buttons">
                                        <button
                                            className="move-btn"
                                            disabled={index === 0}
                                            onClick={() => moveItem(index, 'up')}
                                            title="Move Up"
                                        >
                                            <ChevronUp size={16} />
                                        </button>
                                        <button
                                            className="move-btn"
                                            disabled={index === menuItems.length - 1}
                                            onClick={() => moveItem(index, 'down')}
                                            title="Move Down"
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
