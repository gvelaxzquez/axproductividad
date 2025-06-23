var dsReporteTamanos= [];
var tablaReporteTamanos;
var columnasReporteTamanos = [
    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="clickalerta('+  row.IdActividad +' )" >' + data + '</a>'
        }
    },
            {
                "data": "DescripcionActividad",
                "class": "text-left"
            },
             {
                 "data": "Descripcion",
                 "class": "text-left"
             },
             {
                "data": "TipoParteIdStr",
                "class": "text-left"
            },
            {
                "data": "EBase",
                "class": "text-right"
            },
            {
                "data": "EEliminadas",
                "class": "text-right"
            },
            {
                "data": "EModificadas",
                "class": "text-right"
            },
            {
                "data": "EAgregadas",
                "class": "text-right"
            },
            {
                "data": "ABase",
                "class": "text-right"
            },
            {
                "data": "AEliminadas",
                "class": "text-right"
            },
            {
                "data": "AModificadas",
                "class": "text-right"
            },
            {
                "data": "AAgregadas",
                "class": "text-right"
            },
         
];

$(document).ready(function(){

CargaInicialReporteTamanos();
});

function CargaInicialReporteTamanos(){



    var url = $('#urlCargaInicialRT').val();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {

             $('#SelProyectoRT').append(data.LstProyectos);
             $('#SelProyectoRT').selectpicker('refresh')



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

$(document).on('click', '#BtnFiltrarRT', function (e) {

    ConsultarReporteTamanos();

    return false;

});

function ConsultarReporteTamanos() {



    var Mensaje = ValidaCamposRequeridos(".ReqReporteT");

    if (Mensaje.length == 0) {
        var url = $('#urlConsultaRT').val();




        $.ajax({
            url: url,
            data: JSON.stringify({IdProyecto: $("#SelProyectoRT").val()}),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
    
                if (data.Exito) {
    
                    dsReporteTamanos = jQuery.parseJSON(data.LstReporte);
                    tablaReporteTamanos = inicializaTabla($('#TblReporteTamanos'), dsReporteTamanos, columnasReporteTamanos, 1, "asc", true, true, true);
                    ActualizaTablaExportar(data.LstReporte);
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
    else {


        MensajeAdvertencia(Mensaje);
    }

}


function ActualizaTablaExportar(data){

       var dsExportar =  jQuery.parseJSON(data);


        $('#TblReporteTamanosExportar tbody').html('');

        for (var i in dsExportar) {


            rows =     "<tr>"
                       + "<td class='text-center'>" + dsExportar[i].IdActividadStr + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].DescripcionActividad+ "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Descripcion + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].TipoParteIdStr + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].EBase + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].EEliminadas + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].EModificadas + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].EAgregadas + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].ABase + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].AEliminadas + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].AModificadas + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].AAgregadas + "</td>"
                       + "</tr>";
            $("#TblReporteTamanosExportar tbody").append(rows);
        }


}