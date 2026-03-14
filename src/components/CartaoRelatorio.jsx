import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Edit, Trash2, Ticket, CheckCircle2, AlertCircle, Clock3, Calendar,
  Monitor, LayoutGrid, Network, Wifi, Settings, FileText, Mail, Key,
  Phone, Smartphone, Shield, HardDrive, Lock, Clock, Video, Printer,
  Mouse, HelpCircle, Wrench, Timer, MessageSquare, Send, ChevronDown, ChevronUp, Sparkles
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
  const [expandido, setExpandido] = useState(false); 
  
  // === ESTADOS DA I.A. ===
  const [resumoIA, setResumoIA] = useState('');
  const [loadingIA, setLoadingIA] = useState(false);

  let corStatusBg = isDarkMode ? 'rgba(226, 232, 240, 0.1)' : '#e2e8f0'; 
  let corStatusTxt = isDarkMode ? '#cbd5e1' : '#475569'; 
  let IconeStatus = CheckCircle2;

  if (relatorio.status === 'Resolvido') { corStatusBg = isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7'; corStatusTxt = isDarkMode ? '#34d399' : '#166534'; IconeStatus = CheckCircle2; }
  if (relatorio.status === 'Andamento') { corStatusBg = isDarkMode ? 'rgba(234, 179, 8, 0.15)' : '#fef08a'; corStatusTxt = isDarkMode ? '#fde047' : '#854d0e'; IconeStatus = Clock3; }
  if (relatorio.status === 'Aberto') { corStatusBg = isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2'; corStatusTxt = isDarkMode ? '#fca5a5' : '#991b1b'; IconeStatus = AlertCircle; }

  let badgeSLA = null;
  if (relatorio.status !== 'Resolvido') {
    const dataString = relatorio.data_atendimento || relatorio.criado_em.split('T')[0];
    const [ano, mes, dia] = dataString.split('-');
    
    const dataCriacao = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
    const diffTime = dataHoje.getTime() - dataCriacao.getTime();
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

  // === FUNÇÃO MÁGICA DA I.A. ===
  const gerarResumoInteligente = async () => {
    setLoadingIA(true);
    setResumoIA('');
    
    // 1. Montamos um pacotão com tudo o que a IA precisa ler
    let contexto = `PROBLEMA ORIGINAL: ${relatorio.solit_prob}\n`;
    contexto += `RESOLUÇÃO: ${relatorio.resolucao || 'Nenhuma'}\n`;
    if (relatorio.obs) contexto += `OBSERVAÇÕES: ${relatorio.obs}\n`;
    
    if (relatorio.anotacoes && relatorio.anotacoes.length > 0) {
      contexto += `\nHISTÓRICO DE INTERAÇÕES DA EQUIPE:\n`;
      relatorio.anotacoes.forEach(nota => {
        contexto += `- ${nota.autor_nome} disse: "${nota.texto}"\n`;
      });
    }

    // 2. Disparamos pro nosso Backend em Django
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://api-ti-relatorios.onrender.com/api/ia/resumo/', 
        { texto: contexto },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumoIA(response.data.resumo);
      toast.success('Resumo gerado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao conectar com a I.A. Verifique o servidor.');
    } finally {
      setLoadingIA(false);
    }
  };

  return (
    <div className="glass-panel" style={{ border: relatorio.is_ticket && relatorio.status !== 'Resolvido' ? '2px solid rgba(244, 63, 94, 0.8)' : `1px solid ${tema.borda}`, padding: '16px', borderRadius: '16px', position: 'relative', transition: 'all 0.3s ease', marginTop: relatorio.is_ticket ? '14px' : '0' }}>

      {relatorio.is_ticket && (
        <span style={{ position: 'absolute', top: '-12px', left: '16px', backgroundColor: relatorio.status === 'Resolvido' ? '#10b981' : '#f43f5e', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '10px', border: `2px solid ${isDarkMode ? '#1e293b' : '#fff'}`, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px', zIndex: 10 }}>
          {relatorio.status !== 'Resolvido' && (
            <span style={{ position: 'relative', display: 'flex', width: '6px', height: '6px' }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.7 }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '6px', width: '6px', backgroundColor: '#fff' }}></span>
            </span>
          )}
          <Ticket size={12} /> #{relatorio.numero_ticket || relatorio.id}
        </span>
      )}

      {/* Botões de Ação */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px' }}>
        <button className="btn-premium" onClick={() => iniciarEdicao(relatorio)} style={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : '#f1f5f9', color: tema.texto1, border: `1px solid ${tema.borda}`, padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }} title="Editar"><Edit size={14} /></button>
        <button className="btn-premium" onClick={() => apagarRelatorio(relatorio.id)} style={{ backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#ef4444', border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5'}`, padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }} title="Excluir"><Trash2 size={14} /></button>
      </div>

      <h3 style={{ margin: '0 0 10px 0', color: isDarkMode ? '#38bdf8' : '#0284c7', fontSize: '16px', paddingRight: '70px', paddingTop: relatorio.is_ticket ? '8px' : '0', fontWeight: '700', letterSpacing: '-0.5px' }}>
        {relatorio.empresa} {relatorio.funcionario && <span style={{ color: tema.texto2, fontSize: '13px', fontWeight: '500' }}>• {relatorio.funcionario}</span>}
      </h3>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '10px', backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9', color: tema.texto2, padding: '4px 8px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${tema.borda}` }}>
          {renderizarIconeCategoria(relatorio.categoria)} {relatorio.categoria || 'Outros'}
        </span>
        <span style={{ fontSize: '10px', backgroundColor: corStatusBg, color: corStatusTxt, padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent'}` }}>
          <IconeStatus size={12} /> {relatorio.status || 'Resolvido'}
        </span>
        <span style={{ fontSize: '10px', backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9', color: tema.texto2, padding: '4px 8px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${tema.borda}` }}>
          <Calendar size={12} /> {formatarData(relatorio.data_atendimento || relatorio.criado_em.split('T')[0])}
        </span>
        {badgeSLA}
      </div>

      {/* === ÁREA TRUNCADA === */}
      <div 
        onClick={() => setExpandido(!expandido)}
        style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.15)' : '#f8fafc', padding: '12px', borderRadius: '10px', border: `1px solid ${tema.borda}`, cursor: 'pointer', transition: '0.2s' }}
        title="Clique para expandir/recolher"
      >
        <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: tema.texto1, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: expandido ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          <strong>PROBLEMA:</strong> {relatorio.solit_prob}
        </p>
        
        {(expandido || !relatorio.solit_prob) && (
          <p style={{ margin: '0', fontSize: '13px', color: tema.texto1, lineHeight: '1.5' }}><strong>RESOLUÇÃO:</strong> {relatorio.resolucao}</p>
        )}
        
        {expandido && relatorio.obs && (
          <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: tema.texto2, lineHeight: '1.5', fontStyle: 'italic' }}><strong>OBS:</strong> {relatorio.obs}</p>
        )}
      </div>

      {/* === ÁREA EXPANDIDA (DIÁRIO E I.A.) === */}
      {expandido && relatorio.is_ticket && (
        <div className="fade-in" style={{ marginTop: '15px', paddingTop: '15px', borderTop: `1px solid ${tema.borda}` }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '11px', color: tema.texto2, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
              <MessageSquare size={14} /> Diário do Ticket
            </h4>

            {/* BOTÃO DA INTELIGÊNCIA ARTIFICIAL */}
            <button 
              onClick={(e) => { e.stopPropagation(); gerarResumoInteligente(); }}
              disabled={loadingIA}
              style={{ background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: loadingIA ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 10px rgba(139, 92, 246, 0.3)', transition: '0.3s' }}
            >
              <Sparkles size={14} className={loadingIA ? "animate-pulse" : ""} /> 
              {loadingIA ? 'Analisando dados...' : 'Gerar Resumo (I.A.)'}
            </button>
          </div>

          {/* CAIXA COM A RESPOSTA DA I.A. */}
          {resumoIA && (
            <div className="fade-in" style={{ marginBottom: '15px', padding: '12px', borderRadius: '8px', backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#d8b4fe'}`, color: tema.texto1, fontSize: '13px', lineHeight: '1.5' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDarkMode ? '#c4b5fd' : '#7e22ce', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase' }}><Sparkles size={12}/> Resumo Executivo Gemini</strong>
              {resumoIA}
            </div>
          )}
          
          <div style={{ paddingLeft: '12px', borderLeft: `2px solid ${isDarkMode ? 'rgba(50, 184, 247, 0.3)' : '#cbd5e1'}`, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
            {(!relatorio.anotacoes || relatorio.anotacoes.length === 0) ? (
               <span style={{ fontSize: '12px', color: tema.texto2, fontStyle: 'italic' }}>Sem anotações.</span>
            ) : (
              relatorio.anotacoes.map(nota => (
                <div key={nota.id} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-17px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#32b8f7', boxShadow: `0 0 0 4px ${isDarkMode ? '#1e293b' : '#fff'}` }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '11px', color: tema.texto1 }}>{nota.autor_nome}</strong>
                    <span style={{ fontSize: '10px', color: tema.texto2 }}>{new Date(nota.criado_em).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: tema.texto1, lineHeight: '1.4', backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#f1f5f9', padding: '10px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
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
                placeholder="Nova atualização..." 
                style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#fff', color: tema.texto1, fontSize: '12px', outline: 'none' }}
                onKeyDown={(e) => { if(e.key === 'Enter') handleEnviarAnotacao(); }}
              />
              <button 
                className="btn-premium" onClick={handleEnviarAnotacao} disabled={!textoAnotacao.trim()}
                style={{ backgroundColor: textoAnotacao.trim() ? '#32b8f7' : (isDarkMode ? 'rgba(51, 65, 85, 0.5)' : '#cbd5e1'), color: '#fff', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: textoAnotacao.trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Send size={14} /> Enviar
              </button>
            </div>
          )}
        </div>
      )}

      {/* === RODAPÉ DO CARTÃO === */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px dashed ${tema.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: tema.texto2 }}>Equipe: <strong style={{ color: tema.texto1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{relatorio.atendente_nome}</strong></span>
        
        <button onClick={() => setExpandido(!expandido)} style={{ background: 'transparent', border: 'none', color: '#32b8f7', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
          {expandido ? <><ChevronUp size={14} /> Recolher</> : <><ChevronDown size={14} /> Detalhes / Notas</>}
        </button>
      </div>
    </div>
  )
}

export default CartaoRelatorio;