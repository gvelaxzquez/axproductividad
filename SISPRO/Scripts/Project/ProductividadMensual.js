
var tablasEncabezado = {};
var tablasDetalle = {};
var dsEncabezado = [];
var dsEncabezadoLider = [];
var dsDetalle;
var listaDetalle = [];
var dsDetalleLider;
var listaDetalleLider = [];

$('.table-responsive').on('show.bs.dropdown', function () {
    $('.table-responsive').css("overflow", "inherit");
});

$('.table-responsive').on('hide.bs.dropdown', function () {
    $('.table-responsive').css("overflow", "auto");
});

var lenguajeEs = {
    "lengthMenu": "Mostrando _MENU_ registros por página",
    "zeroRecords": "Sin resultados",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Página _PAGE_ de _PAGES_",
    "infoEmpty": "No hay registros",
    "infoFiltered": "(filtrado de _MAX_ registros totales)",
    "search": ""
}

var htmlTablaDetalle = "<h3> <span class='label label-info'></span></h3>" +
    "<div class='row table-responsive'>" +
    "<table id='@tabla@Detalle' class='table table-striped table-detail tablaDetalle'>" +
    "<thead>" +
    "<tr>" +
    "<th>Proyecto</th>" +
    "<th>Fase</th>" +
    "<th>Tipo actividad</th>" +
    "<th>Actividad</th>" +
    "<th>Horas asignadas</th>" +
    "<th>Horas finales</th>" +
    "<th>Fecha término</th>" +
    "</tr>" +
    "</thead>" +
    "</table>" +
    "</div>";

var htmlTablaDetalleLider = "<h3> <span class='label label-info'></span></h3>" +
    "<div class='row table-responsive'>" +
    "<table id='@tabla@Detalle' class='table table-striped table-detail tablaDetalle'>" +
    "<thead>" +
    "<tr>" +
    "<th>Proyecto</th>" +
    "<th>Cumple avance</th>" +
    "<th>Cumple costo</th>" +
    "<th>Cumple rentabilidad</th>" +
    "<th>Cumple captura</th>" +
    "<th>Facturado</th>" +
    "<th>Porcentaje</th>" +
    "<th>Bono potencial</th>" +
    "<th>Bono a pagar </th>" +
    "</tr>" +
    "</thead>" +
    "</table>" +
    "</div>";

$(document).ready(function () {

    InicializarCons();

    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });

});

var columnasEncabezado = [
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-grid details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
        }
    },
    {
        "data": "Recurso",
        "class": "text-left",
    },
    {
        "data": "Nivel",
        "class": "text-left",
    },
    {
        "data": "EstandarMes",
        "class": "text-right",
    },

    {
        "data": "HorasSolicitadas",
        "class": "text-right",
    },
    {
        "data": "HorasLiberadas",
        "class": "text-right",
    },
    {
        "data": "BonoCumplimiento",
        "class": "text-center",
        "render": function (data, type, row) {
            return "$ " + $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "HorasAdicionales",
        "class": "text-right",
    },
    {
        "data": "BonoHoras",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " + $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "Total",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " + $.number(data, '2', '.', ',');
        }
    },

    {
        "data": "Productividad",
        "class": "text-right",
    },
    {
        "data": "IdUsuario",
        "visible": false
    }
];
var columnasEncabezadoLider = [
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-success details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
        }
    },
    {
        "data": "Recurso",
        "class": "text-left",
    },

    {
        "data": "Proyectos",
        "class": "text-center",
    },
    {
        "data": "BonoPotencial",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " + $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "Total",
        "class": "text-right",
        "render": function (data, type, row) {
            return "$ " + $.number(data, '2', '.', ',');
        }
    }
];

function inicializaTablaComp(nombreTabla, datos) {
    tablasEncabezado[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": false,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": true,
        destroy: true,
        data: datos,
        columns: columnasEncabezado,
        "order": [[1, 'asc']],

    });

    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
        filaPadre = $(this).closest('tr');

        var row = tablasEncabezado[nombreTabla].api().row(filaPadre); //table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            filaPadre.removeClass('shown');
            $("i", this).removeClass("fa-minus");
            $("i", this).addClass("fa-plus");
        }
        else {
            $("i", this).removeClass("fa-plus");
            $("i", this).addClass("fa-minus");

            // Open this row
            row.child(format(row.data(), nombreTabla)).show();

            tablasDetalle[nombreTabla + row.data().IdUsuario] = $("." + nombreTabla + row.data().IdUsuario).dataTable({
                responsive: true,
                "bSort": false,
                "bPaginate": false,
                "searching": false,
                "autoWidth": true,
                "bLengthChange": true,
                destroy: true,
                data: dsDetalle,
                columns: [
                    {
                        "data": "ProyectoStr",
                        "class": "text-left"
                    },
                    {
                        "data": "TipoActividadStr",
                        "class": "text-left"
                    },
                    {
                        "data": "ClasificacionStr",
                        "class": "text-left"
                    },
                    {
                        "data": "Descripcion",
                        "class": "text-left"
                    },
                    {
                        "data": "HorasAsignadas",
                        "class": "text-right"
                    },
                    {
                        "data": "HorasFinales",
                        "class": "text-right"
                    },

                    {
                        "data": "FechaTermino",
                        "class": "text-center",
                        "render": function (data, type, row) {
                            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                        }
                    }
                ],
                "order": [[1, 'asc']],
                createdRow: function (row, data, dataIndex) {
                    $(row).find('td:eq(0)').attr('data-name', 'ProyectoStr');
                    $(row).find('td:eq(1)').attr('data-name', 'TipoActividadStr');
                    $(row).find('td:eq(2)').attr('data-name', 'ClasificacionStr');
                    $(row).find('td:eq(3)').attr('data-name', 'Descripcion');
                    $(row).find('td:eq(4)').attr('data-name', 'HorasAsignadas');
                    $(row).find('td:eq(5)').attr('data-name', 'HorasFinales');
                    $(row).find('td:eq(6)').attr('data-name', 'FechaTermino');
                },

            });



            filaPadre.addClass('shown');
        }
    });


}


function inicializaTablaLider(nombreTabla, datos) {
    tablasEncabezado[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": false,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": true,
        destroy: true,
        data: datos,
        columns: columnasEncabezadoLider,
        "order": [[1, 'asc']],

    });

    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
        filaPadre = $(this).closest('tr');

        var row = tablasEncabezado[nombreTabla].api().row(filaPadre); //table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            filaPadre.removeClass('shown');
            $("i", this).removeClass("fa-minus");
            $("i", this).addClass("fa-plus");
        }
        else {
            $("i", this).removeClass("fa-plus");
            $("i", this).addClass("fa-minus");

            // Open this row
            row.child(formatlider(row.data(), nombreTabla)).show();

            tablasDetalle[nombreTabla + row.data().IdUsuario] = $("." + nombreTabla + row.data().IdUsuario).dataTable({
                responsive: true,
                "bSort": false,
                "bPaginate": false,
                "searching": false,
                "autoWidth": true,
                "bLengthChange": true,
                destroy: true,
                data: dsDetalle,
                columns: [
                    {
                        "data": "Proyecto",
                        "class": "text-left"
                    },
                    {
                        "data": "CumpleCriterioAvance",
                        "class": "text-center",
                        "render": function (data, type, row) {
                            return (data == 1 ? '<span class="fa fa-check"></span>' : '<span class="fa fa-times"></span>')
                        }
                    },
                    {
                        "data": "CumpleCriterioCosto",
                        "class": "text-center",
                        "render": function (data, type, row) {
                            return (data == 1 ? '<span class="fa fa-check"></span>' : '<span class="fa fa-times"></span>')
                        }
                    },
                    {
                        "data": "CumpleCriterioRentabilidad",
                        "class": "text-center",
                        "render": function (data, type, row) {
                            return (data == 1 ? '<span class="fa fa-check"></span>' : '<span class="fa fa-times"></span>')
                        }
                    },
                    {
                        "data": "CumpleCriterioCaptura",
                        "class": "text-center",
                        "render": function (data, type, row) {
                            return (data == 1 ? '<span class="fa fa-check"></span>' : '<span class="fa fa-times"></span>')
                        }
                    },
                    {
                        "data": "Facturado",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            return "$ " + $.number(data, '2', '.', ',');
                        }
                    },

                    {
                        "data": "Productividad",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            return  $.number(data, '2', '.', ',') +  "%";
                        }
                    },
                    {
                        "data": "BonoPotencial",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            return "$ " + $.number(data, '2', '.', ',');
                        }
                    },
                    {
                        "data": "Total",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            return "$ " + $.number(data, '2', '.', ',') ;
                        }
                    }
                ],
                "order": [[1, 'asc']],
                createdRow: function (row, data, dataIndex) {
                    $(row).find('td:eq(0)').attr('data-name', 'Proyecto');
                    $(row).find('td:eq(1)').attr('data-name', 'CumpleCriterioAvance');
                    $(row).find('td:eq(2)').attr('data-name', 'CumpleCriterioCosto');
                    $(row).find('td:eq(3)').attr('data-name', 'CumpleCriterioRentabilidad');
                    $(row).find('td:eq(4)').attr('data-name', 'CumpleCriterioCaptura');
                    $(row).find('td:eq(5)').attr('data-name', 'Facturado');
                    $(row).find('td:eq(6)').attr('data-name', 'Productividad');
                    $(row).find('td:eq(7)').attr('data-name', 'BonoPotencial');
                    $(row).find('td:eq(7)').attr('data-name', 'Total');
                },

            });



            filaPadre.addClass('shown');
        }
    });


}


function InicializarCons() {

    var url = $('#urlIniConsultaComp').val();




    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {


                $('#SelAnio').append(data.LstAnios);

                $('#SelAnio').val(data.Anio);
                $('#SelMes').val(data.Mes);

                $('#SelAnio').selectpicker('refresh');
                $('#SelMes').selectpicker('refresh');


                $('#SelRecursoCons').empty();
                $('#SelRecursoCons').append(data.LstUsuarios);
                $('#SelRecursoCons').selectpicker('refresh');

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


$(document).on('click', '#BtnFiltrarCons', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqFiltroCons");

    if (Mensaje != "") {

        MensajeAdvertencia(Mensaje);

        return false;
    }

    ConsultaCompensaciones();

    return false;

});



function ConsultaCompensaciones() {

    var url = $('#urlConsultaCompensaciones').val();



    var datosBuscar = {
        Mes: $('#SelMes').val(),
        Anio: $('#SelAnio').val(),
        LstResponsable: $('#SelRecursoCons').val()
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

                var primeravez = !(dsEncabezado.length > 0);

                var Enc = eval('(' + data.LstEncabezado + ')');
                var Det = eval('(' + data.LstDetalle + ')');

                var EncL = eval('(' + data.LstEncabezadoLider + ')');
                var DetL = eval('(' + data.LstDetalleLider + ')');

                dsEncabezado = Enc;
                listaDetalle = Det;

                dsEncabezadoLider = EncL;
                listaDetalleLider = DetL;
             /*   ActualizaTablaExportar(data.LstEncabezado);*/

                $('div.pg-loading-screen').remove();

                if (primeravez) {
                    inicializaTablaComp('TblCompensacion', dsEncabezado);
                    inicializaTablaLider('TblCompensacionLider', dsEncabezadoLider);
                }

                else {

                    refrescaTablaComp();
                    refrescaTablaLider();
                }
                   
                $(".filter-settings").toggleClass("active");
       

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

function refrescaTablaLider() {
    tablasEncabezado['TblCompensacion'].api().clear().rows.add(dsEncabezado).draw();
}
function refrescaTablaComp() {
    tablasEncabezado['TblCompensacionLider'].api().clear().rows.add(dsEncabezadoLider).draw();
}

function format(d, nombreTabla) {
    var htmlDetalle = '';


    dsDetalle = $.grep(listaDetalle, function (a, b) {
        return a.IdUsuarioAsignado === d.IdUsuario;
    });

    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdUsuario);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdUsuario);

    //auxOc = d.Oc;
    return htmlDetalle;

}

function formatlider(d, nombreTabla) {
    var htmlDetalle = '';


    dsDetalle = $.grep(listaDetalleLider, function (a, b) {
        return a.IdUsuario === d.IdUsuario;
    });

    htmlDetalle = htmlTablaDetalleLider.replace('@tabla', nombreTabla + d.IdUsuario);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdUsuario);

    //auxOc = d.Oc;
    return htmlDetalle;

}

function ObtieneFecha(fechacapturada) {

    var fecha;

    if (fechacapturada.trim() != "") {

        var fechav = fechacapturada.split('/');
        var diav = parseInt(fechav[0]);
        var mesv = parseInt(fechav[1]) - 1;
        var aniov = parseInt(fechav[2]);
        fecha = new Date(aniov, mesv, diav, 0, 0, 0);
    }
    else {
        fecha = null;
    }

    return fecha;


}



$('#BtnExportarPDT').click(e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("Anio", $('#SelAnio').val())
    formData.append("Mes", $('#SelMes').val())
    DOWNLOAD('/Report/DescargarExcelConsultaCompensaciones', 'ReporteProductividadEquipo.xlsx', formData, true);
});

$('#BtnExportarPA').click(e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("Anio", $('#SelAnio').val())
    formData.append("Mes", $('#SelMes').val())
    DOWNLOAD('/Report/DescargarExcelConsultaCompensacionesLider', 'ReporteProductividadAdminProy.xlsx', formData, true);
});


//function ActualizaTablaExportar(data) {

//    var dsExportar = jQuery.parseJSON(data);


//    $('#TblCompensacionesExportar tbody').html('');

//    for (var i in dsExportar) {


//        rows = "<tr>"
//            + "<td class='text-left'>" + dsExportar[i].Recurso + "</td>"
//            + "<td class='text-left'>" + dsExportar[i].Nivel + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].EstandarMes + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].HorasSolicitadas + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].HorasLiberadas + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].BonoCumplimiento + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].HorasAdicionales + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].BonoHoras + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].Total + "</td>"
//            + "<td class='text-right'>" + dsExportar[i].Productividad + "</td>"
//            + "</tr>";
//        $("#TblCompensacionesExportar tbody").append(rows);
//    }


//}