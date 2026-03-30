# AgroLink

AgroLink is a web-based agricultural marketplace connecting Ghanaian farmers, buyers, and farm engineers. It provides a unified platform for trading farm produce, managing machinery, and accessing AI-powered farming assistance.

## Features

- **Marketplace** -- Browse, search, and filter agricultural products by category. Add items to cart and checkout with order tracking.
- **My Shop** -- Farmers can list, edit, and manage their own products with full CRUD functionality.
- **Machinery Dashboard** -- Farm engineers can monitor and manage equipment with real-time status indicators (health, fuel, temperature, RPM).
- **Agrobot** -- AI-powered farming assistant chatbot for agricultural advice.
- **Chat** -- Direct 1-to-1 messaging between buyers and sellers.
- **Notifications** -- Real-time alerts for new orders, messages, and status updates with accept/reject actions.
- **Role-Based UI** -- Three user roles (Buyer, Farmer, Engineer) each with tailored navigation and dashboards.
- **Dark Mode** -- Toggle between light and dark themes.
- **Responsive Design** -- Sidebar navigation on desktop, bottom nav on mobile.

## Tech Stack

- **React 19** with Vite 7
- **lucide-react** for icons
- **localStorage** for client-side data persistence
- **CSS** with custom properties and dark mode support

## Languages

- JavaScript
- CSS
- HTML

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs on `http://localhost:3000` by default.

## Project Structure

```
src/
  components/    # Reusable UI components (Layout, CartDrawer, ChatDrawer, etc.)
  pages/         # Page-level components (HomePage, MarketplacePage, AuthPage, etc.)
  App.jsx        # Root component with centralized state and routing
  main.jsx       # Entry point
public/
  images/        # Product images
```
