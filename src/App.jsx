import { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Toaster, toast } from 'sonner'
import { useAutoAnimate } from '@formkit/auto-animate/react'

// COMPONENTES DA ESTRUTURA
import MenuSuperior from './components/MenuSuperior'
import Login from './pages/Login'
import NovoAtendimento from './pages/NovoAtendimento'
import RadarTickets from './pages/RadarTickets'
import Historico from './pages/Historico'
import DashboardGestao from './pages/DashboardGestao'
import MinhasRotinas from './pages/MinhasRotinas' // === NOVO COMPONENTE ===

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

  const [isTicket, setIsTicket] = useState(false)
  const [filtroTicket, setFiltroTicket] = useState('pendentes')

  const dataLocal = new Date();
  const hojePadrao = `${dataLocal.getFullYear()}-${String(dataLocal.getMonth() + 1).padStart(2, '0')}-${String(dataLocal.getDate()).padStart(2, '0')}`;

  const [dataAtendimento, setDataAtendimento] = useState(hojePadrao)
  const [atendentesSelecionados, setAtendentesSelecionados] = useState([])
  const [solitProb, setSolitProb] = useState('')
  const [resolucao, setResolucao] = useState('')
  const [obs, setObs] = useState('')

  const [busca, setBusca] = useState('')
  const [filtroDataTela, setFiltroDataTela] = useState('')
  const [filtroCategoriaHist, setFiltroCategoriaHist] = useState('')
  const [filtroStatusHist, setFiltroStatusHist] = useState('')
  const [filtroAtendenteHist, setFiltroAtendenteHist] = useState('')

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

  const [isLoading, setIsLoading] = useState(true)
  const [animationParent] = useAutoAnimate()

  // === NOVOS ESTADOS PARA ROTINAS ===
  const [tarefas, setTarefas] = useState([])
  const [notificacoesPendentes, setNotificacoesPendentes] = useState(0)

  useEffect(() => {
    localStorage.setItem('temaEscuro', isDarkMode)
  }, [isDarkMode])

  // === NOVA PALETA DE CORES PREMIUM ===
  const tema = {
    fundoMain: isDarkMode ? '#09090b' : '#f1f5f9', // Deep black super elegante
    fundoCard: isDarkMode ? '#1e293b' : '#ffffff',
    texto1: isDarkMode ? '#f8fafc' : '#0f172a',
    texto2: isDarkMode ? '#94a3b8' : '#64748b',
    borda: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)', // Borda super sutil
    inputBg: isDarkMode ? '#0f172a' : '#f8fafc',
    fundoDestaque: isDarkMode ? '#0f172a' : '#f8fafc',
    graficoTexto: isDarkMode ? '#cbd5e1' : '#475569',
    gradientePrimary: 'linear-gradient(to right, #32b8f7, #2563eb)' // Gradiente da marca
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const toastId = toast.loading('Acessando o sistema...')
    axios.post('https://api-ti-relatorios.onrender.com/api/token/', { username, password })
      .then(response => {
        const accessToken = response.data.access
        const decoded = jwtDecode(accessToken)
        setToken(accessToken); setAtendenteId(decoded.user_id); setIsStaff(decoded.is_staff);
        localStorage.setItem('token', accessToken); localStorage.setItem('atendenteId', decoded.user_id); localStorage.setItem('isStaff', decoded.is_staff);
        setUsername(''); setPassword('');
        setAtendentesSelecionados([decoded.user_id]);
        if (decoded.is_staff) setAbaAtiva('gestao')
        toast.success('Bem-vindo(a)!', { id: toastId })
      })
      .catch(error => toast.error("Usuário ou senha incorretos!", { id: toastId }))
  }

  const handleLogout = () => {
    setToken(''); setAtendenteId(null); setIsStaff(false); setAtendentesSelecionados([]);
    localStorage.removeItem('token'); localStorage.removeItem('atendenteId'); localStorage.removeItem('isStaff');
    setAbaAtiva('novo')
    toast.info("Você saiu do sistema.")
  }

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      axios.get('https://api-ti-relatorios.onrender.com/api/relatorios/', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          const dados = response.data.results ? response.data.results : response.data;
          setRelatorios(dados);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
          setIsLoading(false);
        })

      buscarUsuarios()
      buscarTarefas() // === BUSCA TAREFAS NO LOGIN ===

      if (atendenteId && atendentesSelecionados.length === 0 && !editandoId) {
        setAtendentesSelecionados([parseInt(atendenteId)]);
      }
    }
  }, [token, atendenteId])

  // === FUNÇÕES DO MÓDULO DE ROTINAS ===
  const buscarTarefas = (usuarioIdFiltro = null) => {
    let url = 'https://api-ti-relatorios.onrender.com/api/tarefas/';
    if (usuarioIdFiltro) url += `?usuario_id=${usuarioIdFiltro}`;

    axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setTarefas(response.data);
        const hoje = new Date().toISOString().split('T')[0];
        const urgentes = response.data.filter(t => !t.concluida && t.data_vencimento && t.data_vencimento <= hoje);
        setNotificacoesPendentes(urgentes.length);
      })
      .catch(err => console.error("Erro ao buscar tarefas", err));
  };

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
        .then(response => { toast.success("Usuário atualizado com sucesso!"); limparFormularioUsuario(); buscarUsuarios(); })
        .catch(error => toast.error("Erro ao atualizar usuário."))
    } else {
      if (!novaSenha) { toast.warning("Senha é obrigatória!"); return; }
      axios.post('https://api-ti-relatorios.onrender.com/api/usuarios/', payload, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => { toast.success("Atendente criado com sucesso!"); limparFormularioUsuario(); buscarUsuarios(); })
        .catch(error => toast.error("Erro! Verifique se esse nome já não existe."))
    }
  }

  const iniciarEdicaoUsuario = (user) => { setEditandoUsuarioId(user.id); setNovoUsername(user.username); setNovaSenha(''); setNovoIsStaff(user.is_staff); setNovoIsActive(user.is_active); }

  const apagarUsuario = (id) => {
    if (id === parseInt(atendenteId)) { toast.warning("Você não pode apagar a si mesmo!"); return; }

    toast('Atenção: Apagar Conta', {
      description: 'Isso apagará a conta e TODOS os relatórios vinculados. Tem certeza?',
      action: {
        label: 'Sim, Apagar Tudo',
        onClick: () => {
          axios.delete(`https://api-ti-relatorios.onrender.com/api/usuarios/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => { toast.success("Conta e relatórios apagados."); buscarUsuarios(); })
            .catch(error => toast.error("Erro ao apagar usuário."))
        }
      },
      cancel: { label: 'Cancelar' },
      duration: 8000,
    });
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
    if (atendentesSelecionados.length === 0) { toast.warning("Selecione pelo menos um atendente!"); return; }

    const dadosRelatorio = { empresa, funcionario, categoria, status, is_ticket: isTicket, data_atendimento: dataAtendimento, solit_prob: solitProb, resolucao, obs, atendentes: atendentesSelecionados }
    const toastId = toast.loading('Salvando...')

    if (editandoId) {
      axios.put(`https://api-ti-relatorios.onrender.com/api/relatorios/${editandoId}/`, dadosRelatorio, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => { setRelatorios(relatorios.map(r => r.id === editandoId ? response.data : r)); limparFormulario(); toast.success("Atualizado com sucesso!", { id: toastId }); setAbaAtiva('historico'); })
        .catch(error => toast.error("Erro ao atualizar.", { id: toastId }))
    } else {
      axios.post('https://api-ti-relatorios.onrender.com/api/relatorios/', dadosRelatorio, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => { setRelatorios([response.data, ...relatorios]); limparFormulario(); toast.success("Atendimento salvo!", { id: toastId }); })
        .catch(error => toast.error("Erro ao salvar atendimento.", { id: toastId }))
    }
  }

  const iniciarEdicao = (relatorio) => {
    setEditandoId(relatorio.id); setEmpresa(relatorio.empresa); setFuncionario(relatorio.funcionario || '');
    setCategoria(relatorio.categoria || 'Outros'); setStatus(relatorio.status || 'Resolvido');

    const dataParaEditar = relatorio.data_atendimento || relatorio.criado_em.split('T')[0];
    setDataAtendimento(dataParaEditar);

    setIsTicket(relatorio.is_ticket || false);
    setAtendentesSelecionados(relatorio.atendentes || []);
    setSolitProb(relatorio.solit_prob); setResolucao(relatorio.resolucao); setObs(relatorio.obs || ''); setAbaAtiva('novo');
  }

  const apagarRelatorio = (id) => {
    toast('Excluir Relatório', {
      description: 'Tem certeza que deseja apagar este atendimento definitivamente?',
      action: {
        label: 'Sim, Excluir',
        onClick: () => {
          axios.delete(`https://api-ti-relatorios.onrender.com/api/relatorios/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => { setRelatorios(relatorios.filter(r => r.id !== id)); toast.success("Relatório excluído."); })
            .catch(() => toast.error("Erro ao apagar."))
        }
      },
      cancel: { label: 'Cancelar' },
      duration: 8000,
    });
  }

  const limparFormulario = () => {
    setEditandoId(null); setEmpresa(''); setFuncionario(''); setCategoria('Outros'); setStatus('Resolvido');
    setIsTicket(false); setDataAtendimento(hojePadrao); setSolitProb(''); setResolucao(''); setObs('');
    setAtendentesSelecionados(atendenteId ? [parseInt(atendenteId)] : []);
  }

  const adicionarAnotacao = (relatorioId, texto) => {
    if (!texto.trim()) return;
    const toastId = toast.loading('Salvando work note...');
    
    axios.post('https://api-ti-relatorios.onrender.com/api/anotacoes/', 
      { relatorio: relatorioId, texto: texto }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      setRelatorios(relatorios.map(r => {
        if (r.id === relatorioId) {
          return { ...r, anotacoes: [...(r.anotacoes || []), response.data] };
        }
        return r;
      }));
      toast.success("Anotação registrada com sucesso!", { id: toastId });
    })
    .catch(error => toast.error("Erro ao salvar anotação.", { id: toastId }));
  }

  // === NOVA FUNÇÃO: MOVER TICKET (DRAG AND DROP) ===
  const moverTicket = (id, novoStatus) => {
    // 1. Atualização Otimista: Muda na tela na mesma hora, para ficar super fluido!
    setRelatorios(relatorios.map(r => r.id === id ? { ...r, status: novoStatus } : r));

    // 2. Avisa o banco de dados em background usando PATCH (atualiza só o campo de status)
    axios.patch(`https://api-ti-relatorios.onrender.com/api/relatorios/${id}/`, 
      { status: novoStatus }, 
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      toast.success(`Ticket atualizado para: ${novoStatus}`);
    }).catch(error => {
      toast.error("Erro ao mover o ticket. Ele voltará à posição original.");
      buscarTarefas(); // Em caso de erro real no servidor, refaz a busca
    });
  }

  const limparFiltrosHistorico = () => {
    setBusca(''); setFiltroDataTela(''); setFiltroCategoriaHist(''); setFiltroStatusHist(''); setFiltroAtendenteHist('');
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
    if (pdfDataInicio && pdfDataFim && pdfDataInicio !== pdfDataFim) { dataStr = `${formatarData(pdfDataInicio).replace(/\//g, '-')} a ${formatarData(pdfDataFim).replace(/\//g, '-')}`; }
    else if (pdfDataInicio) { dataStr = formatarData(pdfDataInicio).replace(/\//g, '-'); }
    else if (pdfDataFim) { dataStr = formatarData(pdfDataFim).replace(/\//g, '-'); }
    else { dataStr = formatarData(hojePadrao).replace(/\//g, '-'); }
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
    if (dados.length === 0) { toast.warning("Nenhum relatório encontrado!"); return; }
    const doc = new jsPDF('landscape')
    doc.setFontSize(18); doc.text("Relatório Geral de Atendimentos - T.I.", 14, 22)
    doc.setFontSize(10); doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30)
    const colunas = ["Data do B.O", "Empresa", "Func.", "Categ.", "Status", "Problema", "Equipe"]
    const linhas = dados.map(r => [formatarData(r.data_atendimento || r.criado_em.split('T')[0]), r.empresa, r.funcionario || '-', r.categoria || '-', r.status || '-', r.solit_prob, r.atendente_nome])
    autoTable(doc, { head: [colunas], body: linhas, startY: 35, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [50, 184, 247] }, columnStyles: { 5: { cellWidth: 80 } } })
    doc.save(`${gerarNomeArquivo()}.pdf`); toast.success("PDF baixado!")
  }

  const gerarTXT = () => {
    const dados = filtrarDadosParaExportacao()
    if (dados.length === 0) { toast.warning("Nenhum relatório encontrado!"); return; }
    let texto = `=== RELATÓRIOS DE ATENDIMENTO ===\n\n`;
    [...dados].reverse().forEach((r, i) => {
      texto += `ATENDIMENTO #${i + 1} - Data do B.O: ${formatarData(r.data_atendimento || r.criado_em.split('T')[0])}\nEmpresa: ${r.empresa}\nCategoria: ${r.categoria}\nStatus: ${r.status}\nProblema: ${r.solit_prob}\nResolução: ${r.resolucao}\nEquipe: ${r.atendente_nome}\n--------------------------------------------------\n\n`;
    });
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = `${gerarNomeArquivo()}.txt`; link.click(); toast.success("Arquivo TXT baixado!")
  }

  const gerarCSV = () => {
    const dados = filtrarDadosParaExportacao();
    if (dados.length === 0) { toast.warning("Nenhum relatório encontrado!"); return; }
    let csvContent = "Data,Empresa,Funcionário,Categoria,Status,Ticket,Problema,Resolução,Observações,Equipe\n";
    [...dados].reverse().forEach(r => {
      const data = formatarData(r.data_atendimento || r.criado_em.split('T')[0]);
      const emp = `"${(r.empresa || '').replace(/"/g, '""')}"`;
      const func = `"${(r.funcionario || '').replace(/"/g, '""')}"`;
      const cat = `"${(r.categoria || '').replace(/"/g, '""')}"`;
      const status = `"${(r.status || '').replace(/"/g, '""')}"`;
      const ticket = r.is_ticket ? (r.numero_ticket ? `"#${r.numero_ticket}"` : '"Sim"') : '""';
      const prob = `"${(r.solit_prob || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const res = `"${(r.resolucao || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const obs = `"${(r.obs || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const equipe = `"${(r.atendente_nome || '').replace(/"/g, '""')}"`;
      csvContent += `${data},${emp},${func},${cat},${status},${ticket},${prob},${res},${obs},${equipe}\n`;
    });
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob);
    link.download = `${gerarNomeArquivo()}.csv`; link.click(); toast.success("Planilha exportada com sucesso!");
  }

  const empresasUnicas = [...new Set(relatorios.map(r => r.empresa).filter(Boolean))];
  const funcionariosDaEmpresa = [...new Set(relatorios.filter(r => r.empresa === empresa).map(r => r.funcionario).filter(Boolean))];

  const isFiltrando = busca !== '' || filtroDataTela !== '' || filtroCategoriaHist !== '' || filtroStatusHist !== '' || filtroAtendenteHist !== '';
  const relatoriosFiltradosHist = relatorios.filter((r) => {
    const tBusca = busca.toLowerCase();
    const matchBusca = busca === '' || (r.empresa?.toLowerCase().includes(tBusca) || r.solit_prob?.toLowerCase().includes(tBusca) || r.resolucao?.toLowerCase().includes(tBusca) || r.funcionario?.toLowerCase().includes(tBusca));
    const matchData = filtroDataTela === '' || (r.data_atendimento || r.criado_em.split('T')[0]) === filtroDataTela;
    const matchCategoria = filtroCategoriaHist === '' || r.categoria === filtroCategoriaHist;
    const matchStatus = filtroStatusHist === '' || r.status === filtroStatusHist;
    const matchAtendente = filtroAtendenteHist === '' || r.atendente_nome?.toLowerCase().includes(filtroAtendenteHist.toLowerCase());
    return matchBusca && matchData && matchCategoria && matchStatus && matchAtendente;
  });

  const relatoriosHoje = relatoriosFiltradosHist.filter(r => (r.data_atendimento || r.criado_em.split('T')[0]) === hojePadrao);
  const relatoriosAntigos = relatoriosFiltradosHist.filter(r => (r.data_atendimento || r.criado_em.split('T')[0]) !== hojePadrao);

  const contagemCategorias = relatorios.reduce((acc, rel) => { const cat = rel.categoria || 'Outros'; acc[cat] = (acc[cat] || 0) + 1; return acc; }, {});
  const dadosGraficoCategoria = Object.keys(contagemCategorias).map(key => ({ nome: key, total: contagemCategorias[key] }));
  const contagemStatus = relatorios.reduce((acc, rel) => { const stat = rel.status || 'Resolvido'; acc[stat] = (acc[stat] || 0) + 1; return acc; }, {});
  const dadosGraficoStatus = Object.keys(contagemStatus).map(key => ({ name: key, value: contagemStatus[key] }));
  const contagemEmpresas = relatorios.reduce((acc, rel) => { const emp = rel.empresa || 'Sem Nome'; acc[emp] = (acc[emp] || 0) + 1; return acc; }, {});
  const dadosGraficoEmpresas = Object.keys(contagemEmpresas).map(key => ({ nome: key, chamados: contagemEmpresas[key] })).sort((a, b) => b.chamados - a.chamados).slice(0, 5);

  const CORES_STATUS = { 'Resolvido': '#10b981', 'Andamento': '#eab308', 'Aberto': '#ef4444' };
  const CORES_CATEGORIAS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#f97316', '#06b6d4', '#84cc16', '#d946ef', '#0ea5e9', '#eab308'];

  if (!token) {
    return (
      <>
        <Toaster theme={isDarkMode ? 'dark' : 'light'} richColors position="bottom-center" duration={5000} expand={true} />
        <Login tema={tema} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
      </>
    )
  }

  return (
    <div className="main-wrapper" style={{ minHeight: '100vh', backgroundColor: tema.fundoMain, padding: '20px', transition: 'background-color 0.5s ease' }}>
      <Toaster theme={isDarkMode ? 'dark' : 'light'} richColors position="top-center" offset="80px" duration={5000} expand={true} />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; box-sizing: border-box; background-color: ${tema.fundoMain}; font-family: 'Inter', sans-serif; }
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDarkMode ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? '#475569' : '#94a3b8'}; }
        input:focus, select:focus, textarea:focus { outline: none !important; border-color: #32b8f7 !important; box-shadow: 0 0 0 3px rgba(50, 184, 247, 0.25) !important; }
        @keyframes ping { 75%, 100% { transform: scale(2.5); opacity: 0; } }
        .animate-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        /* === CLASSES PREMIUM GLOBAIS === */
        .glass-panel {
          background: ${isDarkMode ? 'rgba(30, 41, 59, 0.65)' : 'rgba(255, 255, 255, 0.7)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${tema.borda};
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        
        .btn-premium {
          transition: all 0.3s ease;
        }
        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(50, 184, 247, 0.3);
        }

        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .main-wrapper { padding: 10px !important; }
          .menu-container { padding: 10px !important; border-radius: 8px !important; }
          .logo-mobile { height: 28px !important; margin-right: 5px !important; }
          .menu-container button { padding: 10px !important; }
        }
      `}</style>

      <div style={{ maxWidth: (abaAtiva === 'tickets' || abaAtiva === 'gestao' || abaAtiva === 'rotinas') ? '98%' : '1000px', margin: '0 auto', transition: 'max-width 0.4s ease' }}>
        
        <MenuSuperior 
          tema={tema} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} 
          abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} isStaff={isStaff} 
          limparFormularioUsuario={limparFormularioUsuario} handleLogout={handleLogout} 
          notificacoesPendentes={notificacoesPendentes} 
        />

        {abaAtiva === 'novo' && (
          <NovoAtendimento 
            tema={tema} isDarkMode={isDarkMode} editandoId={editandoId} handleSubmit={handleSubmit} usuarios={usuarios} 
            atendentesSelecionados={atendentesSelecionados} handleToggleAtendente={handleToggleAtendente} empresa={empresa} 
            setEmpresa={setEmpresa} empresasUnicas={empresasUnicas} funcionario={funcionario} setFuncionario={setFuncionario} 
            funcionariosDaEmpresa={funcionariosDaEmpresa} categoria={categoria} setCategoria={setCategoria} status={status} 
            setStatus={setStatus} dataAtendimento={dataAtendimento} setDataAtendimento={setDataAtendimento} isTicket={isTicket} 
            setIsTicket={setIsTicket} solitProb={solitProb} setSolitProb={setSolitProb} resolucao={resolucao} 
            setResolucao={setResolucao} obs={obs} setObs={setObs} limparFormulario={limparFormulario} setAbaAtiva={setAbaAtiva}
          />
        )}

        {abaAtiva === 'tickets' && (
          <RadarTickets 
            tema={tema} isDarkMode={isDarkMode} filtroTicket={filtroTicket} setFiltroTicket={setFiltroTicket} 
            animationParent={animationParent} isLoading={isLoading} relatorios={relatorios} formatarData={formatarData} 
            iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio}
            adicionarAnotacao={adicionarAnotacao}
            moverTicket={moverTicket} 
          />
        )}

        {abaAtiva === 'historico' && (
          <Historico 
            tema={tema} isDarkMode={isDarkMode} busca={busca} setBusca={setBusca} filtroDataTela={filtroDataTela} 
            setFiltroDataTela={setFiltroDataTela} filtroStatusHist={filtroStatusHist} setFiltroStatusHist={setFiltroStatusHist} 
            filtroCategoriaHist={filtroCategoriaHist} setFiltroCategoriaHist={setFiltroCategoriaHist} isFiltrando={isFiltrando} 
            limparFiltrosHistorico={limparFiltrosHistorico} pdfDataInicio={pdfDataInicio} setPdfDataInicio={setPdfDataInicio} 
            pdfDataFim={pdfDataFim} setPdfDataFim={setPdfDataFim} pdfAtendente={pdfAtendente} setPdfAtendente={setPdfAtendente} 
            gerarPDF={gerarPDF} gerarTXT={gerarTXT} gerarCSV={gerarCSV} animationParent={animationParent} isLoading={isLoading} 
            relatoriosFiltradosHist={relatoriosFiltradosHist} relatoriosHoje={relatoriosHoje} relatoriosAntigos={relatoriosAntigos} 
            formatarData={formatarData} hojePadrao={hojePadrao} iniciarEdicao={iniciarEdicao} apagarRelatorio={apagarRelatorio} 
            adicionarAnotacao={adicionarAnotacao}
          />
        )}

        {/* === ABA DE ROTINAS RENDERIZADA === */}
        {abaAtiva === 'rotinas' && (
          <MinhasRotinas 
            tema={tema} isDarkMode={isDarkMode} token={token} 
            tarefas={tarefas} buscarTarefas={buscarTarefas} 
            isStaff={isStaff} usuarios={usuarios} 
          />
        )}

        {abaAtiva === 'gestao' && (
          <DashboardGestao 
            tema={tema} isDarkMode={isDarkMode} relatorios={relatorios} relatoriosHoje={relatoriosHoje} 
            empresasUnicas={empresasUnicas} dadosGraficoStatus={dadosGraficoStatus} dadosGraficoCategoria={dadosGraficoCategoria} 
            dadosGraficoEmpresas={dadosGraficoEmpresas} CORES_STATUS={CORES_STATUS} CORES_CATEGORIAS={CORES_CATEGORIAS} 
            editandoUsuarioId={editandoUsuarioId} handleSalvarUsuario={handleSalvarUsuario} novoUsername={novoUsername} 
            setNovoUsername={setNovoUsername} novaSenha={novaSenha} setNovaSenha={setNovaSenha} novoIsStaff={novoIsStaff} 
            setNovoIsStaff={setNovoIsStaff} novoIsActive={novoIsActive} setNovoIsActive={setNovoIsActive} 
            limparFormularioUsuario={limparFormularioUsuario} animationParent={animationParent} usuarios={usuarios} 
            iniciarEdicaoUsuario={iniciarEdicaoUsuario} apagarUsuario={apagarUsuario}
          />
        )}
      </div>
    </div>
  )
}

export default App