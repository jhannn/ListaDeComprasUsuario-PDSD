var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

function cadastrarEstabelecimento(){
	var nomeEstabelecimento = $("#nome").val();
	var bairroEstabelecimento = $("#bairroEstabelecimento").val();
	var cidadeEstabelecimento = $("#cidadeEstabelecimento").val();
	var unidadeEstabelecimento = $("#unidadeEstabelecimento").val();
	var idUsuario = ID_USUARIO;
	var token = TOKEN;	
		
	var nonNumbers = /\D/;
	if(nonNumbers.test(unidadeEstabelecimento)){
		alert("Unidade so recebe digitos!");
	}else{
		if (nomeEstabelecimento != '' || bairroEstabelecimento!= '' || cidadeEstabelecimento!= '' || unidadeEstabelecimento!= ''){ 	
			$.ajax({
				type: 'POST'
				, url: "http://localhost:52192/Servidor/Estabelecimento.asmx/cadastrarEstabelecimento"
				, crossDomain:true
				, contentType: 'application/json; charset=utf-8'
				, dataType: 'json'
				, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"',numero:'"+parseInt(unidadeEstabelecimento)+"'}"
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
					$('.resultado').html('Ocorreu um erro');
				}
			});
		}else{
			alert("Campo vazio.");
			window.location = "estabelecimento.html#criar-estabelecimento";
			return false;
		}
	}
}

function listarEstabelecimento(){	
	nomeEstabelecimento='';
	bairroEstabelecimento='';
	cidadeEstabelecimento='';
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Estabelecimento.asmx/listarEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"'}"
        , success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);		
			for(var i=0; i<estabelecimentos.length ;i++){
				if(estabelecimentos[i] != undefined){

					var divPrincipal = document.createElement("div");
					var divRole = document.createElement("div");
					var h4 = document.createElement("h4");
					var a = document.createElement("a");
					var img = document.createElement("img");
					var nomeEstab = document.createElement('a');
					var pCidade = document.createElement('p');
					var pBairro = document.createElement('p');
					var pUnidade = document.createElement('p');
					var iconEdit = document.createElement('div');
					var imgMap = document.createElement('img');
					var modal = document.createElement("div");
					var conteudo = document.createElement("div");

					//--estilos--
					divPrincipal.setAttribute("class","panel panel-default");
					divPrincipal.setAttribute("id",estabelecimentos[i].id_estabelecimento);
					divPrincipal.setAttribute("name", "estabelecimentos");
					divPrincipal.setAttribute("role", "alert");

					divRole.setAttribute("class","panel-heading");
					h4.setAttribute("class","panel-title");
					a.setAttribute("style","color: #ffb503;");
						
					img.setAttribute("src","assets/img/detalhes.png");
					img.setAttribute("width","30px");
					img.setAttribute("style","color: #ffb503;");

					/* icone de editar */
					iconEdit.setAttribute("class", "iconEdit");
					iconEdit.setAttribute("onclick", "estabelecimentoClicadoId('"+estabelecimentos[i].id_estabelecimento+"')");
					iconEdit.setAttribute("data-target", "#editar_estabelecimento");
					iconEdit.setAttribute("data-toggle", "modal");

					/* tag do nome */
					nomeEstab.setAttribute('href',"visualizar-estabelecimento.html?id="+estabelecimentos[i].id_estabelecimento);
					nomeEstab.setAttribute('class',"titulos");
					nomeEstab.innerHTML = estabelecimentos[i].nome;

					/* icone do google maps */
					imgMap.setAttribute("src","assets/img/icone-mapa.png");
					imgMap.setAttribute("class","icone-mapa");		
					imgMap.setAttribute("onclick","googleMaps()");

					modal.setAttribute("id","modal"+estabelecimentos[i].id_estabelecimento);
					modal.setAttribute("class","modal-fechado");
					conteudo.innerHTML = "<p class='conteudo-estab'>Cidade: "+estabelecimentos[i].cidade+"</br>"+
										 "Bairro: "+estabelecimentos[i].bairro+"</br>"+
										 "Unidade: "+estabelecimentos[i].numero+"</br></p>";

					divPrincipal.appendChild(divRole);
					divPrincipal.appendChild(h4);
					divPrincipal.appendChild(a);
					divPrincipal.appendChild(img);
					divRole.appendChild(h4);
					h4.appendChild(a);
					h4.appendChild(iconEdit);
					h4.appendChild(imgMap)
					h4.appendChild(nomeEstab);
					a.appendChild(img);
					divPrincipal.appendChild(modal);
					modal.appendChild(conteudo);
					}	
				var pai = document.getElementById("nomeEstabelecimento");
				pai.appendChild(divPrincipal);	
				img.setAttribute("onclick","controleModal(modal"+estabelecimentos[i].id_estabelecimento+")");
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

function googleMaps()
{
	window.location = "googleMaps.html";
}

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
				, url: "http://localhost:52192/Servidor/Estabelecimento.asmx/editarEstabelecimento"
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
					$('.resultado').html('Ocorreu um erro');
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

function autoCompleteEstabelecimento(){	
	var nomeEstabelecimento = $("#nomeEstabelecimento").val();
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Estabelecimento.asmx/autoCompleteEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"'}"
		, success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);
			$("#nomeEstabelecimento").autocomplete({ source: estabelecimentos }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

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
        , url: "http://localhost:52192/Servidor/Estabelecimento.asmx/visualizarEstabelecimento"
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
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_______________________ RETORNAR ESTABELECIMENTOS MAIS BARATO ______________________//

function retornarEstabelecimentosMaisBaratos(){	

	var idLista = parseInt(window.localStorage.idListaClicada);
	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/buscarOfertas"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"'}"
		, success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);
			console.log(estabelecimentos);
			
			//------------ ordenar -----------------//
			var i, j, preco,oferta,guardar;
			for (i = 1; i < estabelecimentos.length; i++) {
			   preco = estabelecimentos[i].precoDaLista;
			   guardar = estabelecimentos[i];
			   oferta = estabelecimentos[i].itensEncontrados;
			   j = i;
			   while((j>0) && 
			   (oferta>estabelecimentos[j-1].itensEncontrados  || (preco<estabelecimentos[j-1].precoDaLista && oferta==estabelecimentos[j-1].itensEncontrados)))
			   {
					estabelecimentos[j] = estabelecimentos[j-1];
					j = j-1;
			   }
			   estabelecimentos[j] = guardar;
			}
			//------------------------------------------//

			document.getElementById("referenciaEstab").innerHTML = "";
			for(var i=0 ;i<estabelecimentos.length ;i++){
				listaEstiloEstab(estabelecimentos[i]); 
			}	
			
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

function listaEstiloEstab(estabelecimentos)
{
	var divPrincipal = document.createElement("div");
	var divRole = document.createElement("div");
	var h4 = document.createElement("h4");
	var a = document.createElement("a");
	var img = document.createElement("img");
	var nomeProduto = document.createElement("p");
	var oferta = document.createElement("p");
	var valor = document.createElement("p");
	var modal = document.createElement("div");
	var conteudo = document.createElement("div");

	//--estilos--
	divPrincipal.setAttribute("class","panel panel-default");
	divPrincipal.setAttribute("id",estabelecimentos.idEstabelecimento); //passando id do estabelecimento para a div principal
	divRole.setAttribute("class","panel-heading");
	h4.setAttribute("class","panel-title");
	a.setAttribute("style","color: #ffb503;");
		
	img.setAttribute("src","assets/img/detalhes.png");
	img.setAttribute("width","30px");
	img.setAttribute("style","color: #ffb503;");
		
	nomeProduto.setAttribute("class","ajustes-lista");		
	nomeProduto.innerHTML = estabelecimentos.nomeEstabelecimento; //nome do estabelecimento
		
	oferta.setAttribute("class","ajustes-oferta");		
	oferta.innerHTML = estabelecimentos.itensEncontrados+"/"+estabelecimentos.itensTotal; //oferta
		
	valor.setAttribute("class","ajustes-valor");		
	valor.innerHTML = "R$"+estabelecimentos.precoDaLista;//valor
		
	modal.setAttribute("id","modal"+estabelecimentos.idEstabelecimento);
	modal.setAttribute("class","modal-fechado");
	conteudo.innerHTML = "<p>Foram encontrados nesse supermercado "+estabelecimentos.itensEncontrados+" produtos,"+
							 " no total de "+estabelecimentos.itensTotal+" produtos cadastrados na sua lista de compras</br></p>"; 
		
	//--------//
		
	divPrincipal.appendChild(divRole);
	divPrincipal.appendChild(h4);
	divPrincipal.appendChild(a);
	divPrincipal.appendChild(img);
	divRole.appendChild(h4);
	h4.appendChild(a);
	h4.appendChild(nomeProduto);
	h4.appendChild(oferta);
	h4.appendChild(valor);
	a.appendChild(img);
	divPrincipal.appendChild(modal);
	modal.appendChild(conteudo);
		
	var pai = document.getElementById("referenciaEstab");
	pai.appendChild(divPrincipal);	
	divPrincipal.setAttribute("onclick","controleModal(modal"+estabelecimentos.idEstabelecimento+")");
}

var aberto = "nao";
var idAberto = "0";
function controleModal(id)
{
	if(aberto == "nao" && idAberto==0){ //abra modal
		document.getElementById(id.id).className = "modal-aberto";
		aberto="sim";
		idAberto = id.id;
		return;
	}
	
	if(aberto == "sim" && idAberto==id.id){//feche modal
		document.getElementById(id.id).className = "modal-fechado";
		aberto="nao";
		idAberto="0";
		return;
	}
}







