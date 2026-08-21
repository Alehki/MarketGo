import "./SearchBar.css";

export function SearchBar({ onClick }) {
  return (
    <div className="search-bar" onClick={onClick}>
      <input
        type="text"
        placeholder="Buscar productos..."
        readOnly
      />

      <div className="search-icon-container">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <line
            x1="20"
            y1="20"
            x2="16.5"
            y2="16.5"
          />
        </svg>
      </div>
    </div>
  );
}