import React, { useState } from 'react';
import { Cpu, Activity, Zap, Shield, AlertTriangle, Settings, Wrench, ArrowRight, X, Plus, Trash2, MessageCircle, Bell } from 'lucide-react';
import './MachineryPage.css';


const getIcon = (name) => {
    switch (name) {
        case 'Cpu': return Cpu;
        case 'Zap': return Zap;
        case 'Settings': return Settings;
        case 'Activity': default: return Activity;
    }
};

export default function MachineryPage({ 
    machines = [], 
    onAdd, 
    onUpdate, 
    onDelete,
    currentUserEmail,
    onOpenChat,
    onOpenNotif,
    messages = [],
    onSendMessage,
    notifications = [],
    onMarkNotificationsRead,
    onIncrementView
}) {
    const unreadCount = notifications.filter(n => n && !n.read).length

    const handleOpenChatInternal = (target) => {
        onOpenChat(target)
    }

    const handleNotifClick = (notif) => {
        if (notif.type === 'message' && notif.chatTarget) {
            onOpenChat(notif.chatTarget)
        }
    }

    // Modals state
    const [modalView, setModalView] = useState(null) // 'add', 'schedule', 'config', 'delete_confirm'
    const [selectedMachine, setSelectedMachine] = useState(null)
    
    // Form state
    const [formData, setFormData] = useState({ name: '', type: '', status: 'Online', date: '', temp: '', rpm: '', hrs: '', util: '' })

    const handleAddMachine = (e) => {
        e.preventDefault()
        onAdd({
            name: formData.name,
            type: formData.type,
            status: formData.status,
            temp: formData.temp || 70, 
            rpm: formData.rpm || null, 
            hrs: formData.hrs || 0, 
            util: formData.util || 0,
        })
        closeModal()
    }

    const handleScheduleService = (e) => {
        e.preventDefault()
        if (selectedMachine) {
            onUpdate({ ...selectedMachine, lastService: `Scheduled for ${formData.date}` })
            closeModal()
        }
    }

    const handleConfigSave = (e) => {
        e.preventDefault()
        if (selectedMachine) {
            onUpdate({ 
                ...selectedMachine, 
                name: formData.name, 
                status: formData.status
            })
            closeModal()
        }
    }

    const openModal = (view, machine = null) => {
        setModalView(view)
        setSelectedMachine(machine)
        if (view === 'add') {
            setFormData({ name: '', type: '', status: 'Online', date: '', temp: '', rpm: '', hrs: '', util: '' })
        } else if (machine) {
            setFormData({ name: machine.name, type: machine.type, status: machine.status, date: '', temp: machine.temp || '', rpm: machine.rpm || '', hrs: machine.hrs || '', util: machine.util || '' })
        }
    }

    const closeModal = () => {
        setModalView(null)
        setSelectedMachine(null)
    }

    const avgHealth = machines.length > 0 ? Math.round(machines.reduce((acc, m) => acc + (m.health || 0), 0) / machines.length) : 0;
    const criticalCount = machines.filter(m => (m.status || '').toLowerCase() === 'offline' || (m.health || 0) < 70).length;

    return (
        <div className="machinery-page fade-in">
            <header className="machinery-header">
                <div>
                    <h1>Machinery Monitoring</h1>
                    <p>Live technical status of all connected farm equipment</p>
                </div>
                <div className="machinery-actions">
                    <button
                        className="home-header__bell"
                        style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginRight: '10px' }}
                        aria-label="Notifications"
                        onClick={onOpenNotif}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="home-header__badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#EF4444', color: 'white', fontSize: '10px', minWidth: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
                    </button>
                    <button className="btn-primary-small" onClick={() => openModal('add')}>
                        <Plus size={18} /> Add Device
                    </button>
                    <button className="btn-icon-text" onClick={() => openModal('schedule')}>
                        <Wrench size={18} /> Schedule Service
                    </button>
                </div>
            </header>


            <div className="machinery-stats">
                <div className="machine-stat-card">
                    <div className="machine-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                        <Shield size={24} />
                    </div>
                    <div className="machine-stat-info">
                        <h3>{avgHealth}%</h3>
                        <p>Fleet Health</p>
                    </div>
                </div>
                <div className="machine-stat-card">
                    <div className="machine-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <Zap size={24} />
                    </div>
                    <div className="machine-stat-info">
                        <h3>{machines.length}</h3>
                        <p>Total Assets</p>
                    </div>
                </div>
                <div className="machine-stat-card">
                    <div className="machine-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="machine-stat-info">
                        <h3>{criticalCount}</h3>
                        <p>Critical Alerts</p>
                    </div>
                </div>
            </div>

            <div className="machines-grid">
                {machines.map(m => {
                    const IconComponent = getIcon(m.iconName)
                    return (
                        <div 
                            key={m.id} 
                            className="machine-card"
                            onClick={() => onIncrementView?.(m.ownerEmail)}
                        >
                            <div className="machine-card__header">
                                <div className="machine-card__icon" style={{ color: m.color }}>
                                    <IconComponent size={24} />
                                </div>
                                <div className="machine-card__status">
                                    <span className={`status-dot status-dot--${(m.status || '').toLowerCase()}`}></span>
                                    {m.status}
                                </div>
                                <div className="machine-card__actions">
                                    <button className="machine-card__chat btn-icon" onClick={(e) => { e.stopPropagation(); handleOpenChatInternal({ name: m.farm || 'Farmer', email: m.ownerEmail, avatar: m.ownerAvatar }); }} title="Chat with Owner">
                                        <MessageCircle size={16} />
                                    </button>
                                    <button className="machine-card__config btn-icon" onClick={(e) => { e.stopPropagation(); openModal('config', m); }} title="Configure">
                                        <Settings size={16} />
                                    </button>
                                    <button className="machine-card__delete btn-icon" onClick={(e) => { e.stopPropagation(); onDelete?.(m.id); }} title="Delete" style={{ color: '#EF4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="machine-card__name">{m.name}</h3>
                            <p className="machine-card__type">{m.type}</p>

                            <div className="machine-card__advanced-stats">
                                <div className="advanced-stat">
                                    <span className="advanced-stat__label">Temp</span>
                                    <span className="advanced-stat__value" style={{ color: m.temp > 90 ? '#EF4444' : 'inherit' }}>{m.temp}°C</span>
                                </div>
                                {m.rpm !== null && (
                                    <div className="advanced-stat">
                                        <span className="advanced-stat__label">RPM</span>
                                        <span className="advanced-stat__value">{m.rpm}</span>
                                    </div>
                                )}
                                <div className="advanced-stat">
                                    <span className="advanced-stat__label">Hours</span>
                                    <span className="advanced-stat__value">{m.hrs}h</span>
                                </div>
                                <div className="advanced-stat">
                                    <span className="advanced-stat__label">Util.</span>
                                    <span className="advanced-stat__value">{m.util}%</span>
                                </div>
                            </div>

                            <div className="machine-card__meters">
                                <div className="meter-group">
                                    <div className="meter-label">
                                        <span>Engine Health</span>
                                        <span>{m.health}%</span>
                                    </div>
                                    <div className="meter-bar">
                                        <div className="meter-fill" style={{ width: `${m.health}%`, background: m.health > 80 ? '#22C55E' : '#F59E0B' }}></div>
                                    </div>
                                </div>
                                {m.fuel !== null && (
                                    <div className="meter-group">
                                        <div className="meter-label">
                                            <span>Fuel Level</span>
                                            <span>{m.fuel}%</span>
                                        </div>
                                        <div className="meter-bar">
                                            <div className="meter-fill" style={{ width: `${m.fuel}%`, background: m.fuel > 20 ? '#3B82F6' : '#EF4444' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="machine-card__footer">
                                <p>Last Service: {m.lastService}</p>
                                <button className="btn-icon" onClick={() => openModal('schedule', m)} title="Schedule Service">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modals */}
            {modalView && (
                <div className="modal-overlay fade-in" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modalView === 'add' ? 'Add New Device' : 
                                 modalView === 'schedule' ? 'Schedule Service' : 
                                 'Configure Device'}
                            </h2>
                            <button className="btn-icon" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {modalView === 'add' && (
                                <form onSubmit={handleAddMachine} className="machinery-form">
                                    <div className="form-group-row">
                                        <div className="form-group flex-1">
                                            <label>Device Name</label>
                                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Combine Harvester" />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label>Device Type</label>
                                            <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required placeholder="e.g. Harvester" />
                                        </div>
                                    </div>
                                    <div className="form-group-row">
                                        <div className="form-group flex-1">
                                            <label>Op. Hours (Initial)</label>
                                            <input type="number" value={formData.hrs} onChange={e => setFormData({...formData, hrs: e.target.value})} placeholder="0" />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label>Initial Status</label>
                                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                                <option value="Online">Online</option>
                                                <option value="Offline">Offline</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary-small w-full">Register Device</button>
                                </form>
                            )}

                            {modalView === 'schedule' && (
                                <form onSubmit={handleScheduleService} className="machinery-form">
                                    <div className="form-group">
                                        <label>Select Machine</label>
                                        <select 
                                            value={selectedMachine?.id || ''} 
                                            onChange={e => { const val = e.target.value; setSelectedMachine(machines.find(m => String(m.id) === val)); }}
                                            required
                                        >
                                            <option value="" disabled>Select a machine...</option>
                                            {machines.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Service Date</label>
                                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                                    </div>
                                    <button type="submit" className="btn-primary-small w-full">Confirm Schedule</button>
                                </form>
                            )}

                            {modalView === 'config' && selectedMachine && (
                                <form onSubmit={handleConfigSave} className="machinery-form">
                                    <div className="form-group">
                                        <label>Device Name</label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Status Override</label>
                                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                            <option value="Online">Online</option>
                                            <option value="Warning">Warning</option>
                                            <option value="Offline">Offline</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn-primary-small w-full">Save Configuration</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
