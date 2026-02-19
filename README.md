# Mini CRM — Clientes (Workshop: Construindo devs com IA)

## Contexto
Esta é uma tela simples de listagem de clientes com ações **Editar** e **Excluir**.
Existe um seletor de perfil do usuário:
- `viewer`: somente leitura
- `editor`: pode editar e excluir

## Bug
As ações **não respeitam as permissões do perfil viewer**.

### Comportamento atual
Mesmo com o perfil `viewer`, ainda é possível:
- clicar em **Excluir** e remover clientes
- clicar em **Editar** e alterar o nome

### Comportamento esperado
Quando `role = viewer`:
- Botões **Editar** e **Excluir** devem ficar **visíveis porém desabilitados**
- Deve existir tooltip: **"Essa ação não é permitida para este perfil"**
- Clique **não pode executar** nenhuma ação

Quando `role = editor`:
- Botões devem funcionar normalmente

## Correção aplicada

Adicionado um guard de retorno antecipado no início do handler de clique em `app.js`:

```js
els.list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  // Bloqueia ações para o perfil viewer
  if (state.role === "viewer") return;

  // ... lógica de editar / excluir
});
```

## Como testar

1. Abra `index.html` no navegador (perfil padrão: **Viewer**)
2. Clique em **Editar** ou **Excluir** em qualquer card — nenhuma ação deve ocorrer; contagem permanece em 6
3. Mude o perfil para **Editor**
4. Clique em **Excluir** — cliente é removido; clique em **Editar** — prompt para novo nome aparece
5. Volte para **Viewer** — ações bloqueadas novamente

## Risco / Regressão

Mudança mínima: uma única linha adicionada ao handler existente.  
Sem refatoração, sem alteração de estrutura. Risco de regressão é baixo.