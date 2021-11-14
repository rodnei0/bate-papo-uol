let nomeUsuario;
let tipo = "";
let privacidade = "message";
let para = "Todos";
let arrayDeMensagens = [];
let arrayFiltrada = [];
let arrayDeUsuarios = [];
let jaEntrei = false;

function entrarNoBatePapo() {
    jaEntrei = true;
    nomeUsuario = { name: document.querySelector(".inputUsuario").value};
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nomeUsuario);
    promise.then(quandoSucessoEntrar);
    promise.catch(quandoErroEntrar);
}

function quandoSucessoEntrar(sucesso) {
    hideUnhideEntrada();
    buscarUsuarios();
    setTimeout(hideUnhideMensagens, 3000);
    setInterval(buscarMensagens, 3000);
    setInterval(buscarUsuarios, 10000);
    // buscarMensagens();
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

function buscarMensagens() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promisse.then(processarMensagem);

    promisse.catch(reset);
}

function processarMensagem(elemento) {
    inserirMensagens(elemento.data);
}

function buscarUsuarios() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promisse.then(processarUsuarios);

    promisse.catch(reset);
}

function processarUsuarios(elemento) {
    inserirUsuarios(elemento.data);
}

function inserirUsuarios(elemento) {
    arrayDeUsuarios = [];

    for(let i = 0; i < elemento.length; i++){
        arrayDeUsuarios.push(`
            <div class="participante" onclick="mudarUsuario(this)" data-identifier="participant"><span><ion-icon name="person-circle"></ion-icon><p>${elemento[i].name}</p></span><ion-icon name="checkmark-outline" class="checked usuario"></div></div>
        `);
    }

    const documento = document.querySelector(".containerInternoAsside section");
    documento.innerHTML = arrayDeUsuarios.join(" ");
}

function inserirMensagens(elemento) {
    arrayFiltrada = [];
    arrayDeMensagens = [];
    arrayFiltrada = elemento.filter(ePrivada);

    for (let i = 0; i < arrayFiltrada.length; i++) {
        if (arrayFiltrada[i].type === "status") {
            tipo = "status";
        } else if (arrayFiltrada[i].type === "private_message") {
            tipo = "private";
        } else {
            tipo = "message";
        }

        arrayDeMensagens.push(`
        <div class="mensagem ${tipo}" data-identifier="message">
            <span class="tempo">(${arrayFiltrada[i].time})</span>
            <span class="nomes"><strong>${arrayFiltrada[i].from}</strong> para <strong>${arrayFiltrada[i].to}</strong>:</span>
            ${arrayFiltrada[i].text}
        </div>`);

    }
        
    const documento = document.querySelector(".container section");
    documento.innerHTML = arrayDeMensagens.join(" ");
        
    const aparecerUltimaMensagem = document.querySelectorAll(".mensagem");
    aparecerUltimaMensagem[aparecerUltimaMensagem.length-1].scrollIntoView();
}

function ePrivada(elemento){
    if (elemento.type === "private_message" && elemento.from === nomeUsuario.name || elemento.type === "private_message" && elemento.to === "Todos"){
        return true;
    } else if (elemento.type === "private_message" && elemento.to !== nomeUsuario.name) {
        return false;
    } else {
        return true; 
    }
}

function enviarMensagem() {
    const foco = document.querySelector(".inputMensagem").focus();

    let mensagem = document.querySelector(".inputMensagem");

    if(mensagem.value === ""){
        return;
    }

    const requisicao = {
        from: nomeUsuario.name,
        to: para,
        text: mensagem.value,
        type: privacidade    
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", requisicao);

    promise.then(quandoSucessoMensagem);
    promise.catch(reset);

    mensagem.value = "";
}

function quandoSucessoMensagem(sucesso) {
    console.log("Mensagem enviada!");
    buscarMensagens();
}

function reset() {
    alert("Você esta offline, por favor entre novamente");
    window.location.reload();
}

function hideUnhideEntrada() {
    const hide = document.querySelector(".inputUsuario");
    const hide1 = document.querySelector(".botaoEntrar");
    const hide2 = document.querySelector(".imagemEntrando");

    hide.classList.add("hide");
    hide1.classList.add("hide");
    hide2.classList.remove("hide");
}

function hideUnhideMensagens() {
    Unhide();
    
    const hide = document.querySelector(".entrada");
    hide.classList.add("hide");
}

function Unhide() {
    const unhide = document.querySelectorAll(".hide");
    for (let i = 0; i < unhide.length; i++) {
        unhide[i].classList.remove("hide");
    }
}

function appear() {
    const foco = document.querySelector(".inputMensagem").focus();

    const elemento = document.querySelector(".containerAsside")
    elemento.classList.toggle("flex");

    const icone = document.querySelector(".usuario");
    icone.classList.toggle("flex");

    const icone2 = document.querySelector(".privacidade");
    icone2.classList.toggle("flex");
}

function mudarPrivacidade(elemento) {
    const checked = document.querySelectorAll(".privacidade");

    mudarChecked(elemento, checked);

    if(elemento.textContent === "Público") {
        privacidade = "message";
    } else {
        privacidade = "private_message";
    }
}

function mudarUsuario(elemento) {
    const checked = document.querySelectorAll(".usuario");
    mudarChecked(elemento, checked);
    
    para = elemento.outerText;
}

function mudarChecked(elemento, checked) {
    for (let i = 0; i < checked.length; i++) {
        if (elemento.childNodes[1] === checked[i] && !checked[i].classList.contains("flex")) {
            checked[i].classList.add("flex");
        } else if (elemento.childNodes[1] === checked[i] && checked[i].classList.contains("flex")){
        } else if (checked[i].classList.contains("flex")){
            checked[i].classList.remove("flex");
        }
    }
}

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        if(jaEntrei) {
            var btn = document.querySelector("#submitMessage");
            btn.click();
        } else {
            var btn = document.querySelector("#submitName");
            btn.click();
        }
    }
});