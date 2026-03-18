import React, { useState, useEffect } from 'react';
import { X, StickyNote, Plus, Trash2, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BlocoNotas = ({ isOpen, onClose, tema, isDarkMode, token }) => {
  const [notas, setNotas] = useState([]);
  const [novoConteudo, setNovoConteudo] = useState('');

  // Busca as notas sempre que a gaveta for aberta
  useEffect(() => {
    if (isOpen && token) buscarNotas();
  }, [isOpen, token]);

  const buscarNotas = () => {
    axios.get('https://api-ti-relatorios.onrender.com/api/notas/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setNotas(res.data))
      .catch(err => console.error("Erro ao buscar notas:", err));
  };

  const criarNota = (e) => {
    e.preventDefault();
    if (!novoConteudo.trim()) return;

    axios.post('https://api-ti-relatorios.onrender.com/api/notas/', 
      { conteudo: novoConteudo },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setNovoConteudo('');
      buscarNotas();
      toast.success("Nota salva no seu espaço privado!");
    }).catch(() => toast.error("Erro ao salvar nota."));
  };

  const apagarNota = (id) => {
    axios.delete(`https://api-ti-relatorios.onrender.com/api/notas/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        buscarNotas();
        toast.success("Nota descartada.");
      }).catch(() => toast.error("Erro ao apagar."));
  };

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay escuro no fundo para dar destaque à gaveta */}
      <div 
        onClick={onClose} 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', zIndex: 999, animation: 'fadeIn 0.3s ease' }}
      ></div>

      {/* A Gaveta em si (Glassmorphism) */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '380px', zIndex: 1000,
        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderLeft: `1px solid ${tema.borda}`, boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        <style>{`
          @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
          
          /* Esconde a barra de rolagem grossa dentro das notas para ficar mais chique */
          .nota-scroll::-webkit-scrollbar { width: 4px; }
          .nota-scroll::-webkit-scrollbar-track { background: transparent; }
          .nota-scroll::-webkit-scrollbar-thumb { background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; border-radius: 4px; }
        `}</style>

        {/* CABEÇALHO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: `1px solid ${tema.borda}` }}>
          <h3 style={{ margin: 0, color: tema.texto1, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
            <StickyNote size={20} color="#eab308" /> Meu Bloco Privado
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: tema.texto2, cursor: 'pointer', display: 'flex' }} title="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* LISTA DE NOTAS */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {notas.length === 0 ? (
            <div style={{ textAlign: 'center', color: tema.texto2, marginTop: '40px', fontSize: '13px' }}>
              <StickyNote size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
              <p>Sua mesa está limpa.</p>
              <p>Anote IPs, senhas ou lembretes aqui. Só você tem acesso.</p>
            </div>
          ) : (
            notas.map(nota => (
              <div key={nota.id} style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '15px', borderRadius: '12px', border: `1px solid ${tema.borda}`, position: 'relative', transition: '0.2s', display: 'flex', flexDirection: 'column' }}>
                
                {/* === O SEGREDO TÁ AQUI === 
                  Usamos o maxHeight pra nota não engolir a gaveta toda e o wordBreak pra não vazar pros lados.
                */}
                <div className="nota-scroll" style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '13px', 
                  color: tema.texto1, 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: '1.5',
                  maxHeight: '150px', 
                  overflowY: 'auto',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}>
                  {nota.conteudo}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px dashed ${tema.borda}`, paddingTop: '10px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '10px', color: tema.texto2, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} /> {new Date(nota.criado_em).toLocaleDateString('pt-BR')}
                  </span>
                  <button onClick={() => apagarNota(nota.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, opacity: 0.6 }} title="Excluir nota"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ÁREA DE DIGITAÇÃO */}
        <div style={{ padding: '20px', borderTop: `1px solid ${tema.borda}`, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f1f5f9' }}>
          <form onSubmit={criarNota} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea 
              maxLength={3000} /* O CINTO DE SEGURANÇA! */
              placeholder="Escreva uma nova nota rápida..." 
              value={novoConteudo} 
              onChange={e => setNovoConteudo(e.target.value)}
              rows="4"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '13px', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
            <button type="submit" disabled={!novoConteudo.trim()} style={{ padding: '10px', backgroundColor: novoConteudo.trim() ? '#eab308' : (isDarkMode ? '#334155' : '#cbd5e1'), color: '#fff', border: 'none', borderRadius: '10px', cursor: novoConteudo.trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', transition: '0.2s' }}>
              <Plus size={16} /> Adicionar Nota
            </button>
          </form>
        </div>

      </div>
    </>
  );
};

export default BlocoNotas;