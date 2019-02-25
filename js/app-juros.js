(function() {
    function funcao(tax,nPrest,vetPrest,vetCarenciaAc,valorVista){
        var i,aux,aux1;
        tax = calcularTaxaDiaria(tax);
        aux = 0;
        for(i=0;i<nPrest;i++){
            aux += vetPrest[i]/(Math.exp(vetCarenciaAc[i]*Math.log(tax)));
        }
        aux1 = valorVista - aux;
        return aux1;
    }
    function igual(a,b){
        if(a/b > 0.999999 && a/b < 1.000001)
            return true;
        return false;
    }
    function calcularJuros(vetData,nPrest,valorVista,vetPrest,dataCompra){
        var vetCarencia,vetCarenciaAc;
        var a,b,f,p;
        var valor,valor1;
        vetCarencia = new Array(nPrest);
        vetCarenciaAc = new Array(nPrest);
        var juroDia = calcularTaxaDiaria(0.05);
        var fim;
        var taxaJuros;
        var diferenca,soma;
        vetCarencia[0] = diferencaDatas(dataCompra,vetData[0]);
        vetCarenciaAc[0] = vetCarencia[0];

        for(var i=1;i<nPrest;i++){
            vetCarencia[i] = diferencaDatas(vetData[i-1],vetData[i]);
            vetCarenciaAc[i] = vetCarenciaAc[i-1] + vetCarencia[i];
        }

        diferenca = valorVista;
        for(var i=0;i<nPrest;i++)
            diferenca -= (vetPrest[i])/(Math.exp(vetCarenciaAc[i] * Math.log(juroDia)));
        soma = 0;
        for(var i=0;i<nPrest;i++){
            if(vetPrest[i] == 0){
                soma += 0.01/(Math.exp(vetCarenciaAc[i]*Math.log(juroDia)));
            }
        }
        if(soma == 0){
            a = -1000000;
            b = 1000000;
            f = (a+b)/2;
            valor = funcao(f,nPrest,vetPrest,vetCarenciaAc,valorVista);
            valor1 = Math.abs(valor);
            fim = false;
            do{
                if(igual(a,b))
                    fim = true;
                else{
                    if(valor > 0){
                        b = f;
                        f = (a+b)/2;
                        if(f < 0)
                            fim = true;
                        else{
                            valor = funcao(f,nPrest,vetPrest,vetCarenciaAc,valorVista);
                            valor1 = Math.abs(valor);
                        }
                    }else{
                        a = f;
                        f = (a+b)/2;
                        if( f < 0)
                            fim = true;
                        else{
                            valor = funcao(f,nPrest,vetPrest,vetCarenciaAc,valorVista);
                            valor1 = Math.abs(valor);
                        }
                    }
                }
            }while(!fim);
            fim = false;
            if(f < 0)
                taxaJuros = 0;
            else
                taxaJuros = f;
        }
            return taxaJuros;
    }
    function diferencaDatas(dataCompra,dataParcela){
         var timeDiff = dataParcela.getTime() - dataCompra.getTime();
         var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

         return diffDays;
     }


    function calcularTaxaDiaria(valor){
        valor = valor/100 + 1;
        return Math.exp((1/30)*Math.log(valor));
    }
    function verificarCampos(valorVista,dataCompra,qtdParcelas,valorParcelas,dataParcelas){
        var sum = 0;
        if(isNaN(valorVista) || valorVista <= 0 || valorVista == ''){
            document.getElementById("preco-inicial").focus();
            return false;
        }
        if(isNaN(qtdParcelas) || qtdParcelas < 1 || qtdParcelas == ''){
            document.getElementById("numeroparcelas").focus();
            return false;
        }
        if(isNaN(dataCompra)){
            document.getElementById("data").focus();
            return false;
        }
        for(var i=0;i<qtdParcelas;i++){
            sum += parseInt(valorParcelas[i]);
            if(dataParcelas[i] == ''){
                document.getElementById("date"+i).focus();
                return false;
            }
            if(valorParcelas[i] < 0){
                document.getElementById("parcela"+i).focus();
                return false;
            }
        }
        if(sum < valorVista){
                alert("Erro: O Valor da soma das parcelas é menor do que o Valor à vista ")
                return false;
        }
        return true;
    }
    document.getElementById("calculo-juros").addEventListener("click",function(){
        var preco = document.getElementById("preco-inicial").value;
        var qtdParcelas = document.getElementById("numeroparcelas").value;
        var dataCompra = new Date(document.getElementById("data").value);
        var valorParcelas = [];
        var dataParcelas = [];
        var taxaJuros;
        var diferenca = 0;
        var totalPrazo = 0;
        for(var i=0;i<qtdParcelas;i++){
            if(document.getElementById("parcela"+i).value != '')
                valorParcelas.push(document.getElementById("parcela"+i).value);
            else
                valorParcelas.push(0);
            dataParcelas.push(new Date(document.getElementById("date"+i).value));
        }
        if(verificarCampos(preco,dataCompra,qtdParcelas,valorParcelas,dataParcelas)){
            taxaJuros = calcularJuros(dataParcelas,qtdParcelas,preco,valorParcelas,dataCompra);
            for(var i=0;i<qtdParcelas;i++)
                totalPrazo += parseFloat(valorParcelas[i]);
            diferenca = totalPrazo - preco;
            localStorage.setItem("tprazo",totalPrazo.toFixed(2));
            localStorage.setItem("juros",diferenca.toFixed(2));
            localStorage.setItem("porcentagem",taxaJuros);
            carregar();
            var resposta = document.getElementById("answer");
            resposta.classList.remove("d-none");
            resposta.scrollIntoView();
        }
    });

    document.getElementById("parcela0").addEventListener("blur",function(){
        var primeiraParcela = document.getElementById("parcela0").value;
        var qtdParcelas = document.getElementById("numeroparcelas").value;
        if(primeiraParcela != '' && qtdParcelas != '' && qtdParcelas > 1)
            document.getElementById("copiar-parcelas").hidden = false;
    });
    document.getElementById("copiar-parcelas").addEventListener("click",function(){
        var primeiraParcela = document.getElementById("parcela0").value;
        var qtdParcelas = document.getElementById("numeroparcelas").value;
        if(qtdParcelas != '' && qtdParcelas > 1)
            for(var i=1;i<qtdParcelas;i++)
                document.getElementById("parcela"+i).value = primeiraParcela;

    });

})();
