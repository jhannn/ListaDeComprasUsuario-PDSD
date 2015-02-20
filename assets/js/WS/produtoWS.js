var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//______________________________ AUTO COMPLETE MARCA _______________________________________// 
function autoCompleteMarca(){
	
	var nomeMarca = $("#marcaProduto").val();
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Produto.asmx/autocompleteMarca"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeMarca:'"+nomeMarca+"'}"
		, success: function (data, status){                    
			var marcas = $.parseJSON(data.d); //salvando o nome das marcas em um array
			$("#marcaProduto").autocomplete({ source: marcas }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}
//______________________________ AUTO COMPLETE PRODUTO _______________________________________// 
function autoComplete(){
	
	var nomeProduto = $("#nomeDoProduto").val();
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Produto.asmx/autocomplete"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeProduto:'"+nomeProduto+"'}"
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d); //salvando o nome dos produtos em um array
			$("#nomeDoProduto").autocomplete({ source: produtos }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

//_______________________ PESQUISAR PRODUTO POR NOME ___________________________//
function pesquisarProduto()
{

	var nome = $("#nomeDoProduto").val().trim();
	var marca = $("#marcaProduto").val().trim();
	var embalagem = $('select[name=embalagem]').val(); 
	
	var dados;
	var url;
	var passou=false;
	
	if(window.localStorage.ProdutoProcurado!=undefined && window.localStorage.ProdutoProcurado!=''){
		nome=window.localStorage.ProdutoProcurado;
		marca="";
		console.log(nome);
		window.localStorage.ProdutoProcurado='';
	}

	//------ Pesquisar por embalagem ----//
	if(nome != "" && embalagem != 0){
		dados =  "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"',nome:'"+nome+"',embalagem:'"+embalagem+"'}"
		url = "http://localhost:52192/Servidor/Produto.asmx/pesquisarProdutosEmbalagem"
		passou=true;
	}
	
	//------ Pesquisar por nome -----//
	else if(nome != ""){
		dados = "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"',nome:'"+nome+"'}"
		url   = "http://localhost:52192/Servidor/Produto.asmx/pesquisarProdutosNome";
		passou=true;
	}
	
	//------ Pesquisar por marca -----//
	else if(marca != ""){
		dados = "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"'}"
		url = "http://localhost:52192/Servidor/Produto.asmx/pesquisarProdutosMarca"	
		passou=true;
	}
	
	else if(passou==false || window.localStorage.ProdutoProcurado!=undefined){
		document.getElementById("referencia").innerHTML = "";
		var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var nomeProduto = document.createElement("p");
				
		divRole.setAttribute("class", "btn btn-primary");
		divRole.setAttribute("data-target", "#cadastrar_produto_lista");
		divRole.setAttribute("data-toggle", "modal");
		divRole.innerHTML="Cadastrar um novo Produto!!"

		divPrincipal.setAttribute("class","panel panel-default");				
		nomeProduto.innerHTML="Nada foi encontrado!! Cadastre um novo Produto! =)";
				
		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(nomeProduto);
				
		var pai = document.getElementById("referencia");
		pai.appendChild(divPrincipal);
	}
	
	else
	{
		alert("Preencha pelo menos Nome ou Marca");
	}
	
	$.ajax({
        type: 'POST'
        , url: url
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: dados
		, success: function (data, status){  
			var produto = $.parseJSON(data.d);			
			if(produto.erro == "Erro de Pesquisa"){
				document.getElementById("referencia").innerHTML = "";
				var divPrincipal = document.createElement("div");
				var divRole = document.createElement("div");
				var nomeProduto = document.createElement("p");
				
				divRole.setAttribute("class", "btn btn-primary");
				divRole.setAttribute("data-target", "#cadastrar_produto_lista");
				divRole.setAttribute("data-toggle", "modal");
				divRole.innerHTML="Cadastrar um novo Produto!!"

				divPrincipal.setAttribute("class","panel panel-default");				
				nomeProduto.innerHTML="Nada foi encontrado!! Cadastre um novo Produto! =)";
				
				divPrincipal.appendChild(divRole);
				divPrincipal.appendChild(nomeProduto);
				
				var pai = document.getElementById("referencia");
				pai.appendChild(divPrincipal);
			}else{	
				document.getElementById("referencia").innerHTML = "";
				for(var i=0 ;i<produto.length ;i++)
				{ listaEstilo(produto[i]); }	
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

//______________________________ Adicionar Produto Na Lista _______________________________________// 
function adicionarProdutoNaLista(){	
	var quantidade = parseInt($("#quantidadeDeProdutosParaAdicionarNaLista").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	var idProduto=parseInt(window.localStorage.idProdutoAdicionarLista);
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/cadastrarProduto"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idProduto:'"+idProduto+"',quantidade:'"+quantidade+"'}"
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d);
			if(produtos=="OK"){
				alert("Produto cadastrado com sucesso!");
				window.location = "visualizar-lista.html?id="+idLista;
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
}

////________________________Editar Produto_____________________////
function editarProduto(){
	var nomeDoProduto = $("#nomeDoProdutoEditado").val();
	var codigoDeBarras = $("#cod_barraEditado").val();
	var marca = $("#marcaDoProdutoEditado").val();
	var embalagem = parseInt($("#embalagemDoProdutoEditado").val());
	var quantidade = parseInt($("#quantidadeDoProdutoEditado").val());
	var unidade = parseInt($("#unidadeDoProdutoEditado").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	var idProduto = parseInt(window.localStorage.idProdutoEditar);
	
	var url="http://localhost:52192/Servidor/ListaDeProdutos.asmx/editarProduto";
	var data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idProduto:'"+idProduto+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',quantidade:'"+quantidade+"'}";
	
	if(codigoDeBarras.trim() !=''){
		url="http://localhost:52192/Servidor/ListaDeProdutos.asmx/editarProdutoComCodigo";
		data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idProduto:'"+idProduto+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',codigo:'"+codigoDeBarras+"'tipoCod:'"+tipoCod+"',quantidade:'"+quantidade+"'}";
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
					alert("Produto editado com sucesso!");
					window.location = "visualizar-lista.html?id="+idLista;
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
	}   
}

//____________________________Id Produto no localStorage___________________//
function adicionarIdProdutoLocalStorage(id){
	window.localStorage.idProdutoAdicionarLista=id;
}

//____________________________Id Produto no localStorage___________________//
function pegarIdProdutoEditar(id){
	window.localStorage.idProdutoEditar=id;	
}

//---------- Constru��o de HTML no javascript --------------//
function listaEstilo(produto)
{
	var divPrincipal = document.createElement("div");
		var divProduto = document.createElement("div");
		var divRole = document.createElement("div");
		var iconEdit = document.createElement('div');
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeProduto = document.createElement("p");
		
		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divProduto.setAttribute("class","panel-heading");
		divRole.setAttribute("style", "display: block;");
		divRole.setAttribute("style", "width: 93% !important;");
		divRole.setAttribute("onclick", "adicionarIdProdutoLocalStorage('"+produto.id_produto+"')");
		divRole.setAttribute("data-target", "#adicionar_quantidade_de_produto_na_lista");
		divRole.setAttribute("data-toggle", "modal");	
		iconEdit.setAttribute("class", "iconEdit");
		iconEdit.setAttribute("style", "bottom: 32px;");
		iconEdit.setAttribute("onclick", "pegarIdProdutoEditar('"+produto.id_produto+"')");
		iconEdit.setAttribute("data-target", "#editar_produto");
		iconEdit.setAttribute("data-toggle", "modal");
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
		
		img.setAttribute("src","assets/img/detalhes.png");
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");
		
		nomeProduto.setAttribute("class","ajustes-lista");		
		nomeProduto.innerHTML = produto.nome;
		
		//--------//
		divPrincipal.appendChild(divProduto);
		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divProduto.appendChild(divRole);
		divProduto.appendChild(iconEdit);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeProduto);
		a.appendChild(img);
		
		var pai = document.getElementById("referencia");
		pai.appendChild(divPrincipal);	
}