import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import BuyerHomePage from './pages/BuyerHomePage'
import MarketplacePage from './pages/MarketplacePage'
import AgrobotPage from './pages/AgrobotPage'
import MyShopPage from './pages/MyShopPage'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import MachineryPage from './pages/MachineryPage'
import CartDrawer from './components/CartDrawer'
import ChatDrawer from './components/ChatDrawer'
import NotificationDrawer from './components/NotificationDrawer'
import { OrdersPanel, ProductsPanel } from './components/QuickPanel'
import './App.css'

const INITIAL_ORDERS = [
  { id: 1001, productId: 1, buyerName: 'Retail Buyers Co.', date: '2026-03-10', status: 'delivered', amount: 450.00 },
  { id: 1002, productId: 101, buyerName: 'Accra Fresh Market', date: '2026-03-11', status: 'pending', amount: 900.00 },
]

const INITIAL_MACHINES = [
  { id: 1, name: 'John Deere Tractor', type: 'Tractor', status: 'Online', health: 95, fuel: 82, battery: 98, temp: 85, rpm: 2200, hrs: 1240, util: 75, lastService: '2 weeks ago', iconName: 'Cpu', color: '#22C55E', ownerEmail: 'james.asante@agrolink.gh', farm: 'James Asante' },
  { id: 2, name: 'Automatic Sprayer', type: 'Sprayer', status: 'Warning', health: 78, fuel: 15, battery: 45, temp: 92, rpm: 2600, hrs: 890, util: 90, lastService: '1 month ago', iconName: 'Zap', color: '#F59E0B', ownerEmail: 'james.asante@agrolink.gh', farm: 'James Asante' },
  { id: 3, name: 'Irrigation Hub A', type: 'Controller', status: 'Online', health: 100, fuel: null, battery: 88, temp: 35, rpm: null, hrs: 4500, util: 100, lastService: '3 days ago', iconName: 'Activity', color: '#3B82F6', ownerEmail: 'james.asante@agrolink.gh', farm: 'James Asante' },
  { id: 4, name: 'Power Tiller unit 2', type: 'Tiller', status: 'Offline', health: 64, fuel: 0, battery: 12, temp: 20, rpm: 0, hrs: 320, util: 0, lastService: '2 months ago', iconName: 'Settings', color: '#EF4444', ownerEmail: 'james.asante@agrolink.gh', farm: 'James Asante' }
]

const INITIAL_PRODUCTS = [
  {
    id: 1, name: 'Fresh Tomatoes', category: 'Vegetables', farm: 'Greenfield Farm', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Ashanti Region', phone: '+233 24 123 4567', price: 15.00,
    unit: 'kg', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
    badge: 'VEGETABLES', badgeColor: '#E8F5E9', badgeTextColor: '#2E7D32',
    description: 'Freshly harvested organic tomatoes from the heart of Ashanti. No chemical pesticides used. Perfect for salads, sauces, and stews.',
    stock: '500kg available', rating: 4.8, reviews: 124,
  },
  {
    id: 2, name: 'Premium Maize', category: 'Grains', farm: 'Sunset Valley Farms', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Northern Region', phone: '+233 55 987 6543', price: 10.50,
    unit: 'kg', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
    badge: 'GRAINS', badgeColor: '#FFF3E0', badgeTextColor: '#E65100',
    description: 'High-quality yellow maize, sun-dried and sorted for purity. Ideal for livestock feed or processing into cornmeal.',
    stock: '2,000kg available', rating: 4.6, reviews: 89,
  },
  {
    id: 3, name: 'Fresh Plantain', category: 'Fruits', farm: 'Golden Acres', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Brong-Ahafo Region', phone: '+233 20 456 7890', price: 8.00,
    unit: 'bunch', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80',
    badge: 'FRUITS', badgeColor: '#FFF8E1', badgeTextColor: '#FFB300',
    description: 'Large, firm green and ripe plantains. Sourced from the best farms in the region. Sweet and versatile.',
    stock: '150 bunches', rating: 4.9, reviews: 56,
  },
  {
    id: 4, name: 'Organic Yam', category: 'Vegetables', farm: 'Volta Ridge Farm', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Volta Region', phone: '+233 27 321 9876', price: 12.00,
    unit: 'kg', img: '/images/yam.jpg',
    badge: 'VEGETABLES', badgeColor: '#E8F5E9', badgeTextColor: '#2E7D32',
    description: 'Puna yams from the Volta region. Known for their great taste and texture. Harvested weekly.',
    stock: '800kg available', rating: 4.7, reviews: 42,
  },
  {
    id: 16, name: 'Cassava Tubers', category: 'Vegetables', farm: 'Roots & Shoots', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Ahafo Region', phone: '+233 24 555 4444', price: 5.50,
    unit: 'kg', img: '/images/cassava.jpg',
    badge: 'VEGETABLES', badgeColor: '#E8F5E9', badgeTextColor: '#2E7D32',
    description: 'High-starch cassava tubers, perfect for fufu or starch processing. Freshly unearthed and cleaned.',
    stock: '1,200kg available', rating: 4.5, reviews: 67,
  },
  {
    id: 17, name: 'Ripe Mangoes', category: 'Fruits', farm: 'Tropical Haven', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Upper West', phone: '+233 50 123 0000', price: 2.00,
    unit: 'piece', img: '/images/ripe mangoes.jpg',
    badge: 'FRUITS', badgeColor: '#FFF8E1', badgeTextColor: '#FFB300',
    description: 'Large, juicy Kent mangoes. Sweet and fiber-less. Hand-picked at peak ripeness.',
    stock: '1,000 pieces available', rating: 4.9, reviews: 142,
  },
  {
    id: 18, name: 'Sweet Potatoes', category: 'Vegetables', farm: 'Sunrise Farms', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Central Region', phone: '+233 26 777 8888', price: 6.00,
    unit: 'kg', img: '/images/sweet potatoes.jpg',
    badge: 'VEGETABLES', badgeColor: '#E8F5E9', badgeTextColor: '#2E7D32',
    description: 'Orange-fleshed sweet potatoes, rich in Beta-carotene. Sweet and creamy texture.',
    stock: '400kg available', rating: 4.7, reviews: 38,
  },
  {
    id: 19, name: 'Raw Groundnuts', category: 'Grains', farm: 'Northern Sun', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Northern Region', phone: '+233 20 111 2222', price: 25.00,
    unit: 'bag', img: '/images/raw groundnut.jpg',
    badge: 'GRAINS', badgeColor: '#FFF3E0', badgeTextColor: '#E65100',
    description: 'Unshelled raw groundnuts. Rich in protein and oil. Perfect for roasting or cooking.',
    stock: '60 bags available', rating: 4.6, reviews: 52,
  },
  {
    id: 20, name: 'Exotic Pawpaw', category: 'Fruits', farm: 'Orchard Bliss', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Eastern Region', phone: '+233 24 999 0000', price: 15.00,
    unit: 'piece', img: '/images/pawpaw.jpg',
    badge: 'FRUITS', badgeColor: '#FFF8E1', badgeTextColor: '#FFB300',
    description: 'Large, sweet papaya with vibrant orange flesh. Nutritious and refreshing.',
    stock: '200 pieces available', rating: 4.8, reviews: 29,
  },
  {
    id: 21, name: 'Fresh Avocado', category: 'Fruits', farm: 'Hillside Groves', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Volta Region', phone: '+233 55 444 3333', price: 4.00,
    unit: 'piece', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80',
    badge: 'FRUITS', badgeColor: '#FFF8E1', badgeTextColor: '#FFB300',
    description: 'Creamy Hass avocados. Large size and perfectly ripe for salads or smoothies.',
    stock: '300 pieces available', rating: 4.9, reviews: 74,
  },
  {
    id: 5, name: 'Bagged Fertilizer', category: 'Fertilizers', farm: 'AgroSupply Co.', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Greater Accra', phone: '+233 30 765 4321', price: 250.00,
    unit: 'bag', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    badge: 'FERTILIZERS', badgeColor: '#F3E5F5', badgeTextColor: '#7B1FA2',
    description: 'NPK 15-15-15 multi-purpose fertilizer. Promotes healthy growth and high yields for all crop types.',
    stock: '50 bags available', rating: 4.5, reviews: 30,
  },
  {
    id: 6, name: 'Power Tiller', category: 'Machinery', farm: 'AgroTech Solutions', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Kumasi, Ashanti', phone: '+233 26 555 1111', price: 8500.00,
    unit: 'unit', img: 'https://images.unsplash.com/photo-1472141521943-95eaa152873e?w=600&q=80',
    badge: 'MACHINERY', badgeColor: '#E3F2FD', badgeTextColor: '#1565C0',
    description: 'Versatile 10HP power tiller with multiple attachments. Efficient fuel consumption and easy to maintain.',
    stock: '3 units available', rating: 5.0, reviews: 15,
  },
  {
    id: 7, name: 'Green Peppers', category: 'Vegetables', farm: 'Unity Farms', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Central Region', phone: '+233 24 888 2222', price: 20.00,
    unit: 'kg', img: '/images/green peppers.jpg',
    badge: 'VEGETABLES', badgeColor: '#E8F5E9', badgeTextColor: '#2E7D32',
    description: 'Crunchy and flavorful bell peppers. Organically grown and carefully packed.',
    stock: '200kg available', rating: 4.6, reviews: 28,
  },
  {
    id: 8, name: 'Soya Beans', category: 'Grains', farm: 'Savanna Harvest', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Upper West', phone: '+233 59 111 2222', price: 18.50,
    unit: 'kg', img: '/images/soya beans.jpg',
    badge: 'GRAINS', badgeColor: '#FFF3E0', badgeTextColor: '#E65100',
    description: 'Cleaned and dried soya beans. High protein content, non-GMO certified.',
    stock: '1,500kg available', rating: 4.8, reviews: 19,
  },
  {
    id: 9, name: 'Sweet Oranges', category: 'Fruits', farm: 'Orchard Bliss', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Eastern Region', phone: '+233 20 777 6666', price: 2.50,
    unit: 'piece', img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80',
    badge: 'VEGETABLES', badgeColor: '#E8F5E9', badgeTextColor: '#2E7D32',
    description: 'Big bunches of apem plantains. Organic, sweet, and perfect for roasting or boiling.',
    stock: '50 bunches available', rating: 4.8, reviews: 112,
  },
  {
    id: 7, name: 'Citrus Oranges', category: 'Fruits', farm: 'Orchard Bliss', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Eastern Region', phone: '+233 54 999 0000', price: 20.00,
    unit: 'bag', img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80',
    badge: 'FRUITS', badgeColor: '#FFF8E1', badgeTextColor: '#FFB300',
    description: 'Seedless, juicy navel oranges. Very sweet and high in Vitamin C.',
    stock: '30 bags available', rating: 4.7, reviews: 45,
  },
  {
    id: 8, name: 'Snail Farm Starter Kit', category: 'Tools', farm: 'Eco-Farm Solutions', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Ahafo Region', phone: '+233 59 111 2222', price: 450.00,
    unit: 'jset', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    badge: 'TOOLS', badgeColor: '#F5F5F5', badgeTextColor: '#616161',
    description: 'Complete kit for small-scale snail farming. Includes 10 breeding snails and enclosure.',
    stock: '5 kits available', rating: 4.4, reviews: 12,
  },
  {
    id: 9, name: 'Organic Honey', category: 'Provisions', farm: 'Busy Bees', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Savannah Region', phone: '+233 20 888 7777', price: 60.00,
    unit: 'bottle', img: '/images/organic honey.jpg',
    badge: 'PROVISIONS', badgeColor: '#E1F5FE', badgeTextColor: '#01579B',
    description: 'Pure, unpasteurized forest honey. No additives. 750ml bottles.',
    stock: '25 bottles available', rating: 5.0, reviews: 28,
  },
  {
    id: 10, name: 'Power Tiller 15HP', category: 'Machinery', farm: 'Tractor Hub', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Upper West', phone: '+233 50 123 4444', price: 8500.00,
    unit: 'unit', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80',
    badge: 'MACHINERY', badgeColor: '#E3F2FD', badgeTextColor: '#1565C0',
    description: 'Reliable 15HP walk-behind tractor. Perfect for small to medium-scale tilling and transport.',
    stock: '2 units available', rating: 4.9, reviews: 8,
  },
  {
    id: 11, name: 'Liquid Fertilizers', category: 'Fertilizers', farm: 'Nature Growth', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Bono Region', phone: '+233 55 222 3333', price: 45.00,
    unit: 'liter', img: 'https://images.unsplash.com/photo-1463123081488-789f998ac9c4?w=600&q=80',
    badge: 'FERTILIZERS', badgeColor: '#F3E5F5', badgeTextColor: '#7B1FA2',
    description: 'Organic liquid fertilizer. Fast-acting and easy to apply through irrigation or sprayers.',
    stock: '100 liters available', rating: 4.6, reviews: 22,
  },
  {
    id: 12, name: 'Fresh Ginger', category: 'Vegetables', farm: 'Spice Hills', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Oti Region', phone: '+233 27 666 5555', price: 25.00,
    unit: 'kg', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
    badge: 'VEGETABLES', badgeColor: '#E8F5E9', badgeTextColor: '#2E7D32',
    description: 'Pungent and aromatic ginger roots. Perfect for cooking and traditional remedies.',
    stock: '300kg available', rating: 4.8, reviews: 37,
  },
  {
    id: 13, name: 'Rice (Jasmine)', category: 'Grains', farm: 'Riverside Rice', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Ahafo Region', phone: '+233 54 333 4444', price: 150.00,
    unit: 'bag', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    badge: 'GRAINS', badgeColor: '#FFF3E0', badgeTextColor: '#E65100',
    description: 'Premium long-grain jasmine rice. Fragrant and delicious. Locally parboiled and polished.',
    stock: '40 bags available', rating: 4.7, reviews: 51,
  },
  {
    id: 14, name: 'Pineapples', category: 'Fruits', farm: 'Tropical Gold', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Central Region', phone: '+233 24 222 1111', price: 10.00,
    unit: 'piece', img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80',
    badge: 'FRUITS', badgeColor: '#FFF8E1', badgeTextColor: '#FFB300',
    description: 'Large, sweet, and juicy sugar-loaf pineapples. Harvested at peak ripeness.',
    stock: '200 pieces available', rating: 4.9, reviews: 33,
  },
  {
    id: 15, name: 'Knapsack Sprayer', category: 'Machinery', farm: 'Sprayer World', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Savannah Region', phone: '+233 59 444 3333', price: 350.00,
    unit: 'unit', img: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=600&q=80',
    badge: 'MACHINERY', badgeColor: '#E3F2FD', badgeTextColor: '#1565C0',
    description: '16-liter manual knapsack sprayer. Ergonomic design and high-pressure nozzle.',
    stock: '15 units available', rating: 4.5, reviews: 29,
  },
  {
    id: 101, name: 'Premium Cocoa Beans', category: 'Grains', farm: 'James Asante', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Ashanti Region', phone: '+233 24 123 4567', price: 45.00,
    unit: 'bag', img: '/images/cocoa beans.jpg',
    badge: 'GRAINS', badgeColor: '#FFF3E0', badgeTextColor: '#E65100',
    description: 'A-grade sun-dried cocoa beans from my farm in the Ashanti region.',
    stock: '20 bags available', rating: 5.0, reviews: 12,
  },
  {
    id: 102, name: 'Organic Cocoa Pods', category: 'Grains', farm: 'Forest Gold', ownerEmail: 'james.asante@agrolink.gh',
    location: 'Western North', phone: '+233 24 777 6666', price: 12.00,
    unit: 'pod', img: '/images/cocoa pods.jpg',
    badge: 'GRAINS', badgeColor: '#FFF3E0', badgeTextColor: '#E65100',
    description: 'Freshly harvested large cocoa pods. Sweet white pulp and high-quality beans inside.',
    stock: '500 pods available', rating: 4.9, reviews: 45, status: 'active',
  },
]

function App() {
  const persistedUser = JSON.parse(localStorage.getItem('agrolink_logged_user') || 'null')
  
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    return persistedUser ? (persistedUser.role === 'buyer' ? 'buyerhome' : 'home') : 'landing';
  }

  const [activePage, setActivePageState] = useState(getInitialPage())

  // Wrapper to update both state and hash
  const setActivePage = (page) => {
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
    setActivePageState(page);
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const page = window.location.hash.replace('#', '');
      if (page && page !== activePage) {
        setActivePageState(page);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Sync hash on mount if it's missing but we have a default state
    if (!window.location.hash && activePage) {
      window.location.hash = activePage;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activePage]);

  const [authView, setAuthView] = useState('login') // 'login' or 'signup'
  const [userRole, setUserRole] = useState(persistedUser?.role || 'farmer') // 'buyer', 'farmer', 'engineer'
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('agrolink_dark_mode') === 'true')

  // Global Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [chatTarget, setChatTarget] = useState(null)
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const handleOpenCart = () => setIsCartOpen(true)
  const handleCloseCart = () => setIsCartOpen(false)
  
  const handleOpenChat = (target) => {
    setChatTarget(target)
    setIsChatOpen(true)
  }
  const handleCloseChat = () => {
    setIsChatOpen(false)
    setChatTarget(null)
  }

  const handleOpenNotif = () => setIsNotifOpen(true)
  const handleCloseNotif = () => setIsNotifOpen(false)

  const handleOpenOrders = () => setIsOrdersOpen(true)
  const handleCloseOrders = () => setIsOrdersOpen(false)

  const handleOpenProducts = () => setIsProductsOpen(true)
  const handleCloseProducts = () => setIsProductsOpen(false)

  const handleNotifClick = (notif) => {
    if (notif.type === 'message' && notif.chatTarget) {
      handleOpenChat(notif.chatTarget)
    } else if (notif.type === 'order') {
      // Logic for order notifications could go here, e.g. opening an orders panel
      // For now, let's keep it simple or expand if needed
    }
  }

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('agrolink_dark_mode', isDarkMode)
  }, [isDarkMode])

  const handleToggleDarkMode = () => setIsDarkMode(prev => !prev)

  const [currentUser, setCurrentUser] = useState(persistedUser)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('agrolink_products')
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
  })
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('agrolink_orders')
    return saved ? JSON.parse(saved) : INITIAL_ORDERS
  })
  const [machines, setMachines] = useState(() => {
    const saved = localStorage.getItem('agrolink_machines')
    const parsed = saved ? JSON.parse(saved) : INITIAL_MACHINES
    // Data Recovery: Ensure all machines have ownerEmail and farm for chat
    return parsed.map(m => ({
      ...m,
      ownerEmail: m.ownerEmail || 'james.asante@agrolink.gh',
      farm: m.farm || 'James Asante'
    }))
  })
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('agrolink_notifications')
    return saved ? JSON.parse(saved) : []
  })
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('agrolink_messages')
    return saved ? JSON.parse(saved) : []
  })
  const [cart, setCart] = useState([])
  const [viewCounts, setViewCounts] = useState(() => {
    const saved = localStorage.getItem('agrolink_view_counts')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('agrolink_view_counts', JSON.stringify(viewCounts))
  }, [viewCounts])

  const handleIncrementView = (email) => {
    if (!email) return
    setViewCounts(prev => ({
      ...prev,
      [email]: (prev[email] || 0) + 1
    }))
  }

  // Persistence: Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agrolink_products', JSON.stringify(products))
  }, [products])

  // Persistence: Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agrolink_orders', JSON.stringify(orders))
  }, [orders])

  // Persistence: Save machines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agrolink_machines', JSON.stringify(machines))
  }, [machines])

  // Persistence: Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('agrolink_notifications', JSON.stringify(notifications))
  }, [notifications])

  // Persistence: Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('agrolink_messages', JSON.stringify(messages))
  }, [messages])

  // Triggering HMR to clear Vite's module cache
  console.log("App mounted: forcing cache clear for lucide-react");

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.qty + delta)
        return { ...item, qty: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [
      {
        ...newProduct,
        id: Date.now(),
        farm: currentUser?.name || 'My Farm',
        ownerEmail: currentUser?.email || 'guest@agrolink.gh',
        location: 'Ashanti Region',
        phone: '+233 24 123 4567',
        rating: 5.0,
        reviews: 0,
        img: newProduct.img || 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=600&q=80',
        badge: newProduct.category.toUpperCase(),
        badgeColor: '#E8F5E9',
        badgeTextColor: '#2E7D32',
        stock: `${newProduct.stock} ${newProduct.unit} available`,
        status: 'active',
      },
      ...prev
    ])
  }

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? {
      ...p,
      ...updatedProduct,
      badge: updatedProduct.category.toUpperCase()
    } : p))
  }

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  // --- Machine Handlers ---
  const handleAddMachine = (newMachineData) => {
    const newMachine = {
      id: Date.now(),
      ...newMachineData,
      health: 100, fuel: 100, battery: 100,
      hrs: newMachineData.hrs || 0,
      util: newMachineData.util || 0,
      lastService: 'Just now',
      color: newMachineData.status === 'Online' ? '#22C55E' : (newMachineData.status === 'Warning' ? '#F59E0B' : '#EF4444'),
      iconName: 'Cpu',
      ownerEmail: currentUser?.email || 'guest@agrolink.gh',
      farm: currentUser?.name || 'My Farm'
    }
    setMachines(prev => [newMachine, ...prev])
  }

  const handleUpdateMachine = (updatedMachine) => {
    setMachines(prev => prev.map(m => m.id === updatedMachine.id ? { 
      ...m, 
      ...updatedMachine,
      color: updatedMachine.status === 'Online' ? '#22C55E' : (updatedMachine.status === 'Warning' ? '#F59E0B' : '#EF4444')
    } : m))
  }

  const handleDeleteMachine = (id) => {
    setMachines(prev => prev.filter(m => m.id !== id))
  }

  // --- Checkout Handler ---
  const handleCheckout = (cartItems) => {
    const newOrders = cartItems.map(item => ({
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      productId: item.id,
      productName: item.name,
      farm: item.farm,
      img: item.img,
      buyerName: currentUser?.name || 'Guest Buyer',
      buyerEmail: currentUser?.email || 'guest@agrolink.gh',
      buyerAvatar: currentUser?.avatar,
      ownerEmail: item.ownerEmail,
      qty: item.qty,
      unit: item.unit || 'kg',
      amount: parseFloat(item.price) * item.qty,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    }))

    setOrders(prev => [...newOrders, ...prev])

    // Notify farmers - individual notifications per order for clarity and actionability
    const notificationsToAdd = newOrders.map(order => ({
      id: Date.now() + Math.random(),
      recipientEmail: order.ownerEmail,
      title: 'New Order Received',
      message: `Order for ${order.qty}x ${order.productName} from ${order.buyerName}.`,
      time: 'Just now',
      read: false,
      type: 'order',
      orderId: order.id
    }))
    setNotifications(prev => [...notificationsToAdd, ...prev])
  }

  const handleOrderAction = (notificationId, orderId, action) => {
    // 1. Update order status
    const status = action === 'grant' ? 'delivered' : 'cancelled'
    const success = handleUpdateOrderStatus(orderId, status)

    if (success) {
      // 2. Mark notification as read and update message
      setNotifications(prev => prev.map(n => 
        String(n.id) === String(notificationId) 
          ? { ...n, read: true, type: 'status', message: `Order ${action === 'grant' ? 'granted' : 'rejected'} successfully.` } 
          : n
      ))

      // 3. Add a temporary status notification for the farmer as feedback
      const feedbackNotif = {
        id: Date.now() + Math.random(),
        recipientEmail: currentUser?.email,
        title: action === 'grant' ? 'Order Granted' : 'Order Rejected',
        message: `Status updated to ${status}.`,
        time: 'Just now',
        read: false,
        type: 'status'
      }
      setNotifications(prev => [feedbackNotif, ...prev])
    }
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    let affectedOrder = null

    setOrders(prev => {
      const updated = prev.map(o => {
        if (String(o.id) === String(orderId)) {
          affectedOrder = { ...o, status: newStatus }
          return affectedOrder
        }
        return o
      })
      return updated
    })
    
    // Notify buyer (using a small delay or the captured affectedOrder)
    // Actually, it's safer to use the 'orders' state if it exists, or the captured one.
    if (affectedOrder && affectedOrder.buyerEmail) {
      const buyerNotif = {
        id: Date.now() + Math.random(),
        recipientEmail: affectedOrder.buyerEmail,
        title: 'Order Status Updated',
        message: `Your order for ${affectedOrder.productName || 'product'} is now ${newStatus}.`,
        time: 'Just now',
        read: false,
        type: 'status'
      }
      setNotifications(prev => [buyerNotif, ...prev])
    }

    return affectedOrder !== null
  }

  const handleUpdateProfile = (updatedProfile) => {
    const prevEmail = currentUser?.email;
    if (!prevEmail) return;

    // 1. Update Current User State
    const newUser = { ...currentUser, ...updatedProfile };
    setCurrentUser(newUser);

    // 2. Persistent Storage Sync (Wrapped in try-catch for stability)
    try {
      localStorage.setItem('agrolink_logged_user', JSON.stringify(newUser));

      const usersDB = JSON.parse(localStorage.getItem('agrolink_users') || '[]');
      const updatedDB = usersDB.map(u => u.email === prevEmail ? { ...u, ...updatedProfile } : u);
      localStorage.setItem('agrolink_users', JSON.stringify(updatedDB));
    } catch (err) {
      console.warn('Storage quota exceeded or error:', err);
      // We don't crash here, the app continues with in-memory state
    }

    // 3. Messages Sync
    if (updatedProfile.avatar || updatedProfile.name) {
      setMessages(msgs => msgs.map(m => 
        m.senderEmail === prevEmail ? { 
          ...m, 
          senderAvatar: updatedProfile.avatar || m.senderAvatar, 
          senderName: updatedProfile.name || m.senderName 
        } : m
      ));
    }

    // 4. Products Sync
    setProducts(prods => prods.map(p => {
      if (p && p.ownerEmail === prevEmail) {
        return { 
          ...p, 
          farm: updatedProfile.name || p.farm,
          sellerAvatar: updatedProfile.avatar || p.sellerAvatar
        };
      }
      return p;
    }));
    
    // 5. Machines Sync
    setMachines(macs => macs.map(m => {
      if (m && m.ownerEmail === prevEmail) {
        return { 
          ...m, 
          farm: updatedProfile.name || m.farm,
          ownerAvatar: updatedProfile.avatar || m.ownerAvatar
        };
      }
      return m;
    }));
  }

  const handleSendMessage = (msgData) => {
    const newMessage = {
      id: Date.now(),
      senderEmail: currentUser?.email,
      senderName: currentUser?.name,
      senderAvatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=random`,
      ...msgData,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, newMessage])

    // Notify recipient
    setNotifications(prev => [{
      id: Date.now() + Math.random(),
      recipientEmail: msgData.recipientEmail,
      title: 'New Message',
      message: `${currentUser?.name} sent you a message: "${msgData.text.substring(0, 30)}${msgData.text.length > 30 ? '...' : ''}"`,
      time: 'Just now',
      read: false,
      type: 'message',
      chatTarget: { name: currentUser?.name, email: currentUser?.email }
    }, ...prev])
  }

  const renderPage = () => {
    const userProducts = products.filter(p => p && p.ownerEmail === currentUser?.email)

    switch (activePage) {
      case 'buyerhome': return (
        <BuyerHomePage 
          setActivePage={setActivePage} 
          currentUser={currentUser} 
          orders={orders} 
          notifications={notifications.filter(n => n && n.recipientEmail === currentUser?.email)}
          onMarkNotificationsRead={() => setNotifications(prev => prev.map(n => n.recipientEmail === currentUser?.email ? { ...n, read: true } : n))}
          onOpenChat={handleOpenChat}
          onOpenNotif={handleOpenNotif}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )
      case 'home': {
        const userOrders = orders.filter(o => {
          if (!o) return false
          const product = products.find(p => p && p.id === o.productId)
          return product && product.ownerEmail === currentUser?.email
        })
        return (
          <HomePage 
            setActivePage={setActivePage} 
            userRole={userRole} 
            currentUser={currentUser} 
            products={userProducts} 
            orders={userOrders} 
            machines={machines}
            notifications={notifications.filter(n => n && n.recipientEmail === currentUser?.email)}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onMarkNotificationsRead={() => setNotifications(prev => prev.map(n => n.recipientEmail === currentUser?.email ? { ...n, read: true } : n))}
            onOpenChat={handleOpenChat}
            onOpenNotif={handleOpenNotif}
            onOpenOrders={handleOpenOrders}
            onOpenProducts={handleOpenProducts}
            messages={messages}
            onSendMessage={handleSendMessage}
            viewCount={viewCounts[currentUser?.email] || 0}
          />
        )
      }
      case 'market': return (
        <MarketplacePage
          products={products}
          cart={cart}
          onAddToCart={addToCart}
          onUpdateCartQty={updateCartQty}
          onRemoveFromCart={removeFromCart}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          onOpenCart={handleOpenCart}
          onOpenChat={handleOpenChat}
          onIncrementView={handleIncrementView}
          currentUserEmail={currentUser?.email}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )
      case 'agrobot': return <AgrobotPage userRole={userRole} currentUser={currentUser} />
      case 'myshop': return (
        <MyShopPage
          products={userProducts}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )
      case 'profile': return (
        <ProfilePage
          userRole={userRole}
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onUpdateProfile={handleUpdateProfile}
          onLogout={() => {
            localStorage.removeItem('agrolink_logged_user')
            setCurrentUser(null)
            setUserRole('farmer')
            setActivePage('landing')
          }}
        />
      )
      case 'machinery': return (
        <MachineryPage 
          machines={machines} 
          onAdd={handleAddMachine} 
          onUpdate={handleUpdateMachine}
          onDelete={handleDeleteMachine}
          currentUserEmail={currentUser?.email}
          onOpenChat={handleOpenChat}
          onOpenNotif={handleOpenNotif}
          messages={messages}
          onSendMessage={handleSendMessage}
          notifications={notifications.filter(n => n && n.recipientEmail === currentUser?.email)}
          onMarkNotificationsRead={() => setNotifications(prev => prev.map(n => n.recipientEmail === currentUser?.email ? { ...n, read: true } : n))}
          onIncrementView={handleIncrementView}
        />
      )
      case 'landing': return (
        <LandingPage
          onLoginClick={() => { setAuthView('login'); setActivePage('auth'); }}
          onSignupClick={() => { setAuthView('signup'); setActivePage('auth'); }}
        />
      )
      case 'auth': return (
        <AuthPage
          initialView={authView}
          onLogin={(user) => {
            localStorage.setItem('agrolink_logged_user', JSON.stringify(user))
            setCurrentUser(user)
            setUserRole(user.role)
            setActivePage(user.role === 'buyer' ? 'buyerhome' : 'home')
          }}
        />
      )
      default: return <LandingPage onGetStarted={() => setActivePage('auth')} />
    }
  }

  return (
    <>
      <Layout activePage={activePage} setActivePage={setActivePage} userRole={userRole} currentUser={currentUser}>
        {renderPage()}
      </Layout>

      {/* Global Drawers rendered at root for perfect stacking context */}
      <CartDrawer 
        open={isCartOpen}
        onClose={handleCloseCart}
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />

      <ChatDrawer 
        open={isChatOpen}
        onClose={handleCloseChat}
        recipientName={chatTarget?.name}
        recipientEmail={chatTarget?.email}
        currentUserEmail={currentUser?.email}
        messages={messages}
        onSendMessage={handleSendMessage}
      />

      <NotificationDrawer 
        open={isNotifOpen}
        onClose={handleCloseNotif}
        notifications={notifications.filter(n => n && n.recipientEmail === currentUser?.email)}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => n.recipientEmail === currentUser?.email ? { ...n, read: true } : n))}
        onNotifClick={handleNotifClick}
        onOrderAction={handleOrderAction}
      />

      {/* Quick Panels for Farmer/Engineer Overview */}
      <OrdersPanel 
        open={isOrdersOpen} 
        onClose={handleCloseOrders} 
        orders={orders.filter(o => {
          if (!o) return false
          const p = products.find(prod => prod && prod.id === o.productId)
          return p && p.ownerEmail === currentUser?.email
        })}
        onUpdateStatus={handleUpdateOrderStatus}
        onChat={handleOpenChat}
      />

      <ProductsPanel
        open={isProductsOpen}
        onClose={handleCloseProducts}
        products={products.filter(p => p && p.ownerEmail === currentUser?.email)}
        onDeleteProduct={handleDeleteProduct}
        onNavigateToShop={() => setActivePage('myshop')}
      />
    </>
  )
}

export default App
