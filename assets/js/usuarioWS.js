var ID_USUARIO = 1;
var TOKEN = "124576453875";

//____________________________________ FAZER LOGIN ______________________________________________//
function fazerLogin(){
    var email = $("#email_logar").val();
    var senha = $("#senha_logar").val();
	var token = TOKEN;
	
    if (email!='' && senha!=''){     
		$.ajax({
            type: 'POST'
            , url: "http://localhost:52192/Servidor/Usuario.asmx/fazerLogin"
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: "{email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
            , success: function (data, status) {                    
				var retorno = $.parseJSON(data.d);
				if(retorno == "-1"){
					alert("Voce nao possui uma conta");
					return;							
				}else{
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
    }else{
        alert("Email ou senha incorretos");
    }
}
//_____________________________ VERIFICAR LOGIN _______________________________//
function verificarLogin(lugar) {
    var email = window.localStorage.UsuarioEmail;
	var token = window.localStorage.UsuarioToken;
		
	$.ajax({
		type: 'POST'
		, url: "http://localhost:52192/Servidor/Usuario.asmx/verificarLogin"
		, contentType: 'application/json; charset=utf-8'
		, dataType: 'json'
		, data: "{email:'"+email+"',token:'"+token+"'}"
		, success: function (data, status) {						
			var retorno = $.parseJSON(data.d);
			if(retorno == "-1" && lugar=="index"){
				return;		
			}else if(retorno == "0" && lugar=="index"){
				window.location = "principal.html";
				return;
			}else if(retorno == "-1"){
				window.location = "index.html";
				return;
			}
		}
		, error: function (xmlHttpRequest, status, err) {
			$('.resultado').html('Ocorreu um erro');
		}
	});
}

//_______________________________ LOGOUT ____________________________________________//
function logout(){
	var email= window.localStorage.UsuarioEmail;
	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Usuario.asmx/logout"
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{email:'"+email+"'}"
        , success: function (data, status){                    
			var retorno = $.parseJSON(data.d);
			if(retorno == "0"){
				window.localStorage.UsuarioEmail='';
				window.localStorage.UsuarioToken='';
				window.localStorage.UsuarioNome='';
				window.location = "index.html";
				return;							
			}else {
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//___________________________________ RECUPERAR SENHA _________________________________________//
function recuperarSenha(){
	var emailUsuario = $("#emailPraRecuperarSenha").val();
	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Usuario.asmx/recuperarSenha"
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{emailUsuario:'"+emailUsuario+"'}"
        , success: function (data, status){                    
			var retorno = $.parseJSON(data.d);
			if(retorno == "0"){
				alert("Email enviado, verifique sua caixa de menssagem!");
				return;							
			}else if(retorno == "1"){
				alert("Voce nao possui uma conta cadastrada");
				return;
			}else{
				alert("Ocorreu um erro!");
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//________________________________ CADASTRAR USUARIO _______________________________________//
function cadastrarUsuario() {
	var nome = $("#nome").val();
	var email = $("#email").val();
	var senha = $("#senha").val();
	var confirmar = $("#confirmarSenha").val();
	var token = '124576453875';
    
	if(nome!='' && email!='' && senha!=''){
		var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(!filter.test(document.getElementById("email").value)){
			alert('Por favor, digite o email corretamente');
			window.location = "#cadastrarUsuario";
			return;
		}
		if(senha.length<4){
			alert("Senha deve ter pelo menos 4 caracteres.");
			window.location = "#";
			return;
		}
		if(senha == confirmar){		
			$.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/cadastrarUsuario"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{nomeUsuario:'"+nome+"',email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
                , success: function (data, status){                    
					var itens = $.parseJSON(data.d);                    
					if(itens[0] == "0"){
						alert("Usuario cadastrado com sucesso!");
						window.localStorage.UsuarioNome=nome;
						window.localStorage.UsuarioEmail=email;
						window.localStorage.UsuarioToken=token;
						window.location = "principal.html";
						return;
					}
					else if(itens[0] == "1"){
						alert("Ja possui uma conta com este email");
						return;
					}
					else{
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
		}else{
			alert("Senhas não conferem!");	
			window.location = "#";
			return;
		}	
	}else{  
		alert("Campo vazio!");
		window.location = "#cadastrarUsuario";
		return;
	}
}

//________________________________ ATUALIZAR SENHA USUARIO _______________________________________//
function atualizarSenhaUsuario() {
	var email = window.localStorage.UsuarioEmail;
	var senha = $("#senha").val();
	var novaSenha = $("#novaSenha").val();
	var confirmar = $("#confirmarSenha").val();
    
	if(email.trim()!='' && senha.trim()!='' && novaSenha.trim()!=''){
		if(novaSenha.length<4){
			alert("Senha deve ter pelo menos 4 caracteres.");
			window.location = "#";
			return;
		}
		if(novaSenha == confirmar){		
			$.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/atualizarSenhaUsuario"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{email:'"+email+"',senha:'"+senha+"',novaSenha:'"+novaSenha+"'}"
                , success: function (data, status){                    
					var itens = $.parseJSON(data.d);                    
					if(itens[0] == "0"){
						alert("Usuario atualizado com sucesso!");
						window.location = "perfil.html";
						return;
					}else{
						alert("Ocorreu algum erro, repita o processo novamente!");
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
		}else{
			alert("Senhas não conferem!");	
			window.location = "#";
			return;
		}	
	}else{  
		alert("Campo vazio!");
		window.location = "#cadastrarUsuario";
		return;
	}	
}