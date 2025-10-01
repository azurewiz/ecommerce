import React, { useState, useEffect, useMemo } from 'react';

// --- Configuration ---
// These URLs should point to your running microservices.
const PRODUCT_SERVICE_URL = 'http://localhost:8082/api/products';
const ORDER_SERVICE_URL = 'http://localhost:8083/api/orders';

// --- SVG Icons ---
// Using inline SVGs to keep this a single file and avoid external dependencies.
const StarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
  </svg>
);

const CartIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const CloseIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// --- Child Components ---

// Renders a single product card
const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
            <div className="h-48 bg-slate-700 flex items-center justify-center">
                <span className="text-slate-500">{product.category}</span>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                <p className="text-sm text-slate-400 mb-2">{product.brand}</p>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-bold text-cyan-400">${product.price.toFixed(2)}</p>
                    <div className="flex items-center">
                        <StarIcon className="w-5 h-5 text-amber-400" />
                        <span className="text-white ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                </div>
                <button 
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors duration-300 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

// Renders the cart modal
const CartModal = ({ cartItems, onUpdateQuantity, onRemoveItem, onClose, onCheckout, isCheckingOut }) => {
    const subtotal = useMemo(() => 
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-end z-50">
            <div className="w-full max-w-md bg-slate-800 h-full flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">Your Cart</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-slate-400">Your cart is empty.</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center mb-4">
                                <div className="w-16 h-16 bg-slate-700 rounded-md mr-4"></div>
                                <div className="flex-grow">
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-slate-400 text-sm">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                                        className="w-16 bg-slate-700 text-white rounded-md text-center mx-2"
                                        min="1"
                                    />
                                </div>
                                <p className="text-white w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="text-white text-xl font-bold">${subtotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-600 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
    // State management
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [lastOrderStatus, setLastOrderStatus] = useState(null); // 'success' or 'error'

    // --- Data Fetching ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(PRODUCT_SERVICE_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // --- Cart Logic ---
    const handleAddToCart = (productToAdd) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productToAdd.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...productToAdd, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            handleRemoveItem(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: quantity } : item
            )
        );
    };

    const handleRemoveItem = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setLastOrderStatus(null);

        // Format cart items for the order processing service
        const orderItems = cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        try {
            const response = await fetch(ORDER_SERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderItems),
            });

            if (!response.ok) {
                throw new Error(`Checkout failed! Status: ${response.status}`);
            }

            // Order successful
            setLastOrderStatus('success');
            setCartItems([]);
            setIsCartOpen(false);

        } catch (error) {
            console.error("Checkout error:", error);
            setLastOrderStatus('error');
        } finally {
            setIsCheckingOut(false);
            // Hide the status message after a few seconds
            setTimeout(() => setLastOrderStatus(null), 5000);
        }
    };

    // --- Render Logic ---
    if (isLoading) {
        return <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">Loading Products...</div>;
    }
    
    if (error) {
        return <div className="bg-slate-900 text-red-400 min-h-screen flex items-center justify-center">Error: Could not connect to the Product Service. Is it running? <br/>Details: {error}</div>;
    }

    return (
        <div className="bg-slate-900 min-h-screen font-sans text-white">
            {/* Header */}
            <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-40">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Quantum <span className="text-cyan-400">E-Store</span></h1>
                    <button onClick={() => setIsCartOpen(true)} className="relative">
                        <CartIcon className="w-7 h-7 text-slate-300 hover:text-cyan-400 transition-colors" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4">
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </main>
            
            {/* Cart Modal */}
            {isCartOpen && (
                <CartModal 
                    cartItems={cartItems} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClose={() => setIsCartOpen(false)}
                    onCheckout={handleCheckout}
                    isCheckingOut={isCheckingOut}
                />
            )}

            {/* Status Toasts */}
            {lastOrderStatus === 'success' && (
                 <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
                    Order placed successfully!
                </div>
            )}
            {lastOrderStatus === 'error' && (
                 <div className="fixed bottom-5 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
                    Failed to place order. Please try again.
                </div>
            )}
        </div>
    );
}
