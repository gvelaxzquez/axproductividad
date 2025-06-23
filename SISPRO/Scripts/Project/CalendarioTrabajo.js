var dsDiasFestivos = [];
var tablaDiasFestivos;

var columnasDiasFestivos = [
            {
                "data": "Fecha",
                "class": "text-center",
                "render": function (data, type, row) {
                        return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                   }
             },

               {
                   "class": "text-center",
                   "render": function (data, type, row) {
                       return '<button class="btn btn-danger  glyphicon glyphicon-remove BtnEliminarDiaF" ></button>'
                   }
               },
             {
                    "data": "IdDiaF",
                    "visible": false
             }
];


$(document).ready(function () {
    Inicializar();
    ConsultaCalendario();
    ConsultaDiasFestivos();

    $('#TxtFechaDiaFestivo').datetimepicker(
 {
     format: 'DD/MM/YYYY'
 });
});

function Inicializar() {

    var fechaactual = new Date();

    var mes = (fechaactual.getMonth() + 1).toString();
    var anio = fechaactual.getFullYear().toString();

    if (mes == '13'){
        mes = '1';
    }

    $("#SelAnio").val(anio);
    $("#SelMes").val(mes);


    $('#TxtFechaIniCal,#TxtFechaFinCal').datetimepicker(
    {
        format: 'DD/MM/YYYY'
    });

}

function LimpiaCamposCalendario(){

    $('#TxtDiasLaborales').val('');
    $('#TxtBaseCump').val('');
    $('#TxtBaseHoras').val('');

    $('#TxtFechaIniCal').val('');
    $('#TxtFechaFinCal').val('');

}
	
 function ConsultaCalendario(){
    
    var url = $('#urlConsultaCalendario').val();

         var parametros = {};
        parametros["Anio"] = $("#SelAnio").val();
        parametros["Mes"] = $("#SelMes").val();

       $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {
                     
                    var datos = jQuery.parseJSON(data.Calendario);


                    if (data.Guardado) {

                        $('#TxtFechaIniCal').val(moment(datos.FechaInicio).format("DD/MM/YYYY"));
                        $('#TxtFechaFinCal').val(moment(datos.FechaFin).format("DD/MM/YYYY"));
                        $('#TxtDiasLaborales').val(datos.DiasLaborales);
                        $('#TxtBaseCump').val(datos.BaseCompensacionCump);
                        $('#TxtBaseHoras').val(datos.BaseCompensacionHoras);

                    }
                    else {


                        LimpiaCamposCalendario();
                    }

                }
                else {
          
                    LimpiaCamposCalendario();
                    MensajeAdvertencia(data.Mensaje);
                
                }

            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
        
                MensajeError(data.Mensaje);
            }
        });
        return false;
  
  }


 $(document).on('change', '#SelAnio', function (e) {

     var Anio = $("#SelAnio").val();
     var Mes = $("#SelMes").val();

     if(Anio != -1 && Mes != -1){

         ConsultaCalendario();
      
     }
     else {
      
         LimpiaCamposCalendario();
     }

  
 });
  
 $(document).on('change', '#SelMes', function (e) {


     var Anio = $("#SelAnio").val();
     var Mes = $("#SelMes").val();

     if (Anio != -1 && Mes != -1) {

         ConsultaCalendario();

     }
     else {

         LimpiaCamposCalendario();
     }

 });


  $("#BtnGuardarCalendario").click(function () {

      var Mensaje = ValidaCamposRequeridos(".ReqCalendario");

     


    if (Mensaje.length == 0) {
        

        var url = $('#urlGuardarCalendario').val();


        calendario = {
            Anio : $("#SelAnio").val(),
            Mes: $("#SelMes").val(),
            Diaslaborales: $("#TxtDiasLaborales").val(),
            FechaInicio: ObtieneFecha($('#TxtFechaIniCal').val().trim()),
            FechaFin: ObtieneFecha($('#TxtFechaFinCal').val().trim()),
            BaseCompensacionCump: $("#TxtBaseCump").val(),
            BaseCompensacionHoras: $("#TxtBaseHoras").val()
        };

        
          $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(calendario),
            async: false,
            success: function (data) {
                if (data.Exito) {
                     
                   MensajeExito(data.Mensaje);
                   
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
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;

  });


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


  $(document).on('click', '#BtnNuevoDF', function (e) {

      $('#ModalDiasFestivos').modal('show');

      return false;

  });

  function ConsultaDiasFestivos() {

      var url = $('#urlConsultaDiasFestivos').val();



      $.ajax({

          url: url,
          type: "POST",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: false,
          success: function (data) {
              if (data.Exito) {


                  dsDiasFestivos = jQuery.parseJSON(data.LstDias);

                  tablaDiasFestivos = inicializaTabla($('#TblDiasFestivos'), dsDiasFestivos, columnasDiasFestivos, 1, "asc", true, true, true);

              }
              else {

                  MensajeAdvertencia(data.Mensaje);

              }

          },
          error: function (xmlHttpRequest, textStatus, errorThrown) {

              MensajeError(data.Mensaje);
          }
      });
      return false;

  }

$(document).on('click', '#BtnGuardarDF', function (e) {

   var Mensaje = ValidaCamposRequeridos(".ReqDiaFestivo");

  if(Mensaje.length == 0 ){


   var url = $('#urlGuardarDiaFestivo').val();
   var Fecha = ObtieneFecha($('#TxtFechaDiaFestivo').val().trim());

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({Fecha:Fecha}),
        async: false,
        success: function(data){
        
               if (data.Exito) {
                     
                   MensajeExito(data.Mensaje);
                   $('#ModalDiasFestivos').modal('hide');
                    $('div.pg-loading-screen').remove();
                   ConsultaDiasFestivos();
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

  $(document).on('click', '.BtnEliminarDiaF', function (e) {

  var filaPadre = $(this).closest('tr');
    var row = tablaDiasFestivos.api().row(filaPadre);
    var datosFila = row.data();
    $('#IdDiaF').val(datosFila.IdDiaF);

    MensajeConfirmarIncidencia("¿Desea eliminar el registro?");

      return false;
});

$(document).on('click', '#BtnConfirmarInc', function (e) {

    var IdDiaF = $('#IdDiaF').val();

    EliminarDiaFestivo(IdDiaF);

    return false;
});

function EliminarDiaFestivo(IdDiaF){
  
     var url = $('#urlEliminarDiaFestivo').val();


    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({IdDiaF:IdDiaF}),
        async: false,
        success: function(data){
        
               if (data.Exito) {
                     
                   MensajeExito(data.Mensaje);
                    $('div.pg-loading-screen').remove();
                   ConsultaDiasFestivos();
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



