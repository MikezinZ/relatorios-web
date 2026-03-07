import { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import { Toaster, toast } from 'sonner'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import logoImg from './assets/logo_Globalnet.png'

// === A NOVA BIBLIOTECA DE ÍCONES ===
import { 
  Monitor, LayoutGrid, Network, Wifi, Settings, FileText, Mail, Key, 
  Phone, Smartphone, Shield, HardDrive, Lock, Clock, Video, Printer, 
  Mouse, HelpCircle, Wrench, Edit, Trash2, LogOut, Sun, Moon, Ticket, 
  CheckCircle2, AlertCircle, Clock3, Search, Calendar, FileDown, Check, Users
} from 'lucide-react'

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

  const [animationParent] = useAutoAnimate()

  useEffect(() => {
    localStorage.setItem('temaEscuro', isDarkMode)
  }, [isDarkMode])

  const tema = {
    fundoMain: isDarkMode ? '#0f172a' : '#eef2f5',
    fundoCard: isDarkMode ? '#1e293b' : '#ffffff',
    texto1: isDarkMode ? '#f8fafc' : '#333333',
    texto2: isDarkMode ? '#94a3b8' : '#64748b',
    borda: isDarkMode ? '#334155' : '#e2e8f0',
    inputBg: isDarkMode ? '#0f172a' : '#ffffff',
    fundoDestaque: isDarkMode ? '#334155' : '#f8fafc',
    graficoTexto: isDarkMode ? '#cbd5e1' : '#475569'
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
      if(decoded.is_staff) setAbaAtiva('gestao')
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
      .then(response => { toast.success("Usuário atualizado com sucesso!"); limparFormularioUsuario(); buscarUsuarios(); })
      .catch(error => toast.error("Erro ao atualizar usuário."))
    } else {
      if (!novaSenha) { toast.warning("Senha é obrigatória para criar um usuário novo!"); return; }
      axios.post('https://api-ti-relatorios.onrender.com/api/usuarios/', payload, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => { toast.success("Atendente criado com sucesso!"); limparFormularioUsuario(); buscarUsuarios(); })
      .catch(error => toast.error("Erro! Verifique se esse nome já não existe no sistema."))
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
    if (atendentesSelecionados.length === 0) { toast.warning("Selecione pelo menos um atendente para este relatório!"); return; }

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
          .catch(() => toast.error("Erro ao apagar o relatório."))
        }
      },
      cancel: { label: 'Cancelar' },
      duration: 8000, 
    });
  }

  const limparFormulario = () => { 
    setEditandoId(null); setEmpresa(''); setFuncionario(''); setCategoria('Outros'); setStatus('Resolvido'); 
    setIsTicket(false); 
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
    if (dados.length === 0) { toast.warning("Nenhum relatório encontrado com esses filtros!"); return; }

    const doc = new jsPDF('landscape')
    doc.setFontSize(18); doc.text("Relatório Geral de Atendimentos - T.I.", 14, 22)
    doc.setFontSize(10); doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30)

    const colunas = ["Data do B.O", "Empresa", "Func.", "Categ.", "Status", "Problema", "Equipe"]
    const linhas = dados.map(r => [ formatarData(r.data_atendimento || r.criado_em.split('T')[0]), r.empresa, r.funcionario || '-', r.categoria || '-', r.status || '-', r.solit_prob, r.atendente_nome ])
    autoTable(doc, { head: [colunas], body: linhas, startY: 35, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [50, 184, 247] }, columnStyles: { 5: { cellWidth: 80 } } })
    
    doc.save(`${gerarNomeArquivo()}.pdf`)
    toast.success("PDF baixado!")
  }

  const gerarTXT = () => {
    const dados = filtrarDadosParaExportacao()
    if (dados.length === 0) { toast.warning("Nenhum relatório encontrado com esses filtros!"); return; }

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
    toast.success("Arquivo TXT baixado!")
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

  const contagemCategorias = relatorios.reduce((acc, rel) => { const cat = rel.categoria || 'Outros'; acc[cat] = (acc[cat] || 0) + 1; return acc; }, {});
  const dadosGraficoCategoria = Object.keys(contagemCategorias).map(key => ({ nome: key, total: contagemCategorias[key] }));
  const contagemStatus = relatorios.reduce((acc, rel) => { const stat = rel.status || 'Resolvido'; acc[stat] = (acc[stat] || 0) + 1; return acc; }, {});
  const dadosGraficoStatus = Object.keys(contagemStatus).map(key => ({ name: key, value: contagemStatus[key] }));
  const contagemEmpresas = relatorios.reduce((acc, rel) => { const emp = rel.empresa || 'Sem Nome'; acc[emp] = (acc[emp] || 0) + 1; return acc; }, {});
  const dadosGraficoEmpresas = Object.keys(contagemEmpresas).map(key => ({ nome: key, chamados: contagemEmpresas[key] })).sort((a, b) => b.chamados - a.chamados).slice(0, 5);

  const CORES_STATUS = { 'Resolvido': '#10b981', 'Andamento': '#eab308', 'Aberto': '#ef4444' };
  const CORES_CATEGORIAS = [ '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#f97316', '#06b6d4', '#84cc16', '#d946ef', '#0ea5e9', '#eab308' ];

  // === INTELIGÊNCIA DOS ÍCONES DAS CATEGORIAS ===
  const renderizarIconeCategoria = (catText) => {
    if (!catText) return <Wrench size={14} />;
    const texto = catText.toLowerCase();
    if (texto.includes('hardware')) return <Monitor size={14} />;
    if (texto.includes('operacional')) return <LayoutGrid size={14} />;
    if (texto.includes('rede')) return <Network size={14} />;
    if (texto.includes('internet')) return <Wifi size={14} />;
    if (texto.includes('sistemas')) return <Settings size={14} />;
    if (texto.includes('office')) return <FileText size={14} />;
    if (texto.includes('e-mail')) return <Mail size={14} />;
    if (texto.includes('acessos')) return <Key size={14} />;
    if (texto.includes('telefonia')) return <Phone size={14} />;
    if (texto.includes('celular')) return <Smartphone size={14} />;
    if (texto.includes('antivírus')) return <Shield size={14} />;
    if (texto.includes('backup')) return <HardDrive size={14} />;
    if (texto.includes('certificados')) return <Lock size={14} />;
    if (texto.includes('ponto')) return <Clock size={14} />;
    if (texto.includes('câmeras')) return <Video size={14} />;
    if (texto.includes('impressora')) return <Printer size={14} />;
    if (texto.includes('periféricos')) return <Mouse size={14} />;
    if (texto.includes('dúvida')) return <HelpCircle size={14} />;
    return <Wrench size={14} />;
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: tema.fundoMain, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' }}>
        {/* TOASTER LOGIN */}
        <Toaster theme={isDarkMode ? 'dark' : 'light'} richColors position="top-center" duration={5000} expand={true} />
        
        {/* CSS GLOBAL (Fonte, Scrollbar, Focus) */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { margin: 0; padding: 0; box-sizing: border-box; background-color: ${tema.fundoMain}; font-family: 'Inter', sans-serif; }
          * { font-family: 'Inter', sans-serif; }
          
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${isDarkMode ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? '#475569' : '#94a3b8'}; }

          input:focus, select:focus, textarea:focus {
            outline: none !important;
            border-color: #32b8f7 !important;
            box-shadow: 0 0 0 3px rgba(50, 184, 247, 0.25) !important;
          }
        `}</style>
        
        <div style={{ backgroundColor: tema.fundoCard, padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={logoImg} alt="Logo Globalnet" style={{ maxWidth: '180px', maxHeight: '80px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none', transition: 'filter 0.3s' }} />
          </div>
          <h2 style={{ textAlign: 'center', color: tema.texto1, marginBottom: '30px', marginTop: 0, fontWeight: '600' }}>Acesso ao Sistema</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: tema.texto2 }} />
              <input type="text" placeholder="Usuário" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box', transition: '0.2s' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: tema.texto2 }} />
              <input type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, boxSizing: 'border-box', transition: '0.2s' }} />
            </div>
            <button type="submit" style={{ padding: '15px', backgroundColor: '#32b8f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
              Entrar <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    )
  }

  const CartaoRelatorio = ({ relatorio }) => {
    let corStatusBg = '#e2e8f0'; let corStatusTxt = '#475569'; let IconeStatus = CheckCircle2;
    if(relatorio.status === 'Resolvido') { corStatusBg = '#dcfce7'; corStatusTxt = '#166534'; IconeStatus = CheckCircle2; }
    if(relatorio.status === 'Andamento') { corStatusBg = '#fef08a'; corStatusTxt = '#854d0e'; IconeStatus = Clock3; }
    if(relatorio.status === 'Aberto') { corStatusBg = '#fee2e2'; corStatusTxt = '#991b1b'; IconeStatus = AlertCircle; }

    return (
      <div style={{ border: relatorio.is_ticket && relatorio.status !== 'Resolvido' ? '2px solid #f43f5e' : `1px solid ${tema.borda}`, padding: '20px', borderRadius: '12px', backgroundColor: tema.fundoCard, position: 'relative', transition: '0.3s', marginTop: relatorio.is_ticket ? '12px' : '0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        
        {/* === ETIQUETA DO TICKET COM O EFEITO PULSANTE === */}
        {relatorio.is_ticket && (
          <span style={{ position: 'absolute', top: '-14px', left: '20px', backgroundColor: relatorio.status === 'Resolvido' ? '#10b981' : '#f43f5e', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '11px', border: `2px solid ${tema.fundoCard}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
            
            {relatorio.status !== 'Resolvido' && (
              <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.7 }}></span>
                <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: '#fff' }}></span>
              </span>
            )}
            <Ticket size={12} /> TICKET {relatorio.numero_ticket ? `#${relatorio.numero_ticket}` : ''} - {relatorio.status === 'Resolvido' ? 'FINALIZADO' : 'EM ABERTO'}
          </span>
        )}

        <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
          <button onClick={() => iniciarEdicao(relatorio)} style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }} title="Editar"><Edit size={16}/></button>
          <button onClick={() => apagarRelatorio(relatorio.id)} style={{ backgroundColor: '#fed7d7', color: '#991b1b', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }} title="Excluir"><Trash2 size={16}/></button>
        </div>
        
        <h3 style={{ margin: '0 0 12px 0', color: '#32b8f7', fontSize: '18px', paddingRight: '80px', paddingTop: relatorio.is_ticket ? '5px' : '0', fontWeight: '600' }}>{relatorio.empresa} {relatorio.funcionario && <span style={{ color: tema.texto2, fontSize: '14px', fontWeight: '400' }}>- {relatorio.funcionario}</span>}</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', color: tema.texto2, padding: '6px 10px', borderRadius: '6px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {renderizarIconeCategoria(relatorio.categoria)} {relatorio.categoria || 'Outros'}
          </span>
          <span style={{ fontSize: '12px', backgroundColor: corStatusBg, color: corStatusTxt, padding: '6px 10px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <IconeStatus size={14} /> {relatorio.status || 'Resolvido'}
          </span>
          <span style={{ fontSize: '12px', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, padding: '6px 10px', borderRadius: '6px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} /> {formatarData(relatorio.data_atendimento || relatorio.criado_em.split('T')[0])}
          </span>
        </div>

        <p style={{ margin: '8px 0', fontSize: '14px', color: tema.texto1, lineHeight: '1.5' }}><strong>PROBLEMA:</strong> {relatorio.solit_prob}</p>
        <p style={{ margin: '8px 0', fontSize: '14px', color: tema.texto1, lineHeight: '1.5' }}><strong>RESOLUÇÃO:</strong> {relatorio.resolucao}</p>
        {relatorio.obs && <p style={{ margin: '8px 0', fontSize: '14px', color: tema.texto2, lineHeight: '1.5', fontStyle: 'italic' }}><strong>OBS:</strong> {relatorio.obs}</p>}
        
        <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: `1px dashed ${tema.borda}`, fontSize: '12px', color: tema.texto2, display: 'flex', justifyContent: 'space-between' }}>
          <span>Equipe: <strong style={{color: tema.texto1}}>{relatorio.atendente_nome}</strong></span>
          <span>Lançado em: {new Date(relatorio.criado_em).toLocaleString('pt-BR')}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tema.fundoMain, padding: '20px', transition: 'background-color 0.3s' }}>
      
      <Toaster theme={isDarkMode ? 'dark' : 'light'} richColors position="top-center" duration={5000} expand={true} />
      
      {/* === CSS GLOBAL EMBUTIDO (Fonte, Scrollbar e Pulse) === */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; box-sizing: border-box; background-color: ${tema.fundoMain}; font-family: 'Inter', sans-serif; }
        * { font-family: 'Inter', sans-serif; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDarkMode ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? '#475569' : '#94a3b8'}; }

        input:focus, select:focus, textarea:focus {
          outline: none !important;
          border-color: #32b8f7 !important;
          box-shadow: 0 0 0 3px rgba(50, 184, 247, 0.25) !important;
        }

        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ 
          position: 'sticky', top: '10px', zIndex: 100,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', 
          backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          padding: '15px 20px', borderRadius: '12px', border: `1px solid ${tema.borda}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              <img src={logoImg} alt="Logo Globalnet" style={{ height: '40px', marginRight: '15px', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none', transition: 'filter 0.3s' }} />
            </div>
            
            <button onClick={() => { setAbaAtiva('novo'); limparFormulario(); }} style={{ padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'novo' ? '#32b8f7' : 'transparent', color: abaAtiva === 'novo' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Edit size={16}/> Atendimento
            </button>
            <button onClick={() => setAbaAtiva('historico')} style={{ padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'historico' ? '#32b8f7' : 'transparent', color: abaAtiva === 'historico' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={16}/> Histórico
            </button>
            <button onClick={() => setAbaAtiva('tickets')} style={{ padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'tickets' ? '#f43f5e' : 'transparent', color: abaAtiva === 'tickets' ? '#fff' : tema.texto1, display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}>
              <Ticket size={16}/> Tickets
            </button>

            {isStaff && (
              <button onClick={() => { setAbaAtiva('gestao'); limparFormularioUsuario(); }} style={{ padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: abaAtiva === 'gestao' ? '#10b981' : 'transparent', color: abaAtiva === 'gestao' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings size={16}/> Administração
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '8px 12px', backgroundColor: isDarkMode ? '#fde047' : '#e2e8f0', color: isDarkMode ? '#854d0e' : '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', display: 'flex', alignItems: 'center' }} title="Mudar Tema">
              {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', display: 'flex', alignItems: 'center' }} title="Sair do Sistema">
              <LogOut size={18}/>
            </button>
          </div>
        </div>

        {/* TELA 1: NOVO ATENDIMENTO */}
        {abaAtiva === 'novo' && (
           <div style={{ backgroundColor: editandoId ? (isDarkMode ? '#b45309' : '#fffbeb') : (isDarkMode ? '#1e293b' : '#ffffff'), padding: '30px', borderRadius: '12px', transition: '0.3s', border: `1px solid ${editandoId ? '#f59e0b' : tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
           <h2 style={{ color: editandoId ? '#d97706' : tema.texto1, marginTop: '0', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             {editandoId ? <><Edit size={24}/> Editando Relatório</> : <><Edit size={24}/> Novo Atendimento</>}
           </h2>
           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             
             <div style={{ backgroundColor: tema.inputBg, padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
                <label style={{ display: 'block', color: tema.texto2, fontWeight: '600', marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Equipe no atendimento
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {usuarios.map(user => {
                    const isSelected = atendentesSelecionados.includes(user.id);
                    return (
                      <button
                        key={user.id} type="button" onClick={() => handleToggleAtendente(user.id)}
                        style={{ padding: '8px 14px', borderRadius: '20px', border: isSelected ? 'none' : `1px solid ${tema.borda}`, backgroundColor: isSelected ? '#32b8f7' : (isDarkMode ? '#0f172a' : '#f8fafc'), color: isSelected ? '#fff' : tema.texto1, cursor: 'pointer', fontWeight: isSelected ? '600' : '400', transition: 'all 0.2s', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        {isSelected ? <Check size={14}/> : ''} {user.username}
                      </button>
                    )
                  })}
                </div>
             </div>

             <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
               <div style={{ flex: 1, minWidth: '200px' }}>
                 <input list="lista-empresas" placeholder="Nome da Empresa" required value={empresa} onChange={(e) => setEmpresa(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }} />
                 <datalist id="lista-empresas">{empresasUnicas.map((emp, i) => <option key={i} value={emp} />)}</datalist>
               </div>
               <div style={{ flex: 1, minWidth: '200px' }}>
                 <input list="lista-funcionarios" placeholder="Nome do Funcionário (Opcional)" value={funcionario} onChange={(e) => setFuncionario(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }} />
                 <datalist id="lista-funcionarios">{funcionariosDaEmpresa.map((func, i) => <option key={i} value={func} />)}</datalist>
               </div>
             </div>

             <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  {/* TIRAMOS OS EMOJIS DA LISTA PARA FICAR CLEAN */}
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }}>
                    <option value="Hardware / Equipamento">Hardware / Equipamento</option>
                    <option value="Sistema Operacional / Windows">Sistema Operacional / Windows</option>
                    <option value="Rede Interna / Servidor">Rede Interna / Servidor</option>
                    <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
                    <option value="Sistemas / ERP">Sistemas / ERP</option>
                    <option value="Pacote Office / Softwares">Pacote Office / Softwares</option>
                    <option value="E-mail / Acessos">E-mail / Acessos</option>
                    <option value="Acessos / Permissões / VPN">Acessos / Permissões / VPN</option>
                    <option value="Telefonia">Telefonia</option>
                    <option value="Dispositivos Móveis / Celular">Dispositivos Móveis / Celular</option>
                    <option value="Segurança / Antivírus">Segurança / Antivírus</option>
                    <option value="Backup / Restauração">Backup / Restauração</option>
                    <option value="Certificados Digitais">Certificados Digitais</option>
                    <option value="Controle de Ponto / Biometria">Controle de Ponto / Biometria</option>
                    <option value="CFTV / Câmeras">CFTV / Câmeras</option>
                    <option value="Impressora">Impressora</option>
                    <option value="Periféricos (Mouse/Teclado/Fone)">Periféricos (Mouse/Teclado/Fone)</option>
                    <option value="Dúvida de Usuário">Dúvida de Usuário</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }}>
                    <option value="Resolvido">Resolvido (Finalizado)</option>
                    <option value="Andamento">Em Andamento (Pendente)</option>
                    <option value="Aberto">Aberto (Não iniciado)</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <input type="date" required value={dataAtendimento} onChange={(e) => setDataAtendimento(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${tema.borda}`, fontSize: '15px', boxSizing: 'border-box', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }} title="Data em que o serviço foi realizado" />
                </div>
             </div>

             <div onClick={() => setIsTicket(!isTicket)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', backgroundColor: isTicket ? (isDarkMode ? '#4c0519' : '#ffe4e6') : tema.inputBg, borderRadius: '8px', border: `2px dashed ${isTicket ? '#f43f5e' : tema.borda}`, cursor: 'pointer', transition: '0.3s' }}>
                <input type="checkbox" checked={isTicket} readOnly style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f43f5e' }} />
                <span style={{ color: isTicket ? '#f43f5e' : tema.texto1, fontWeight: isTicket ? '600' : '400', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ticket size={18}/> Marcar como Ticket Especial (Problemas Complexos)
                </span>
             </div>

             <textarea placeholder="Solicitação / Problema Relatado" required value={solitProb} onChange={(e) => setSolitProb(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}`, minHeight: '80px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s', fontFamily: 'inherit' }} />
             <textarea placeholder="Resolução / O que foi feito" required value={resolucao} onChange={(e) => setResolucao(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}`, minHeight: '80px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s', fontFamily: 'inherit' }} />
             <textarea placeholder="Observações Adicionais (Opcional)" value={obs} onChange={(e) => setObs(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: `1px solid ${tema.borda}`, minHeight: '50px', fontSize: '15px', resize: 'vertical', backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s', fontFamily: 'inherit' }} />
             
             <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
               <button type="submit" style={{ flex: 1, padding: '16px', backgroundColor: editandoId ? '#d97706' : '#32b8f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', transition: '0.2s', boxShadow: editandoId ? '0 4px 10px rgba(217, 119, 6, 0.3)' : '0 4px 10px rgba(50, 184, 247, 0.3)' }}>{editandoId ? 'Salvar Alterações' : 'Salvar Atendimento'}</button>
               {editandoId && <button type="button" onClick={() => { limparFormulario(); setAbaAtiva('historico'); }} style={{ padding: '16px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', transition: '0.2s' }}>Cancelar</button>}
             </div>
           </form>
         </div>
        )}

        {abaAtiva === 'tickets' && (
          <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f43f5e', paddingBottom: '15px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Ticket size={24} color="#f43f5e"/> Radar de Tickets</h2>
              
              <div style={{ display: 'flex', gap: '5px', backgroundColor: tema.inputBg, padding: '6px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
                <button onClick={() => setFiltroTicket('pendentes')} style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroTicket === 'pendentes' ? '#f43f5e' : 'transparent', color: filtroTicket === 'pendentes' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16}/> Pendentes
                </button>
                <button onClick={() => setFiltroTicket('resolvidos')} style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroTicket === 'resolvidos' ? '#10b981' : 'transparent', color: filtroTicket === 'resolvidos' ? '#fff' : tema.texto1, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16}/> Resolvidos
                </button>
              </div>
            </div>
            
            <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {(() => {
                const ticketsParaMostrar = relatorios.filter(r => r.is_ticket && (filtroTicket === 'pendentes' ? r.status !== 'Resolvido' : r.status === 'Resolvido'));
                
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
                  <CartaoRelatorio key={relatorio.id} relatorio={relatorio} />
                ));
              })()}
            </div>
          </div>
        )}

        {abaAtiva === 'historico' && (
          <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Search size={24} color="#32b8f7"/> Histórico Completo</h2>
            </div>
            
            <div style={{ backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '10px', border: `1px solid ${tema.borda}`, marginBottom: '30px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: tema.texto1, display: 'flex', alignItems: 'center', gap: '8px' }}><FileDown size={18}/> Exportar Relatórios</h4>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block', marginBottom: '5px', fontWeight: '600' }}>Data Inicial</label><input type="date" value={pdfDataInicio} onChange={e => setPdfDataInicio(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
                <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block', marginBottom: '5px', fontWeight: '600' }}>Data Final</label><input type="date" value={pdfDataFim} onChange={e => setPdfDataFim(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
                <div><label style={{ fontSize: '12px', color: tema.texto2, display: 'block', marginBottom: '5px', fontWeight: '600' }}>Atendente (Opcional)</label><input type="text" placeholder="Nome..." value={pdfAtendente} onChange={e => setPdfAtendente(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} /></div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
                  <button onClick={gerarPDF} style={{ padding: '10px 18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>Baixar PDF</button>
                  <button onClick={gerarTXT} style={{ padding: '10px 18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}>Baixar TXT</button>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: tema.texto2 }} />
                <input type="text" placeholder="Buscar por empresa, problema, categoria..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, fontSize: '15px', boxSizing: 'border-box', transition: '0.2s' }} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: tema.inputBg, padding: '0 15px', borderRadius: '8px', border: `1px solid ${tema.borda}` }}>
                 <span style={{color: tema.texto2, fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px'}}><Calendar size={16}/> Ver dia exato:</span>
                 <input type="date" value={filtroDataTela} onChange={(e) => setFiltroDataTela(e.target.value)} style={{ padding: '10px 5px', border: 'none', backgroundColor: 'transparent', color: tema.texto1, outline: 'none', fontSize: '15px' }} />
                 {filtroDataTela && <button onClick={() => setFiltroDataTela('')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Limpar</button>}
              </div>
            </div>
            
            <div ref={animationParent}>
              {isBuscandoDataExata ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h3 style={{ color: tema.texto1, margin: 0, fontSize: '18px' }}>Resultados para {formatarData(filtroDataTela)}</h3>
                  </div>
                  {relatoriosParaMostrar.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', marginBottom: '40px', textAlign: 'center', padding: '20px' }}>Nenhum atendimento registrado nesta data.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>{relatoriosParaMostrar.map(relatorio => <CartaoRelatorio key={relatorio.id} relatorio={relatorio} />)}</div>}
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #32b8f7', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h3 style={{ color: tema.texto1, margin: 0, fontSize: '18px' }}>Hoje ({formatarData(hojePadrao)})</h3>
                  </div>

                  {relatoriosHoje.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', marginBottom: '40px', textAlign: 'center', padding: '20px' }}>Nenhum atendimento registrado hoje.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>{relatoriosHoje.map(relatorio => <CartaoRelatorio key={relatorio.id} relatorio={relatorio} />)}</div>}
                  
                  <h3 style={{ borderBottom: `2px solid ${tema.borda}`, paddingBottom: '10px', color: tema.texto1, marginBottom: '20px', fontSize: '18px' }}>Últimos Atendimentos</h3>
                  {relatoriosAntigos.length === 0 ? <p style={{ color: tema.texto2, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Nenhum histórico antigo encontrado.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>{relatoriosAntigos.map(relatorio => <CartaoRelatorio key={relatorio.id} relatorio={relatorio} />)}</div>}
                </>
              )}
            </div>
          </div>
        )}

        {abaAtiva === 'gestao' && (
          <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ color: tema.texto1, margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={24} color="#10b981"/> Dashboard de Gestão</h2>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px', backgroundColor: tema.fundoDestaque, padding: '25px 20px', borderRadius: '10px', borderTop: '4px solid #3b82f6', transition: 'transform 0.2s', cursor: 'default', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <h4 style={{ margin: '0 0 10px 0', color: tema.texto2, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Atendimentos</h4>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: tema.texto1 }}>{relatorios.length}</p>
              </div>
              <div style={{ flex: 1, minWidth: '150px', backgroundColor: tema.fundoDestaque, padding: '25px 20px', borderRadius: '10px', borderTop: '4px solid #10b981', transition: 'transform 0.2s', cursor: 'default', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <h4 style={{ margin: '0 0 10px 0', color: tema.texto2, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Atendimentos Hoje</h4>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: tema.texto1 }}>{relatoriosHoje.length}</p>
              </div>
              <div style={{ flex: 1, minWidth: '150px', backgroundColor: tema.fundoDestaque, padding: '25px 20px', borderRadius: '10px', borderTop: '4px solid #8b5cf6', transition: 'transform 0.2s', cursor: 'default', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <h4 style={{ margin: '0 0 10px 0', color: tema.texto2, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Empresas Atendidas</h4>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: tema.texto1 }}>{empresasUnicas.length}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <div style={{ flex: 1, minWidth: '250px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>Status dos Chamados</h3>
                {relatorios.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={dadosGraficoStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                        {dadosGraficoStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_STATUS[entry.name] || '#3b82f6'} stroke="none" />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1, borderRadius: '8px' }} itemStyle={{ color: tema.texto1 }} />
                      <Legend wrapperStyle={{ color: tema.texto1, fontSize: '13px', fontWeight: '500' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p style={{ textAlign: 'center', color: tema.texto2 }}>Sem dados suficientes.</p>}
              </div>

              <div style={{ flex: 1, minWidth: '250px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>Chamados por Categoria</h3>
                {relatorios.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dadosGraficoCategoria} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} vertical={false} />
                      <XAxis dataKey="nome" stroke={tema.graficoTexto} tick={{fontSize: 11}} />
                      <YAxis stroke={tema.graficoTexto} tick={{fontSize: 11}} allowDecimals={false} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1, borderRadius: '8px' }} />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={28}>
                        {dadosGraficoCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_CATEGORIAS[index % CORES_CATEGORIAS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p style={{ textAlign: 'center', color: tema.texto2 }}>Sem dados suficientes.</p>}
              </div>

              <div style={{ flex: 1, minWidth: '350px', backgroundColor: tema.fundoDestaque, padding: '20px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>Top 5 Clientes Ofensores</h3>
                {relatorios.length > 0 && dadosGraficoEmpresas.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart layout="vertical" data={dadosGraficoEmpresas} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} horizontal={false} />
                      <XAxis type="number" stroke={tema.graficoTexto} tick={{fontSize: 11}} allowDecimals={false} />
                      <YAxis type="category" dataKey="nome" stroke={tema.graficoTexto} tick={{fontSize: 11}} width={100} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1, borderRadius: '8px' }} />
                      <Bar dataKey="chamados" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p style={{ textAlign: 'center', color: tema.texto2 }}>Sem dados suficientes.</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', backgroundColor: editandoUsuarioId ? (isDarkMode ? '#713f12' : '#fffbeb') : tema.fundoDestaque, padding: '25px', borderRadius: '10px', border: `1px solid ${editandoUsuarioId ? '#f59e0b' : tema.borda}`, transition: '0.3s' }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, fontSize: '18px' }}>{editandoUsuarioId ? '✏️ Editando Atendente' : '👤 Novo Atendente'}</h3>
                <form onSubmit={handleSalvarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input type="text" placeholder="Nome de Usuário" required value={novoUsername} onChange={e => setNovoUsername(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }} />
                  <input type="password" placeholder={editandoUsuarioId ? "Nova Senha (vazio=manter)" : "Senha"} required={!editandoUsuarioId} value={novaSenha} onChange={e => setNovaSenha(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1, transition: '0.2s' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: tema.texto1, cursor: 'pointer', fontWeight: '500' }}>
                      <input type="checkbox" checked={novoIsStaff} onChange={e => setNovoIsStaff(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} /> Permissão de Administrador
                    </label>
                    {editandoUsuarioId && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: novoIsActive ? '#10b981' : '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={novoIsActive} onChange={e => setNovoIsActive(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: novoIsActive ? '#10b981' : '#ef4444' }} />
                        {novoIsActive ? 'Conta Ativa (Pode Logar)' : 'Conta Bloqueada'}
                      </label>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: editandoUsuarioId ? '#d97706' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}>{editandoUsuarioId ? 'Salvar Edição' : 'Cadastrar'}</button>
                    {editandoUsuarioId && <button type="button" onClick={limparFormularioUsuario} style={{ padding: '12px', backgroundColor: isDarkMode ? '#475569' : '#e2e8f0', color: tema.texto1, border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}>Cancelar</button>}
                  </div>
                </form>
              </div>

              <div style={{ flex: 1, minWidth: '250px', backgroundColor: tema.fundoDestaque, padding: '25px', borderRadius: '10px', border: `1px solid ${tema.borda}` }}>
                <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, fontSize: '18px' }}>📋 Equipe Cadastrada</h3>
                <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto', paddingRight: '5px' }}>
                  {usuarios.map(user => (
                    <div key={user.id} style={{ padding: '15px', backgroundColor: tema.fundoCard, border: `1px solid ${tema.borda}`, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div>
                        <span style={{ fontWeight: '600', color: tema.texto1, display: 'block', fontSize: '15px' }}>{user.username}</span>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                          {user.is_staff && <span style={{ fontSize: '10px', backgroundColor: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Chefe</span>}
                          {user.is_active ? <span style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Ativo</span> : <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Inativo</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => iniciarEdicaoUsuario(user)} style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }}><Edit size={14}/></button>
                        <button onClick={() => apagarUsuario(user.id)} style={{ backgroundColor: '#fed7d7', color: '#991b1b', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }}><Trash2 size={14}/></button>
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