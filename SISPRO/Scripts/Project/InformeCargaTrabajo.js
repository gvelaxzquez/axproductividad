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

var dsinforme = [];
var tablainforme;
var columnasinforme = [
    {
        "class": "text-center",
        "data": "NumEmpleado",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="'+ row.CveRecurso  +'" src="http://app.yitpro.com/Archivos/Fotos/' +  data   + '.jpg"  alt="'+   data  + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },
    {
        "data": "NombreCompleto",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer;" onclick="ConsultaPerfil(' + row.IdUsuario +')"> <h4 style="margin-top:5px;"> ' + data +'</h4></a>'


        }
    },
    {
        "data": "Nivel",
        "class": "text-left"
    },
    {
        "data": "EstandarDiario",
        "class": "text-right"
    },
    {
        "data": "CantActividades",
        "class": "text-center"
    },
    {
        "data": "HorasDisponibles",
        "class": "text-right"
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right"
    },
    {
                  
        "class": "text-right",
          "render": function (data, type, row) {
          
              if (row.PorcOcupacion < 50) {
            
                  return '<button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.PorcOcupacion, '2', '.', ',') +  '%</button>';
                
              }
              else if (row.PorcOcupacion > 90 && row.PorcOcupacion <= 110 ) {
            
                return '<button class="btn btn-success btn-small "   style="width:100%;text-align:right;">' +  $.number(row.PorcOcupacion, '2', '.', ',') +  '%</button>';
              
              }
              else if (row.PorcOcupacion > 110 ) {
            
                return '<button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' +  $.number(row.PorcOcupacion, '2', '.', ',') +  '%</button>';
              
              }
              else {
                  return '<button class="btn btn-warning btn-small " style="width:100%;text-align:right;">' + $.number(row.PorcOcupacion, '2', '.', ',') + '%</button>';
                
              }
      
      }
       
   }
];
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
     
     
});


$(document).on('click', '#BtnFiltrarCT', function (e) {

    CargaInformeCargaTrabajo();

    return false;

});

function CargaInformeCargaTrabajo(){

    var url = $('#urlConsultaCargaTrabajo').val();

    var incio,fin;
    if ($("#TxtRangoFechas").val() != "") {
        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
        fin = ($("#TxtRangoFechas").val()).split('-')[1];
    }

    var datosBuscar = {
        FechaIni: inicio,
        FechaFinal: fin
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

           dsinforme = jQuery.parseJSON(data.Reporte);
           tablainforme = inicializaTabla($('#TblInforme'), dsinforme, columnasinforme, 1, "asc", true, true, true);


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
