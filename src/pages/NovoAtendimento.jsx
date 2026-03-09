import React from 'react';
import { Edit, Check, Ticket } from 'lucide-react';

const NovoAtendimento = ({
  tema, isDarkMode, editandoId, handleSubmit, usuarios, atendentesSelecionados,
  handleToggleAtendente, empresa, setEmpresa, empresasUnicas, funcionario,
  setFuncionario, funcionariosDaEmpresa, categoria, setCategoria, status,
  setStatus, dataAtendimento, setDataAtendimento, isTicket, setIsTicket,
  solitProb, setSolitProb, resolucao, setResolucao, obs, setObs,
  limparFormulario, setAbaAtiva
}) => {
  return (
    <div style={{ backgroundColor: editandoId ? (isDarkMode ? '#b45309' : '#fffbeb') : (isDarkMode ? '#1e293b' : '#ffffff'), padding: '30px', borderRadius: '12px', transition: '0.3s', border: `1px solid ${editandoId ? '#f59e0b' : tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: editandoId ? '#d97706' : tema.texto1, marginTop: '0', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {editandoId ? <><Edit size={24} /> Editando Relatório</> : <><Edit size={24} /> Novo Atendimento</>}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <div style={{ backgroundColor: tema.inputBg, padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
          <label style={{ display: 'block', color: tema.texto2, fontWeight: '600', marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Equipe no atendimento
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {usuarios.map(user => {
              const isSelected = atendentesSelecionados.includes(user.id);
              return (
                <button
                  key={user.id} type="button" onClick={() => handleToggleAtendente(user.id)}
                  style={{ padding: '8px 14px', borderRadius: '20px', border: isSelected ? 'none' : `1px solid ${tema.borda}`, backgroundColor: isSelected ? '#32b8f7' : (isDarkMode ? '#0f172a' : '#f8fafc'), color: isSelected ? '#fff' : tema.texto1, cursor: 'pointer', fontWeight: isSelected ? '600' : '400', transition: 'all 0.2s', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  {isSelected ? <Check size={14} /> : ''} {user.username}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input list="lista-empresas" placeholder="Nome da Empresa" required value={empresa} onChange={(e) => setEmpresa(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }} />
            <datalist id="lista-empresas">{empresasUnicas.map((emp, i) => <option key={i} value={emp} />)}</datalist>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input list="lista-funcionarios" placeholder="Nome do Funcionário (Opcional)" value={funcionario} onChange={(e) => setFuncionario(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }} />
            <datalist id="lista-funcionarios">{funcionariosDaEmpresa.map((func, i) => <option key={i} value={func} />)}</datalist>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, outlineColor: '#32b8f7' }}>
              <option value="Hardware / Equipamento">🖥️ Hardware / Equipamento</option>
              <option value="Sistema Operacional / Windows">🪟 Sistema Operacional / Windows</option>
              <option value="Rede Interna / Servidor">🖧 Rede Interna / Servidor</option>
              <option value="Internet / Wi-Fi">🌐 Internet / Wi-Fi</option>
              <option value="Sistemas / ERP">⚙️ Sistemas / ERP</option>
              <option value="Pacote Office / Softwares">📝 Pacote Office / Softwares</option>
              <option value="E-mail / Acessos">📧 E-mail / Acessos</option>
              <option value="Acessos / Permissões / VPN">🔑 Acessos / Permissões / VPN</option>
              <option value="Telefonia">📞 Telefonia</option>
              <option value="Dispositivos Móveis / Celular">📱 Dispositivos Móveis / Celular</option>
              <option value="Segurança / Antivírus">🛡️ Segurança / Antivírus</option>
              <option value="Backup / Restauração">💾 Backup / Restauração</option>
              <option value="Certificados Digitais">🔐 Certificados Digitais</option>
              <option value="Controle de Ponto / Biometria">🕒 Controle de Ponto / Biometria</option>
              <option value="CFTV / Câmeras">📹 CFTV / Câmeras</option>
              <option value="Impressora">🖨️ Impressora</option>
              <option value="Periféricos (Mouse/Teclado/Fone)">🔌 Periféricos (Mouse/Teclado/Fone)</option>
              <option value="Dúvida de Usuário">❓ Dúvida de Usuário</option>
              <option value="Outros">🔧 Outros</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, outlineColor: '#32b8f7' }}>
              <option value="Resolvido">🟢 Resolvido (Finalizado)</option>
              <option value="Andamento">🟡 Em Andamento (Pendente)</option>
              <option value="Aberto">🔴 Aberto (Não iniciado)</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <input type="date" required value={dataAtendimento} onChange={(e) => setDataAtendimento(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, outlineColor: '#32b8f7' }} title="Data em que o serviço foi realizado" />
          </div>
        </div>

        <div onClick={() => setIsTicket(!isTicket)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', backgroundColor: isTicket ? (isDarkMode ? '#4c0519' : '#ffe4e6') : tema.inputBg, borderRadius: '8px', border: `2px dashed ${isTicket ? '#f43f5e' : tema.borda}`, cursor: 'pointer', transition: '0.3s' }}>
          <input type="checkbox" checked={isTicket} readOnly style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f43f5e' }} />
          <span style={{ color: isTicket ? '#f43f5e' : tema.texto1, fontWeight: isTicket ? '600' : '400', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={18} /> Marcar como Ticket Especial (Problemas Complexos)
          </span>
        </div>

        <textarea placeholder="Solicitação / Problema Relatado" required value={solitProb} onChange={(e) => setSolitProb(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}`, minHeight: '80px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s', fontFamily: 'inherit' }} />
        <textarea placeholder="Resolução / O que foi feito" required value={resolucao} onChange={(e) => setResolucao(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}`, minHeight: '80px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s', fontFamily: 'inherit' }} />
        <textarea placeholder="Observações Adicionais (Opcional)" value={obs} onChange={(e) => setObs(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}`, minHeight: '50px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s', fontFamily: 'inherit' }} />

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '16px', backgroundColor: editandoId ? '#d97706' : '#32b8f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', transition: '0.2s', boxShadow: editandoId ? '0 4px 10px rgba(217, 119, 6, 0.3)' : '0 4px 10px rgba(50, 184, 247, 0.3)' }}>
            {editandoId ? 'Salvar Alterações' : 'Salvar Atendimento'}
          </button>
          
          {editandoId ? (
            <button type="button" onClick={() => { limparFormulario(); setAbaAtiva('historico'); }} style={{ padding: '16px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', transition: '0.2s' }}>Cancelar</button>
          ) : (
            <button type="button" onClick={limparFormulario} style={{ padding: '16px', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#cbd5e1' : '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', transition: '0.2s' }} title="Limpar rascunho">🗑️ Limpar</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NovoAtendimento;