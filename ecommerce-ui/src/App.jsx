import React, { useState, useEffect, useMemo } from 'react';

// --- Configuration ---
const API_GATEWAY_URL = 'http://localhost:8084';
const PRODUCT_SERVICE_URL = `${API_GATEWAY_URL}/api/products`;
const AUTH_SERVICE_URL = `${API_GATEWAY_URL}/api/auth`;
const ORDER_SERVICE_URL = `${API_GATEWAY_URL}/api/orders`;

// --- SVG Icons ---
const StarIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" /></svg> );
const CartIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> );
const CloseIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const TrashIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );
const CheckCircleIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> );

// --- Child Components ---

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group flex flex-col">
            <div onClick={() => onViewDetails(product)} className="cursor-pointer">
                <div className="h-48 w-full overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">{product.brand}</p>
                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-cyan-400">${product.price.toFixed(2)}</p>
                        <div className="flex items-center">
                            <StarIcon className="w-5 h-5 text-amber-400" />
                            <span className="text-white ml-1">{product.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 pt-0">
                <button 
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors duration-300">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const CartModal = ({ cartItems, onUpdateQuantity, onRemoveItem, onClose, onCheckout, isCheckingOut }) => {
    const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-end z-50">
            <div className="w-full max-w-md bg-slate-800 h-full flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">Your Cart</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><CloseIcon className="w-6 h-6" /></button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center"><p className="text-slate-400">Your cart is empty.</p></div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover bg-slate-700 rounded-md mr-4"/>
                                <div className="flex-grow"><p className="text-white font-medium">{item.name}</p><p className="text-slate-400 text-sm">${item.price.toFixed(2)}</p></div>
                                <div className="flex items-center">
                                    <input type="number" value={item.quantity} onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))} className="w-16 bg-slate-700 text-white rounded-md text-center mx-2" min="1"/>
                                </div>
                                <button onClick={() => onRemoveItem(item.id)} className="text-slate-500 hover:text-red-500 ml-2 transition-colors"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                    </div>
                )}
                {cartItems.length > 0 && (
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex justify-between items-center mb-4"><span className="text-slate-400">Subtotal</span><span className="text-white text-xl font-bold">${subtotal.toFixed(2)}</span></div>
                        <button onClick={onCheckout} disabled={isCheckingOut} className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-600 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-end p-2">
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 pt-0">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div><img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg bg-slate-700" /></div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                            <p className="text-lg text-slate-400 mb-4">{product.brand}</p>
                            <p className="text-4xl font-extrabold text-cyan-400 mb-6">${product.price.toFixed(2)}</p>
                            <p className="text-slate-300 mb-6">{product.description}</p>
                            <button onClick={() => { onAddToCart(product); onClose(); }} className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-600 transition-colors duration-300">Add to Cart</button>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Features</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">{product.features?.map((feature, index) => <li key={index}>{feature}</li>)}</ul>
                    </div>
                     <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2 mb-4">Specifications</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-300">{product.specifications && Object.entries(product.specifications).map(([key, value]) => (<div key={key}><span className="font-semibold text-slate-400">{key}:</span> {value}</div>))}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderConfirmationPage = ({ order, onContinueShopping }) => {
    if (!order) { return ( <div className="container mx-auto p-4 text-center"><h2 className="text-2xl font-bold text-red-400">Order Not Found</h2><p className="text-slate-400">Something went wrong. Please try again.</p><button onClick={onContinueShopping} className="mt-6 bg-cyan-500 text-white font-bold py-2 px-6 rounded-md hover:bg-cyan-600 transition-colors">Back to Store</button></div>); }
    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-8">
                <div className="text-center mb-8">
                    <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Thank You For Your Order!</h1>
                    <p className="text-slate-400 mt-2">Your order has been placed successfully.</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold text-white mb-2">Order Summary</h2>
                    <div className="flex justify-between text-slate-300"><span>Order ID:</span><span className="font-mono">{order.id}</span></div>
                    <div className="flex justify-between text-slate-300"><span>Order Date:</span><span>{new Date(order.orderDate).toLocaleDateString()}</span></div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Items Ordered</h3>
                    <div className="space-y-4">{order.items.map(item => (<div key={item.productId} className="flex justify-between items-center"><div><p className="font-medium text-white">{item.productName}</p><p className="text-sm text-slate-400">Qty: {item.quantity}</p></div><p className="text-white">${(item.priceAtPurchase * item.quantity).toFixed(2)}</p></div>))}</div>
                </div>
                <div className="border-t border-slate-700 mt-6 pt-6">
                    <div className="flex justify-between font-bold text-xl text-white"><span>Total:</span><span>${order.totalPrice.toFixed(2)}</span></div>
                </div>
                 <div className="text-center mt-8">
                    <button onClick={onContinueShopping} className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-md hover:bg-cyan-600 transition-colors">Continue Shopping</button>
                </div>
            </div>
        </main>
    );
};

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault(); setIsLoading(true); setError(''); setMessage('');
        try {
            const response = await fetch(`${AUTH_SERVICE_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }), });
            if (!response.ok) { const errorText = await response.text(); throw new Error(errorText || 'Registration failed'); }
            setMessage('Registration successful! Please log in.');
            setMode('login');
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    };

    const handleLogin = async (e) => {
        e.preventDefault(); setIsLoading(true); setError('');
        try {
            const response = await fetch(`${AUTH_SERVICE_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), });
             if (!response.ok) { const errorText = await response.text(); throw new Error(errorText || 'Login failed'); }
            const data = await response.json();
            onLoginSuccess(data.accessToken);
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-sm p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
                {mode === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
                        {error && <p className="bg-red-900/50 text-red-300 text-sm p-3 rounded-md mb-4">{error}</p>}
                        {message && <p className="bg-green-900/50 text-green-300 text-sm p-3 rounded-md mb-4">{message}</p>}
                        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-md mb-4" required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-md mb-4" required />
                        <button type="submit" disabled={isLoading} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-md hover:bg-cyan-600 disabled:bg-slate-600">{isLoading ? 'Logging in...' : 'Login'}</button>
                        <p className="text-center text-sm text-slate-400 mt-4">Don't have an account? <button type="button" onClick={() => { setMode('register'); setError(''); }} className="text-cyan-400 font-semibold">Sign Up</button></p>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
                        {error && <p className="bg-red-900/50 text-red-300 text-sm p-3 rounded-md mb-4">{error}</p>}
                        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-md mb-4" required />
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-md mb-4" required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-md mb-4" required />
                        <button type="submit" disabled={isLoading} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-md hover:bg-cyan-600 disabled:bg-slate-600">{isLoading ? 'Creating Account...' : 'Sign Up'}</button>
                        <p className="text-center text-sm text-slate-400 mt-4">Already have an account? <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-cyan-400 font-semibold">Log In</button></p>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function App() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [view, setView] = useState('store');
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [authActionCallback, setAuthActionCallback] = useState(null);

    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) { return []; }
    });

    useEffect(() => { localStorage.setItem('cartItems', JSON.stringify(cartItems)); }, [cartItems]);
    useEffect(() => {
        if (authToken) {
            localStorage.setItem('authToken', authToken);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [authToken]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(PRODUCT_SERVICE_URL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

    const handleAddToCart = (productToAdd) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productToAdd.id);
            if (existingItem) {
                return prevItems.map(item => item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevItems, { ...productToAdd, quantity: 1 }];
        });
    };
    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) { handleRemoveItem(productId); return; }
        setCartItems(prevItems => prevItems.map(item => item.id === productId ? { ...item, quantity } : item));
    };
    const handleRemoveItem = (productId) => { setCartItems(prevItems => prevItems.filter(item => item.id !== productId)); };

    const handleCheckout = async () => {
        if (!authToken) {
            setAuthActionCallback(() => () => handleCheckout());
            setIsAuthModalOpen(true);
            setIsCartOpen(false);
            return;
        }
        setIsCheckingOut(true);
        const orderItems = cartItems.map(item => ({ productId: item.id, quantity: item.quantity }));
        try {
            const response = await fetch(ORDER_SERVICE_URL, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, 
                body: JSON.stringify(orderItems) 
            });
            if (!response.ok) throw new Error(`Checkout failed! Status: ${response.status}`);
            const newOrder = await response.json();
            setConfirmedOrder(newOrder);
            setView('confirmation');
            setCartItems([]);
            setIsCartOpen(false);
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setIsCheckingOut(false);
        }
    };
    
    const handleLoginSuccess = (token) => {
        setAuthToken(token);
        setIsAuthModalOpen(false);
        if (authActionCallback) {
            authActionCallback();
            setAuthActionCallback(null);
        }
    };

    const handleLogout = () => { setAuthToken(null); };
    
    const renderHeader = () => (
        <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-40">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => setView('store')}> Quantum <span className="text-cyan-400">E-Store</span> </h1>
                <div className="flex items-center space-x-4">
                    {view === 'store' && (
                        <button onClick={() => setIsCartOpen(true)} className="relative">
                            <CartIcon className="w-7 h-7 text-slate-300 hover:text-cyan-400 transition-colors" />
                            {cartItems.length > 0 && (<span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>)}
                        </button>
                    )}
                    {authToken ? (<button onClick={handleLogout} className="text-sm font-semibold text-slate-300 hover:text-white">Logout</button>) : (<button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-semibold text-slate-300 hover:text-white">Login</button>)}
                </div>
            </nav>
        </header>
    );

    if (isLoading) return <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">Loading Products...</div>;
    if (error) return <div className="bg-slate-900 text-red-400 min-h-screen flex items-center justify-center">Error: Could not connect to the Product Service. Is it running? <br/>Details: {error}</div>;

    return (
        <div className="bg-slate-900 min-h-screen font-sans text-white">
            {renderHeader()}
            
            {view === 'store' && (
                <main className="container mx-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onViewDetails={setSelectedProduct} />
                        ))}
                    </div>
                </main>
            )}

            {view === 'confirmation' && (
                <OrderConfirmationPage order={confirmedOrder} onContinueShopping={() => setView('store')} />
            )}

            {isCartOpen && <CartModal cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} isCheckingOut={isCheckingOut} />}
            <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
        </div>
    );
}