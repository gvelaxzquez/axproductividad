
var dsBacklogBuscar = [];

var tablaBacklogBuscar;
var wiks;

var columnasBacklogbuscar = [
    {
        "class": "text-center",
        "render": function (data, type, row) {
         
                return '<input type="checkbox" class="SeleccionarBWI">';
      
        }
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
    }

];

$(document).on('click', '#BtnFiltrarBWI', function (e) {
    BuscarWorkItems();
  
    return false;
});

function CargaWorkItemsCP() {



    var Filtros = {
        IdProyecto: $("#IdProyectoBWICP").val(),        
        Tipo: 4
    }



    var url = $('#urlCargaInicialBWICP').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Filtros: Filtros }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            $('#ulHus').empty();

            wiks = jQuery.parseJSON(data.LstActividades);

            var sp = '<li class="list-group-item FiltrarWICP active" style="line-height:20px; cursor:pointer"  item=-1 > Todos </li>';
            $('#ulHus').append(sp);

            if (wiks.length > 0) {
                $.each(wiks, function (key, value) {
                    var sp = '<li class="list-group-item FiltrarWICP" style="line-height:20px; cursor:pointer"  item= ' + value.IdActividad + '  >' + value.BR + '</li>';
                    $('#ulHus').append(sp);
                });
            }
            else {
                var sp = '<li class="list-group-item" style="line-height:20px; cursor:pointer"> No hay historias de usuario</li>';
                $('#ulHus').append(sp);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}



$('#TxtBusquedaCPHU').keydown(function (event) {
    if (event.which == 13) {
        BuscarCPHU();
    }
   /* return false;*/
});


$(document).on('click', '#BtnBuscarCPHU', function (e) {


    BuscarCPHU();
    return false;
});

function BuscarCPHU()
{
    var txt = $("#TxtBusquedaCPHU").val().trim();


    var dsFiltrado = $.grep(wiks, function (a, b) {

        /*    return a.BR.trim() === txt;*/
        return a.BR.indexOf(txt) > -1;
    });

    $('#ulHus').empty();


    var sp = '<li class="list-group-item FiltrarWICP active" style="line-height:20px; cursor:pointer"  item=-1 > Todos </li>';
    $('#ulHus').append(sp);

    if (dsFiltrado.length > 0) {
        $.each(dsFiltrado, function (key, value) {
            var sp = '<li class="list-group-item FiltrarWICP" style="line-height:20px; cursor:pointer"  item= ' + value.IdActividad + '  >' + value.BR + '</li>';
            $('#ulHus').append(sp);
        });
    }
    else {
        var sp = '<li class="list-group-item" style="line-height:20px; cursor:pointer"> No hay datos que concidan</li>';
        $('#ulHus').append(sp);
    }

}

$(document).on('click', '.FiltrarWICP', function (e) {

    $(".FiltrarWICP").removeClass("active");
    $(this).addClass("active");

    var IdRelacion = $(this).attr('item');
    FiltrarCasosPrueba(IdRelacion);

    return false;
});



function FiltrarCasosPrueba(IdRelacion) {



    var Filtros = {
        IdActividad: IdRelacion,
        Tipo: 8,
        IdProyecto: $("#IdProyectoBWICP").val(),
        IdIteracion: $("#IdCicloPBWICP").val()
    }



    var url = $('#urlConsultaBWICP').val();

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





