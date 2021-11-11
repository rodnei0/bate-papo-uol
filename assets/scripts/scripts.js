let nomeUsuario = undefined;
let tipo = "";
let arrayDeMensagens = [];

entrarNoBatePapo()

function entrarNoBatePapo() {
        nomeUsuario = { name: prompt("Digite o seu nome de usuário:")};
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nomeUsuario);
        
        promise.then(quandoSucesso);
        promise.catch(quandoErro);
}

function quandoSucesso(sucesso) {
    buscarDados()
    setInterval(buscarDados, 3000);
    setInterval(manterOnline, 4000);
}

function quandoErro(erro) {
    alert("Este nome de usuário já está em uso, por favor escolha outro nome");
    entrarNoBatePapo()
}

function manterOnline() {
    const promise2 = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nomeUsuario);
}

function buscarDados() {
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(processarResposta);
}

function processarResposta(elemento) {
    inserirMensagens(elemento.data);
}

function inserirMensagens(elemento) {
    for (let i = 0; i < elemento.length; i++) {
        if (elemento[i].type === "status") {
            tipo = "status";
        } else if (elemento[i].type === "private_message") {
            tipo = "private";
        } else {
            tipo = "";
        }
        
        arrayDeMensagens.push(`
        <div class="mensagem ${tipo}">
            <span class="tempo">(${elemento[i].time})</span>
            <span class="nomes">${elemento[i].from} para ${elemento[i].to}:</span>
            <span class="texto">${elemento[i].text}</span>
        </div>
        `);
        
        const documento = document.querySelector(".container section");
        documento.innerHTML = arrayDeMensagens.join(" ");
        
        const aparecerUltimaMensagem = document.querySelectorAll(".mensagem");
        aparecerUltimaMensagem[aparecerUltimaMensagem.length-1].scrollIntoView();
    }
}