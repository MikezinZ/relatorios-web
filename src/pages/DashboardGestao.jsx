import React from 'react';
import { Users, BarChart3, TrendingUp, ShieldCheck, UserPlus, Edit, Trash2, CheckCircle2, AlertCircle, Clock3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';

const DashboardGestao = ({
  tema, isDarkMode, relatorios, relatoriosHoje, empresasUnicas, 
  dadosGraficoStatus, dadosGraficoCategoria, dadosGraficoEmpresas, 
  CORES_STATUS, CORES_CATEGORIAS,
  editandoUsuarioId, handleSalvarUsuario, novoUsername, setNovoUsername, 
  novaSenha, setNovaSenha, novoIsStaff, setNovoIsStaff, novoIsActive, setNovoIsActive, 
  limparFormularioUsuario, animationParent, usuarios, iniciarEdicaoUsuario, apagarUsuario
}) => {

  // === CALCULANDO NOVOS DASHBOARDS ===
  
  // 1. Produtividade por Atendente
  const contagemAtendentes = relatorios.reduce((acc, rel) => {
    const nome = rel.atendente_nome || 'Desconhecido';
    acc[nome] = (acc[nome] || 0) + 1;
    return acc;
  }, {});
  const dadosProdutividade = Object.keys(contagemAtendentes)
    .map(key => ({ nome: key, total: contagemAtendentes[key] }))
    .sort((a, b) => b.total - a.total);

  // 2. Evolução de Chamados (Últimos 7 dias)
  const ultimos7Dias = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dadosEvolucao = ultimos7Dias.map(dia => {
    const totalDia = relatorios.filter(r => (r.data_atendimento || r.criado_em?.split('T')[0]) === dia).length;
    const [, mes, dataDia] = dia.split('-');
    return { data: `${dataDia}/${mes}`, Chamados: totalDia };
  });

  // KPI's do Topo
  const totalGeral = relatorios.length;
  const totalResolvidos = relatorios.filter(r => r.status === 'Resolvido').length;
  const totalAbertos = relatorios.filter(r => r.status === 'Aberto' || r.status === 'Andamento').length;

  const tooltipStyle = { backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${tema.borda}`, borderRadius: '8px', color: tema.texto1 };

  return (
    <div ref={animationParent} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.4)' : '#10b981'}`, paddingBottom: '15px' }}>
        <h2 style={{ color: tema.texto1, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={26} color="#10b981" /> Painel de Gestão e Estatísticas
        </h2>
      </div>

      {/* === LINHA 1: KPI'S (CARDS DE RESUMO) === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ padding: '12px', backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', borderRadius: '12px' }}><BarChart3 size={24} color="#3b82f6" /></div>
          <div><p style={{ margin: 0, fontSize: '12px', color: tema.texto2, fontWeight: 'bold', textTransform: 'uppercase' }}>Total de Chamados</p><h3 style={{ margin: 0, fontSize: '28px', color: tema.texto1 }}>{totalGeral}</h3></div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #10b981' }}>
          <div style={{ padding: '12px', backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4', borderRadius: '12px' }}><CheckCircle2 size={24} color="#10b981" /></div>
          <div><p style={{ margin: 0, fontSize: '12px', color: tema.texto2, fontWeight: 'bold', textTransform: 'uppercase' }}>Resolvidos</p><h3 style={{ margin: 0, fontSize: '28px', color: tema.texto1 }}>{totalResolvidos}</h3></div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ padding: '12px', backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2', borderRadius: '12px' }}><AlertCircle size={24} color="#ef4444" /></div>
          <div><p style={{ margin: 0, fontSize: '12px', color: tema.texto2, fontWeight: 'bold', textTransform: 'uppercase' }}>Pendentes</p><h3 style={{ margin: 0, fontSize: '28px', color: tema.texto1 }}>{totalAbertos}</h3></div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #eab308' }}>
          <div style={{ padding: '12px', backgroundColor: isDarkMode ? 'rgba(234, 179, 8, 0.2)' : '#fefce8', borderRadius: '12px' }}><Clock3 size={24} color="#eab308" /></div>
          <div><p style={{ margin: 0, fontSize: '12px', color: tema.texto2, fontWeight: 'bold', textTransform: 'uppercase' }}>Entraram Hoje</p><h3 style={{ margin: 0, fontSize: '28px', color: tema.texto1 }}>{relatoriosHoje.length}</h3></div>
        </div>
      </div>

      {/* === LINHA 2: GRÁFICOS PRINCIPAIS === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* GRÁFICO 1: EVOLUÇÃO 7 DIAS */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 20px 0', color: tema.texto1, display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18} color="#3b82f6"/> Volume de Chamados (7 Dias)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dadosEvolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorChamados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#32b8f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#32b8f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} vertical={false} />
              <XAxis dataKey="data" stroke={tema.texto2} fontSize={12} tickLine={false} />
              <YAxis stroke={tema.texto2} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="Chamados" stroke="#32b8f7" strokeWidth={3} fillOpacity={1} fill="url(#colorChamados)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO 2: STATUS */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 20px 0', color: tema.texto1 }}>Situação dos Chamados</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dadosGraficoStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: '12px', fill: tema.texto1 }}>
                {dadosGraficoStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={CORES_STATUS[entry.name] || '#64748b'} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO 3: PRODUTIVIDADE */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 20px 0', color: tema.texto1, display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} color="#10b981"/> Produtividade (Top Atendentes)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosProdutividade.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} horizontal={false} />
              <XAxis type="number" stroke={tema.texto2} fontSize={12} />
              <YAxis dataKey="nome" type="category" stroke={tema.texto1} fontSize={12} width={80} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} />
              <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* === LINHA 3: CATEGORIAS E EMPRESAS === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 20px 0', color: tema.texto1 }}>Demandas por Categoria</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGraficoCategoria} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} vertical={false} />
              <XAxis dataKey="nome" stroke={tema.texto2} fontSize={11} tick={{angle: -45, textAnchor: 'end'}} height={70} />
              <YAxis stroke={tema.texto2} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {dadosGraficoCategoria.map((entry, index) => <Cell key={`cell-${index}`} fill={CORES_CATEGORIAS[index % CORES_CATEGORIAS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 20px 0', color: tema.texto1 }}>Top 5 Clientes (Maior Demanda)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGraficoEmpresas} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tema.borda} horizontal={false} />
              <XAxis type="number" stroke={tema.texto2} fontSize={12} />
              <YAxis dataKey="nome" type="category" stroke={tema.texto1} fontSize={11} width={120} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} />
              <Bar dataKey="chamados" fill="#f43f5e" radius={[0, 6, 6, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === GERENCIAMENTO DE USUÁRIOS === */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginTop: '10px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: tema.texto1, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${tema.borda}`, paddingBottom: '15px' }}>
          <Users size={22} color="#3b82f6" /> Gerenciamento de Equipe
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* FORMULÁRIO DE USUÁRIO */}
          <div style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borda}` }}>
            <h4 style={{ margin: '0 0 15px 0', color: tema.texto1 }}>{editandoUsuarioId ? 'Editar Colaborador' : 'Novo Colaborador'}</h4>
            <form onSubmit={handleSalvarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Nome de usuário (Login)" value={novoUsername} onChange={e => setNovoUsername(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} />
              <input type="password" placeholder={editandoUsuarioId ? "Nova senha (deixe em branco para manter)" : "Senha de acesso"} value={novaSenha} onChange={e => setNovaSenha(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${tema.borda}`, backgroundColor: tema.inputBg, color: tema.texto1 }} />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: tema.texto1, fontSize: '14px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={novoIsStaff} onChange={e => setNovoIsStaff(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#10b981' }} />
                  É Administrador? (Chefe)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: tema.texto1, fontSize: '14px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={novoIsActive} onChange={e => setNovoIsActive(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }} />
                  Conta Ativa?
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-premium" style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {editandoUsuarioId ? <Edit size={16}/> : <UserPlus size={16}/>} {editandoUsuarioId ? 'Salvar Edição' : 'Cadastrar'}
                </button>
                {editandoUsuarioId && (
                  <button type="button" onClick={limparFormularioUsuario} style={{ backgroundColor: 'transparent', color: tema.texto2, padding: '12px', border: `1px solid ${tema.borda}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                )}
              </div>
            </form>
          </div>

          {/* LISTA DE USUÁRIOS */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {usuarios.map(user => (
                <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : '#fff', border: `1px solid ${tema.borda}`, borderRadius: '10px' }}>
                  <div>
                    <strong style={{ color: tema.texto1, display: 'block', fontSize: '15px' }}>{user.username} {user.is_staff && <span style={{ fontSize: '10px', backgroundColor: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '10px', verticalAlign: 'middle', marginLeft: '5px' }}>ADMIN</span>}</strong>
                    <span style={{ fontSize: '12px', color: user.is_active ? '#3b82f6' : '#ef4444' }}>{user.is_active ? 'Ativo no sistema' : 'Acesso revogado'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-premium" onClick={() => iniciarEdicaoUsuario(user)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button className="btn-premium" onClick={() => apagarUsuario(user.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default DashboardGestao;