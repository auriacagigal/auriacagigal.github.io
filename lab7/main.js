       
 // Seleciona o elemento <h1> pelo ID correto
 const titulo = document.querySelector("#tituloMudaCor");

 // Evento mouseover para alterar a cor do título quando o mouse passa sobre ele
 titulo.addEventListener("mouseover", function() {
     titulo.style.color = "red"; // Altera a cor para vermelho
 });

 // Evento mouseout para voltar à cor original quando o mouse sai do título
 titulo.addEventListener("mouseout", function() {
     titulo.style.color = "#4CAF50"; // Volta à cor original (preto)
 });

 //------------------------------------

// Seleciona todas as divs com a classe "country-item"
const countryItems = document.querySelectorAll(".country-item");

// Adiciona o evento de duplo clique (dblclick) a cada uma das divs selecionadas
countryItems.forEach(item => {
    item.addEventListener("dblclick", function() {
        // Altera a cor de fundo da div ao dar um duplo clique
        item.style.backgroundColor = "#FFD700"; // Altera a cor para amarelo dourado, por exemplo
    });
});

//------------------------------------

// Seleciona o formulário e o campo de entrada
const formulario = document.querySelector("#formularioPais");
const campoPais = document.querySelector("#pais");

// Adiciona um evento de envio ao formulário
formulario.addEventListener("submit", function(event) {
    

    // nome do país digitado
    const nomePais = campoPais.value.trim();

    // Verifica se o campo não está vazio e exibe a mensagem
    if (nomePais) {
        alert(`${nomePais} é lindo!`);
        formulario.submit(); // Envia o formulário após exibir a mensagem
    } else {
        alert("Por favor, digite o nome de um país.");
    }
});


