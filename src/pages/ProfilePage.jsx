import { useState } from 'react'
import { MapPin, Phone, Mail, Edit3, Check, Star, Package, LogOut, ShoppingBag, CalendarDays, X, AlertTriangle, Camera, Upload } from 'lucide-react'
import './ProfilePage.css'

const defaultStats = {
    rating: 5.0,
    reviews: 0,
    products: 0,
    ordersPlaced: 0,
    farmName: 'My Agro Farm',
    location: 'Accra, Ghana',
    phone: 'Not provided',
}

const PREMIUM_AVATARS = [
    { id: 1, url: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&q=80', label: 'Farmer Male' },
    { id: 2, url: 'https://images.unsplash.com/photo-1594744803329-a584af1cae24?w=400&q=80', label: 'Farmer Female' },
    { id: 3, url: 'https://images.unsplash.com/photo-1622919846923-d39226c367f0?w=400&q=80', label: 'Ag-Engineer' },
    { id: 4, url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', label: 'Modern Buyer' },
    { id: 5, url: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=400&q=80', label: 'Specialist' },
    { id: 6, url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', label: 'Manager' },
]

function LogoutModal({ onConfirm, onCancel }) {
    return (
        <div className="logout-overlay" onClick={onCancel}>
            <div className="logout-modal" onClick={e => e.stopPropagation()}>
                <button className="logout-modal__close" onClick={onCancel} aria-label="Close">
                    <X size={18} />
                </button>
                <div className="logout-modal__icon">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="logout-modal__title">Sign Out?</h3>
                <p className="logout-modal__text">
                    You'll be returned to the login screen. Any unsaved changes will be lost.
                </p>
                <div className="logout-modal__actions">
                    <button className="logout-modal__cancel" onClick={onCancel}>Stay</button>
                    <button className="logout-modal__confirm" onClick={onConfirm}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ProfilePage({ onLogout, userRole = 'farmer', currentUser, onUpdateProfile, isDarkMode, onToggleDarkMode }) {
    const isBuyer = userRole === 'buyer'
    
    // Construct active profile from currentUser DB object + some dummy stats to fill out the UI
    const dynamicData = {
        name: currentUser?.name || 'Guest User',
        role: currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Farmer',
        farmName: defaultStats.farmName,
        location: defaultStats.location,
        phone: defaultStats.phone,
        email: currentUser?.email || 'admin@agrolink.gh',
        rating: defaultStats.rating,
        reviews: defaultStats.reviews,
        products: defaultStats.products,
        ordersPlaced: defaultStats.ordersPlaced,
        joined: currentUser?.joined || 'Today',
        avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=Guest&background=random`,
    }

    const [profile, setProfile] = useState(dynamicData)
    const [editing, setEditing] = useState(false)
    const [editValues, setEditValues] = useState({ ...dynamicData })
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [showAvatarModal, setShowAvatarModal] = useState(false)

    const resizeImage = (base64Str) => {
        return new Promise((resolve) => {
            const img = new Image()
            img.src = base64Str
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height
                const max_size = 400 // Max 400px
                
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width
                        width = max_size
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height
                        height = max_size
                    }
                }
                
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', 0.7)) // Compress to 70% quality
            }
        })
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String = reader.result
            const compressed = await resizeImage(base64String)
            
            setEditValues(p => ({ ...p, avatar: compressed }))
            setProfile(p => ({ ...p, avatar: compressed }))
            onUpdateProfile?.({ ...currentUser, avatar: compressed })
            setShowAvatarModal(false)
        }
        reader.readAsDataURL(file)
    }

    const handleSave = () => {
        setProfile({ ...editValues })
        setEditing(false)
        onUpdateProfile?.({
            name: editValues.name,
            email: editValues.email,
            avatar: editValues.avatar
        })
    }

    const handleLogout = () => {
        setShowLogoutModal(false)
        onLogout?.()
    }

    return (
        <div className="profile-page">
            {/* Header */}
            <header className="profile-header">
                <div className="profile-header__bg" />
                <div className="profile-header__content">
                    <div className="profile-avatar-wrap">
                        <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
                        {!isBuyer && <div className="profile-verified-badge">✓</div>}
                        <button 
                            className="avatar-edit-overlay"
                            onClick={() => setShowAvatarModal(true)}
                            title="Change Photo"
                        >
                            <Camera size={24} />
                        </button>
                    </div>
                    {editing ? (
                        <input 
                            className="profile-name-input"
                            value={editValues.name}
                            onChange={e => setEditValues(p => ({ ...p, name: e.target.value }))}
                        />
                    ) : (
                        <h2 className="profile-name">{profile.name}</h2>
                    )}
                    <span className="profile-role">{profile.role}</span>

                    <div className="profile-stats">
                        {isBuyer ? (
                            <>
                                <div className="profile-stat">
                                    <ShoppingBag size={14} />
                                    <span>{profile.ordersPlaced} Orders</span>
                                </div>
                                <div className="profile-stat-divider" />
                                <div className="profile-stat">
                                    <CalendarDays size={14} />
                                    <span>Joined {profile.joined}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="profile-stat">
                                    <Star size={14} fill="#F4C430" stroke="#F4C430" />
                                    <span>{profile.rating} rating</span>
                                </div>
                                <div className="profile-stat-divider" />
                                <div className="profile-stat">
                                    <Package size={14} />
                                    <span>{profile.products} Products</span>
                                </div>
                                <div className="profile-stat-divider" />
                                <div className="profile-stat">
                                    <span>{profile.reviews} Reviews</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="profile-body">
                <div className="profile-card">
                    <div className="profile-card__header">
                        <h3 className="profile-card__title">App Preferences</h3>
                    </div>
                    <div className="profile-fields">
                        <div className="toggle-field">
                            <div className="toggle-info">
                                <span className="toggle-title">Dark Mode Theme</span>
                                <span className="toggle-desc">Switch to a darker interface for night use</span>
                            </div>
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={isDarkMode} 
                                    onChange={onToggleDarkMode} 
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="profile-card">
                    <div className="profile-card__header">
                        <h3 className="profile-card__title">
                            {isBuyer ? 'Contact Information' : 'Farm Information'}
                        </h3>
                        <button
                            className="profile-edit-btn"
                            onClick={editing ? handleSave : () => setEditing(true)}
                        >
                            {editing ? <><Check size={15} /> Save</> : <><Edit3 size={15} /> Edit</>}
                        </button>
                    </div>

                    <div className="profile-fields">
                        {!isBuyer && (
                            <div className="profile-field">
                                <label className="profile-field__label">Farm Name</label>
                                {editing ? (
                                    <input
                                        className="input-field"
                                        value={editValues.farmName}
                                        onChange={e => setEditValues(p => ({ ...p, farmName: e.target.value }))}
                                    />
                                ) : (
                                    <p className="profile-field__value">{profile.farmName}</p>
                                )}
                            </div>
                        )}

                        <div className="profile-field">
                            <label className="profile-field__label"><MapPin size={14} /> Location</label>
                            {editing ? (
                                <input
                                    className="input-field"
                                    value={editValues.location}
                                    onChange={e => setEditValues(p => ({ ...p, location: e.target.value }))}
                                />
                            ) : (
                                <p className="profile-field__value">{profile.location}</p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label className="profile-field__label"><Phone size={14} /> Phone</label>
                            {editing ? (
                                <input
                                    className="input-field"
                                    value={editValues.phone}
                                    onChange={e => setEditValues(p => ({ ...p, phone: e.target.value }))}
                                />
                            ) : (
                                <p className="profile-field__value">{profile.phone}</p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label className="profile-field__label"><Mail size={14} /> Email</label>
                            {editing ? (
                                <input
                                    className="input-field"
                                    value={editValues.email}
                                    onChange={e => setEditValues(p => ({ ...p, email: e.target.value }))}
                                />
                            ) : (
                                <p className="profile-field__value">{profile.email}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Logout Card */}
                <div className="profile-card profile-card--logout" style={{ marginBottom: '24px' }}>
                    <div className="profile-fields">
                        <button
                            className="profile-logout-btn"
                            onClick={() => setShowLogoutModal(true)}
                        >
                            <LogOut size={18} />
                            Sign Out of AgroLink
                        </button>
                    </div>
                </div>
            </div>

            {/* Avatar Selection Modal */}
            {showAvatarModal && (
                <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
                    <div className="avatar-modal" onClick={e => e.stopPropagation()}>
                        <div className="avatar-modal__header">
                            <h3>Choose Profile Photo</h3>
                            <button onClick={() => setShowAvatarModal(false)}><X size={20} /></button>
                        </div>
                        <div className="avatar-modal__grid">
                            <div className="avatar-upload-card">
                                <label className="avatar-upload-label">
                                    <Upload size={24} />
                                    <span>Upload Photo</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden-file-input" 
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            </div>
                            {PREMIUM_AVATARS.map(ava => (
                                <button 
                                    key={ava.id} 
                                    className={`avatar-choice ${editValues.avatar === ava.url ? 'avatar-choice--active' : ''}`}
                                    onClick={() => {
                                        setEditValues(p => ({ ...p, avatar: ava.url }))
                                        setProfile(p => ({ ...p, avatar: ava.url }))
                                        onUpdateProfile?.({ ...currentUser, avatar: ava.url })
                                        setShowAvatarModal(false)
                                    }}
                                >
                                    <img src={ava.url} alt={ava.label} />
                                    <span>{ava.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation */}
            {showLogoutModal && (
                <LogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </div>
    )
}
