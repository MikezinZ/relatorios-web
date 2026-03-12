import React, { useState } from 'react';
import { Ticket, AlertCircle, Clock3, CheckCircle2 } from 'lucide-react';
import CartaoRelatorio from '../components/CartaoRelatorio';
import SkeletonCard from '../components/SkeletonCard';

const RadarTickets = ({ 
  tema, isDarkMode, animationParent, isLoading, relatorios, 
  formatarData, iniciarEdicao, apagarRelatorio,
  adicionarAnotacao, moverTicket // <--- Recebe a função nova aqui
}) => {
  
  // Controle de qual coluna está sendo "sobrevoada" pelo mouse para dar um efeito visual
  const [colunaHover, setColunaHover] = useState(null);

  const tickets = relatorios.filter(r => r.is_ticket);
  const ticketsAbertos = tickets.filter(r => r.status === 'Aberto');
  const ticketsAndamento = tickets.filter(r => r.status === 'Andamento');
  const ticketsResolvidos = tickets.filter(r => r.status === 'Resolvido').slice(0, 15);

  // === EVENTOS DE DRAG AND DROP ===
  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData('ticketId', ticketId);
  };

  const handleDragOver = (e, statusName) => {
    e.preventDefault(); // Necessário para o HTML permitir soltar o item aqui
    setColunaHover(statusName);
  };

  const handleDragLeave = () => {
    setColunaHover(null);
  };

  const handleDrop = (e, novoStatus) => {
    e.preventDefault();
    setColunaHover(null); // Tira o efeito de hover
    
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId && moverTicket) {
      moverTicket(parseInt(ticketId), novoStatus);
    }
  };

  // Estilo dinâmico para as colunas (se o cartão estiver sobre ela, ela brilha)
  const getColStyle = (statusName) => ({
    flex: 1, minWidth: '320px', 
    backgroundColor: colunaHover === statusName 
      ? (isDarkMode ? 'rgba(50, 184, 247, 0.1)' : 'rgba(50, 184, 247, 0.05)') 
      : (isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc'), 
    padding: '20px', borderRadius: '16px', 
    border: colunaHover === statusName 
      ? '2px dashed #32b8f7' 
      : `1px solid ${tema.borda}`, 
    display: 'flex', flexDirection: 'column', gap: '15px',
    transition: 'all 0.2s ease',
    minHeight: '60vh' // Garante que você pode soltar mesmo se a coluna estiver vazia
  });

  return (
    <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${isDarkMode ? 'rgba(244, 63, 94, 0.4)' : '#f43f5e'}`, paddingBottom: '15px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Ticket size={24} color="#f43f5e" /> Quadro de Tickets
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}><SkeletonCard tema={tema} isDarkMode={isDarkMode} /></div>
          <div style={{ flex: 1 }}><SkeletonCard tema={tema} isDarkMode={isDarkMode} /></div>
          <div style={{ flex: 1 }}><SkeletonCard tema={tema} isDarkMode={isDarkMode} /></div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '25px', overflowX: 'auto', paddingBottom: '15px' }}>
          
          {/* ======================= COLUNA 1: ABERTOS ======================= */}
          <div 
            style={getColStyle('Aberto')}
            onDragOver={(e) => handleDragOver(e, 'Aberto')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'Aberto')}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <AlertCircle size={18} /> Abertos ({ticketsAbertos.length})
            </h3>
            <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
              {ticketsAbertos.length === 0 ? (
                <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>Nenhum ticket aguardando.</p>
              ) : (
                ticketsAbertos.map(relatorio => 
                  <div key={relatorio.id} draggable onDragStart={(e) => handleDragStart(e, relatorio.id)} style={{ cursor: 'grab' }}>
                    <CartaoRelatorio relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} adicionarAnotacao={adicionarAnotacao} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* ======================= COLUNA 2: EM ANDAMENTO ======================= */}
          <div 
            style={getColStyle('Andamento')}
            onDragOver={(e) => handleDragOver(e, 'Andamento')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'Andamento')}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#eab308', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Clock3 size={18} /> Em Andamento ({ticketsAndamento.length})
            </h3>
            <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
              {ticketsAndamento.length === 0 ? (
                <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>Nenhuma tarefa em execução.</p>
              ) : (
                ticketsAndamento.map(relatorio => 
                  <div key={relatorio.id} draggable onDragStart={(e) => handleDragStart(e, relatorio.id)} style={{ cursor: 'grab' }}>
                    <CartaoRelatorio relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} adicionarAnotacao={adicionarAnotacao} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* ======================= COLUNA 3: RESOLVIDOS ======================= */}
          <div 
            style={getColStyle('Resolvido')}
            onDragOver={(e) => handleDragOver(e, 'Resolvido')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'Resolvido')}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <CheckCircle2 size={18} /> Resolvidos
            </h3>
            <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
              {ticketsResolvidos.length === 0 ? (
                <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>Sem histórico recente.</p>
              ) : (
                ticketsResolvidos.map(relatorio => 
                  <div key={relatorio.id} draggable onDragStart={(e) => handleDragStart(e, relatorio.id)} style={{ cursor: 'grab' }}>
                    <CartaoRelatorio relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} adicionarAnotacao={adicionarAnotacao} />
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default RadarTickets;