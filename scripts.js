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

function mostrarSala(){
    document.querySelector('ul').classList.remove('esconder');
    setInterval(meustatus, 5000);
}

function processaRespostaErro(erro){
    alert('Nome já está em uso. Por favor, digite um outro nome.');
    entrarNaSala();
}

function processaResposta(resposta){
    alert('Comunicação efetuada com sucesso!');
    mostrarSala();
}

function entrarNaSala(){
    nome = prompt('Qual é o seu nome?');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: nome});

    promise.then(processaResposta);
    promise.catch(processaRespostaErro);

}

entrarNaSala();