# Testes funcionais — Bug 2: Confirmação de exclusão de usuário

## Objetivo
Garantir que, ao excluir um usuário, o sistema exiba mensagem de confirmação e só execute a exclusão após o usuário confirmar.

---

## Pré-requisitos
- Acessar: [Mini CRM](https://izaacbaptista.github.io/workshop-construindo-devs-com-ia/) ou abrir `index.html` localmente.
- Perfil **Editor** selecionado (permite editar e excluir).

---

## Cenários de teste

### TC01 — Modal de confirmação é exibido ao clicar em Excluir
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Clicar em **Excluir** em qualquer card de cliente | Um modal é exibido com o título "Confirmar exclusão" |
| 2 | Verificar o texto do modal | Texto exibido: "Tem certeza que deseja excluir este usuário?" |
| 3 | Verificar os botões | Botões **Cancelar** e **Confirmar** estão visíveis |

**Validação:** A exclusão **não** ocorre até que o usuário clique em Confirmar.

---

### TC02 — Cancelar fecha o modal e não exclui
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Clicar em **Excluir** em um cliente | Modal de confirmação abre |
| 2 | Clicar em **Cancelar** | Modal fecha; o cliente permanece na lista |
| 3 | Verificar a lista | Quantidade de clientes inalterada; mesmo cliente ainda visível |

**Validação:** Nenhum dado é removido ao cancelar.

---

### TC03 — Confirmar exclui o usuário e fecha o modal
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Anotar a quantidade atual de clientes (ex.: 6) | — |
| 2 | Clicar em **Excluir** em um cliente específico (ex.: "Maria Silva") | Modal abre |
| 3 | Clicar em **Confirmar** | Modal fecha; o cliente some da lista |
| 4 | Verificar a lista | Quantidade de clientes diminui em 1; cliente excluído não aparece mais |

**Validação:** Exclusão só ocorre após confirmação explícita.

---

### TC04 — Fechar modal clicando no fundo (backdrop)
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Clicar em **Excluir** em um cliente | Modal abre |
| 2 | Clicar na área escura fora do modal (backdrop) | Modal fecha; cliente não é excluído |

**Validação:** Comportamento equivalente a Cancelar.

---

### TC05 — Tecla Escape fecha o modal
| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Clicar em **Excluir** em um cliente | Modal abre |
| 2 | Pressionar a tecla **Escape** | Modal fecha; cliente não é excluído |

**Validação:** Cancelamento por teclado funciona.

---

## Checklist de validação do bug corrigido
- [ ] Ao clicar em Excluir, uma mensagem/modal de confirmação é exibida.
- [ ] A mensagem contém algo como: "Tem certeza que deseja excluir este usuário?".
- [ ] É possível **cancelar** (botão, backdrop ou Escape) sem excluir.
- [ ] A exclusão só ocorre ao clicar em **Confirmar**.
- [ ] Não há exclusão imediata sem confirmação.

Quando todos os itens estiverem marcados, o problema descrito no Bug 2 está resolvido.

---

## Validação rápida (console do navegador)

Abra o DevTools (F12) → Console e cole o script abaixo. Ele verifica se o modal existe e se contém o texto esperado.

```javascript
(function () {
  const modal = document.getElementById("deleteModal");
  const ok = modal
    && modal.querySelector(".modal-title")?.textContent?.includes("Confirmar exclusão")
    && modal.querySelector(".modal-message")?.textContent?.includes("Tem certeza que deseja excluir este usuário?")
    && modal.querySelector("[data-action='cancel']")
    && modal.querySelector("[data-action='confirm']");
  console.log(ok ? "✅ Modal de confirmação configurado corretamente." : "❌ Falha: modal ou textos não encontrados.");
  return ok;
})();
```

Resultado esperado: `✅ Modal de confirmação configurado corretamente.`
