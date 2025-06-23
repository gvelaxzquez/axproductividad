var dsReporte = [];
var tablaReporteProyectos;

var columnasReporteProyectos = [

    {
        "data": "Nombre",
        "class": "text-left"
    },
    {
        "data": "Lider",
        "class": "text-left"
    },

    {
        "data": "AvanceCompPorc",
        "class": "text-right",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',') ;


        }

    },
    {
        "data": "AvanceRealPorc",
        "class": "text-right",
        "render": function (data, type, row) {

            if (row.DesfaseProc >= 15) {
                return '<span class="btn btn-danger btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }
            else if (row.DesfaseProc >= 5) {

                return '<span class="btn btn-warning btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }
            else  {

                return '<span class="btn btn-success btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }


        }
    },
    //{
    //    "data": "DesfaseProc",
    //    "class": "text-right",
    //    "render": function (data, type, row) {

    //        if (row.CostoProyectado >= row.CostoPlaneado) {
    //            return '<span class="btn btn-danger btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
    //        }
    //        else {

    //            return '<span class="btn btn-success btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
    //        }


    //    }
    //},
    {
        "data": "CostoHora",
        "class": "text-right",
        "render": function (data, type, row) {


            return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },

    {
        "data": "CostoPlaneado",
        "class": "text-right",
        "render": function (data, type, row) {


            return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },
    {
        "data": "CostoActual",
        "class": "text-right",
        "render": function (data, type, row) {


            return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },
    {
        "data": "CostoProyectado",
        "class": "text-right",
        "render": function (data, type, row) {

            if (row.CostoProyectado >= row.CostoPlaneado) {
                return '<span class="btn btn-danger btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }
            else {

                return '<span class="btn btn-success btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }


        }


    },



    {
        "data": "TotalIngreso",
        "class": "text-right",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },
    {
        "data": "Facturado",
        "class": "text-right",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "Cobrado",
        "class": "text-right",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "RentabilidadPlan",
        "class": "text-right",
        "render": function (data, type, row) {


            return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },
    {
        "data": "RentabilidadFacturado",
        "class": "text-right",
        "render": function (data, type, row) {


            return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },

    {
        "data": "RentabilidadProyectada",
        "class": "text-right",
        "render": function (data, type, row) {

            if (row.RentabilidadProyectada <= row.RentabilidadPlan) {
                return '<span class="btn btn-danger btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }
            else {

                return '<span class="btn btn-success btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }


        }
    },


];


$(document).ready(function () {


    $('#TxtFechaCorte').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

    $('#TxtFechaCorte').val(moment().format('DD/MM/YYYY'));


    ConsultarInformeProyectos();


    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });
});



$(document).on('click', '#BtnFiltrarIP', function (e) {

    ConsultarInformeProyectos();
    $(".filter-settings").toggleClass("active");
    return false;

});

function ConsultarInformeProyectos() {

    var url = $('#urlConsultaInformeProyectos').val();



    var Filtros = {
        FechaCorte: ObtieneFecha($('#TxtFechaCorte').val().trim()),
        Abiertos: $('#ChkAbiertos').prop('checked')

    }

    $("#lblFechaCortefiltro").text($('#TxtFechaCorte').val().trim());


    $.ajax({
        url: url,
        data: JSON.stringify({ Filtros: Filtros}),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {

                dsReporte = jQuery.parseJSON(data.Reporte);
                tablaReporteProyectos = inicializaTabla($('#TblReporte'), dsReporte, columnasReporteProyectos, 1, "asc", false, false, false);


              

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



$('#BtnExportarIP').click(e => {
    e.preventDefault();

    let formData = new FormData();
    var fecha = $('#TxtFechaCorte').val().trim();

    formData.append("FechaCorte",fecha) ;
    formData.append("Abiertos", $('#ChkAbiertos').prop('checked'));
    DOWNLOAD('/Report/DescargarExcelInformeProyectos', 'InformeProyectos.xlsx', formData, true);
});

