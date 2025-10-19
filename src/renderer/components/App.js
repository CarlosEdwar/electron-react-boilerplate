import React, { useState, useEffect, useCallback } from 'react';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  BarChart3,
  Loader,
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';
import PdvLayout from './PdvLayout';
import StockManager from './StockManager';
import SalesHistory from './SalesHistory';
import ProductManager from './ProductManager';
import CashRegister from './CashRegister';
import PaymentModal from './PaymentModal';


const Notification = ({ message, type, onClose }) => (
  <div className={`notification ${type}`}>
    {type === 'success' && <TrendingUp size={18} />}
    {type === 'error' && <X size={18} />}
    {type === 'info' && <AlertCircle size={18} />}
    <span>{message}</span>
    <button
      type="button"
      className="notification-close"
      onClick={onClose}
      aria-label="Fechar notificação"
    >
      <X size={16} />
    </button>
  </div>
);

function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('pdv');
  const [products, setProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type }), 5000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, salesData] = await Promise.all([
        window.electron.database.getProducts(),
        window.electron.database.getSalesWithItems()
      ]);
      setProducts(productsData || []);
      setSalesHistory(salesData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setProducts([]);
      setSalesHistory([]);
      showNotification('Erro ao carregar dados!', 'error');
    }
    setLoading(false);
  };

  const handleProductAdded = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
    showNotification('Produto adicionado com sucesso!', 'success');
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => prev.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    showNotification('Produto atualizado com sucesso!', 'success');
  };

  const handleProductDeleted = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showNotification('Produto excluído com sucesso!', 'success');
  };

  
  const addToCart = (product) => {
    if (product.type === 'product' && product.stock <= 0) {
      showNotification('Produto sem estoque!', 'error');
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && product.type === 'product' && newQuantity > product.stock) {
      showNotification(`Estoque insuficiente! Disponível: ${product.stock}`, 'error');
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const completeSale = () => {
    if (cart.length === 0) {
      showNotification('Carrinho vazio!', 'error');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentData) => {
    let paymentMethod, saleData;
    if (typeof paymentData === 'string') {
      paymentMethod = paymentData;
      saleData = {
        total: getTotal(),
        paymentMethod: paymentMethod,
        items: cart
      };
    } else {
      paymentMethod = 'split';
      saleData = {
        total: getTotal(),
        paymentMethod: paymentMethod,
        paymentDetails: paymentData.payments,
        items: cart
      };
    }

    try {
      const result = await window.electron.database.createSale(saleData);
      if (result.success) {
        await loadData();
        setCart([]);
        setShowPaymentModal(false);
        if (typeof paymentData === 'string') {
          showNotification(`Venda finalizada com sucesso via ${paymentMethod.toUpperCase()}!`, 'success');
        } else {
          showNotification(`Venda finalizada com pagamento dividido!`, 'success');
        }
      } else {
        showNotification('Erro ao finalizar venda: ' + result.error, 'error');
      }
    } catch (error) {
      
      showNotification('Erro ao finalizar venda!', 'error');
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      const result = await window.electron.database.updateProductStock(productId, parseInt(newStock));
      if (result.success) {
        await loadData(); 
        showNotification('Estoque atualizado com sucesso!', 'success');
      } else {
        showNotification('Erro ao atualizar estoque!', 'error');
      }
    } catch (error) {
      showNotification('Erro ao atualizar estoque!', 'error');
    }
  };

  const handleBarcodeScanned = useCallback((barcode) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      showNotification(`Produto encontrado: ${product.name} - Código: ${barcode}`, 'success');
      console.log(`✅ Produto encontrado: ${product.name} - Código: ${barcode}`);
    } else {
      showNotification(`Produto com código ${barcode} não encontrado no sistema!`, 'error');
    }
  }, [products, addToCart]);

  useEffect(() => {
    let barcodeBuffer = '';
    let barcodeTimeout;

    const handleGlobalKeydown = (event) => {
      const activeElement = document.activeElement;
      const ignoreElements = ['INPUT', 'TEXTAREA', 'SELECT'];
      if (ignoreElements.includes(activeElement?.tagName)) {
        return;
      }
      const key = event.key;
      if (key === 'Enter' && barcodeBuffer.length > 0) {
        handleBarcodeScanned(barcodeBuffer);
        barcodeBuffer = '';
        return;
      }
      if (/^\d$/.test(key)) {
        barcodeBuffer += key;
        clearTimeout(barcodeTimeout);
        barcodeTimeout = setTimeout(() => {
          barcodeBuffer = '';
        }, 100);
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
      clearTimeout(barcodeTimeout);
    };
  }, [handleBarcodeScanned]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-icon">
            <Loader size={48} className="loading-spinner" />
          </div>
          <h2>Carregando PDV...</h2>
        </div>
      </div>
    );
  }

  
  const tabs = [
    { id: 'pdv', label: 'Inicio', icon: Store },
    { id: 'stock', label: 'Estoque', icon: Package },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'cash', label: 'Caixa', icon: CreditCard },
    { id: 'history', label: 'Vendas', icon: BarChart3 }
  ];

  return (
    <div className="app-container">
      
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: 'info' })}
        />
      )}
      <nav className="main-nav">
        <div className="nav-container">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <IconComponent size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <main className="main-content-wrapper">
        {activeTab === 'pdv' && (
          <>
            <PdvLayout
              products={products}
              cart={cart}
              onAddToCart={addToCart}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              total={getTotal()}
              onCompleteSale={completeSale}
            />
            {showPaymentModal && (
              <PaymentModal
                total={getTotal()}
                onClose={() => setShowPaymentModal(false)}
                onPaymentComplete={handlePaymentComplete}
              />
            )}
          </>
        )}
        {activeTab === 'stock' && (
          <StockManager products={products} onUpdateStock={updateStock} />
        )}
        {activeTab === 'products' && (
          <ProductManager
            products={products}
            onProductAdded={handleProductAdded}
            onProductUpdated={handleProductUpdated}
            onProductDeleted={handleProductDeleted}
          />
        )}
        {activeTab === 'cash' && (
          <CashRegister />
        )}
        {activeTab === 'history' && (
          <SalesHistory sales={salesHistory} />
        )}
      </main>
    </div>
  );
}

export default App;