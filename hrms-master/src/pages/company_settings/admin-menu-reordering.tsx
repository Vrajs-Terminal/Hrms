import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, ChevronUp, ChevronDown, LayoutDashboard, Settings, Users, Calculator, Activity, RefreshCcw, Megaphone, ClipboardList, BarChart2, Factory, BookOpen, Monitor, Grid, Headphones, Loader2, MapPin, FileText, ListOrdered, Map } from 'lucide-react';
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
        { id: '3', name: 'Attendance', iconName: 'ClipboardList', order: 3 },
        { id: '4', name: 'Employee Tracking', iconName: 'MapPin', order: 4 },
        { id: '17', name: 'Daily Work Report', iconName: 'FileText', order: 5 },
        { id: '18', name: 'Visit Management', iconName: 'Map', order: 6 },
        { id: '5', name: 'Core HRMS', iconName: 'Users', order: 7 },
        { id: '6', name: 'Finance & Accounting', iconName: 'Calculator', order: 8 },
        { id: '7', name: 'Productivity & Tracking', iconName: 'Activity', order: 9 },
        { id: '8', name: 'CRM', iconName: 'RefreshCcw', order: 10 },
        { id: '9', name: 'Effective Communication', iconName: 'Megaphone', order: 11 },
        { id: '10', name: 'Orders & Visits', iconName: 'ClipboardList', order: 12 },
        { id: '11', name: 'Analytics & Reports', iconName: 'BarChart2', order: 13 },
        { id: '12', name: 'Industry Modules', iconName: 'Factory', order: 14 },
        { id: '13', name: 'Knowledge Center', iconName: 'BookOpen', order: 15 },
        { id: '14', name: 'Assets & Resources', iconName: 'Monitor', order: 16 },
        { id: '15', name: 'Other Utilities', iconName: 'Grid', order: 17 },
        { id: '16', name: 'Contact Support Team', iconName: 'Headphones', order: 18 },
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
        case 'MapPin': return MapPin;
        case 'FileText': return FileText;
        case 'Map': return Map;
        default: return Grid;
    }
};

interface SortableItemProps {
    item: MenuItem;
    index: number;
    totalCount: number;
    moveItem: (index: number, direction: 'up' | 'down') => void;
}

function SortableItem({ item, index, totalCount, moveItem }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    const Icon = getIconComponent(item.iconName);

    return (
        <div ref={setNodeRef} style={style} className={`menu-item-row ${isDragging ? 'dragging' : ''}`}>
            <div className="menu-item-left">
                <div className="drag-handle" {...attributes} {...listeners}>
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
                        disabled={index === totalCount - 1}
                        onClick={() => moveItem(index, 'down')}
                        title="Move Down"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminMenuReordering() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const baseItems = getDefaultMenuItems();
        try {
            const res = await api.get('/settings/ADMIN_MENU_ORDER');
            const data = res.data;

            if (data && Array.isArray(data) && data.length > 5) {
                const fetchedItems: MenuItem[] = [...data];

                // Self-heal: If Attendance was never saved in DB historically, inject it now!
                const hasAttendance = fetchedItems.some(item => item.name === 'Attendance');
                if (!hasAttendance) {
                    const attendanceItem: MenuItem = { id: '3', name: 'Attendance', iconName: 'ClipboardList', order: 3 };
                    // Find index of Company Settings to insert directly after
                    const companySettingsIndex = fetchedItems.findIndex(item => item.name === 'Company Settings');

                    if (companySettingsIndex !== -1) {
                        fetchedItems.splice(companySettingsIndex + 1, 0, attendanceItem);
                    } else {
                        fetchedItems.splice(2, 0, attendanceItem); // Fallback to index 2
                    }

                    // Re-evaluate orders
                    fetchedItems.forEach((item, i) => {
                        item.order = i + 1;
                    });
                }

                // Check if missing any other generic items too
                baseItems.forEach(baseItem => {
                    if (!fetchedItems.some(f => f.name === baseItem.name)) {
                        fetchedItems.push({ ...baseItem, order: fetchedItems.length + 1 });
                    }
                });

                // Force "Employee Tracking" to definitively reside at pos 4 (index 3)
                const trackingIndex = fetchedItems.findIndex(m => m.name === "Employee Tracking");
                if (trackingIndex !== -1 && trackingIndex !== 3) {
                    const [trackingItem] = fetchedItems.splice(trackingIndex, 1);
                    fetchedItems.splice(3, 0, trackingItem);
                }

                // Force "Daily Work Report" to definitively reside at pos 5 (index 4)
                const dwrIndex = fetchedItems.findIndex(m => m.name === "Daily Work Report");
                if (dwrIndex !== -1 && dwrIndex !== 4) {
                    const [dwrItem] = fetchedItems.splice(dwrIndex, 1);
                    fetchedItems.splice(4, 0, dwrItem);
                }

                // Force "Visit Management" to definitively reside at pos 6 (index 5)
                const visitIndex = fetchedItems.findIndex(m => m.name === "Visit Management");
                if (visitIndex !== -1 && visitIndex !== 5) {
                    const [visitItem] = fetchedItems.splice(visitIndex, 1);
                    fetchedItems.splice(5, 0, visitItem);
                }

                // Re-evaluate orders to ensure they are strictly sequential
                fetchedItems.forEach((item, i) => {
                    item.order = i + 1;
                });

                setMenuItems(fetchedItems);
            } else {
                setMenuItems(baseItems);
            }
        } catch (error) {
            console.error("Error loading menu order", error);
            setMenuItems(baseItems);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setMenuItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                const reordered = arrayMove(items, oldIndex, newIndex);

                // Update order numbers sequentially
                return reordered.map((item, i) => ({
                    ...item,
                    order: i + 1
                }));
            });
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
            await api.put('/settings/ADMIN_MENU_ORDER', menuItems);
            alert('Menu order saved successfully!');
            // Dispatch event so Sidebar can auto-refresh
            window.dispatchEvent(new Event('menuOrderChanged'));
        } catch (error) {
            console.error("Error saving menu order", error);
            alert('Failed to save menu order.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="menu-reorder-layout">
            <div className="reorder-container">
                <div className="reorder-header">
                    <div className="reorder-header-info">
                        <h2><ListOrdered className="page-title-icon" size="1em" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "8px", marginBottom: "2px" }} />Admin Menu Reordering</h2>
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
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={menuItems.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {menuItems.map((item, index) => (
                                    <SortableItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        totalCount={menuItems.length}
                                        moveItem={moveItem}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
}
