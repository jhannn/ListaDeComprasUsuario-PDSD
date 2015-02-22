var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//_____________________ LISTA OS ESTABELECIMENTOS PARA O CHECKIN _____________________//
function listarEstabelecimento(){	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Estabelecimento.asmx/listarEstabelecimento"
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
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_________________ LISTA AS LISTAS PARA SER REALIZADO O CHECKIN _________________//
function escolherListas(idEstabelecimento){	
	var idListaClicada = window.localStorage.idListaClicada;
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/listarListas" //chamando a função
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'		
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"'}"
        , success: function (data, status){                    
			var lista = $.parseJSON(data.d);
			if(typeof(lista.erro)=== 'undefined'){
				if(lista.length != 0){
					// if(idListaClicada != ""){
						// retornarProdutosCheckIn(idListaClicada,idEstabelecimento);
					// }else{
						var confirme = confirm("Voce nao esta em nenhuma lista\n deseja escolher uma lista?");
						if(confirme){
							document.getElementById("nomeLista").innerHTML = "";
							for(var i=0; i<lista.length ;i++)
							htmlListarListas(lista[i],idEstabelecimento);
						}	
					// }
				}else{
					var alerta = document.createElement("p");
					alerta.innerHTML = "Voce nao possui nenhuma lista cadastrada";
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
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_________________ LISTA PRODUTOS PARA SER REALIZADO O CHECKIN _________________//
function retornarProdutosCheckIn(idLista,idEstabelecimento){	

	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/retornarItens"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idEstabelecimento:'"+idEstabelecimento+"'}"
        , success: function (data, status){                    
			var produtos = $.parseJSON(data.d);				
			document.getElementById("produtos_checkIn").innerHTML = "";
				for(var i=0; i<produtos.length ;i++)
				htmlListarProdutos(produtos[i]);
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//___________________________ FUNÇÃO GUARDAR ITENS ________________________________//
var valorTotal = 0; 
function guardarItens(idProduto,preco){
	var aChk = document.getElementsByName("produtos"); //atribui o checkbox a variavel
	var itens = [];	//variavel itens
	var aux = 0; 		//variavel para acessar o array de itens
	var verificarCheckMarcado = 0; //variavel para zerar o total quando nao tiver nenhum checkbox marcado
	
	for (var i=0;i<aChk.length;i++){ 
		if(aChk[i].id == idProduto && preco != 0){
			if (aChk[i].checked == true){
				var confirme = confirm("Voce confirma o preco desse produto?\n"+preco) //Menssagem para confirma o preço
				if(confirme){
					document.getElementById(aChk[i].id+"prod").className = "produto-escolhido"; //style para riscar o nome do produto
					itens[aux] = {"id_lista":aChk[i].id,"nomeProduto":aChk[i].value}; //criando o objeto item para retornar ao servidor					
					aux++;
					valorTotal += parseFloat(preco);	
					document.getElementById("total_lista").innerHTML = "R$ "+ valorTotal.toFixed(2);				
				}
			}else{
				document.getElementById(aChk[i].id+"prod").className = "nome-produto-checkin";  
				verificarCheckMarcado++;
				if(verificarCheckMarcado==2)
				valorTotal -= parseFloat(preco);
				document.getElementById("total_lista").innerHTML = "R$ "+ valorTotal.toFixed(2);				
			}
		}
	}	
}

/*==============================================
    GENERAL HTML AND STYLES    
    =============================================*/
/*listar estabelecimentos*/	
function htmlListarEstabelecimentos(estabelecimentos){
	if(estabelecimentos != undefined){
		var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeEstab = document.createElement('a');

		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divPrincipal.setAttribute("id",estabelecimentos.id_estabelecimento);
		divPrincipal.setAttribute("name", "estabelecimentos");
		divPrincipal.setAttribute("role", "alert");

		divRole.setAttribute("class","panel-heading");
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
			
		img.setAttribute("src","assets/img/detalhes.png");
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");

		/* tag do nome */
		nomeEstab.setAttribute("data-toggle","modal");
		nomeEstab.setAttribute("data-target","#escolher_lista");			
		nomeEstab.setAttribute("onclick","escolherListas('"+estabelecimentos.id_estabelecimento+"');");			
		nomeEstab.setAttribute('class',"titulos");
		nomeEstab.innerHTML = estabelecimentos.nome;

		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeEstab);
		a.appendChild(img);
		}	
	var pai = document.getElementById("nomeEstab");
	pai.appendChild(divPrincipal);	
}

/*--Listar listas --*/
function htmlListarListas(lista,idEstabelecimento){
	if(lista != undefined){
		var inp = document.createElement("div");
		var nomeLista = document.createElement('a');

		nomeLista.setAttribute('class','titulos');
		nomeLista.setAttribute("data-toggle","modal");
		nomeLista.setAttribute("data-target","#checkIn");	
		nomeLista.setAttribute("onclick","retornarProdutosCheckIn('"+lista.id_listaDeProdutos+"','"+idEstabelecimento+"');");	
		nomeLista.setAttribute("data-dismiss","modal");	
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

/*--listar produtos pro checkin --*/
function htmlListarProdutos(produtos)
{
	if(produtos != undefined){
		var inp = document.createElement("div");
		var nomeProduto = document.createElement('a');
		var checkbox = document.createElement('INPUT');
		var preco = document.createElement('div');
				
		nomeProduto.innerHTML = produtos.nome +" Qtd. "+produtos.quantidade;
		nomeProduto.setAttribute("class","nome-produto-checkin");
		nomeProduto.setAttribute("id",produtos.id_produto+"prod");
		
		checkbox.setAttribute("id",produtos.id_produto);
		checkbox.setAttribute("value",produtos.nome);
		checkbox.setAttribute("type","checkbox");
		checkbox.setAttribute("name","produtos");
		checkbox.setAttribute("onclick","guardarItens('"+produtos.id_produto+"','"+(produtos.preco * produtos.quantidade)+"')");
		checkbox.setAttribute("class","checkbox");
		
		preco.setAttribute("class","preco-checkin");
		preco.setAttribute("value",2);
		preco.setAttribute("id","preco"+produtos.id_produto);
		
		if(produtos.preco != 0){	
			var precoTotal = (produtos.preco * produtos.quantidade);
			preco.innerHTML = "R$ "+ precoTotal.toFixed(2);
		}else{
			preco.innerHTML = "-";
		}
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