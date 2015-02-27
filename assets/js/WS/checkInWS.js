var ID_USUARIO = window.localStorage.UsuarioId;						//id do usuario
var TOKEN = window.localStorage.UsuarioToken;						//token do usuario
var string = window.localStorage.produtoRecemAdicionado;			//string do localstorage com os id das listas e dos produtos recem adicionados no checkin
if(string == undefined){											//se string for indefinida
	window.localStorage.produtoRecemAdicionado = "";				//crie a variavel no localStoragee
	string = window.localStorage.produtoRecemAdicionado;			//salve na variavel string
}
var produtosRecemAdicionado = string.split(",");					//converter string em array

//______________________________ AUTO COMPLETE MARCA _______________________________________// 
function autoCompleteMarca(){
	
	var nomeMarca = $("#marcaDoProduto").val();													//salva valor do campo na variavel
	$.ajax({																					//chama a fun��o do servidor
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Produto.asmx/autocompleteMarca"					
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeMarca:'"+nomeMarca+"'}"		//passa os dados para o servidor
		, success: function (data, status){                    
			var marcas = $.parseJSON(data.d); 													//salva o retorno do servidor em marcas
			$("#marcaDoProduto").autocomplete({ source: marcas }); 								//autoComplete 
        }
        , error: function (xmlHttpRequest, status, err) {										//erro no servidor
            alert('Ocorreu um erro no servidor');												//alerta de erro
        }
    });	
}
//______________________________ AUTO COMPLETE PRODUTO _______________________________________// 
function autoCompleteProduto(){
	
	var nomeProduto = $("#nomeDoProduto").val();												//salva valor do campo na variavel
	$.ajax({																					//chama a fun��o do servidor
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Produto.asmx/autocomplete"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeProduto:'"+nomeProduto+"'}"  //passa os dados para o servidor
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d); //salvando o nome dos produtos em um array
			$("#nomeDoProduto").autocomplete({ source: produtos }); 
        }
        , error: function (xmlHttpRequest, status, err) {										//erro no servidor
            alert('Ocorreu um erro no servidor');												//alerta de erro
        }
    });	
}

//_____________________ PESQUISA _______________________//

function mostrarPesquisa(){
	var newFields = document.getElementById('botaoLoucao');			
    newFields.style.display = 'block';
	var newFields = document.getElementById('nomeDoProduto');
    newFields.style.display = 'block';
}

function procurarProduto(flag){	
	var nome = $("#nomeDoProduto").val().trim();
	if(flag==1){
	window.localStorage.idListaClicada = window.localStorage.listaClicadaCheckin;
	window.localStorage.flag = 1;
	}
		
	window.localStorage.ProdutoProcurado=nome;
	window.location = "procurarProdutosLista.html";
}

//_____________________ CONTROLE CHECKIN _____________________//
function controleCheckin(flag){
	if(flag == "index"){																//checkin na index
		window.location = "checkinEstabelecimento.html";								//ir para a p�gina de checkin
		window.localStorage.idListaClicada = "";										//zerar idListaClicada do servidor
		window.localStorage.idEstabelecimentoClicado = "";								//zerar idEstabelecimento do servidor
		
	}else if(flag == "lista"){  														//checkin na lista
		window.localStorage.listaClicadaCheckin = window.localStorage.idListaClicada;	//atualiza listaclicadoCheckin com listaClicada
		window.location = "checkinEstabelecimento.html";								//ir para a p�gina de checkin
		
	}else{ 																				//checkin no estabelecimento
		var idEstabelecimento = window.localStorage.idEstabelecimentoClicado;
		escolherListas(idEstabelecimento);												//chama fun��o de escolher listas
	}
}

//_____________________ LISTA OS ESTABELECIMENTOS PARA O CHECKIN _____________________//
function listarEstabelecimento(){	
var idListaClicada = window.localStorage.idListaClicada;										//salva lista clicada do localStorage
	$.ajax({																					//chamando fun��o do servidor
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Estabelecimento.asmx/listarEstabelecimento"		//url
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'',bairro:'',cidade:''}" 	//dados da fun��o
        , success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);											//salvando o retorno do servidor em estabelecimentos
			
				if(idListaClicada != ""){														//se estiver em uma lista
					for(var i=0; i<estabelecimentos.length ;i++)								//for para listar estabelecimentos
					htmlListarEstabelecimentos(estabelecimentos[i],"lista");					//chamando html para listar estabelecimentos
				}else{																			//se nao estiver em nenhuma lista
					for(var i=0; i<estabelecimentos.length ;i++)								//for para listar estabelecimentos
					htmlListarEstabelecimentos(estabelecimentos[i],"index");					//chamando html para listar estabelecimentos
				}		
        }
        , error: function (xmlHttpRequest, status, err) {										//erro no servidor
            alert('Ocorreu um erro no servidor');												//alerta de erro
        }
    });
}

//_________________ LISTA AS LISTAS PARA SER REALIZADO O CHECKIN _________________//
function escolherListas(idEstabelecimento){	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/listarListas" //chamando a fun��o
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'		
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"'}"
        , success: function (data, status){                    
			var lista = $.parseJSON(data.d);
			if(typeof(lista.erro)=== 'undefined'){
				if(lista.length != 0){
					var confirme = confirm("Voc� n�o est� em nenhuma lista\n deseja escolher uma lista?");
					if(confirme){
						document.getElementById("nomeLista").innerHTML = "";
						for(var i=0; i<lista.length ;i++)
						htmlListarListas(lista[i],idEstabelecimento);							
					}
				}else{
					var alerta = document.createElement("p");
					alerta.innerHTML = "Voc� n�o possui nenhuma lista cadastrada";
					alerta.setAttribute("class","alert-lista-nao-criada");			
					var pai = document.getElementById("nomeLista");
					pai.appendChild(alerta);
				}
				
			}else{
				alert(lista.mensagem);
				window.location = "index.html";
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            alert('Ocorreu um erro no servidor');
        }
    });
}

//_________________ LISTA PRODUTOS PARA SER REALIZADO O CHECKIN _________________//
function retornarProdutosCheckIn(){	
	var idLista = window.localStorage.listaClicadaCheckin;							//pegando id da listaClicadaCheckin do localStorage
	var idEstabelecimento =	window.localStorage.estabelecimentoClicadoCheckin; 		//pegando id do estabelecimentoClicadoCheckin do localStorage

	$.ajax({																		//chamando servidor
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/retornarItens" //url
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idEstabelecimento:'"+idEstabelecimento+"'}" //dados 
        , success: function (data, status){                    
			var produtos = $.parseJSON(data.d);								//salvando retorno do servidor na variavel produtos
			document.getElementById("produtos_checkIn").innerHTML = "";		//zerando o html;
				for(var i=0; i<produtos.length ;i++)						//for para listar produtos
				htmlListarProdutos(produtos[i]);							//chamando html para listar produtos
        }
        , error: function (xmlHttpRequest, status, err) {					//erro do servidor
            alert('Ocorreu um erro no servidor');							//alerta de erro
        }
    });
}

//___________________________ FUN��O GUARDAR ITENS ________________________________//
var valorTotal = 0; 
var itens = [];																							//variavel itens
var aux = 0; 																							//variavel para acessar o array de itens
function guardarItens(prod){
	var aChk = document.getElementsByName("produtos"); 													//atribui o checkbox a variavel
	var verificarCheckMarcado = 0; 																		//variavel para zerar o total
	var idProduto = prod.id_produto;
	var preco = (prod.preco * prod.quantidade).toFixed(2);
	
	for (var i=0;i<aChk.length;i++){ 
		if(aChk[i].id == idProduto){
			if (aChk[i].checked == true){ 																//se check estiver marcado
				var confirme = confirm("Voc� confirma o pre�o desse produto?\n"+preco) 					//Menssagem para confirma o pre�o
				if(confirme){
					document.getElementById(aChk[i].id+"prod").className = "produto-escolhido"; 		//style para riscar o nome do produto
					var produtoAdicionado = document.getElementById("preco"+idProduto).title;			//verificar se o produto foi recem adicionado
					
					if(produtoAdicionado == 0)
						var idProduto = 0;
					else
						var idProduto = aChk[i].id
					
					/*-- adicionar produto no array --*/
					itens[aux] = {"id_Produto":idProduto,"idEstabelecimento":prod.id_estabelecimento}; 	//criando o objeto item para retornar ao servidor	
					aux++;																				//incrementa variavel aux
					valorTotal += parseFloat(preco);													//aumenta o pre�o do produto do valor total	
					document.getElementById("total_lista").innerHTML = "R$ "+ valorTotal.toFixed(2);	//atualiza o pre�o na tela
					console.log(itens);					
				}
			}else{ 																						//se check estiver desmarcado
			
				document.getElementById(aChk[i].id+"prod").className = "nome-produto-checkin";  		//desriscar o nome do produto
				verificarCheckMarcado++;
				/*-- remover produto do array --*/
				if(verificarCheckMarcado==2){
					valorTotal -= parseFloat(preco); 													//retira o pre�o do produto do valor total
					itens.splice((aux-1),1);         													//retira o objeto do array
					aux--;																				//desincrementa variavel aux
					document.getElementById("total_lista").innerHTML = "R$ "+ valorTotal.toFixed(2); 	//	atualiza o pre�o na tela
					console.log(itens);										
				}
			}
		}
	}	
}

/*==============================================
    GENERAL HTML AND STYLES    
    =============================================*/
/*listar estabelecimentos*/	
function htmlListarEstabelecimentos(estabelecimentos,flag){
	if(estabelecimentos != undefined){
		var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeEstab = document.createElement('a');
		var modal = document.createElement("div");
		var conteudo = document.createElement("div");

		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divPrincipal.setAttribute("id","divEstab"+estabelecimentos.id_estabelecimento);
		divPrincipal.setAttribute("name", "estabelecimentos");
		divPrincipal.setAttribute("role", "alert");

		divRole.setAttribute("class","panel-heading");
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
			
		img.setAttribute("src","assets/img/setaFechada.png");
		img.setAttribute("id","seta"+estabelecimentos.id_estabelecimento);
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");

		/* tag do nome */
		if(flag == "index"){
			nomeEstab.setAttribute("data-toggle","modal");
			nomeEstab.setAttribute("data-target","#escolher_lista");			
			nomeEstab.setAttribute("onclick","escolherListas('"+estabelecimentos.id_estabelecimento+"');");			
			nomeEstab.setAttribute('class',"titulos");
			nomeEstab.innerHTML = estabelecimentos.nome;
		}
		else if(flag == "lista"){
			var listaClick = window.localStorage.idListaClicada;
			nomeEstab.setAttribute('onclick',"localStorageCheckin('"+listaClick+"','"+estabelecimentos.id_estabelecimento+"')");
			nomeEstab.setAttribute("href","checkinProdutos.html");		
			nomeEstab.setAttribute('class',"titulos");
			nomeEstab.innerHTML = estabelecimentos.nome;		
		}
		
		modal.setAttribute("id",estabelecimentos.id_estabelecimento);
					modal.setAttribute("class","modal-fechado");
					conteudo.innerHTML = "<p class='conteudo-estab'>Cidade: "+estabelecimentos.cidade+"</br>"+
										 "Bairro: "+estabelecimentos.bairro+"</br>"+
										 "Unidade: "+estabelecimentos.numero+"</br></p>";

		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeEstab);
		a.appendChild(img);
		divPrincipal.appendChild(modal);
		modal.appendChild(conteudo);
		}	
	var pai = document.getElementById("nomeEstab");
	pai.appendChild(divPrincipal);
	img.setAttribute("onclick","controleModal("+estabelecimentos.id_estabelecimento+")");
}

//______________________ CONTROLE MODAL ______________________//
var aberto = "nao";
var idAberto = "0";
function controleModal(idModal)
{
	if(aberto == "nao" && idAberto==0){ //abra modal
		document.getElementById(idModal).className = "modal-aberto";
		document.getElementById("seta"+idModal).src = "assets/img/setaAberta.png";
		aberto="sim";
		idAberto = idModal;
		return;
	}
	
	if(aberto == "sim" && idAberto==idModal){//feche modal
		document.getElementById(idModal).className = "modal-fechado";
		document.getElementById("seta"+idModal).src = "assets/img/setaFechada.png";
		aberto="nao";
		idAberto="0";
		return;
	}
}

/*--Listar listas --*/
function htmlListarListas(lista,idEstabelecimento){
	if(lista != undefined){
		var inp = document.createElement("div");
		var nomeLista = document.createElement('a');

		nomeLista.setAttribute('class','titulos');
		nomeLista.setAttribute('onclick',"localStorageCheckin('"+lista.id_listaDeProdutos+"','"+idEstabelecimento+"')");
		nomeLista.setAttribute("href","checkinProdutos.html");	
		nomeLista.innerHTML = lista.nome;
		
		inp.setAttribute("id",lista.id_listaDeProdutos);
		inp.setAttribute("class", "alert alert-warning");
		inp.setAttribute("name", "listas");
		inp.setAttribute("role", "alert");
		inp.appendChild(nomeLista);
	}							
	var pai = document.getElementById("nomeLista");
	pai.appendChild(inp);
}

function localStorageCheckin(idLista,idEstabelecimento){  						
	window.localStorage.listaClicadaCheckin = idLista;
	window.localStorage.estabelecimentoClicadoCheckin = idEstabelecimento;
}

/*_______ LISTAR PRODUTOS PRO CHECKIN _______*/
function htmlListarProdutos(produtos)
{
	if(produtos != undefined){
		/*-- criando elementos --*/
		var inp = document.createElement("div");
		var nomeProduto = document.createElement('a');
		var checkbox = document.createElement('INPUT');
		var preco = document.createElement('div');
		
		/*-- nome --*/		
		nomeProduto.innerHTML = produtos.nome +" Qtd. "+produtos.quantidade;	
		nomeProduto.setAttribute("class","nome-produto-checkin");
		nomeProduto.setAttribute("id",produtos.id_produto+"prod");
		
		/*--- Controle de proutos pr� cadastrados no checkin ---*/
		for(var j=0 ;j<produtosRecemAdicionado.length;j++){													//pecorrer string de idLista e idProdutos 
			var stringListaProduto = produtosRecemAdicionado[j];											//id da lista e do produto
			var idLista = "";																				//variavel id da lista
			var id_produto = "";																			//variavel id do produto
			for(var u=0;u<stringListaProduto.length;u++){													//for para repartir a string
				if(stringListaProduto[u] != "-"){															//enquanto nao encontra a barra(-)
					idLista+= stringListaProduto[u];														//salva o id da lista
				}else{																						//se encontrou a barra(-)
					id_produto = stringListaProduto.substring((u+1),stringListaProduto.length);				//salva o id do produto
					break;
				}
			}
			if(id_produto == produtos.id_produto && window.localStorage.listaClicadaCheckin == idLista ||	//se for algum produto recem adicionado na lista respectiva
			(id_produto == produtos.nome && window.localStorage.listaClicadaCheckin == idLista) ){			//se for algum produto recem adicionado na lista respectiva
				var idProduto = 0;																			//o id desse produto ser� 0
				break;
			}else{																							//se nao for
				var idProduto = produtos.id_produto;														//o id do produto ser� seu id de origem
			}
		}
			
		/*-- checkbox --*/
		checkbox.setAttribute("id",produtos.id_produto);
		checkbox.setAttribute("value",produtos.nome);
		checkbox.setAttribute("type","checkbox");
		console.log(produtos);
		checkbox.setAttribute("onclick",guardarItens(produtos));
		checkbox.setAttribute("class","checkbox");
		
		/*-- pre�o --*/
		preco.setAttribute("class","preco-checkin");
		preco.setAttribute("title",idProduto);									//pre�o recebe o id para ser adicionado ao objeto produto(idOrigem ou 0 ou -idOrigem)
		preco.setAttribute("id","preco"+produtos.id_produto);
		
		if(produtos.preco != 0)													//se o produto tiver nenhum pre�o
			preco.innerHTML = "R$ "+ produtos.preco.toFixed(2);					//escreve esse pre�o na tela, formatado com duas casas decimais(to fixed(2))
		else																	//se nao tiver pre�o
			preco.innerHTML = "-";												//escreve um tra�o na tela
		
		/*-- definindo tags filhos --*/
		inp.setAttribute("id",produtos.id_produto);
		inp.setAttribute("class", "alert alert-warning");
		inp.setAttribute("name", "produtos");
		inp.setAttribute("role", "alert");
		inp.appendChild(nomeProduto);	
		inp.appendChild(checkbox);	
		nomeProduto.appendChild(preco);
	}						
	var pai = document.getElementById("produtos_checkIn");
	pai.appendChild(inp);

}