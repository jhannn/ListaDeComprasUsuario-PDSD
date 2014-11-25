function fazerLogin() {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton", form).attr("disabled", "disabled");
    var email = $("#email", form).val();
    var senha = $("#senha", form).val();
    if (email != '' && senha != '') {
        $.post("http://localhost:52192/Servidor/Usuario.asmx/fazerLogin", { email: email, senha: senha }, function () {
            //redirecionar
        },
        "json");
    } else {
        navigator.notification.alert("Insira seu e-mail e/ou senha", function () { });
    }
    return false;
}

function cadastrarProduto() {
	//Pegar os parametros
	var codigoDeBarras = $("#cod_barra").val();
	var nomeDoProduto = $("#nome_produto").val();
	var formatoCodigoDeBarras = $("#formato").val();
    
    if (nomeDoProduto != '') { $.post("http://localhost:52192/Servidor/Produto.asmx/cadastrarProduto", { 
		codigoDeBarras: codigoDeBarras,
		nomeDoProduto: nomeDoProduto,
		formatoCodigoDeBarras: formatoCodigoDeBarras }, function () {
        //Retorno do WebService fica aqui...
		},
        "json");
    } else {
        alert("Campo vazio.");
    }
    return false;
}

function navegacao()
 {
	window.location = "principal.html#inicio";
 }