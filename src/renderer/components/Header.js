import React from 'react';
import PropTypes from 'prop-types';

function Header({ searchTerm, onSearchChange }) {
  return (
    <header
      className="header card"
      style={{
        margin: '20px',
        marginBottom: '0',
        padding: '15px 20px',
      }}
    >
      <div className="header-content">
        <h1
          style={{
            color: 'var(--primary-green)',
            marginBottom: '15px',
            fontSize: '1.6rem',
            textAlign: 'center',
          }}
        >
          🏪 LS Variedades
        </h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            style={{
              padding: '12px 16px',
              border: '2px solid var(--gray-medium)',
              borderRadius: '8px',
              width: '100%',
              fontSize: '1rem',
              transition: 'border-color 0.3s',
            }}
          />
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default Header;