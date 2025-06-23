var dsBacklogBuscar = [];

var tablaBacklogBuscar;
var columnasBacklogbuscar = [
    {
        "class": "text-center",
        "render": function (data, type, row) {

            return '<input type="checkbox" class="SeleccionarBWI">';

        }
    },
    {
        "data": "Prioridad",
        "class": "text-right",


    },

    {
        "data": "IdActividadStr",
        "class": "text-left",


    },
    {
        "data": "BR",
        "class": "text-left",
        "render": function (data, type, row) {

            //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }
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
    }

];



$(document).on('click', '#BtnFiltrarBWI', function (e) {


    BuscarWorkItems();
    return false;
});

function BuscarWorkItems() {



    var Filtros = {
        IdProyecto: $("#IdProyectoBWI").val(),
        IdIteracion: $("#IdIteracionBWI").val(),
        Tipo: $("#SelTipoBWI").val(),
        IdFase: $("#SelFaseBWI").val(),
        EstatusF: $("#SelEstatusBWI").val(),
        PrioridadF: $("#SelPrioridadBWI").val(),
        IdIteracionB: $("#SelSprintBWI").val(),
        IdUsuario: $("#SelAsignadoBWI").val(),
        SinSprint: $('#ChkSinSprintBWI').prop('checked')
        

    }



    var url = $('#urlConsultaBWI').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Filtros: Filtros }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {


            dsBacklogBuscar = jQuery.parseJSON(data.LstActividades);
            tablaBacklogBuscar = inicializaTabla($('#TblWIBusqueda'), dsBacklogBuscar, columnasBacklogbuscar, 1, "asc", true, true, true);





        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}

async function CargaCombosBuscarWorkItems() {

    var url = $('#urlCargaInicialBWI').val();

    await $.ajax({

        url: url,
        data: JSON.stringify({ IdProyecto: $('#IdProyectoBWI').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {


                $('#SelTipoBWI').empty();
                $('#SelTipoBWI').append(data.LstTipo);
                $('#SelTipoBWI').selectpicker('refresh');

                $('#SelPrioridadBWI').empty();
                $('#SelPrioridadBWI').append(data.LstPrioridades);
                $('#SelPrioridadBWI').selectpicker('refresh');

                $('#SelFaseBWI').empty();
                $('#SelFaseBWI').append(data.LstTipoAct);
                $('#SelFaseBWI').selectpicker('refresh');

                $('#SelUsuarioAsignado').empty();
                $('#SelUsuarioAsignado').append(data.LstUsuarios);
                $('#SelUsuarioAsignado').selectpicker('refresh');

                $('#SelSprintBWI').empty();
                $('#SelSprintBWI').append(data.LstSprints);
                $('#SelSprintBWI').selectpicker('refresh');

                $('#SelAsignadoBWI').empty();
                $('#SelAsignadoBWI').append(data.LstUsuarios);
                $('#SelAsignadoBWI').selectpicker('refresh');


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



$(document).on('change', '.SeleccionarBWI', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaBacklogBuscar.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsBacklogBuscar, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsBacklogBuscar[indexes[0]].Seleccionado = $(this).prop('checked');

    return false;

});

$(document).on('click', '#SeleccionarBWIT', function () {

    var rows = tablaBacklogBuscar.api().rows().nodes();
    var datos = tablaBacklogBuscar.api().rows().data();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    indexes = $.map(dsBacklogBuscar, function (obj, index) {
        if (obj.IdActividad == datos[index].IdActividad) {
            return index;
        }
    })
        ;
    var check = $(this).prop('checked');
    $.each(indexes, function (key, value) {
        dsBacklogBuscar[indexes[key]].Seleccionado = check;
    });



});


