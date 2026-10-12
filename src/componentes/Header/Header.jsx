import "./Header.css";
import { Logo } from "./Logo/Logo";
import { CartButton } from "./CartButton/CartButton";
import { SearchBar } from "./SearchBar/SearchBar";

export function Header({ cantidadCarrito = 0, onAbrirCarrito, onAbrirBuscador, esInicio }) {
  return (
    /* Evaluamos la clase condicional según si estamos o no en el inicio */
    <header className={`header ${esInicio ? 'header-inicio' : 'header-claro'}`}>
      <div className="header-top">
        <Logo esInicio={esInicio} />
        <CartButton 
          cantidad={cantidadCarrito} 
          onClick={onAbrirCarrito} 
          esInicio={esInicio}
        />
      </div>

      <SearchBar 
        onClick={onAbrirBuscador} 
        esInicio={esInicio}
      />
    </header>
  );
}