(function() {
    /**
     * @description Verifica os campos da página atualiza-parcela.html
     */
    function verificarCampos(valorVista,dataCompra,qtdParcelas,taxaJuros,valorParcelas,dataParcelas){
        if(isNaN(valorVista) || valorVista <= 0 || valorVista == ''){
            document.getElementById("preco-inicial").focus();
            return false;
        }
        if(isNaN(qtdParcelas) || qtdParcelas < 0 || qtdParcelas == ''){
            document.getElementById("numeroparcelas").focus();
            return false;
        }
        if(isNaN(taxaJuros) || taxaJuros < 0 || taxaJuros == ''){
            document.getElementById("taxa-juros").focus();
            return false;
        }
        if(isNaN(dataCompra)){
            document.getElementById("data").focus();
            return false;
        }
        for(var i=0;i<qtdParcelas;i++){
            if(isNaN(dataParcelas[i]) || dataParcelas[i] < 0){
                document.getElementById("date"+i).focus();
                return false;
            }
            if(valorParcelas[i] < 0){
                document.getElementById("parcela"+i).focus();
                return false;
            }
        }
        return true;
    }
    document.getElementById("calculo-juros").addEventListener("click",function(){
        var valorVista = document.getElementById("preco-inicial").value;
        var dataCompra = new Date(document.getElementById("data").value);
        var qtdParcelas = document.getElementById("numeroparcelas").value;
        var taxaJuros = document.getElementById("taxa-juros").value;
        var valorParcelas = [];
        var dataParcelas = [];

        for(var i=0;i<qtdParcelas;i++){
            if(!isNaN(document.getElementById("parcela"+i).value))
                valorParcelas.push(document.getElementById("parcela"+i).value);
            else
                valorParcelas.push(0);
            dataParcelas.push(diferencaDatas(dataCompra,new Date(document.getElementById("date"+i).value)));
        }
        if(verificarCampos(valorVista,dataCompra,qtdParcelas,taxaJuros,valorParcelas,dataParcelas)){
            calcularPrestacao(dataParcelas,qtdParcelas,valorVista,valorParcelas,taxaJuros);
            for(var i=0;i<qtdParcelas;i++)
                document.getElementById("parcela"+i).value = parseFloat(valorParcelas[i]).toFixed(2);
        }

    });
    function diferencaDatas(dataCompra,dataParcela){
        var timeDiff = dataParcela.getTime() - dataCompra.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return diffDays;
    }
    /**
     * @param {int} dataVenda
     * @param {int} vetData
     * @param {int} nPrest
     * @param {float} valorVista
     * @param {float} vetPrest
     * @param {float} juroMensal
     */
    function calcularPrestacao(vetData,nPrest,valorVista,vetPrest,juroMensal){
        var diferenca,soma,p;
        var vetCarencia,vetCarenciaAc;
        vetCarencia = new Array(nPrest);
        vetCarenciaAc = new Array(nPrest); //vetor de carencia acumulado
        var juroDia = calcularTaxaDiaria(juroMensal);
        vetCarencia[0] = vetData[0];
        vetCarenciaAc[0] = vetCarencia[0];

        for(var i=1;i<nPrest;i++){
            vetCarencia[i] = vetData[i] - vetData[i-1];
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
        p = diferenca/soma;
        for(var i=0;i<nPrest;i++){
            if(vetPrest[i] == 0){
                vetPrest[i] = 0.01*p;
            }
        }
    }
    function calcularTaxaDiaria(valor){
        valor = valor/100 + 1;
        return Math.exp((1/30)*Math.log(valor));
    }

})();
