import React, { useState } from 'react';
import { ListChecks, Plus, Trash2, Calendar, UserCircle2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const MinhasRotinas = ({ tema, isDarkMode, token, tarefas, buscarTarefas, isStaff, usuarios }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filtroChefia, setFiltroChefia] = useState('');
  
  // Campos do Formulário Novo
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaFrequencia, setNovaFrequencia] = useState('DIARIA');
  const [novaDataVencimento, setNovaDataVencimento] = useState('');

  // Controla o input de subtarefa de cada cartão separadamente
  const [novoItemChecklist, setNovoItemChecklist] = useState({});
  // Controla quais cartões estão expandidos para ver o checklist
  const [cartoesExpandidos, setCartoesExpandidos] = useState({});

  const hoje = new Date().toISOString().split('T')[0];

  const toggleExpandir = (id) => setCartoesExpandidos({ ...cartoesExpandidos, [id]: !cartoesExpandidos[id] });

  // === AÇÕES NA TAREFA PRINCIPAL ===
  const criarTarefa = (e) => {
    e.preventDefault();
    if (!novoTitulo) return toast.warning("O título é obrigatório!");

    axios.post('https://api-ti-relatorios.onrender.com/api/tarefas/', 
      { titulo: novoTitulo, descricao: novaDescricao, frequencia: novaFrequencia, data_vencimento: novaDataVencimento || null },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setNovoTitulo(''); setNovaDescricao(''); setNovaDataVencimento(''); setShowAdd(false);
      toast.success("Rotina adicionada com sucesso!");
      buscarTarefas(filtroChefia);
    });
  };

  const toggleTarefa = (id, statusAtual) => {
    axios.patch(`https://api-ti-relatorios.onrender.com/api/tarefas/${id}/`, 
      { concluida: !statusAtual }, { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => buscarTarefas(filtroChefia));
  };

  const apagarTarefa = (id) => {
    if (window.confirm("Deseja apagar essa rotina permanentemente?")) {
      axios.delete(`https://api-ti-relatorios.onrender.com/api/tarefas/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => { toast.success("Rotina apagada!"); buscarTarefas(filtroChefia); });
    }
  };

  // === AÇÕES DO CHECKLIST (SUB-TAREFAS) ===
  const adicionarSubtarefa = (tarefaId) => {
    const texto = novoItemChecklist[tarefaId];
    if (!texto) return;
    
    axios.post('https://api-ti-relatorios.onrender.com/api/subtarefas/', 
      { tarefa: tarefaId, texto: texto, concluida: false },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setNovoItemChecklist({ ...novoItemChecklist, [tarefaId]: '' });
      buscarTarefas(filtroChefia);
    });
  };

  const toggleSubtarefa = (subId, statusAtual) => {
    axios.patch(`https://api-ti-relatorios.onrender.com/api/subtarefas/${subId}/`, 
      { concluida: !statusAtual }, { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => buscarTarefas(filtroChefia));
  };

  const apagarSubtarefa = (subId) => {
    axios.delete(`https://api-ti-relatorios.onrender.com/api/subtarefas/${subId}/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => buscarTarefas(filtroChefia));
  };

  return (
    <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      {/* CABEÇALHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ListChecks size={24} color="#32b8f7" /> Quadro de Rotinas e Metas
        </h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {isStaff && (
            <select 
              value={filtroChefia} 
              onChange={(e) => { setFiltroChefia(e.target.value); buscarTarefas(e.target.value); }}
              style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '13px', fontWeight: 'bold' }}
            >
              <option value="">??? Meu Quadro</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>Quadro de: {u.username}</option>)}
            </select>
          )}
          <button onClick={() => setShowAdd(!showAdd)} style={{ backgroundColor: '#32b8f7', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
            <Plus size={18} /> Nova Rotina
          </button>
        </div>
      </div>

      {/* FORMULÁRIO DE NOVA ROTINA */}
      {showAdd && (
        <form onSubmit={criarTarefa} style={{ marginBottom: '30px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
          <h4 style={{ margin: '0 0 15px 0', color: tema.texto1 }}>Criar Nova Tarefa Diária/Recorrente</h4>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
            <input type="text" placeholder="Título da Tarefa (Ex: Enviar XMLs, Checar Backups)" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} style={{ flex: 2, minWidth: '250px', padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} />
            
            <select value={novaFrequencia} onChange={e => setNovaFrequencia(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }}>
              <option value="UNICA">Uma única vez</option>
              <option value="DIARIA">Diária</option>
              <option value="SEMANAL">Semanal</option>
              <option value="MENSAL">Mensal</option>
            </select>

            <input type="date" value={novaDataVencimento} onChange={e => setNovaDataVencimento(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} title="Data Limite" />
          </div>
          
          <input type="text" placeholder="Anotações / Descrição rápida (opcional)" value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box', marginBottom: '15px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowAdd(false)} style={{ backgroundColor: 'transparent', color: tema.texto2, border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
            <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Rotina</button>
          </div>
        </form>
      )}

      {/* QUADRO DE CARTÕES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {tarefas.length === 0 ? (
          <p style={{ color: tema.texto2, fontStyle: 'italic' }}>Nenhuma rotina encontrada neste quadro.</p>
        ) : (
          tarefas.map(tarefa => {
            const isAtrasada = !tarefa.concluida && tarefa.data_vencimento && tarefa.data_vencimento < hoje;
            const isHoje = !tarefa.concluida && tarefa.data_vencimento === hoje;
            const isExpandido = cartoesExpandidos[tarefa.id];

            return (
              <div key={tarefa.id} style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', borderRadius: '12px', border: `1px solid ${tarefa.concluida ? '#10b981' : isAtrasada ? '#ef4444' : tema.borda}`, opacity: tarefa.concluida ? 0.7 : 1, transition: '0.3s', display: 'flex', flexDirection: 'column' }}>
                
                {/* CABEÇALHO DO CARTÃO */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1, paddingRight: '15px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: tema.texto1, textDecoration: tarefa.concluida ? 'line-through' : 'none' }}>{tarefa.titulo}</h3>
                      {tarefa.descricao && <p style={{ margin: 0, fontSize: '12px', color: tema.texto2 }}>{tarefa.descricao}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button onClick={() => apagarTarefa(tarefa.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }} title="Excluir Rotina"><Trash2 size={16} /></button>
                      <input type="checkbox" checked={tarefa.concluida} onChange={() => toggleTarefa(tarefa.id, tarefa.concluida)} style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#10b981' }} />
                    </div>
                  </div>
                  
                  {/* BADGES (Data e Frequência) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0', color: tema.texto2, padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <Calendar size={12} /> {tarefa.frequencia}
                    </span>
                    
                    {tarefa.data_vencimento && (
                      <span style={{ fontSize: '11px', backgroundColor: isAtrasada ? '#fee2e2' : isHoje ? '#fef08a' : (isDarkMode ? '#1e293b' : '#e2e8f0'), color: isAtrasada ? '#991b1b' : isHoje ? '#854d0e' : tema.texto2, padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                        {isAtrasada || isHoje ? <AlertCircle size={12} /> : <Calendar size={12} />} 
                        {isAtrasada ? 'Atrasado' : isHoje ? 'Vence Hoje' : tarefa.data_vencimento.split('-').reverse().join('/')}
                      </span>
                    )}

                    {isStaff && (
                      <span style={{ fontSize: '11px', color: tema.texto2, display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                        <UserCircle2 size={12} /> {tarefa.usuario_nome}
                      </span>
                    )}
                  </div>
                </div>

                {/* SESSÃO DE CHECKLIST (SUB-TAREFAS) */}
                <div style={{ borderTop: `1px solid ${tema.borda}`, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f1f5f9', borderRadius: '0 0 12px 12px' }}>
                  <button onClick={() => toggleExpandir(tarefa.id)} style={{ width: '100%', padding: '10px 20px', background: 'transparent', border: 'none', color: tema.texto1, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#32b8f7"/> Checklist ({tarefa.subtarefas?.filter(s => s.concluida).length || 0}/{tarefa.subtarefas?.length || 0})</span>
                    {isExpandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpandido && (
                    <div style={{ padding: '0 20px 20px 20px' }}>
                      {/* Lista de sub-tarefas */}
                      {tarefa.subtarefas && tarefa.subtarefas.map(sub => (
                        <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px dashed ${tema.borda}` }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: sub.concluida ? tema.texto2 : tema.texto1, textDecoration: sub.concluida ? 'line-through' : 'none' }}>
                            <input type="checkbox" checked={sub.concluida} onChange={() => toggleSubtarefa(sub.id, sub.concluida)} style={{ accentColor: '#32b8f7' }}/>
                            {sub.texto}
                          </label>
                          <button onClick={() => apagarSubtarefa(sub.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.5, padding: 0 }}><Trash2 size={12} /></button>
                        </div>
                      ))}

                      {/* Input para adicionar nova subtarefa */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <input type="text" placeholder="Adicionar item..." value={novoItemChecklist[tarefa.id] || ''} onChange={(e) => setNovoItemChecklist({...novoItemChecklist, [tarefa.id]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && adicionarSubtarefa(tarefa.id)} style={{ flex: 1, padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} />
                        <button onClick={() => adicionarSubtarefa(tarefa.id)} style={{ backgroundColor: '#32b8f7', color: 'white', border: 'none', borderRadius: '4px', padding: '0 10px', cursor: 'pointer' }}><Plus size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MinhasRotinas;