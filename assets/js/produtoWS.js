var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//__________________________________ CADASTRAR PRODUTO ______________________________________//
var listaDeProdutos = [];
var i = 0;
function cadastrarProduto(){
	var codigoDeBarras = $("#cod_barra").val();
	var nomeDoProduto = $("#nome_produto").val();
	var formatoCodigoDeBarras = $("#formato").val();
	if(codigoDeBarras==""){
		codigoDeBarras=-1;
		formatoCodigoDeBarras=-1;
	}	
	var produtos = new Array(codigoDeBarras,formatoCodigoDeBarras,nomeDoProduto);
	listaDeProdutos[i++] = produtos;	
	window.location = "principal.html#editar_lista"
	document.getElementById("exibir").innerHTML = "- " + listaDeProdutos[i-1][2] +"<br />";
}

//______________________________ AUTO COMPLETE _______________________________________// 
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

function listarProduto()
{
	var produto = ["Feijao","Arroz"];
	
	for(var i=0 ;i<produto.length ;i++)
	{
		listaEstilo(produto[i],"descricao do produto");
	}
}

//---------- Construção de HTML no javascript --------------//
function listaEstilo(nomeLista,descricao)
{
	var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var divP = document.createElement("div");
		var painel = document.createElement("div");
		var nomeProduto = document.createElement("p");
		
		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divRole.setAttribute("class","panel-heading");
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
		
		img.setAttribute("src","assets/img/detalhes.png");
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");
		
		nomeProduto.setAttribute("class","ajustesLista");
		nomeProduto.innerHTML = nomeLista;
		
		divP.setAttribute("id",i);
		painel.setAttribute("class","panel-body");
		painel.innerHTML = descricao;
		
		//--------//
		
		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divPrincipal.appendChild(divP);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeProduto);
		a.appendChild(img);
		divP.appendChild(painel);
		
		var pai = document.getElementById("referencia");
		pai.appendChild(divPrincipal);	
}