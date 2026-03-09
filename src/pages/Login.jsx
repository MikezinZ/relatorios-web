import React from 'react';
import { Users, Lock, LogOut } from 'lucide-react';
import logoImg from '../assets/logo_Globalnet.png';

const Login = ({ tema, isDarkMode, handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: tema.fundoMain, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' }}>
      
      {/* === AQUI ESTÁ A CORREÇÃO: CSS GLOBAL (Tira a margem branca e aplica a fonte) === */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; box-sizing: border-box; background-color: ${tema.fundoMain}; font-family: 'Inter', sans-serif; }
        * { font-family: 'Inter', sans-serif; }
        input:focus {
          outline: none !important;
          border-color: #32b8f7 !important;
          box-shadow: 0 0 0 3px rgba(50, 184, 247, 0.25) !important;
        }
      `}</style>

      <div style={{ backgroundColor: tema.fundoCard, padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={logoImg} alt="Logo Globalnet" style={{ maxWidth: '180px', maxHeight: '80px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none', transition: 'filter 0.3s' }} />
        </div>
        <h2 style={{ textAlign: 'center', color: tema.texto1, marginBottom: '30px', marginTop: 0, fontWeight: '600' }}>Acesso ao Sistema</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Users size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: tema.texto2 }} />
            <input type="text" placeholder="Usuário" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box', transition: '0.2s' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: tema.texto2 }} />
            <input type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box', transition: '0.2s' }} />
          </div>
          <button type="submit" style={{ padding: '15px', backgroundColor: '#32b8f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            Entrar <LogOut size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;