let nomeUsuario;
let tipo = "";
let arrayDeMensagens = [];

entrarNoBatePapo()

function reset() {
    alert("Você esta offline, por favor entre novamente");
    window.location.reload();
}

function entrarNoBatePapo() {
        nomeUsuario = { name: prompt("Digite o seu nome de usuário:")};
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nomeUsuario);
        
        promise.then(quandoSucessoEntrar);
        promise.catch(quandoErroEntrar);
}

function quandoSucessoEntrar(sucesso) {
    buscarDados();
    setInterval(buscarDados, 3000);
    setInterval(manterOnline, 5000);
}

function quandoErroEntrar(erro) {
    alert("Este nome de usuário já está em uso, por favor escolha outro nome");
    window.location.reload();
}

function manterOnline() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nomeUsuario);
    console.log("Estou online rss");
    
    promise.catch(reset);
}

function buscarDados() {
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(processarResposta);

    resposta.catch(reset);
}

function processarResposta(elemento) {
    inserirMensagens(elemento.data);
}

function inserirMensagens(elemento) {
    arrayDeMensagens = [];
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
            <span class="texto" data-identifier="message">${elemento[i].text}</span>
        </div>
        `);
        
        const documento = document.querySelector(".container section");
        documento.innerHTML = arrayDeMensagens.join(" ");
        
        const aparecerUltimaMensagem = document.querySelectorAll(".mensagem");
        aparecerUltimaMensagem[aparecerUltimaMensagem.length-1].scrollIntoView();
    }
}

function enviarMensagem() {
    let mensagem = document.querySelector(".inputMensagem");

    const requisicao = {
        from: nomeUsuario.name,
        to: "Todos",
        text: mensagem.value,
        type: "message"    
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", requisicao);

    promise.then(quandoSucessoMensagem);
    promise.catch(reset);

    mensagem.value = "";
}

function quandoSucessoMensagem(sucesso) {
    console.log("Mensagem enviada!");
    buscarDados();
}