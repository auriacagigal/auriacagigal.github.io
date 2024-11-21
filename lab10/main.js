document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos(); // Obtém os produtos da API ao iniciar
    atualizaCesto(); // Atualiza o cesto ao carregar a página
});

// Função para buscar os produtos da API
function fetchProdutos() {
    fetch("https://deisishop.pythonanywhere.com/products")
        .then(response => {
            console.log("Resposta do servidor:", response); // Verifica o status HTTP
            if (!response.ok) {
                throw new Error(`Erro ao obter produtos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(produtos => {
            console.log("Produtos recebidos:", produtos); // Exibe os produtos no console
            carregarProdutos(produtos); // Passa os produtos para a exibição
        })
        .catch(error => {
            console.error("Erro ao carregar produtos:", error); // Mostra o erro
            const productContainer = document.getElementById("product-container");
            productContainer.textContent = "Erro ao carregar produtos. Tente novamente mais tarde.";
        });
}

// Função para exibir os produtos na interface
function carregarProdutos(produtos) {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; // Limpa o contêiner antes de carregar os produtos

    produtos.forEach(produto => {
        const article = document.createElement("article");
        article.classList.add("produto"); // Adiciona uma classe para estilização

        const titulo = document.createElement("h3");
        titulo.textContent = produto.title;

        const imagem = document.createElement("img");
        imagem.src = produto.image;
        imagem.alt = produto.title;

        const descricao = document.createElement("p");
        descricao.textContent = produto.description;

        const preco = document.createElement("span");
        preco.textContent = `Preço: €${produto.price.toFixed(2)}`;

        const rating = document.createElement("span");
        rating.textContent = `Avaliação: ${produto.rating.rate} (${produto.rating.count} avaliações)`;

        const botaoAdicionar = document.createElement("button");
        botaoAdicionar.textContent = "+ Adicionar ao Cesto";
        botaoAdicionar.addEventListener("click", () => adicionarProdutoCesto(produto.id));

        // Monta o artigo do produto
        article.appendChild(imagem);
        article.appendChild(titulo);
        article.appendChild(descricao);
        article.appendChild(preco);
        article.appendChild(rating);
        article.appendChild(botaoAdicionar);

        // Adiciona o artigo ao contêiner
        productContainer.appendChild(article);
    });
}

// Função para adicionar produtos ao cesto
function adicionarProdutoCesto(produtoId) {
    const produtosSelecionados = getProdutosSelecionados();

    if (!produtosSelecionados.includes(produtoId)) {
        produtosSelecionados.push(produtoId); // Adiciona o ID do produto ao cesto
        setProdutosSelecionados(produtosSelecionados); // Atualiza o localStorage
        atualizaCesto(); // Atualiza o cesto na interface
    }
}

// Função para recuperar produtos selecionados do localStorage
function getProdutosSelecionados() {
    return JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
}

// Função para atualizar o localStorage com os produtos selecionados
function setProdutosSelecionados(produtos) {
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtos));
}

// Função para atualizar o cesto
function atualizaCesto() {
    const basketContainer = document.getElementById("basket-container");
    basketContainer.innerHTML = ""; // Limpa o contêiner do cesto

    const produtosSelecionados = getProdutosSelecionados();
    if (produtosSelecionados.length === 0) {
        basketContainer.textContent = "Nenhum produto no cesto.";
        atualizaPrecoTotal(0);
        return;
    }

    fetch("https://deisishop.pythonanywhere.com/products")
        .then(response => response.json())
        .then(produtos => {
            produtosSelecionados.forEach(id => {
                const produto = produtos.find(p => p.id === id);
                if (produto) {
                    const article = criaProdutoCesto(produto);
                    basketContainer.appendChild(article);
                }
            });

            atualizaPrecoTotal(produtos, produtosSelecionados);
        })
        .catch(error => {
            console.error("Erro ao atualizar o cesto:", error);
            basketContainer.textContent = "Erro ao atualizar o cesto.";
        });
}

// Função para criar o elemento de um produto no cesto
function criaProdutoCesto(produto) {
    const article = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const preco = document.createElement("span");
    preco.textContent = `Preço: €${produto.price.toFixed(2)}`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", () => removerProdutoCesto(produto.id));

    article.appendChild(titulo);
    article.appendChild(preco);
    article.appendChild(botaoRemover);

    return article;
}

// Função para remover um produto do cesto
function removerProdutoCesto(produtoId) {
    const produtosSelecionados = getProdutosSelecionados();
    const novosProdutosSelecionados = produtosSelecionados.filter(id => id !== produtoId);

    setProdutosSelecionados(novosProdutosSelecionados); // Atualiza o localStorage
    atualizaCesto(); // Atualiza o cesto na interface
}

// Função para calcular e atualizar o preço total
function atualizaPrecoTotal(produtos, produtosSelecionados) {
    const precoTotalElement = document.getElementById("preco-total");

    const total = produtosSelecionados.reduce((soma, id) => {
        const produto = produtos.find(p => p.id === id);
        return produto ? soma + produto.price : soma;
    }, 0);

    precoTotalElement.textContent = `Preço total: €${total.toFixed(2)}`;
}
