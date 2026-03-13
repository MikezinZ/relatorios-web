import React, { useState, useEffect } from 'react';
import { Search, Filter, X, FileDown, Calendar, Sheet, ChevronLeft, ChevronRight } from 'lucide-react';
import CartaoRelatorio from '../components/CartaoRelatorio';
import SkeletonCard from '../components/SkeletonCard';

const Historico = ({
  tema, isDarkMode, busca, setBusca, filtroDataTela, setFiltroDataTela, filtroStatusHist, setFiltroStatusHist, 
  filtroCategoriaHist, setFiltroCategoriaHist, isFiltrando, limparFiltrosHistorico, pdfDataInicio, setPdfDataInicio, 
  pdfDataFim, setPdfDataFim, pdfAtendente, setPdfAtendente, gerarPDF, gerarTXT, gerarCSV, animationParent, 
  isLoading, relatoriosFiltradosHist, relatoriosHoje, relatoriosAntigos, formatarData, hojePadrao, iniciarEdicao, 
  apagarRelatorio, adicionarAnotacao
}) => {

  // === ESTADOS DA PAGINAÇÃO ===
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10; // Quantidade de tickets por página

  // Se o usuário digitar na busca ou mudar um filtro, volta automaticamente pra página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, filtroDataTela, filtroStatusHist, filtroCategoriaHist]);

  // Define qual lista será paginada (se está buscando, pagina o resultado. Se não, pagina os antigos)
  const listaParaPaginar = isFiltrando ? relatoriosFiltradosHist : relatoriosAntigos;
  
  // Calcula o total de páginas e recorta os itens exatos da página atual
  const totalPaginas = Math.ceil(listaParaPaginar.length / itensPorPagina) || 1;
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = paginaAtual * itensPorPagina;
  const itensPaginados = listaParaPaginar.slice(indexInicio, indexFim);

  return (
    <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Search size={24} color="#32b8f7" /> Histórico Completo</h2>
      </div>

      {/* CAIXA DE FILTROS AVANÇADOS */}
      <div style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borda}`, marginBottom: '30px' }}>
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
            <input type="text" placeholder="Buscar texto (empresa, problema...)" value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <input type="date" value={filtroDataTela} onChange={(e) => setFiltroDataTela(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }} title="Filtrar por Dia" />
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <select value={filtroStatusHist} onChange={(e) => setFiltroStatusHist(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }}>
              <option value="">Todos os Status</option>
              <option value="Resolvido">?? Resolvidos</option>
              <option value="Andamento">?? Em Andamento</option>
              <option value="Aberto">?? Abertos</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <select value={filtroCategoriaHist} onChange={(e) => setFiltroCategoriaHist(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '14px', boxSizing: 'border-box' }}>
              <option value="">Todas as Categorias</option>
              <option value="Hardware / Equipamento">Hardware / Equipamento</option>
              <option value="Sistema Operacional / Windows">Sistema Operacional / Windows</option>
              <option value="Rede Interna / Servidor">Rede Interna / Servidor</option>
              <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
              <option value="Sistemas / ERP">Sistemas / ERP</option>
              <option value="Pacote Office / Softwares">Pacote Office / Softwares</option>
              <option value="E-mail / Webmail">E-mail / Webmail</option>
              <option value="Acessos / Senhas">Acessos / Senhas</option>
              <option value="Telefonia / Ramal">Telefonia / Ramal</option>
              <option value="Celular / Smartphone">Celular / Smartphone</option>
              <option value="Segurança / Antivírus">Segurança / Antivírus</option>
              <option value="Backup / Nuvem">Backup / Nuvem</option>
              <option value="Certificados Digitais">Certificados Digitais</option>
              <option value="Relógio de Ponto">Relógio de Ponto</option>
              <option value="Câmeras / CFTV">Câmeras / CFTV</option>
              <option value="Impressora">Impressora</option>
              <option value="Periféricos (Mouse/Teclado)">Periféricos (Mouse/Teclado)</option>
              <option value="Dúvida / Treinamento">Dúvida / Treinamento</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>
      </div>

      {/* CAIXA DE EXPORTAÇÃO */}
      <div style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: '15px 20px', borderRadius: '12px', border: `1px solid ${tema.borda}`, marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: tema.texto1, fontSize: '14px', fontWeight: 'bold' }}><FileDown size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Exportar:</span>
          <div><label style={{ fontSize: '11px', color: tema.texto2, display: 'block', marginBottom:'2px' }}>Data Inicial</label><input type="date" value={pdfDataInicio} onChange={e => setPdfDataInicio(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
          <div><label style={{ fontSize: '11px', color: tema.texto2, display: 'block', marginBottom:'2px' }}>Data Final</label><input type="date" value={pdfDataFim} onChange={e => setPdfDataFim(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
          <div><label style={{ fontSize: '11px', color: tema.texto2, display: 'block', marginBottom:'2px' }}>Atendente</label><input type="text" placeholder="Nome..." value={pdfAtendente} onChange={e => setPdfAtendente(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, width: '100px' }} /></div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button className="btn-premium" onClick={gerarPDF} style={{ padding: '8px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>PDF</button>
            <button className="btn-premium" onClick={gerarTXT} style={{ padding: '8px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>TXT</button>
            <button className="btn-premium" onClick={gerarCSV} style={{ padding: '8px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sheet size={16} /> Excel (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* RENDERIZAÇÃO DA LISTA */}
      <div ref={animationParent}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SkeletonCard tema={tema} isDarkMode={isDarkMode} />
            <SkeletonCard tema={tema} isDarkMode={isDarkMode} />
          </div>
        ) : isFiltrando ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ color: tema.texto1, margin: 0, fontSize: '18px' }}>Resultados da Busca ({relatoriosFiltradosHist.length})</h3>
            </div>
            {itensPaginados.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Nenhum atendimento corresponde aos filtros.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
              {itensPaginados.map(relatorio => (
                <CartaoRelatorio key={relatorio.id} relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} adicionarAnotacao={adicionarAnotacao} /> 
              ))}
            </div>}
          </>
        ) : (
          <>
            {/* SÓ MOSTRA O "HOJE" SE ESTIVER NA PRIMEIRA PÁGINA */}
            {paginaAtual === 1 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '10px', marginBottom: '20px' }}>
                  <h3 style={{ color: tema.texto1, margin: 0, fontSize: '18px' }}>Hoje ({formatarData(hojePadrao)})</h3>
                </div>

                {relatoriosHoje.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', marginBottom: '40px', textAlign: 'center', padding: '20px' }}>Nenhum atendimento registrado hoje.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                  {relatoriosHoje.map(relatorio => (
                    <CartaoRelatorio key={relatorio.id} relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} adicionarAnotacao={adicionarAnotacao} /> 
                  ))}
                </div>}
              </>
            )}

            <h3 style={{ borderBottom: `1px solid ${tema.borda}`, paddingBottom: '10px', color: tema.texto1, marginBottom: '20px', fontSize: '18px' }}>
              Últimos Atendimentos {paginaAtual > 1 && <span style={{ color: tema.texto2, fontSize: '14px' }}>- Página {paginaAtual}</span>}
            </h3>
            {itensPaginados.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Nenhum histórico antigo encontrado.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {itensPaginados.map(relatorio => (
                <CartaoRelatorio key={relatorio.id} relatorio={relatorio} tema={tema} isDarkMode={isDarkMode} formatarData={formatarData} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} adicionarAnotacao={adicionarAnotacao} />
              ))}
            </div>}
          </>
        )}
      </div>

      {/* === CONTROLES DE PAGINAÇÃO NO RODAPÉ === */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px', paddingTop: '20px', borderTop: `1px dashed ${tema.borda}` }}>
          <button
            className={paginaAtual === 1 ? "" : "btn-premium"}
            onClick={() => { setPaginaAtual(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={paginaAtual === 1}
            style={{
              padding: '10px 16px', borderRadius: '10px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold',
              backgroundColor: paginaAtual === 1 ? (isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0') : (isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#32b8f7'),
              color: paginaAtual === 1 ? tema.texto2 : (isDarkMode ? '#32b8f7' : '#fff'),
              cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', transition: '0.3s'
            }}
          >
            <ChevronLeft size={18} /> Anterior
          </button>

          <span style={{ color: tema.texto1, fontSize: '14px', fontWeight: '600', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: '8px 20px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            className={paginaAtual === totalPaginas ? "" : "btn-premium"}
            onClick={() => { setPaginaAtual(p => Math.min(totalPaginas, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={paginaAtual === totalPaginas}
            style={{
              padding: '10px 16px', borderRadius: '10px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold',
              backgroundColor: paginaAtual === totalPaginas ? (isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0') : (isDarkMode ? 'rgba(50, 184, 247, 0.15)' : '#32b8f7'),
              color: paginaAtual === totalPaginas ? tema.texto2 : (isDarkMode ? '#32b8f7' : '#fff'),
              cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', transition: '0.3s'
            }}
          >
            Próxima <ChevronRight size={18} />
          </button>
        </div>
      )}

    </div>
  );
};

export default Historico;