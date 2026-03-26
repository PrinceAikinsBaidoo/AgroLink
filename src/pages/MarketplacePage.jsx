import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ShoppingCart, Building2, MapPin, Phone, X, Info, Share2, Heart, MessageCircle } from 'lucide-react'
import './MarketplacePage.css'

const categories = ['All', 'Vegetables', 'Grains', 'Fruits', 'Machinery', 'Fertilizers']

function ProductModal({ product, onClose, onAddToCart, onChat }) {
    if (!product) return null

    return createPortal(
        <div className="product-modal-overlay" onClick={onClose}>
            <div className="product-modal" onClick={e => e.stopPropagation()}>
                <button className="product-modal__close" onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>
                <div className="product-modal__content">
                    <div className="product-modal__image-side">
                        <img src={product.img} alt={product.name} className="product-modal__img" />
                        <div className="product-modal__controls">
                            <button className="product-modal__action-btn"><Heart size={20} /></button>
                            <button className="product-modal__action-btn"><Share2 size={20} /></button>
                        </div>
                    </div>

                    <div className="product-modal__info-side">
                        <div className="product-modal__header">
                            <span
                                className="product-modal__badge"
                                style={{ background: product.badgeColor ?? '#E8F5E9', color: product.badgeTextColor ?? '#2E7D32' }}
                            >
                                {product.badge}
                            </span>
                            <h2 className="product-modal__name">{product.name}</h2>
                            <div className="product-modal__rating">
                                <span className="product-modal__stars">★★★★★</span>
                                <span className="product-modal__reviews">({product.reviews ?? 0} reviews)</span>
                            </div>
                        </div>

                        <div className="product-modal__price-row">
                            <span className="product-modal__price">GH₵{parseFloat(product.price).toFixed(2)}</span>
                            <span className="product-modal__unit">per {product.unit}</span>
                        </div>

                        <div className="product-modal__description">
                            <h4 className="product-modal__section-title"><Info size={16} /> Description</h4>
                            <p>{product.description || 'No description provided.'}</p>
                        </div>

                        <div className="product-modal__farmer-card">
                            <h4 className="product-modal__section-title">Farmer / Company</h4>
                            <div className="product-modal__farmer-info">
                                <div className="product-modal__farmer-avatar">
                                    {product.sellerAvatar ? (
                                        <img src={product.sellerAvatar} alt={product.farm} className="product-modal__avatar-img" />
                                    ) : (
                                        product.farm.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <p className="product-modal__farm-name">{product.farm}</p>
                                    <p className="product-modal__location"><MapPin size={12} /> {product.location}</p>
                                </div>
                            </div>
                            <div className="product-modal__farmer-actions">
                                <a href={`tel:${product.phone}`} className="product-modal__contact-btn">
                                    <Phone size={16} /> Call Now
                                </a>
                                <button 
                                    className="product-modal__chat-btn"
                                    onClick={() => onChat?.({ name: product.farm, email: product.ownerEmail })}
                                >
                                    <MessageCircle size={16} /> Chat
                                </button>
                            </div>
                        </div>

                        <div className="product-modal__bottom-actions">
                            <div className="product-modal__stock-info">
                                <p className="product-modal__stock-status">In Stock</p>
                                <p className="product-modal__stock-count">{product.stock}</p>
                            </div>
                            <button
                                className="product-modal__add-btn"
                                onClick={() => { onAddToCart(product); onClose(); }}
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default function MarketplacePage({ 
    products, 
    cart, 
    onAddToCart, 
    onUpdateCartQty, 
    onRemoveFromCart, 
    onClearCart,
    onCheckout,
    onOpenCart,
    onOpenChat,
    currentUserEmail,
    messages = [],
    onSendMessage,
    onIncrementView
}) {
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const filtered = products.filter(p => {
        if (!p || !p.name) return false
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="marketplace-page">
            <header className="marketplace-header">
                <h1 className="marketplace-header__title">Marketplace</h1>
                <div className="marketplace-header__center">
                    <input
                        className="marketplace-search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    className="marketplace-header__cart"
                    aria-label="Cart"
                    onClick={onOpenCart}
                >
                    <ShoppingCart size={20} />
                    {cart.length > 0 && (
                        <span className="marketplace-header__cart-badge">
                            {cart.reduce((a, i) => a + i.qty, 0)}
                        </span>
                    )}
                </button>
            </header>

            <div className="category-chips">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`category-chip ${activeCategory === cat ? 'category-chip--active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="products-list">
                {filtered.map(product => (
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => {
                            setSelectedProduct(product);
                            onIncrementView?.(product.ownerEmail);
                        }}
                    >
                        <div className="product-card__image-container">
                            <img src={product.img} alt={product.name} className="product-card__img" />
                            <button
                                className="product-card__quick-add"
                                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                            >
                                <ShoppingCart size={16} />
                            </button>
                        </div>
                        <div className="product-card__info">
                            <span
                                className="product-card__badge"
                                style={{ background: product.badgeColor ?? '#E8F5E9', color: product.badgeTextColor ?? '#2E7D32' }}
                            >
                                {product.badge}
                            </span>
                            <h3 className="product-card__name">{product.name}</h3>
                            <div className="product-card__meta">
                                <span><Building2 size={13} /> {product.farm}</span>
                                <span><MapPin size={13} /> {product.location}</span>
                                <span><Phone size={13} /> {product.phone}</span>
                            </div>
                            <div className="product-card__bottom">
                                <span className="product-card__price">
                                    GH₵{parseFloat(product.price).toFixed(2)}
                                    <span className="product-card__unit">/{product.unit}</span>
                                </span>
                                <div className="product-card__rating">
                                    ★ {product.rating ?? '5.0'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={onAddToCart}
                onChat={onOpenChat}
            />

        </div>
    )
}
