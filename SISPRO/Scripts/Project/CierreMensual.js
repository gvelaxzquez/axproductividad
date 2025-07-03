
var tablasEncabezado = {};
var tablasDetalle = {};
var dsEncabezado = [];
var dsDetalle;
var listaDetalle = [];

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
                                    "<th>#</th>" +
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

 $(document).ready(function () {

  $('#TxtFechaFCorte').datetimepicker(
     {
        format: 'DD/MM/YYYY'
      });

    var fechaactual = new Date();

    var mes = (fechaactual.getMonth() + 1).toString();
    var anio = fechaactual.getFullYear().toString();

    if (mes == '13'){
        mes = '1';
    }

    $("#SelAnio").val(anio);
    $("#SelMes").val(mes);

});

var columnasEncabezado = [
            {
                "class": "text-center",
                "render": function (data, type, row) {
                    return "<button type='button' class='btn btn-grid details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
                }
            },
            {
                "data": "Clave",
                "class": "text-center",
                "render": function (data, type, row) {
                    return '<img class="img-dt" title="' + row.Recurso + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:60px; height:60px;cursor:pointer;">'


                }


            },
            {
                "data": "Recurso",
                "class": "text-left",
            },
            {
                "data": "Lider",
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
             // {
             //     "data": "BonoCumplimiento",
             //     "class": "text-right",
             // },
             // {
             //     "data": "HorasAdicionales",
             //     "class": "text-right",
             // },
             // {
             //     "data": "BonoHoras",
             //     "class": "text-right",
             // },
                           
             // {
             //     "data": "Total",
             //    "class": "text-right",
             //},
              {
                  "data": "Productividad",
                  "class": "text-right",
              },
             {
                 "data": "IdUsuario",
                 "visible": false
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
                            "data": "IdActividadStr",
                            "class": "text-left",
                            "render": function (data, type, row) {
                                return '<a style="cursor:pointer" href="#" onclick="clickalerta('+  row.IdActividad +' )" >' + data + '</a>'
                            }
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


$(document).on('click', '#BtnFiltrarGC', function (e) {

   var Mensaje = ValidaCamposRequeridos(".ReqFiltroComp");

   if(Mensaje != ""){
   
       MensajeAdvertencia(Mensaje);

      return false;
   }

    CargaCompensaciones();

    return false;

});



function CargaCompensaciones(){

    var url = $('#urlConsultaCompensaciones').val();


    var FechaCorte = ObtieneFecha($('#TxtFechaFCorte').val().trim());

        var datosBuscar = {
        Mes: $('#SelMes').val(),
        Anio: $('#SelAnio').val(),
        FechaCorte: FechaCorte,
        Guardar: $('#ChkGuardar').prop('checked')
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

                dsEncabezado = Enc;
                listaDetalle = Det;
                ActualizaTablaExportar(data.LstEncabezado);

                $('div.pg-loading-screen').remove();

                if (primeravez)
                    inicializaTablaComp('TblCompensacion', dsEncabezado);
                else
                    refrescaTablaComp();


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


function ConsultaCompensaciones() {

    var url = $('#urlConsultaCompensaciones').val();



    var datosBuscar = {
        Mes: $('#SelMes').val(),
        Anio: $('#SelAnio').val(),
        LstResponsable:$('#SelRecurso').val()
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

                dsEncabezado = Enc;
                listaDetalle = Det;
                ActualizaTablaExportar(data.LstEncabezado);

                $('div.pg-loading-screen').remove();

                if (primeravez)
                    inicializaTablaComp('TblCompensacion', dsEncabezado);
                else
                    refrescaTablaComp();


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

function refrescaTablaComp() {
    tablasEncabezado['TblCompensacion'].api().clear().rows.add(dsEncabezado).draw();
}

function format(d,nombreTabla) {
    var htmlDetalle = '';


    dsDetalle = $.grep(listaDetalle, function (a, b) {
        return a.IdUsuarioAsignado === d.IdUsuario;
    });

    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdUsuario);
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

function ActualizaTablaExportar(data) {

    var dsExportar = jQuery.parseJSON(data);


    $('#TblCompensacionesExportar tbody').html('');

    for (var i in dsExportar) {


        rows = "<tr>"
                   + "<td class='text-center'>" + dsExportar[i].Clave + "</td>"
                   + "<td class='text-left'>" + dsExportar[i].Recurso + "</td>"
                   + "<td class='text-left'>" + dsExportar[i].Lider + "</td>"
                   + "<td class='text-right'>" + dsExportar[i].EstandarMes + "</td>"
                   + "<td class='text-right'>" + dsExportar[i].HorasSolicitadas + "</td>"
                   + "<td class='text-right'>" + dsExportar[i].HorasLiberadas + "</td>"
              /*     + "<td class='text-right'>" + dsExportar[i].BonoCumplimiento + "</td>"*/
                   //+ "<td class='text-right'>" + dsExportar[i].HorasAdicionales + "</td>"
                   //+ "<td class='text-right'>" + dsExportar[i].BonoHoras + "</td>"
                   //+ "<td class='text-right'>" + dsExportar[i].Total + "</td>"
                   + "<td class='text-right'>" + dsExportar[i].Productividad + "</td>"
                   + "</tr>";
        $("#TblCompensacionesExportar tbody").append(rows);
    }


}