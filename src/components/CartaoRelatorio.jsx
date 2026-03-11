import React, { useState } from 'react';
import { 
  Edit, Trash2, Ticket, CheckCircle2, AlertCircle, Clock3, Calendar,
  Monitor, LayoutGrid, Network, Wifi, Settings, FileText, Mail, Key,
  Phone, Smartphone, Shield, HardDrive, Lock, Clock, Video, Printer,
  Mouse, HelpCircle, Wrench, Timer, MessageSquare, Send
} from 'lucide-react';

const renderizarIconeCategoria = (catText) => {
  if (!catText) return <Wrench size={14} />;
  const texto = catText.toLowerCase();
  if (texto.includes('hardware')) return <Monitor size={14} />;
  if (texto.includes('operacional')) return <LayoutGrid size={14} />;
  if (texto.includes('rede')) return <Network size={14} />;
  if (texto.includes('internet')) return <Wifi size={14} />;
  if (texto.includes('sistemas')) return <Settings size={14} />;
  if (texto.includes('office')) return <FileText size={14} />;
  if (texto.includes('e-mail')) return <Mail size={14} />;
  if (texto.includes('acessos')) return <Key size={14} />;
  if (texto.includes('telefonia')) return <Phone size={14} />;
  if (texto.includes('celular')) return <Smartphone size={14} />;
  if (texto.includes('antivírus')) return <Shield size={14} />;
  if (texto.includes('backup')) return <HardDrive size={14} />;
  if (texto.includes('certificados')) return <Lock size={14} />;
  if (texto.includes('ponto')) return <Clock size={14} />;
  if (texto.includes('câmeras')) return <Video size={14} />;
  if (texto.includes('impressora')) return <Printer size={14} />;
  if (texto.includes('periféricos')) return <Mouse size={14} />;
  if (texto.includes('dúvida')) return <HelpCircle size={14} />;
  return <Wrench size={14} />;
}

const CartaoRelatorio = ({ relatorio, tema, isDarkMode, formatarData, iniciarEdicao, apagarRelatorio, adicionarAnotacao }) => {
  const [textoAnotacao, setTextoAnotacao] = useState('');

  // Cores dinâmicas para as etiquetas com transparência no Dark Mode para combinar com o vidro
  let corStatusBg = isDarkMode ? 'rgba(226, 232, 240, 0.1)' : '#e2e8f0'; 
  let corStatusTxt = isDarkMode ? '#cbd5e1' : '#475569'; 
  let IconeStatus = CheckCircle2;

  if (relatorio.status === 'Resolvido') { corStatusBg = isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7'; corStatusTxt = isDarkMode ? '#34d399' : '#166534'; IconeStatus = CheckCircle2; }
  if (relatorio.status === 'Andamento') { corStatusBg = isDarkMode ? 'rgba(234, 179, 8, 0.15)' : '#fef08a'; corStatusTxt = isDarkMode ? '#fde047' : '#854d0e'; IconeStatus = Clock3; }
  if (relatorio.status === 'Aberto') { corStatusBg = isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2'; corStatusTxt = isDarkMode ? '#fca5a5' : '#991b1b'; IconeStatus = AlertCircle; }

  let badgeSLA = null;
  if (relatorio.status !== 'Resolvido') {
    const hoje = new Date();
    const dataCriacao = new Date(relatorio.criado_em || relatorio.data_atendimento);
    const diffTime = Math.abs(hoje - dataCriacao);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let corSlaBg = isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9';
    let corSlaTxt = tema.texto2;
    let textoSla = 'Aberto hoje';
    let piscar = false;

    if (diffDays === 1) { corSlaBg = isDarkMode ? 'rgba(234, 179, 8, 0.15)' : '#fef08a'; corSlaTxt = isDarkMode ? '#fde047' : '#854d0e'; textoSla = 'Aberto há 1 dia'; } 
    else if (diffDays >= 2) { corSlaBg = isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2'; corSlaTxt = isDarkMode ? '#fca5a5' : '#991b1b'; textoSla = `Atrasado: ${diffDays} dias`; piscar = true; }

    badgeSLA = (
      <span className={piscar ? "animate-pulse" : ""} style={{ fontSize: '11px', backgroundColor: corSlaBg, color: corSlaTxt, padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', border: piscar ? '1px solid rgba(239, 68, 68, 0.5)' : `1px solid ${tema.borda}` }}>
        <Timer size={14} /> {textoSla}
      </span>
    );
  }

  const handleEnviarAnotacao = () => {
    if (adicionarAnotacao) {
      adicionarAnotacao(relatorio.id, textoAnotacao);
      setTextoAnotacao('');
    }
  };

  return (
    // Adicionamos a classe 'glass-panel' e removemos o backgroundColor fixo inline
    <div className="glass-panel" style={{ border: relatorio.is_ticket && relatorio.status !== 'Resolvido' ? '2px solid rgba(244, 63, 94, 0.8)' : `1px solid ${tema.borda}`, padding: '24px', borderRadius: '16px', position: 'relative', transition: 'all 0.3s ease', marginTop: relatorio.is_ticket ? '14px' : '0' }}>

      {relatorio.is_ticket && (
        <span style={{ position: 'absolute', top: '-14px', left: '20px', backgroundColor: relatorio.status === 'Resolvido' ? '#10b981' : '#f43f5e', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '11px', border: `2px solid ${isDarkMode ? '#1e293b' : '#fff'}`, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px', zIndex: 10 }}>
          {relatorio.status !== 'Resolvido' && (
            <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.7 }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: '#fff' }}></span>
            </span>
          )}
          <Ticket size={12} /> TICKET {relatorio.numero_ticket ? `#${relatorio.numero_ticket}` : ''} - {relatorio.status === 'Resolvido' ? 'FINALIZADO' : 'EM ABERTO'}
        </span>
      )}

      {/* Botões de Ação com a classe btn-premium */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
        <button className="btn-premium" onClick={() => iniciarEdicao(relatorio)} style={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : '#f1f5f9', color: tema.texto1, border: `1px solid ${tema.borda}`, padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }} title="Editar"><Edit size={16} /></button>
        <button className="btn-premium" onClick={() => apagarRelatorio(relatorio.id)} style={{ backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#ef4444', border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5'}`, padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }} title="Excluir"><Trash2 size={16} /></button>
      </div>

      <h3 style={{ margin: '0 0 12px 0', color: isDarkMode ? '#38bdf8' : '#0284c7', fontSize: '18px', paddingRight: '80px', paddingTop: relatorio.is_ticket ? '5px' : '0', fontWeight: '700', letterSpacing: '-0.5px' }}>
        {relatorio.empresa} {relatorio.funcionario && <span style={{ color: tema.texto2, fontSize: '14px', fontWeight: '500' }}>• {relatorio.funcionario}</span>}
      </h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9', color: tema.texto2, padding: '4px 8px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${tema.borda}` }}>
          {renderizarIconeCategoria(relatorio.categoria)} {relatorio.categoria || 'Outros'}
        </span>
        <span style={{ fontSize: '11px', backgroundColor: corStatusBg, color: corStatusTxt, padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent'}` }}>
          <IconeStatus size={14} /> {relatorio.status || 'Resolvido'}
        </span>
        <span style={{ fontSize: '11px', backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9', color: tema.texto2, padding: '4px 8px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${tema.borda}` }}>
          <Calendar size={14} /> {formatarData(relatorio.data_atendimento || relatorio.criado_em.split('T')[0])}
        </span>
        {badgeSLA}
      </div>

      <div style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.15)' : '#f8fafc', padding: '15px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: tema.texto1, lineHeight: '1.6' }}><strong>PROBLEMA:</strong> {relatorio.solit_prob}</p>
        <p style={{ margin: '0', fontSize: '14px', color: tema.texto1, lineHeight: '1.6' }}><strong>RESOLUÇÃO:</strong> {relatorio.resolucao}</p>
        {relatorio.obs && <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: tema.texto2, lineHeight: '1.5', fontStyle: 'italic' }}><strong>OBS:</strong> {relatorio.obs}</p>}
      </div>

      {/* HISTÓRICO DE INTERAÇÕES (DIÁRIO DO TICKET) */}
      {relatorio.is_ticket && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${tema.borda}` }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: tema.texto2, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
            <MessageSquare size={14} /> Diário do Ticket
          </h4>
          
          <div style={{ paddingLeft: '14px', borderLeft: `2px solid ${isDarkMode ? 'rgba(50, 184, 247, 0.3)' : '#cbd5e1'}`, display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '15px' }}>
            {(!relatorio.anotacoes || relatorio.anotacoes.length === 0) ? (
               <span style={{ fontSize: '13px', color: tema.texto2, fontStyle: 'italic' }}>Nenhuma anotação registrada ainda.</span>
            ) : (
              relatorio.anotacoes.map(nota => (
                <div key={nota.id} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-19px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#32b8f7', boxShadow: `0 0 0 4px ${isDarkMode ? '#1e293b' : '#fff'}` }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: tema.texto1 }}>{nota.autor_nome}</strong>
                    <span style={{ fontSize: '11px', color: tema.texto2 }}>{new Date(nota.criado_em).toLocaleString('pt-BR')}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: tema.texto1, lineHeight: '1.5', backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#f1f5f9', padding: '12px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
                    {nota.texto}
                  </p>
                </div>
              ))
            )}
          </div>

          {relatorio.status !== 'Resolvido' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={textoAnotacao}
                onChange={(e) => setTextoAnotacao(e.target.value)}
                placeholder="Adicionar atualização (Work Note)..." 
                style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: `1px solid ${tema.borda}`, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#fff', color: tema.texto1, fontSize: '13px', transition: '0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#32b8f7'}
                onBlur={(e) => e.target.style.borderColor = tema.borda}
                onKeyDown={(e) => { if(e.key === 'Enter') handleEnviarAnotacao(); }}
              />
              <button 
                className="btn-premium"
                onClick={handleEnviarAnotacao}
                disabled={!textoAnotacao.trim()}
                style={{ backgroundColor: textoAnotacao.trim() ? '#32b8f7' : (isDarkMode ? 'rgba(51, 65, 85, 0.5)' : '#cbd5e1'), color: '#fff', border: 'none', padding: '0 18px', borderRadius: '10px', cursor: textoAnotacao.trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={16} /> Enviar
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: `1px dashed ${tema.borda}`, fontSize: '12px', color: tema.texto2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Equipe: <strong style={{ color: tema.texto1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{relatorio.atendente_nome}</strong></span>
        <span>Lançado em: {new Date(relatorio.criado_em).toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}

export default CartaoRelatorio;