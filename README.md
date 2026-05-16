# FocusBoard

Um quadro Kanban interativo com foco em produtividade, totalmente client-side.

## 🚀 Funcionalidades
- **Drag & drop** em dispositivos desktop e touch.
- **Persistência automática** no localStorage (sem perdas ao recarregar).
- **Busca em tempo real**.
- Editor inline com suporte a **Markdown** básico.
- Tema claro/escuro.
- Atalhos de teclado avançados.
- Importação/Exportação local de dados (JSON).

## ⌨️ Atalhos de Teclado
- `N`: Novo card.
- `Enter` (em um card selecionado): Abrir editor.
- `Espaço` (em um card selecionado): Abrir editor.
- `Setas ←/→`: Mover card selecionado entre colunas.
- `Esc`: Fechar modal ou deselecionar card.
- `Ctrl + Enter`: Salvar card aberto.

## 🛠️ Stack Utilizada
- **React 19 + TypeScript**: Base performática e tipada.
- **Zustand**: Gerenciamento de estado elegante e simples, com middleware de persistência nativo perfeito para esse use case.
- **Tailwind CSS v4**: Estilização via classes utilitárias adaptável ao tema claro/escuro nativamente.
- **@hello-pangea/dnd**: Fork robusto do react-beautiful-dnd, excelente acessibilidade, funciona bem em touch devices sem configurações complexas complementares.
- **Lucide React**: Biblioteca de ícones moderna e leve.
- **React Markdown**: Renderização segura de Markdown no corpo dos cards.

## 🏗️ Como Rodar Localmente

1. Clone o repositório ou baixe os arquivos.
2. Certifique-se de ter Node.js atualizado.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Rode as aplicações em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
5. O terminal indicará o endereço (ex: `http://localhost:5173/`).

## 📦 Build & Deploy Estático (Vercel, Netlify, Github Pages)

1. Rode o comando de build:
   ```bash
   npm run build
   ```
2. Este comando vai gerar a pasta `dist/` contendo somente arquivos estáticos (HTML, JS, CSS).
3. Faça upload/deploy do diretório `dist/` no serviço de hospedagem de sua escolha. Não há dependência alguma de node no ambiente de servidor, o app roda 100% no navegador do cliente.

## ✅ Checklist de Testes (QA Manual)
1. Crie um novo card (+ New Card ou tecla 'N').
2. Preencha título e adicione uma tag qualquer.
3. Arraste o card de "To Do" para "Doing".
4. Recarregue a janela (`F5`). Verifique se o card continuou em "Doing".
5. Pesquise parte do título no campo "Search cards...", observe a listagem filtrada instantaneamente.
6. Altere o tema usando o ícone solar na header, verifique a mudança visual persistida.
7. Exporte o Board em JSON. Deleite a task, e então importe o Board novamente para restaurar o dado.
