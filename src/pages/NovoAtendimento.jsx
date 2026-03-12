import React, { useState } from 'react';
import { Edit, Save, X, Building2, User, Calendar, List, Activity, Users, FileText, MessageSquare, Ticket } from 'lucide-react';

const NovoAtendimento = ({
  tema, isDarkMode, editandoId, handleSubmit, usuarios, atendentesSelecionados, handleToggleAtendente,
  empresa, setEmpresa, empresasUnicas, funcionario, setFuncionario, funcionariosDaEmpresa,
  categoria, setCategoria, status, setStatus, dataAtendimento, setDataAtendimento,
  isTicket, setIsTicket, solitProb, setSolitProb, resolucao, setResolucao, obs, setObs,
  limparFormulario, setAbaAtiva
}) => {

  // === ESTADOS DO NOSSO AUTOCOMPLETAR CUSTOMIZADO ===
  const [showSugestoesEmpresa, setShowSugestoesEmpresa] = useState(false);
  const [showSugestoesFuncionario, setShowSugestoesFuncionario] = useState(false);

  // Filtra as sugestões conforme o usuário digita
  const empresasFiltradas = empresasUnicas.filter(e => e && e.toLowerCase().includes(empresa.toLowerCase()) && e !== empresa);
  const funcionariosFiltrados = funcionariosDaEmpresa.filter(f => f && f.toLowerCase().includes(funcionario.toLowerCase()) && f !== funcionario);

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${tema.borda}`, 
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#fff', color: tema.texto1, 
    fontSize: '14px', outline: 'none', transition: '0.2s', boxSizing: 'border-box'
  };

  const labelStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: tema.texto1, marginBottom: '8px' };

  // Estilo da nossa caixinha flutuante do dropdown
  const dropdownStyle = {
    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, 
    backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
    border: `1px solid ${tema.borda}`, borderRadius: '10px', 
    maxHeight: '180px', overflowY: 'auto', margin: '4px 0 0 0', padding: 0, 
    listStyle: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  };

  return (
    <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', animation: 'fadeIn 0.4s ease' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${isDarkMode ? 'rgba(50, 184, 247, 0.4)' : '#32b8f7'}`, paddingBottom: '15px', marginBottom: '25px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {editandoId ? <><Edit size={24} color="#32b8f7"/> Editando Relatório #{editandoId}</> : <><FileText size={24} color="#32b8f7"/>Novo Atendimento</>}
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* LINHA 1: Empresa, Funcionário e Data */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* CAMPO EMPRESA COM DROP CUSTOMIZADO */}
          <div style={{ flex: 2, minWidth: '250px', position: 'relative' }}>
            <label style={labelStyle}><Building2 size={16} color={tema.texto2}/> Empresa / Cliente *</label>
            <input 
              type="text" required placeholder="Digite o nome da empresa..." value={empresa}
              onChange={(e) => { setEmpresa(e.target.value); setShowSugestoesEmpresa(true); }}
              onFocus={() => setShowSugestoesEmpresa(true)}
              // O setTimeout garante que o clique na lista funcione antes de fechar
              onBlur={() => setTimeout(() => setShowSugestoesEmpresa(false), 200)} 
              style={inputStyle} onFocusCapture={(e) => e.target.style.borderColor = '#32b8f7'} onBlurCapture={(e) => e.target.style.borderColor = tema.borda}
            />
            {showSugestoesEmpresa && empresasFiltradas.length > 0 && (
              <ul style={dropdownStyle}>
                {empresasFiltradas.map((emp, i) => (
                  <li key={i} onClick={() => { setEmpresa(emp); setShowSugestoesEmpresa(false); }}
                      style={{ padding: '12px 15px', cursor: 'pointer', color: tema.texto1, borderBottom: `1px solid ${tema.borda}`, transition: '0.2s' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#f1f5f9'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                    {emp}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CAMPO FUNCIONÁRIO COM DROP CUSTOMIZADO */}
          <div style={{ flex: 2, minWidth: '200px', position: 'relative' }}>
            <label style={labelStyle}><User size={16} color={tema.texto2}/> Funcionário (Opcional)</label>
            <input 
              type="text" placeholder="Quem solicitou?" value={funcionario}
              onChange={(e) => { setFuncionario(e.target.value); setShowSugestoesFuncionario(true); }}
              onFocus={() => setShowSugestoesFuncionario(true)}
              onBlur={() => setTimeout(() => setShowSugestoesFuncionario(false), 200)}
              style={inputStyle} onFocusCapture={(e) => e.target.style.borderColor = '#32b8f7'} onBlurCapture={(e) => e.target.style.borderColor = tema.borda}
            />
            {showSugestoesFuncionario && funcionariosFiltrados.length > 0 && (
              <ul style={dropdownStyle}>
                {funcionariosFiltrados.map((func, i) => (
                  <li key={i} onClick={() => { setFuncionario(func); setShowSugestoesFuncionario(false); }}
                      style={{ padding: '12px 15px', cursor: 'pointer', color: tema.texto1, borderBottom: `1px solid ${tema.borda}`, transition: '0.2s' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#f1f5f9'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                    {func}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={labelStyle}><Calendar size={16} color={tema.texto2}/> Data *</label>
            <input type="date" required value={dataAtendimento} onChange={e => setDataAtendimento(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* LINHA 2: Categoria, Status e Toggle Ticket */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : '#f8fafc', padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borda}` }}>
          
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={labelStyle}><List size={16} color={tema.texto2}/> Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} style={inputStyle}>
              <option value="Hardware / Equipamento">Hardware / Equipamento</option>
              <option value="Sistema Operacional / Windows">Sistema Operacional / Windows</option>
              <option value="Rede Interna / Servidor">Rede Interna / Servidor</option>
              <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
              <option value="Sistemas / ERP">Sistemas / ERP</option>
              <option value="Pacote Office / Softwares">Pacote Office / Softwares</option>
              <option value="Impressora">Impressora</option>
              <option value="Dúvida / Treinamento">Dúvida / Treinamento</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={labelStyle}><Activity size={16} color={tema.texto2}/> Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{...inputStyle, fontWeight: 'bold', color: status === 'Resolvido' ? '#10b981' : status === 'Andamento' ? '#eab308' : '#ef4444'}}>
              <option value="Resolvido">🟢 Resolvido</option>
              <option value="Andamento">🟡 Em Andamento</option>
              <option value="Aberto">🔴 Aberto</option>
            </select>
          </div>

          {/* Toggle de Ticket Bonitão */}
          <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <label style={labelStyle}><Ticket size={16} color={tema.texto2}/> Gerar Ticket?</label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
              <div style={{ position: 'relative', width: '44px', height: '24px', backgroundColor: isTicket ? '#f43f5e' : (isDarkMode ? '#334155' : '#cbd5e1'), borderRadius: '24px', transition: '0.3s' }}>
                <div style={{ position: 'absolute', top: '2px', left: isTicket ? '22px' : '2px', width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
              </div>
              <input type="checkbox" checked={isTicket} onChange={e => setIsTicket(e.target.checked)} style={{ display: 'none' }} />
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: isTicket ? '#f43f5e' : tema.texto2 }}>{isTicket ? 'SIM (Acompanhar)' : 'NÃO'}</span>
            </label>
          </div>
        </div>

        {/* LINHA 3: Equipe (Checkboxes) */}
        <div>
          <label style={labelStyle}><Users size={16} color={tema.texto2}/> Equipe Responsável *</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '15px', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : '#f8fafc', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
            {usuarios.filter(u => u.is_active).map(user => (
              <label key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', backgroundColor: atendentesSelecionados.includes(user.id) ? (isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#e0f2fe') : (isDarkMode ? '#1e293b' : '#fff'), padding: '6px 12px', borderRadius: '20px', border: `1px solid ${atendentesSelecionados.includes(user.id) ? '#32b8f7' : tema.borda}`, transition: '0.2s', fontSize: '13px', fontWeight: atendentesSelecionados.includes(user.id) ? 'bold' : 'normal', color: atendentesSelecionados.includes(user.id) ? '#32b8f7' : tema.texto1 }}>
                <input type="checkbox" checked={atendentesSelecionados.includes(user.id)} onChange={() => handleToggleAtendente(user.id)} style={{ accentColor: '#32b8f7' }} />
                {user.username}
              </label>
            ))}
          </div>
        </div>

        {/* TEXTAREAS */}
        <div>
          <label style={labelStyle}><MessageSquare size={16} color={tema.texto2}/> Problema Relatado *</label>
          <textarea required placeholder="Descreva o que o cliente relatou..." value={solitProb} onChange={e => setSolitProb(e.target.value)} rows="3" style={{...inputStyle, resize: 'vertical'}} />
        </div>

        <div>
          <label style={labelStyle}><MessageSquare size={16} color={tema.texto2}/> Resolução / Procedimento Adotado *</label>
          <textarea required placeholder="Como foi resolvido ou qual o próximo passo?" value={resolucao} onChange={e => setResolucao(e.target.value)} rows="4" style={{...inputStyle, resize: 'vertical'}} />
        </div>

        <div>
          <label style={{...labelStyle, color: tema.texto2}}>Observações Internas (Opcional)</label>
          <input type="text" placeholder="Algum detalhe extra?" value={obs} onChange={e => setObs(e.target.value)} style={inputStyle} />
        </div>

        {/* BOTÕES */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
          {editandoId && (
            <button type="button" onClick={() => { limparFormulario(); setAbaAtiva('historico'); }} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: tema.texto2, border: `1px solid ${tema.borda}`, borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              Cancelar Edição
            </button>
          )}
          <button type="submit" className="btn-premium" style={{ padding: '12px 30px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> {editandoId ? 'Atualizar Atendimento' : 'Salvar Atendimento'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default NovoAtendimento;