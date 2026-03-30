import React, { useState } from 'react';
import { ListChecks, Plus, Trash2, Calendar, UserCircle2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Clock, GripVertical, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const MinhasRotinas = ({ tema, isDarkMode, token, tarefas, buscarTarefas, isStaff, usuarios }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filtroChefia, setFiltroChefia] = useState('');
  const [colunaHover, setColunaHover] = useState(null);
  
  // === CAMPOS DO FORMULÁRIO (AGORA COM PRIORIDADE) ===
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaFrequencia, setNovaFrequencia] = useState('DIARIA');
  const [novaDataVencimento, setNovaDataVencimento] = useState('');
  const [novaPrioridade, setNovaPrioridade] = useState('MEDIA');

  const [novoItemChecklist, setNovoItemChecklist] = useState({});
  const [cartoesExpandidos, setCartoesExpandidos] = useState({});

  const hoje = new Date().toISOString().split('T')[0];

  const toggleExpandir = (id) => setCartoesExpandidos({ ...cartoesExpandidos, [id]: !cartoesExpandidos[id] });

  // === AÇÕES NA TAREFA PRINCIPAL ===
  const criarTarefa = (e) => {
    e.preventDefault();
    if (!novoTitulo) return toast.warning("O título é obrigatório!");

    axios.post(`${import.meta.env.VITE_API_URL}/api/tarefas/`, 
      { 
        titulo: novoTitulo, 
        descricao: novaDescricao, 
        frequencia: novaFrequencia, 
        prioridade: novaPrioridade,
        status: 'A FAZER',
        data_vencimento: novaDataVencimento || null 
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setNovoTitulo(''); setNovaDescricao(''); setNovaDataVencimento(''); setNovaPrioridade('MEDIA'); setShowAdd(false);
      toast.success("Rotina adicionada com sucesso!");
      buscarTarefas(filtroChefia);
    }).catch(() => toast.error("Erro ao criar a rotina."));
  };

  const setStatusTarefa = (id, novoStatus) => {
    axios.patch(`${import.meta.env.VITE_API_URL}/api/tarefas/${id}/`, 
      { status: novoStatus }, { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      buscarTarefas(filtroChefia);
    });
  };

  const apagarTarefa = (id) => {
    toast('Excluir Rotina', {
      description: 'Tens a certeza que desejas apagar esta rotina permanentemente?',
      action: {
        label: 'Sim, Excluir',
        onClick: () => {
          axios.delete(`${import.meta.env.VITE_API_URL}/api/tarefas/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => { toast.success("Rotina apagada!"); buscarTarefas(filtroChefia); })
            .catch(() => toast.error("Erro ao apagar rotina."));
        }
      },
      cancel: { label: 'Cancelar' },
      duration: 8000,
    });
  };

  // === AÇÕES DO CHECKLIST (SUB-TAREFAS) ===
  const adicionarSubtarefa = (tarefaId) => {
    const texto = novoItemChecklist[tarefaId];
    if (!texto) return;
    
    axios.post(`${import.meta.env.VITE_API_URL}/api/subtarefas/`, 
      { tarefa: tarefaId, texto: texto, concluida: false },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setNovoItemChecklist({ ...novoItemChecklist, [tarefaId]: '' });
      buscarTarefas(filtroChefia);
    });
  };

  const toggleSubtarefa = (subId, statusAtual) => {
    axios.patch(`${import.meta.env.VITE_API_URL}/api/subtarefas/${subId}/`, 
      { concluida: !statusAtual }, { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => buscarTarefas(filtroChefia));
  };

  const apagarSubtarefa = (subId) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/subtarefas/${subId}/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => buscarTarefas(filtroChefia));
  };

  // === LÓGICA DE DRAG AND DROP ===
  const handleDragStart = (e, tarefaId) => { e.dataTransfer.setData('tarefaId', tarefaId); };
  const handleDragOver = (e, coluna) => { e.preventDefault(); setColunaHover(coluna); };
  const handleDragLeave = () => { setColunaHover(null); };
  
  const handleDrop = (e, novoStatus) => {
    e.preventDefault();
    setColunaHover(null);
    const tarefaId = e.dataTransfer.getData('tarefaId');
    if (tarefaId) {
      const tarefa = tarefas.find(t => t.id === parseInt(tarefaId));
      if (tarefa && tarefa.status !== novoStatus) {
        setStatusTarefa(tarefa.id, novoStatus);
        if (novoStatus === 'CONCLUIDA') {
          toast.success("Excelente trabalho! Tarefa concluída! 🎉");
        }
      }
    }
  };

  // === SEPARAÇÃO DAS COLUNAS (O NOVO FLUXO KANBAN) ===
  const tarefasAFazer = tarefas.filter(t => t.status === 'A FAZER' || !t.status); // Fallback caso exista alguma antiga
  const tarefasFazendo = tarefas.filter(t => t.status === 'FAZENDO');
  const tarefasConcluidas = tarefas.filter(t => t.status === 'CONCLUIDA');

  const getColStyle = (colunaId) => ({
    flex: 1, minWidth: '320px', 
    backgroundColor: colunaHover === colunaId ? (isDarkMode ? 'rgba(50, 184, 247, 0.1)' : 'rgba(50, 184, 247, 0.05)') : (isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc'), 
    padding: '20px', borderRadius: '16px', 
    border: colunaHover === colunaId ? '2px dashed #32b8f7' : `1px solid ${tema.borda}`, 
    display: 'flex', flexDirection: 'column', gap: '15px', transition: 'all 0.2s ease', minHeight: '65vh'
  });

  // CORES DE PRIORIDADE
  const getPrioridadeConfig = (prio) => {
    switch(prio) {
      case 'CRITICA': return { cor: '#ef4444', bg: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2', icone: <AlertTriangle size={12}/> };
      case 'ALTA': return { cor: '#f97316', bg: isDarkMode ? 'rgba(249, 115, 22, 0.2)' : '#ffedd5', icone: <AlertCircle size={12}/> };
      case 'MEDIA': return { cor: '#eab308', bg: isDarkMode ? 'rgba(234, 179, 8, 0.2)' : '#fefce8', icone: <Clock size={12}/> };
      case 'BAIXA': return { cor: '#3b82f6', bg: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', icone: <ArrowRightCircle size={12}/> };
      default: return { cor: tema.texto2, bg: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9', icone: null };
    }
  };

  // Função para renderizar o cartão da rotina
  const renderCard = (tarefa) => {
    const isExpandido = cartoesExpandidos[tarefa.id];
    const isAtrasada = tarefa.status !== 'CONCLUIDA' && tarefa.data_vencimento && tarefa.data_vencimento < hoje;
    const isHoje = tarefa.status !== 'CONCLUIDA' && tarefa.data_vencimento === hoje;
    
    const confPrio = getPrioridadeConfig(tarefa.prioridade);

    // Lógica da Barra de Progresso
    const totalSub = tarefa.subtarefas ? tarefa.subtarefas.length : 0;
    const concluidasSub = tarefa.subtarefas ? tarefa.subtarefas.filter(s => s.concluida).length : 0;
    const progressoPerc = totalSub === 0 ? 0 : Math.round((concluidasSub / totalSub) * 100);

    return (
      <div key={tarefa.id} draggable onDragStart={(e) => handleDragStart(e, tarefa.id)} style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderRadius: '12px', border: `1px solid ${isAtrasada ? '#ef4444' : tarefa.status === 'CONCLUIDA' ? '#10b981' : tema.borda}`, opacity: tarefa.status === 'CONCLUIDA' ? 0.7 : 1, transition: '0.3s', display: 'flex', flexDirection: 'column', cursor: 'grab', boxShadow: isAtrasada ? '0 0 10px rgba(239, 68, 68, 0.2)' : '0 4px 10px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Barra de Progresso no Topo do Cartão */}
        {totalSub > 0 && (
          <div style={{ height: '4px', width: '100%', backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
            <div style={{ height: '100%', width: `${progressoPerc}%`, backgroundColor: progressoPerc === 100 ? '#10b981' : '#32b8f7', transition: 'width 0.5s ease' }}></div>
          </div>
        )}

        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ flex: 1, paddingRight: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <GripVertical size={14} color={tema.texto2} style={{ cursor: 'grab' }} />
                <span style={{ fontSize: '10px', backgroundColor: confPrio.bg, color: confPrio.cor, padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {confPrio.icone} {tarefa.prioridade}
                </span>
                {tarefa.frequencia !== 'UNICA' && (
                  <span style={{ fontSize: '10px', backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9', color: tema.texto2, padding: '2px 6px', borderRadius: '4px', fontWeight: '600', border: `1px solid ${tema.borda}` }}>
                    ↻ {tarefa.frequencia}
                  </span>
                )}
              </div>
              <h3 style={{ margin: '4px 0 5px 0', fontSize: '15px', color: tema.texto1, textDecoration: tarefa.status === 'CONCLUIDA' ? 'line-through' : 'none' }}>{tarefa.titulo}</h3>
              {tarefa.descricao && <p style={{ margin: 0, fontSize: '12px', color: tema.texto2, display: '-webkit-box', WebkitLineClamp: isExpandido ? 'unset' : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tarefa.descricao}</p>}
            </div>
            <button onClick={() => apagarTarefa(tarefa.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }} title="Apagar"><Trash2 size={16} /></button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {tarefa.data_vencimento && (
              <span className={isAtrasada ? "animate-pulse" : ""} style={{ fontSize: '10px', backgroundColor: isAtrasada ? 'rgba(239, 68, 68, 0.15)' : isHoje ? 'rgba(234, 179, 8, 0.15)' : (isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9'), color: isAtrasada ? '#ef4444' : isHoje ? '#eab308' : tema.texto2, padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', border: `1px solid ${isAtrasada ? 'rgba(239, 68, 68, 0.3)' : isHoje ? 'rgba(234, 179, 8, 0.3)' : tema.borda}` }}>
                {isAtrasada || isHoje ? <AlertCircle size={12} /> : <Calendar size={12} />} 
                {isAtrasada ? 'Atrasada' : isHoje ? 'Hoje' : tarefa.data_vencimento.split('-').reverse().join('/')}
              </span>
            )}
            {isStaff && (
              <span style={{ fontSize: '10px', color: tema.texto2, display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                <UserCircle2 size={12} /> {tarefa.usuario_nome}
              </span>
            )}
          </div>
        </div>

        {/* SESSÃO DE CHECKLIST */}
        <div style={{ borderTop: `1px solid ${tema.borda}`, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc' }}>
          <button onClick={() => toggleExpandir(tarefa.id)} style={{ width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', color: tema.texto1, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '600' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color={progressoPerc === 100 ? '#10b981' : '#32b8f7'}/> 
              Checklist ({concluidasSub}/{totalSub})
            </span>
            {isExpandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {isExpandido && (
            <div className="fade-in" style={{ padding: '0 16px 16px 16px' }}>
              {tarefa.subtarefas && tarefa.subtarefas.map(sub => (
                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px dashed ${tema.borda}` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: sub.concluida ? tema.texto2 : tema.texto1, textDecoration: sub.concluida ? 'line-through' : 'none' }}>
                    <input type="checkbox" checked={sub.concluida} onChange={() => toggleSubtarefa(sub.id, sub.concluida)} style={{ accentColor: '#32b8f7' }}/>
                    {sub.texto}
                  </label>
                  <button onClick={() => apagarSubtarefa(sub.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.5, padding: 0 }}><Trash2 size={12} /></button>
                </div>
              ))}
              
              {/* Ocultar input se a tarefa já estiver concluída totalmente para manter o layout limpo */}
              {tarefa.status !== 'CONCLUIDA' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input type="text" maxLength={255} placeholder="Novo item..." value={novoItemChecklist[tarefa.id] || ''} onChange={(e) => setNovoItemChecklist({...novoItemChecklist, [tarefa.id]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && adicionarSubtarefa(tarefa.id)} style={{ flex: 1, padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, outline: 'none' }} />
                  <button className="btn-premium" onClick={() => adicionarSubtarefa(tarefa.id)} style={{ backgroundColor: '#32b8f7', color: 'white', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer' }}><Plus size={14} /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
      
      {/* CABEÇALHO E FILTROS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px', borderBottom: `2px solid ${isDarkMode ? 'rgba(50, 184, 247, 0.4)' : '#32b8f7'}`, paddingBottom: '15px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ListChecks size={24} color="#32b8f7" /> Gestão de Fluxo (Rotinas)
        </h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {isStaff && (
            <select 
              value={filtroChefia} 
              onChange={(e) => { setFiltroChefia(e.target.value); buscarTarefas(e.target.value); }}
              style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '13px', fontWeight: 'bold', outline: 'none' }}
            >
              <option value="">O Meu Quadro</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>Quadro de: {u.username}</option>)}
            </select>
          )}
          <button className="btn-premium" onClick={() => setShowAdd(!showAdd)} style={{ backgroundColor: '#32b8f7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <Plus size={18} /> Nova Tarefa
          </button>
        </div>
      </div>

      {/* FORMULÁRIO DE NOVA TAREFA KANBAN */}
      {showAdd && (
        <form onSubmit={criarTarefa} className="fade-in" style={{ marginBottom: '30px', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borda}` }}>
          <h4 style={{ margin: '0 0 15px 0', color: tema.texto1 }}>Criar Novo Registo</h4>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
            <input type="text" maxLength={255} required placeholder="Título da Tarefa..." value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} style={{ flex: 2, minWidth: '250px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, outline: 'none' }} />
            
            <select value={novaPrioridade} onChange={e => setNovaPrioridade(e.target.value)} style={{ flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, outline: 'none', fontWeight: 'bold' }}>
              <option value="BAIXA">🔵 Pri. Baixa</option>
              <option value="MEDIA">🟡 Pri. Média</option>
              <option value="ALTA">🟠 Pri. Alta</option>
              <option value="CRITICA">🔴 Pri. Crítica</option>
            </select>

            <select value={novaFrequencia} onChange={e => setNovaFrequencia(e.target.value)} style={{ flex: 1, minWidth: '130px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, outline: 'none' }}>
              <option value="UNICA">Uma única vez</option>
              <option value="DIARIA">Diária</option>
              <option value="SEMANAL">Semanal</option>
              <option value="MENSAL">Mensal</option>
            </select>

            <input type="date" value={novaDataVencimento} onChange={e => setNovaDataVencimento(e.target.value)} style={{ flex: 1, minWidth: '140px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, outline: 'none' }} />
          </div>

          <input type="text" maxLength={500} placeholder="Anotações / Descrição detalhada..." value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box', marginBottom: '15px', outline: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowAdd(false)} style={{ backgroundColor: 'transparent', color: tema.texto2, border: `1px solid ${tema.borda}`, padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
            <button type="submit" className="btn-premium" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Adicionar ao Fluxo</button>
          </div>
        </form>
      )}

      {/* QUADRO KANBAN REAL */}
      <div style={{ display: 'flex', gap: '25px', overflowX: 'auto', paddingBottom: '15px' }}>
        
        {/* COLUNA 1: A FAZER */}
        <div style={getColStyle('A FAZER')} onDragOver={(e) => handleDragOver(e, 'A FAZER')} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'A FAZER')}>
          <h3 style={{ margin: '0 0 10px 0', color: tema.texto1, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#64748b' }}></div>
            A Fazer ({tarefasAFazer.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tarefasAFazer.map(t => renderCard(t))}
            {tarefasAFazer.length === 0 && <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>Nenhuma tarefa aqui.</p>}
          </div>
        </div>

        {/* COLUNA 2: EM ANDAMENTO */}
        <div style={getColStyle('FAZENDO')} onDragOver={(e) => handleDragOver(e, 'FAZENDO')} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'FAZENDO')}>
          <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
            Em Andamento ({tarefasFazendo.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tarefasFazendo.map(t => renderCard(t))}
            {tarefasFazendo.length === 0 && <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>Puxa algo para fazer!</p>}
          </div>
        </div>

        {/* COLUNA 3: CONCLUÍDAS */}
        <div style={getColStyle('CONCLUIDA')} onDragOver={(e) => handleDragOver(e, 'CONCLUIDA')} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'CONCLUIDA')}>
          <h3 style={{ margin: '0 0 10px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            Concluídas ({tarefasConcluidas.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tarefasConcluidas.map(t => renderCard(t))}
            {tarefasConcluidas.length === 0 && <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>Nada finalizado ainda.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MinhasRotinas;