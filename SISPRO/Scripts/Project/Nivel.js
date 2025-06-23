var dsNivel = [];

var tablaNivel;

var columnasNivel = [
            {
                "data": "IdNivel",
                "visible": false
            },
            {
                "data": "Nombre",
                "class": "text-left"
            },
             {
                 "data": "FactorCumplimiento",
                 "class": "text-right"
             },
              {
                  "data": "FactorHoras",
                  "class": "text-right"
              },
               {
                   "data": "EstandarDiario",
                  "class": "text-right"
              },
            {
                "data": "Activo",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? "Si" : "No";
                }
            },

              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnEditarNivel"><span class="fa fa-pencil-square-o"></span></button>'


                  }
              }
];

$(document).ready(function () {

    CargaInicial();
});

function CargaInicial() {

    var url = $('#urlCargaInicial').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicial,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaInicial(data) {
    if (data.Exito) {
        dsNivel = jQuery.parseJSON(data.LstNiveles);
        tablaNivel = inicializaTabla($('#TblNiveles'), dsNivel, columnasNivel, 1, "asc", true, true, true);
        $('div.pg-loading-screen').remove();
    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '#BtnNuevoNivel', function (e) {

    LimpiarCamposNiveles();
    $("#divMeses").hide();
      $('#ModalNiveles').modal('show');

      return false;

});

$(document).on('click', '#BtnGuardarNivel', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqNivel");

    if (Mensaje.length == 0) {


        var url = $('#urlGuardarNivel').val();
        var Nivel = {
            IdNivel: $("#IdNivel").val(),
            Nombre: $("#TxtNombreN").val(),
            FactorCumplimiento: $("#TxtFactorC").val(),
            FactorHoras:  $("#TxtFactorH").val(),
            EstandarDiario:  $("#TxtEstandarD").val(),
            Activo:  $('#ChkActivoN').prop('checked')

        }

        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(Nivel),
            async: false,
            success: function (data) {

                if (data.Exito) {

                    MensajeExito(data.Mensaje);
                    $('#ModalNiveles').modal('hide');
                    $('div.pg-loading-screen').remove();
                    CargaInicial();
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
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;

});

$(document).on('change', '#SelAnioNivel', function (e) {
    ConsultaNivelHoras();

    return false;

});

function LimpiarCamposNiveles(){
   
            $("#IdNivel").val("0");
            $("#TxtNombreN").val("");
            $("#TxtFactorC").val("");
            $("#TxtFactorH").val("");
    $("#TxtEstandarD").val("");
    $("#TxtEneroN").val("0");
    $("#TxtFebreroN").val("0");
    $("#TxtMarzoN").val("0");
    $("#TxtAbrilN").val("0");
    $("#TxtMayoN").val("0");
    $("#TxtJunioN").val("0");
    $("#TxtJulioN").val("0");
    $("#TxtAgostoN").val("0");
    $("#TxtSeptiembreN").val("0");
    $("#TxtOctubreN").val("0");
    $("#TxtNoviembreN").val("0");
    $("#TxtDiciembreN").val("0");

    $("#IdNivelHoras").val("0");
    $("#SelAnioNivel").val("-1");
    $("#SelAnioNivel").selectpicker('refresh');;

            cambiaEstadoSwitch($('#ChkActivoN'), true);

}

function ConsultaNivelHoras() {


    var url = $('#urlConsultaNivelHoras').val();

    var Nivel = {
        IdNivel: $("#IdNivel").val(),
        IdAnio: $("#SelAnioNivel").val()

    }


    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(Nivel),
        dataType: "json",
        async: false,
        success: successConsultaNivelHoras,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}
function successConsultaNivelHoras(data) {

    if (data.Exito) {
        var n = jQuery.parseJSON(data.NivelHoras);

        $("#TxtEneroN").val(n.Enero);
        $("#TxtFebreroN").val(n.Febrero);
        $("#TxtMarzoN").val(n.Marzo);
        $("#TxtAbrilN").val(n.Abril);
        $("#TxtMayoN").val(n.Mayo);
        $("#TxtJunioN").val(n.Junio);
        $("#TxtJulioN").val(n.Julio);
        $("#TxtAgostoN").val(n.Agosto);
        $("#TxtSeptiembreN").val(n.Septiembre);
        $("#TxtOctubreN").val(n.Octubre);
        $("#TxtNoviembreN").val(n.Noviembre);
        $("#TxtDiciembreN").val(n.Diciembre);
        $("#IdNivelHoras").val(n.IdNivelHoras);


        $('div.pg-loading-screen').remove();
    }
    else {

        MensajeError(data.Mensaje);
    }


}


$(document).on('click', '#BtnGuardarNivelMeses', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqNivelMeses");

    if (Mensaje.length == 0) {


        var url = $('#urlGuardarNivelHoras').val();
        var Nivel = {
            IdNivel: $("#IdNivel").val(),
            IdNivelHoras: $("#IdNivelHoras").val(),
            IdAnio: $("#SelAnioNivel").val(),
            Enero: $("#TxtEneroN").val(),
            Febrero: $("#TxtFebreroN").val(),
            Marzo: $("#TxtMarzoN").val(),
            Abril : $("#TxtAbrilN").val(),
            Mayo: $("#TxtMayoN").val(),
            Junio: $("#TxtJunioN").val(),
            Julio: $("#TxtJulioN").val(),
            Agosto: $("#TxtAgostoN").val(),
            Septiembre: $("#TxtSeptiembreN").val(),
            Octubre: $("#TxtOctubreN").val(),
            Noviembre: $("#TxtNoviembreN").val(),
            Diciembre: $("#TxtDiciembreN").val()

        }

        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(Nivel),
            async: false,
            success: function (data) {

                if (data.Exito) {

                    MensajeExito(data.Mensaje);
                    //$('#ModalNiveles').modal('hide');
                    //$('div.pg-loading-screen').remove();
                    //CargaInicial();
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
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;

});




$(document).on('click', '.BtnEditarNivel', function (e) {

  var filaPadre = $(this).closest('tr');
    var row = tablaNivel.api().row(filaPadre);
    var datosFila = row.data();
            
            
            $("#IdNivel").val(datosFila.IdNivel);
            $("#TxtNombreN").val(datosFila.Nombre);
            $("#TxtFactorC").val(datosFila.FactorCumplimiento);
            $("#TxtFactorH").val(datosFila.FactorHoras);
            $("#TxtEstandarD").val(datosFila.EstandarDiario);
    cambiaEstadoSwitch($('#ChkActivoN'), datosFila.Activo);



    $("#TxtEneroN").val("0");
    $("#TxtFebreroN").val("0");
    $("#TxtMarzoN").val("0");
    $("#TxtAbrilN").val("0");
    $("#TxtMayoN").val("0");
    $("#TxtJunioN").val("0");
    $("#TxtJulioN").val("0");
    $("#TxtAgostoN").val("0");
    $("#TxtSeptiembreN").val("0");
    $("#TxtOctubreN").val("0");
    $("#TxtNoviembreN").val("0");
    $("#TxtDiciembreN").val("0");

    $("#IdNivelHoras").val("0");
    $("#SelAnioNivel").val("-1");
    $("#SelAnioNivel").selectpicker('refresh');;
    $("#divMeses").show();
     $('#ModalNiveles').modal('show');

      return false;
});
