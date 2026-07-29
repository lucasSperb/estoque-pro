import React from 'react';
import './Input.css';

export default function Input({
  type = 'text',
  label,
  icon, // Recebe como "icon"
  error,
  className = '',
  ...props
}) {
  // Verifica se o ícone foi passado como função/componente (ex: icon={FiSearch}) ou JSX (ex: icon={<FiSearch />})
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'function' || typeof icon === 'object' && icon.$$typeof) {
      // Se for um componente React do tipo função (FiSearch) ou um elemento JSX (<FiSearch />)
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon, {
          className: `uiInput__icon ${icon.props.className || ''}`.trim(),
        });
      }
      const IconComponent = icon;
      return <IconComponent className="uiInput__icon" />;
    }

    return null;
  };

  return (
    <div className={`uiInput ${error ? 'uiInput--error' : ''} ${className}`}>
      {label && <label className="uiInput__label">{label}</label>}
      <div className="uiInput__container">
        {renderIcon()}
        <input
          type={type}
          className={`uiInput__field ${icon ? 'uiInput__field--hasIcon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="uiInput__errorMessage">{error}</span>}
    </div>
  );
}