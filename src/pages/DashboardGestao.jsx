import React from 'react';
import { Settings, Edit, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardGestao = ({
  tema, isDarkMode, relatorios, relatoriosHoje, empresasUnicas, dadosGraficoStatus, dadosGraficoCategoria, 
  dadosGraficoEmpresas, CORES_STATUS, CORES_CATEGORIAS, editandoUsuarioId, handleSalvarUsuario, novoUsername, 
  setNovoUsername, novaSenha, setNovaSenha, novoIsStaff, setNovoIsStaff, novoIsActive, setNovoIsActive, 
  limparFormularioUsuario, animationParent, usuarios, iniciarEdicaoUsuario, apagarUsuario
}) => {
  return (
    <div style={{ backgroundColor: tema.fundoCard, padding: '30px', borderRadius: '12px', border: `1px solid ${tema.borda}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: tema.texto1, margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={24} color="#10b981" /> Dashboard de Gestão</h2>

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
                <XAxis dataKey="nome" stroke={tema.graficoTexto} tick={{ fontSize: 11 }} />
                <YAxis stroke={tema.graficoTexto} tick={{ fontSize: 11 }} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1, borderRadius: '8px' }} />
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
                <XAxis type="number" stroke={tema.graficoTexto} tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="nome" stroke={tema.graficoTexto} tick={{ fontSize: 11 }} width={100} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: tema.fundoCard, borderColor: tema.borda, color: tema.texto1, borderRadius: '8px' }} />
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
                  <button onClick={() => iniciarEdicaoUsuario(user)} style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', color: tema.texto1, border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }}><Edit size={14} /></button>
                  <button onClick={() => apagarUsuario(user.id)} style={{ backgroundColor: '#fed7d7', color: '#991b1b', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGestao;