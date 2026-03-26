import { useState } from 'react'
import { Bell, TrendingUp, ChevronRight, Sprout, Droplets, Bug, Cloud, Sun, ArrowUpRight, ShoppingCart, Star, Eye, Package, Cpu, Activity, Settings, Zap, Clock, MessageCircle } from 'lucide-react'
import './HomePage.css'

/* ── Data ── */
const allHighlights = [
    { id: 1, url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80', label: 'Greenhouse' },
    { id: 2, url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=500&q=80', label: 'Seedlings' },
    { id: 3, url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&q=80', label: 'Tomatoes' },
    { id: 4, url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=500&q=80', label: 'Maize Field' },
    { id: 5, url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80', label: 'Planting' },
    { id: 6, url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&q=80', label: 'Harvest' },
    { id: 7, url: 'https://images.unsplash.com/photo-1444880421240-7945cff3a462?w=500&q=80', label: 'Irrigation' },
    { id: 8, url: 'https://images.unsplash.com/photo-1520052203542-a3dcf45f7b3b?w=500&q=80', label: 'Sunflower' },
    { id: 9, url: 'https://images.unsplash.com/photo-1464638681273-0164ad9fa0aa?w=500&q=80', label: 'Farmland' },
    { id: 10, url: 'https://images.unsplash.com/photo-1474523644527-b1d4f1e6f06f?w=500&q=80', label: 'Rice Paddy' },
    { id: 11, url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&q=80', label: 'Peppers' },
    { id: 12, url: 'https://images.unsplash.com/photo-1612502169-1a58f80adb04?w=500&q=80', label: 'Vegetables' },
]



const agrobotTips = [
    { id: 1, icon: <Sprout size={20} color="white" />, title: 'Best Crop to Plant', desc: 'Maize (Early maturing variety)' },
    { id: 2, icon: <Droplets size={20} color="white" />, title: 'Irrigation Tip', desc: 'Drip irrigation saves 40% water' },
    { id: 3, icon: <Bug size={20} color="white" />, title: 'Pest Alert', desc: 'Fall Armyworm detected nearby' },
]

const weatherCards = [
    { id: 1, day: 'Today', temp: '32°C', icon: <Sun size={22} />, desc: 'Sunny', color: '#FFA000' },
    { id: 2, day: 'Tomorrow', temp: '28°C', icon: <Cloud size={22} />, desc: 'Cloudy', color: '#78909C' },
    { id: 3, day: 'Wed', temp: '25°C', icon: <Cloud size={22} />, desc: 'Light Rain', color: '#1565C0' },
    { id: 4, day: 'Thu', temp: '30°C', icon: <Sun size={22} />, desc: 'Sunny', color: '#FFA000' },
    { id: 5, day: 'Fri', temp: '27°C', icon: <Cloud size={22} />, desc: 'Cloudy', color: '#78909C' },
]

const recentActivity = [
    { id: 1, type: 'order', name: 'Retail Buyers Co.', action: 'ordered 30kg of Fresh Tomatoes', time: '10 min ago', avatar: 'https://i.pravatar.cc/40?img=20' },
    { id: 2, type: 'message', name: 'Kwame Boateng', action: 'sent you a message', time: '25 min ago', avatar: 'https://i.pravatar.cc/40?img=33' },
    { id: 3, type: 'reach', name: 'Ama Serwaa', action: 'reached out about Tomatoes', time: '1 hr ago', avatar: 'https://i.pravatar.cc/40?img=47' },
    { id: 4, type: 'order', name: 'Accra Fresh Market', action: 'ordered 100kg of Maize', time: '2 hr ago', avatar: 'https://i.pravatar.cc/40?img=60' },
    { id: 5, type: 'message', name: 'AgroSupply Co.', action: 'enquired about your fertilizer', time: '3 hr ago', avatar: 'https://i.pravatar.cc/40?img=12' },
]

const activityColor = { order: '#2E7D32', message: '#1565C0', reach: '#E65100' }
const activityLabel = { order: 'Order', message: 'Message', reach: 'Inquiry' }

export default function HomePage({ 
    setActivePage, 
    userRole, 
    currentUser, 
    products = [], 
    orders = [], 
    machines = [], 
    notifications = [],
    onDeleteProduct,
    onUpdateOrderStatus,
    onMarkNotificationsRead,
    onOpenNotif,
    onOpenChat,
    onOpenOrders,
    onOpenProducts,
    messages = [],
    onSendMessage,
    viewCount = 0
}) {
    const unreadCount = notifications.filter(n => n && !n.read).length
    const [showAllHighlights, setShowAllHighlights] = useState(false)


    const firstName = currentUser?.name?.split(' ')[0] || 'User'
    const hasProducts = products.length > 0

    // Calculations for farmer/engineer dashboard
    const activeOrdersCount = orders.filter(o => o.status === 'pending').length
    const totalSales = orders.reduce((sum, o) => sum + (typeof o.amount === 'number' ? o.amount : parseFloat(o.amount || 0)), 0)
    const pendingProductsCount = products.filter(p => (p.status || 'pending') === 'pending').length

    // Engineer Calculations
    const avgHealth = machines.length > 0 
        ? Math.round(machines.reduce((acc, m) => acc + (m.health || 0), 0) / machines.length) 
        : 0
    const criticalCount = machines.filter(m => (m.status || '').toLowerCase() === 'offline' || (m.health || 0) < 70).length
    const totalHours = machines.reduce((acc, m) => acc + (parseFloat(m.hrs) || 0), 0)

    // Dynamic stats based on user's persistent data
    const dynamicStats = [
        { id: 1, label: 'Total Sales', value: `GH₵${totalSales.toLocaleString()}`, sub: 'Cumulative revenue', icon: <TrendingUp size={18} />, color: '#2E7D32', bg: '#E8F5E9', roles: ['farmer'] },
        { id: 2, label: 'Orders', value: `${activeOrdersCount} Active`, sub: 'Pending delivery', icon: <ShoppingCart size={18} />, color: '#E65100', bg: '#FFF3E0', roles: ['farmer'] },
        { id: 3, label: 'Products', value: `${products.length} Listed`, sub: 'Live in market', icon: <Package size={18} />, color: '#558B2F', bg: '#F1F8E9', roles: ['farmer'] },
        { id: 4, label: 'Pending', value: `${pendingProductsCount} items`, sub: 'Awaiting review', icon: <Activity size={18} />, color: '#6A1B9A', bg: '#F3E5F5', roles: ['farmer'] },
        { id: 5, label: 'Fleet Health', value: `${avgHealth}%`, sub: `${criticalCount} alerts`, icon: <Cpu size={18} />, color: avgHealth > 80 ? '#2E7D32' : '#E65100', bg: avgHealth > 80 ? '#E8F5E9' : '#FFF3E0', roles: ['engineer'] },
        { id: 6, label: 'Total Assets', value: `${machines.length} units`, sub: 'Active equipment', icon: <Zap size={18} />, color: '#1565C0', bg: '#E3F2FD', roles: ['engineer'] },
        { id: 7, label: 'Op. Hours', value: `${totalHours.toLocaleString()}h`, sub: 'Total fleet use', icon: <Clock size={18} />, color: '#558B2F', bg: '#F1F8E9', roles: ['engineer'] },
        { id: 8, label: 'Profile Views', value: viewCount.toLocaleString(), sub: 'This week', icon: <Eye size={18} />, color: '#00695C', bg: '#E0F2F1', roles: ['farmer', 'engineer'] },
    ].filter(s => s.roles.includes(userRole))

    // Activity should be empty for new users
    const userActivity = hasProducts ? recentActivity : []

    const displayedHighlights = showAllHighlights ? allHighlights : allHighlights.slice(0, 6)

    const handleStatClick = (label) => {
        if (label === 'Orders') onOpenOrders?.()
        if (label === 'Products') onOpenProducts?.()
        if (label === 'Fleet Health') setActivePage('machinery')
    }

    const handleNotifClick = (notif) => {
        if (notif.type === 'message' && notif.chatTarget) {
            onOpenChat(notif.chatTarget)
        } else if (notif.type === 'order') {
            onOpenOrders?.()
        }
    }

    return (
        <div className="home-page">
            {/* ── Header ── */}
            <header className="home-header">
                <div className="home-header__user">
                    <div className="home-header__avatar">
                        <img src={currentUser?.avatar || "https://i.pravatar.cc/80?img=12"} alt={firstName} />
                    </div>
                    <div>
                        <p className="home-header__welcome">Welcome back,</p>
                        <h2 className="home-header__name">{firstName} 👋</h2>
                    </div>
                </div>
                <button
                    className="home-header__bell"
                    aria-label="Notifications"
                    onClick={onOpenNotif}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="home-header__badge">{unreadCount}</span>}
                </button>
            </header>

            <div className="home-page__body">

                {/* ── Top Level Overview ── */}
                {userRole === 'engineer' ? (
                    <section className="home-section">
                        <div className="home-section__title-row">
                            <h3 className="home-section__title">⚙️ Fleet Overview</h3>
                            <button className="home-section__link" onClick={() => setActivePage('machinery')}>Manage Fleet</button>
                        </div>
                        
                        <div className="fleet-dashboard-grid">
                            <div className="fleet-stat-box">
                                <span className="fleet-stat-box__label">Total Op. Hours</span>
                                <h4 className="fleet-stat-box__value">{totalHours.toLocaleString()}h</h4>
                            </div>
                            <div className="fleet-stat-box">
                                <span className="fleet-stat-box__label">Avg. Fleet Health</span>
                                <h4 className="fleet-stat-box__value" style={{ color: avgHealth > 80 ? '#22C55E' : '#F59E0B' }}>{avgHealth}%</h4>
                            </div>
                            <div className="fleet-stat-box">
                                <span className="fleet-stat-box__label">Critical Warnings</span>
                                <h4 className="fleet-stat-box__value" style={{ color: criticalCount > 0 ? '#EF4444' : '#22C55E' }}>{criticalCount}</h4>
                            </div>
                        </div>

                        <div className="fleet-table-container">
                            <table className="fleet-table">
                                <thead>
                                    <tr>
                                        <th>Machine</th>
                                        <th>Status</th>
                                        <th>Health</th>
                                        <th>Fuel/Batt</th>
                                        <th>Temp</th>
                                        <th>RPM</th>
                                        <th>Util</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {machines.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                                No machinery registered in your fleet.
                                            </td>
                                        </tr>
                                    ) : machines.map(m => (
                                        <tr key={m.id}>
                                            <td>
                                                <div className="fleet-table-name"><Cpu size={16} color={m.color} /> {m.name}</div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-badge--${(m.status || '').toLowerCase()}`}>
                                                    {m.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-progress-group">
                                                    <span>{m.health}%</span>
                                                    <div className="table-progress-bar">
                                                        <div className="table-progress-fill" style={{ width: `${m.health}%`, background: m.health > 80 ? '#22C55E' : (m.health > 50 ? '#F59E0B' : '#EF4444') }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="table-progress-group">
                                                    <span style={{ color: (m.fuel !== null && m.fuel < 20) || (m.battery !== null && m.battery < 20) ? '#EF4444' : 'inherit' }}>
                                                        {m.fuel !== null ? `${m.fuel}% ` : (m.battery !== null ? `${m.battery}% ` : 'N/A ')}
                                                        <span style={{ color: 'var(--text-muted)' }}>{m.fuel !== null ? 'F' : (m.battery !== null ? 'B' : '')}</span>
                                                    </span>
                                                    {(m.fuel !== null || m.battery !== null) && (
                                                        <div className="table-progress-bar">
                                                            <div 
                                                                className="table-progress-fill" 
                                                                style={{ 
                                                                    width: `${m.fuel ?? m.battery}%`, 
                                                                    background: (m.fuel ?? m.battery) > 20 ? '#3B82F6' : '#EF4444' 
                                                                }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ color: m.temp > 90 ? '#EF4444' : 'inherit' }}>{m.temp}°C</td>
                                            <td>{m.rpm || 'N/A'}</td>
                                            <td>{m.util}%</td>
                                            <td>
                                                <button 
                                                    className="btn-icon" 
                                                    style={{ color: '#1565C0' }}
                                                    onClick={() => onOpenChat({ name: m.farm || 'Farmer', email: m.ownerEmail })}
                                                    title="Chat with Owner"
                                                >
                                                    <MessageCircle size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ) : (
                    <section className="home-section">
                        <div className="home-section__title-row">
                            <h3 className="home-section__title">Overview</h3>
                            <button className="home-section__link">View Report</button>
                        </div>
                        <div className="quick-stats">
                            {dynamicStats.filter(s => s.roles.includes(userRole)).map(stat => (
                                <div
                                    key={stat.id}
                                    className={`quick-stat ${['Orders', 'Products', 'Fleet Health'].includes(stat.label) ? 'quick-stat--clickable' : ''}`}
                                    style={{ '--stat-bg': stat.bg, '--stat-color': stat.color }}
                                    onClick={() => handleStatClick(stat.label)}
                                >
                                    <div className="quick-stat__icon">{stat.icon}</div>
                                    <div>
                                        <p className="quick-stat__label">{stat.label}</p>
                                        <p className="quick-stat__value">{stat.value}</p>
                                        <p className="quick-stat__sub">{stat.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Weather Forecast ── */}
                <section className="home-section">
                    <div className="home-section__title-row">
                        <h3 className="home-section__title">🌦️ Weather Forecast</h3>
                        <span className="home-section__label-muted">Ashanti Region</span>
                    </div>
                    <div className="weather-strip">
                        {weatherCards.map(w => (
                            <div key={w.id} className="weather-card">
                                <p className="weather-card__day">{w.day}</p>
                                <div className="weather-card__icon" style={{ color: w.color }}>{w.icon}</div>
                                <p className="weather-card__temp">{w.temp}</p>
                                <p className="weather-card__desc">{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Farm Highlights ── */}
                <section className="home-section">
                    <div className="home-section__title-row">
                        <h3 className="home-section__title">My Farm Highlights</h3>
                        {hasProducts && (
                            <button
                                className="home-section__link"
                                onClick={() => setShowAllHighlights(p => !p)}
                            >
                                {showAllHighlights ? 'Show Less' : `View All (${allHighlights.length})`}
                            </button>
                        )}
                    </div>
                    {hasProducts ? (
                        <div className="farm-highlights">
                            {displayedHighlights.map(h => (
                                <div key={h.id} className="farm-highlights__img-wrapper">
                                    <img src={h.url} alt={h.label} className="farm-highlights__img" loading="lazy" />
                                    <div className="farm-highlights__label">{h.label}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-card">
                            <p>No highlights yet. Add your first product to see your farm grow!</p>
                        </div>
                    )}
                </section>

                {/* ── Recent Activity ── */}
                <section className="home-section">
                    <div className="home-section__title-row">
                        <h3 className="home-section__title">Recent Activity</h3>
                        {hasProducts && <button className="home-section__link" onClick={() => onOpenNotif()}>See All</button>}
                    </div>
                    <div className="activity-feed">
                        {userActivity.length > 0 ? (
                            userActivity.map(act => (
                                <div key={act.id} className="activity-item">
                                    <img src={act.avatar} alt={act.name} className="activity-item__avatar" />
                                    <div className="activity-item__text">
                                        <p className="activity-item__name">{act.name}</p>
                                        <p className="activity-item__action">{act.action}</p>
                                        <span className="activity-item__time">{act.time}</span>
                                    </div>
                                    <span
                                        className="activity-item__badge"
                                        style={{ background: activityColor[act.type] + '18', color: activityColor[act.type] }}
                                    >
                                        {activityLabel[act.type]}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-activity">
                                <Activity size={32} color="#ccc" />
                                <p>No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Agrobot AI Tips ── */}
                <section className="home-section">
                    <div className="home-section__title-row">
                        <h3 className="home-section__title">Agrobot AI Tips</h3>
                        <button className="home-section__link" onClick={() => setActivePage('agrobot')}>Open Chat</button>
                    </div>
                    <div className="agrobot-tips">
                        {agrobotTips.map(tip => (
                            <button key={tip.id} className="agrobot-tip" onClick={() => setActivePage('agrobot')}>
                                <div className="agrobot-tip__icon">{tip.icon}</div>
                                <div className="agrobot-tip__text">
                                    <p className="agrobot-tip__category">{tip.title}</p>
                                    <p className="agrobot-tip__value">{tip.desc}</p>
                                </div>
                                <ChevronRight size={18} className="agrobot-tip__arrow" />
                            </button>
                        ))}
                    </div>
                </section>

                {/* Fleet Overview removed from here and moved to the top */}

            </div>
        </div>
    )
}
