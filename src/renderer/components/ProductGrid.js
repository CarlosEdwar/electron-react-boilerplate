import React from 'react';
import PropTypes from 'prop-types';

function ProductGrid({ products, onAddToCart }) {
  return (
    <div
      className="product-grid"
      style={{
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        overflowY: 'auto',
        height: 'calc(100vh - 180px)', 
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      {products.length === 0 ? (
        <div style={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          padding: '40px',
          color: 'var(--gray-medium)'
        }}>
          Nenhum produto encontrado
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="product-card card fade-in"
            style={{
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              height: '220px', 
            }}
            onClick={() => onAddToCart(product)}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px', flexShrink: 0 }}>
              {product.image}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3
                  style={{
                    color: 'var(--dark-green)',
                    marginBottom: '8px',
                    fontSize: '1rem',
                    lineHeight: '1.2',
                    height: '2.4em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    color: 'var(--secondary-green)',
                    marginBottom: '12px',
                    fontSize: '0.8rem',
                  }}
                >
                  {product.category}
                </p>
              </div>
              <div>
                <div
                  style={{
                    color: 'var(--primary-green)',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    marginBottom: '10px',
                  }}
                >
                  R$ {product.price.toFixed(2)}
                </div>
                <button
                  type="button"
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductGrid;