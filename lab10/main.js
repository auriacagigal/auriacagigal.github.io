// Inicializa o `localStorage` com a chave 'produtos-selecionados' caso ela não exista
if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

// Variável global para armazenar os produtos carregados da API
let produtos = [];

// Função para carregar os produtos da API
fetch("https://deisishop.pythonanywhere.com/products/")
    .then(response => response.json())
    .then(data => {
        produtos = data; // Salva os produtos na variável global
        carregarProdutos(produtos); // Renderiza os produtos
    })
    .catch(error => console.error("Erro ao carregar produtos:", error));

// Função para carregar as categorias dinamicamente
fetch("https://deisishop.pythonanywhere.com/categories/")
    .then(response => response.json())
    .then(categorias => {
        const filtroCategoria = document.getElementById("filtro-categoria");
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria;
            option.textContent = categoria;
            filtroCategoria.appendChild(option);
        });
    })
    .catch(error => console.error("Erro ao carregar categorias:", error));

// Função para carregar os produtos na interface
function carregarProdutos(produtos) {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; // Limpa o contêiner antes de renderizar

    produtos.forEach(produto => {
        const article = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = produto.title;

        const image1 = document.createElement("img");
        image1.src = produto.image;
        image1.alt = produto.title;

        const price = document.createElement("h4");
        price.textContent = `€${produto.price.toFixed(2)}`;

        const description = document.createElement("p");
        description.textContent = produto.description;

        const rating= document.createElement("img");
       rating.textContent = produto.rating;


        const button = document.createElement("button");
        button.textContent = "+ Adicionar ao Cesto";
        button.addEventListener("click", () => adicionarAoCesto(produto));

        article.append(title, image1, price, description,rating, button);
        productContainer.appendChild(article);
    });
}

// Função para adicionar um produto ao cesto
function adicionarAoCesto(produto) {
    const produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
    produtosSelecionados.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));
    atualizaCesto();
}

// Função para atualizar o cesto
function atualizaCesto() {
    const basketContainer = document.getElementById("basket-container");
    basketContainer.innerHTML = ""; // Limpa o cesto

    const produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
    let total = 0;

    produtosSelecionados.forEach(produto => {
        const article = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = produto.title;

        const image = document.createElement("img");
        image.src = produto.image;
        image.alt = produto.title;

        const price = document.createElement("h4");
        price.textContent = `€${produto.price.toFixed(2)}`;

        const button = document.createElement("button");
        button.textContent = "- Remover";
        button.addEventListener("click", () => removerDoCesto(produto.id));

        article.append(title, price, button);
        basketContainer.appendChild(article);

        total += produto.price;
    });

    const precoTotal = document.getElementById("preco-total");
    precoTotal.textContent = `Preço total: €${total.toFixed(2)}`;
}

// Função para remover um produto do cesto
function removerDoCesto(produtoId) {
    let produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
    produtosSelecionados = produtosSelecionados.filter(produto => produto.id !== produtoId);
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));
    atualizaCesto();
}

// Configura eventos para filtros, ordenação e pesquisa
document.getElementById("filtro-categoria").addEventListener("change", () => {
    const categoriaSelecionada = document.getElementById("filtro-categoria").value;
    if (categoriaSelecionada === "todas") {
        carregarProdutos(produtos);
    } else {
        const produtosFiltrados = produtos.filter(produto => produto.category === categoriaSelecionada);
        carregarProdutos(produtosFiltrados);
    }
});

document.getElementById("ordenar-rating").addEventListener("change", () => {
    const ordem = document.getElementById("ordenar-preco").value;
    let produtosOrdenados = [...produtos];
    if (ordem === "ascendente") {
        produtosOrdenados.sort((a, b) => a.price - b.price);
    } else if (ordem === "descendente") {
        produtosOrdenados.sort((a, b) => b.price - a.price);
    }
    carregarProdutos(produtosOrdenados);
});

document.getElementById("pesquisar").addEventListener("input", () => {
    const termo = document.getElementById("pesquisar").value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto =>
        produto.title.toLowerCase().includes(termo)
    );
    carregarProdutos(produtosFiltrados);
});

// Finaliza a compra
document.getElementById("botao-comprar").addEventListener("click", () => {
    const produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
    const ids = produtosSelecionados.map(produto => produto.id);

    fetch("https://deisishop.pythonanywhere.com/buy/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: ids })
    })
        .then(response => response.json())
        .then(data => {
            alert(`Compra finalizada! Referência: ${data.reference}`);
            localStorage.setItem("produtos-selecionados", JSON.stringify([])); // Limpa o cesto
            atualizaCesto();
        })
        .catch(error => console.error("Erro ao finalizar a compra:", error));
});

// Inicializa o cesto ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    atualizaCesto();
});

// Função para configurar o botão de compra
function comprar() {
    const botaoComprar = document.getElementById("botao"); // Seleciona o botão de compra
    let counter = 1; // Contador para gerenciar a exibição de mensagens

    botaoComprar.onclick = function () {
        let idProdutos = []; // Lista de IDs dos produtos no carrinho
        const produtosCarrinho = JSON.parse(localStorage.getItem('produtos-selecionados'));
        produtosCarrinho.forEach(produto => {
            idProdutos.push(produto.id); // Adiciona o ID do produto à lista
        });

        const checkBox = document.getElementById("alunoDeisi"); // Seleciona o checkbox de desconto
        const cupaoDesconto = document.getElementById("cupao"); // Seleciona o campo de cupom
        const bodyEnvio = {
            products: idProdutos, // IDs dos produtos
            student: checkBox.checked, // Indica se é estudante
            coupon: cupaoDesconto.value // Código do cupom
        };

        fetch('https://deisishop.pythonanywhere.com/buy/', {
            method: 'POST', // Envia os dados via POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyEnvio) // Converte os dados para JSON
        })
            .then(response => response.json())
            .then(data => {
                const section = document.getElementById("checkout"); // Seleciona a seção de checkout

                if (counter === 1) {
                    // Exibe o valor final com desconto
                    const newH3 = document.createElement('h3');
                    newH3.id = "desconto";
                    newH3.textContent = "Valor final a pagar (com eventuais descontos): ";
                    section.append(newH3);
                }

                const h3Alterar = document.getElementById("desconto");
                h3Alterar.textContent = "Valor final a pagar (com eventuais descontos): " + data.totalCost + " €";

                if (counter === 1) {
                    // Exibe a referência de pagamento
                    const newP = document.createElement('p');
                    newP.textContent = "Referência de pagamento: " + data.reference;
                    newP.id = "referencia";
                    section.append(newP);
                }

                const pReferencia = document.getElementById("referencia");
                pReferencia.textContent = "Referência de pagamento: " + data.reference;

                counter++;
            });
    };
}



function removeAux(){
    const basketContainer = document.getElementById("basket-container");
    basketContainer.innerHTML = ""; // Limpa o cesto
}
// Função para remover todos os produtos do carrinho
function removerTudoDoCarrinho() {

    let produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
    produtosSelecionados = produtosSelecionados.filter(produto => produto!== produtoId);
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));
    removeAux();
}

// Evento do botão "Remover Todos"
document.getElementById("removerTodosBtn").addEventListener("click", removerTudoDoCarrinho);

function minimizaInfo(){
    const removProduct=document.querySelector("produtos section ul");
    removProduct.forEach(description => {
        description.remove();
    });
}

// Evento do botão "Remover a descrição"
document.getElementById("menosInfo").addEventListener("click", minimizaInfo);