import './BarraBeneficios.css';

const BENEFICIOS = [
  {
    id: 'entrega',
    texto: 'Entrega en el momento',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 12h13l3-3v6l-3-3H3z" />
      </svg>
    ),
  },
  {
    id: 'horario',
    texto: 'De 9 a 18 hs',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="7" x2="12" y2="12" />
        <line x1="12" y1="12" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    id: 'zona',
    texto: 'Hurlingham',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

export const BarraBeneficios = () => {
  return (
    <div className="barra-beneficios">
      {BENEFICIOS.map(({ id, texto, icon }) => (
        <div key={id} className="beneficio">
          {icon}
          <p>{texto}</p>
        </div>
      ))}
    </div>
  );
};