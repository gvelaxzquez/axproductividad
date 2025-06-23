var dsInformeActividades= [];
var tablaInformeActividades;
var columnasInformeActividades = [
            {
                    "data": "IdActividadStr",
                    "class": "text-left",
                    "render": function (data, type, row) {

                         return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

                     }
            },

             {
                 "data": "ProyectoStr",
                 "class": "text-left"
             },
     
            //{
            //    "data": "ClasificacionStr",
            //    "class": "text-left"
            //},
            {
                "data": "BR",
                "class": "text-left"
    },
    {
        "data": "ResponsableStr",
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
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))

        }
    },
              {
                  "data": "HorasAsignadas",
                "class": "text-right"
            }
         
];

$(document).ready(function () {

    $("#btnExportar").hide();
    CargaInformeActividades();
   
    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });

});

function CargaInformeActividades(){



    var url = $('#urlCargaInformeActividades').val();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {

                $('#SelAnioRA').append(data.LstAnios);

                $('#SelAnioRA').val(data.Anio);
                $('#SelMesRA').val(data.Mes);

                $('#SelAnioRA').selectpicker('refresh');
                $('#SelMesRA').selectpicker('refresh');

                $('#SelRecursoRA').append(data.LstUsuarios);
                $('#SelRecursoRA').selectpicker('refresh')

       

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

$(document).on('click', '#btnFiltrarInformeActividades', function (e) {

    ConsultarInformeActividades();
    $(".filter-settings").toggleClass("active");
    return false;

});


$(document).on('click', '#btnExportar', function (e) {


    var Mensaje = ValidaCamposRequeridos(".ReqFiltroIA");

    if (Mensaje.length == 0) {

        var url = $('#urlObtenerInformeActividadesPDF').val() + "?Id=" + $("#SelAnioRA").val() + "&Id2=" + $("#SelMesRA").val() + "&Id3=" + $("#SelRecursoRA").val();
        window.open(url, '_blank');
    } else {

        MensajeAdvertencia(data.Mensaje);

    }


    return false;

});


function ConsultarInformeActividades() {



    var Mensaje = ValidaCamposRequeridos(".ReqFiltroIA");

    if (Mensaje.length == 0) {
        var url = $('#urlObtenerInformeActividades').val();

        var Filtros = {
            IdAnio: $("#SelAnioRA").val(),
            IdMes: $("#SelMesRA").val(),
            IdUsuario :$("#SelRecursoRA").val()
        };


        $.ajax({
            url: url,
            data: JSON.stringify(Filtros),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
    
                if (data.Exito) {

                    var datos = jQuery.parseJSON(data.Reporte);


                    dsInformeActividades = datos.LstActividades;
                    tablaReporteTiempos = inicializaTabla($('#dtReporte'), dsInformeActividades, columnasInformeActividades, 1, "asc", true, true, true);
                    $("#lblfiltro").text($("#SelRecursoRA option:selected").text() + " " + $("#SelMesRA option:selected").text() + " " + $("#SelAnioRA option:selected").text());
                    $('#LblTotal').text('Total : ' + data.Total);

                    $("#btnExportar").show();

      



              /*      ActualizaTablaExportar(data.LstReporte);*/
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
    else {


        MensajeAdvertencia(Mensaje);
    }

}


