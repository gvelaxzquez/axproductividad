

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

var dsReporteHoras= [];
var tablaReporteHoras;
var columnasReporteHoras = [
            {
                "data": "Nombre",
                "class": "text-left"
            },
             {
                 "data": "Lider",
                 "class": "text-left"
             },

              {
                  "data": "HorasPlan",
                  "class": "text-right"
              },
               {
                   "data": "HorasProgreso",
                   "class": "text-center"
               },
               {
                   "data": "HorasTerminadas",
                   "class": "text-center"
               }
         
];

$(document).ready(function () {


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
        startDate: moment(),
        endDate: moment()
    });

    $('#TxtRangoFechas').val(moment().format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY'));

});

$(document).on('click', '#BtnFiltrarRepHrs', function (e) {

    ConsultarResumenHoras();

    return false;

});


function ConsultarResumenHoras() {

    var url = $('#urlConsultaReporteHoras').val();

    var incio, fin;
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

                dsReporteHoras = jQuery.parseJSON(data.LstDetalle);
                tablaReporteHoras = inicializaTabla($('#TblReporteHoras'), dsReporteHoras, columnasReporteHoras, 1, "asc", true, true, true);
                ActualizaTablaExportar(data.LstDetalle);
                $('div.pg-loading-screen').remove();

            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}


function ActualizaTablaExportar(data){

       var dsExportar =  jQuery.parseJSON(data);


        $('#TblReporteHorasExportar tbody').html('');

        for (var i in dsExportar) {


            rows =     "<tr>"
                       + "<td class='text-center'>" + dsExportar[i].Nombre + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Lider + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].HorasPlan + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].HorasProgreso + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].HorasTerminadas + "</td>"
                       + "</tr>";
            $("#TblReporteHorasExportar tbody").append(rows);
        }


}