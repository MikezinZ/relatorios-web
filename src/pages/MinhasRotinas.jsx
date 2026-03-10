import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, ListChecks, UserCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const MinhasRotinas = ({ tema, isDarkMode, token, tarefas, buscarTarefas, isStaff, usuarios }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [filtroChefia, setFiltroChefia] = useState('');

  const toggleTarefa = (id, statusAtual) => {
    axios.patch(`https://api-ti-relatorios.onrender.com/api/tarefas/${id}/`, 
      { concluida: !statusAtual },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => buscarTarefas(filtroChefia));
  };

  const criarTarefa = (e) => {
    e.preventDefault();
    axios.post('https://api-ti-relatorios.onrender.com/api/tarefas/', 
      { titulo: novoTitulo },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setNovoTitulo('');
      setShowAdd(false);
      toast.success("Rotina adicionada!");
      buscarTarefas();
    });
  };

  return (
    <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ListChecks size={24} color="#32b8f7" /> Quadro de Rotinas
        </h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {isStaff && (
            <select 
              value={filtroChefia} 
              onChange={(e) => { setFiltroChefia(e.target.value); buscarTarefas(e.target.value); }}
              style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '13px' }}
            >
              <option value="">Meu Quadro</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>Quadro de: {u.username}</option>)}
            </select>
          )}
          <button onClick={() => setShowAdd(!showAdd)} style={{ backgroundColor: '#32b8f7', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
            <Plus size={18} /> Nova Rotina
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={criarTarefa} style={{ marginBottom: '25px', display: 'flex', gap: '10px', backgroundColor: tema.fundoDestaque, padding: '15px', borderRadius: '10px' }}>
          <input 
            autoFocus
            type="text" 
            placeholder="Ex: Monitorar Backups..." 
            value={novoTitulo} 
            onChange={e => setNovoTitulo(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }}
          />
          <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {tarefas.map(tarefa => (
          <div key={tarefa.id} style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', padding: '20px', borderRadius: '12px', border: `1px solid ${tarefa.concluida ? '#10b981' : tema.borda}`, opacity: tarefa.concluida ? 0.7 : 1, transition: '0.3s', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: tema.texto1, textDecoration: tarefa.concluida ? 'line-through' : 'none' }}>{tarefa.titulo}</h3>
              <input 
                type="checkbox" 
                checked={tarefa.concluida} 
                onChange={() => toggleTarefa(tarefa.id, tarefa.concluida)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
               <span style={{ fontSize: '11px', color: tema.texto2, display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <Calendar size={12} /> {tarefa.frequencia}
               </span>
               <span style={{ fontSize: '11px', color: tema.texto2, display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <UserCircle2 size={12} /> {tarefa.usuario_nome}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinhasRotinas;