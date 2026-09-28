function gerarImagemPadrao(nome = 'Produto') {
  const texto = String(nome).trim() || 'Produto';
  const textoSeguro = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="24" fill="#151821"/>
      <rect x="20" y="20" width="200" height="200" rx="22" fill="url(#grad)" opacity="0.9"/>
      <circle cx="120" cy="88" r="34" fill="rgba(255,255,255,0.24)"/>
      <path d="M78 158c8-30 26-44 42-44s34 14 42 44" fill="rgba(255,255,255,0.24)"/>
      <text x="120" y="184" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="700">${textoSeguro}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const imagensProdutos = {
  borracha: 'img/borracha.png',
  caderno: 'img/caderno.png',
  caneta: 'img/caneta.png',
  estojo: 'img/estojo.png',
  fichario: 'img/fichario.png',
  mochila: 'img/mochila.png'
};

function criarProduto({ nome, preco, quantidade, imagem }) {
  const nomeFormatado = String(nome || 'Produto').trim() || 'Produto';
  const nomeNormalizado = nomeFormatado.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  return {
    nome: nomeFormatado,
    preco: Number(preco) || 0,
    quantidade: Number(quantidade) || 0,
    imagem: imagem || imagensProdutos[nomeNormalizado] || gerarImagemPadrao(nomeFormatado)
  };
}

const produtos = [
  criarProduto({ nome: 'Borracha', preco: 1.5, quantidade: 50 }),
  criarProduto({ nome: 'Caderno', preco: 12.5, quantidade: 30 }),
  criarProduto({ nome: 'Caneta', preco: 2, quantidade: 100 }),
  criarProduto({ nome: 'Estojo', preco: 15, quantidade: 20 }),
  criarProduto({ nome: 'Fichário', preco: 24.9, quantidade: 12 }),
  criarProduto({ nome: 'Mochila', preco: 89.9, quantidade: 8 })
];

let indiceEmEdicao = null;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-produto');
  const inputNome = document.getElementById('nome');
  const inputPreco = document.getElementById('preco');
  const inputQuantidade = document.getElementById('quantidade');
  const inputArquivo = document.getElementById('arquivo');
  const botaoSubmit = document.getElementById('botao-submit');
  const listaProdutos = document.getElementById('lista-produtos');
  const contadorProdutos = document.getElementById('contador-produtos');
  const listaVazia = document.getElementById('lista-vazia');
  const mensagemValidacao = document.getElementById('mensagem-validacao');
  const nomeArquivo = document.getElementById('nome-arquivo');
  const previewContainer = document.getElementById('preview-imagem-container');
  const previewImagem = document.getElementById('preview-imagem');

  function atualizarResumo() {
    contadorProdutos.textContent = `Produtos cadastrados: ${produtos.length}`;
    listaVazia.hidden = produtos.length !== 0;
  }

  function limparFormulario() {
    form.reset();
    indiceEmEdicao = null;
    botaoSubmit.textContent = 'Adicionar produto';
    mensagemValidacao.textContent = '';
    previewContainer.hidden = true;
    previewImagem.src = '';
    nomeArquivo.textContent = 'Nenhum arquivo selecionado';
  }

  function iniciarEdicao(indice) {
    const produto = produtos[indice];
    indiceEmEdicao = indice;

    inputNome.value = produto.nome;
    inputPreco.value = produto.preco;
    inputQuantidade.value = produto.quantidade;
    botaoSubmit.textContent = 'Salvar alterações';
    mensagemValidacao.textContent = '';

    previewImagem.src = produto.imagem;
    previewContainer.hidden = false;
    nomeArquivo.textContent = 'Imagem atual do produto';

    inputNome.focus();
  }

  function removerProduto(indice) {
    produtos.splice(indice, 1);

    if (indiceEmEdicao === indice) {
      limparFormulario();
    } else if (indiceEmEdicao !== null && indice < indiceEmEdicao) {
      indiceEmEdicao--;
    }

    renderizar();
  }

  function renderizar() {
    listaProdutos.innerHTML = '';

    produtos.forEach((produto, indice) => {
      const item = document.createElement('li');
      item.className = 'produto-item';

      const imagem = document.createElement('img');
      imagem.src = produto.imagem;
      imagem.alt = produto.nome;
      imagem.className = 'produto-imagem';

      const info = document.createElement('div');
      info.className = 'produto-info';

      const nome = document.createElement('span');
      nome.className = 'produto-nome';
      nome.textContent = produto.nome;

      const preco = document.createElement('span');
      preco.className = 'produto-preco';
      preco.textContent = `R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}`;

      const quantidade = document.createElement('span');
      quantidade.className = 'produto-quantidade';
      quantidade.textContent = `${produto.quantidade} un.`;

      const acoes = document.createElement('div');
      acoes.className = 'produto-acoes';

      const botaoEditar = document.createElement('button');
      botaoEditar.type = 'button';
      botaoEditar.className = 'botao-editar';
      botaoEditar.textContent = 'Editar';
      botaoEditar.addEventListener('click', () => iniciarEdicao(indice));

      const botaoRemover = document.createElement('button');
      botaoRemover.type = 'button';
      botaoRemover.className = 'botao-remover';
      botaoRemover.textContent = 'Remover';
      botaoRemover.addEventListener('click', () => removerProduto(indice));

      info.append(nome, preco, quantidade);
      acoes.append(botaoEditar, botaoRemover);
      item.append(imagem, info, acoes);
      listaProdutos.appendChild(item);
    });

    atualizarResumo();
  }

  function atualizarPreview() {
    const arquivo = inputArquivo.files[0];

    if (!arquivo) {
      if (indiceEmEdicao !== null) {
        previewImagem.src = produtos[indiceEmEdicao].imagem;
        previewContainer.hidden = false;
        nomeArquivo.textContent = 'Imagem atual do produto';
      } else {
        previewContainer.hidden = true;
        previewImagem.src = '';
        nomeArquivo.textContent = 'Nenhum arquivo selecionado';
      }
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      previewImagem.src = leitor.result;
      previewContainer.hidden = false;
    };
    leitor.readAsDataURL(arquivo);
    nomeArquivo.textContent = arquivo.name;
  }

  function lerImagem(nome) {
    const arquivo = inputArquivo.files[0];

    return new Promise((resolve) => {
      if (!arquivo) {
        if (indiceEmEdicao !== null) {
          resolve(produtos[indiceEmEdicao].imagem);
        } else {
          resolve(gerarImagemPadrao(nome));
        }
        return;
      }

      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.readAsDataURL(arquivo);
    });
  }

  inputArquivo.addEventListener('change', atualizarPreview);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const preco = Number(inputPreco.value);
    const quantidade = Number(inputQuantidade.value);

    mensagemValidacao.textContent = '';

    if (!nome || Number.isNaN(preco) || preco < 0 || Number.isNaN(quantidade)) {
      mensagemValidacao.textContent = 'Preencha os campos corretamente.';
      return;
    }

    if (quantidade <= 0) {
      mensagemValidacao.textContent = 'A quantidade deve ser maior que zero.';
      inputQuantidade.focus();
      return;
    }

    const imagem = await lerImagem(nome);
    const produtoAtualizado = criarProduto({ nome, preco, quantidade, imagem });

    if (indiceEmEdicao === null) {
      produtos.push(produtoAtualizado);
    } else {
      produtos[indiceEmEdicao] = produtoAtualizado;
    }

    limparFormulario();
    renderizar();
    inputNome.focus();
  });

  renderizar();
});