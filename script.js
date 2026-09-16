const STORAGE_KEY = 'produtos-loja-simples';

const produtosIniciais = [
  'Caderno - R$ 12.50 (30 un.)',
  'Caneta - R$ 2.00 (100 un.)',
  'Mochila - R$ 89.90 (8 un.)',
  'Estojo - R$ 15.00 (20 un.)'
];

function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

  if (!Array.isArray(produtos) || produtos.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtosIniciais));
    return produtosIniciais;
  }

  return produtos;
}

function salvarProdutos(produtos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-produto');
  const listaProdutos = document.getElementById('lista-produtos');
  const inputArquivo = document.getElementById('arquivo');
  const nomeArquivo = document.getElementById('nome-arquivo');

  const renderizar = (produtos) => {
    listaProdutos.innerHTML = '';
    produtos.forEach((produto) => {
      const item = document.createElement('li');
      item.textContent = produto;
      listaProdutos.appendChild(item);
    });
  };

  renderizar(carregarProdutos());

  inputArquivo.addEventListener('change', () => {
    const arquivo = inputArquivo.files[0];
    nomeArquivo.textContent = arquivo ? arquivo.name : 'Nenhum arquivo selecionado';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const preco = Number(document.getElementById('preco').value);
    const quantidade = Number(document.getElementById('quantidade').value);
    const arquivo = inputArquivo.files[0];

    if (!nome || Number.isNaN(preco) || Number.isNaN(quantidade) || preco < 0 || quantidade < 0) {
      alert('Preencha os campos corretamente.');
      return;
    }

    const descricao = `${nome} - R$ ${preco.toFixed(2)} (${quantidade} un.)`;
    const produto = arquivo ? `${descricao} | Arquivo: ${arquivo.name}` : descricao;
    const produtos = carregarProdutos();

    produtos.push(produto);
    salvarProdutos(produtos);
    renderizar(produtos);

    form.reset();
    nomeArquivo.textContent = 'Nenhum arquivo selecionado';
    document.getElementById('nome').focus();
  });
});