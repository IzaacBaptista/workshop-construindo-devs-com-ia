const state = {
  role: "viewer", // viewer | editor
  search: "",
  customers: [
    { id: 1, name: "Ana Souza", city: "Jaraguá do Sul/SC", status: "Ativo" },
    { id: 2, name: "João Pereira", city: "Joinville/SC", status: "Ativo" },
    { id: 3, name: "Maria Silva", city: "Blumenau/SC", status: "Inativo" },
    { id: 4, name: "Carlos Lima", city: "Curitiba/PR", status: "Ativo" },
    { id: 5, name: "Beatriz Costa", city: "Florianópolis/SC", status: "Ativo" },
    { id: 6, name: "Pedro Almeida", city: "São Paulo/SP", status: "Inativo" },
  ],
};

const els = {
  roleSelect: document.getElementById("roleSelect"),
  searchInput: document.getElementById("searchInput"),
  list: document.getElementById("list"),
  rolePill: document.getElementById("rolePill"),
  countPill: document.getElementById("countPill"),
};

const VIEWER_TOOLTIP = "Essa ação não é permitida para este perfil";

function canMutate() {
  return state.role === "editor";
}

function setRole(role) {
  state.role = role;
  render();
}

function setSearch(value) {
  state.search = value;
  render();
}

function filteredCustomers() {
  const q = state.search.trim().toLowerCase();
  if (!q) return state.customers;
  return state.customers.filter((c) => c.name.toLowerCase().includes(q));
}

function actionButtonAttrs() {
  if (canMutate()) {
    return {
      disabledAttr: "",
      className: "",
      title: "",
      ariaDisabled: "false",
    };
  }

  return {
    disabledAttr: "disabled",
    className: "is-disabled",
    title: VIEWER_TOOLTIP,
    ariaDisabled: "true",
  };
}

function renderList(targetEl, data) {
  const attrs = actionButtonAttrs();

  targetEl.innerHTML = data
    .map((c) => {
      return `
        <article class="card" data-id="${c.id}">
          <div class="head">
            <div>
              <div class="name">${escapeHtml(c.name)}</div>
              <div class="city">${escapeHtml(c.city)}</div>
            </div>
            <span class="badge">${escapeHtml(c.status)}</span>
          </div>

          <div class="actions">
            <button class="${attrs.className}" data-action="edit" ${attrs.disabledAttr} title="${attrs.title}" aria-disabled="${attrs.ariaDisabled}">Editar</button>
            <button class="danger ${attrs.className}" data-action="delete" ${attrs.disabledAttr} title="${attrs.title}" aria-disabled="${attrs.ariaDisabled}">Excluir</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function render() {
  els.rolePill.textContent = `Perfil atual: ${state.role}`;
  const data = filteredCustomers();
  els.countPill.textContent = `${data.length} cliente(s)`;

  renderList(els.list, data);
}

els.list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  if (!canMutate() || btn.hasAttribute("disabled")) {
    return;
  }

  const card = e.target.closest(".card");
  if (!card) return;

  const id = Number(card.dataset.id);
  const action = btn.dataset.action;

  if (action === "delete") {
    state.customers = state.customers.filter((c) => c.id !== id);
    render();
    return;
  }

  if (action === "edit") {
    const customer = state.customers.find((c) => c.id === id);
    const newName = prompt("Novo nome do cliente:", customer?.name ?? "");
    if (!newName) return;

    state.customers = state.customers.map((c) =>
      c.id === id ? { ...c, name: newName } : c
    );
    render();
  }
});

els.roleSelect.addEventListener("change", (e) => setRole(e.target.value));
els.searchInput.addEventListener("input", (e) => setSearch(e.target.value));

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function runValidationTests() {
  const testCustomers = state.customers.slice(0, 1);
  const temp = document.createElement("div");

  state.role = "viewer";
  renderList(temp, testCustomers);
  const viewerButtons = temp.querySelectorAll("button[data-action]");
  console.assert(
    Array.from(viewerButtons).every((b) => b.disabled),
    "[RBAC] Viewer deve ter botões desabilitados"
  );
  console.assert(
    Array.from(viewerButtons).every((b) => b.title === VIEWER_TOOLTIP),
    "[RBAC] Viewer deve ter tooltip de permissão"
  );

  state.role = "editor";
  renderList(temp, testCustomers);
  const editorButtons = temp.querySelectorAll("button[data-action]");
  console.assert(
    Array.from(editorButtons).every((b) => !b.disabled),
    "[RBAC] Editor deve ter botões habilitados"
  );

  state.role = els.roleSelect.value;
}

render();
runValidationTests();
