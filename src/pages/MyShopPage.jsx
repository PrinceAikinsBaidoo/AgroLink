import { useState } from 'react'
import { CheckCircle, ImagePlus, X, Trash2, Package, PlusCircle, LayoutGrid } from 'lucide-react'
import './MyShopPage.css'

const categories = ['Vegetables', 'Grains', 'Fruits', 'Machinery', 'Fertilizers', 'Livestock', 'Processed Foods']
const units = ['kg', 'bag', 'bunch', 'crate', 'tonne', 'piece', 'litre']

const defaultForm = { name: '', category: 'Vegetables', price: '', unit: 'kg', stock: '', description: '', img: '' }

export default function MyShopPage({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
    const [activeTab, setActiveTab] = useState('inventory') // 'inventory' or 'add'
    const [editingProduct, setEditingProduct] = useState(null)
    const [form, setForm] = useState(defaultForm)
    const [success, setSuccess] = useState(false)

    // Use products prop directly as it is filtered in App.jsx
    const userListings = products

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.stock) return

        if (editingProduct) {
            onUpdateProduct({ ...editingProduct, ...form })
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                setEditingProduct(null)
                setActiveTab('inventory')
            }, 1500)
        } else {
            onAddProduct(form)
            setForm(defaultForm)
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                setActiveTab('inventory')
            }, 2000)
        }
    }

    const startEdit = (product) => {
        setEditingProduct(product)
        setForm({
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            stock: parseFloat(product.stock) || 0,
            description: product.description || '',
            img: product.img || ''
        })
        setActiveTab('add')
    }

    const cancelEdit = () => {
        setEditingProduct(null)
        setForm(defaultForm)
        setActiveTab('inventory')
    }

    return (
        <div className="myshop-page">
            <header className="myshop-header">
                <div className="myshop-header__top">
                    <h1 className="myshop-header__title">My Shop</h1>
                    <div className="myshop-tabs">
                        <button
                            className={`myshop-tab ${activeTab === 'inventory' ? 'myshop-tab--active' : ''}`}
                            onClick={() => setActiveTab('inventory')}
                        >
                            <Package size={18} /> My Inventory
                        </button>
                        <button
                            className={`myshop-tab ${activeTab === 'add' ? 'myshop-tab--active' : ''}`}
                            onClick={() => {
                                if (activeTab === 'inventory') {
                                    setEditingProduct(null)
                                    setForm(defaultForm)
                                }
                                setActiveTab('add')
                            }}
                        >
                            <PlusCircle size={18} /> {editingProduct ? 'Edit Product' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="myshop-body">
                {activeTab === 'inventory' ? (
                    <div className="inventory-view">
                        <div className="inventory-header">
                            <h3 className="inventory-header__title">Active Listings ({userListings.length})</h3>
                            <button className="btn-primary btn-sm" onClick={() => setActiveTab('add')}>
                                <PlusCircle size={16} /> New Product
                            </button>
                        </div>

                        {userListings.length > 0 ? (
                            <div className="listings-grid">
                                {userListings.map(item => (
                                    <div key={item.id} className="listing-item">
                                        <div className="listing-item__img-box">
                                            <img src={item.img} alt={item.name} className="listing-item__img" />
                                        </div>
                                        <div className="listing-item__info">
                                            <div className="listing-item__top-row">
                                                <p className="listing-item__name">{item.name}</p>
                                                <span className="listing-item__category">{item.category}</span>
                                            </div>
                                            <div className="listing-item__price-info">
                                                <span className="listing-item__price">GH₵{parseFloat(item.price).toFixed(2)}</span>
                                                <span className="listing-item__unit">/{item.unit.replace('per ', '')}</span>
                                            </div>
                                            <p className="listing-item__stock">{item.stock}</p>
                                        </div>
                                        <div className="listing-item__actions">
                                            <button
                                                className="listing-item__edit"
                                                onClick={() => startEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="listing-item__remove"
                                                onClick={() => onDeleteProduct(item.id)}
                                                aria-label="Remove"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-listings">
                                <div className="empty-listings__icon"><LayoutGrid size={48} /></div>
                                <p>You haven't listed any products yet.</p>
                                <button className="btn-secondary" onClick={() => setActiveTab('add')}>
                                    Start Selling Today
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="add-product-view">
                        <div className="myshop-form-card">
                            <div className="myshop-form-card__top">
                                <h3 className="myshop-form-card__heading">
                                    {editingProduct ? 'Edit Product Details' : 'Product Details'}
                                </h3>
                                <p className="myshop-form-card__sub">
                                    {editingProduct ? 'Update the information for your listing' : 'Complete the information below to list your item'}
                                </p>
                            </div>

                            {success ? (
                                <div className="myshop-success-message fade-in">
                                    <div className="myshop-success-icon"><CheckCircle size={48} color="#059669" /></div>
                                    <h4>{editingProduct ? 'Product Updated Successfully' : 'Product Added Successfully!'}</h4>
                                    <p>Redirecting to your inventory...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="myshop-form">
                                    <div className="form-group">
                                    <label className="input-label">Product Name</label>
                                    <input
                                        className="input-field"
                                        placeholder="e.g. Fresh Tomatoes"
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Category</label>
                                    <select
                                        className="input-field"
                                        value={form.category}
                                        onChange={e => handleChange('category', e.target.value)}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Product Image</label>
                                    <div className="myshop-image-upload-area">
                                        {!form.img ? (
                                            <label className="myshop-image-upload-label">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="myshop-image-file-input"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                handleChange('img', reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <div className="myshop-upload-placeholder">
                                                    <ImagePlus size={32} color="var(--text-muted)" />
                                                    <p><span>Click to upload</span> or drag and drop</p>
                                                    <span className="myshop-upload-hint">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                                </div>
                                            </label>
                                        ) : (
                                            <div className="myshop-image-preview-container">
                                                <img src={form.img} alt="Product Preview" className="myshop-uploaded-img" />
                                                <button 
                                                    type="button" 
                                                    className="myshop-remove-img"
                                                    onClick={() => handleChange('img', '')}
                                                >
                                                    <X size={16} /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group form-group--flex">
                                        <label className="input-label">Price (GH₵)</label>
                                        <input
                                            className="input-field"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            value={form.price}
                                            onChange={e => handleChange('price', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group form-group--flex">
                                        <label className="input-label">Unit</label>
                                        <select
                                            className="input-field"
                                            value={form.unit}
                                            onChange={e => handleChange('unit', e.target.value)}
                                        >
                                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Available Stock (Quantity)</label>
                                    <input
                                        className="input-field"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 50"
                                        value={form.stock}
                                        onChange={e => handleChange('stock', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Description (optional)</label>
                                    <textarea
                                        className="input-field input-field--textarea"
                                        placeholder="Describe your product quality, origin, etc."
                                        rows={4}
                                        value={form.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-ghost" onClick={cancelEdit}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary myshop-submit">
                                        <CheckCircle size={18} /> {editingProduct ? 'Save Changes' : 'List Product Now'}
                                    </button>
                                </div>
                            </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
