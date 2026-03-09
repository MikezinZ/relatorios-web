import React from 'react';
import { Search, Filter, X, FileDown, Calendar, Sheet } from 'lucide-react';
import CartaoRelatorio from '../components/CartaoRelatorio';
import SkeletonCard from '../components/SkeletonCard';

const Historico = ({
  tema, isDarkMode, busca, setBusca, filtroDataTela, setFiltroDataTela, filtroStatusHist, setFiltroStatusHist, 
  filtroCategoriaHist, setFiltroCategoriaHist, isFiltrando, limparFiltrosHistorico, pdfDataInicio, setPdfDataInicio, 
  pdfDataFim, setPdfDataFim, pdfAtendente, setPdfAtendente, gerarPDF, gerarTXT, gerarCSV, animationParent, 
  isLoading, relatoriosFiltradosHist, relatoriosHoje, relatoriosAntigos, formatarData, hojePadrao, iniciarEdicao, apagarRelatorio
}) => {
  return (
    <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Search size={24} color="#32b8f7" /> Histórico Completo</h2>
      </div>

      {/* CAIXA DE FILTROS AVANÇADOS */}
      <div style={{ backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '10px', border: `1px solid ${tema.borda}`, marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: '0', color: tema.texto1, display: 'flex', alignItems: 'center', gap: '8px' }}><Filter size={18} /> Filtros de Busca</h4>
          {isFiltrando && (
            <button onClick={limparFiltrosHistorico} style={{ background: 'transparent', color: '#f43f5e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '13px' }}>
              <X size={14} /> Limpar Tudo
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: tema.texto2 }} />
            <input type="text" placeholder="Buscar texto (empresa, problema...)" value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <input type="date" value={filtroDataTela} onChange={(e) => setFiltroDataTela(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }} title="Filtrar por Dia" />
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <select value={filtroStatusHist} onChange={(e) => setFiltroStatusHist(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }}>
              <option value="">Todos os Status</option>
              <option value="Resolvido">🟢 Resolvidos</option>
              <option value="Andamento">🟡 Em Andamento</option>
              <option value="Aberto">🔴 Abertos</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <select value={filtroCategoriaHist} onChange={(e) => setFiltroCategoriaHist(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }}>
              <option value="">Todas as Categorias</option>
              <option value="Hardware / Equipamento">Hardware / Equipamento</option>
              <option value="Sistema Operacional / Windows">Sistema Operacional / Windows</option>
              <option value="Rede Interna / Servidor">Rede Interna / Servidor</option>
              <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
              <option value="Sistemas / ERP">Sistemas / ERP</option>
              <option value="Pacote Office / Softwares">Pacote Office / Softwares</option>
              <option value="Impressora">Impressora</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>
      </div>

      {/* CAIXA DE EXPORTAÇÃO */}
      <div style={{ backgroundColor: tema.fundoDestaque, padding: '15px', borderRadius: '10px', border: `1px solid ${tema.borda}`, marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: tema.texto1, fontSize: '14px', fontWeight: 'bold' }}><FileDown size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Exportar Dados:</span>
          <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block' }}>Data Inicial</label><input type="date" value={pdfDataInicio} onChange={e => setPdfDataInicio(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
          <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block' }}>Data Final</label><input type="date" value={pdfDataFim} onChange={e => setPdfDataFim(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
          <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block' }}>Atendente</label><input type="text" placeholder="Nome..." value={pdfAtendente} onChange={e => setPdfAtendente(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, width: '100px' }} /></div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={gerarPDF} style={{ padding: '8px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}>PDF</button>
            <button onClick={gerarTXT} style={{ padding: '8px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}>TXT</button>
            <button onClick={gerarCSV} style={{ padding: '8px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sheet size={16} /> Excel (CSV)
            </button>
          </div>
        </div>
      </div>

      <div ref={animationParent}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SkeletonCard tema={tema} isDarkMode={isDarkMode} />
            <SkeletonCard tema={tema} isDarkMode={isDarkMode} />
            <SkeletonCard tema={tema} isDarkMode={isDarkMode} />
          </div>
        ) : isFiltrando ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ color: tema.texto1, margin: 0, fontSize: '18px' }}>Resultados da Busca ({relatoriosFiltradosHist.length})</h3>
            </div>
            {relatoriosFiltradosHist.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', marginBottom: '40px', textAlign: 'center', padding: '20px' }}>Nenhum atendimento corresponde aos filtros.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {relatoriosFiltradosHist.map(relatorio => (
                <CartaoRelatorio key={relatorio.id} relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} />
              ))}
            </div>}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ color: tema.texto1, margin: 0, fontSize: '18px' }}>Hoje ({formatarData(hojePadrao)})</h3>
            </div>

            {relatoriosHoje.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', marginBottom: '40px', textAlign: 'center', padding: '20px' }}>Nenhum atendimento registrado hoje.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {relatoriosHoje.map(relatorio => (
                <CartaoRelatorio key={relatorio.id} relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} />
              ))}
            </div>}

            <h3 style={{ borderBottom: `2px solid ${tema.borda}`, paddingBottom: '10px', color: tema.texto1, marginBottom: '20px', fontSize: '18px' }}>Últimos Atendimentos</h3>
            {relatoriosAntigos.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Nenhum histórico antigo encontrado.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {relatoriosAntigos.map(relatorio => (
                <CartaoRelatorio key={relatorio.id} relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} />
              ))}
            </div>}
          </>
        )}
      </div>
    </div>
  );
};

export default Historico;