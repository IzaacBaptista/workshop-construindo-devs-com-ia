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

## Como reproduzir o bug

1. Abra `index.html` no navegador (perfil padrão: **Viewer**)
2. Clique em **Excluir** em qualquer card
3. Observe que o cliente é removido mesmo com perfil `viewer`
4. Atualize a página e clique em **Editar** em qualquer card
5. Observe que é possível alterar o nome mesmo com perfil `viewer`

## Critérios de aceitação

- Com `role = viewer`, botões **Editar** e **Excluir** devem permanecer visíveis, porém desabilitados
- Com `role = viewer`, deve existir tooltip com a mensagem: **"Essa ação não é permitida para este perfil"**
- Com `role = viewer`, cliques em ações não podem executar nenhuma alteração
- Com `role = editor`, ações de edição e exclusão devem funcionar normalmente

## Correção aplicada (Bug 1)

### O que foi feito
- Centralização da regra de permissão em uma função (`canMutate`) para decidir se o perfil pode editar/excluir.
- Renderização dos botões com estado **desabilitado** quando o perfil é `viewer`, incluindo:
	- atributo `disabled`
	- classe visual `is-disabled`
	- tooltip com a mensagem **"Essa ação não é permitida para este perfil"**
	- `aria-disabled` para acessibilidade
- Bloqueio defensivo no handler de clique para impedir execução caso o perfil não tenha permissão (mesmo que algum botão seja reabilitado via devtools).

### Por que resolve
Essas mudanças garantem o controle de acesso (RBAC) em duas camadas:
1. **UI**: o usuário `viewer` não consegue iniciar ações, pois os botões ficam desabilitados e exibem o tooltip esperado.
2. **Lógica**: mesmo com tentativa de execução via DOM, a ação é bloqueada antes de alterar dados.

## Testes de validação

Testes simples foram adicionados em `app.js` (função `runValidationTests`) e executados automaticamente no carregamento:

- Valida que o perfil `viewer` gera botões desabilitados
- Valida que o perfil `viewer` aplica tooltip correto
- Valida que o perfil `editor` gera botões habilitados

Os resultados aparecem no console do navegador via `console.assert`.
