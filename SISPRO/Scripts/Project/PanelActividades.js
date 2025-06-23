
var TipoUsuarioPan;
var UsuarioPan;
var tablasEncabezado = {};
var tablasDetalle = {};
var dsEncabezado = [];
var tablaActividades;
var dsDetalle;
var listaDetalle = [];
var tablaini;

var dsActividadesV = [];
var tablaValidacion;

var dsActividadesL = [];
var tablaLiberacion;



var valida;
var libera;

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


var columnasEncabezado = [
    {
        "class": "text-center",
        "render": function (data, type, row) {
            if (valida) {
                return '<input type="checkbox" class="SeleccionarT">';
            }
            else {
                return '';
            }
        }
    },
    {
        "data": "IdActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }


    },
    {
        "data": "BR",
        "class": "text-left",
        "render": function (data, type, row) {

            //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            //return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px; margin-left:0px;" />' + data ;
        }
    },
    {
        "data": "PrioridadStr",
        "class": "text-center",
    },
    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'A') {

                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-info "></span> </button>';

            }
            else if (data == 'P') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-progress "></span> </button>';

            }
            else if (data == 'R' || data == 'V') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-warning "></span> </button>';

            }
            else if (data == 'X') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-danger "></span> </button>';

            }
            else if (data == 'L') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-success "></span> </button>';

            }
            else if (data == 'C') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-muted "></span> </button>';

            }
        }
    },


    {
        "data": "ClaveUsuario",
        "class": "text-left",
        "render": function (data, type, row) {
            if (data == "") {

                return "";
            }
            else {

                return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.AsignadoStr}" class="img-dt" style="width: 35px; height: 35px" />`
            }

        }
    },
    {
        "data": "Sprint",
        "class": "text-left",
    },

    {
        "data": "HorasFacturables",
        "class": "text-right sum",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {
        "data": "HorasFinales",
        "class": "text-right",
    },
    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },

    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {


            return '<div class="btn-group pull-right" >'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                '<span class="caret"></span>' +
                '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li><a href="#" onclick="CapturaTrabajo(' + row.IdActividad + "," + row.PSP + ",'" + row.ClasificacionStr + "'" + ' )"> <i class="fa fa-share pull-right"></i>Captura trabajo</a></li>' +
                '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
/*                '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +*/
                '<li class="divider"></li>' +
                '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                '</ul></div>';

        }
    },

    {
        "data": "MotivoRechazoId",
        "visible": false
    },
    {
        "data": "DescripcionRechazo",
        "visible": false
    }
];

var columnasEncabezadoV = [

    {
        "class": "text-center",
        "render": function (data, type, row) {
            if (valida) {
                return '<input type="checkbox" class="SeleccionarV">';
            }
            else {
                return '';
            }
        }
    },


    {
        "data": "IdActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }


    },
    {
        "data": "BR",
        "class": "text-left",
        "render": function (data, type, row) {

            //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            //return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px; margin-left:0px;" />' + data;
        }
    },
    {
        "data": "PrioridadStr",
        "class": "text-center",
    },
    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'A') {

                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-info "></span> </button>';

            }
            else if (data == 'P') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-progress "></span> </button>';

            }
            else if (data == 'R' || data == 'V') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-warning "></span> </button>';

            }
            else if (data == 'X') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-danger "></span> </button>';

            }
            else if (data == 'L') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-success "></span> </button>';

            }
            else if (data == 'C') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-muted "></span> </button>';

            }
        }
    },


    {
        "data": "ClaveUsuario",
        "class": "text-left",
        "render": function (data, type, row) {
            if (data == "") {

                return "";
            }
            else {

                return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.AsignadoStr}" class="img-dt" style="width: 35px; height: 35px" />`
            }

        }
    },


    {
        "data": "Sprint",
        "class": "text-left",
    },

    {
        "data": "HorasFacturables",
        "class": "text-right sum",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {
        "data": "HorasFinales",
        "class": "text-right",
    },
    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },

    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {


            return '<div class="btn-group pull-right" >'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                '<span class="caret"></span>' +
                '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li><a href="#" onclick="CapturaTrabajo(' + row.IdActividad + "," + row.PSP + ",'" + row.ClasificacionStr + "'" + ' )"> <i class="fa fa-share pull-right"></i>Captura trabajo</a></li>' +
                '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                /*                '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +*/
                '<li class="divider"></li>' +
                '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                '</ul></div>';

        }
    }
];


var columnasEncabezadoL = [

    {
        "class": "text-center",
        "render": function (data, type, row) {


            if (libera) {
                return '<input type="checkbox" class="SeleccionarL">';
            }
            else {
                return '';
            }
        }
    },

    {
        "data": "IdActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }


    },
    {
        "data": "BR",
        "class": "text-left",
        "render": function (data, type, row) {
            //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            //return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px; margin-left:0px;" />' + data;
        }
    },
    {
        "data": "PrioridadStr",
        "class": "text-center",
    },
    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'A') {

                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-info "></span> </button>';

            }
            else if (data == 'P') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-progress "></span> </button>';

            }
            else if (data == 'R' || data == 'V') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-warning "></span> </button>';

            }
            else if (data == 'X') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-danger "></span> </button>';

            }
            else if (data == 'L') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-success "></span> </button>';

            }
            else if (data == 'C') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-muted "></span> </button>';

            }
        }
    },


    {
        "data": "ClaveUsuario",
        "class": "text-left",
        "render": function (data, type, row) {
            if (data == "") {

                return "";
            }
            else {

                return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.AsignadoStr}" class="img-dt" style="width: 35px; height: 35px" />`
            }

        }

    },

    {
        "data": "Sprint",
        "class": "text-left",
    },

    {
        "data": "HorasFacturables",
        "class": "text-right sum",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {
        "data": "HorasFinales",
        "class": "text-right",
    },
    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },

    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {


            return '<div class="btn-group pull-right" >'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                '<span class="caret"></span>' +
                '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li><a href="#" onclick="CapturaTrabajo(' + row.IdActividad + "," + row.PSP + ",'" + row.ClasificacionStr + "'" + ' )"> <i class="fa fa-share pull-right"></i>Captura trabajo</a></li>' +
                '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                /*                '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +*/
                '<li class="divider"></li>' +
                '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                '</ul></div>';

        }
    },

];

function inicializaTablaAct(nombreTabla, datos) {
    tablasEncabezado[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": true,
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

            tablasDetalle[nombreTabla + row.data().IdActividad] = $("." + nombreTabla + row.data().IdActividad).dataTable({
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
                        "data": "BR",
                        "class": "text-left"
                    },
                    {
                        "data": "FechaHora",
                        "class": "text-center",
                        "render": function (data, type, row) {
                            return (data == null || data == "" ? "" : moment(data).format("YYYY/DD/MM"))
                        }
                    },
                    {
                        "data": "UsuarioStr",
                        "class": "text-left"
                    },
                    {
                        "data": "IdActividad",
                        "visible": false
                    },
                    {
                        "data": "IdActividadLog",
                        "visible": false
                    }
                ],
                "order": [[1, 'asc']],
                createdRow: function (row, data, dataIndex) {
                    $(row).find('td:eq(0)').attr('data-name', 'Descripcion');
                    $(row).find('td:eq(1)').attr('data-name', 'FechaHora');
                    $(row).find('td:eq(2)').attr('data-name', 'UsuarioStr');
                    $(row).find('td:eq(3)').attr('data-name', 'IdActividad');
                    $(row).find('td:eq(4)').attr('data-name', 'IdActividadLog');
                },

            });



            filaPadre.addClass('shown');
        }
    });


}

$(document).ready(function () {

    InicializaPanelActividades();
    CargaActividadesPanel();
    $("#BtnCancelacionM").hide();
    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });

    $('#Calendar').fullCalendar({
        locale: 'es',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        buttonIcons: true, // show the prev/next text

        navLinks: true, // can click day/week names to navigate views
        editable: false,
        eventLimit: true,
        views: {
            month: {
                eventLimit: 10
            }
        },
        eventClick: function (info) {
            clickalerta(info.id);
        }


    });
});

function InicializaPanelActividades() {


    $('#TxtFechaAIF,#TxtFechaAFF,#TxtFechaSIF,#TxtFechaSFF,#TxtFechaCIF,#TxtFechaCFF').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

    CargaCombosFiltros();

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



}

function CargaCombosFiltros() {

    var url = $('#urlCargaInicialCombosF').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                $('#SelProyectoF').empty();
                $('#SelProyectoF').append(data.LstProyectos);

                $('#SelProyectoF').selectpicker('refresh');

                $('#SelActividadF').empty();
                $('#SelActividadF').append(data.LstTipoAct);
                $('#SelActividadF').selectpicker('refresh');

                $('#SelUsuarioAsignadoF').empty();
                $('#SelUsuarioAsignadoF').append(data.LstUsuarios);

                $('#SelUsuarioAsignadoF').selectpicker('refresh');

                $('#SelResponsableF').empty();
                $('#SelResponsableF').append(data.LstLideres);

                $('#SelClasificacionF').empty();
                $('#SelClasificacionF').append(data.LstClasificacion);

                $('.selectpicker').selectpicker('refresh');

                TipoUsuarioPan = data.TipoUsuario;
                UsuarioPan = data.Usuario;

            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });
    return false;
}

$(document).on('click', '#BtnFiltrar', function (e) {

    CargaActividadesPanel();
    $(".filter-settings").toggleClass("active");
    return false;

});


function CargaActividadesPanel() {

    var url = $('#urlBuscarActividades').val();

    var incio, fin;
    if ($("#TxtRangoFechas").val() != "") {
        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
        fin = ($("#TxtRangoFechas").val()).split('-')[1];
    }

    var datosBuscar = {
        FechaSolIni: inicio,
        FechaSolFin: fin,
/*        TipoPeriodo: $('#SelPeriodoT').val(),*/
        LstAsignado: $('#SelUsuarioAsignadoF').val(),
        /*     LstSprints: $('#SelSprintT').val(),*/
     

        LstTipo: $('#SelProyectoF').val(),
        LstProyecto: $('#SelProyectoF').val(),
        LstSprints: $('#SelSprintF').val(),
        LstEstatus: $('#SelEstatusF').val(),
        LstTipoActividad: $('#SelActividadF').val(),
        LstTipo: $('#SelTipoF').val(),

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



                $(".response").fadeOut(600, function () {
                    $(".response").html(data)
                });
                $(".response").fadeIn(600);


                $("#LblAbierto").text("Abiertas (" + data.TotalAbiertas + ")");
                $("#LblProgreso").text("Progreso (" + data.TotalProgreso + ")");
                $("#LblValidacion").text("Validación (" + data.TotalValidacion + ")");
                $("#LblTerminadas").text("Terminadas (" + data.TotalLiberadas + ")");
                $("#LblRechazadas").text("Rechazadas (" + data.TotalRechazadas + ")");

                $("#tasks_assigned").empty();
                $("#tasks_progreess").empty();
                $("#task_validate").empty();
                $("#tasks_re").empty();
                $("#tasks_ok").empty();


             
                    $("#tasks_assigned").html(data.ActividadesA)
                    $("#tasks_progreess").html(data.ActividadesP)
                    $("#task_validate").append(data.ActividadesR);
                    $("#tasks_re").append(data.ActividadesX);
                    $("#tasks_ok").append(data.ActividadesLi);
            

                resizeTaskList();

                var primeravez = !(dsEncabezado.length > 0);

                var Actividades = eval('(' + data.Actividades + ')');
                var ActividadesLog = eval('(' + data.ActividadesLog + ')');
                var ActV = eval('(' + data.ActividadesV + ')');
                var ActL = eval('(' + data.ActividadesL + ')');

                dsEncabezado = Actividades;
                dsActividadesV = ActV;
                dsActividadesL = ActL;

                $("#Todo").text("Todo (" + data.Total + ")");
                $("#Autorizar").text("Pendiente autorizar (" + data.TotalV + ")");
                $("#Liberar").text("Pendiente liberar (" + data.TotalL + ")");

                valida = data.Valida;
                libera = data.Libera;

                if (!data.Valida) {
                    $("#BtnValidacionM").hide();
                    $("#ChkTodosV").hide();
                }


                if (!data.Libera) {
                    $("#BtnLiberacionM").hide();
                    $("#ChkTodosL").hide();
                }

                /*    ActualizaTablaExportar(data.Actividades);*/
                tablaActividades = inicializaTabla($('#TblActividades'), dsEncabezado, columnasEncabezado, 3, "asc", true, false, true);
                tablaValidacion = inicializaTabla($('#TblActividadesV'), dsActividadesV, columnasEncabezadoV, 1, "asc", true, false, true);
                tablaLiberacion = inicializaTabla($('#TblActividadesL'), dsActividadesL, columnasEncabezadoL, 1, "asc", true, false, true);

                var sum1 = 0;
                var sum2 = 0;
                var sum3 = 0;

                $.each(dsEncabezado, function (index, value) {
                    var est = parseFloat(value.HorasFacturables);
                    var asi = parseFloat(value.HorasAsignadas);
                    var rea = parseFloat(value.HorasFinales);
                    sum1 += est;
                    sum2 += asi;
                    sum3 += rea;

                }
                );

                $("#lblTotalEstimadas").text($.number(sum1, '2', '.', ','));
                $("#lblTotalAsignadas").text($.number(sum2, '2', '.', ','));
                $("#lblTotalReal").text($.number(sum3, '2', '.', ','));
                 sum1 = 0;
                 sum2 = 0;
                sum3 = 0;

                $.each(dsActividadesV, function (index, value) {
                    var est = parseFloat(value.HorasFacturables);
                    var asi = parseFloat(value.HorasAsignadas);
                    var rea = parseFloat(value.HorasFinales);
                    sum1 += est;
                    sum2 += asi;
                    sum3 += rea;

                }
                );

                $("#lblTotalEstimadasV").text($.number(sum1, '2', '.', ','));
                $("#lblTotalAsignadasV").text($.number(sum2, '2', '.', ','));
                $("#lblTotalRealV").text($.number(sum3, '2', '.', ','));

                sum1 = 0;
                sum2 = 0;
                sum3 = 0;

                $.each(dsActividadesL, function (index, value) {
                    var est = parseFloat(value.HorasFacturables);
                    var asi = parseFloat(value.HorasAsignadas);
                    var rea = parseFloat(value.HorasFinales);
                    sum1 += est;
                    sum2 += asi;
                    sum3 += rea;

                }
                );

                $("#lblTotalEstimadasL").text($.number(sum1, '2', '.', ','));
                $("#lblTotalAsignadasL").text($.number(sum2, '2', '.', ','));
                $("#lblTotalRealL").text($.number(sum3, '2', '.', ','));

                tablasEncabezado["TblActividadesV"] = tablaValidacion;
                tablasEncabezado["TblActividadesL"] = tablaLiberacion;

                var events = JSON.parse(data.Eventos);

                $('#Calendar').fullCalendar('removeEvents');
                $('#Calendar').fullCalendar('addEventSource', events);
                $('#Calendar').fullCalendar('rerenderEvents');



                $('div.pg-loading-screen').remove();



                page_content_onresize();

                $('#LblTotal').text('Total horas: 0');
                $('#LblTotalV').text('Total horas: 0');


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

    return false;
}

var tm = false;
$('#BtnExportarActividaes').click(e => {
    e.preventDefault();

    let formData = new FormData();

    var incio, fin;
    if ($("#TxtRangoFechas").val() != "") {
        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
        fin = ($("#TxtRangoFechas").val()).split('-')[1];
    }



    formData.append("FechaSolIni", inicio);
    formData.append("FechaSolFin", fin);
    formData.append("LstTipo", $('#SelTipoF').val());
    formData.append("LstProyecto", $('#SelProyectoF').val());
    formData.append("LstEstatus", $('#SelEstatusF').val());
    formData.append("LstTipoActividad", $('#SelActividadF').val());
    formData.append("LstAsignado", $('#SelUsuarioAsignadoF').val());


    DOWNLOAD('/Actividades/DescargarExcelActividades', 'Actividades.xlsx', formData, true);
});





function format(d, nombreTabla) {
    var htmlDetalle = '';


    dsDetalle = $.grep(listaDetalle, function (a, b) {
        return a.IdActividad === d.IdActividad;
    });

    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdActividad);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdActividad);

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

function refrescaTablaAct() {
    tablasEncabezado['TblActividades'].api().clear().rows.add(dsEncabezado).draw();
}

$("#BtnNuevaActividad").click(function () {

    $('#ModalActividades').modal({ keyboard: false });
    $('#TituloActividades').text("Captura de actividad");
    InicializaAltaActividades();

    return false;

});
$("#BtnImportarAct").click(function () {

    $("#FlImportaActividades").parent().next().text("");
    $("#FlImportaActividades").val("");
    $('#BtnImportarActividad').addClass('hidden');
    $('#ModalImportarActividades').modal({ keyboard: false });

    return false;

});

function ActualizaTablaExportar(data) {

    var dsExportar = jQuery.parseJSON(data);


    $('#TblActividadesExportar tbody').html('');

    for (var i in dsExportar) {


        rows = "<tr>"
            + "<td class='text-center'>" + dsExportar[i].IdActividad + "</td>"
            + "<td class='text-center'>" + dsExportar[i].TipoNombre + "</td>"
            + "<td class='text-center'>" + dsExportar[i].EstatusStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].PrioridadStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].Descripcion + "</td>"
            + "<td class='text-center'>" + dsExportar[i].ProyectoStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].TipoActividadStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].ClasificacionStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].AsignadoStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].ResponsableStr + "</td>"
            + "<td class='text-right'>" + dsExportar[i].HorasAsignadas + "</td>"
            + "<td class='text-center'>" + moment(dsExportar[i].FechaSolicitado).format("DD/MM/YYYY") + "</td>"
            + "<td class='text-right'>" + dsExportar[i].HorasFinales + "</td>"
            + "<td class='text-center'>" + (dsExportar[i].FechaTermino == null ? '' : moment(dsExportar[i].FechaTermino).format("DD/MM/YYYY")) + "</td>"
            + "</tr>";
        $("#TblActividadesExportar tbody").append(rows);
    }


}

$(document).on('click', '.BtnVerActividad', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablasEncabezado['TblActividades'].api().row(filaPadre);
    var datosFila = row.data();
    var Actividad = datosFila.IdActividad;

    $('#TituloActividades').text("Actividad #" + Actividad);
    $('#IdActividad').val(Actividad);
    $("#ActPSP").val(Actividad.PSP)
    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividadesPanel();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalActividades').modal({ keyboard: false });
    InicializaEdicionActividad();


    return false;

});

$(document).on('click', '.BtnVerActividadV', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablasEncabezado['TblActividadesV'].api().row(filaPadre);
    var datosFila = row.data();
    var Actividad = datosFila.IdActividad;

    $('#TituloActividades').text("Actividad #" + Actividad);
    $('#IdActividad').val(Actividad);
    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividadesPanel();
    });

    $('#ModalActividades').modal({ keyboard: false });
    InicializaEdicionActividad();

    return false;

});

$(document).on('click', '.BtnVerActividadL', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablasEncabezado['TblActividadesL'].api().row(filaPadre);
    var datosFila = row.data();
    var Actividad = datosFila.IdActividad;

    $('#TituloActividades').text("Actividad #" + Actividad);
    $('#IdActividad').val(Actividad);
    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividadesPanel();
    });

    $('#ModalActividades').modal({ keyboard: false });
    InicializaEdicionActividad();

    return false;

});


$(document).on("change", "#FlImportaActividades", function (e) {
    $("#FlImportaActividades").parent().next().next().text("");



    if (e.target.files != undefined) {

        var reader = new FileReader();

        reader.onload = function (f) {

            $('#BtnImportarActividad').removeClass('hidden');
        };
        reader.readAsDataURL(e.target.files.item(0));
    }

});

$(document).on('click', '#BtnImportarActividad', function (e) {


    ImportaArchivo();

    return false;
});

function ImportaArchivo() {
    var url = $('#urlImportaActividades').val();

    var form_data = new FormData();
    form_data.append("Archivo", $("#FlImportaActividades").prop("files")[0]);
    form_data.append("Tipo", $('input:radio[name=TipoCarga]:checked').val());


    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        //dataType: "script",
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {

            var Resultado = Respuesta.split('|');


            $('div.pg-loading-screen').remove();
            if (Resultado[0] == "E") {

                CargaActividadesPanel();
                MensajeExito(Resultado[1]);
            }
            else {
                CargaActividadesPanel();
                MensajeAdvertencia(Resultado[1]);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });
}


$(document).on('click', '#ChkTodosV', function () {

    var rows = tablaValidacion.api().rows().nodes();
    var datos = tablaValidacion.api().rows().data();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    indexes = $.map(dsActividadesV, function (obj, index) {
        if (obj.IdActividad == datos[index].IdActividad) {
            return index;
        }
    })

    var check = $(this).prop('checked');
    $.each(indexes, function (key, value) {
        dsActividadesV[indexes[key]].Seleccionado = check;
    });

    /* dsActividadesV[indexes[0]].Seleccionado = $(this).prop('checked');*/


});

$(document).on('click', '#ChkTodosL', function () {

    var rows = tablaLiberacion.api().rows().nodes();
    var datos = tablaLiberacion.api().rows().data();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    indexes = $.map(dsActividadesL, function (obj, index) {
        if (obj.IdActividad == datos[index].IdActividad) {
            return index;
        }
    })
        ;
    var check = $(this).prop('checked');
    $.each(indexes, function (key, value) {
        dsActividadesL[indexes[key]].Seleccionado = check;
    });
    /* dsActividadesL[indexes[0]].Seleccionado = $(this).prop('checked');*/


});

$(document).on('change', '.SeleccionarV', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaValidacion.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsActividadesV, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsActividadesV[indexes[0]].Seleccionado = $(this).prop('checked');

    return false;

});

$(document).on('change', '.SeleccionarL', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaLiberacion.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsActividadesL, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsActividadesL[indexes[0]].Seleccionado = $(this).prop('checked');

    return false;

});


$(document).on('click', '#ChkTodosT', function () {

    var rows = tablaActividades.api().rows().nodes();
    var datos = tablaActividades.api().rows().data();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    indexes = $.map(dsEncabezado, function (obj, index) {
        if (obj.IdActividad == datos[index].IdActividad) {
            return index;
        }
    })
        ;
    var check = $(this).prop('checked');
    $.each(indexes, function (key, value) {
        dsEncabezado[indexes[key]].Seleccionado = check;
    });

    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });


    if (validar == '') {
        $("#BtnCancelacionM").hide();
    }
    else {

        $("#BtnCancelacionM").show();
    }

});
$(document).on('change', '.SeleccionarT', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaActividades.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsEncabezado, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsEncabezado[indexes[0]].Seleccionado = $(this).prop('checked');



    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });


    if (validar == '') {
        $("#BtnCancelacionM").hide();
    }
    else {

        $("#BtnCancelacionM").show();
    }



    return false;

});

$(document).on('click', '#BtnValidacionM', function (e) {


    var validar = '';

    $.map(dsActividadesV, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ninguna actividad.');
        return false;
    }

    var url = $('#urlValidacionMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                CargaActividadesPanel();
                MensajeExito(data.Mensaje);

            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;

});

$(document).on('click', '#BtnLiberacionM', function (e) {


    var validar = '';

    $.map(dsActividadesL, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ninguna actividad.');
        return false;
    }

    var url = $('#urlLiberacionMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                CargaActividadesPanel();
                MensajeExito(data.Mensaje);


            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;

});

$(document).on('click', '#BtnCancelacionM', function (e) {


    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ninguna actividad.');
        return false;
    }

    MensajeConfirmarAccion("¿Desea cancelar las actividades?", "BtnConfirmaCancelacionM");

    //var url = $('#urlCancelacionMasiva').val();

    //$.ajax({
    //    url: url,
    //    data: JSON.stringify({ Actividades: validar }),
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    async: false,
    //    success: function (data) {

    //        if (data.Exito) {

    //            MensajeExito(data.Mensaje);
    //            CargaActividades();
          


    //        }
    //        else {

    //            MensajeAdvertencia(data.Mensaje);
    //        }

    //    },
    //    error: function (xmlHttpRequest, textStatus, errorThrown) {

    //        MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
    //    }
    //});


    return false;

});

$(document).on('click', '#BtnConfirmaCancelacionM', function (e) {


    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    //if (validar == '') {
    //    MensajeAdvertencia('No ha seleccionado ninguna actividad.');
    //    return false;
    //}

    var url = $('#urlCancelacionMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                MensajeExito(data.Mensaje);
                CargaActividadesPanel();



            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;

});



//function CapturaTrabajo(IdActividad, PSP, Descripcion) {
//    if (PSP === 1) {
//        var url = $('#urlTracking').val() + "?Id=" + IdActividad;
//        window.open(url, '_blank');

//    } else {

//        $("#IdActividadCTra").val(IdActividad);
//        $("#LblActividadDesc").text(IdActividad + "-" + Descripcion);
//        var date = new Date();
//        $('#TxtFechaTrab').datetimepicker(
//            {
//                format: 'DD/MM/YYYY',
//                maxDate: date
//            });
//        $("#TxtTiempo").val("");
//        $("#TxtComentarioTrabajo").val("");
//        CargarTrabajos();

//        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });
//        var tm = false;
//        $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {

//            var a = tm;
//            if (tm) { tm = false; return; }
//            else { tm = true; CargaActividadesPanel();}

           
//        });


//    }
//}



$("#tasks_assigned,#tasks_progreess, #task_validate,#tasks_re, #tasks_ok").sortable({
    items: "> .task-item",
    connectWith: "#tasks_assigned, #tasks_progreess, #task_validate,#tasks_re,#tasks_ok",
    handle: ".task-text",
    receive: function (event, ui) {
        if (this.id == "task_validate") {
            //  alert("Se paso a validación");
            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-info");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-validate");

            AbrirModalCapturaTiempo(item);
            //ActualizaEstatus(item, 'V');
            //ui.item.addClass("task-complete");
            //.find(".task-footer > .pull-right").remove();
        }
        if (this.id == "tasks_progreess") {
            //alert("Se paso a progreso");
            var item = $(ui).attr('item')[0].id;
            //var item2 = ui.id;
            ui.item.removeClass("task-info");
            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.addClass("task-progreess");
            ActualizaEstatus(item, 'P');

            //ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
        }
        if (this.id == "tasks_assigned") {
            //alert("Se paso a pendiente");
            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-info");
            ActualizaEstatus(item, 'A');

      
        }

        if (this.id == "tasks_re") {

            var item = $(ui).attr('item')[0].id
            AbrirModalRechazoActividad(item);


 
        }

        if (this.id == "tasks_ok") {


            var item = $(ui).attr('item')[0].id
            Actividad = {
                IdActividad: item,
                IdAutorizacion: 0,
                IdActividadVal: 0,
                Valida: true
            };

            ValidaRechazaActividadKanban(Actividad);
            CargaActividadesPanel();
           /*  alert("Se paso a liberado");*/

            //var item = $(ui).attr('item')[0].id
            //AbrirModalRechazoActividad(item);


      
        }
        page_content_onresize();
    }
}).disableSelection();



function AbrirModalCapturaTiempo(IdActividad) {

    $("#IdActividadCT").val(IdActividad);
    $('#TituloRec').text("Capturar fecha fin de actividad #" + IdActividad);
    var date = new Date();
    $('#TxtFinActividad').datetimepicker(
        {
            format: 'DD/MM/YYYY',
            maxDate: date
        });

    $('#ModalCapturarTiempo').on('hidden.bs.modal', function () {

        CargaActividadesPanel();
        $(this).off('hidden.bs.modal');
    
    });

    $('#ModalCapturarTiempo').modal({ keyboard: false });

    return false;

}

function ActualizaEstatus(IdActividad, Estatus) {

    var url = $('#urlActualizaEstatus').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdActividad: IdActividad, Estatus: Estatus }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (!data.Exito) {

                MensajeAdvertencia(data.Mensaje);

            }
            else {
                CargaActividadesPanel();
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

function AbrirModalRechazoActividad(IdActividad) {

    InicializaModalRechazar();
    $('#ActividadR').val(IdActividad);



    $('#TituloRec').text("Rechazar actividad #" + IdActividad);


    $('#ModalRechazarActividad').on('hidden.bs.modal', function () {
        CargaActividadesPanel();
    });

    $('#ModalRechazarActividad').modal({ keyboard: false });


    return false;

}


$(document).on('change', '#SelProyectoF', function (e) {

    CargarFiltroSprints();
    return false;

});


async function CargarFiltroSprints() {


    const data = await POST('/Querys/CargaFiltroSprint', { LstProyectos: $('#SelProyectoF').val() });

    if (data.Exito) {

        $('#SelSprintF').empty();
        $('#SelSprintF').append(data.LstSprints);
        $('#SelSprintF').selectpicker('refresh');

    }
    else {

        MensajeError(data.Mensaje);
    }

}