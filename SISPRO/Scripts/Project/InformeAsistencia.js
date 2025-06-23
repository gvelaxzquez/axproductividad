
var dsAsistencia = [];
var dsAsistenciaMes = [];
var dsIncidencias = [];
var dsRetrasos = [];
var tablasDetalle = {};
var tablasEncabezado = {};
var dsActividades = [];
var dsRetrasos = [];
var tablaAsistencia;
var tablaAsistenciaMesResumen;
var tablaAsistenciaMes;
var tablaAsistenciaMesHoras;
var tablaIncidencias;
var tablaRetrasos;
var dsDetalle;

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

var moment = moment();
moment.locale('es');

/*moment.locale('es');*/

var columnasAsistencia = [
    {
        "class": "text-center",
        "data": "Clave",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Clave + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },
    {
        "data": "Recurso",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer;" onclick="ConsultaPerfil(' + row.IdUsuario + ')"> <h4 style="margin-top:5px;"> ' + data + '</h4></a>'


        }
    },
    {
        "data": "Fecha",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))

        }
    },


    {

        "class": "text-center",
        "data": "HoraEntrada",
        "render": function (data, type, row) {


            if (data == null) {

                return "";
            }
            else {
                if (row.Retraso == 1) {

                    return '<button class="btn btn-danger btn-small "   style="width:50%;text-align:center;">' + moment(data).format("hh:mm:ss") + '</button>';

                }
                else {

                    return '<button class="btn btn-success btn-small "   style="width:50%;text-align:center;">' + moment(data).format("hh:mm:ss") + '</button>';

                }


            }



        }
    },
    {
        "data": "HoraSalidaComer",
        "class": "text-center",
        "render": function (data, type, row) {

            if (data == null) {

                return "";
            }
            else {

                return '<button class="btn btn-info btn-small "  style="width:50%;text-align:center;">' + moment(data).format("hh:mm:ss") + '</button>';
            }

        }
    },
    {
        "data": "HoraEntradaComer",
        "class": "text-center",
        "render": function (data, type, row) {
            if (data == null) {

                return "";
            }
            else {

                if (row.TiempoComida > row.ToleranciaComida) {

                    return '<button class="btn btn-danger btn-small "  style="width:50%;text-align:center;">' + moment(data).format("hh:mm:ss") + '</button>';
                }
                else {
                    return '<button class="btn btn-success btn-small "  style="width:50%;text-align:center;">' + moment(data).format("hh:mm:ss") + '</button>';

                }

            }
        }
    },
    {
        "data": "HoraSalida",
        "class": "text-center",
        "render": function (data, type, row) {
            if (data == null) {

                return "";
            }
            else {

                return '<button class="btn btn-info btn-small "  style="width:50%;text-align:center;">' + moment(data).format("hh:mm:ss") + '</button>';
            }
        }
    },
    {
        "data": "TiempoRetraso",
        "class": "text-center",
     
        "render": function (data, type, row) {
            if (data <= 0) {

                return "";
            }
            else {

                return '<button class="btn btn-danger btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ',');+ '</button>';
            }
        }
        //"render": function (data, type, row) {
        //    $.number(data, '2', '.', ',');
        //}
    },

    {
        "data": "TiempoComida",
        "class": "text-center",
        "render": function (data, type, row) {

            if (row.HoraEntradaComer != null) {

                if (row.TiempoComida > row.ToleranciaComida) {

                    return '<button class="btn btn-danger btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
                }
                else {

                    return '<button class="btn btn-success btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
                }

            }
            else {

                return "";
            }

        }
    },


    {
        "data": "TiempoTrabajo",
        "class": "text-center",

        
        "render": function (data, type, row) {
            if (data < row.Jornada) {

                return '<button class="btn btn-danger btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
            }
            else {

                return '<button class="btn btn-success btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
            }
        }
    },


    {
        "data": "IncidenciasStr",
        "class": "text-left",
   
    }


];
var columnasAsistenciaMesResumen = [

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-default btn-grid details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
        }
    },
    {
        "class": "text-center",
        "data": "Clave",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Clave + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },
    {
        "data": "Recurso",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer;" onclick="ConsultaPerfil(' + row.IdUsuario + ')"> <h4 style="margin-top:5px;"> ' + data + '</h4></a>'


        }
    },

    {
        "data": "TiempoTrabajo",
        "class": "text-center",


        "render": function (data, type, row) {

            return $.number(data, '2', '.', ',');

            //if (data < row.Jornada) {

            //    return '<button class="btn btn-danger btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
            //}
            //else {

            //    return '<button class="btn btn-success btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
            //}
        }
    },


    {
        "data": "Retraso",
        "class": "text-center",

        "render": function (data, type, row) {

            return $.number(data, '2', '.', ',');
            //if (data <= 0) {

            //    return "";
            //}
            //else {

            //    return '<button class="btn btn-danger btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
            //}
        }
        //"render": function (data, type, row) {
        //    $.number(data, '2', '.', ',');
        //}
    },
    {
        "data": "HorasRetraso",
        "class": "text-center",

        "render": function (data, type, row) {

          return   $.number(data, '2', '.', ',');
            //if (data <= 0) {

            //    return "";
            //}
            //else {

            //    return '<button class="btn btn-danger btn-small "  style="width:50%;text-align:center;">' + $.number(data, '2', '.', ','); + '</button>';
            //}
        }
        //"render": function (data, type, row) {
        //    $.number(data, '2', '.', ',');
        //}
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-primary' title='Imprimir' onclick='ImprmirReporteAsistencia(" + row.IdUsuario +  ")' ><i class='fa fa-file-pdf-o'></i></button>"
        }
    },




];

var columnasIncidencia = [
    {
        "class": "text-center",
        "data": "Clave",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Clave + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },
    {
        "data": "UsuarioStr",
        "class": "text-left"
    },
    {
        "data": "TipoIncidenciaStr",
        "class": "text-left"
    },


    {
        "data": "FechaInicio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "FechaFin",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "DiasConsiderar",
        "class": "text-center"
    },

    {
        "data": "Comentarios",
        "class": "text-left"
    }

];

var columnasRetardos = [
    {
        "class": "text-center",
        "data": "Clave",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Clave + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },
    {
        "data": "Recurso",
        "class": "text-left"
    },

    {
        "data": "TiempoRetraso",
        "class": "text-center",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
        }
    }

];

var htmlTablaDetalle = "<h3> <span class='label label-info'></span></h3>" +
    "<div class='row table-responsive'>" +
    "<table id='@tabla@Detalle' class='table table-striped table-detail tablaDetalle'>" +
    "<thead>" +
    "<tr>" +
    "<th>Fecha</th>" +
    "<th>Hora de Entrada</th>" +
    "<th>Comida - Salida</th>" +
    "<th>Comida - Regreso</th>" +
    "<th>Hora de Salida</th>" +
    "<th>T. Comida</th>" +
    "<th>T. Trabajo</th>" +
    "</tr>" +
    "</thead>" +
    "</table>" +
    "</div>";


function inicializaTablaResumenMes(nombreTabla, datos) {
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
        columns: columnasAsistenciaMesResumen,
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
                    "data": "Fecha",
                        "class": "text-left",
                        "render": function (data, type, row) {
                            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))

                        }
                    //"render": function (data, type, row) {
                    //    return (data == null || data == "" ? "" : moment(data).locale('es').format("dddd") + ", " + moment(data).locale('es').format("LL")  )
                    //    }
                    },
                    {
                        "data": "HoraEntrada",
                        "class": "text-left",
                        "render": function (data, type, row) {
                            return (data == null || data == "" ? "" : moment(data).format("hh:mm"))
                        }
                    },
                    {
                        "data": "HoraSalidaComer",
                        "class": "text-left",
                        "render": function (data, type, row) {
                            return (data == null || data == "" ? "" : moment(data).format("hh:mm"))
                        }
                    },
                    {
                        "data": "HoraEntradaComer",
                        "class": "text-left",
                        "render": function (data, type, row) {
                            return (data == null || data == "" ? "" : moment(data).format("hh:mm"))
                        }
                    },
                    {
                        "data": "HoraSalida",
                        "class": "text-left",
                        "render": function (data, type, row) {
                            return (data == null || data == "" ? "" : moment(data).format("hh:mm"))
                        }
                    },
                    {
                        "data": "TiempoComidaStr",
                        "class": "text-left"
                    },
                    {
                        "data": "TiempoTrabajoStr",
                        "class": "text-left"
                    }
                ],
                "order": [[1, 'asc']],
                createdRow: function (row, data, dataIndex) {
                    $(row).find('td:eq(0)').attr('data-name', 'Fecha');
                    $(row).find('td:eq(1)').attr('data-name', 'HoraEntrada');
                    $(row).find('td:eq(2)').attr('data-name', 'HoraSalidaComer');
                    $(row).find('td:eq(3)').attr('data-name', 'HoraEntradaComer');
                    $(row).find('td:eq(4)').attr('data-name', 'HoraSalida');
                    $(row).find('td:eq(5)').attr('data-name', 'TiempoComidaStr');
                    $(row).find('td:eq(6)').attr('data-name', 'TiempoTrabajoStr');
                },

            });



            filaPadre.addClass('shown');
        }
    });


}

function format(d, nombreTabla) {
    var htmlDetalle = '';


    dsDetalle = $.grep(dsActividades, function (a, b) {
        return a.IdUsuario === d.IdUsuario;
    });

    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdUsuario);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdUsuario);

    //auxOc = d.Oc;
    return htmlDetalle;

}

$(document).ready(function () {
     InicializarInformeAsistencia();

});

function InicializarInformeAsistencia() {

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


    $("#divAcumulado ").show();
    $("#divMes").hide();
    $("#divMesHoras").hide();

    $('#TxtRangoFechasRDA').val(moment().format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY'));


    var url = $('#urlInicializar').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {


                $('#SelRecursosRDA').empty();
                $('#SelRecursosRDA').append(data.LstUsuarios);
                $('#SelRecursosRDA').selectpicker('refresh');
                $('#SelRecursosRMA').empty();
                $('#SelRecursosRMA').append(data.LstUsuarios);
                $('#SelRecursosRMA').selectpicker('refresh');

                $('#SelAnioRMA').val(data.Anio);
                $('#SelMesRMA').val(data.Mes);
                $('#SelAnioRMA').selectpicker('refresh');
                $('#SelMesRMA').selectpicker('refresh');

            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });


    return false;



}


$(document).on('click', '#BtnFiltrarRDA', function (e) {

    CargaInformeAsistenciaDiaria();

    return false;

});

function CargaInformeAsistenciaDiaria() {


    var url = $('#urlObtenerReporteAsistenciaDiario').val();

    var incio, fin;
    if ($("#TxtRangoFechasRDA").val() != "") {
        inicio = ($("#TxtRangoFechasRDA").val()).split('-')[0];
        fin = ($("#TxtRangoFechasRDA").val()).split('-')[1];
    }

    var Filtros = {
        FechaInicio: inicio,
        FechaFin: fin,
        IdUsuario: $('#SelRecursosRDA').val()

    }

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(Filtros),
        async: false,
        success: function (data) {
            if (data.Exito) {

                var dsDatos = jQuery.parseJSON(data.Reporte);
           


                $('#wRetardos').text(dsDatos.Retrasos);
                $('#wIncidencias').text(dsDatos.Incidencias);



                dsAsistencia = dsDatos.LstAsistencia;
                tablaAsistencia = inicializaTablaExport($('#TblAsistenciaDiaria'), dsAsistencia, columnasAsistencia, 0, "asc", true, true, true);




            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}


function VerRetardos() {


    $('#ModalUsuarioRetardos').modal({ backdrop: 'static', keyboard: false });

    dsRetardos = $.grep(dsAsistencia, function (element, index) {
        return element.Retraso == 1;
    });


    tablaRetardos = inicializaTabla($('#TblLstRetardos'), dsRetardos, columnasRetardos, 0, "asc", true, true, true);

    return false;
};

function VerIncidenciasRDA() {
    var url = $('#urlConsultaListaIncidenciasRango').val();

    $('#ModalUsuarioIncidencias').modal({ backdrop: 'static', keyboard: false });

    var incio, fin;
    if ($("#TxtRangoFechasRDA").val() != "") {
        inicio = ($("#TxtRangoFechasRDA").val()).split('-')[0];
        fin = ($("#TxtRangoFechasRDA").val()).split('-')[1];
    }

    var Filtros = {
        FechaInicio: inicio,
        FechaFin: fin,
        IdUsuario: $('#SelRecursosRDA').val()

    }

    ConsultaIncidencias(url,Filtros);
    return false;
};


function VerIncidenciasRMA() {


    var url = $('#urlConsultaListaIncidenciasMes').val();


    var Filtros = {
        IdMes: $('#SelMesRMA').val(),
        IdAnio: $('#SelAnioRMA').val(),
        IdUsuario: $('#SelRecursosRMA').val()

    }

    $('#ModalUsuarioIncidencias').modal({ backdrop: 'static', keyboard: false });

    ConsultaIncidencias(url, Filtros);
    return false;
};

function ConsultaIncidencias(url, Filtros) {
 

    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify(Filtros),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {

                dsIncidencias = jQuery.parseJSON(data.LstIncidencias);



                dsIncidencias = inicializaTabla($('#TblLstIncidencias'), dsIncidencias, columnasIncidencia, 0, "asc", true, true, true);




            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });


}


$(document).on('click', '#BtnVerMes', function (e) {

    $("#BtnVerMes").removeClass("btn-default");
    $("#BtnVerMes").addClass("btn-info");

    $("#BtnVerAcumulado").removeClass("btn-info");
    $("#BtnVerAcumulado").addClass("btn-default");

    $("#BtnVerMesHoras").removeClass("btn-info");
    $("#BtnVerMesHoras").addClass("btn-default");


    $("#divMes").show();
    $("#divMesHoras").hide();
    $("#divAcumulado ").hide();

    page_content_onresize();
    return false;
});
$(document).on('click', '#BtnVerAcumulado', function (e) {

    $("#BtnVerAcumulado").removeClass("btn-default");
    $("#BtnVerAcumulado").addClass("btn-info");

    $("#BtnVerMes").removeClass("btn-info");
    $("#BtnVerMes").addClass("btn-default");

    $("#BtnVerMesHoras").removeClass("btn-info");
    $("#BtnVerMesHoras").addClass("btn-default");


    $("#divAcumulado ").show();
    $("#divMesHoras").hide();
    $("#divMes").hide();

    page_content_onresize();

    return false;
});

$(document).on('click', '#BtnVerMesHoras', function (e) {

    $("#BtnVerMesHoras").removeClass("btn-default");
    $("#BtnVerMesHoras").addClass("btn-info");

    $("#BtnVerMes").removeClass("btn-info");
    $("#BtnVerMes").addClass("btn-default");

    $("#BtnVerAcumulado").removeClass("btn-info");
    $("#BtnVerAcumulado").addClass("btn-default");


    $("#divMesHoras ").show();
    $("#divAcumulado").hide();
    $("#divMes").hide();

    page_content_onresize();

    return false;
});


$(document).on('click', '#BtnFiltrarRMA', function (e) {

    CargaInformeAsistenciaMensual();

    return false;

});


function ImprmirReporteAsistencia(IdUsuario) {



    var url = $('#urlObtenerInformeAsisenciaPDF').val() + "?Id=" + $("#SelAnioRMA").val() + "&Id2=" + $("#SelMesRMA").val() + "&Id3=" + IdUsuario;
    window.open(url, '_blank');




    return false;

}

function CargaInformeAsistenciaMensual() {


    var url = $('#urlObtenerReporteAsistenciaMensual').val();



    var Filtros = {
        IdMes: $('#SelMesRMA').val(),
        IdAnio: $('#SelAnioRMA').val(),
        IdUsuario: $('#SelRecursosRMA').val()

    }

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(Filtros),
        async: false,
        success: function (data) {
            if (data.Exito) {

                var dsDatos = jQuery.parseJSON(data.Reporte);



                $('#wMRetardos').text(dsDatos.Retrasos);
                $('#wMIncidencias').text(dsDatos.Incidencias);



                dsAsistenciaMes = dsDatos.LstAsistencia;
                /*      tablaAsistenciaMesResumen = inicializaTablaExport($('#TblAsistenciaMesResumen'), dsAsistenciaMes, columnasAsistenciaMesResumen, 0, "asc", true, true, true);*/

                inicializaTablaResumenMes('TblAsistenciaMesResumen', dsAsistenciaMes);
                dsActividades = dsDatos.LstAsistenciaDetalle;


                var columnasAsisteciaMesHoras = [

                    {
                        "class": "text-center",

                        "data": "NumEmpleado",
                        "render": function (data, type, row) {
                            return '<img class="img-dt" title="' + row.NumEmpleado + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


                        }
                    },
                    {
                        "data": "Recurso",
                        "title": "Recurso",
                        "class": "text-left",
                        "render": function (data, type, row) {
                            return '<a style="cursor:pointer;" > <h5 style="margin-top:5px;"> ' + data + '</h4></a>'


                        }
                    },


                ];

                var columnasAsisteciaMes = [

                    {
                        "class": "text-center",

                        "data": "NumEmpleado",
                        "render": function (data, type, row) {
                            return '<img class="img-dt" title="' + row.NumEmpleado + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


                        }
                    },
                    {
                        "data": "Recurso",
                        "title": "Recurso",
                        "class": "text-left",
                        "render": function (data, type, row) {
                            return '<a style="cursor:pointer;" > <h5 style="margin-top:5px;"> ' + data + '</h4></a>'


                        }
                    },


                ];




                var dtAsistenciaMesHoras = dsDatos.dtAsistenciaMesHoras;

                var dtAsistenciaMes = dsDatos.dtAsistenciaMes;



                $.each(dtAsistenciaMesHoras[0], function (key, value) {
                    var my_item = {};
                   

                    if (key != "NumEmpleado" && key != "Recurso" && key != "IdUsuario") {
                        my_item.title = key;
                        my_item.data = key;
                        my_item.class = "text-center";

                    

                        my_item.render = function (data, type, row) {

                            if (data == 0) {
                                return '<a  class="btn btn-small Rejected" style="text-align:center;"  href="#" >' + $.number(data, '2', '.', ',') + ' </a>';
                            }
                            if (data == -1) {
                                return '';
                            }
                            if (data == -2) {
                                return '';
                            }
                            else {
                                return '<a class="btn btn-small Done" style="text-align:center;"  >' + $.number(data, '2', '.', ',') + ' </a>';
                            }

                        }




                   
                        columnasAsisteciaMesHoras.push(my_item);
                    }


                });


                $.each(dtAsistenciaMes[0], function (key, value) {
                    var my_item = {};
         
                    if (key != "NumEmpleado" && key != "Recurso" && key != "IdUsuario") {
                        my_item.title = key;
                        my_item.data = key;
                        my_item.class = "text-center";

                     

                        my_item.render = function (data, type, row) {

                            if (data == 0) {
                                return '<button class="btn btn-small Rejected glyphicon glyphicon-remove "></button>';
                            }
                            if (data == -1) {
                                return '';
                            }
                            if (data == -2) {
                                return '';
                            }
                            else {
                                return '<button class="btn btn-small Done glyphicon glyphicon-ok "></button>';
                            }

                        }





                        columnasAsisteciaMes.push(my_item);
                    }


                });


                $('#TblAsistenciaMesHoras').empty();
                $('#TblAsistenciaMes').empty();

                tablaAsistenciaMesHoras = inicializaTabla($('#TblAsistenciaMesHoras'), dtAsistenciaMesHoras, columnasAsisteciaMesHoras, 1, "asc", true, true, true);
                tablaAsistenciaMes = inicializaTabla($('#TblAsistenciaMes'), dtAsistenciaMes, columnasAsisteciaMes, 1, "asc", true, true, true);


            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });



    
}