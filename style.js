const form = document.getElementById("item-form");
const lista = document.getElementById("lista-itens");
const nome = document.getElementById("nome");
const preco = document.getElementById("preco");
const descricao = document.getElementById("descricao");
const categoria = document.getElementById("categoria");
const cep = document.getElementById("cep");
const idInput = document.getElementById("item-id");
const msgApi = document.getElementById("mensagem-api");

let itens = JSON.parse(localStorage.getItem("itens")) || [];

function renderLista() {
  lista.innerHTML = "";
  itens.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)}<br>
      ${item.descricao}<br>
      Categoria: ${item.categoria}<br>
      <div class="item-buttons">
        <button onclick="editarItem(${index})">Editar</button>
        <button onclick="removerItem(${index})">Remover</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

function validarInput(input) {
  if (!input.value.trim()) {
    input.classList.add("invalid");
    input.classList.remove("valid");
    return false;
  } else {
    input.classList.remove("invalid");
    input.classList.add("valid");
    return true;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isNomeValido = validarInput(nome);
  const isPrecoValido = validarInput(preco);
  const isDescValida = validarInput(descricao);
  const isCategoriaValida = validarInput(categoria);

  if (!(isNomeValido && isPrecoValido && isDescValida && isCategoriaValida)) {
    return;
  }

  const item = {
    nome: nome.value,
    preco: parseFloat(preco.value),
    descricao: descricao.value,
    categoria: categoria.value
  };

  if (idInput.value) {
    itens[+idInput.value] = item;
  } else {
    itens.push(item);
  }

  localStorage.setItem("itens", JSON.stringify(itens));
  form.reset();
  idInput.value = "";
  renderLista();
});

function editarItem(index) {
  const item = itens[index];
  nome.value = item.nome;
  preco.value = item.preco;
  descricao.value = item.descricao;
  categoria.value = item.categoria;
  idInput.value = index;
}

function removerItem(index) {
  itens.splice(index, 1);
  localStorage.setItem("itens", JSON.stringify(itens));
  renderLista();
}

cep.addEventListener("blur", () => {
  const valor = cep.value.replace(/\D/g, "");
  if (valor.length === 8) {
    buscarCep(valor).then(data => {
      msgApi.innerText = `Endereço: ${data.logradouro}, ${data.bairro}, ${data.localidade}`;
    }).catch(err => {
      msgApi.innerText = "CEP inválido!";
    });
  }
});

function buscarCep(cep) {
  return new Promise((resolve, reject) => {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (data.erro) reject("Erro");
        else resolve(data);
      });
  });
}

renderLista();
