var dsTamanos = []; 
var tablaTamanos;
var columnasTamanos = [
            {
                "data": "IdActividadTamano",
                "visible": false
            },
             {
                 "data": "TipoParteId",
                 "visible": false
             },
             {
                 "data": "TipoParteIdStr",
                 "class": "text-left"
             },
             {
                 "data": "Descripcion",
                 "class": "text-left"
             },
             {
                 "data": "EBase",
                 "class": "text-right"
             },
             {
                 "data": "EEliminadas",
                 "class": "text-right"
             },
             {
                 "data": "EModificadas",
                 "class": "text-right"
             },
             {
                 "data": "EAgregadas",
                 "class": "text-right"
             },
             {
                 "data": "ABase",
                 "class": "text-right"
             },
             {
                 "data": "AEliminadas",
                 "class": "text-right"
             },
             {
                 "data": "AModificadas",
                 "class": "text-right"
             },
             {
                 "data": "AAgregadas",
                 "class": "text-right"
             },
              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnEditarTamano"><span class="fa fa-pencil-square-o"></span></button>'


                  }
              },
              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-danger BtnEliminarTamano"><span class="fa fa-trash-o"></span></button>'


                  }
              }
];

function InicializarModalTamanos(IdActividad){

    $("#IdActividadCTamano").val(IdActividad);
    LimpiarCamposTamanos();
    CargaInicialTamanos();
    CargarTamanos();
}
function CargaInicialTamanos(){

    var url = $('#urlCargaInicialTamanos').val();
    var IdActividad = $("#IdActividadCTamano").val();
 
    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify({IdActividad: IdActividad}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicialTamanos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
         
            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaInicialTamanos(data) {
    if (data.Exito) {

        $('#SelTipoActTamano').empty();
        $('#SelTipoActTamano').append(data.LstTipoParte);
        $("#LblActividadTamDesc").text( data.Descripcion);
        $('div.pg-loading-screen').remove();
    }
    else  {

     MensajeError(data.Mensaje);
    
    }
}
function CargarTamanos(){

    var url = $('#urlConsultaListaTamanos').val();
    var IdActividad = $("#IdActividadCTamano").val();
 
    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify({IdActividad: IdActividad}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaTamanos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
         
            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaTamanos(data) {
    if (data.Exito) {

        dsTamanos = jQuery.parseJSON(data.LstActividaTamano);
        tablaTamanos = inicializaTabla($('#TblTamanos'), dsTamanos, columnasTamanos, 1, "asc", false, false, false);
        $('div.pg-loading-screen').remove();
    }
    else  {

     MensajeError(data.Mensaje);
    
    }
}


function LimpiarCamposTamanos(){


    $("#IdActividadTamano").val("0");

    $("#TxtDescripcionParte").val("");
    $("#TxtEstimadoBase").val("");
    $("#TxtEstimadoEliminado").val("");
    $("#TxtEstimadoModificado").val("");
    $("#TxtEstimadoAgregado").val("");

    $("#TxtActualBase").val("");
    $("#TxtActualEliminado").val("");
    $("#TxtActualModificado").val("");
    $("#TxtActualAgregado").val("");

    $("#SelTipoActTamano").val("-1");

}
$(document).on('click', '#btnAgregarTamano', function (e) {
    GuardarTamano();
    return false;
});

function GuardarTamano()
{

   var Mensaje = ValidaCamposRequeridos(".ReqCapturaTamano");

   if (Mensaje.length == 0) {


    actividadtamano = {
           IdActividad: $('#IdActividadCTamano').val(),
           IdActividadTamano : $('#IdActividadTamano').val(),
           TipoParteId : $('#SelTipoActTamano').val(),
           Descripcion : $('#TxtDescripcionParte').val(),
           EBase : $('#TxtEstimadoBase').val(),
           EEliminadas: $('#TxtEstimadoEliminado').val(),
           EModificadas: $('#TxtEstimadoModificado').val(),
           EAgregadas: $('#TxtEstimadoAgregado').val(),
           ABase : $('#TxtActualBase').val(),
           AEliminadas: $('#TxtActualEliminado').val(),
           AModificadas: $('#TxtActualModificado').val(),
           AAgregadas: $('#TxtActualAgregado').val(),
          
       };

       var url = $('#urlGuardaTamanos').val();
     
 
   $.ajax({

       url: url,
       type: "POST",
       data: JSON.stringify({actividadtamano: actividadtamano}),
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       async: false,
       success: successRegistraTamano,
       error: function (xmlHttpRequest, textStatus, errorThrown) {
         
           MensajeError(data.Mensaje);
       }
   });


   }
   else{
    
   MensajeAdvertencia(Mensaje);
   }

}

function successRegistraTamano(data) {

   if (data.Exito) {

    LimpiarCamposTamanos();
    CargarTamanos();
   }
   else  {

    MensajeError(data.Mensaje);
    
   }
}

$(document).on('click', '.BtnEditarTamano', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaTamanos.api().row(filaPadre);
    var datosFila = row.data();
    
    $("#IdActividadTamano").val(datosFila.IdActividadTamano);

    $("#TxtDescripcionParte").val(datosFila.Descripcion);
    $("#TxtEstimadoBase").val(datosFila.EBase);
    $("#TxtEstimadoEliminado").val(datosFila.EEliminadas);
    $("#TxtEstimadoModificado").val(datosFila.EModificadas);
    $("#TxtEstimadoAgregado").val(datosFila.EAgregadas);

    $("#TxtActualBase").val(datosFila.ABase);
    $("#TxtActualEliminado").val(datosFila.AEliminadas);
    $("#TxtActualModificado").val(datosFila.AModificadas);
    $("#TxtActualAgregado").val(datosFila.AAgregadas);

    $("#SelTipoActTamano").val(datosFila.TipoParteId);

 
    return false;
 
 });

$(document).on('click', '.BtnEliminarTamano', function (e) {

   var filaPadre = $(this).closest('tr');
   var row = tablaTamanos.api().row(filaPadre);
   var datosFila = row.data();
   EliminarTamano(datosFila.IdActividadTamano);

   return false;

});

function EliminarTamano(IdActividadTamano){

   var url = $('#urlEliminarTamano').val();
  
 
   $.ajax({

       url: url,
       type: "POST",
       data: JSON.stringify({IdActividadTamano: IdActividadTamano}),
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       async: false,
       success: successEliminarTamano,
       error: function (xmlHttpRequest, textStatus, errorThrown) {
         
           MensajeError(data.Mensaje);
       }
   });
   return false;
}

function successEliminarTamano(data) {
   if (data.Exito) {
       CargarTamanos();
   }
   else  {

    MensajeError(data.Mensaje);
    
   }
}


