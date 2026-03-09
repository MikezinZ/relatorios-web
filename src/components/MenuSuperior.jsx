import React from 'react';
import { Settings, Edit, LogOut, Sun, Moon, Ticket, Search } from 'lucide-react';
import logoImg from '../assets/logo_Globalnet.png';

const MenuSuperior = ({ 
  tema, isDarkMode, setIsDarkMode, abaAtiva, setAbaAtiva, isStaff, limparFormularioUsuario, handleLogout 
}) => {
  return (
    <div className="menu-container" style={{
      position: 'sticky', top: '10px', zIndex: 100,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      padding: '15px 20px', borderRadius: '12px', border: `1px solid ${tema.borda}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
          <img className="logo-mobile" src={logoImg} alt="Logo Globalnet" style={{ height: '40px', marginRight: '10px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none', transition: 'filter 0.3s' }} />
        </div>

        <button onClick={() => setAbaAtiva('novo')} style={{ padding: '10px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'novo' ? '#32b8f7' : 'transparent', color: abaAtiva === 'novo' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Edit size={18} /> <span className="hide-on-mobile">Atendimento</span>
        </button>
        <button onClick={() => setAbaAtiva('historico')} style={{ padding: '10px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'historico' ? '#32b8f7' : 'transparent', color: abaAtiva === 'historico' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={18} /> <span className="hide-on-mobile">Histórico</span>
        </button>
        <button onClick={() => setAbaAtiva('tickets')} style={{ padding: '10px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'tickets' ? '#f43f5e' : 'transparent', color: abaAtiva === 'tickets' ? '#fff' : tema.texto1, display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}>
          <Ticket size={18} /> <span className="hide-on-mobile">Tickets</span>
        </button>

        {isStaff && (
          <button onClick={() => { setAbaAtiva('gestao'); limparFormularioUsuario(); }} style={{ padding: '10px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'gestao' ? '#10b981' : 'transparent', color: abaAtiva === 'gestao' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Settings size={18} /> <span className="hide-on-mobile">Administração</span>
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '10px', backgroundColor: isDarkMode ? '#fde047' : '#e2e8f0', color: isDarkMode ? '#854d0e' : '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', display: 'flex', alignItems: 'center' }} title="Mudar Tema">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', display: 'flex', alignItems: 'center' }} title="Sair do Sistema">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default MenuSuperior;