
var dsReporte= [];
var tablaReporte;


var ColumnasReporte = [
    {
        "data": "Nombre",
        "class": "text-left",


    },

    {
        "data": "Planeado",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoHoraMes(' + row.IdProyecto + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return '<a style="cursor:pointer" href="#" onclick="VerCostoHoraMes(-1)" >' + $.number(data, '2', '.', ','); + '</a>'
            }
        }
    },

    {
        "data": "Asignado",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(1,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }




        }
    },
    {
        "data": "DiferenciaPlanAsignado",
        "class": "text-right",
        "render": function (data, type, row) {


            if (data >= 30) {
                return '<a style="cursor:pointer" class="badge badge-danger" href="#" onclick="VerCostoMes(2,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ',') + " %" ; + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }


        }
    },
    {
        "data": "Capacidad",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(3,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }



        }
    },
    {
        "data": "CapacidadPlan",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(4,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }


        }
    },
    {
        "data": "CapacidadAsignada",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(5,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }



        }
    },
    {
        "data": "GanadoPlan",
        "class": "text-right",
        "render": function (data, type, row) {

            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(6,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }



        }
    },
    {
        "data": "GanadoAsignado",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(7,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "EsfuerzoReal",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(8,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "EsfuerzoCapitalizado",
        "class": "text-right",
        "render": function (data, type, row) {
            if (data < 80) {
                return '<a style="cursor:pointer"  class="badge badge-danger" href="#" onclick="VerCostoMes(9,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    }

];


$(document).ready(function () {



    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });

    $('#SelMes').val($("#Mes").val());
    $('#SelMes').selectpicker('refresh');

    ConsultaInformeDiario();

});




$(document).on('click', '#BtnFiltrarID', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqFiltroCons");

    if (Mensaje != "") {

        MensajeAdvertencia(Mensaje);

        return false;
    }

    ConsultaInformeDiario();

    return false;

});


function ConsultaInformeDiario() {

    var url = $('#urlConsultaInformeDiario').val();



    var datosBuscar = {
        IdMes: $('#SelMes').val(),
        IdAnio: $('#SelAnio').val()
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

                $("#lblCortefiltro").text($("#SelMes option:selected").text() + " "+   $("#SelAnio option:selected").text());

                dsReporte = jQuery.parseJSON(data.LstReporte);
                tablaReporte = inicializaTabla($('#TblReporte'), dsReporte, ColumnasReporte, 0, "desc", false, true, true);


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