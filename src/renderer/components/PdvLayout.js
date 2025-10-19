import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Home, 
  FileText, 
  PenTool, 
  Monitor, 
  Wrench, 
  Package, 
  ShoppingCart, 
  Search, 
  Clock, 
  Calendar, 
  Plus, 
  Minus, 
  X, 
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import logoImg from '../../../assets/Icon LS.jpg';

function PdvLayout({ products, cart, onAddToCart, onRemoveItem, onUpdateQuantity, total, onCompleteSale }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tudo');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['Tudo', ...new Set(products.map(p => p.category))];

  
  const categoryIcons = {
    'Tudo': Home,
    'Papelaria': FileText,
    'Escritório': PenTool,
    'Informática': Monitor,
    'Serviços': Wrench
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tudo' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category) => {
    if (category === 'Tudo') return products.length;
    return products.filter(p => p.category === category).length;
  };

  
  const renderProductIcon = (product) => {
    
    if (product.image && categoryIcons[product.category]) {
      const IconComponent = categoryIcons[product.category];
      return <IconComponent size={24} />;
    }
    
    return <Package size={24} />;
  };

  return (
    <div className="pdv-container">
      <div className="pdv-main">
        <header className="pdv-header">
          <div className="pdv-header-info">
            <img 
              src={logoImg} 
              alt="Logo LS Variedades" 
              className="pdv-logo" 
              style={{ height: 70, marginRight: 12, verticalAlign: 'middle' }} 
            />
            <h1>LS Variedades</h1>
            <div className="pdv-time">
              <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {currentTime.toLocaleDateString('pt-BR')} • 
              <Clock size={12} style={{ marginLeft: '8px', marginRight: '4px', verticalAlign: 'middle' }} />
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
          </div>
          <div className="cart-summary">
            <ShoppingCart size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            <span className="cart-count">{cart.length}</span> itens
          </div>
        </header>

        <div className="main-content">
          <aside className="categories-sidebar">
            {categories.map(category => {
              const IconComponent = categoryIcons[category] || Home;
              return (
                <button
                  key={category}
                  className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                >
                  <span className="category-icon">
                    <IconComponent size={18} />
                  </span>
                  <span className="category-name">{category}</span>
                  <span className="category-count">{getCategoryCount(category)}</span>
                </button>
              );
            })}
          </aside>

          <main className="products-section">
            <div className="search-container">
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Buscar produtos ou serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Search size={48} />
                  </div>
                  <h3>Nenhum produto encontrado</h3>
                  <p>Tente alterar os filtros ou buscar por outro termo</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <article
                    key={product.id}
                    className="product-card"
                    onClick={() => onAddToCart(product)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="product-icon">
                      {renderProductIcon(product)}
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">R$ {product.price.toFixed(2)}</p>
                    {product.type === 'product' && (
                      <p className={`product-stock ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
                        {product.stock > 0 ? (
                          <>
                            {product.stock} em estoque
                            {product.stock < 10 && (
                              <AlertTriangle size={12} style={{ marginLeft: '4px', color: '#e6a000', verticalAlign: 'middle' }} />
                            )}
                          </>
                        ) : 'Sem estoque'}
                      </p>
                    )}
                    {product.type === 'service' && product.unit && (
                      <p className="product-unit">{product.unit}</p>
                    )}
                  </article>
                ))
              )}
            </div>
          </main>
        </div>
      </div>

      <aside className="cart-sidebar">
        <div className="cart-header">
          <h2>
            <ShoppingCart size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Carrinho
          </h2>
          <p className="cart-items-count">
            {cart.length} {cart.length === 1 ? 'item' : 'itens'}
          </p>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <ShoppingCart size={48} />
              </div>
              <h3>Carrinho vazio</h3>
              <p>Adicione produtos para começar</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-icon">
                  {renderProductIcon(item)}
                </div>
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">
                    R$ {item.price.toFixed(2)} {item.unit && `• ${item.unit}`}
                  </p>
                </div>
                <div className="cart-controls">
                  <button
                    className="quantity-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateQuantity(item.id, item.quantity - 1);
                    }}
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateQuantity(item.id, item.quantity + 1);
                    }}
                    disabled={item.type === 'product' && item.quantity >= item.stock}
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    aria-label="Remover item"
                    title="Remover item"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <footer className="cart-footer">
            <div className="total-display">
              <span>Total:</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={onCompleteSale}>
              <CreditCard size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Finalizar Venda
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}

PdvLayout.propTypes = {
  products: PropTypes.array.isRequired,
  cart: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  onCompleteSale: PropTypes.func.isRequired,
};

export default PdvLayout;