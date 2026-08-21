import "./Header.css";
import { Logo } from "./Logo/Logo";
import { CartButton } from "./CartButton/CartButton";
import { SearchBar } from "./SearchBar/SearchBar";

export function Header({ cantidadCarrito = 0, onAbrirCarrito, onAbrirBuscador }) {
  return (
    <header className="header">
      <div className="header-top">
        <Logo />
        <CartButton 
          cantidad={cantidadCarrito} 
          onClick={onAbrirCarrito} 
        />
      </div>

      <SearchBar onClick={onAbrirBuscador} />
    </header>
  );
}