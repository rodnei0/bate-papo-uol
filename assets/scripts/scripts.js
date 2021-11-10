buscarDados();

let tipo = "";
let arrayDeMensagens = [];
let contador = 0;

function buscarDados() {
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(processarResposta);
}

function processarResposta(elemento) {
    setInterval(inserirMensagens, 3000, elemento.data);
    // inserirMensagens(elemento.data);
}

function inserirMensagens(elemento) {
    // console.log(elemento);

    // for (let i = 0; i < 20; i++) {
        
        
        if (elemento[contador].type === "status") {
            tipo = "status";
        } else if (elemento[contador].type === "private_message") {
            tipo = "private";
        } else {
            tipo = "";
        }
        
        arrayDeMensagens.push(`
        <div class="mensagem ${tipo}">
        <span class="tempo">(${elemento[contador].time})</span>
        <span class="nomes">${elemento[contador].from} para ${elemento[contador].to}:</span>
        <span class="texto">${elemento[contador].text}</span>
        </div>
        `);
        
        const documento = document.querySelector(".container section");
        documento.innerHTML = arrayDeMensagens.join(" ");
        
        const aparecerUltimaMensagem = document.querySelectorAll(".mensagem");
        aparecerUltimaMensagem[aparecerUltimaMensagem.length-1].scrollIntoView();

        contador++;
    // }
}