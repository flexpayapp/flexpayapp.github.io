//Ao carregar, pega os valores salvos em localStorage e aplica na tela 
function carregar(){
    //Pega os valores salvos em localStorage
    var juros = parseFloat(localStorage.getItem("juros"));
    var jurosPorcentagem = parseFloat(localStorage.getItem("porcentagem"));
    var prazo = parseFloat(localStorage.getItem("tprazo"));
    if(juros != null && jurosPorcentagem != null && prazo != null){
        document.getElementById("tprazo").innerHTML = "R$"+prazo.toLocaleString('pt-BR');//Aplica na tela
        document.getElementById("juros").innerHTML = "R$"+juros.toLocaleString('pt-BR');
        document.getElementById("porcentagem").innerHTML = jurosPorcentagem.toLocaleString('pt-BR')+"%";
        escolherItens(juros);
    }
}

//Dado um valor float n, retorna n arredondado, sem casas decimais
function arredondar(n){
    return ~~n;
}
function random(max){
    return (Math.floor(Math.random() * max));
}
//Compara a quantia de juros do produto com o preço de alguns produtos
function escolherItens(preco){
    var resto;
    var indice;
    var produtos100 = [
        {url:"cesta.png",descricaoS:"cesta<br>básica<br>grande",descricaoP:"cestas<br>básicas<br>grandes"},
        {url:"calca.png",descricaoS:"calça<br> jeans",descricaoP:"calças<br>jeans"},
        {url:"sneakers.png",descricaoS:"par<br>de tênis",descricaoP:"pares<br>de tênis"}
    ];
    var produtos50 = [
        {url:"pizza.png",descricaoS:"pizza(s)<br>grande",descricaoP:"pizzas<br>grandes"},
        {url:"camiseta.png",descricaoS:"camiseta",descricaoP:"camisetas"},
        {url:"cesta.png",descricaoS:"cesta<br>básica<br>média",descricaoP:"cestas<br>básicas<br>médias"}
    ];
    var produtos20 = [
        {url:"ingresso.png",descricaoS:"ingresso<br>de cinema",descricaoP:"ingressos<br>de cinema"},
        {url:"lanche.png",descricaoS:"lanche<br>médio",descricaoP:"lanches<br>médios"},
        {url:"tray.png",descricaoS:"almoço<br>executivo",descricaoP:"almoços<br>executivos"}
    ];
    resto = arredondar(preco/100);//Quantidade de produtos que custam R$100 que podem ser comprados
    if(resto > 0){
        indice = random(produtos100.length);
        document.getElementById("img100").src = "images/"+produtos100[indice].url;
        document.getElementById("span100").hidden = false;//Aparece a imagem
        if(resto > 1)
            document.getElementById("legenda100").innerHTML = resto + " " + produtos100[indice].descricaoP;
        else
            document.getElementById("legenda100").innerHTML = resto + " " + produtos100[indice].descricaoS;
    }else{
        document.getElementById("texto100").hidden = true;
        $("#span50").attr("class", "col-5");
        $("#texto50").attr("class", "col-2");
        $("#span20").attr("class", "col-5");
    }
    resto = arredondar(preco/50);//Quantidade de produtos que custam R$50 que podem ser comprados
    if(resto > 0){
        indice = random(produtos50.length);
        document.getElementById("img50").src = "images/"+produtos50[indice].url;
        document.getElementById("span50").hidden = false;
        if(resto > 1)
            document.getElementById("legenda50").innerHTML =resto + " " + produtos50[indice].descricaoP;
        else
            document.getElementById("legenda50").innerHTML =resto + " " + produtos50[indice].descricaoS;
    }else{
        document.getElementById("texto50").hidden = true;
        $("#span20").attr("class", "col-12");
    }
    resto = arredondar(preco/20);//Quantidade de produtos que custam R$20 que podem ser comprados
    if(resto > 0){
        indice = random(produtos20.length);
        document.getElementById("img20").src = "images/"+produtos20[indice].url;
        document.getElementById("equivalencias-section").hidden = false;
        document.getElementById("span20").hidden = false;
        if(resto > 1)
            document.getElementById("legenda20").innerHTML = resto + " " + produtos20[indice].descricaoP;
        else
        document.getElementById("legenda20").innerHTML = resto + " " + produtos20[indice].descricaoS;
    }
}