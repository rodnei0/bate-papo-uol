let nomeUsuario;
let privacidade = "message";
let para = "Todos";
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
    setInterval(manterOnline, 5000);
}

function quandoErroEntrar(erro) {
    alert("Este nome de usuário já está em uso, por favor escolha outro nome");
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

function buscarUsuarios() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    
    promisse.then(inserirUsuarios);
    promisse.catch(reset);
}

function hideUnhideMensagens() {
    Unhide();
    
    const hide = document.querySelector(".entrada");
    hide.classList.add("hide");
}

function buscarMensagens() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    promisse.then(inserirMensagens);
    promisse.catch(reset);
}

function manterOnline() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nomeUsuario);
    
    promise.catch(reset);
}

function inserirUsuarios(elemento) {
    const usuario = elemento.data;
    let arrayDeUsuarios = [];
    let offline = true;

    for(let i = 0; i < usuario.length; i++){
        if (usuario[i].name === para) {
            offline = false;
            arrayDeUsuarios.push(`
            <div class="participante" onclick="mudarUsuario(this)" data-identifier="participant"><span><ion-icon name="person-circle"></ion-icon><p>${usuario[i].name}</p></span><ion-icon name="checkmark-outline" class="checked usuario flex"></div></div>
            `);
        } else {
            arrayDeUsuarios.push(`
            <div class="participante" onclick="mudarUsuario(this)" data-identifier="participant"><span><ion-icon name="person-circle"></ion-icon><p>${usuario[i].name}</p></span><ion-icon name="checkmark-outline" class="checked usuario"></div></div>
            `);
        }
    }

    const documento = document.querySelector(".containerInternoAsside section");
    documento.innerHTML = arrayDeUsuarios.join(" ");

    const icone = document.querySelector(".usuario");
    if (offline && !icone.classList.contains("flex")) {
        icone.classList.add("flex");
    }
}

function inserirMensagens(elemento) {
    const mensagem = elemento.data;
    let arrayFiltrada = [];
    let arrayDeMensagens = [];
    let tipo = "";

    arrayFiltrada = mensagem.filter(ePrivada);

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

    promise.then(buscarMensagens);
    promise.catch(reset);

    mensagem.value = "";
}

function reset() {
    alert("Você esta offline, por favor entre novamente");
    window.location.reload();
}

function Unhide() {
    const unhide = document.querySelectorAll(".hide");
    for (let i = 0; i < unhide.length; i++) {
        unhide[i].classList.remove("hide");
    }
}

function appear() {
    const elemento = document.querySelector(".containerAsside")
    elemento.classList.toggle("transicao");

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
    const usuario = document.querySelectorAll(".usuario");
    mudarChecked(elemento, usuario);
    
    para = elemento.outerText;
}

function mudarChecked(elemento, usuario) {
    for (let i = 0; i < usuario.length; i++) {
        if (elemento.childNodes[1] === usuario[i] && !usuario[i].classList.contains("flex")) {
            usuario[i].classList.add("flex");
        } else if (elemento.childNodes[1] === usuario[i] && usuario[i].classList.contains("flex")){
        } else if (usuario[i].classList.contains("flex")){
            usuario[i].classList.remove("flex");
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