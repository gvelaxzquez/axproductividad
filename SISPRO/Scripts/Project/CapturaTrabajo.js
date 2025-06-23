var dsTrabajos = []; 
var tablaTrabajos;
var columnasTrabajos = [
            {
                "data": "IdActividadTrabajo",
                "visible": false
            },
            {
                 "data": "Fecha",
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                 }
             },
             {
                 "data": "Tiempo",
                 "class": "text-right"
             },
            {
              "data": "Comentario",
                 "class": "text-left"
              },
              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-danger BtnEliminarTrabajo"><span class="fa fa-trash-o"></span></button>'


                  }
              }
];

function CargarTrabajos(){

    var url = $('#urlConsultaTrabajos').val();
    var IdActividad = $("#IdActividadCTra").val();
 
    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify({IdActividad: IdActividad}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaTrabajos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
         
            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaTrabajos(data) {
    if (data.Exito) {
        $("#TxtFechaTrab").val("");
        $("#TxtTiempo").val("");
        $("#TxtComentarioTrabajo").val("");
        dsTrabajos = jQuery.parseJSON(data.LstTrabajos);
        tablaTrabajos = inicializaTabla($('#TblTrabajos'), dsTrabajos, columnasTrabajos, 1, "asc", false, false, false);
        $('div.pg-loading-screen').remove();
    }
    else  {

     MensajeError(data.Mensaje);
    
    }
}

$(document).on('click', '#btnAgregarTrabajo', function (e) {
    GuardarTrabajo();
    return false;
});

function GuardarTrabajo()
{

    var Mensaje = ValidaCamposRequeridos(".ReqTrab");

    if (Mensaje.length == 0) {


        Trabajo = {
            IdActividad: $('#IdActividadCTra').val(),
            Fecha: $('#TxtFechaTrab').val(),
            Tiempo: $('#TxtTiempo').val(),
            Comentario: $('#TxtComentarioTrabajo').val()
        };

        var url = $('#urlRegistraTrabajo').val();
     
 
    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify({Trabajo: Trabajo}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successRegistraTrabajos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
         
            MensajeError(data.Mensaje);
        }
    });


    }
    else{
    
    MensajeAdvertencia(Mensaje);
    }

}

function successRegistraTrabajos(data){

    if (data.Exito) {

   
        CargarTrabajos();
    }
    else  {

     MensajeError(data.Mensaje);
    
    }
}

$(document).on('click', '.BtnEliminarTrabajo', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaTrabajos.api().row(filaPadre);
    var datosFila = row.data();
    EliminarTrabajo (datosFila.IdActividadTrabajo);

    return false;

});

function EliminarTrabajo(IdActividadTrabajo){

    var url = $('#urlEliminaTrabajo').val();
  
 
    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify({IdActividadTrabajo: IdActividadTrabajo}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successEliminarTrabajo,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
         
            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successEliminarTrabajo(data) {
    if (data.Exito) {
       CargarTrabajos();
    }
    else  {

     MensajeError(data.Mensaje);
    
    }
}


