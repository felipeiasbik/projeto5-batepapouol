let nome;
let horarioMsg;
let nomeA;
let nomeB;
let textoMsg;
let visibili = "Público";
let estrutura = "";
let ultimaMSG;
let paraQuem = "Todos";
let tipo = "message";
let comparaNovo = [];
let conteudoMsg;
let elementos = "";

function mensagensErro(){
    alert('Erro ao exibir mensagens. Entre na sala novamente.');
    entrarNaSala();
}

function mensagensOk(pegarMsgs){
    console.log(pegarMsgs.data);
    elementos = "";
    console.log('Limpando as mensagens...');

    for (let i = 0; i < pegarMsgs.data.length; i++){
        horarioMsg = pegarMsgs.data[i].time;
        nomeA = pegarMsgs.data[i].from;
        nomeB = pegarMsgs.data[i].to;
        textoMsg = pegarMsgs.data[i].text;

        estrutura = document.querySelector('.mensagenschat');
        if (pegarMsgs.data[i].type === "status"){
            elementos = elementos+`
            <li class="entrou-saiu" data-test="message">
                <p class="texto"><span class="hora">(${horarioMsg})</span><span>${nomeA}</span> ${textoMsg}</p>
            </li>
            `;
        } else if (pegarMsgs.data[i].type === "message"){
            elementos = elementos+`
            <li class="msg" data-test="message">
                <p class="texto"><span class="hora">(${horarioMsg})</span><span>${nomeA}</span> para <span>${nomeB}</span>: ${textoMsg}</p>
            </li>
            `;
        } else {
            if (nomeB === nome){
                elementos = elementos+`
                <li class="reservado" data-test="message">
                    <p class="texto"><span class="hora">(${horarioMsg})</span><span>${nomeA}</span> reservadamente para <span>${nomeB}</span>: ${textoMsg}</p>
                </li>
                `;
            } else if (nomeA === nome && visibili === "Reservadamente"){
                elementos = elementos+`
                <li class="reservado" data-test="message">
                    <p class="texto"><span class="hora">(${horarioMsg})</span><span>${nomeA}</span> reservadamente para <span>${nomeB}</span>: ${textoMsg}</p>
                </li>
                `;
            }
        }
    }
    if (comparaNovo[0] !== horarioMsg || comparaNovo[1] !== nomeA || comparaNovo[2] !== textoMsg){
        estrutura.innerHTML = elementos;
        document.querySelector('.mensagenschat li:last-child').scrollIntoView();
        comparaNovo[0]=pegarMsgs.data[99].time;
        comparaNovo[1]=pegarMsgs.data[99].from;
        comparaNovo[2]=pegarMsgs.data[99].text;
    }
}

function sendOk(){
    const pegarMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    console.log(nome+' enviou mensagem!')

    pegarMensagens.then(mensagensOk);
    pegarMensagens.catch(mensagensErro);
}

function sendErro(){
    alert('Houve um erro ao enviar a mensagem. Você será reconectado(a)!')
    window.location.reload();
}

function sendMsg(){

    const btnSendMsg = document.querySelector('.rodape input');
    


    conteudoMsg = {
        from: nome,
        to: paraQuem,
        text: btnSendMsg.value,
        type: tipo
    };

    if (btnSendMsg.value === ' ' || btnSendMsg.value === '  ' || btnSendMsg.value === '   ' || btnSendMsg.value === '    ' || btnSendMsg.value === '     '){
        btnSendMsg.value = "";
    }

    if (btnSendMsg.value !== ''){
        
        const sending = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',conteudoMsg);
        
        sending.then(sendOk);
        sending.catch(sendErro);

        btnSendMsg.value = "";
    }
}

document.addEventListener("keypress", function (e){

    if (e.key === "Enter") {

        const btn = document.querySelector('.sendbtn')
        btn.click();

        document.querySelector(".rodape input").value = "";

    }
});

function mostrarSala(){

    const pegarMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    console.log('Atualizando a sala!')

    pegarMensagens.then(mensagensOk);
    pegarMensagens.catch(mensagensErro);

}

function statusErro() {
    alert(nome+', você perdeu conexão. Entre novamente no chat.');
    entrarNaSala();
}

function statusOk(confereStatus) {
    console.log(nome+' segue conectado ao bate papo.');
}

function meustatus(){
    const testeStatus = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: nome});

    testeStatus.then(statusOk);
    testeStatus.catch(statusErro);
}

function processaRespostaErro(erro){
    alert('Este nome já está em uso. Por favor, digite um outro nome.');
    entrarNaSala();
}

function processaResposta(resposta){

    document.querySelector('.tela-entrada').classList.add('esconder');

    console.log(nome +' entrou na sala!')
    document.querySelector('.mensagenschat').classList.remove('esconder');

    const pegarMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    console.log('Exibindo histórico de mensagens!')

    pegarMensagens.then(mensagensOk);
    pegarMensagens.catch(mensagensErro);
    
    setInterval(meustatus, 5000);
    setInterval(mostrarSala,3000);
}

function entrarNaSala(){
    //nome = prompt('Qual é o seu nome?');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: nome});

    promise.then(processaResposta);
    promise.catch(processaRespostaErro);

}

function telaInicial(){

    nome = document.querySelector('.tela-entrada input').value;

    if (nome === ' ' || nome === '  ' || nome === '   ' || nome === '    ' || nome === '     '){
        nome = "";
    }

    if (nome!== ''){
        document.querySelector('.tela-entrada input').value = "";
        entrarNaSala();
    }

}

function fecharMenu(){

    document.querySelector('.menu-lateral').classList.add('esconder');

}

function falhaListaUser(){
    alert('Erro ao carregar lista de usuários online.');
}

function mostrarListaUser(usersOnline){
    let mostraUser = usersOnline.data;
    let montaListaUser = document.querySelector('.donline ul');
    console.log(mostraUser);

    montaListaUser.innerHTML = `
    <li onclick="selecionarUsuario(this)">
        <div class="left">
            <ion-icon name="people"></ion-icon>
            <span>Todos</span>
        </div>
        <div class="right esconder">
            <ion-icon name="checkmark-sharp"></ion-icon>
        </div>
    </li>`;

    for (let i = 0; i < mostraUser.length; i++){
        let nomeUserOnline = usersOnline.data[i].name;
        if (nomeUserOnline !== nome){
        montaListaUser.innerHTML = montaListaUser.innerHTML + `
        <li onclick="selecionarUsuario(this)">
            <div class="left">
                <ion-icon name="people"></ion-icon>
                <span>${nomeUserOnline}</span>
            </div>
            <div class="right esconder">
                <ion-icon name="checkmark-sharp"></ion-icon>
            </div>
        </li>
        `
        }
    }
}

function userOn(){
    
    const usuarioson = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    usuarioson.then(mostrarListaUser);
    usuarioson.catch(falhaListaUser);

}

function abrirMenu(){

    userOn();
    document.querySelector('.menu-lateral').classList.remove('esconder');

}

function selecionarVisibilidade(selecaoVisivel){

    const selecaoAntes = document.querySelector('.visibilidade .selecionado');

    if (selecaoAntes !== null){
        selecaoAntes.classList.remove('selecionado');
    };

    visibili = selecaoVisivel.querySelector('span').innerHTML;

    nomeRodape();
    selecaoVisivel.querySelector('.right').classList.add('selecionado');
}

function selecionarUsuario(selecaoUsuario){

    const selecaoAntes = document.querySelector('.donline .selecionado');

    if (selecaoAntes !== null){
        selecaoAntes.classList.remove('selecionado');
    };

    selecaoUsuario.querySelector('.right').classList.add('selecionado');

    paraQuem = selecaoUsuario.querySelector('span').innerHTML;
    nomeRodape();
    
}

function nomeRodape(){

    document.querySelector('.rodape-esquerda p').innerHTML = `Enviando para ${paraQuem} (${visibili})`;

    if (visibili === "Público"){
        tipo = "message";
    } else {
        tipo = "private_message";
    }

}