var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

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

					/* tag do nome */
					nomeEstab.setAttribute("data-toggle","modal");
					nomeEstab.setAttribute("data-target","#escolher_lista");			
					nomeEstab.setAttribute("onclick","escolherListas();");			
					nomeEstab.setAttribute('class',"titulos");
					nomeEstab.innerHTML = estabelecimentos[i].nome;

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
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

function escolherListas(){	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/listarListas" //chamando a função
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'		
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"'}"
        , success: function (data, status){                    
			var lista = $.parseJSON(data.d);
			if(typeof(lista.erro) === 'undefined'){
				document.getElementById("nomeLista").innerHTML = "";
				for(var i=0; i<lista.length ;i++){
					if(lista[i] != undefined){
						var inp = document.createElement("div");
						var aTag = document.createElement('a');
			
						aTag.setAttribute('class','titulos');
						aTag.setAttribute("data-toggle","modal");
					    aTag.setAttribute("data-target","#checkIn");	
					    aTag.setAttribute("onclick","retornarProdutosCheckIn('"+lista[i].id_listaDeProdutos+"');");	
					    aTag.setAttribute("data-dismiss","modal");	
						aTag.innerHTML = lista[i].nome;
						inp.setAttribute("id",lista[i].id_listaDeProdutos);
						inp.setAttribute("class", "alert alert-warning");
						inp.setAttribute("name", "listas");
						inp.setAttribute("role", "alert");
						inp.appendChild(aTag);
					}							
					var pai = document.getElementById("nomeLista");
					pai.appendChild(inp);
				}
			}else{
				alert(itens.erro + "\n" + itens.Message);
				window.location = "index.html";
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

function retornarProdutosCheckIn(idLista){	

	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/retornarLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idListaDeProdutos:'"+idLista+"'}"
        , success: function (data, status){                    
			var produtos = $.parseJSON(data.d);				
			if(typeof(produtos.erro) === 'undefined'){
				document.getElementById("produtos_checkIn").innerHTML = "";
				for(var i=0; i<produtos.itens.length ;i++){
					if(produtos.itens[i] != undefined){
						var inp = document.createElement("div");
						var aTag = document.createElement('a');
						var checkbox = document.createElement('INPUT');
						
						aTag.innerHTML = produtos.itens[i].nome;
						aTag.setAttribute("class","nome-produto-checkin");
						aTag.setAttribute("id",produtos.itens[i].id_produto+"prod");
						
						checkbox.setAttribute("id",produtos.itens[i].id_produto);
						checkbox.setAttribute("value",produtos.itens[i].nome);
						checkbox.setAttribute("type","checkbox");
						checkbox.setAttribute("name","produtos");
						checkbox.setAttribute("onclick","guardarProdutos();");
						checkbox.setAttribute("class","checkbox");
						
						inp.setAttribute("id",produtos.itens[i].id_produto);
						inp.setAttribute("class", "alert alert-warning");
						inp.setAttribute("name", "produtos");
						inp.setAttribute("role", "alert");
						inp.appendChild(aTag);	
						inp.appendChild(checkbox);	
					}						
					var pai = document.getElementById("produtos_checkIn");
					pai.appendChild(inp);
				}
			}else{
				alert(itens.erro + "\n" + itens.Message);
				window.location = "index.html";
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

function guardarProdutos(){
	var aChk = document.getElementsByName("produtos");
	var aux = 0;
	var produtos = [];
	
    for (var i=0;i<aChk.length;i++){ 
		if (aChk[i].checked == true){ 
			// alert(aChk[i].value + " marcado.");
			document.getElementById(aChk[i].id+"prod").className = "produto-escolhido";  
			produtos[aux] = {"id_lista":aChk[i].id,"nomeProduto":aChk[i].value};
			aux++;
		}else{
			document.getElementById(aChk[i].id+"prod").className = "nome-produto-checkin";  
		}
	}	
}