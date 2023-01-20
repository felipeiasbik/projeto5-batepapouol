let nome;
let horarioMsg;
let nomeA;
let nomeB;
let textoMsg;
let estrutura = "";
let ultimaMSG;
let paraQuem = "Todos";
let tipo = "message";
let comparaNovo = [];
let conteudoMsg;

function mensagensErro(){
    alert('Erro ao exibir mensagens. Entre na sala novamente.');
    entrarNaSala();
}

function mensagensOk(pegarMsgs){
    
    let elementos = "";

    for (let i = 0; i < pegarMsgs.data.length; i++){
        horarioMsg = pegarMsgs.data[i].time;
        nomeA = pegarMsgs.data[i].from;
        nomeB = pegarMsgs.data[i].to;
        textoMsg = pegarMsgs.data[i].text;

        estrutura = document.querySelector('ul');

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
                elementos
            }
        }
    }
    if (comparaNovo[0] !== horarioMsg && comparaNovo[1] !== nomeA && comparaNovo[2] !== textoMsg){
        estrutura.innerHTML = elementos;
        document.querySelector('ul li:last-child').scrollIntoView();
        console.log(pegarMsgs);
        comparaNovo[0]=pegarMsgs.data[99].time;
        comparaNovo[1]=pegarMsgs.data[99].from;
        comparaNovo[2]=pegarMsgs.data[99].text;
    }
}

function sendOk(){
    const pegarMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    pegarMensagens.then(mensagensOk);
    pegarMensagens.catch(mensagensErro);
}

function sendErro(){
    alert('Houve um erro ao enviar a mensagem. Você será reconectado(a)!')
    window.location.reload();
}

function sendMsg(){

        conteudoMsg = {
        from: nome,
        to: paraQuem,
        text: document.querySelector('input').value,
        type: tipo
    };
    const sending = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',conteudoMsg);
    
    sending.then(sendOk);
    sending.catch(sendErro);

    document.querySelector("input").value = "";
}

document.addEventListener("keypress", function (e){

    if (e.key === "Enter") {

        const btn = document.querySelector('.sendbtn')
        btn.click();

        document.querySelector("input").value = "";
        sendOk();

    }
});

function mostrarSala(){

    const pegarMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

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
    console.log(nome +' entrou na sala!')
    document.querySelector('ul').classList.remove('esconder');

    setInterval(meustatus, 5000);
    setInterval(mostrarSala,3000);
}

function entrarNaSala(){
    nome = prompt('Qual é o seu nome?');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: nome});

    promise.then(processaResposta);
    promise.catch(processaRespostaErro);

}

entrarNaSala();