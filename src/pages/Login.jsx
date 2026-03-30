import React from 'react';
import { Sun, Moon, User, Lock, LogIn, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner'; 
import logoImg from '../assets/logo_Globalnet.png';

const Login = ({ tema, isDarkMode, setIsDarkMode, handleLogin, username, setUsername, password, setPassword }) => {
  
  // Cores dinâmicas para a estética profunda
  const leftBg = isDarkMode ? 'linear-gradient(135deg, #09090b 0%, #1e293b 100%)' : 'linear-gradient(135deg, #32b8f7 0%, #2563eb 100%)';
  const rightBg = isDarkMode ? '#0f172a' : '#ffffff';
  const inputBg = isDarkMode ? '#1e293b' : '#f8fafc';
  const inputBorder = isDarkMode ? '#334155' : '#e2e8f0';

  // === NOSSA NOVA FUNÇÃO QUE INTERCEPTA O LOGIN ===
  const tentarLogin = (e) => {
    e.preventDefault(); // Impede a tela de recarregar
    
    // Verifica se os campos estão em branco
    if (!username.trim() || !password.trim()) {
      toast.warning("Por favor, preencha o usuário e a senha para entrar!");
      return; // Para a execução aqui e não envia pro backend
    }
    
    // Se estiver tudo preenchido, chama a função oficial lá do App.jsx
    handleLogin(e);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: rightBg, fontFamily: "'Inter', sans-serif" }}>
      
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; box-sizing: border-box; }
        * { box-sizing: border-box; }

        .login-left { width: 50%; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; padding: 40px; }
        .login-right { width: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; }
        .login-box { width: 100%; max-width: 400px; padding: 40px; }
        
        @media (max-width: 800px) {
          .login-left { display: none; }
          .login-right { width: 100%; }
          .login-box { padding: 20px; }
        }

        .shape-1 { position: absolute; top: -10%; left: -10%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; backdrop-filter: blur(10px); }
        .shape-2 { position: absolute; bottom: -15%; right: -5%; width: 400px; height: 400px; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 50%; }
        .shape-3 { position: absolute; top: 40%; left: 60%; width: 150px; height: 150px; background: ${isDarkMode ? 'rgba(50, 184, 247, 0.15)' : 'rgba(255,255,255,0.2)'}; border-radius: 50%; filter: blur(40px); }
        
        .modern-input:focus { border-color: #32b8f7 !important; box-shadow: 0 0 0 4px rgba(50, 184, 247, 0.15) !important; outline: none; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* LADO ESQUERDO: PAINEL VISUAL */}
      <div className="login-left" style={{ background: leftBg, color: '#fff' }}>
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>

        <div style={{ zIndex: 10, maxWidth: '450px', margin: '0 auto', textAlign: 'left' }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '50px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ShieldCheck size={20} color={isDarkMode ? '#32b8f7' : '#fff'} />
            <span style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>SISTEMA INTERNO</span>
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-1px' }}>
            Bem-vindo ao<br />seu <span style={{ color: isDarkMode ? '#32b8f7' : '#fde047' }}>Workspace.</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '40px' }}>
            Sistema interno de relatórios, gerenciamento de tickets e tarefas em uma plataforma exclusiva para equipe interna de Ti
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}><LayoutDashboard size={18}/> Dashboards</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}><LogIn size={18}/> Workflow</div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className="login-right">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          style={{ position: 'absolute', top: '30px', right: '30px', padding: '12px', backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', color: isDarkMode ? '#fde047' : '#475569', border: `1px solid ${inputBorder}`, borderRadius: '12px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={isDarkMode ? "Mudar para Claro" : "Mudar para Escuro"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="login-box fade-in" style={{ animationDelay: '0.2s' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img src={logoImg} alt="Logo" style={{ height: '55px', marginBottom: '25px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }} />
            <h2 style={{ fontSize: '28px', color: tema.texto1, margin: '0 0 8px 0', fontWeight: '700' }}>Faça seu Login</h2>
            <p style={{ color: tema.texto2, margin: 0, fontSize: '15px' }}>Entre com suas credenciais para continuar.</p>
          </div>

          {/* Mudamos o onSubmit para a nossa nova função */}
          <form onSubmit={tentarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: tema.texto1, marginBottom: '8px' }}>Usuário</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color={tema.texto2} style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)' }} />
                {/* Removemos o "required" daqui */}
                <input 
                  type="text" 
                  maxLength={30}
                  className="modern-input"
                  placeholder="Digite seu usuário..." 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: tema.texto1, fontSize: '15px', boxSizing: 'border-box', transition: '0.2s' }}
                />
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: tema.texto1, marginBottom: '8px' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color={tema.texto2} style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)' }} />
                {/* E removemos o "required" daqui */}
                <input 
                  type="password" 
                  maxLength={50}
                  className="modern-input"
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: tema.texto1, fontSize: '15px', boxSizing: 'border-box', transition: '0.2s' }}
                />
              </div>
            </div>

            <button type="submit" style={{ 
              width: '100%', padding: '15px', 
              background: 'linear-gradient(to right, #32b8f7, #2563eb)', 
              color: 'white', border: 'none', borderRadius: '12px', 
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(50, 184, 247, 0.3)',
              marginTop: '10px'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Entrar no Sistema
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;