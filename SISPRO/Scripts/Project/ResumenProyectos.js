
var dsReporte = [];
var tablaReporteProyectos;
var columnasReporteProyectos = [
              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnVerProyecto"><span class="fa fa-share"></span></button>'


                  }
              },
                {
                    "data": "Clave",
                    "class": "text-left"
                },
            {
                "data": "Nombre",
                "class": "text-left"
            },
             {
                 "data": "Lider",
                 "class": "text-left"
             },

              {
                  "data": "HorasAsignadas",
                  "class": "text-right"
              },
               {
                   "data": "HorasCompromiso",
                   "class": "text-right"
               },
               {
                   "data": "AvanceReal",
                   "class": "text-right"
               },
               {
                   "data": "Desfase",
                   "class": "text-right"
               },
                {
                  
                   "class": "text-right",
                   "render": function (data, type, row) {
                     
                         if (row.DesfaseProc <= 3) {
                       
                             return ' <span class="btn btn-success btn-small btnCapturaTrabajo"  style="width:100%;text-align:right;">' +  $.number(row.AvanceRealPorc, '2', '.', ',') + '</span>';
                           
                         }
                         else  if (row.DesfaseProc >= 3) {
                       
                             return ' <span class="btn btn-danger btn-small"  style="width:100%;text-align:right;">' +  $.number(row.AvanceRealPorc, '2', '.', ',') + '</span>';
                           
                         }
                         else {
                             return ' <span class="btn btn-warning btn-small " style="width:100%;text-align:right;">' + $.number(row.AvanceRealPorc, '2', '.', ',') + '</span>';
                           
                         }
                 
                 }
               },
               {
                   "data": "AvanceCompPorc",
                   "class": "text-right"
               },
               {
                   "data": "DesfaseProc",
                   "class": "text-right"
               }
         
];

$(document).ready(function () {




    $('#TxtFechaCorte').datetimepicker(
      {
          format: 'DD/MM/YYYY'
      });

});

$(document).on('click', '#BtnFiltrarRepProy', function (e) {

    ConsultarResumenProyectos();

    return false;

});


function     ConsultarResumenProyectos()
 {

    var url = $('#urlConsultaReporteHoras').val();



    var FechaCorte = ObtieneFecha($('#TxtFechaCorte').val().trim());


    $.ajax({
        url: url,
        data: JSON.stringify({ FechaCorte: FechaCorte }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {

                dsReporte = jQuery.parseJSON(data.LstDetalle);
                tablaReporteProyectos = inicializaTabla($('#TblReporteProyectos'), dsReporte, columnasReporteProyectos, 1, "asc", true, true, true);
                ActualizaTablaExportar(data.LstDetalle);
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


function ActualizaTablaExportar(data){

       var dsExportar =  jQuery.parseJSON(data);


        $('#TblReporteProyectosExportar tbody').html('');

        for (var i in dsExportar) {


            rows =     "<tr>"
                       + "<td class='text-center'>" + dsExportar[i].Clave + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Nombre + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Lider + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].HorasAsignadas + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].HorasCompromiso + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].AvanceReal + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].Desfase + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].AvanceRealPorc + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].AvanceCompPorc + "</td>"
                       + "<td class='text-center'>" + dsExportar[i].DesfaseProc + "</td>"
                       + "</tr>";
            $("#TblReporteProyectosExportar tbody").append(rows);
        }


}

$(document).on('click', '.BtnVerProyecto', function (e) {
 
    var filaPadre = $(this).closest('tr');
    var row = tablaReporteProyectos.api().row(filaPadre);
    var datosFila = row.data();

    var nombre = datosFila.Clave;

    var url = $('#urlVerProyecto').val() +  "?Id=" +  nombre;

    window.open(url, '_blank');

  

});