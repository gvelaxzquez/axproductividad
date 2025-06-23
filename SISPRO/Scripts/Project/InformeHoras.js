
var rangedateFormat = {
    "locale": {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Aplicar",
        "cancelLabel": "Cancelar",
        "fromLabel": "De",
        "toLabel": "A",
        "daysOfWeek": [
            "Do",
            "Lu",
            "Ma",
            "Mi",
            "Ju",
            "Vi",
            "Sa"
        ],
        "monthNames": [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Augosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ]
    }
};

var lacalesDTRP = {
    format: 'DD/MM/YYYY',
    applyLabel: 'Aplicar',
    cancelLabel: 'Cancelar',
    fromLabel: 'De:',
    toLabel: 'A:',
    customRangeLabel: 'Personalizar rango',
    daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};

$(document).ready(function () {

    $("#divReporte").hide();
    $('.DateRangePicker').daterangepicker({
        locale: lacalesDTRP,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días ': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            "Este año": [moment().startOf('year'), moment().endOf('year')],
            "Último año": [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        },
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month')
    });

        $('#TxtRangoFechas').val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));
     
        CargaProyectos();

});
var dsHorasEquipo = [];
var tablaHorasEquipo;
var dsHorasFase = [];
var tablaHorasFase;
var dsHorasRequerimiento = [];
var tablaHorasRequerimiento;
var dsHorasSprint = [];
var tablaHorasSprint;


var columnasHorasEquipo = [
    {
        "class": "text-center",
        "data": "CveRecurso",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="'+ row.CveRecurso  +'" src="http://app.yitpro.com/Archivos/Fotos/' +  data   + '.jpg"  alt="'+   data  + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },
    {
        "data": "Recurso",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer;" onclick="ConsultaPerfil(' + row.IdUsuario +')"> <h4 style="margin-top:5px;"> ' + data +'</h4></a>'


        }
    },
    {
        "data": "Estimadas",
        "class": "text-right"
    },
    {
        "data": "Asignadas",
        "class": "text-right"
    },
    {
        "data": "Real",
        "class": "text-right"
    },
    {
                  
        "class": "text-right",
          "render": function (data, type, row) {
          
              if (row.GAPAsignadoVsEstimado > 0) {
            
                  return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') +  '%</button>';
                
              }
              else {
                  return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') + '%</button>';
                
              }
      
      }
       
   },
   {
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsEstimado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsEstimado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsEstimado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
},
{
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsAsignado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsAsignado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsAsignado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
}
];
var columnasHorasFase = [

    {
        "data": "Fase",
        "class": "text-left",
    },
    {
        "data": "Estimadas",
        "class": "text-right"
    },
    {
        "data": "Asignadas",
        "class": "text-right"
    },
    {
        "data": "Real",
        "class": "text-right"
    },
    {
                  
        "class": "text-right",
          "render": function (data, type, row) {
          
              if (row.GAPAsignadoVsEstimado > 0) {
            
                  return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') +  '%</button>';
                
              }
              else {
                  return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') + '%</button>';
                
              }
      
      }
       
   },
   {
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsEstimado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsEstimado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsEstimado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
},
{
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsAsignado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsAsignado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsAsignado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
}
];
var columnasHorasRequerimiento = [

    {
        "data": "BR",
        "class": "text-left",
    },
    {
        "data": "Estimadas",
        "class": "text-right"
    },
    {
        "data": "Asignadas",
        "class": "text-right"
    },
    {
        "data": "Real",
        "class": "text-right"
    },
    {
                  
        "class": "text-right",
          "render": function (data, type, row) {
          
              if (row.GAPAsignadoVsEstimado > 0) {
            
                  return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') +  '%</button>';
                
              }
              else {
                  return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') + '%</button>';
                
              }
      
      }
       
   },
   {
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsEstimado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsEstimado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsEstimado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
},
{
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsAsignado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsAsignado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsAsignado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
}
];
var columnasHorasSprint = [

    {
        "data": "Sprint",
        "class": "text-left",
    },
    {
        "data": "Estimadas",
        "class": "text-right"
    },
    {
        "data": "Asignadas",
        "class": "text-right"
    },
    {
        "data": "Real",
        "class": "text-right"
    },
    {
                  
        "class": "text-right",
          "render": function (data, type, row) {
          
              if (row.GAPAsignadoVsEstimado > 0) {
            
                  return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') +  '%</button>';
                
              }
              else {
                  return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPAsignadoVsEstimado, '2', '.', ',') + '%</button>';
                
              }
      
      }
       
   },
   {
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsEstimado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsEstimado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsEstimado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
},
{
                  
    "class": "text-right",
      "render": function (data, type, row) {
      
          if (row.GAPRealVsAsignado > 0) {
        
              return ' <button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.GAPRealVsAsignado, '2', '.', ',') +  '%</button>';
            
          }
          else {
              return ' <button class="btn btn-success btn-small " style="width:100%;text-align:right;">' + $.number(row.GAPRealVsAsignado, '2', '.', ',') + '%</button>';
            
          }
  
  }
   
}
];





function CargaProyectos(){

    var url = $('#urlConsultaListaProyecto').val();

      $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){
       
                 if(data.Exito){
        
                  $('#SelProyectoIH').empty();
                  $('#SelProyectoIH').append(data.LstProyectos);
                  $('#SelProyectoIH').selectpicker('refresh');

                 }
                 else{

                 MensajeAdvertencia(data.Mensaje);
                }
        
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });
    return false;


}


$(document).on('click', '#BtnFiltrarIH', function (e) {

    CargaInformeHoras();

    return false;

});

function CargaInformeHoras(){

    var url = $('#urlConsultaInformeHoras').val();

    var incio,fin;
    if ($("#TxtRangoFechas").val() != "") {
        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
        fin = ($("#TxtRangoFechas").val()).split('-')[1];
    }

    var datosBuscar = {
        FechaIni: inicio,
        FechaFinal: fin,
        IdProyecto: $('#SelProyectoIH').val()
      
    }


    $.ajax({
        url: url,
        data: JSON.stringify(datosBuscar),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
        
            if (data.Exito) {

                var datos = jQuery.parseJSON(data.Reporte);

                $('#LblHorasEstimadas').text(datos.Estimadas);
                $('#LblHorasAsignadas').text(datos.Asignadas);
                $('#LblHorasReales').text(datos.Real);
              
            if(datos.GAPAsignadoVsEstimado > 0){

                $('#GAPAE').text(datos.GAPAsignadoVsEstimado + "%");
                $('#GAPAE').addClass("fa-sort-up");
                $('#GAPAE').removeClass("fa-sort-down");
                $('#GAPAE').removeClass("text-success");
                $('#GAPAE').addClass("text-danger");
            }
            else if(datos.GAPAsignadoVsEstimado < 0){

                $('#GAPAE').text(datos.GAPAsignadoVsEstimado + "%");
                $('#GAPAE').addClass("fa-sort-down");
                $('#GAPAE').removeClass("fa-sort-up")
                
                $('#GAPAE').addClass("text-success");
                $('#GAPAE').removeClass("text-danger");
            }
            else {
                $('#GAPAE').text("");
                $('#GAPAE').removeClass("fa-sort-up");
                $('#GAPAE').removeClass("fa-sort-down");
                $('#GAPAE').removeClass("text-success");
                $('#GAPAE').removeClass("text-danger");
            }
            

                          
            if(datos.GAPRealVsEstimado > 0){

                $('#GAPRE').text(datos.GAPRealVsEstimado + "%") ;
                $('#GAPRE').addClass("fa-sort-up");
                $('#GAPRE').removeClass("fa-sort-down");
                $('#GAPRE').removeClass("text-success");
                $('#GAPRE').addClass("text-danger");
            }
            else if(datos.GAPRealVsEstimado < 0){

                $('#GAPRE').text(datos.GAPRealVsEstimado + "%");
                $('#GAPRE').addClass("fa-sort-down");
                $('#GAPRE').removeClass("fa-sort-up")

                $('#GAPRE').addClass("text-success");
                $('#GAPRE').removeClass("text-danger");
            }
            else {
                $('#GAPRE').text("");
                $('#GAPRE').removeClass("fa-sort-up");
                $('#GAPRE').removeClass("fa-sort-down");
                $('#GAPRE').removeClass("text-success");
                $('#GAPRE').removeClass("text-danger");
            }

            if(datos.GAPRealVsAsignado > 0){

                $('#GAPRA').text(datos.GAPRealVsAsignado + "%");
                $('#GAPRA').addClass("fa-sort-up");
                $('#GAPRA').removeClass("fa-sort-down");
                $('#GAPRA').removeClass("text-success");
                $('#GAPRA').addClass("text-danger");
            }
            else if(datos.GAPRealVsAsignado < 0){

                $('#GAPRA').text(datos.GAPRealVsAsignado + "%");
                $('#GAPRA').addClass("fa-sort-down");
                $('#GAPRA').removeClass("fa-sort-up")
                $('#GAPRA').addClass("text-success");
                $('#GAPRA').removeClass("text-danger");
            }
            else {
                $('#GAPRA').text("");
                $('#GAPRA').removeClass("fa-sort-up");
                $('#GAPRA').removeClass("fa-sort-down");
                $('#GAPRA').removeClass("text-success");
                $('#GAPRA').removeClass("text-danger");
            }


            dsHorasEquipo = datos.LstIndicadorRecurso;
            tablaHorasEquipo = inicializaTabla($('#TblInformeRecurso'), dsHorasEquipo, columnasHorasEquipo, 1, "asc", true, true, true);

            dsHorasFase = datos.LstIndicadorFase;
            tablaHorasFase = inicializaTabla($('#TblInformeFases'), dsHorasFase, columnasHorasFase, 1, "asc", true, true, true);

            dsHorasRequerimiento = datos.LstIndicadorRequerimiento;
            tablaHorasRequerimiento = inicializaTabla($('#TblInformeRequerimiento'), dsHorasRequerimiento, columnasHorasRequerimiento, 1, "asc", true, true, true);

            dsHorasSprint = datos.LstIndicadorSprint;
            tablaHorasSprint = inicializaTabla($('#TblInformeSprint'), dsHorasSprint, columnasHorasSprint, 1, "asc", true, true, true);


            $("#divReporte").show();
            $('div.pg-loading-screen').remove();
            page_content_onresize();

        }
    },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

