let nome;

function statusErro() {
    alert('Conexão com erro. Conecte novamente.');
    entrarNaSala();
}
function statusOk(confereStatus) {
    console.log(confereStatus);
}

function meustatus(){
    const testeStatus = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: nome});

    testeStatus.then(statusOk);
    testeStatus.catch(statusErro);
}

setInterval(meustatus, 5000);

function mensagensOk(pegarMsgs){
    console.log(pegarMsgs);

    for (let i = 0; i < pegarMsgs.data.length; i++){
        let horarioMsg = pegarMsgs.data[i].time;
        let nomeA = pegarMsgs.data[i].from;
        let nomeB = pegarMsgs.data[i].to;
        let textoMsg = pegarMsgs.data[i].text;

        if (textoMsg === "entra na sala..."){
            document.querySelector('ul').innerHTML = `
            <li class="entrou-saiu">
                <p class="texto"><span class="hora">(09:21:48)</span><span>${nomeA}</span> ${textoMsg}</p>
            </li>
            ` + document.querySelector('ul').innerHTML;
        } else if (nomeB === "Todos"){
            document.querySelector('ul').innerHTML = `
            <li class="msg">
                <p class="texto"><span class="hora">(09:21:48)</span><span>${nomeA}</span> para <span>${nomeB}</span>: ${textoMsg}</p>
            </li>
            ` + document.querySelector('ul').innerHTML;
        } else {
            document.querySelector('ul').innerHTML = `
            <li class="reservado">
                <p class="texto"><span class="hora">(09:21:48)</span><span>${nomeA}</span> reservadamente para <span>${nomeB}</span>: ${textoMsg}</p>
            </li>
            ` + document.querySelector('ul').innerHTML;
        }
    }
}

function mensagensErro(){
    alert('Erro ao exibir mensagens. Entre na sala novamente.');
    entrarNaSala();
}

function mostrarSala(){
    document.querySelector('ul').classList.remove('esconder');

    const pegarMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    pegarMensagens.then(mensagensOk);
    pegarMensagens.catch(mensagensErro);

}

function processaRespostaErro(erro){
    alert('Nome já está em uso. Por favor, digite um outro nome.');
    entrarNaSala();
}

function processaResposta(resposta){
    alert('Seja bem vindo(a) ao Bate Papo UOL!');
    setInterval(mostrarSala,3000);
}

function entrarNaSala(){
    nome = prompt('Qual é o seu nome?');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: nome});

    promise.then(processaResposta);
    promise.catch(processaRespostaErro);

}

entrarNaSala();