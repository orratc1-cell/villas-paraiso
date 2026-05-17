import { useState, useEffect } from "react";

const FOTOS = [
  "/mnt/user-data/uploads/IMG_2629.jpeg",
  "/mnt/user-data/uploads/IMG_2551.jpeg",
  "/mnt/user-data/uploads/IMG_2051.jpeg",
  "/mnt/user-data/uploads/IMG_2525.jpeg",
  "/mnt/user-data/uploads/IMG_1929.jpeg",
  "/mnt/user-data/uploads/IMG_1820.jpeg",
  "/mnt/user-data/uploads/IMG_1930.jpeg",
  "/mnt/user-data/uploads/IMG_1926.jpeg",
  "/mnt/user-data/uploads/IMG_8611.jpeg",
  "/mnt/user-data/uploads/IMG_2618.jpeg",
  "/mnt/user-data/uploads/00D77DB6-B5E3-4A99-A103-6C8B3C2DB1C4.jpeg",
];

const PAQUETES = [
  { id:"pasadia", nombre:"Pasadía", precio:8000, icono:"☀️", horario:"9:00 AM – 6:00 PM",
    descripcion:"Disfruta la villa de día con acceso completo a todas las instalaciones.",
    incluye:["Piscina adultos y niños","Área BBQ","Áreas verdes","Estacionamiento","Planta eléctrica"] },
  { id:"amanecida", nombre:"Amanecida", precio:10000, icono:"🌙", horario:"6:00 PM – 6:00 AM",
    descripcion:"Vive la experiencia completa de noche con todos los servicios disponibles.",
    incluye:["Piscina con luces LED","Área BBQ","Terraza","Ambiente nocturno","Planta eléctrica"] },
];

const AMENIDADES = [
  {icono:"🏊",texto:"Piscina adultos"},{icono:"👶",texto:"Piscina niños"},
  {icono:"🔥",texto:"Área BBQ"},{icono:"🌿",texto:"Jardines privados"},
  {icono:"⚡",texto:"Planta eléctrica"},{icono:"🏡",texto:"Ambiente privado"},
  {icono:"🌴",texto:"Palmar tropical"},{icono:"🪵",texto:"Terraza de madera"},
];


const RESENAS = [
  { nombre: "María G.", estrellas: 5, texto: "Increíble lugar, la piscina es hermosa y el ambiente muy privado. Volvemos pronto!", fecha: "Abril 2025" },
  { nombre: "Carlos R.", estrellas: 5, texto: "Celebramos el cumpleaños de mi esposa aquí y fue perfecto. Todo limpio y muy bien cuidado.", fecha: "Marzo 2025" },
  { nombre: "Paola M.", estrellas: 5, texto: "La mejor pasadía que hemos tenido. La piscina de noche con las luces es espectacular.", fecha: "Febrero 2025" },
  { nombre: "José A.", estrellas: 5, texto: "Excelente lugar para compartir en familia. Los jardines son preciosos y el área BBQ top.", fecha: "Enero 2025" },
];

const FAQS = [
  { q: "¿Se puede llevar música y alcohol?", a: "Sí, puedes traer tu música y bebidas. Contamos con área de bar y espacio para disfrutar." },
  { q: "¿Hay estacionamiento?", a: "Sí, contamos con amplio estacionamiento privado dentro de la villa." },
  { q: "¿Cuántas personas entran máximo?", a: "La villa tiene capacidad para hasta 20 personas cómodamente." },
  { q: "¿Cómo confirmo mi reserva?", a: "Una vez enviada tu solicitud por WhatsApp, te confirmamos disponibilidad y coordinas el pago." },
  { q: "¿Se puede hacer fiestas o eventos?", a: "¡Claro! Somos perfectos para cumpleaños, reuniones familiares y celebraciones privadas." },
  { q: "¿La piscina tiene luces de noche?", a: "Sí, la piscina tiene iluminación LED azul para las amanecidas, creando un ambiente espectacular." },
];

const WHATSAPP = "18093970376";
const PAYPAL_EMAIL = "osvaldo1988rosario@hotmail.com";
const ADMIN_PASS = "paraiso2026";
// Precio en USD aproximado (1 USD ≈ 60 RD$)
const toUSD = rd => (rd / 60).toFixed(2);
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const fmtRD = n => "RD$" + n.toLocaleString("es-DO");
const dateKey = (y,m,d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const fmtFecha = f => f ? new Date(f+"T12:00:00").toLocaleDateString("es-DO",{weekday:"long",year:"numeric",month:"long",day:"numeric"}) : "";

function buildWA({paquete,fecha,personas,nombre,telefono,mensaje}) {
  const pkg = PAQUETES.find(p=>p.id===paquete);
  return encodeURIComponent(
    `¡Hola! Quiero reservar en *Villas Paraíso* 🌴\n\n`+
    `*Paquete:* ${pkg?.nombre} (${fmtRD(pkg?.precio)})\n`+
    `*Fecha:* ${fmtFecha(fecha)}\n`+
    `*Personas:* ${personas}\n`+
    `*Nombre:* ${nombre}\n`+
    `*Teléfono:* ${telefono}\n`+
    (mensaje?`*Mensaje:* ${mensaje}\n`:"")+
    `\nEspero su confirmación. ¡Gracias!`
  );
}

// ── COMPONENTE CALENDARIO ────────────────────────────────────
function Calendario({ ocupados, setOcupados, modoAdmin, onSelect, seleccionada }) {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());

  const primerDia = new Date(anio, mes, 1).getDay();
  const diasMes = new Date(anio, mes+1, 0).getDate();
  const celdas = [...Array(primerDia).fill(null), ...Array.from({length:diasMes},(_,i)=>i+1)];

  const esPasado = d => { const f=new Date(anio,mes,d); f.setHours(0,0,0,0); const h=new Date(); h.setHours(0,0,0,0); return f<h; };
  const key = d => dateKey(anio, mes, d);

  const handleDia = d => {
    if (!d) return;
    if (modoAdmin) {
      if (esPasado(d)) return;
      const k = key(d);
      setOcupados(prev => { const s=new Set(prev); s.has(k)?s.delete(k):s.add(k); return s; });
    } else {
      if (esPasado(d) || ocupados.has(key(d))) return;
      onSelect && onSelect(key(d));
    }
  };

  const estioDia = d => {
    if (!d) return {};
    const k=key(d), pas=esPasado(d), ocup=ocupados.has(k), sel=seleccionada===k;
    if (pas) return {color:"#162848",cursor:"default"};
    if (ocup && modoAdmin) return {background:"#7f1d1d",color:"#fca5a5",borderRadius:6,cursor:"pointer"};
    if (ocup) return {background:"#2a0a0a",color:"#5a1a1a",borderRadius:6,cursor:"not-allowed"};
    if (sel) return {background:"#25D366",color:"#fff",borderRadius:6,fontWeight:"bold",cursor:"pointer"};
    return {background:"#132440",color:"#d4bc78",borderRadius:6,cursor:"pointer"};
  };

  const prevMes = () => mes===0?( setMes(11),setAnio(a=>a-1)):setMes(m=>m-1);
  const nextMes = () => mes===11?(setMes(0),setAnio(a=>a+1)):setMes(m=>m+1);

  return (
    <div style={{background:"#0a1628",border:"1.5px solid #1e3560",borderRadius:8,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",background:"#071020",borderBottom:"1px solid #162848"}}>
        <button onClick={prevMes} style={{background:"none",border:"none",color:"#5bb8f5",fontSize:"1.5rem",cursor:"pointer",lineHeight:1}}>‹</button>
        <span style={{fontFamily:"'Abril Fatface',Georgia,serif",color:"#b8e4ff",fontSize:"1.05rem"}}>{MESES[mes]} {anio}</span>
        <button onClick={nextMes} style={{background:"none",border:"none",color:"#5bb8f5",fontSize:"1.5rem",cursor:"pointer",lineHeight:1}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"10px 12px 4px"}}>
        {DIAS.map(d=><div key={d} style={{textAlign:"center",fontSize:"0.65rem",color:"#1870a8",fontFamily:"'Lora',Georgia,serif",paddingBottom:4}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,padding:"4px 12px 12px"}}>
        {celdas.map((d,i)=>(
          <div key={i} onClick={()=>handleDia(d)}
            style={{height:38,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",fontFamily:"'Lora',Georgia,serif",transition:"all 0.15s",userSelect:"none",...estioDia(d)}}>
            {d||""}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:16,padding:"10px 16px 12px",borderTop:"1px solid #162848",flexWrap:"wrap"}}>
        {[["#132440","Disponible"],["#0a1428","Ocupado"],["#2196d3","Seleccionado"]].map(([bg,label])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.7rem",color:"#40a8e0",fontFamily:"'Lora',Georgia,serif"}}>
            <div style={{width:11,height:11,borderRadius:3,background:bg,border:bg==="#132440"?"1px solid #1060a0":"none"}}/>
            {label}
          </div>
        ))}
        {modoAdmin && <div style={{fontSize:"0.7rem",color:"#f59e0b",fontFamily:"'Lora',Georgia,serif",marginLeft:"auto"}}>🔑 Toca para marcar/desmarcar</div>}
      </div>
    </div>
  );
}


function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{border:"1.5px solid #1e3560",borderRadius:6,overflow:"hidden",transition:"all 0.2s"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:open?"#0d1f3c":"#080f1f"}}>
        <span style={{fontFamily:"'Lora',Georgia,serif",color:"#b8e4ff",fontSize:"0.95rem",fontWeight:"600"}}>{q}</span>
        <span style={{color:"#5bb8f5",fontSize:"1.3rem",transition:"transform 0.2s",transform:open?"rotate(45deg)":"rotate(0deg)",lineHeight:1}}>+</span>
      </div>
      {open && (
        <div style={{padding:"14px 20px 18px",background:"#0a1628",borderTop:"1px solid #1e3560"}}>
          <p style={{color:"#90d4f7",fontFamily:"'Lora',Georgia,serif",fontSize:"0.9rem",lineHeight:1.75}}>{a}</p>
        </div>
      )}
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────
export default function VillasParaiso() {
  const [pag, setPag] = useState("inicio");
  const [fotoIdx, setFotoIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [ocupados, setOcupados] = useState(new Set());
  const [modoAdmin, setModoAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const [paquete, setPaquete] = useState("pasadia");
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState(5);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(()=>{ const t=setInterval(()=>setFotoIdx(f=>(f+1)%FOTOS.length),4000); return ()=>clearInterval(t); },[]);

  const pkgActual = PAQUETES.find(p=>p.id===paquete);
  const formOk = paquete && fecha && !ocupados.has(fecha) && personas>=1 && nombre.trim() && telefono.trim();

  const irReservar = f => { if(f) setFecha(f); setPag("reservar"); setEnviado(false); };

  const loginAdmin = () => {
    if (passInput===ADMIN_PASS) { setModoAdmin(true); setShowLogin(false); setPassInput(""); setPassError(false); }
    else { setPassError(true); }
  };

  const guardar = () => { setGuardado(true); setTimeout(()=>setGuardado(false),2500); };

  const reservar = async () => {
    if (!formOk) return;
    setEnviando(true);
    window.open(`https://wa.me/${WHATSAPP}?text=${buildWA({paquete,fecha,personas,nombre,telefono,mensaje})}`, "_blank");
    await new Promise(r=>setTimeout(r,900));
    setEnviando(false); setEnviado(true);
  };

  const reset = () => { setEnviado(false);setFecha("");setPersonas(5);setNombre("");setTelefono("");setCorreo("");setMensaje(""); };

  const S = `
    @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    .D{font-family:'Abril Fatface',Georgia,serif;}
    .B{font-family:'Lora',Georgia,serif;}
    .ni{cursor:pointer;font-family:'Lora',Georgia,serif;font-size:0.78rem;letter-spacing:0.18em;text-transform:uppercase;transition:color 0.2s;padding:4px 0;border-bottom:1.5px solid transparent;}
    .ni:hover{color:#5bb8f5;} .ni.on{color:#5bb8f5;border-bottom-color:#5bb8f5;}
    .bv{background:#2196d3;color:#fff;border:none;padding:13px 32px;font-family:'Lora',Georgia,serif;font-size:0.95rem;cursor:pointer;transition:background 0.2s,transform 0.15s;border-radius:2px;}
    .bv:hover:not(:disabled){background:#1a7ab8;transform:translateY(-2px);} .bv:disabled{opacity:0.4;cursor:not-allowed;}
    .bg{background:transparent;color:#5bb8f5;border:1.5px solid #5bb8f5;padding:11px 24px;font-family:'Lora',Georgia,serif;font-size:0.88rem;cursor:pointer;transition:all 0.2s;border-radius:2px;}
    .bg:hover{background:#5bb8f5;color:#0a1628;}
    .bw{background:#25D366;color:#fff;border:none;padding:13px 24px;font-family:'Lora',Georgia,serif;font-size:0.95rem;cursor:pointer;display:flex;align-items:center;gap:10px;border-radius:2px;transition:background 0.2s;}
    .bw:hover:not(:disabled){background:#1da851;} .bw:disabled{opacity:0.4;cursor:not-allowed;}
    .pc{border:1.5px solid #1e3560;padding:24px;cursor:pointer;transition:all 0.22s;background:#0d1f3c;border-radius:4px;}
    .pc:hover{border-color:#5bb8f5;} .pc.sel{border-color:#5bb8f5;background:#132440;box-shadow:0 0 0 1px #2196d3;}
    .inp{width:100%;padding:11px 14px;border:1.5px solid #1e3560;background:#0d1f3c;font-family:'Lora',Georgia,serif;font-size:0.95rem;color:#f0ede6;outline:none;transition:border-color 0.2s;border-radius:2px;}
    .inp:focus{border-color:#5bb8f5;} .inp::placeholder{color:#2088c0;}
    .tag{display:inline-block;padding:4px 14px;border:1px solid #5bb8f5;color:#b8e4ff;font-size:0.68rem;letter-spacing:0.25em;text-transform:uppercase;font-family:'Lora',Georgia,serif;border-radius:20px;}
    .ft{width:100%;object-fit:cover;cursor:pointer;transition:opacity 0.2s,transform 0.2s;border-radius:4px;display:block;}
    .ft:hover{opacity:0.82;transform:scale(1.02);}
    @keyframes fu{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
    .f1{animation:fu 0.7s ease both;} .f2{animation:fu 0.75s 0.15s ease both;} .f3{animation:fu 0.8s 0.3s ease both;}
    @keyframes pu{0%,100%{opacity:1}50%{opacity:0.55}} .pu{animation:pu 1.5s infinite;}
    @keyframes si{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}} .si{animation:si 0.25s ease both;}
    .lbo{position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:999;display:flex;align-items:center;justify-content:center;}
    label{display:block;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;color:#40a8e0;margin-bottom:7px;font-family:'Lora',Georgia,serif;}
  `;

  return (
    <div style={{fontFamily:"Georgia,serif",minHeight:"100vh",background:"#0a1628",color:"#f0ede6"}}>
      <style>{S}</style>

      {/* NAV */}
      <nav style={{background:"#071020",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:100,borderBottom:"1px solid #162848"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>{setPag("inicio");setEnviado(false);}}>
          <span style={{fontSize:"1.4rem"}}>🌴</span>
          <div>
            <div className="D" style={{color:"#5bb8f5",fontSize:"0.95rem",lineHeight:1.1}}>Villas Paraíso</div>
            <div style={{color:"#1060a0",fontSize:"0.55rem",letterSpacing:"0.2em",textTransform:"uppercase"}}>Fantino · Sánchez Ramírez</div>
          </div>
        </div>
        <div style={{display:"flex",gap:18,alignItems:"center"}}>
          {[["inicio","Inicio"],["disponibilidad","Disponibilidad"],["galeria","Galería"],["reservar","Reservar"]].map(([id,lbl])=>(
            <span key={id} className={`ni ${pag===id?"on":""}`} style={{color:pag===id?"#5bb8f5":"#60c0f0"}}
              onClick={()=>{setPag(id);setEnviado(false);}}>{lbl}</span>
          ))}
        </div>
      </nav>

      {/* INICIO */}
      {pag==="inicio" && (
        <div>
          <div style={{position:"relative",height:"90vh",overflow:"hidden"}}>
            <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80" alt="Piscina Villas Paraíso"
              style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 50%",filter:"brightness(0.48)",transition:"opacity 0.6s"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(5,16,32,0.1),rgba(10,22,40,0.85))"}}/>
            <div style={{position:"absolute",bottom:22,left:"50%",transform:"translateX(-50%)",display:"flex",gap:7}}>
              {FOTOS.slice(0,8).map((_,i)=>(
                <button key={i} onClick={()=>setFotoIdx(i)} style={{width:i===fotoIdx?26:9,height:9,borderRadius:5,border:"none",background:i===fotoIdx?"#5bb8f5":"rgba(255,255,255,0.32)",cursor:"pointer",transition:"all 0.3s",padding:0}}/>
              ))}
            </div>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 20px"}}>
              <div className="tag f1" style={{marginBottom:22}}>Fantino, Sánchez Ramírez · R.D.</div>
              <h1 className="D f2" style={{fontSize:"clamp(2.6rem,8vw,4.8rem)",color:"#fff",lineHeight:1.05,marginBottom:18,textShadow:"0 2px 20px rgba(0,0,0,0.5)"}}>Villas Paraíso</h1>
              <p className="B f3" style={{color:"#b8e4ff",fontSize:"1.1rem",maxWidth:500,lineHeight:1.7,marginBottom:34,fontStyle:"italic"}}>
                Tu espacio ideal para compartir, relajarte y crear momentos inolvidables. Hasta 20 personas.
              </p>
              <div className="f3" style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
                <button className="bv" onClick={()=>irReservar()}>Reservar ahora</button>
                <button className="bg" onClick={()=>setPag("disponibilidad")}>Ver disponibilidad</button>
              </div>
            </div>
          </div>

          <div style={{background:"#081224",padding:"64px 20px"}}>
            <div style={{maxWidth:880,margin:"0 auto",textAlign:"center"}}>
              <div className="tag" style={{marginBottom:18}}>Nuestros paquetes</div>
              <h2 className="D" style={{fontSize:"2.2rem",color:"#b8e4ff",marginBottom:10}}>Elige tu experiencia</h2>
              <p className="B" style={{color:"#40a8e0",marginBottom:44}}>Capacidad para hasta <strong style={{color:"#5bb8f5"}}>20 personas</strong></p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:22}}>
                {PAQUETES.map(pkg=>(
                  <div key={pkg.id} style={{background:"#0d1f3c",border:"1.5px solid #1e3560",borderRadius:6,padding:"32px 26px",textAlign:"left"}}>
                    <div style={{fontSize:"2.4rem",marginBottom:12}}>{pkg.icono}</div>
                    <div className="D" style={{color:"#b8e4ff",fontSize:"1.4rem",marginBottom:4}}>{pkg.nombre}</div>
                    <div style={{color:"#1870a8",fontSize:"0.8rem",marginBottom:14,fontFamily:"'Lora',serif"}}>{pkg.horario}</div>
                    <div style={{color:"#5bb8f5",fontSize:"1.9rem",fontFamily:"'Abril Fatface',serif",marginBottom:14}}>{fmtRD(pkg.precio)}</div>
                    <p className="B" style={{color:"#60c0f0",fontSize:"0.9rem",lineHeight:1.7,marginBottom:18}}>{pkg.descripcion}</p>
                    <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
                      {pkg.incluye.map(item=>(
                        <li key={item} style={{display:"flex",alignItems:"center",gap:8,color:"#90d4f7",fontSize:"0.85rem",fontFamily:"'Lora',serif"}}>
                          <span style={{color:"#2196d3"}}>✓</span>{item}
                        </li>
                      ))}
                    </ul>
                    <button className="bv" style={{marginTop:26,width:"100%"}} onClick={()=>{setPaquete(pkg.id);irReservar();}}>Reservar {pkg.nombre}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{padding:"56px 20px",maxWidth:880,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <div className="tag" style={{marginBottom:14}}>Lo que incluye</div>
              <h2 className="D" style={{fontSize:"1.9rem",color:"#b8e4ff"}}>Todo para tu comodidad</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
              {AMENIDADES.map(a=>(
                <div key={a.texto} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"#0d1f3c",border:"1px solid #162848",borderRadius:4}}>
                  <span style={{fontSize:"1.5rem"}}>{a.icono}</span>
                  <span className="B" style={{color:"#90d4f7",fontSize:"0.88rem"}}>{a.texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:"#071020",padding:"50px 20px",textAlign:"center",borderTop:"1px solid #162848"}}>
            <h3 className="D" style={{color:"#5bb8f5",fontSize:"1.7rem",marginBottom:10}}>¿Tienes alguna pregunta?</h3>
            <p className="B" style={{color:"#40a8e0",marginBottom:24}}>Escríbenos directamente por WhatsApp</p>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <button className="bw" style={{margin:"0 auto"}}>📲 Chatear por WhatsApp</button>
            </a>
            <div style={{marginTop:18,color:"#1060a0",fontSize:"0.82rem",fontFamily:"'Lora',serif"}}>
              📍 Fantino, Sánchez Ramírez &nbsp;·&nbsp; 📧 orratc1@hotmail.com
            </div>
          </div>
        </div>
      )}

      {/* DISPONIBILIDAD */}
      {pag==="disponibilidad" && (
        <div style={{maxWidth:740,margin:"0 auto",padding:"52px 20px"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="tag" style={{marginBottom:14}}>Calendario</div>
            <h2 className="D" style={{fontSize:"2.1rem",color:"#b8e4ff",marginBottom:8}}>Disponibilidad</h2>
            <p className="B" style={{color:"#40a8e0",fontSize:"0.92rem"}}>
              Los días en verde están disponibles. Toca uno para seleccionarlo y reservar.
            </p>
          </div>

          <Calendario ocupados={ocupados} setOcupados={setOcupados} modoAdmin={modoAdmin} onSelect={f=>irReservar(f)} seleccionada={fecha}/>

          {!modoAdmin && (
            <div style={{marginTop:22,textAlign:"center"}}>
              <p className="B" style={{color:"#2088c0",fontSize:"0.85rem",marginBottom:14}}>Selecciona un día disponible y luego haz tu reserva</p>
              <button className="bv" onClick={()=>irReservar()}>Ir a reservar →</button>
            </div>
          )}

          {modoAdmin && (
            <div className="si" style={{marginTop:22,background:"#0d1f3a",border:"1.5px solid #f59e0b",borderRadius:8,padding:"18px 22px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{color:"#f59e0b",fontFamily:"'Abril Fatface',serif",fontSize:"0.95rem",marginBottom:4}}>🔑 Modo Administrador activo</div>
                  <div style={{color:"#9a7a2a",fontSize:"0.8rem",fontFamily:"'Lora',serif"}}>Toca cualquier día para marcarlo ocupado (rojo) o libre (verde).</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="bv" onClick={guardar} style={{padding:"9px 18px",fontSize:"0.82rem"}}>{guardado?"✓ Guardado":"Guardar cambios"}</button>
                  <button onClick={()=>setModoAdmin(false)} style={{background:"transparent",border:"1px solid #5a4a1a",color:"#9a7a2a",padding:"9px 14px",borderRadius:2,cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"0.82rem"}}>Salir</button>
                </div>
              </div>
            </div>
          )}

          {!modoAdmin && (
            <div style={{marginTop:32,textAlign:"center"}}>
              {!showLogin ? (
                <button onClick={()=>setShowLogin(true)} style={{background:"none",border:"none",color:"#162848",fontSize:"0.7rem",cursor:"pointer",fontFamily:"'Lora',serif",letterSpacing:"0.1em"}}>
                  Acceso propietario
                </button>
              ) : (
                <div className="si" style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:10,background:"#071020",border:"1px solid #1e3560",padding:"18px 22px",borderRadius:6}}>
                  <div style={{color:"#40a8e0",fontSize:"0.76rem",fontFamily:"'Lora',serif"}}>Contraseña de administrador</div>
                  <input type="password" className="inp" placeholder="••••••••" value={passInput}
                    onChange={e=>{setPassInput(e.target.value);setPassError(false);}}
                    onKeyDown={e=>e.key==="Enter"&&loginAdmin()}
                    style={{width:210,textAlign:"center"}}/>
                  {passError && <div style={{color:"#ef4444",fontSize:"0.76rem",fontFamily:"'Lora',serif"}}>Contraseña incorrecta</div>}
                  <div style={{display:"flex",gap:8}}>
                    <button className="bv" onClick={loginAdmin} style={{padding:"9px 18px",fontSize:"0.83rem"}}>Entrar</button>
                    <button onClick={()=>{setShowLogin(false);setPassInput("");setPassError(false);}}
                      style={{background:"none",border:"1px solid #1e3560",color:"#40a8e0",padding:"9px 14px",borderRadius:2,cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"0.83rem"}}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GALERÍA */}
      {pag==="galeria" && (
        <div style={{maxWidth:1050,margin:"0 auto",padding:"52px 18px"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div className="tag" style={{marginBottom:14}}>Galería de fotos</div>
            <h2 className="D" style={{fontSize:"2.2rem",color:"#b8e4ff",marginBottom:8}}>Conoce la villa</h2>
            <p className="B" style={{color:"#40a8e0",fontStyle:"italic"}}>Toca cualquier foto para ampliarla</p>
          </div>
          <div style={{columns:"3 190px",gap:11}}>
            {FOTOS.map((src,i)=>(
              <div key={i} style={{marginBottom:11,breakInside:"avoid"}}>
                <img src={src} alt={`Villa ${i+1}`} className="ft" onClick={()=>setLightbox(i)}/>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:44}}>
            <button className="bv" onClick={()=>irReservar()}>Reservar ahora</button>
          </div>
        </div>
      )}

      {/* RESERVAR */}
      {pag==="reservar" && !enviado && (
        <div style={{maxWidth:700,margin:"0 auto",padding:"52px 20px"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="tag" style={{marginBottom:14}}>Reservaciones</div>
            <h2 className="D" style={{fontSize:"2.1rem",color:"#b8e4ff",marginBottom:8}}>Haz tu reserva</h2>
            <p className="B" style={{color:"#40a8e0",fontSize:"0.9rem"}}>Al confirmar, se abrirá WhatsApp con tu solicitud lista para enviar.</p>
          </div>

          {/* paquete */}
          <div style={{marginBottom:28}}>
            <label>Selecciona tu paquete</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {PAQUETES.map(pkg=>(
                <div key={pkg.id} className={`pc ${paquete===pkg.id?"sel":""}`} onClick={()=>setPaquete(pkg.id)}>
                  <div style={{fontSize:"1.8rem",marginBottom:8}}>{pkg.icono}</div>
                  <div className="D" style={{color:"#b8e4ff",fontSize:"1.1rem",marginBottom:3}}>{pkg.nombre}</div>
                  <div style={{color:"#40a8e0",fontSize:"0.75rem",fontFamily:"'Lora',serif",marginBottom:8}}>{pkg.horario}</div>
                  <div style={{color:"#5bb8f5",fontSize:"1.35rem",fontFamily:"'Abril Fatface',serif"}}>{fmtRD(pkg.precio)}</div>
                  {paquete===pkg.id&&<div style={{marginTop:8,fontSize:"0.68rem",color:"#2196d3",letterSpacing:"0.15em"}}>✓ SELECCIONADO</div>}
                </div>
              ))}
            </div>
          </div>

          {/* calendario */}
          <div style={{marginBottom:24}}>
            <label>Selecciona tu fecha</label>
            <Calendario ocupados={ocupados} setOcupados={setOcupados} modoAdmin={false} onSelect={f=>setFecha(f)} seleccionada={fecha}/>
            {fecha && ocupados.has(fecha) && <div style={{color:"#ef4444",fontSize:"0.82rem",fontFamily:"'Lora',serif",marginTop:8}}>⚠️ Esta fecha está ocupada. Selecciona otra.</div>}
            {fecha && !ocupados.has(fecha) && <div style={{color:"#5bb8f5",fontSize:"0.82rem",fontFamily:"'Lora',serif",marginTop:8}}>✓ {fmtFecha(fecha)}</div>}
            {!fecha && <div style={{color:"#2088c0",fontSize:"0.8rem",fontFamily:"'Lora',serif",marginTop:8}}>👆 Toca un día verde para seleccionar la fecha</div>}
          </div>

          {/* personas y datos */}
          <div style={{display:"grid",gap:14,marginBottom:16}}>
            <div>
              <label>Cantidad de personas</label>
              <input type="number" className="inp" value={personas} min={1} max={20} onChange={e=>setPersonas(Number(e.target.value))}/>
            </div>
            <div>
              <label>Tu nombre completo *</label>
              <input type="text" className="inp" placeholder="Ej: María González" value={nombre} onChange={e=>setNombre(e.target.value)}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label>WhatsApp *</label>
                <input type="tel" className="inp" placeholder="809-XXX-XXXX" value={telefono} onChange={e=>setTelefono(e.target.value)}/>
              </div>
              <div>
                <label>Correo (opcional)</label>
                <input type="email" className="inp" placeholder="tu@correo.com" value={correo} onChange={e=>setCorreo(e.target.value)}/>
              </div>
            </div>
            <div>
              <label>Mensaje adicional</label>
              <textarea className="inp" rows={3} placeholder="Algún requerimiento especial..." value={mensaje} onChange={e=>setMensaje(e.target.value)} style={{resize:"vertical"}}/>
            </div>
          </div>

          {/* resumen */}
          {pkgActual && fecha && !ocupados.has(fecha) && (
            <div style={{background:"#0d1f3c",border:"1.5px solid #1e4080",borderRadius:6,padding:"18px 22px",marginBottom:22}}>
              <div className="D" style={{color:"#5bb8f5",fontSize:"1rem",marginBottom:12}}>Resumen de reserva</div>
              <div className="B" style={{color:"#90d4f7",fontSize:"0.9rem",lineHeight:2}}>
                <div>{pkgActual.icono} <strong>{pkgActual.nombre}</strong> — {pkgActual.horario}</div>
                <div>📅 {fmtFecha(fecha)}</div>
                <div>👥 {personas} persona{personas!==1?"s":""}</div>
                <div style={{marginTop:8,borderTop:"1px solid #1e3560",paddingTop:8,color:"#5bb8f5",fontSize:"1.1rem",fontFamily:"'Abril Fatface',serif"}}>
                  Total: {fmtRD(pkgActual.precio)}
                </div>
              </div>
            </div>
          )}

          <button className="bw" style={{width:"100%",justifyContent:"center",fontSize:"1rem",padding:"15px"}}
            disabled={!formOk||enviando} onClick={reservar}>
            {enviando?<span className="pu">Preparando mensaje...</span>:<><span>📲</span> Paso 1: Confirmar por WhatsApp</>}
          </button>

          {formOk && pkgActual && (
            <div style={{marginTop:14,background:"#0a1628",border:"1.5px solid #162848",borderRadius:6,padding:"18px 20px"}}>
              <div style={{color:"#40a8e0",fontSize:"0.76rem",fontFamily:"'Lora',serif",marginBottom:12,textAlign:"center",letterSpacing:"0.08em"}}>
                — O paga directamente con tarjeta / PayPal —
              </div>
              <a href={`https://www.paypal.com/paypalme/osvaldo1988rosario/${toUSD(pkgActual.precio)}`}
                target="_blank" rel="noreferrer" style={{textDecoration:"none",display:"block"}}>
                <button style={{width:"100%",background:"#FFC439",color:"#003087",border:"none",padding:"14px",borderRadius:4,fontSize:"1rem",fontWeight:"bold",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontFamily:"'Lora',serif"}}>
                  <span style={{fontSize:"1.3rem"}}>🅿️</span>
                  Pagar {fmtRD(pkgActual.precio)} con PayPal
                  <span style={{fontSize:"0.74rem",opacity:0.65}}>≈ ${toUSD(pkgActual.precio)} USD</span>
                </button>
              </a>
              <p style={{color:"#1060a0",fontSize:"0.72rem",textAlign:"center",marginTop:10,fontFamily:"'Lora',serif",lineHeight:1.6}}>
                Acepta Visa, Mastercard y PayPal · Pago 100% seguro<br/>
                Después de pagar, envíanos el comprobante por WhatsApp para confirmar tu reserva.
              </p>
            </div>
          )}

          {!formOk && <p style={{color:"#1060a0",fontSize:"0.78rem",textAlign:"center",marginTop:8,fontFamily:"'Lora',serif"}}>Selecciona fecha disponible y completa los campos obligatorios (*)</p>}
        </div>
      )}

      {/* CONFIRMACIÓN */}
      {pag==="reservar" && enviado && (
        <div style={{maxWidth:580,margin:"0 auto",padding:"72px 20px",textAlign:"center"}}>
          <div style={{fontSize:"3.5rem",marginBottom:20}}>🌴</div>
          <div className="tag" style={{marginBottom:18}}>¡Solicitud enviada!</div>
          <h2 className="D" style={{fontSize:"2rem",color:"#b8e4ff",marginBottom:14}}>¡Nos vemos pronto!</h2>
          <p className="B" style={{color:"#60c0f0",fontSize:"1rem",lineHeight:1.8,marginBottom:10}}>
            Hola, <strong style={{color:"#b8e4ff"}}>{nombre}</strong>. Tu solicitud fue enviada a Villas Paraíso por WhatsApp.
          </p>
          <p className="B" style={{color:"#5a8a5a",fontSize:"0.88rem",marginBottom:36,lineHeight:1.7}}>
            El equipo te confirmará disponibilidad y detalles de pago en breve. 📲
          </p>
          <div style={{background:"#0d1f3c",border:"1.5px solid #1e4080",borderRadius:6,padding:"20px",marginBottom:30,textAlign:"left"}}>
            <div className="B" style={{color:"#90d4f7",lineHeight:2.1}}>
              <div>{pkgActual?.icono} {pkgActual?.nombre}</div>
              <div>📅 {fmtFecha(fecha)}</div>
              <div>👥 {personas} persona{personas!==1?"s":""}</div>
              <div style={{color:"#5bb8f5",fontSize:"1.05rem",fontFamily:"'Abril Fatface',serif",marginTop:6}}>{fmtRD(pkgActual?.precio||0)}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <button className="bw">📲 Seguir en WhatsApp</button>
            </a>
            <button className="bg" onClick={()=>{reset();setPag("inicio");}}>Volver al inicio</button>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox!==null && (
        <div className="lbo" onClick={()=>setLightbox(null)}>
          <div style={{position:"relative"}}>
            <img src={FOTOS[lightbox]} alt="" style={{maxWidth:"90vw",maxHeight:"85vh",objectFit:"contain",borderRadius:4}} onClick={e=>e.stopPropagation()}/>
            <button onClick={()=>setLightbox(l=>l>0?l-1:FOTOS.length-1)} style={{position:"absolute",left:-48,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",width:38,height:38,borderRadius:"50%",fontSize:"1.3rem",cursor:"pointer"}}>‹</button>
            <button onClick={()=>setLightbox(l=>l<FOTOS.length-1?l+1:0)} style={{position:"absolute",right:-48,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",width:38,height:38,borderRadius:"50%",fontSize:"1.3rem",cursor:"pointer"}}>›</button>
            <button onClick={()=>setLightbox(null)} style={{position:"absolute",top:-14,right:-14,background:"#25D366",color:"#fff",border:"none",width:30,height:30,borderRadius:"50%",fontSize:"1rem",cursor:"pointer"}}>×</button>
          </div>
        </div>
      )}


      {/* BOTÓN WHATSAPP FLOTANTE */}
      <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("¡Hola! Me interesa reservar en Villas Paraíso 🌴")}`}
        target="_blank" rel="noreferrer"
        style={{position:"fixed",bottom:24,right:24,zIndex:200,textDecoration:"none"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(37,211,102,0.5)",cursor:"pointer",transition:"transform 0.2s"}}
          onMouseOver={e=>e.currentTarget.style.transform="scale(1.12)"}
          onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.154 1.523 5.922L.072 23.928l6.188-1.423A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.366l-.36-.214-3.716.854.87-3.619-.235-.372A9.818 9.818 0 112 12c0-5.411 4.407-9.818 9.818-9.818 5.412 0 9.818 4.407 9.818 9.818 0 5.412-4.406 9.818-9.818 9.818z"/>
          </svg>
        </div>
        <div style={{position:"absolute",right:68,top:"50%",transform:"translateY(-50%)",background:"#25D366",color:"#fff",padding:"6px 12px",borderRadius:20,fontSize:"0.78rem",fontFamily:"'Lora',Georgia,serif",whiteSpace:"nowrap",boxShadow:"0 2px 10px rgba(0,0,0,0.2)"}}>
          ¡Reserva ya!
        </div>
      </a>

      {/* RESEÑAS */}
      {pag==="inicio" && (
        <div style={{background:"#060d1c",padding:"64px 20px",borderTop:"1px solid #131f3e"}}>
          <div style={{maxWidth:960,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:44}}>
              <div className="tag" style={{marginBottom:14}}>Lo que dicen nuestros clientes</div>
              <h2 className="D" style={{fontSize:"2rem",color:"#b8e4ff",marginBottom:8}}>Reseñas</h2>
              <div style={{color:"#5bb8f5",fontSize:"1.1rem"}}>⭐⭐⭐⭐⭐ <span style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:"#40a8e0"}}>(20+ reseñas)</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:18}}>
              {RESENAS.map((r,i)=>(
                <div key={i} style={{background:"#0d1f3c",border:"1.5px solid #1e3560",borderRadius:8,padding:"22px 20px"}}>
                  <div style={{color:"#f59e0b",fontSize:"1rem",marginBottom:10}}>{"⭐".repeat(r.estrellas)}</div>
                  <p style={{color:"#90d4f7",fontFamily:"'Lora',serif",fontSize:"0.9rem",lineHeight:1.7,marginBottom:14,fontStyle:"italic"}}>"{r.texto}"</p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{color:"#b8e4ff",fontFamily:"'Abril Fatface',serif",fontSize:"0.95rem"}}>{r.nombre}</div>
                    <div style={{color:"#1e3560",fontSize:"0.72rem",fontFamily:"'Lora',serif"}}>{r.fecha}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {pag==="inicio" && (
        <div style={{background:"#080f1f",padding:"64px 20px",borderTop:"1px solid #131f3e"}}>
          <div style={{maxWidth:760,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:44}}>
              <div className="tag" style={{marginBottom:14}}>Preguntas frecuentes</div>
              <h2 className="D" style={{fontSize:"2rem",color:"#b8e4ff"}}>¿Tienes dudas?</h2>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {FAQS.map((f,i)=>(
                <FaqItem key={i} q={f.q} a={f.a}/>
              ))}
            </div>
            <div style={{textAlign:"center",marginTop:40}}>
              <p style={{color:"#40a8e0",fontFamily:"'Lora',serif",marginBottom:16,fontSize:"0.95rem"}}>¿Tienes otra pregunta? Escríbenos</p>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <button className="bw" style={{margin:"0 auto"}}>📲 Preguntar por WhatsApp</button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{background:"#050e1e",padding:"28px 20px",textAlign:"center",borderTop:"1px solid #162040"}}>
        <div className="D" style={{color:"#5bb8f5",fontSize:"1rem",marginBottom:5}}>Villas Paraíso 🌴</div>
        <div style={{color:"#0a5090",fontSize:"0.72rem",letterSpacing:"0.14em",fontFamily:"'Lora',serif"}}>
          📍 Fantino, Sánchez Ramírez · 📲 809-397-0376 · 📧 orratc1@hotmail.com
        </div>
        <div style={{color:"#162848",fontSize:"0.68rem",marginTop:10,fontFamily:"'Lora',serif"}}>© 2026 Villas Paraíso. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
