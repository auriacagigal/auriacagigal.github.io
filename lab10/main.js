document.addEventListener("DOMContentLoaded", () => {
    // Inicializa o localStorage com a chave "produtos-selecionados" como string vazia, caso não exista
    if (!localStorage.getItem("produtos-selecionados")) {
        localStorage.setItem("produtos-selecionados", "");
    }

    // Faz a requisição para obter os produtos
    fetch("https://deisishop.pythonanywhere.com/products")
    .then(response => response.json())
    .then(produtos => console.log(produtos))  
    
    
});

// Função para carregar os produtos disponíveis
function carregarProdutos(produtos) {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; // Limpa o contêiner antes de carregar os produtos

    produtos.forEach(produto => {
        const article = document.createElement("article");

        const titulo = document.createElement("h3");
        titulo.textContent = produto.title;

        const imagem = document.createElement("img");
        imagem.src = produto.image;
        imagem.alt = produto.title;

        const preco = document.createElement("span");
        preco.textContent = `Preço: €${produto.price.toFixed(2)}`;

        const botaoAdicionar = document.createElement("button");
        botaoAdicionar.textContent = "+ Adicionar ao Cesto";
        botaoAdicionar.addEventListener("click", () => adicionarProdutoCesto(produto.id));

        article.appendChild(imagem);
        article.appendChild(titulo);
        article.appendChild(preco);
        article.appendChild(botaoAdicionar);

        productContainer.appendChild(article);
    });

   
}

// Função para adicionar um produto ao cesto
function adicionarProdutoCesto(produtoId) {
    let produtosSelecionados = localStorage.getItem("produtos-selecionados").split(",").filter(Boolean);

    if (!produtosSelecionados.includes(String(produtoId))) {
        produtosSelecionados.push(produtoId); // Adiciona o ID do produto à lista
        localStorage.setItem("produtos-selecionados", produtosSelecionados.join(",")); // Atualiza o localStorage
        atualizaCesto(); // Atualiza o cesto
    }
}

// Função para atualizar o cesto
function atualizaCesto() {
    const basketContainer = document.getElementById("basket-container");
    basketContainer.innerHTML = ""; // Limpa o conteúdo existente

    const produtosSelecionados = localStorage.getItem("produtos-selecionados").split(",").filter(Boolean);

    if (produtosSelecionados.length === 0) {
        basketContainer.textContent = "Nenhum produto no cesto.";
        atualizaPrecoTotal(0);
        return;
    }

    // Requisição para carregar os produtos novamente (para garantir que a lista está atualizada)
    fetch("https://deisishop.pythonanywhere.com/products")
        .then(response => response.json())
        .then(produtos => {
            produtosSelecionados.forEach(id => {
                const produto = produtos.find(p => p.id === Number(id));
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

// Função para criar o elemento do produto no cesto
function criaProdutoCesto(produto) {
    const article = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const preco = document.createElement("span");
    preco.textContent = `Preço: €${produto.price.toFixed(2)}`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", () => removerProdutoCesto(produto.id));

    article.appendChild(imagem);
    article.appendChild(titulo);
    article.appendChild(preco);
    article.appendChild(botaoRemover);

    return article;
}

// Função para remover um produto do cesto
function removerProdutoCesto(produtoId) {
    let produtosSelecionados = localStorage.getItem("produtos-selecionados").split(",").filter(Boolean);

    produtosSelecionados = produtosSelecionados.filter(id => Number(id) !== produtoId);
    localStorage.setItem("produtos-selecionados", produtosSelecionados.join(",")); // Atualiza o localStorage
    atualizaCesto(); // Atualiza o cesto
}

// Função para calcular e atualizar o preço total
function atualizaPrecoTotal(produtos = [], produtosSelecionados = []) {
    const precoTotalElement = document.getElementById("preco-total");

    const total = produtosSelecionados.reduce((soma, id) => {
        const produto = produtos.find(p => p.id === Number(id));
        return produto ? soma + produto.price : soma;
    }, 0);

    precoTotalElement.textContent = `Preço total: €${total.toFixed(2)}`;
}
