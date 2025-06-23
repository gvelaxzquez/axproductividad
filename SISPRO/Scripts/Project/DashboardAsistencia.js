
var dsAsistencia = [];
var dsIncidencias = [];
var dsRetrasos = [];
var tablaAsistencia;
var tablaIncidencias;
var tablaRetrasos;
$(document).ready(function () {
 /*   Inicializar();*/
    CargaIndicadoresAsistencia();
    //document.body.style.zoom = "90%"
    //$("#DivAccesos").hide();
    //$("#DivCapturas").hide();
});


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
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

          if (data == 'A') {
                return '<span class="btn btn-small btn-warning" style="text-align:left;width:100%;"> Ausente </span>';

            }
   
            else if (data == 'D') {
                return '<span class="btn btn-small btn-danger" style="text-align:left;width:100%;">Desconectado</span>';

            }
            else if (data == 'L') {
                return '<span class="btn btn-small btn-success " style="text-align:left;width:100%;">En Línea </span>';

            }

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

            //if (data == null) {

            //    return "";
            //}
            //else {

            //    return '<button class="btn btn-default btn-small "  style="width:50%;text-align:center;">' + moment(data).format("hh:mm:ss") + '</button>';
            //}
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
        "data": "IncidenciasStr",
        "class": "text-left"
    }

    
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

function CargaIndicadoresAsistencia() {

    var url = $('#urlConsultaControlAsistencia').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {

                var dsDatos = jQuery.parseJSON(data.Indicadores);
                $('#wRecursos').text(dsDatos.Recursos);
                $('#PLinea').text(dsDatos.EnLinea);
                $('#PAusentes').text(dsDatos.Ausente);
                $('#PDesconectados').text(dsDatos.Desconectado);


                $('#wRetardos').text(dsDatos.Retrasos);
                $('#wIncidencias').text(dsDatos.Incidencias);



                dsAsistencia = dsDatos.LstAsistencia;
                tablaAsistencia = inicializaTabla($('#TblAsistencia'), dsAsistencia, columnasAsistencia, 0, "asc", true, true, true);




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

function VerIncidencias() {


    $('#ModalUsuarioIncidencias').modal({ backdrop: 'static', keyboard: false });

    ConsultaIncidencias();
    return false;
};

function ConsultaIncidencias() {
    var url = $('#urlConsultaListaIncidencias').val();

    $.ajax({

        url: url,
        type: "POST",
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