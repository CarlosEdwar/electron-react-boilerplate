import React from 'react';
import PropTypes from 'prop-types';

function ShoppingCart({
  cart,
  onRemoveItem,
  onUpdateQuantity,
  total,
  onCompleteSale,
}) {
  return (
    <div
      className="shopping-cart"
      style={{
        width: '350px',
        background: 'var(--text-light)',
        borderLeft: '1px solid var(--gray-medium)',
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          color: 'var(--primary-green)',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        🛒 Carrinho
      </h2>

      <div style={{ flex: 1 }}>
        {cart.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--gray-medium)',
              marginTop: '50px',
            }}
          >
            Carrinho vazio
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="cart-item card"
              style={{
                padding: '15px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    color: 'var(--secondary-green)',
                    fontSize: '0.8rem',
                  }}
                >
                  R$ {item.price.toFixed(2)}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    minWidth: '20px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                  }}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="secondary"
                style={{
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div style={{ marginTop: 'auto' }}>
          <div
            style={{
              borderTop: '2px solid var(--gray-medium)',
              paddingTop: '15px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: 'var(--primary-green)',
              }}
            >
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCompleteSale}
            className="accent"
            style={{ width: '100%' }}
          >
            Finalizar Venda
          </button>
        </div>
      )}
    </div>
  );
}

ShoppingCart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  onCompleteSale: PropTypes.func.isRequired,
};
export default ShoppingCart;
