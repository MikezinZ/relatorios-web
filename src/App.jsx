import { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import logoImg from './assets/logo_Globalnet.png'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [atendenteId, setAtendenteId] = useState(localStorage.getItem('atendenteId') || null)
  const [isStaff, setIsStaff] = useState(localStorage.getItem('isStaff') === 'true')
  
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('temaEscuro') === 'true')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [abaAtiva, setAbaAtiva] = useState('novo')

  const [relatorios, setRelatorios] = useState([])
  const [empresa, setEmpresa] = useState('')
  const [funcionario, setFuncionario] = useState('')
  
  const [categoria, setCategoria] = useState('Outros')
  const [status, setStatus] = useState('Resolvido')
  
  const dataLocal = new Date();
  const hojePadrao = `${dataLocal.getFullYear()}-${String(dataLocal.getMonth() + 1).padStart(2, '0')}-${String(dataLocal.getDate()).padStart(2, '0')}`;
  
  const [dataAtendimento, setDataAtendimento] = useState(hojePadrao)

  const [atendentesSelecionados, setAtendentesSelecionados] = useState([])

  const [solitProb, setSolitProb] = useState('')
  const [resolucao, setResolucao] = useState('')
  const [obs, setObs] = useState('')
  const [busca, setBusca] = useState('')
  
  const [filtroDataTela, setFiltroDataTela] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  const [pdfDataInicio, setPdfDataInicio] = useState('')
  const [pdfDataFim, setPdfDataFim] = useState('')
  const [pdfAtendente, setPdfAtendente] = useState('')

  const [usuarios, setUsuarios] = useState([])
  const [editandoUsuarioId, setEditandoUsuarioId] = useState(null)
  const [novoUsername, setNovoUsername] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [novoIsStaff, setNovoIsStaff] = useState(false)
  const [novoIsActive, setNovoIsActive] = useState(true)

  useEffect(() => {
    localStorage.setItem('temaEscuro', isDarkMode)
  }, [isDarkMode])

  const tema = {
    fundoMain: isDarkMode ? '#0f172a' : '#eef2f5',
    fundoCard: isDarkMode ? '#1e293b' : '#ffffff',
    texto1: isDarkMode ? '#f8fafc' : '#333333',
    texto2: isDarkMode ? '#cbd5e1' : '#555555',
    borda: isDarkMode ? '#334155' : '#eaeaea',
    inputBg: isDarkMode ? '#0f172a' : '#ffffff',
    fundoDestaque: isDarkMode ? '#334155' : '#f8fafc',
    graficoTexto: isDarkMode ? '#cbd5e1' : '#475569'
  }

  const handleLogin = (e) => {
    e.preventDefault()
    axios.post('https://api-ti-relatorios.onrender.com/api/token/', { username, password })
    .then(response => {
      const accessToken = response.data.access
      const decoded = jwtDecode(accessToken)
      setToken(accessToken); setAtendenteId(decoded.user_id); setIsStaff(decoded.is_staff);
      localStorage.setItem('token', accessToken); localStorage.setItem('atendenteId', decoded.user_id); localStorage.setItem('isStaff', decoded.is_staff);
      setUsername(''); setPassword('');
      setAtendentesSelecionados([decoded.user_id]);
      if(decoded.is_staff) setAbaAtiva('gestao')
    })
    .catch(error => alert("Usuário ou senha incorretos!"))
  }

  const handleLogout = () => {
    setToken(''); setAtendenteId(null); setIsStaff(false); setAtendentesSelecionados([]);
    localStorage.removeItem('token'); localStorage.removeItem('atendenteId'); localStorage.removeItem('isStaff');
    setAbaAtiva('novo')
  }

  useEffect(() => {
    if (token) {
      axios.get('https://api-ti-relatorios.onrender.com/api/relatorios/', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        const dados = response.data.results ? response.data.results : response.data;
        setRelatorios(dados);
      })
      .catch(error => console.error(error))

      buscarUsuarios()
      
      if (atendenteId && atendentesSelecionados.length === 0 && !editandoId) {
        setAtendentesSelecionados([parseInt(atendenteId)]);
      }
    }
  }, [token, atendenteId])

  const buscarUsuarios = () => {
    axios.get('https://api-ti-relatorios.onrender.com/api/usuarios/', { headers: { Authorization: `Bearer ${token}` } })
    .then(response => setUsuarios(response.data))
    .catch(error => console.error(error))
  }

  const handleSalvarUsuario = (e) => {
    e.preventDefault()
    const payload = { username: novoUsername, is_staff: novoIsStaff, is_active: novoIsActive }
    if (novaSenha) payload.password = novaSenha

    if (editandoUsuarioId) {
      axios.put(`https://api-ti-relatorios.onrender.com/api/usuarios/${editandoUsuarioId}/`, payload, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => { alert("Usuário atualizado com sucesso!"); limparFormularioUsuario(); buscarUsuarios(); })
      .catch(error => alert("Erro ao atualizar usuário."))
    } else {
      if (!novaSenha) { alert("Senha é obrigatória para criar um usuário novo!"); return; }
      axios.post('https://api-ti-relatorios.onrender.com/api/usuarios/', payload, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => { alert("Atendente criado com sucesso!"); limparFormularioUsuario(); buscarUsuarios(); })
      .catch(error => alert("Erro! Verifique se esse nome já não existe no sistema."))
    }
  }

  const iniciarEdicaoUsuario = (user) => { setEditandoUsuarioId(user.id); setNovoUsername(user.username); setNovaSenha(''); setNovoIsStaff(user.is_staff); setNovoIsActive(user.is_active); }

  const apagarUsuario = (id) => {
    if (id === parseInt(atendenteId)) { alert("Você não pode apagar a si mesmo!"); return; }
    if (window.confirm("⚠️ ATENÇÃO: Deseja APAGAR a conta e todos os relatórios vinculados a ela?")) {
      axios.delete(`https://api-ti-relatorios.onrender.com/api/usuarios/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => buscarUsuarios())
      .catch(error => alert("Erro ao apagar usuário."))
    }
  }

  const limparFormularioUsuario = () => { setEditandoUsuarioId(null); setNovoUsername(''); setNovaSenha(''); setNovoIsStaff(false); setNovoIsActive(true); }

  const handleToggleAtendente = (id) => {
    if (atendentesSelecionados.includes(id)) {
      setAtendentesSelecionados(atendentesSelecionados.filter(aId => aId !== id));
    } else {
      setAtendentesSelecionados([...atendentesSelecionados, id]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (atendentesSelecionados.length === 0) {
      alert("Selecione pelo menos um atendente para este relatório!");
      return;
    }

    const dadosRelatorio = { empresa, funcionario, categoria, status, data_atendimento: dataAtendimento, solit_prob: solitProb, resolucao, obs, atendentes: atendentesSelecionados }
    
    if (editandoId) {
      axios.put(`https://api-ti-relatorios.onrender.com/api/relatorios/${editandoId}/`, dadosRelatorio, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => { setRelatorios(relatorios.map(r => r.id === editandoId ? response.data : r)); limparFormulario(); alert("Atualizado!"); setAbaAtiva('historico'); })
    } else {
      axios.post('https://api-ti-relatorios.onrender.com/api/relatorios/', dadosRelatorio, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => { setRelatorios([response.data, ...relatorios]); limparFormulario(); alert("Salvo!"); })
    }
  }

  const iniciarEdicao = (relatorio) => {
    setEditandoId(relatorio.id); setEmpresa(relatorio.empresa); setFuncionario(relatorio.funcionario || '');
    setCategoria(relatorio.categoria || 'Outros'); setStatus(relatorio.status || 'Resolvido');
    
    const dataParaEditar = relatorio.data_atendimento || relatorio.criado_em.split('T')[0];
    setDataAtendimento(dataParaEditar);

    setAtendentesSelecionados(relatorio.atendentes || []);

    setSolitProb(relatorio.solit_prob); setResolucao(relatorio.resolucao); setObs(relatorio.obs || ''); setAbaAtiva('novo');
  }

  const apagarRelatorio = (id) => {
    if (window.confirm("Apagar este relatório?")) {
      axios.delete(`https://api-ti-relatorios.onrender.com/api/relatorios/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setRelatorios(relatorios.filter(r => r.id !== id)))
    }
  }

  const limparFormulario = () => { 
    setEditandoId(null); setEmpresa(''); setFuncionario(''); setCategoria('Outros'); setStatus('Resolvido'); 
    setDataAtendimento(hojePadrao); setSolitProb(''); setResolucao(''); setObs(''); 
    setAtendentesSelecionados(atendenteId ? [parseInt(atendenteId)] : []);
  }

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  const gerarNomeArquivo = () => {
    let nome = "Atendimento";
    if (pdfAtendente) { nome += ` ${pdfAtendente.trim()}`; } else { nome += ` Geral`; }
    let dataStr = "";
    if (pdfDataInicio && pdfDataFim && pdfDataInicio !== pdfDataFim) {
      dataStr = `${formatarData(pdfDataInicio).replace(/\//g, '-')} a ${formatarData(pdfDataFim).replace(/\//g, '-')}`;
    } else if (pdfDataInicio) {
      dataStr = formatarData(pdfDataInicio).replace(/\//g, '-');
    } else if (pdfDataFim) {
      dataStr = formatarData(pdfDataFim).replace(/\//g, '-');
    } else {
      dataStr = formatarData(hojePadrao).replace(/\//g, '-');
    }
    return `${nome} - ${dataStr}`;
  }

  const filtrarDadosParaExportacao = () => {
    let dados = relatorios
    if (pdfDataInicio) dados = dados.filter(r => (r.data_atendimento || r.criado_em.split('T')[0]) >= pdfDataInicio)
    if (pdfDataFim) dados = dados.filter(r => (r.data_atendimento || r.criado_em.split('T')[0]) <= pdfDataFim)
    if (pdfAtendente) dados = dados.filter(r => r.atendente_nome?.toLowerCase().includes(pdfAtendente.toLowerCase()))
    return dados
  }

  const gerarPDF = () => {
    const dados = filtrarDadosParaExportacao()
    if (dados.length === 0) { alert("Nenhum relatório encontrado com esses filtros!"); return; }

    const doc = new jsPDF('landscape')
    doc.setFontSize(18); doc.text("Relatório Geral de Atendimentos - T.I.", 14, 22)
    doc.setFontSize(10); doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30)

    const colunas = ["Data do B.O", "Empresa", "Func.", "Categ.", "Status", "Problema", "Equipe"]
    const linhas = dados.map(r => [ formatarData(r.data_atendimento || r.criado_em.split('T')[0]), r.empresa, r.funcionario || '-', r.categoria || '-', r.status || '-', r.solit_prob, r.atendente_nome ])
    autoTable(doc, { head: [colunas], body: linhas, startY: 35, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [50, 184, 247] }, columnStyles: { 5: { cellWidth: 80 } } })
    
    doc.save(`${gerarNomeArquivo()}.pdf`)
  }

  const gerarTXT = () => {
    const dados = filtrarDadosParaExportacao()
    if (dados.length === 0) { alert("Nenhum relatório encontrado com esses filtros!"); return; }

    let texto = `=== RELATÓRIOS DE ATENDIMENTO ===\n`;
    if (pdfDataInicio || pdfDataFim || pdfAtendente) {
      texto += `Filtros aplicados: `;
      if (pdfDataInicio) texto += `De ${formatarData(pdfDataInicio)} `;
      if (pdfDataFim) texto += `Ate ${formatarData(pdfDataFim)} `;
      if (pdfAtendente) texto += `| Atendente: ${pdfAtendente} `;
      texto += `\n`;
    }
    texto += `\n`;

    const relatoriosEmOrdem = [...dados].reverse();

    relatoriosEmOrdem.forEach((r, i) => {
      texto += `ATENDIMENTO #${i + 1} - Data do B.O: ${formatarData(r.data_atendimento || r.criado_em.split('T')[0])}\n`;
      texto += `Empresa:     ${r.empresa}\n`;
      texto += `Funcionário: ${r.funcionario || 'N/A'}\n`;
      texto += `Categoria:   ${r.categoria || 'N/A'}\n`;
      texto += `Status:      ${r.status || 'N/A'}\n`;
      texto += `Problema:    ${r.solit_prob}\n`;
      texto += `Resolução:   ${r.resolucao}\n`;
      if (r.obs) texto += `OBS:         ${r.obs}\n`;
      texto += `Equipe:      ${r.atendente_nome}\n`;
      texto += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); 
    link.download = `${gerarNomeArquivo()}.txt`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }

  const empresasUnicas = [...new Set(relatorios.map(r => r.empresa).filter(Boolean))];
  const funcionariosDaEmpresa = [...new Set(relatorios.filter(r => r.empresa === empresa).map(r => r.funcionario).filter(Boolean))];

  let relatoriosParaMostrar = relatorios.filter((r) => { const t = busca.toLowerCase(); return (r.empresa?.toLowerCase().includes(t) || r.funcionario?.toLowerCase().includes(t) || r.solit_prob?.toLowerCase().includes(t) || r.resolucao?.toLowerCase().includes(t) || r.categoria?.toLowerCase().includes(t)) })
  
  if (filtroDataTela) {
    relatoriosParaMostrar = relatoriosParaMostrar.filter(r => (r.data_atendimento || r.criado_em.split('T')[0]) === filtroDataTela);
  }

  const isBuscandoDataExata = filtroDataTela !== '';
  const relatoriosHoje = !isBuscandoDataExata ? relatoriosParaMostrar.filter(r => (r.data_atendimento || r.criado_em.split('T')[0]) === hojePadrao) : [];
  const relatoriosAntigos = !isBuscandoDataExata ? relatoriosParaMostrar.filter(r => (r.data_atendimento || r.criado_em.split('T')[0]) !== hojePadrao) : [];

  // === LÓGICA DE DADOS PARA OS GRÁFICOS DO DASHBOARD ===
  // 1. Contagem por Categoria
  const contagemCategorias = relatorios.reduce((acc, rel) => {
    const cat = rel.categoria || 'Outros';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const dadosGraficoCategoria = Object.keys(contagemCategorias).map(key => ({ nome: key, total: contagemCategorias[key] }));

  // 2. Contagem por Status
  const contagemStatus = relatorios.reduce((acc, rel) => {
    const stat = rel.status || 'Resolvido';
    acc[stat] = (acc[stat] || 0) + 1;
    return acc;
  }, {});
  const dadosGraficoStatus = Object.keys(contagemStatus).map(key => ({ name: key, value: contagemStatus[key] }));
  
  // 3. Contagem por Empresa (TOP 5 que dão mais trabalho)
  const contagemEmpresas = relatorios.reduce((acc, rel) => {
    const emp = rel.empresa || 'Sem Nome';
    acc[emp] = (acc[emp] || 0) + 1;
    return acc;
  }, {});
  
  const dadosGraficoEmpresas = Object.keys(contagemEmpresas)
    .map(key => ({ nome: key, chamados: contagemEmpresas[key] }))
    .sort((a, b) => b.chamados - a.chamados)
    .slice(0, 5);

  const CORES_STATUS = {
    'Resolvido': '#10b981',
    'Andamento': '#eab308',
    'Aberto': '#ef4444'
  };

  // Paleta de cores vibrantes para o gráfico de categorias
  const CORES_CATEGORIAS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#14b8a6', '#64748b',
    '#f97316', '#06b6d4', '#84cc16', '#d946ef',
    '#0ea5e9', '#eab308'
  ];

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: tema.fundoMain, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif', transition: '0.3s' }}>
        <style>{`body { margin: 0; padding: 0; box-sizing: border-box; background-color: ${tema.fundoMain}; }`}</style>
        <div style={{ backgroundColor: tema.fundoCard, padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img 
              src={logoImg} 
              alt="Logo Globalnet" 
              style={{ 
                maxWidth: '180px', 
                maxHeight: '80px',
                filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.3s'
              }} 
            />
          </div>

          <h2 style={{ textAlign: 'center', color: tema.texto1, marginBottom: '30px', marginTop: 0 }}>Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder="Usuário" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box' }} />
            <input type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box' }} />
            <button type="submit" style={{ padding: '15px', backgroundColor: '#32b8f7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  const CartaoRelatorio = ({ relatorio }) => {
    let corStatusBg = '#e2e8f0'; let corStatusTxt = '#475569';
    if(relatorio.status === 'Resolvido') { corStatusBg = '#dcfce7'; corStatusTxt = '#166534'; }
    if(relatorio.status === 'Andamento') { corStatusBg = '#fef08a'; corStatusTxt = '#854d0e'; }
    if(relatorio.status === 'Aberto') { corStatusBg = '#fee2e2'; corStatusTxt = '#991b1b'; }

    return (
      <div style={{ border: `1px solid ${tema.borda}`, padding: '20px', borderRadius: '10px', backgroundColor: tema.fundoCard, position: 'relative', transition: '0.3s' }}>
        <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
          <button onClick={() => iniciarEdicao(relatorio)} style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Editar">✏️</button>
          <button onClick={() => apagarRelatorio(relatorio.id)} style={{ backgroundColor: '#fed7d7', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Excluir">🗑️</button>
        </div>
        
        <h3 style={{ margin: '0 0 10px 0', color: '#32b8f7', fontSize: '18px', paddingRight: '70px' }}>{relatorio.empresa} {relatorio.funcionario && <span style={{ color: tema.texto2, fontSize: '14px' }}>- {relatorio.funcionario}</span>}</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', color: tema.texto2, padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>📂 {relatorio.categoria || 'Outros'}</span>
          <span style={{ fontSize: '12px', backgroundColor: corStatusBg, color: corStatusTxt, padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{relatorio.status === 'Resolvido' ? '🟢' : relatorio.status === 'Andamento' ? '🟡' : '🔴'} {relatorio.status || 'Resolvido'}</span>
          <span style={{ fontSize: '12px', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>📅 {formatarData(relatorio.data_atendimento || relatorio.criado_em.split('T')[0])}</span>
        </div>

        <p style={{ margin: '5px 0', fontSize: '14px', color: tema.texto1 }}><strong>PROB:</strong> {relatorio.solit_prob}</p>
        <p style={{ margin: '5px 0', fontSize: '14px', color: tema.texto1 }}><strong>RES:</strong> {relatorio.resolucao}</p>
        {relatorio.obs && <p style={{ margin: '5px 0', fontSize: '14px', color: tema.texto1 }}><strong>OBS:</strong> {relatorio.obs}</p>}
        
        <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: `1px solid ${tema.borda}`, fontSize: '0.8em', color: tema.texto2 }}>Equipe: <span style={{fontWeight: 'bold'}}>{relatorio.atendente_nome}</span> | Lançado no sistema em: {new Date(relatorio.criado_em).toLocaleString('pt-BR')}</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tema.fundoMain, padding: '20px', fontFamily: 'Arial, sans-serif', transition: '0.3s' }}>
      <style>{`body { margin: 0; padding: 0; box-sizing: border-box; background-color: ${tema.fundoMain}; }`}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: tema.fundoCard, padding: '15px 20px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              <img 
                src={logoImg} 
                alt="Logo Globalnet" 
                style={{ 
                  height: '40px', 
                  marginRight: '15px',
                  filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s'
                }} 
              />
              <h2 style={{ margin: 0, color: tema.texto1, display: 'none' }}>Suporte de T.i.</h2> 
            </div>
            
            <button onClick={() => { setAbaAtiva('novo'); limparFormulario(); }} style={{ padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: abaAtiva === 'novo' ? '#32b8f7' : (isDarkMode ? '#334155' : '#e2e8f0'), color: abaAtiva === 'novo' ? '#fff' : tema.texto1 }}>Atendimento</button>
            <button onClick={() => setAbaAtiva('historico')} style={{ padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: abaAtiva === 'historico' ? '#32b8f7' : (isDarkMode ? '#334155' : '#e2e8f0'), color: abaAtiva === 'historico' ? '#fff' : tema.texto1 }}>Histórico</button>
            {isStaff && (
              <button onClick={() => { setAbaAtiva('gestao'); limparFormularioUsuario(); }} style={{ padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: abaAtiva === 'gestao' ? '#10b981' : (isDarkMode ? '#334155' : '#e2e8f0'), color: abaAtiva === 'gestao' ? '#fff' : tema.texto1 }}>Administração</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '8px 12px', backgroundColor: isDarkMode ? '#fde047' : '#1e293b', color: isDarkMode ? '#854d0e' : '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }} title="Mudar Tema">{isDarkMode ? '☀️' : '🌙'}</button>
            <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Sair</button>
          </div>
        </div>

        {abaAtiva === 'novo' && (
           <div style={{ backgroundColor: editandoId ? (isDarkMode ? '#b45309' : '#d97706') : (isDarkMode ? '#1e293b' : '#475569'), padding: '30px', borderRadius: '10px', transition: '0.3s', border: `1px solid ${tema.borda}` }}>
           <h2 style={{ color: '#fff', marginTop: '0', marginBottom: '20px' }}>{editandoId ? '✏️ Editando Relatório' : 'Novo Atendimento'}</h2>
           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             
             <div style={{ backgroundColor: tema.inputBg, padding: '15px', borderRadius: '6px', border: `1px solid ${tema.borda}` }}>
                <label style={{ display: 'block', color: tema.texto2, fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
                  👥 Equipe no atendimento (Clique para marcar/desmarcar):
                </label>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {usuarios.map(user => {
                    const isSelected = atendentesSelecionados.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        type="button" 
                        onClick={() => handleToggleAtendente(user.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '20px',
                          border: isSelected ? 'none' : `1px solid ${tema.borda}`,
                          backgroundColor: isSelected ? '#32b8f7' : (isDarkMode ? '#1e293b' : '#f1f5f9'),
                          color: isSelected ? '#fff' : tema.texto1,
                          cursor: 'pointer',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          transition: 'all 0.2s',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {isSelected ? '✓' : ''} {user.username}
                      </button>
                    )
                  })}
                </div>
             </div>

             <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
               <div style={{ flex: 1, minWidth: '200px' }}>
                 <input list="lista-empresas" placeholder="🏢 Nome da Empresa" required value={empresa} onChange={(e) => setEmpresa(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1 }} />
                 <datalist id="lista-empresas">{empresasUnicas.map((emp, i) => <option key={i} value={emp} />)}</datalist>
               </div>
               <div style={{ flex: 1, minWidth: '200px' }}>
                 <input list="lista-funcionarios" placeholder="👤 Funcionário (Opcional)" value={funcionario} onChange={(e) => setFuncionario(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1 }} />
                 <datalist id="lista-funcionarios">{funcionariosDaEmpresa.map((func, i) => <option key={i} value={func} />)}</datalist>
               </div>
             </div>

             <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1 }}>
  {/* A BAZUCA PESADA */}
                    <option value="Hardware / Equipamento">🖥️ Hardware / Equipamento</option>
                    <option value="Sistema Operacional / Windows">💾 Sistema Operacional / Windows</option>
                    <option value="Rede Interna / Servidor">📡 Rede Interna / Servidor</option>
                    <option value="Internet / Wi-Fi">🌐 Internet / Wi-Fi</option>
                    
                    {/* SISTEMAS E SOFTWARES */}
                    <option value="Sistemas / ERP">⚙️ Sistemas / ERP</option>
                    <option value="Pacote Office / Softwares">📝 Pacote Office / Softwares</option>
                    
                    {/* COMUNICAÇÃO E ACESSOS */}
                    <option value="E-mail / Acessos">📧 E-mail / Acessos</option>
                    <option value="Acessos / Permissões / VPN">🔑 Acessos / Permissões / VPN</option>
                    <option value="Telefonia">📞 Telefonia</option>
                    <option value="Dispositivos Móveis / Celular">📱 Dispositivos Móveis / Celular</option>
                    
                    {/* SEGURANÇA E OUTROS EQUIPAMENTOS */}
                    <option value="Segurança / Antivírus">🛡️ Segurança / Antivírus</option>
                    <option value="Backup / Restauração">💾 Backup / Restauração</option>
                    <option value="Certificados Digitais">🔐 Certificados Digitais</option>
                    <option value="Controle de Ponto / Biometria">🕒 Controle de Ponto / Biometria</option>
                    <option value="CFTV / Câmeras">📹 CFTV / Câmeras</option>
                    
                    {/* PERIFÉRICOS E IMPRESSÃO */}
                    <option value="Impressora">🖨️ Impressora</option>
                    <option value="Periféricos (Mouse/Teclado/Fone)">🔌 Periféricos (Mouse/Teclado/Fone)</option>
                    
                    {/* GERAIS */}
                    <option value="Dúvida de Usuário">❓ Dúvida de Usuário</option>
                    <option value="Outros">🔧 Outros</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1 }}>
                    <option value="Resolvido">🟢 Resolvido</option>
                    <option value="Andamento">🟡 Em Andamento</option>
                    <option value="Aberto">🔴 Aberto (Pendente)</option>
                  </select>
                </div>
                
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <input type="date" required value={dataAtendimento} onChange={(e) => setDataAtendimento(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1 }} title="Data em que o serviço foi realizado" />
                </div>
             </div>

             <textarea placeholder="SOLIT/PROB" required value={solitProb} onChange={(e) => setSolitProb(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: 'none', minHeight: '80px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1 }} />
             <textarea placeholder="RESOLUÇÃO" required value={resolucao} onChange={(e) => setResolucao(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: 'none', minHeight: '80px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1 }} />
             <textarea placeholder="OBS (Opcional)" value={obs} onChange={(e) => setObs(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: 'none', minHeight: '50px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1 }} />
             
             <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
               <button type="submit" style={{ flex: 1, padding: '15px', backgroundColor: '#32b8f7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>{editandoId ? 'Salvar Alterações' : 'Salvar Atendimento'}</button>
               {editandoId && <button type="button" onClick={() => { limparFormulario(); setAbaAtiva('historico'); }} style={{ padding: '15px', backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Cancelar</button>}
             </div>
           </form>
         </div>
        )}

        {abaAtiva === 'historico' && (
          <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}><h2 style={{ color: tema.texto1, margin: 0 }}>Histórico</h2></div>
            
            <div style={{ backgroundColor: tema.fundoDestaque, padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}`, marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: tema.texto1 }}>📄 Exportar Relatórios</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block' }}>Data Inicial</label><input type="date" value={pdfDataInicio} onChange={e => setPdfDataInicio(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
                <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block' }}>Data Final</label><input type="date" value={pdfDataFim} onChange={e => setPdfDataFim(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
                <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block' }}>Atendente</label><input type="text" placeholder="Nome..." value={pdfAtendente} onChange={e => setPdfAtendente(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={gerarPDF} style={{ padding: '9px 15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>📥 Baixar PDF</button>
                  <button onClick={gerarTXT} style={{ padding: '9px 15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>📝 Baixar TXT</button>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="🔍 Buscar por empresa, funcionário, problema, categoria..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '12px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '16px', boxSizing: 'border-box' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: tema.inputBg, padding: '0 15px', borderRadius: '6px', border: `1px solid ${tema.borda}` }}>
                 <span style={{color: tema.texto2, fontSize: '14px', fontWeight: 'bold'}}>📅 Ver dia exato:</span>
                 <input type="date" value={filtroDataTela} onChange={(e) => setFiltroDataTela(e.target.value)} style={{ padding: '8px', border: 'none', backgroundColor: 'transparent', color: tema.texto1, outline: 'none', fontSize: '15px' }} />
                 {filtroDataTela && <button onClick={() => setFiltroDataTela('')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Limpar</button>}
              </div>
            </div>
            
            {isBuscandoDataExata ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '5px', marginBottom: '15px' }}>
                  <h3 style={{ color: tema.texto1, margin: 0 }}>📅 Resultados para {formatarData(filtroDataTela)}</h3>
                </div>
                {relatoriosParaMostrar.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', marginBottom: '40px' }}>Nenhum atendimento registrado nesta data.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>{relatoriosParaMostrar.map(relatorio => <CartaoRelatorio key={relatorio.id} relatorio={relatorio} />)}</div>}
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '5px', marginBottom: '15px' }}>
                  <h3 style={{ color: tema.texto1, margin: 0 }}>📅 Hoje ({formatarData(hojePadrao)})</h3>
                </div>

                {relatoriosHoje.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', marginBottom: '40px' }}>Nenhum atendimento registrado hoje.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>{relatoriosHoje.map(relatorio => <CartaoRelatorio key={relatorio.id} relatorio={relatorio} />)}</div>}
                
                <h3 style={{ borderBottom: `2px solid ${tema.borda}`, paddingBottom: '5px', color: tema.texto1, marginBottom: '15px' }}>🕰️ Últimos Atendimentos</h3>
                {relatoriosAntigos.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic' }}>Nenhum histórico antigo encontrado.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>{relatoriosAntigos.map(relatorio => <CartaoRelatorio key={relatorio.id} relatorio={relatorio} />)}</div>}
              </>
            )}
          </div>
        )}

        {abaAtiva === 'gestao' && (
          <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
            <h2 style={{ color: tema.texto1, margin: '0 0 20px 0' }}>⚙️ Dashboard de Gestão</h2>
            
            {/* === CARDS DE RESUMO === */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '8px', borderLeft: '5px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: tema.texto2 }}>Total Atendimentos</h4>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: tema.texto1 }}>{relatorios.length}</p>
              </div>
              <div style={{ flex: 1, minWidth: '150px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '8px', borderLeft: '5px solid #10b981' }}>
                <h4 style={{ margin: '0 0 10px 0', color: tema.texto2 }}>Atendimentos Hoje</h4>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: tema.texto1 }}>{relatoriosHoje.length}</p>
              </div>
              <div style={{ flex: 1, minWidth: '150px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '8px', borderLeft: '5px solid #8b5cf6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: tema.texto2 }}>Empresas Atendidas</h4>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: tema.texto1 }}>{empresasUnicas.length}</p>
              </div>
            </div>

            {/* === GRÁFICOS RECHARTS === */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
              
              {/* Gráfico 1: Status dos Atendimentos (Pizza) */}
              <div style={{ flex: 1, minWidth: '250px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, textAlign: 'center', fontSize: '16px' }}>📊 Status dos Chamados</h3>
                {relatorios.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={dadosGraficoStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                        {dadosGraficoStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_STATUS[entry.name] || '#3b82f6'} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1 }} itemStyle={{ color: tema.texto1 }} />
                      <Legend wrapperStyle={{ color: tema.texto1, fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p style={{ textAlign: 'center', color: tema.texto2 }}>Sem dados suficientes.</p>}
              </div>

              {/* Gráfico 2: Atendimentos por Categoria (Barras Verticais) */}
              <div style={{ flex: 1, minWidth: '250px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, textAlign: 'center', fontSize: '16px' }}>📈 Chamados por Categoria</h3>
                {relatorios.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dadosGraficoCategoria} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} vertical={false} />
                      <XAxis dataKey="nome" stroke={tema.graficoTexto} tick={{fontSize: 11}} />
                      <YAxis stroke={tema.graficoTexto} tick={{fontSize: 11}} allowDecimals={false} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1 }} />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={30}>
                        {dadosGraficoCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_CATEGORIAS[index % CORES_CATEGORIAS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p style={{ textAlign: 'center', color: tema.texto2 }}>Sem dados suficientes.</p>}
              </div>

              {/* Gráfico 3: Clientes Que Mais Dão Trabalho (Barras Horizontais) */}
              <div style={{ flex: 1, minWidth: '350px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, textAlign: 'center', fontSize: '16px' }}>🏆 Top 5 Clientes Ofensores</h3>
                {relatorios.length > 0 && dadosGraficoEmpresas.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart layout="vertical" data={dadosGraficoEmpresas} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} horizontal={false} />
                      <XAxis type="number" stroke={tema.graficoTexto} tick={{fontSize: 11}} allowDecimals={false} />
                      <YAxis type="category" dataKey="nome" stroke={tema.graficoTexto} tick={{fontSize: 11}} width={100} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1 }} />
                      <Bar dataKey="chamados" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p style={{ textAlign: 'center', color: tema.texto2 }}>Sem dados suficientes.</p>}
              </div>

            </div>

            {/* === GESTÃO DE USUÁRIOS E EQUIPE === */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', backgroundColor: editandoUsuarioId ? (isDarkMode ? '#713f12' : '#fef3c7') : tema.fundoDestaque, padding: '20px', borderRadius: '8px', border: `1px solid ${tema.borda}`, transition: '0.3s' }}>
                <h3 style={{ margin: '0 0 15px 0', color: tema.texto1 }}>{editandoUsuarioId ? '✏️ Editando Atendente' : '👤 Novo Atendente'}</h3>
                <form onSubmit={handleSalvarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input type="text" placeholder="Nome de Usuário" required value={novoUsername} onChange={e => setNovoUsername(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} />
                  <input type="password" placeholder={editandoUsuarioId ? "Nova Senha (vazio=manter)" : "Senha"} required={!editandoUsuarioId} value={novaSenha} onChange={e => setNovaSenha(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: tema.texto1, cursor: 'pointer' }}>
                      <input type="checkbox" checked={novoIsStaff} onChange={e => setNovoIsStaff(e.target.checked)} style={{ width: '18px', height: '18px' }} /> Permissão de Chefe
                    </label>
                    {editandoUsuarioId && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: novoIsActive ? '#10b981' : '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={novoIsActive} onChange={e => setNovoIsActive(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                        {novoIsActive ? 'Conta Ativa (Loga)' : 'Conta Bloqueada (Não loga)'}
                      </label>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: editandoUsuarioId ? '#d97706' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>{editandoUsuarioId ? 'Salvar Edição' : 'Cadastrar'}</button>
                    {editandoUsuarioId && <button type="button" onClick={limparFormularioUsuario} style={{ padding: '12px', backgroundColor: isDarkMode ? '#475569' : '#e2e8f0', color: tema.texto1, border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>}
                  </div>
                </form>
              </div>

              <div style={{ flex: 1, minWidth: '250px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 15px 0', color: tema.texto1 }}>📋 Equipe Cadastrada</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                  {usuarios.map(user => (
                    <div key={user.id} style={{ padding: '12px', backgroundColor: tema.fundoCard, border: `1px solid ${tema.borda}`, borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: tema.texto1, display: 'block' }}>{user.username}</span>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                          {user.is_staff && <span style={{ fontSize: '10px', backgroundColor: '#fef08a', color: '#854d0e', padding: '2px 6px', borderRadius: '12px', fontWeight: 'bold' }}>Chefe</span>}
                          {user.is_active ? <span style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '12px', fontWeight: 'bold' }}>Ativo</span> : <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: '12px', fontWeight: 'bold' }}>Inativo</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => iniciarEdicaoUsuario(user)} style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✏️</button>
                        <button onClick={() => apagarUsuario(user.id)} style={{ backgroundColor: '#fed7d7', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App
//mg 0.0