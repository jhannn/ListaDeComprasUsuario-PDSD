var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//___________________ CRIAR LISTA ________________________//
function criarLista(){
	var nomeLista = $("#nome_lista").val();
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	
    if (nomeLista != ''){ 	
		$.ajax({
            type: 'POST'
            , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/criarLista"
			, crossDomain:true
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',nomeLista:'"+nomeLista+"'}"
            , success: function (data, status){                    
				var lista = $.parseJSON(data.d); //salvando retorno do metodo do servidor                 
				if(typeof(lista.erro) === 'undefined'){
					alert("Lista criada com sucesso!");
					window.location = "visualizar-lista.html?id="+lista.id_listaDeProdutos;
					return;						
				}else{					
					alert(lista.erro + "\n" + lista.Message);
					return;
				}
			}
            , error: function (xmlHttpRequest, status, err) {
                $('.resultado').html('Ocorreu um erro');
            }
        });
    }else{
        alert("Campo vazio.");
		window.location = "principal.html#criar_lista";
		return false;
    }
}

//___________________ RETORNAR NOME LISTA ________________________//
function retornarNomeLista(){
	var idLista = parseInt(window.localStorage.idListaClicada);
    $.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/retornarLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        ,data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idListaDeProdutos:'"+idLista+"'}"
        , success: function (data, status){                    
			var nomeLista = $.parseJSON(data.d);               
			$("#tituloLista").html(nomeLista.nome);
		}
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_____________________________________ RETORNAR LISTA _____________________________________//
function retornarListas(){	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/listarListas" //chamando a função
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'						//tipos de dados de retorno
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"'}"
        , success: function (data, status){                    
			var lista = $.parseJSON(data.d);
			if(typeof(lista.erro) === 'undefined'){
				for(var i=0; i<lista.length ;i++){
					if(lista[i] != undefined){
						var inp = document.createElement("div");
						var aTag = document.createElement('a');
						var iconEdit = document.createElement('div');
						iconEdit.setAttribute("class", "iconEdit");
						iconEdit.setAttribute("onclick", "listaClicadaEditar('"+lista[i].id_listaDeProdutos+"')");
						iconEdit.setAttribute("data-target", "#editar_lista");
						iconEdit.setAttribute("data-toggle", "modal");
						var iconRemove = document.createElement('div');
						iconRemove.setAttribute("class", "iconRemove");
						iconRemove.setAttribute("onclick", "excluirLista('"+lista[i].id_listaDeProdutos+"')");
						aTag.setAttribute('class','titulos');
						aTag.setAttribute('href',"visualizar-lista.html?id="+lista[i].id_listaDeProdutos);
						aTag.innerHTML = lista[i].nome;
						inp.setAttribute("id",lista[i].id_listaDeProdutos);
						inp.setAttribute("class", "alert alert-warning");
						inp.setAttribute("name", "listas");
						inp.setAttribute("role", "alert");
						inp.appendChild(aTag);
						inp.appendChild(iconRemove);
						inp.appendChild(iconEdit);
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

//_____________________________________ ADICIONAR PRODUTOS À LISTA _____________________________________//
function criarProduto(){
	var nomeDoProduto = $("#nomeDoProduto").val();
	var codigoDeBarras = $("#cod_barra").val();
	var marca = $("#marcaDoProduto").val();
	var embalagem = parseInt($("#embalagemDoProduto").val());
	var quantidade = parseInt($("#quantidadeDoProduto").val());
	var unidade = parseInt($("#unidadeDoProduto").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	
	var url="http://localhost:52192/Servidor/ListaDeProdutos.asmx/criarProduto";
	var data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',quantidade:'"+quantidade+"'}";
	
	if(codigoDeBarras.trim() !=''){
		url="http://localhost:52192/Servidor/ListaDeProdutos.asmx/criarProdutoComCodigo";
		data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',codigo:'"+codigoDeBarras+"'tipoCod:'"+tipoCod+"',quantidade:'"+quantidade+"'}";
	}	
	
	if (nomeDoProduto.trim() != ''){
		$.ajax({
            type: 'POST'
            , url: url
			, crossDomain:true
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: data
            , success: function (data, status){
				var retorno=$.parseJSON(data.d);
				if(retorno=="OK"){
					alert("Produto cadastrado com sucesso!");
					window.location = "visualizar-lista.html?id="+idLista;
					return;					
				}else{
					alert(retorno.erro + "\n" + retorno.mensagem);
					return;
				}	
            }
            , error: function (xmlHttpRequest, status, err) {
                $('.resultado').html('Ocorreu um erro');
            }
        });
	}   
}

//_____________________________________ RETORNAR PRODUTOS DA LISTA (VISUALIZAR LISTA) _____________________________________//
function retornarProdutosDaListas(){	
	//Pegar id pela URR e mostrar produtos da lista 
	var queries = {};
	$.each(document.location.search.substr(1).split('&'), function(c,q){
		var i = q.split('=');
		queries[i[0].toString()] = i[1].toString();
	});
	
	// $("#nomeDaLista").html(queries['id']);
	var idLista=queries['id'];
	window.localStorage.idListaClicada= idLista;
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/retornarLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idListaDeProdutos:'"+idLista+"'}"
        , success: function (data, status){                    
			var produtos = $.parseJSON(data.d);					   //indice para pegar o nome
			if(typeof(produtos.erro) === 'undefined'){
				for(var i=0; i<produtos.itens.length ;i++){
					if(produtos.itens[i] != undefined){
						var inp = document.createElement("div");
						var aTag = document.createElement('a');
						var iconEdit = document.createElement('div');
						var quantidade = document.createElement('div');
						var iconRemove = document.createElement('div');
						
						iconEdit.setAttribute("class", "icone-editar-produto");
						iconEdit.setAttribute("data-target", "#");
						iconEdit.setAttribute("data-toggle", "modal");
						
						iconRemove.setAttribute("class", "icone-remove-produto");
						iconRemove.setAttribute("onclick", "excluirProdutoDaLista('"+produtos.itens[i].id_produto+"')");
						
						quantidade.innerHTML = "x"+produtos.itens[i].quantidade;
						quantidade.setAttribute("class","icone-quant");
						
						aTag.innerHTML = produtos.itens[i].nome;
						inp.setAttribute("id",produtos.itens[i].id_produto);
						inp.setAttribute("class", "alert alert-warning");
						inp.setAttribute("name", "produtos");
						inp.setAttribute("role", "alert");
						inp.appendChild(aTag);
						aTag.appendChild(quantidade);
						inp.appendChild(iconRemove);
						//inp.appendChild(quantidade);
						inp.appendChild(iconEdit);							
					}						
					var pai = document.getElementById("nomeDaLista");
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

//_____________________________ EDITAR NOME LISTA____________________________//
function editarNomeLista(){
	var idLista = parseInt(window.localStorage.idEditarLista);
	var idUsuario = ID_USUARIO;
	var novoNomeDaLista = $("#novo_nome_lista").val();
	var token = TOKEN;
    $.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/editarNomeLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',idLista:'"+idLista+"',novoNomeDaLista:'"+novoNomeDaLista+"'}"
        , success: function (data, status){                    
			var itens = $.parseJSON(data.d);               
			if(itens == "Ok"){
				alert("Nome da lista alterado com sucesso!");
				window.location = "listas.html";
				return;										
			}else{
				alert("Erro ao alterar o nome da lista.");
				return;	
			}
		}
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//______________________________________ EXCLUIR LISTA _____________________________________________//
function excluirLista(id) {
	var idLista = id;
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
   
   $.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/removerLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',idLista:'"+idLista+"'}"
        , success: function (data, status){                    
			var itens = $.parseJSON(data.d);                
			if(itens == "OK"){
				alert("Lista excluida com sucesso!");
				window.location = "listas.html";
				return;			
			}else{
				alert("Erro ao excluir a lista.");
				return;	
			}				
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_______________Excluir Produto da lista_______________________//
function excluirProdutoDaLista(id){
	var idLista = parseInt(window.localStorage.idListaClicada);
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	var idProduto = parseInt(id);
   
   $.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/removerProdutoDaLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',idProduto:'"+idProduto+"',idLista:'"+idLista+"'}"
        , success: function (data, status){                    
			var retorno = $.parseJSON(data.d);                
			if(retorno == "OK"){
				alert("Produto excluido da lista!");
				window.location = "visualizar-lista.html?id="+idLista;
				return;						
			}else{
				alert(retorno.erro + "\n" + itens.Message);
				window.location = "visualizar-lista.html?id="+idLista;
				return;
			}				
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

function listaClicadaEditar(id) {
	window.localStorage.idEditarLista = id;
}

////----------------------Loucuras de Johann ---------------------------//

function mostrarPesquisa(){
	var newFields = document.getElementById('botaoLoucao');
    newFields.style.display = 'block';
	var newFields = document.getElementById('teste');
    newFields.style.display = 'block';
}

function procurarProduto(){	
	var nome = $("#teste").val().trim();
	window.localStorage.ProdutoProcurado=nome;
	window.location = "procurarProdutosLista.html";
}