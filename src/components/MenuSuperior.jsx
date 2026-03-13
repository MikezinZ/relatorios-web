import React from 'react';
import { Settings, Edit, LogOut, Sun, Moon, Ticket, Search, Bell, ListChecks, ShieldCheck, StickyNote } from 'lucide-react';
import logoImg from '../assets/logo_Globalnet.png';

const MenuSuperior = ({ 
  tema, isDarkMode, setIsDarkMode, abaAtiva, setAbaAtiva, isStaff, 
  limparFormularioUsuario, handleLogout, notificacoesPendentes,
  abrirNotas // <--- Recebendo a função mágica aqui
}) => {
  
  // Função auxiliar para os botões do menu ficarem mais elegantes
  const getBtnStyle = (aba) => ({
    padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer', 
    fontWeight: '600', fontSize: '14px', letterSpacing: '0.3px',
    backgroundColor: abaAtiva === aba ? (isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#32b8f7') : 'transparent', 
    color: abaAtiva === aba ? (isDarkMode ? '#32b8f7' : '#fff') : tema.texto2, 
    transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: abaAtiva === aba && !isDarkMode ? '0 4px 12px rgba(50, 184, 247, 0.3)' : 'none'
  });

  return (
    <div className="menu-container glass-panel" style={{
      position: 'sticky', top: '15px', zIndex: 100,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px',
      padding: '15px 25px', borderRadius: '16px'
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px', paddingRight: '15px', borderRight: `1px solid ${tema.borda}` }}>
          <img className="logo-mobile" src={logoImg} alt="Logo Globalnet" style={{ height: '35px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none', transition: 'filter 0.3s' }} />
        </div>

        <button className="btn-premium" onClick={() => setAbaAtiva('novo')} style={getBtnStyle('novo')}>
          <Edit size={18} /> <span className="hide-on-mobile">Atendimento</span>
        </button>
        
        <button className="btn-premium" onClick={() => setAbaAtiva('historico')} style={getBtnStyle('historico')}>
          <Search size={18} /> <span className="hide-on-mobile">Histórico</span>
        </button>

        <button className="btn-premium" onClick={() => setAbaAtiva('tickets')} style={{...getBtnStyle('tickets'), 
          backgroundColor: abaAtiva === 'tickets' ? (isDarkMode ? 'rgba(244, 63, 94, 0.15)' : '#f43f5e') : 'transparent',
          color: abaAtiva === 'tickets' ? (isDarkMode ? '#f43f5e' : '#fff') : tema.texto2,
          boxShadow: abaAtiva === 'tickets' && !isDarkMode ? '0 4px 12px rgba(244, 63, 94, 0.3)' : 'none'
        }}>
          <Ticket size={18} /> <span className="hide-on-mobile">Tickets</span>
        </button>

        {/* BOTÃO ROTINAS */}
        <button className="btn-premium" onClick={() => setAbaAtiva('rotinas')} style={{...getBtnStyle('rotinas'), position: 'relative'}}>
          <ListChecks size={18} /> 
          <span className="hide-on-mobile">Rotinas</span>
          
          {notificacoesPendentes > 0 && (
            <div className="animate-pulse" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ef4444', borderRadius: '12px', padding: '2px 6px', marginLeft: '4px', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)' }}>
              <Bell size={12} color="white" style={{ marginRight: '4px' }}/>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{notificacoesPendentes}</span>
            </div>
          )}
        </button>

        {isStaff && (
          <button className="btn-premium" onClick={() => { setAbaAtiva('gestao'); limparFormularioUsuario(); }} style={{...getBtnStyle('gestao'), 
            backgroundColor: abaAtiva === 'gestao' ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#10b981') : 'transparent',
            color: abaAtiva === 'gestao' ? (isDarkMode ? '#10b981' : '#fff') : tema.texto2,
            boxShadow: abaAtiva === 'gestao' && !isDarkMode ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
          }}>
            <ShieldCheck size={18} /> <span className="hide-on-mobile">Gestão</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', paddingLeft: '15px', borderLeft: `1px solid ${tema.borda}` }}>
        
        {/* === NOVO BOTÃO: BLOCO DE NOTAS === */}
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
    </div>
  );
};

export default MenuSuperior;