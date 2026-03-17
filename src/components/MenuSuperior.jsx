import React, { useState, useEffect } from 'react';
import { Settings, Edit, LogOut, Sun, Moon, Ticket, Search, Bell, ListChecks, ShieldCheck, StickyNote, Menu, X } from 'lucide-react';
import logoImg from '../assets/logo_Globalnet.png';

const MenuSuperior = ({ 
  tema, isDarkMode, setIsDarkMode, abaAtiva, setAbaAtiva, isStaff, 
  limparFormularioUsuario, handleLogout, notificacoesPendentes,
  abrirNotas
}) => {
  
  // === ESTADOS DO MENU RESPONSIVO ===
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850); // 850px para garantir que não encavala no tablet

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 850);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const trocarAba = (aba) => {
    if (aba === 'gestao' && limparFormularioUsuario) limparFormularioUsuario();
    setAbaAtiva(aba);
    setMenuMobileAberto(false); // Fecha a gaveta ao clicar no celular
  };

  // Função auxiliar para os botões do menu ficarem mais elegantes (Agora adaptada para mobile)
  const getBtnStyle = (aba, isMobileBtn = false) => ({
    padding: isMobileBtn ? '14px 16px' : '10px 16px', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: '600', 
    fontSize: isMobileBtn ? '15px' : '14px', 
    letterSpacing: '0.3px',
    backgroundColor: abaAtiva === aba ? (isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#32b8f7') : 'transparent', 
    color: abaAtiva === aba ? (isDarkMode ? '#32b8f7' : '#fff') : tema.texto2, 
    transition: 'all 0.3s ease', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px',
    boxShadow: (abaAtiva === aba && !isDarkMode && !isMobileBtn) ? '0 4px 12px rgba(50, 184, 247, 0.3)' : 'none',
    width: isMobileBtn ? '100%' : 'auto',
    justifyContent: isMobileBtn ? 'flex-start' : 'center'
  });

  return (
    <>
      {/* === BARRA PRINCIPAL FIXA NO TOPO === */}
      <div className="menu-container glass-panel" style={{
        position: 'sticky', top: isMobile ? '5px' : '15px', zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px',
        padding: isMobile ? '12px 20px' : '15px 25px', 
        borderRadius: '16px'
      }}>
        
        {/* LOGO GLOBALNET (Sempre visível) */}
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: isMobile ? '0' : '15px', borderRight: isMobile ? 'none' : `1px solid ${tema.borda}` }}>
          <img className="logo-mobile" src={logoImg} alt="Logo Globalnet" style={{ height: isMobile ? '30px' : '35px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none', transition: 'filter 0.3s' }} />
        </div>

        {/* === MODO CELULAR: MOSTRAR APENAS HAMBÚRGUER === */}
        {isMobile && (
          <button onClick={() => setMenuMobileAberto(true)} style={{ background: 'transparent', border: 'none', color: tema.texto1, cursor: 'pointer', padding: '5px' }}>
            <Menu size={28} />
          </button>
        )}

        {/* === MODO DESKTOP: MOSTRAR BOTÕES COMPLETOS === */}
        {!isMobile && (
          <>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flex: 1, paddingLeft: '15px' }}>
              <button className="btn-premium" onClick={() => trocarAba('novo')} style={getBtnStyle('novo')}>
                <Edit size={18} /> Atendimento
              </button>
              
              <button className="btn-premium" onClick={() => trocarAba('historico')} style={getBtnStyle('historico')}>
                <Search size={18} /> Histórico
              </button>

              <button className="btn-premium" onClick={() => trocarAba('tickets')} style={{...getBtnStyle('tickets'), 
                backgroundColor: abaAtiva === 'tickets' ? (isDarkMode ? 'rgba(244, 63, 94, 0.15)' : '#f43f5e') : 'transparent',
                color: abaAtiva === 'tickets' ? (isDarkMode ? '#f43f5e' : '#fff') : tema.texto2,
                boxShadow: abaAtiva === 'tickets' && !isDarkMode ? '0 4px 12px rgba(244, 63, 94, 0.3)' : 'none'
              }}>
                <Ticket size={18} /> Tickets
              </button>

              <button className="btn-premium" onClick={() => trocarAba('rotinas')} style={{...getBtnStyle('rotinas'), position: 'relative'}}>
                <ListChecks size={18} /> Rotinas
                {notificacoesPendentes > 0 && (
                  <div className="animate-pulse" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ef4444', borderRadius: '12px', padding: '2px 6px', marginLeft: '4px', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)' }}>
                    <Bell size={12} color="white" style={{ marginRight: '4px' }}/>
                    <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{notificacoesPendentes}</span>
                  </div>
                )}
              </button>

              {isStaff && (
                <button className="btn-premium" onClick={() => trocarAba('gestao')} style={{...getBtnStyle('gestao'), 
                  backgroundColor: abaAtiva === 'gestao' ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#10b981') : 'transparent',
                  color: abaAtiva === 'gestao' ? (isDarkMode ? '#10b981' : '#fff') : tema.texto2,
                  boxShadow: abaAtiva === 'gestao' && !isDarkMode ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                }}>
                  <ShieldCheck size={18} /> Gestão
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingLeft: '15px', borderLeft: `1px solid ${tema.borda}` }}>
              <button className="btn-premium" onClick={abrirNotas} style={{ padding: '10px', backgroundColor: isDarkMode ? 'rgba(234, 179, 8, 0.15)' : '#fefce8', color: '#eab308', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center' }} title="Meu Bloco Privado">
                <StickyNote size={18} />
              </button>
              <button className="btn-premium" onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '10px', backgroundColor: isDarkMode ? 'rgba(253, 224, 71, 0.15)' : '#f1f5f9', color: isDarkMode ? '#fde047' : '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center' }} title="Alternar Tema">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="btn-premium" onClick={handleLogout} style={{ padding: '10px', backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center' }} title="Sair do Sistema">
                <LogOut size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* === GAVETA LATERAL MOBILE === */}
      {isMobile && (
        <>
          {/* Fundo Escuro (Overlay) */}
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

          {/* O Menu Deslizante */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '280px',
            backgroundColor: tema.fundoCard,
            boxShadow: '-5px 0 25px rgba(0,0,0,0.3)',
            zIndex: 999,
            transform: menuMobileAberto ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column', padding: '25px 20px'
          }}>
            
            {/* Cabeçalho do Mobile */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: `1px solid ${tema.borda}` }}>
              <img src={logoImg} alt="Logo" style={{ height: '24px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }} />
              <button onClick={() => setMenuMobileAberto(false)} style={{ background: 'transparent', border: 'none', color: tema.texto2, cursor: 'pointer', padding: '5px' }}>
                <X size={24} />
              </button>
            </div>

            {/* Links do Menu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <button onClick={() => trocarAba('novo')} style={getBtnStyle('novo', true)}>
                <Edit size={20} /> Atendimento
              </button>
              
              <button onClick={() => trocarAba('historico')} style={getBtnStyle('historico', true)}>
                <Search size={20} /> Histórico
              </button>

              <button onClick={() => trocarAba('tickets')} style={{...getBtnStyle('tickets', true), 
                backgroundColor: abaAtiva === 'tickets' ? (isDarkMode ? 'rgba(244, 63, 94, 0.15)' : '#f43f5e') : 'transparent',
                color: abaAtiva === 'tickets' ? (isDarkMode ? '#f43f5e' : '#fff') : tema.texto2,
              }}>
                <Ticket size={20} /> Tickets
              </button>

              <button onClick={() => trocarAba('rotinas')} style={{...getBtnStyle('rotinas', true), position: 'relative'}}>
                <ListChecks size={20} /> Rotinas
                {notificacoesPendentes > 0 && (
                  <div className="animate-pulse" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ef4444', borderRadius: '12px', padding: '2px 6px', marginLeft: 'auto' }}>
                    <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{notificacoesPendentes} pendentes</span>
                  </div>
                )}
              </button>

              {isStaff && (
                <button onClick={() => trocarAba('gestao')} style={{...getBtnStyle('gestao', true), 
                  backgroundColor: abaAtiva === 'gestao' ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#10b981') : 'transparent',
                  color: abaAtiva === 'gestao' ? (isDarkMode ? '#10b981' : '#fff') : tema.texto2,
                }}>
                  <ShieldCheck size={20} /> Gestão
                </button>
              )}
            </div>

            {/* Rodapé do Menu Mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', borderTop: `1px solid ${tema.borda}`, paddingTop: '20px' }}>
              <button onClick={() => { setMenuMobileAberto(false); abrirNotas(); }} style={{ background: 'transparent', border: 'none', color: '#eab308', cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '15px' }}>
                <StickyNote size={20} /> Bloco de Notas
              </button>
              
              <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'transparent', border: 'none', color: isDarkMode ? '#fde047' : '#64748b', cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '15px' }}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
              </button>
              
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '15px' }}>
                <LogOut size={20} /> Sair
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
};

export default MenuSuperior;