var dsReporteTiempos= [];
var tablaReporteTiempos;
var columnasReporteTiempos = [
    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="clickalerta('+  row.IdActividad +' )" >' + data + '</a>'
        }
    },
            {
                "data": "Descripcion",
                "class": "text-left"
            },
             {
                 "data": "Recurso",
                 "class": "text-left"
             },
             {
                "data": "Nivel",
                "class": "text-left"
            },
            {
                "data": "Nombre",
                "class": "text-left"
            },
            {
                "data": "Trabajado",
                "class": "text-right"
            },
              {
                  "data": "TrabajadoHrs",
                  "class": "text-right"
              },
              {
                "data": "DefectosInyectados",
                "class": "text-right"
            },
               {
                   "data": "TiempoDefectosInyectados",
                   "class": "text-right"
               },
               {
                "data": "DefectosRemovidos",
                "class": "text-right"
            },
               {
                   "data": "TiempoDefectosRemovidos",
                   "class": "text-right"
               }
         
];

$(document).ready(function(){

CargaInicialReporteTiempo();

});

function CargaInicialReporteTiempo(){



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

            $('#SelTipoActividadIdRT').append(data.LstTipoAct);
            $('#SelTipoActividadIdRT').selectpicker('refresh');

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

    ConsultarReporteTiempos();

    return false;

});

function ConsultarReporteTiempos() {



    var Mensaje = ValidaCamposRequeridos(".ReqReporteT");

    if (Mensaje.length == 0) {
        var url = $('#urlConsultaRT').val();




        $.ajax({
            url: url,
            data: JSON.stringify({IdProyecto: $("#SelProyectoRT").val(), IdFase:$("#SelTipoActividadIdRT").val()}),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
    
                if (data.Exito) {
    
                    dsReporteTiempos = jQuery.parseJSON(data.LstReporte);
                    tablaReporteTiempos = inicializaTabla($('#TblReporteTiempos'), dsReporteTiempos, columnasReporteTiempos, 1, "asc", true, true, true);
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


        $('#TblReporteTiemposExportar tbody').html('');

        for (var i in dsExportar) {


            rows =     "<tr>"
                       + "<td class='text-center'>" + dsExportar[i].IdActividadStr + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Descripcion+ "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Recurso + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Nivel + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Trabajado + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].TrabajadoHrs + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].DefectosInyectados + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].TiempoDefectosInyectados + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].DefectosRemovidos + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].TiempoDefectosRemovidos + "</td>"
                       + "</tr>";
            $("#TblReporteTiemposExportar tbody").append(rows);
        }


}