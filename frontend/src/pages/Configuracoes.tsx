import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { AppLayout, PageHeader } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { TabPanel } from '../components/ui/Tabs';
import { toast } from '../components/ui/Toast';
import { useAuthStore } from '../stores/auth.store';
import { cn } from '../utils/cn';

const tabs = [
  { id: 'conta', label: 'Conta', icon: <User size={16} /> },
  { id: 'seguranca', label: 'Segurança', icon: <Shield size={16} /> },
  { id: 'papeis', label: 'Papéis', icon: <Briefcase size={16} /> },
];

export default function Configuracoes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('conta');
  const { user, logout, hasRole, activateFounderRole, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ name, bio });
    toast('success', 'Perfil atualizado com sucesso!');
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleActivateFounder = () => {
    activateFounderRole();
    toast('success', 'Papel de Founder ativado!');
  };

  const isFounder = hasRole('founder');
  const isCurator = hasRole('curator');

  return (
    <AppLayout maxWidth="lg">
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta e preferências"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-56 flex-shrink-0">
          <Card padding="sm" className="lg:sticky lg:top-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-accent/15 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <hr className="my-2 border-border-subtle" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </nav>
          </Card>
        </aside>

        <main className="flex-1 min-w-0">
          <TabPanel value="conta" activeValue={activeTab}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Informações da conta</h2>

              <div className="flex items-center gap-4 mb-8">
                <Avatar name={user?.name || 'Usuário'} size="xl" />
                <div>
                  <Button variant="secondary" size="sm">
                    Alterar foto
                  </Button>
                  <p className="text-xs text-text-muted mt-1.5">JPG, PNG até 5MB</p>
                </div>
              </div>

              <div className="space-y-5 max-w-md">
                <Input
                  label="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  hint="O email não pode ser alterado"
                />
                <Textarea
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Conte um pouco sobre você..."
                />
                <Button onClick={handleSaveProfile} loading={saving}>
                  Salvar alterações
                </Button>
              </div>
            </Card>
          </TabPanel>

          <TabPanel value="seguranca" activeValue={activeTab}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Segurança</h2>

              <div className="space-y-6 max-w-md">
                <div>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Alterar senha</h3>
                  <div className="space-y-4">
                    <Input label="Senha atual" type="password" />
                    <Input label="Nova senha" type="password" />
                    <Input label="Confirmar nova senha" type="password" />
                    <Button>Alterar senha</Button>
                  </div>
                </div>

                <hr className="border-border-subtle" />

                <div>
                  <h3 className="text-sm font-medium text-text-primary mb-2">Autenticação em dois fatores</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="secondary">Configurar 2FA</Button>
                </div>
              </div>
            </Card>
          </TabPanel>

          <TabPanel value="papeis" activeValue={activeTab}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-text-primary mb-2">Papéis e permissões</h2>
              <p className="text-sm text-text-secondary mb-6">
                Gerencie os papéis ativos na sua conta
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">Investidor</span>
                      <Badge variant="success" size="sm">Ativo</Badge>
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Explorar e investir em projetos de pesquisa
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">Founder</span>
                      {isFounder ? (
                        <Badge variant="success" size="sm">Ativo</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">Inativo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Submeter e gerenciar projetos próprios
                    </p>
                  </div>
                  {!isFounder && (
                    <Button size="sm" onClick={handleActivateFounder}>
                      Ativar
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">Curador</span>
                      {isCurator ? (
                        <Badge variant="success" size="sm">Ativo</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">Por convite</Badge>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Revisar e aprovar submissões de projetos
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabPanel>
        </main>
      </div>
    </AppLayout>
  );
}
