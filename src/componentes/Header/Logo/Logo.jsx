import "./Logo.css";

export function Logo({ esInicio }) {
  return (
    <div className="logo-text">
      <span className="market">Market</span>
      <span className={`go ${esInicio ? 'go-inicio' : 'go-claro'}`}>GO</span>
    </div>
  );
}