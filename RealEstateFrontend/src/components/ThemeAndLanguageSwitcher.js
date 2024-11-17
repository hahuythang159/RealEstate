import { useLocation } from 'react-router-dom';

const ThemeAndLanguageSwitcher = ({
  isDarkMode,
  locale,
  onThemeToggle,
  onLocaleChange,
}) => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }
  return (
    <div
      className={`fixed-circle ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      style={{
        padding: '10px',
        display: 'flex',
        gap: '15px',
        paddingLeft: '1350px',
        backgroundColor: isDarkMode ? '#333' : '#fff',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <i
        className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'} ${isDarkMode ? 'active' : ''}`}
        onClick={onThemeToggle}
        style={{
          fontSize: '15px',
          cursor: 'pointer',
          color: isDarkMode ? '#fff' : '#FFD700',
        }}
      />
      <i
        className={`fas fa-language ${locale === 'vi' ? 'active' : ''}`}
        onClick={onLocaleChange}
        style={{
          fontSize: '15px',
          cursor: 'pointer',
          gap: '5px',
          position: 'relative',
        }}
      >
        <i
          style={{
            marginLeft: '2px',
            fontSize: '12px',
            position: 'absolute',
          }}
        >
          {locale === 'vi' ? 'VN' : 'EN'}
        </i>
      </i>
    </div>
  );
};
export default ThemeAndLanguageSwitcher;
