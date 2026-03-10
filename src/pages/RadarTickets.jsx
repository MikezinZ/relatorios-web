import React from 'react';
import { Ticket, AlertCircle, Clock3, CheckCircle2 } from 'lucide-react';
import CartaoRelatorio from '../components/CartaoRelatorio';
import SkeletonCard from '../components/SkeletonCard';

const RadarTickets = ({ 
  tema, isDarkMode, animationParent, isLoading, relatorios, 
  formatarData, iniciarEdicao, apagarRelatorio,
  adicionarAnotacao // <--- 1. Recebemos a função aqui!
}) => {
  
  // Separamos os tickets por status para as colunas do Kanban
  const tickets = relatorios.filter(r => r.is_ticket);
  const ticketsAbertos = tickets.filter(r => r.status === 'Aberto');
  const ticketsAndamento = tickets.filter(r => r.status === 'Andamento');
  // Para não travar a tela com centenas de resolvidos, pegamos só os 15 mais recentes
  const ticketsResolvidos = tickets.filter(r => r.status === 'Resolvido').slice(0, 15);

  return (
    <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f43f5e', paddingBottom: '15px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Ticket size={24} color="#f43f5e" /> Quadro Kanban de Tickets
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}><SkeletonCard tema={tema} isDarkMode={isDarkMode} /></div>
          <div style={{ flex: 1 }}><SkeletonCard tema={tema} isDarkMode={isDarkMode} /></div>
          <div style={{ flex: 1 }}><SkeletonCard tema={tema} isDarkMode={isDarkMode} /></div>
        </div>
      ) : (
        /* O overflowX permite arrastar para o lado no celular (estilo Trello) */
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px' }}>
          
          {/* COLUNA 1: ABERTOS */}
          <div style={{ flex: 1, minWidth: '320px', backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', padding: '15px', borderRadius: '10px', border: `1px solid ${tema.borda}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <AlertCircle size={18} /> Abertos ({ticketsAbertos.length})
            </h3>
            <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {ticketsAbertos.length === 0 ? (
                <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>Nenhum ticket aguardando.</p>
              ) : (
                ticketsAbertos.map(relatorio => 
                  <CartaoRelatorio 
                    key={relatorio.id} 
                    relatorio={relatorio} 
                    tema={tema} 
                    isDarkMode={isDarkMode} 
                    formatarData={formatarData} 
                    iniciarEdicao={iniciarEdicao} 
                    apagarRelatorio={apagarRelatorio} 
                    adicionarAnotacao={adicionarAnotacao} /* <--- 2. Repassamos aqui */
                  />
                )
              )}
            </div>
          </div>

          {/* COLUNA 2: EM ANDAMENTO */}
          <div style={{ flex: 1, minWidth: '320px', backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', padding: '15px', borderRadius: '10px', border: `1px solid ${tema.borda}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, color: '#eab308', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Clock3 size={18} /> Em Andamento ({ticketsAndamento.length})
            </h3>
            <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {ticketsAndamento.length === 0 ? (
                <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>A equipe não está trabalhando em nenhum ticket agora.</p>
              ) : (
                ticketsAndamento.map(relatorio => 
                  <CartaoRelatorio 
                    key={relatorio.id} 
                    relatorio={relatorio} 
                    tema={tema} 
                    isDarkMode={isDarkMode} 
                    formatarData={formatarData} 
                    iniciarEdicao={iniciarEdicao} 
                    apagarRelatorio={apagarRelatorio} 
                    adicionarAnotacao={adicionarAnotacao} /* <--- 2. E aqui */
                  />
                )
              )}
            </div>
          </div>

          {/* COLUNA 3: RESOLVIDOS */}
          <div style={{ flex: 1, minWidth: '320px', backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', padding: '15px', borderRadius: '10px', border: `1px solid ${tema.borda}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <CheckCircle2 size={18} /> Resolvidos
            </h3>
            <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {ticketsResolvidos.length === 0 ? (
                <p style={{ color: tema.texto2, fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>Sem histórico recente.</p>
              ) : (
                ticketsResolvidos.map(relatorio => 
                  <CartaoRelatorio 
                    key={relatorio.id} 
                    relatorio={relatorio} 
                    tema={tema} 
                    isDarkMode={isDarkMode} 
                    formatarData={formatarData} 
                    iniciarEdicao={iniciarEdicao} 
                    apagarRelatorio={apagarRelatorio}
                    adicionarAnotacao={adicionarAnotacao} /* <--- 2. E aqui também! */
                  />
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