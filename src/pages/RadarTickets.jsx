import React from 'react';
import { Ticket, AlertCircle, CheckCircle2 } from 'lucide-react';
import CartaoRelatorio from '../components/CartaoRelatorio';
import SkeletonCard from '../components/SkeletonCard';

const RadarTickets = ({ 
  tema, isDarkMode, filtroTicket, setFiltroTicket, animationParent, 
  isLoading, relatorios, formatarData, iniciarEdicao, apagarRelatorio 
}) => {
  
  const ticketsParaMostrar = relatorios.filter(r => r.is_ticket && (filtroTicket === 'pendentes' ? r.status !== 'Resolvido' : r.status === 'Resolvido'));

  return (
    <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f43f5e', paddingBottom: '15px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Ticket size={24} color="#f43f5e" /> Radar de Tickets</h2>

        <div style={{ display: 'flex', gap: '5px', backgroundColor: tema.inputBg, padding: '6px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
          <button onClick={() => setFiltroTicket('pendentes')} style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroTicket === 'pendentes' ? '#f43f5e' : 'transparent', color: filtroTicket === 'pendentes' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={16} /> Pendentes
          </button>
          <button onClick={() => setFiltroTicket('resolvidos')} style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroTicket === 'resolvidos' ? '#10b981' : 'transparent', color: filtroTicket === 'resolvidos' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Resolvidos
          </button>
        </div>
      </div>

      <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {isLoading ? (
          <>
            <SkeletonCard tema={tema} isDarkMode={isDarkMode} />
            <SkeletonCard tema={tema} isDarkMode={isDarkMode} />
          </>
        ) : (() => {
          if (ticketsParaMostrar.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: tema.fundoDestaque, borderRadius: '12px', border: `1px dashed ${tema.borda}` }}>
                <CheckCircle2 size={48} color={filtroTicket === 'pendentes' ? '#10b981' : tema.texto2} style={{ marginBottom: '15px' }} />
                <h3 style={{ color: tema.texto1, margin: '0 0 10px 0', fontSize: '20px' }}>{filtroTicket === 'pendentes' ? 'Tudo limpo por aqui!' : 'Nenhum ticket arquivado.'}</h3>
                <p style={{ color: tema.texto2, margin: 0, fontSize: '15px' }}>{filtroTicket === 'pendentes' ? 'A equipe T.I. não tem nenhum ticket crítico pendente.' : 'Tickets finalizados aparecerão nesta lista.'}</p>
              </div>
            );
          }

          return ticketsParaMostrar.map(relatorio => (
            <CartaoRelatorio key={relatorio.id} relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} />
          ));
        })()}
      </div>
    </div>
  );
};

export default RadarTickets;