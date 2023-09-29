const URL = 'http://localhost:3400/produtos';
let modoEdicao = false;

let listaProduto = [];

let btnAdcionar = document.getElementById('btn-adcionar');
let tabelaProdutos = document.querySelector('table>tbody');
let modalProdutos = new bootstrap.Modal(document.getElementById("modal-produtos"), {});
let tituloModal = document.querySelector('h4.modal-title');
let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    valor: document.getElementById('valor'),
    estoque: document.getElementById('estoque'),
    observacao: document.getElementById('observacao'),
    cadastro: document.getElementById('cadastro'),
}

btnAdcionar.addEventListener('click', () => {
    modoEdicao = false;
    tituloModal.textContent = "Adcionar Produto"
    liimparModalProdutos();
    modalProdutos.show();
})

btnSalvar.addEventListener('click', () => {

    let produtos = obterProdutoDoModal();

    if (!produtos.valor || !produtos.nome) {
        alert("Valor e nome obrigatorios.")
        return;
    }

    if (modoEdicao) {
        atualizarProdutosBackEnd(produtos);
    } else {
        adcionarProdutosBackEnd(produtos);
    }


})

btnCancelar.addEventListener('click', () => {
    modalProdutos.hide();
})

function obterProdutoDoModal() {
    return new Produtos({
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeEstoque: formModal.estoque.value,
        observacao: formModal.observacao.value,

        dataCadastro:
            (formModal.cadastro.value)
                ? new Date(formModal.cadastro.value).toISOString()
                : new Date().toISOString()
    });
}

function obterProduto() {

    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': obterToken()
        }
    })
        .then(response => response.json())
        .then(produto => {
            listaProduto = produto;
            preencherTabela(produto);
        })
        .catch()
}

function editarProdutos(id) {
    modoEdicao = true;
    tituloModal.textContent = "Editar Produto"

    let produtos = listaProduto.find(produtos => produtos.id == id);

    atualizarModalProdutos(produtos);

    modalProdutos.show();

}

function atualizarModalProdutos(produtos) {
    formModal.id.value = produtos.id;
    formModal.nome.value = produtos.nome;
    formModal.valor.value = produtos.valor;
    formModal.estoque.value = produtos.quantidadeEstoque;
    formModal.observacao.value = produtos.observacao;
    formModal.cadastro.value = produtos.dataCadastro.substring(0, 10);
}

function liimparModalProdutos() {
    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.valor.value = "";
    formModal.estoque.value = "";
    formModal.observacao.value = "";
    formModal.cadastro.value = "";
}

function excluirProdutos(id) {

    let produtos = listaProduto.find(p => p.id == id);
    if (confirm("Deseja realmente excluir o produtos : " + produtos.nome)) {
        excluirProdutosBackEnd(produtos);
    }

}

function criarLinhaNaTabela(produtos) {

    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdEditar = document.createElement('td');
    let tdExcluir = document.createElement('td');


    tdId.textContent = produtos.id;
    tdNome.textContent = produtos.nome;
    tdValor.textContent = produtos.valor;
    tdEstoque.textContent = produtos.quantidadeEstoque;
    tdObservacao.textContent = produtos.observacao;
    tdDataCadastro.textContent = new Date(produtos.dataCadastro).toLocaleDateString();

    tdEditar.innerHTML = `<button onclick = "editarProdutos(${produtos.id})" class="btn btn-outline  btn-sm mr-3 "> <i class="fa-solid fa-file-pen fa-2xl"></i></button>`
    tdExcluir.innerHTML = `<button onclick="excluirProdutos(${produtos.id})" class="btn btn-outline btn-sm mr-3"> <i class="fa-solid fa-trash fa-2xl"></i></button>`


    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdEditar);
    tr.appendChild(tdExcluir);



    tabelaProdutos.appendChild(tr);
}

function preencherTabela(produto) {

    tabelaProdutos.textContent = "";

    produto.forEach(produtos => {
        criarLinhaNaTabela(produtos);

    });
}

function adcionarProdutosBackEnd(produtos) {

    produtos.dataCadastro = new Date().toISOString();

    fetch(URL, {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(produtos)
    })

        .then(response => response.json())
        .then(response => {
            let novoProdutos = new Produtos(response);
            listaProduto.push(novoProdutos);

            preencherTabela(listaProduto)

            modalProdutos.hide();

        })
        .catch(error =>{
            console.log(error)
        })
}

function atualizarProdutosBackEnd(produtos) {
    fetch(`${URL}/${produtos.id}`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(produtos)
    })

        .then(response => response.json())
        .then(() => {
            atualizarProdutosNaLista(produtos, false);
            modalProdutos.hide();
        })
        .catch(error => {
            console.log(error)
        })
}

function excluirProdutosBackEnd(produtos) {
    fetch(`${URL}/${produtos.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        }
    })
    .then(response => response.json())
    .then(() => {
        atualizarProdutosNaLista(produtos, true);
        modalProdutos.hide();

    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarProdutosNaLista(produtos, removerProdutos) {

    let indice = listaProduto.findIndex((p) => p.id == produtos.id);

    (removerProdutos) 
        ? listaProduto.splice(indice, 1)
        : listaProduto.splice(indice, 1, produtos);

    preencherTabela(listaProduto);

}


obterProduto();