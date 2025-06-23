
var dsFlujo = [];

var tablaFlujo;

var dsFlujoMes = [];

var tablaFlujoMes;

$(document).ready(function () {

    $('#SelAnioFP').val($('#AnioActual').val());
    $('#SelAnioFP').selectpicker('refresh');


    CargarFlujo();
    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });
});

var ColumnasFlujo = [

    {
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujo(' + "'" + row.IdFlujoPago + "'" + ')" >' + row.ClaveProy + '</a>'
        }
    },
    {
        "data": "NombreProy",
        "class": "text-left",
    },
    {
        "data": "Cliente",
        "class": "text-left",
    },
    {
        "data": "Lider",
        "class": "text-left",
    },



    {
        "data": "TotalProyecto",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " +  $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "TotalFacturado",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " +  $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "TotalPagado",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " + $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "Saldo",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " + $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "Ene",
        "class": "text-right",
        "render": function (data, type, row) {


            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(1,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'

        }
    },
    {
        "data": "Feb",
        "class": "text-right",
        "render": function (data, type, row) {

            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(2,' + "" + row.IdProyecto + "," + data + ')" >'  +  $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Mar",
        "class": "text-right",
        "render": function (data, type, row) {
        

            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(3,' + "" + row.IdProyecto + "," + data+ ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Abr",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(4,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "May",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(5,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Jun",
        "class": "text-right",
        "render": function (data, type, row) {

            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(6,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Jul",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(7,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Ago",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(8,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Sep",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(9,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Oct",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(10,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Nov",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(11,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },
    {
        "data": "Dic",
        "class": "text-right",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujoMes(12,' + "" + row.IdProyecto + "," + data + ')" >'  + $.number(data, '2', '.', ','); + '</a>'
        }
    },


];

var ColumnasFlujoMes = [

    {
        "data": "Proyecto",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerFlujo(' + "'" + row.IdFlujoPago + "'" + ')" >' + data + '</a>'
        }
    },

    {
        "data": "Secuencia",
        "class": "text-center",
    },
    {

        "data": "Concepto",
        "class": "text-left",


    },

    {
        "data": "Procentaje",
        "class": "text-right",
        "render": function (data, type, row) {

            return $.number(data, '2', '.', ',') + "%";

        }
    },
    {
        "data": "FechaDevOriginal",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "FechaDev",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? 'Sin asignar' : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "FechaFactura",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "Factura",
        "class": "text-left",
    },
    {
        "data": "FechaProgramadaPago",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))

        }
    },
    {
        "data": "FechaPagoReal",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "Horas",
        "class": "text-right",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
        }
    },

    {
        "data": "Monto",
        "class": "text-right",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
        }
    },

    {
        "data": "IVA",
        "class": "text-right",
        "render": function (data, type, row) {
            return  $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "Total",
        "class": "text-right",
        "render": function (data, type, row) {
            return  $.number(data, '2', '.', ',');
        }
    }

];

function CargarFlujo() {

    var url = $('#urlObtieneFlujoPagos').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Anio: $('#SelAnioFP').val(), TipoFecha: $('#TipoFecha').val(), Archivado: $('#ChkArchivado').prop('checked') }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            dsFlujo = jQuery.parseJSON(data.LstFlujo);
            tablaFlujo = inicializaTabla($('#TblFlujo'), dsFlujo, ColumnasFlujo, 0, "desc", false, true, true);




        tablaFlujo.api().column(5).visible(false);
        tablaFlujo.api().column(6).visible(false);
        tablaFlujo.api().column(7).visible(false);
        tablaFlujo.api().column(4).visible(false);


             tablaFlujo.api().column(8).visible(true);
            tablaFlujo.api().column(9).visible(true);
            tablaFlujo.api().column(10).visible(true);
            tablaFlujo.api().column(11).visible(true);
            tablaFlujo.api().column(12).visible(true);
            tablaFlujo.api().column(13).visible(true);
            tablaFlujo.api().column(14).visible(true);
            tablaFlujo.api().column(15).visible(true);
            tablaFlujo.api().column(16).visible(true);
            tablaFlujo.api().column(17).visible(true);
            tablaFlujo.api().column(18).visible(true);
            tablaFlujo.api().column(19).visible(true);



        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}

function CambiaTipoFecha(tipo) {

    $('#TipoFecha').val(tipo);
    CargarFlujo();

}

$(document).on('click', '#BtnFiltrarFP', function (e) {

    CargarFlujo();
    $(".filter-settings").toggleClass("active");
    return false;

});

$(document).on('click', '#BtnNuevoFP', function (e) {

    VerFlujo(0);
    return false;

});

function VerFlujo(Id) {

    var url = $('#urlFlujoDetalle').val() + "/" + Id;

    window.open(url, '_blank');
}

$('#BtnExportarFP').click(e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("Anio", $('#SelAnioFP').val())
    formData.append("TipoFecha", $('#TipoFecha').val())
    formData.append("Archivado", $('#ChkArchivado').prop('checked'))
    DOWNLOAD('/Proyectos/DescargarExcelFlujoPagos', 'FlujoPagos.xlsx', formData, true);
});

function VerFlujoMes(Mes, IdProyecto, Total) {

    var url = $('#urlObtieneFlujoMes').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Anio: $('#SelAnioFP').val(),Mes : Mes, IdProyecto: IdProyecto, TipoFecha: $('#TipoFecha').val(), Archivado: $('#ChkArchivado').prop('checked') }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            dsFlujoMes = jQuery.parseJSON(data.LstFlujoMes);
            tablaFlujoMes = inicializaTabla($('#TblFlujoMes'), dsFlujoMes, ColumnasFlujoMes, 0, "desc", false, true, true);
            $('#MesD').val(Mes);
            $('#IdProyectoD').val(IdProyecto);

            $("#LblTotalFlujoMes").text("$ " + $.number(Total, '2', '.', ','));

            $("#ModalDetallePagosMes").modal('show');

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

$('#BtnExportarFPDM').click(e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("Anio", $('#SelAnioFP').val())
    formData.append("Mes", $('#MesD').val())
    formData.append("TipoFecha", $('#TipoFecha').val())
    formData.append("IdProyecto", $('#IdProyectoD').val())
    formData.append("Archivado", $('#ChkArchivado').prop('checked'))
    DOWNLOAD('/Proyectos/DescargaExcelFlujoPagosMes', 'FlujoPagos.xlsx', formData, true);
});

function MostrarSaldos() {



    tablaFlujo.api().column(5).visible(true);
    tablaFlujo.api().column(6).visible(true);
    tablaFlujo.api().column(7).visible(true);
    tablaFlujo.api().column(4).visible(true);


    tablaFlujo.api().column(8).visible(false);
    tablaFlujo.api().column(9).visible(false);
    tablaFlujo.api().column(10).visible(false);
    tablaFlujo.api().column(11).visible(false);
    tablaFlujo.api().column(12).visible(false);
    tablaFlujo.api().column(13).visible(false);
    tablaFlujo.api().column(14).visible(false);
    tablaFlujo.api().column(15).visible(false);
    tablaFlujo.api().column(16).visible(false);
    tablaFlujo.api().column(17).visible(false);
    tablaFlujo.api().column(18).visible(false);
    tablaFlujo.api().column(19).visible(false);


}