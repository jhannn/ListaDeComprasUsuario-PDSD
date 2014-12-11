//____________________________________ FAZER LOGIN ______________________________________________//
function fazerLogin() {
    var email = $("#email_logar").val();
    var senha = $("#senha_logar").val();
	var token = "1245723423322";
	
    if (email != '' && senha != '') {
     
		 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/fazerLogin"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d);
					if(itens == "-1")
                    
					{
						alert("Voce nao possui uma conta");
						return;							
					}
					else 
					{
						alert("Logado com sucesso!");
						window.localStorage.UsuarioEmail=email;
						window.localStorage.UsuarioToken=token;
						window.location = "principal.html";
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
	 
	 
		
    } else {
        alert("Email ou senha incorretos");
    }
}
//------Verificar se o usuario esta logado---------//
function verificarLogin() {
    var email = window.localStorage.UsuarioEmail;
	var token = window.localStorage.UsuarioToken;
     
		 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/verificarLogin"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{email:'"+email+"',token:'"+token+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d);
					if(itens == "-1")
                    
					{
						return;							
					}
					else 
					{
						window.location = "principal.html";
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
}

//---------Logout-----///
function logout() {
    window.localStorage.UsuarioEmail='';
	window.localStorage.UsuarioToken='';
	window.localStorage.UsuarioNome='';
	window.location = "index.html"
}


//__________________________________ CADASTRAR PRODUTO ______________________________________//
var listaDeProdutos = [];
var i = 0;
function cadastrarProduto() {
	//Pegar os parametros
	var codigoDeBarras = $("#cod_barra").val();
	var nomeDoProduto = $("#nome_produto").val();
	var formatoCodigoDeBarras = $("#formato").val();
	
	if(codigoDeBarras == "") //ta vazio
	{
		codigoDeBarras = -1;
		formatoCodigoDeBarras = -1;
	}
	
	var produtos = new Array(codigoDeBarras,formatoCodigoDeBarras,nomeDoProduto);
	listaDeProdutos[i++] = produtos;
	
	window.location = "principal.html#editar_lista"
	document.getElementById("exibir").innerHTML = "- " + listaDeProdutos[i-1][2] +"<br />";
}

//________________________________ CADASTRAR USUARIO _______________________________________//
function cadastrarUsuario() {
	//Pegar os parametros
	var nome = $("#nome").val();
	var email = $("#email").val();
	var senha = $("#senha").val();
	var confirmar = $("#confirmarSenha").val();
	var token = '124576453875';
    
	if(nome!='' && email!='' && senha!=''){ //checa se campos foram preenchidos
	//////teste email////////////////
		var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(!filter.test(document.getElementById("email").value)){
			alert('Por favor, digite o email corretamente');
			window.location = "#cadastrarUsuario";
			return;
		}
	///////////teste senha///////////
		if(senha.length<4){
			alert("Senha deve ser maior que 3 caracteres.");
			window.location = "#";
			return;
		}
	///// senha e confirmação de senha são iguais
		if(senha == confirmar){
		
		
			 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/cadastrarUsuario"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{nomeUsuario:'"+nome+"',email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d);
                    
					if(itens[0] == "0")
					{
						alert("Usuario cadastrado com sucesso!");
						window.localStorage.UsuarioNome=nome;
						window.localStorage.UsuarioEmail=email;
						window.localStorage.UsuarioToken=token;
						window.location = "principal.html";
						return;
					}
					else if(itens[0] == "1")
					{
						alert("Ja possui uma conta com este email");
						return;
					}
					else
					{
						alert("Erro de token");
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });

			window.localStorage.UsuarioNome=nome;
			window.localStorage.UsuarioEmail=email;
			window.localStorage.UsuarioToken=token;
		}else{ //senhas não conferem
			alert("Senhas não conferem!");	
			window.location = "#";
			return;
		}	
	}
	else //campos vazio
	{  
		alert("Campo vazio!");
		window.location = "#cadastrarUsuario";
		return;
	}	
	//window.location = "principal.html#Inicio";
}

//___________________ CRIAR LISTA ________________________//
function criarLista() {
	//Pegar os parametros
	var nomeLista = $("#nome_lista").val();
	var idUsuario = 1;
	var token = "187827";
	//pegar token
	
    if (nomeLista != '') { 
	
		 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/criarLista"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{nomeLista:'"+nomeLista+"',idUsuario:'"+idUsuario+"',token:'"+token+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d);
                    
					if(itens == "-1")
                    
					{
						alert("Erro ao criar lista");
						return;							
					}
					else 
					{
						alert("Lista criada com sucesso!");
						window.location = "listas.html";
						return;
					}
				
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
	
	
	
	
	
    } else {
        alert("Campo vazio.");
		window.location = "principal.html#criar_lista";
		return false;
    }
	//window.location = "principal.html#editar_lista"
	//document.getElementById("exibirNomeDaLista").innerHTML = nomeLista;
	//editarLista(1,1); 
}

//--------------- editar Lista ---------------------//
function editarLista(idLista,idUsuario) {
	//Pegar os parametros
	var idLista = idLista;
	var idUsuario = idUsuario;

	
    if (idLista != '' && idUsuario != '') { $.post("http://localhost:52192/Servidor/ListaDeProdutos.asmx/editarLista", { 
		idLista: idLista,
		idUsuario: idUsuario
		 }, function () {
		},
        "json");
    } else {
        alert("Ocorreu um erro!");
		window.location = "principal.html#criar_lista";
		return false;
    }
	window.location = "principal.html#editar_lista"
    return true;
}

//--------------- excluir Lista ---------------------//
function excluirLista(idLista,idUsuario) {
	//Pegar os parametros
	var idLista = idLista;
	var idUsuario = idUsuario;

	
    if (idLista != '' && idUsuario != '') { $.post("http://localhost:52192/Servidor/ListaDeProdutos.asmx/editarLista", { 
		idLista: idLista,
		idUsuario: idUsuario
		 }, function () {
		},
        "json");
    } else {
        alert("Ocorreu um erro!");
		window.location = "principal.html#editar_lista";
		return false;
    }
	window.location = "principal.html#criar_lista"
    return true;
}

//----------------- Função auto complete --------------------------// 
//$(function() { 
//var produtos = [ "Todinho", "Feijao", "Macarão", "Carne" , "Arroz" , "Frango" ]; 
//$("#nome_produto" ).autocomplete({ source: produtos}); 
//});


//------------- Funções de navegação ----------------------//
function navegarCadastroUsuario()
 {
	window.location = "principal.html#cadastrarUsuario";
 }
 
 function navegarCadastrarProduto()
 {
	//---- zerando os campos ----//
	window.location = "principal.html#cadastrar_produto";
 }
 
 
 function voltarLogin()
 {
	window.location = "index.html#login";
 }
 
 