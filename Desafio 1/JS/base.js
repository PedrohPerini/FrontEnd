
function salvarToken(token) {
    localStorage.setItem('token', token)
}

function salvarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario))
}


function obterToken() {
    return localStorage.getItem("token")
}

function obterUsuario() {
    return localStorage.getItem("usuario") || "{}";
}

function sairSistema() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    direcionarTelaLogin();
}

function direcionarTelaLogin() {
    window.open('login.html', '_self');
}

function usuarioLogado() {
    let token = obterToken();

    return !!token;
}

function usuarioAutenticado() {

    let logado = usuarioLogado();

    if (window.location.pathname == "/login.html") {

        if (logado) {
            window.open("Produtos.html", '_self')
        }

    } else if (!logado && window.location.pathname == "Produtos.html") {
        direcionarTelaLogin();
    }

}

usuarioAutenticado();