# Linux Partition Calculator

**Otimize o particionamento do seu disco para múltiplas distribuições Linux com inteligência artificial.**

Uma ferramenta web interativa e gratuita que ajuda usuários a planejar o particionamento ideal de seus discos rígidos para instalação de sistemas Linux, com suporte a múltiplas distribuições, processadores e configurações de hardware.

## 🌟 Características Principais

### Calculadora Inteligente
- **Múltiplas Distribuições**: Suporte para Ubuntu, Fedora, Debian, Arch Linux, Linux Mint, openSUSE e CentOS
- **Auto-Configuração**: Atualização automática de parâmetros baseada no processador selecionado
- **Processadores Expandidos**: 12+ modelos de processadores desde 2001 (Windows XP) com especificações técnicas
- **Recomendações Inteligentes**: Cálculos baseados em RAM, tamanho do disco e tipo de processador

### Particionamento Avançado
- **Pontos de Montagem Opcionais**: Adicione/remova partições como /var, /tmp, /opt, /srv, /usr/local
- **Sliders Individuais**: Controle granular de tamanho para cada partição
- **Distribuição Flexível**: Aloque 10-80% do disco para o sistema, restante para dados
- **Validação em Tempo Real**: Alertas e sugestões de otimização

### Firmware e Boot
- **Suporte Completo**: BIOS (MBR), UEFI (GPT), GPT com BIOS legado, MBR tradicional
- **Detecção Automática**: Firmware recomendado baseado no processador
- **Scripts de Auto-Instalação**: Gere Kickstart, Preseed e scripts UEFI Boot

### Exportação e Backup
- **Múltiplos Formatos**: XML (Kickstart), scripts Bash, configuração de usuário/senha/WiFi
- **Partclone Scripts**: Gerador automático de scripts para backup/restore de partições
- **Importação/Exportação**: Salve e compartilhe suas configurações

### Interface Multilíngue
- **Português Brasileiro**: Interface padrão para visitantes do Brasil
- **Inglês Internacional**: Detecção automática de geolocalização para outros países
- **Toggle Manual**: Mude de idioma a qualquer momento com persistência em localStorage

### Globo Animado com Estatísticas
- **Contador Global**: Visualize visitantes em tempo real com ícone girando
- **Mapa Interativo**: Clique para expandir e ver visitantes por país
- **Segregação por Estado**: Detalhamento especial para o Brasil por estado
- **Geolocalização**: Rastreamento automático por IP

### Avaliações e Compartilhamento
- **Sistema de 5 Estrelas**: Avalie a ferramenta e deixe comentários
- **Comentários Anônimos**: Opção de feedback anônimo com flag de país
- **Compartilhamento Social**: Botões para WhatsApp, Facebook, Instagram e Email
- **Contadores**: Rastreie visitantes, compartilhamentos e avaliações

### Painel Administrativo
- **Dashboard**: Estatísticas de visitantes, avaliações e compartilhamentos
- **Gerenciamento de Usuários**: Promova/rebaixe administradores com log de auditoria
- **Configurações do Sistema**: 4 abas (Geral, Funcionalidades, Backup, Notificações)
- **Relatórios Detalhados**: Gráficos interativos e análise de dados

## 🚀 Como Usar

### Para Usuários Finais

1. **Acesse o Site**: Navegue para a página principal
2. **Configure o Hardware**: Selecione tamanho do disco, RAM e processador
3. **Revise Recomendações**: O sistema auto-atualiza firmware, disco e hibernação
4. **Ajuste Partições**: Use sliders para personalizar tamanho de cada partição
5. **Exporte Configuração**: Baixe XML, scripts ou salve para depois
6. **Instale o Sistema**: Use os scripts gerados para auto-instalação

### Para Administradores

1. **Acesse /admin**: Dashboard com estatísticas e gráficos
2. **Gerencie Usuários**: Promova/rebaixe admins em /admin/users
3. **Configure Sistema**: Ajuste parâmetros em /admin/settings
4. **Monitore Auditoria**: Revise log de todas as ações administrativas

## 📋 Requisitos de Sistema

- **Navegador Moderno**: Chrome, Firefox, Safari, Edge (versões recentes)
- **JavaScript Habilitado**: Necessário para funcionalidades interativas
- **Conexão Internet**: Para geolocalização e sincronização de dados
- **Cookies Habilitados**: Para persistência de preferências

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| React | 19.x | Interface do usuário |
| Tailwind CSS | 4.x | Estilização responsiva |
| TypeScript | 5.9 | Tipagem estática |
| tRPC | 11.x | Chamadas de API type-safe |
| Drizzle ORM | 0.44 | Gerenciamento de banco de dados |
| MySQL | 8.x | Armazenamento de dados |
| Express | 4.x | Servidor backend |
| Recharts | 2.x | Visualização de gráficos |

## 📊 Estrutura de Dados

### Tabelas Principais

**users**: Armazena informações de usuários e roles (admin/user)
**visitors**: Rastreia visitantes por país, continente e estado
**reviews**: Avaliações com 5 estrelas e comentários
**shares**: Registra compartilhamentos em redes sociais
**auditLog**: Log completo de ações administrativas
**savedConfigurations**: Configurações salvas pelos usuários

## 🔐 Segurança

- **Autenticação OAuth**: Login seguro via Manus OAuth
- **Proteção Admin**: Apenas usuários com role 'admin' acessam painel
- **Log de Auditoria**: Todas as ações administrativas são registradas
- **Validação de Entrada**: Sanitização de todos os dados do usuário
- **HTTPS Obrigatório**: Comunicação criptografada

## 📈 Estatísticas

- **Visitantes Globais**: Rastreamento por país e continente
- **Avaliações**: Média de classificação e total de comentários
- **Compartilhamentos**: Contagem por rede social
- **Configurações Salvas**: Histórico de últimas 5 configurações por usuário

## 🌍 Suporte Multilíngue

| Idioma | Disponível | Detecção |
|--------|-----------|----------|
| Português Brasileiro | ✅ | Automática para Brasil |
| Inglês Internacional | ✅ | Automática para outros países |
| Espanhol | 🔄 | Em desenvolvimento |
| Francês | 🔄 | Em desenvolvimento |

## 💡 Dicas de Uso

### Para Iniciantes
1. Use as recomendações automáticas como ponto de partida
2. Leia as notas de resumo para entender cada partição
3. Valide sua configuração na aba "Validação"
4. Revise o gráfico de projeção de crescimento

### Para Usuários Avançados
1. Ative o modo "Avançado" para controle granular
2. Adicione pontos de montagem customizados
3. Use LVM para maior flexibilidade
4. Exporte múltiplas configurações para comparação

### Para Administradores
1. Monitore estatísticas no dashboard
2. Revise log de auditoria regularmente
3. Gerencie permissões de usuários em /admin/users
4. Configure notificações em /admin/settings

## 🤝 Contribuições

Este projeto é mantido pela comunidade. Se você encontrou um bug ou tem uma sugestão de melhoria, por favor:

1. Abra uma issue no GitHub
2. Descreva o problema ou sugestão detalhadamente
3. Inclua screenshots ou exemplos quando possível

## 💰 Suporte ao Projeto

Este serviço é **gratuito** e mantido com apoio da comunidade. Se a ferramenta te ajudou, considere fazer uma doação:

**Chave PIX**: eleno.ramos@gmail.com
**Valores Sugeridos**: R$5, R$10, R$20

Toda doação ajuda a manter o servidor no ar e a desenvolver novas funcionalidades.

## 📝 Licença

Este projeto é licenciado sob a MIT License. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Eleno Ramos** - Desenvolvedor e Mantenedor

- Email: eleno.ramos@gmail.com
- GitHub: [seu-usuario]
- PIX: eleno.ramos@gmail.com

## 🙏 Agradecimentos

Agradecemos à comunidade Linux por inspiração e feedback contínuo. Este projeto não seria possível sem o suporte de usuários como você.

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação completa
2. Revise as FAQs
3. Abra uma issue no GitHub
4. Entre em contato via email

---

**Última Atualização**: Fevereiro de 2026
**Versão**: 1.0.0
**Status**: Ativo e em Desenvolvimento
