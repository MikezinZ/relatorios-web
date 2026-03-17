import React, { useState, useEffect } from 'react';
import { FileText, LayoutDashboard, List, CalendarDays, BarChart3, LogOut, Moon, Sun, StickyNote, Menu, X, Bell, MonitorPlay } from 'lucide-react';

const MenuSuperior = ({
  tema, isDarkMode, setIsDarkMode, abaAtiva, setAbaAtiva, isStaff,
  limparFormularioUsuario, handleLogout, notificacoesPendentes, abrirNotas
}) => {
  // Estado para controlar se a gaveta do celular está aberta ou fechada
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  
  // Estado para saber se estamos numa tela pequena (celular)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fica vigiando o tamanho da tela em tempo real
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função mágica que muda a aba e já fecha o menu no celular sozinho
  const trocarAba = (aba) => {
    if (aba === 'gestao' && limparFormularioUsuario) limparFormularioUsuario();
    setAbaAtiva(aba);
    setMenuMobileAberto(false); 
  };

  // Estilos base dos botões
  const btnStyle = (aba) => ({
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: abaAtiva === aba ? (isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#32b8f7') : 'transparent',
    color: abaAtiva === aba ? (isDarkMode ? '#32b8f7' : '#fff') : tema.texto1,
    cursor: 'pointer',
    fontWeight: abaAtiva === aba ? 'bold' : '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    width: isMobile ? '100%' : 'auto', // No celular o botão ocupa a linha toda
    justifyContent: isMobile ? 'flex-start' : 'center',
    fontSize: '14px'
  });

  // Lista dos nossos botões para não repetir código
  const menuItems = [
    { id: 'novo', label: 'Novo Atendimento', icone: <FileText size={18} /> },
    { id: 'tickets', label: 'Radar Tickets', icone: <LayoutDashboard size={18} /> },
    { id: 'historico', label: 'Histórico', icone: <List size={18} /> },
    { id: 'rotinas', label: 'Minhas Rotinas', icone: <CalendarDays size={18} />, badge: notificacoesPendentes },
  ];

  if (isStaff) {
    menuItems.push({ id: 'gestao', label: 'Gestão', icone: <BarChart3 size={18} /> });
  }

  return (
    <>
      {/* === BARRA PRINCIPAL (TOPO) === */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 20px', 
        borderRadius: '16px', 
        marginBottom: '25px',
        position: 'relative',
        zIndex: 40
      }}>
        
        {/* LOGO / TÍTULO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: tema.gradientePrimary, padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <MonitorPlay size={24} color="#fff" />
          </div>
          <h1 style={{ color: tema.texto1, margin: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#32b8f7' }}>Tech</span>Desk
          </h1>
        </div>

        {/* BOTÃO HAMBÚRGUER (SÓ APARECE NO CELULAR) */}
        {isMobile && (
          <button 
            onClick={() => setMenuMobileAberto(true)}
            style={{ background: 'transparent', border: 'none', color: tema.texto1, cursor: 'pointer', padding: '5px' }}
          >
            <Menu size={28} />
          </button>
        )}

        {/* MENU DESKTOP (SÓ APARECE NO PC) */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {menuItems.map(item => (
              <button key={item.id} className="btn-premium" onClick={() => trocarAba(item.id)} style={btnStyle(item.id)}>
                {item.icone} {item.label}
                {item.badge > 0 && (
                  <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', marginLeft: '4px', animation: 'pulse 2s infinite' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div style={{ width: '1px', height: '24px', backgroundColor: tema.borda, margin: '0 10px' }}></div>

            <button className="btn-premium" onClick={abrirNotas} style={{ background: 'transparent', border: 'none', color: '#eab308', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }} title="Bloco de Notas">
              <StickyNote size={20} />
            </button>
            
            <button className="btn-premium" onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'transparent', border: 'none', color: isDarkMode ? '#fde047' : '#64748b', cursor: 'pointer', padding: '10px' }} title="Alternar Tema">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="btn-premium" onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '10px' }} title="Sair do Sistema">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>

      {/* === MENU LATERAL MOBILE (GAVETA) === */}
      {isMobile && (
        <>
          {/* Fundo escuro atrás do menu (Overlay) */}
          <div 
            onClick={() => setMenuMobileAberto(false)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              zIndex: 998,
              opacity: menuMobileAberto ? 1 : 0,
              visibility: menuMobileAberto ? 'visible' : 'hidden',
              transition: 'all 0.3s ease'
            }}
          />

          {/* A Gaveta em si */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '280px',
            backgroundColor: tema.fundoCard,
            boxShadow: '-5px 0 25px rgba(0,0,0,0.2)',
            zIndex: 999,
            transform: menuMobileAberto ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column', padding: '25px 20px'
          }}>
            
            {/* Cabeçalho do Menu Mobile */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: `1px solid ${tema.borda}` }}>
              <span style={{ color: tema.texto1, fontWeight: 'bold', fontSize: '18px' }}>Menu Principal</span>
              <button onClick={() => setMenuMobileAberto(false)} style={{ background: 'transparent', border: 'none', color: tema.texto2, cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Links do Menu Mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {menuItems.map(item => (
                <button key={item.id} onClick={() => trocarAba(item.id)} style={{...btnStyle(item.id), padding: '14px 16px'}}>
                  {item.icone} {item.label}
                  {item.badge > 0 && (
                    <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', marginLeft: 'auto' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Rodapé do Menu Mobile (Notas, Tema, Sair) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: `1px solid ${tema.borda}`, paddingTop: '20px' }}>
              <button onClick={() => { setMenuMobileAberto(false); abrirNotas(); }} style={{ background: 'transparent', border: 'none', color: '#eab308', cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '14px', justifyContent: 'flex-start' }}>
                <StickyNote size={20} /> Bloco de Notas Pessoal
              </button>
              
              <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'transparent', border: 'none', color: isDarkMode ? '#fde047' : '#64748b', cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '14px', justifyContent: 'flex-start' }}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {isDarkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
              </button>
              
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '14px', justifyContent: 'flex-start' }}>
                <LogOut size={20} /> Sair do Sistema
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
};

export default MenuSuperior;