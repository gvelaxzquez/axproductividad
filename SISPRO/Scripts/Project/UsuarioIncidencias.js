var dsUsuarioInc = [];
var tablaIncidencias;

var columnasIncidencia = [
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
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnEditarInc"><span class="fa fa-pencil-square-o"></span></button>'


                  }
              },

               {
                   "class": "text-center",
                   "render": function (data, type, row) {
                       return '<button class="btn btn-danger  glyphicon glyphicon-remove BtnEliminarInc" ></button>'
                   }
               },
             {
                    "data": "IdIncidencia",
                    "visible": false
             },
             {
                    "data": "IdUsuario",
                    "visible": false
              },
             {
                 "data": "TipoIncidenciaId",
                 "visible": false
             },
             {
                    "data": "Comentarios",
                    "visible": false
              },

];

$(document).ready(function () {
    CargaInicialIncidencias();
   $('#TxtFechaIniInc,#TxtFechaFinInc').datetimepicker(
    {
        format: 'DD/MM/YYYY'
    });

});

function CargaInicialIncidencias(){

    var url = $('#urlCargaInicialInc').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){
        
           dsUsuarioInc = jQuery.parseJSON(data.Incidencias);

           TablaIncidencias = inicializaTabla($('#TblIncidencias'), dsUsuarioInc, columnasIncidencia, 1, "asc", true, true, true);

            $('#SelUsuario').empty();
            $('#SelUsuario').append(data.LstRecursos);

            $('#SelTipoIncidencia').empty();
            $('#SelTipoIncidencia').append(data.LstTipoIncidencias);
        
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;


}

$(document).on('click', '#BtnNuevoInc', function (e) {


     LimpiarModalIncidencias();
     $('#ModalIncidencias').on('hidden.bs.modal', function () {
         CargaInicialIncidencias();
         $(this).off('hidden.bs.modal');
    });
     $('#ModalIncidencias').modal('show');


});

$(document).on('click', '#BtnGuardarInc',function(e){  

 var Mensaje = ValidaCamposRequeridos(".ReqIncidencia");

  if(Mensaje.length == 0 ){


   var url = $('#urlGuardarIncidencia').val();

   Incidencia = {
         IdIncidencia: $('#IdIncidencia').val(),
         IdUsuario:  $('#SelUsuario').val(),
         TipoIncidenciaId :  $('#SelTipoIncidencia').val(),
         FechaInicio: ObtieneFecha($('#TxtFechaIniInc').val().trim()),
         FechaFin: ObtieneFecha($('#TxtFechaFinInc').val().trim()),
         DiasConsiderar: $('#TxtDiasConsiderar').val(),
         Comentarios: $('#TxtComentarios').val()
   };


    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(Incidencia),
        async: false,
        success: function(data){
        
               if (data.Exito) {
                     
                   MensajeExito(data.Mensaje);
                   $('#ModalIncidencias').modal('hide');
                    $('div.pg-loading-screen').remove();
                   
                }
                else {
          
                    MensajeAdvertencia(data.Mensaje);
                
                }
        
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al guardar incidencia.");
        }
    });


  }
  else{
  
  MensajeAdvertencia(Mensaje);  
  }

    return false;
});

function LimpiarModalIncidencias() {

    $('#SelUsuario').val('-1');
    $('#SelTipoIncidencia').val('-1');
    $('#TxtFechaIniInc').val('');
    $('#TxtFechaFinInc').val('');
    $('#TxtDiasConsiderar').val('');
    $('#TxtComentarios').text('');
    $('#IdIncidencia').val('0');

}


$(document).on('click', '.BtnEditarInc', function (e) {
  
    var filaPadre = $(this).closest('tr');
    var row = TablaIncidencias.api().row(filaPadre);
    var datosFila = row.data();

    $('#SelUsuario').val(datosFila.IdUsuario);
    $('#SelTipoIncidencia').val(datosFila.TipoIncidenciaId);
    $('#TxtFechaIniInc').val(moment(datosFila.FechaInicio).format("DD/MM/YYYY"));
    $('#TxtFechaFinInc').val(moment(datosFila.FechaFin).format("DD/MM/YYYY"));
    $('#TxtDiasConsiderar').val(datosFila.DiasConsiderar);
    $('#TxtComentarios').text(datosFila.Comentarios);
    $('#IdIncidencia').val(datosFila.IdIncidencia);

    $('#ModalIncidencias').on('hidden.bs.modal', function () {
        CargaInicialIncidencias();
        $(this).off('hidden.bs.modal');
    });
     $('#ModalIncidencias').modal('show');

});


$(document).on('click', '.BtnEliminarInc', function (e) {

  var filaPadre = $(this).closest('tr');
    var row = TablaIncidencias.api().row(filaPadre);
    var datosFila = row.data();
    $('#IdIncidenciaCancelar').val(datosFila.IdIncidencia);

    MensajeConfirmarIncidencia("¿Desea eliminar la incidencia?");

      return false;
});

$(document).on('click', '#BtnConfirmarInc', function (e) {

    var IdIncidencia = $('#IdIncidenciaCancelar').val();

    CancelarIncidencia(IdIncidencia);

    return false;
});

function CancelarIncidencia(IdIncidencia){

    var url = $('#urlEliminarIncidencia').val();

  $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({IdIncidencia: IdIncidencia}),
        async: false,
        success: function(data){
        
               if (data.Exito) {
                     
                   MensajeExito(data.Mensaje);
                    $('div.pg-loading-screen').remove();
                   CargaInicialIncidencias();
                   
                }
                else {
          
                    MensajeAdvertencia(data.Mensaje);
                
                }
        
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al eliminar incidencia.");
        }
    });

}