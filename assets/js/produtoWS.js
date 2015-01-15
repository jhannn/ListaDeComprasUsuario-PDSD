var ID_USUARIO = 1;
var TOKEN = "124576453875";

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
/*$(function(){	
	$.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/Produto.asmx/retornarProdutos"
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{}"
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d); //salvando o nome dos produtos em um array
			$("#div_da_label_aqui" ).autocomplete({ source: produtos }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });			
});
 */