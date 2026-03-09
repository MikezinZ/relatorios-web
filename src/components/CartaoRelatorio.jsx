import React from 'react';
import { 
  Edit, Trash2, Ticket, CheckCircle2, AlertCircle, Clock3, Calendar,
  Monitor, LayoutGrid, Network, Wifi, Settings, FileText, Mail, Key,
  Phone, Smartphone, Shield, HardDrive, Lock, Clock, Video, Printer,
  Mouse, HelpCircle, Wrench
} from 'lucide-react';

// Função para escolher o ícone baseado na categoria
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

// O Componente em si (recebendo as propriedades do App.jsx)
const CartaoRelatorio = ({ relatorio, tema, isDarkMode, formatarData, iniciarEdicao, apagarRelatorio }) => {
  let corStatusBg = '#e2e8f0'; let corStatusTxt = '#475569'; let IconeStatus = CheckCircle2;
  if (relatorio.status === 'Resolvido') { corStatusBg = '#dcfce7'; corStatusTxt = '#166534'; IconeStatus = CheckCircle2; }
  if (relatorio.status === 'Andamento') { corStatusBg = '#fef08a'; corStatusTxt = '#854d0e'; IconeStatus = Clock3; }
  if (relatorio.status === 'Aberto') { corStatusBg = '#fee2e2'; corStatusTxt = '#991b1b'; IconeStatus = AlertCircle; }

  return (
    <div style={{ border: relatorio.is_ticket && relatorio.status !== 'Resolvido' ? '2px solid #f43f5e' : `1px solid ${tema.borda}`, padding: '20px', borderRadius: '12px', backgroundColor: tema.fundoCard, position: 'relative', transition: '0.3s', marginTop: relatorio.is_ticket ? '12px' : '0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>

      {relatorio.is_ticket && (
        <span style={{ position: 'absolute', top: '-14px', left: '20px', backgroundColor: relatorio.status === 'Resolvido' ? '#10b981' : '#f43f5e', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '11px', border: `2px solid ${tema.fundoCard}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
          {relatorio.status !== 'Resolvido' && (
            <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.7 }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: '#fff' }}></span>
            </span>
          )}
          <Ticket size={12} /> TICKET {relatorio.numero_ticket ? `#${relatorio.numero_ticket}` : ''} - {relatorio.status === 'Resolvido' ? 'FINALIZADO' : 'EM ABERTO'}
        </span>
      )}

      <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
        <button onClick={() => iniciarEdicao(relatorio)} style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }} title="Editar"><Edit size={16} /></button>
        <button onClick={() => apagarRelatorio(relatorio.id)} style={{ backgroundColor: '#fed7d7', color: '#991b1b', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }} title="Excluir"><Trash2 size={16} /></button>
      </div>

      <h3 style={{ margin: '0 0 12px 0', color: '#32b8f7', fontSize: '18px', paddingRight: '80px', paddingTop: relatorio.is_ticket ? '5px' : '0', fontWeight: '600' }}>{relatorio.empresa} {relatorio.funcionario && <span style={{ color: tema.texto2, fontSize: '14px', fontWeight: '400' }}>- {relatorio.funcionario}</span>}</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', color: tema.texto2, padding: '6px 10px', borderRadius: '6px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
          {renderizarIconeCategoria(relatorio.categoria)} {relatorio.categoria || 'Outros'}
        </span>
        <span style={{ fontSize: '12px', backgroundColor: corStatusBg, color: corStatusTxt, padding: '6px 10px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <IconeStatus size={14} /> {relatorio.status || 'Resolvido'}
        </span>
        <span style={{ fontSize: '12px', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, padding: '6px 10px', borderRadius: '6px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Calendar size={14} /> {formatarData(relatorio.data_atendimento || relatorio.criado_em.split('T')[0])}
        </span>
      </div>

      <p style={{ margin: '8px 0', fontSize: '14px', color: tema.texto1, lineHeight: '1.5' }}><strong>PROBLEMA:</strong> {relatorio.solit_prob}</p>
      <p style={{ margin: '8px 0', fontSize: '14px', color: tema.texto1, lineHeight: '1.5' }}><strong>RESOLUÇÃO:</strong> {relatorio.resolucao}</p>
      {relatorio.obs && <p style={{ margin: '8px 0', fontSize: '14px', color: tema.texto2, lineHeight: '1.5', fontStyle: 'italic' }}><strong>OBS:</strong> {relatorio.obs}</p>}

      <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: `1px dashed ${tema.borda}`, fontSize: '12px', color: tema.texto2, display: 'flex', justifyContent: 'space-between' }}>
        <span>Equipe: <strong style={{ color: tema.texto1 }}>{relatorio.atendente_nome}</strong></span>
        <span>Lançado em: {new Date(relatorio.criado_em).toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}

export default CartaoRelatorio;