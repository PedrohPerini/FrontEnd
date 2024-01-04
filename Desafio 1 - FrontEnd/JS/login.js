// Capturando campos

let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnEntrar = document.getElementById('btn-entrar');




btnEntrar.addEventListener('click', () => {

    let userEmail = email.value;
    let userSenha = senha.value;

    if (!userEmail || !userSenha) {
        alert("Os campos do e-mail e senha são obrigatorios");
        return;
    }

    autenticar(userEmail, userSenha);

    window.open('Produtos.html', '_self')
      console.log(`Usuário ${response._id} logou com sucesso!`)
    window.open(onsole.log(`Usuário ${response._id} logou com sucesso!`))
});

function autenticar(email, senha) {
    const url = "http://localhost:3400";

    fetch(`${url}/login`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => response.json()) // sucesso
        .then(response => {

            if (!!response.mensagem) {
                alert(response.mensagem);
                return;

            } else {
                salvarToken(response.token);
                salvarUsuario(response.usuario);

                window.open('Produtos.html', '_self')
            }
        })
    //    .catch(erro => {
    //     console.log(erro)}) // falha
}

function salvarToken(token) {
    localStorage.setItem('token', token)
}

function salvarUsuario(usuario) {
    localStorage.setItem('usuario  ', JSON.stringify(usuario))
}


