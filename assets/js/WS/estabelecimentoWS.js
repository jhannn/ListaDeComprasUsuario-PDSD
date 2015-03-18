var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//______________________ CADASTRAR ESTABELECIMENTO _________________________//
function cadastrarEstabelecimento(){
	confirme = confirm("O cadastro so podera ser realizado se voce estiver em um estabelecimento!\n Voce esta em um estabelecimento?");
	if(confirme){
		var nomeEstabelecimento = $("#nome").val();
		var bairroEstabelecimento = $("#bairroEstabelecimento").val();
		var cidadeEstabelecimento = $("#cidadeEstabelecimento").val();
		var unidadeEstabelecimento = $("#unidadeEstabelecimento").val();
		var idUsuario = ID_USUARIO;
		var token = TOKEN;	
		var latitude = window.localStorage.lat;
		var longitude = window.localStorage.lon;
		
		if(latitude == undefined && longitude == undefined){
			alert("Erro no geocalizador!");
			return;
		}
		
		var nonNumbers = /\D/;
		if(nonNumbers.test(unidadeEstabelecimento)){
			alert("Unidade so recebe digitos!");
		}else{
			if (nomeEstabelecimento != '' || bairroEstabelecimento!= '' || cidadeEstabelecimento!= '' || unidadeEstabelecimento!= ''){ 	
				$.ajax({
					type: 'POST'
					, url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/cadastrarEstabelecimento"
					, crossDomain:true
					, contentType: 'application/json; charset=utf-8'
					, dataType: 'json'
					, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"',numero:'"+parseInt(unidadeEstabelecimento)+"',latitude:'"+latitude+"',longitude:'"+longitude+"'}"
					, success: function (data, status){                    
						var estabelecimento	= $.parseJSON(data.d);
						if(typeof(estabelecimento.erro) === 'undefined'){
							alert("Estabelecimento criado com sucesso!");
							window.location = "estabelecimento.html";
							return;						
						}else{					
							alert(estabelecimento.erro + "\n" + estabelecimento.Message);
							return;
						}
					}
					, error: function (xmlHttpRequest, status, err) {
						alert("Ocorreu um erro");
					}
				});
			}else{
				alert("Campo vazio.");
				window.location = "estabelecimento.html#criar-estabelecimento";
				return false;
			}
		}
	}
}

//______________________ LISTAR ESTABELECIMENTO _________________________//
function listarEstabelecimento(){	

	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/listarEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'',bairro:'',cidade:''}"
        , success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);		
			for(var i=0; i<estabelecimentos.length ;i++)
			htmlListarEstabelecimentos(estabelecimentos[i]);
        }
        , error: function (xmlHttpRequest, status, err) {
            alert("Ocorreu um erro");
        }
    });
}


//______________________ EDITAR ESTABELECIMENTO _________________________//
function editarEstabelecimento(){	
	var nomeEstabelecimento = $("#novoNomeEstabelecimento").val();
	var bairroEstabelecimento = $("#novoBairroEstabelecimento").val();
	var cidadeEstabelecimento = $("#novoCidadeEstabelecimento").val();
	var unidadeEstabelecimento = $("#novoUnidadeEstabelecimento").val();
	var idEstabelecimento = parseInt(window.localStorage.idEstabelecimento);
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	
	var nonNumbers = /\D/;
	if(nonNumbers.test(unidadeEstabelecimento)){
		alert("Unidade so recebe digitos!");
	}else{
		if (nomeEstabelecimento != '' || bairroEstabelecimento!= '' || cidadeEstabelecimento!= '' || unidadeEstabelecimento!= ''){ 	
			$.ajax({
				type: 'POST'
				, url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/editarEstabelecimento"
				, crossDomain:true
				, contentType: 'application/json; charset=utf-8'
				, dataType: 'json'
				, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',id:'"+idEstabelecimento+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"',numero:'"+unidadeEstabelecimento+"'}"
				, success: function (data, status){                    
					var retorno = $.parseJSON(data.d);               
					if(typeof(retorno.erro) === 'undefined'){
						alert("Dados do estabelecimento alterados com sucesso!");
						window.location = "estabelecimento.html";
						return;							
					}else{
						alert(itens.erro + "\n" + itens.Message);
						return;
					}
				}
				, error: function (xmlHttpRequest, status, err) {
					alert("Ocorreu um erro");
				}
			});
		}else{
			alert("Campo vazio.");
			window.location = "estabelecimento.html#editar-estabelecimento";
			return false;
		}
	}
}

function estabelecimentoClicadoId(id){
	window.localStorage.idEstabelecimento = id;
	return;
}

//______________________ AUTOCOMPLETE ESTABELECIMENTO _________________________//
function autoCompleteEstabelecimento(){	
	var nomeEstabelecimento = $("#nomeEstabelecimento").val();
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/autoCompleteEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"'}"
		, success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);
			$("#nomeEstabelecimento").autocomplete({ source: estabelecimentos }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            alert("Ocorreu um erro");
        }
    });	
}

//______________________ VISUALIZAR ESTABELECIMENTO _________________________//
function visualizarEstabelecimento(){	
	var queries = {};
	$.each(document.location.search.substr(1).split('&'), function(c,q){
		var i = q.split('=');
		queries[i[0].toString()] = i[1].toString();
	});	
	var idEstabelecimento=queries['id'];
	window.localStorage.idEstabelecimentoClicado= idEstabelecimento;
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/visualizarEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',id:'"+parseInt(idEstabelecimento)+"'}"
        , success: function (data, status){                    
			var estabelecimento = $.parseJSON(data.d);
			if(typeof(estabelecimento.erro) === 'undefined'){
				$("#tituloEstabelecimento").html(estabelecimento.nome);
				$("#cidade").html(estabelecimento.cidade);
				$("#bairro").html(estabelecimento.bairro);
				$("#numero").html(estabelecimento.numero);				
				return;					
			}else{
				alert(estabelecimento.erro + "\n" + estabelecimento.Message);
				return;	
			}					
		}
        , error: function (xmlHttpRequest, status, err) {
            alert("Ocorreu um erro");
        }
    });
}

function googleMaps(latitude,longitude){
	if(latitude == 0 && longitude == 0){
		alert("Estabelecimento nao possui localizacao cadastrada!");
	}else{
		window.location = "googleMaps.html";
		window.localStorage.latitude = latitude;
		window.localStorage.longitude = longitude;
	}
}


/*==============================================
    GENERAL HTML AND STYLES    
    =============================================*/
/*listar estabelecimentos*/	
function htmlListarEstabelecimentos(estabelecimentos){
	
	var conteudo = document.createElement("div");
	
	conteudo.innerHTML =	
		"<div class='panel panel-default' id='divEstab"+estabelecimentos.id_estabelecimento+"' name='estabelecimentos' role='alert'>"
	+		"<div class='panel-heading'>" 
	+			"<h4 class='panel-title'>" 
	+				"<a style='color: #ffb503;'>"
	+					"<img src='assets/img/setaFechada.png' width='30px' id='seta"+estabelecimentos.id_estabelecimento+"' style='color: #ffb503;'>"
	+				"</a>"
	+				"<div class='iconEdit' onclick='estabelecimentoClicadoId("+estabelecimentos.id_estabelecimento+")' data-target='#editar_estabelecimento' data-toggle='modal'></div>"
	+				"<img src='assets/img/icone-mapa.png' class='icone-mapa' onclick='googleMaps("+estabelecimentos.latitude+","+estabelecimentos.longitude+")'>"
	+				"<a href='visualizar-estabelecimento.html?id="+estabelecimentos.id_estabelecimento+"' class='titulos'>"+estabelecimentos.nome+"</a>"
	+			"</h4>"
	+ 		"</div>"
	+	"</div>";
	
	var pai = document.getElementById("nomeEstabelecimento");
	pai.appendChild(conteudo);
}
