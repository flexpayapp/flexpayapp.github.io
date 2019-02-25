(function() {
  //Registra o service worker ao carregar a página
  if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
          navigator.serviceWorker
          .register('./service-worker.js', {scope:'./'})
          .then(function(registration) {
              console.log('Service Worker Registered');
          }).catch(function(err) {
              console.log("Service Worker registration failed: ",err);
          });
      });
    }
  function formatarData(j){
    var novaData;
    var dc = new Date(document.getElementById("data").value);
    var data;
    data = new Date(dc.getFullYear(),dc.getMonth()+j+1,dc.getDate()+1);
    //arrumando a data - objeto date conta os meses de 0 até 11, logo temos um problema em dezembro
    if(data.getMonth() == 0)//passagem do ano
      novaData = (data.getFullYear() -1)+"-";
    else
      novaData = data.getFullYear() + "-";
    if(data.getMonth() < 10)
      if(data.getMonth() == 0)//passagem do ano
        novaData += "12-";
      else
        novaData+= "0"+data.getMonth()+"-";
    else
      novaData+= data.getMonth()+"-";
    if(data.getDate() < 10)
      novaData += "0"+data.getDate();
    else
      novaData += data.getDate();

    return novaData;
  }
  $(document).ready(function(){
    var totalparcelas = 0;
    var maxparcelas = 24;
    var parcela = document.getElementById("atualiza-parcela");
    if(parcela != null){
      parcela.onclick = function(){
      document.getElementById("date0").value = formatarData(0);
        var i = Number($('#numeroparcelas').val());
        if(i!=0){
          if(i>totalparcelas){
            totalparcelas = i;
            for(j=1;j<i;j++){
              if(!document.getElementById("addr"+j).hasChildNodes()){
                $('#addr'+j).html("<td class='table-number-header text-center'>"+ (j+1)
                +"</td><td><input name='parcela' id='parcela"+j+"' type='number' placeholder='Valor da "+(j+1)+
                "ª ' class='form-control input-md text-center'  /> </td><td><input class='form-control text-center' id='date"+j+
                "' name='date' type='date'value='"+formatarData(j)+"'/></td>");
                $('#tab_logic').append('<tr id="addr'+(j+1)+'"></tr>');
            }};
          }
          else if(i<totalparcelas){
              j = totalparcelas;
              while(j > i-1){
                if(document.getElementById("addr"+(j)).hasChildNodes()){
                  $('#addr'+(j)).remove();
                }
                j--;
              }
              $('#addr'+totalparcelas).prop('id','addr'+i);
              totalparcelas = j;
          };
      }
      $('.collapse').collapse('show');
    };
  }
  });
})();
