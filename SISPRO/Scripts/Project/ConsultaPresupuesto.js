var dsPresupuesto = [];
var tablaPresupuesto;
var PrimeraVez = true;

var columnasPresupuesto = [

            {
                "data": "IdRequisicion",
                "class": "text-right"
            },
             {
                   "data": "FechaGenero",
                   "class": "text-center",
                   "render": function (data, type, row) {
                       return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                   }
               },
                {
                    "data": "Estatus",
                    "class": "text-center"
                },
                {
                      "data": "Prioridadstr",
                      "class": "text-center"
                },

               {
                       "data": "OrdenCompraMonto",
                       "class": "text-right",
                       "render": function (data, type, row) {
                           return "$ " + $.number(data, '2', '.', ',');
                       }
               },
              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnVerRequisicion"><span class="fa fa-pencil-square-o"></span></button>'


                  }
              }
];

function CargaInicialPresupuesto() {
    var url = $('#urlInicializarPresupuesto').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicialPresupuesto,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            //MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaInicialPresupuesto(data) {
    if (data.Exito) {
        $('#SelDepartamentoPre').empty();
        $('#SelDepartamentoPre').append(data.Departamento);

        $('#SelClasificacionPre').empty();
        $('#SelClasificacionPre').append(data.ProductoServicio);

        $('#LblCuenta').text('');
        $('#LblAsignado').text('');
        $('#LblUtilizado').text('');
        $('#LblReservado').text('');
        $('#LblDisponible').text('');



    }
    else {
        MensajeError(data.Mensaje);
    }
}

$(document).on('change', '.CombosPresupuesto', function (e) {

    if ($('#SelDepartamentoPre').val() != -1 && $('#SelClasificacionPre').val() != -1) {
        ConsultaPresupuesto();
    }

    return false;
})

function ConsultaPresupuesto() {


    var url =  $('#urlConsultaPresupuesto').val();

    var Parametros ={};
    Parametros["IdDepartamento"] =  $('#SelDepartamentoPre').val();
    Parametros["IdProductoServicio"] =  $('#SelClasificacionPre').val();

    $.ajax({
    
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(Parametros),
        async: false,
        success: successConsultaPresupuesto,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

        //MensajeError(data.Mensaje);
    }

    
    });

}

function successConsultaPresupuesto(data){

    if (data.Exito) {


        $('#LblCuenta').text(data.Cuenta);
        $('#LblAsignado').text(data.Asignado);
        $('#LblUtilizado').text(data.Utilizado);
        $('#LblReservado').text(data.Reservado);
        $('#LblDisponible').text(data.Disponible);

        if (data.Negativo) {
            $('#LblDisponible').addClass('text-danger');

        }
        else {
        $('#LblDisponible').removeClass('text-danger');
        }



        

        dsPresupuesto = jQuery.parseJSON(data.Requisiciones);
        if (PrimeraVez) {
            tablaPresupuesto = inicializaTabla($('#TblPresupuesto'), dsPresupuesto, columnasPresupuesto, 1, "asc", true, true, true);
            PrimeraVez = false;
        }
        else {
            refrescaTabla(tablaPresupuesto, dsPresupuesto);
        }

    }
    else {
        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '.BtnVerRequisicion', function () {

    var filaPadre = $(this).closest('tr');
    var row = tablaPresupuesto.api().row(filaPadre);
    var datosFila = row.data();


    var IdRequisicion = datosFila.IdRequisicion;

    $('#ModalRequisicones').on('hidden.bs.modal', function () {
        ConsultaPresupuesto();
    });

    $('#ModalRequisicones').modal({ backdrop: 'static', keyboard: false });
    $('#IdRequisicion').val(IdRequisicion);
    EditarRequisicion();
    return false;

});