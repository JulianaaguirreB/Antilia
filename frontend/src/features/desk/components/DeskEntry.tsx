export function DeskEntry({navigate}:{navigate:(path:string)=>void}) {
  return <button type="button" aria-label="Abrir escritorio 3D" className="desk-entry" onClick={()=>navigate('#/mi-escritorio')}>
    <span className="desk-entry-copy"><span className="desk-entry-badge">Escritorio 3D</span><strong>Diseña tu mesa a tu manera</strong><span>Elige entre 3 mesas, coloca tus objetos y guarda tu distribución.</span><b>Abrir editor 3D →</b></span>
    <svg viewBox="0 0 120 110" aria-hidden="true"><ellipse cx="60" cy="93" rx="49" ry="8" fill="#8ecbf5" opacity=".13"/><path d="M16 42v42m43-22v36m49-57v38" stroke="#86bce5" strokeWidth="5" strokeLinecap="round"/><path d="m11 36 48-22 53 24-52 27z" fill="#e7bb67" stroke="#f8dea0" strokeWidth="2"/><path d="m40 32 17-8 22 10-18 9z" fill="#fff4c9"/><path d="m63 48 14-7 15 7-15 8z" fill="#bfe7ff"/></svg>
  </button>;
}
