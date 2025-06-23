
var dsFlujo = [];

var tablaFlujo;
var AvanceProy = 0;


$(document).ready(function () {

    if ($('#IdFlujo').val() == 0) {

        $("#ModalNuevoFlujo").modal('show');

    } else {
        CargarFlujoDetalle();

    }


    $('#TxtFechaFPD,#TxtFechaFFPD').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

});



var ColumnasFlujo = [
    {
        "data": "Secuencia",
        "class": "text-center",
    },
    {


        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" class="BtnEditarFPD"  href = "#" > ' + row.Concepto + '</a > '
        }


    },

    {
        "data": "Procentaje",
        "class": "text-right",
        "render": function (data, type, row) {

            if (AvanceProy >= data) {

               return '<span class="btn btn-success btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + ' %</span>'
            }
            else {

                if (row.Vencido == true) {
                    return '<span class="btn btn-danger btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + ' %</span>'

                } else {

                    return $.number(data, '2', '.', ',') + "%";
                }

                
            }
           
        }
    },
    {
        "data": "FechaDevOriginal",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "FechaDev",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '<span class="btn btn-default btn-small btnFechaDev" style="width:80%;text-align:center;">Sin asignar</span>' : '<span class="btn btn-default btn-small btnFechaDev" style="width:80%;text-align:center;">' + moment(data).format("DD/MM/YYYY")) +'</span>'
        }
    },
    {
        "data": "FechaFactura",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '<span class="btn btn-default btn-small btnFechaFactura" style="width:80%;text-align:center;">Sin asignar</span>' : '<span class="btn btn-default btn-small btnFechaFactura" style="width:80%;text-align:center;">' + moment(data).format("DD/MM/YYYY"))+'</span>'
        }
    },
    {
        "data": "Factura",
        "class": "text-left",
    },
    {
        "data": "FechaProgramadaPago",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '<span class="btn btn-default btn-small btnFechaProgramada" style="width:80%;text-align:center;">Sin asignar</span>' : '<span class="btn btn-default btn-small btnFechaProgramada" style="width:80%;text-align:center;">' + moment(data).format("DD/MM/YYYY"))+'</span>'
        }
    },
    {
        "data": "FechaPagoReal",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '<span class="btn btn-default btn-small btnFechaPago" style="width:80%;text-align:center;">Sin asignar</span>' : '<span class="btn btn-default btn-small btnFechaPago" style="width:80%;text-align:center;">' + moment(data).format("DD/MM/YYYY"))+'</span>'
        }
    },
    {
        "data": "Amortizadas",
        "class": "text-right",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "Horas",
        "class": "text-right",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',') ;
        }
    },

    {
        "data": "Monto",
        "class": "text-right",
        "render": function (data, type, row) {
            return  $.number(data, '2', '.', ',');
        }
    },

    {
        "data": "IVA",
        "class": "text-right",
        "render": function (data, type, row) {
            return  $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "Total",
        "class": "text-right",
        "render": function (data, type, row) {
            return  $.number(data, '2', '.', ',');
        }
    },

    {
       
        "class": "text-center",
        "render": () => '<button class="btn btn-primary-light btn-sm btnEliminarFlujoDetalle"><i class="fa fa-trash"></i></button>'
    }

];




function CargarFlujoDetalle() {



    var url = $('#urlObtieneFlujoDetalle').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdFlujo: $('#IdFlujo').val()}),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {


            var datos = jQuery.parseJSON(data.Flujo)

            var Indicadores = jQuery.parseJSON(data.Indicadores);


            if (datos.Activo == true) {

                $("#lblNombreP").text(datos.NombreProy + " (Archivado)");
            }
            else {
                $("#lblNombreP").text(datos.NombreProy);
            }
           
            $("#LblPreciohora").text($.number(datos.PrecioHora, '2', '.', ','));
            $("#LblHorasTotales").text($.number(datos.HorasTotales, '2', '.', ','));
            $("#LblIVA").text($.number(datos.PorcIVA, '2', '.', ','));


            $("#LblTotalProyecto").text("$ " + $.number(datos.TotalProyecto, '2', '.', ','));
            $("#LblTotalFacturado").text("$ " + $.number(datos.TotalFacturado, '2', '.', ','));
            $("#LblTotalPagado").text("$ " + $.number(datos.TotalPagado, '2', '.', ','));
            $("#LblSaldo").text("$ " + $.number(datos.Saldo, '2', '.', ','));
            $("#LblSaldoAmortizar").text("$ " + $.number(datos.SaldoAmortizar, '2', '.', ','));
            $("#LblTotalAmortizado").text("$ " + $.number(datos.TotalAmortizadas, '2', '.', ','));



            $("#LblTotalProyectoHoras").text( $.number(datos.TotalProyectoHoras, '2', '.', ','));
            $("#LblTotalFacturadoHoras").text($.number(datos.TotalFacturadoHoras, '2', '.', ','));
            $("#LblTotalPagadoHoras").text( $.number(datos.TotalPagadoHoras, '2', '.', ','));
            $("#LblSaldoHoras").text($.number(datos.SaldoHoras, '2', '.', ','));
            $("#LblSaldoAmortizarHoras").text($.number(datos.SaldoAmortizarHoras, '2', '.', ','));
            $("#LblTotalAmortizadoHoras").text($.number(datos.TotalAmortizadoHoras, '2', '.', ','));


            $('#IdProyectoFPD').val(datos.IdProyecto);
            $('#SelProyectoFP').val(datos.IdProyecto);
            $('#TxtPrecioHoraFP').val(datos.PrecioHora);
            $('#TxtIVAFP').val(datos.PorcIVA);
            $('#TxtTotalHoras').val(datos.HorasTotales);
            $('#TxtHorasAmortizar').val(datos.HorasAmortizar);
            $('#SelProyectoFP').selectpicker('refresh');
            cambiaEstadoSwitch($('#ChkActivoFPD'), datos.Activo);
            AvanceProy = Indicadores.AvanceRealPorc;


            dsFlujo = datos.FlujoDetalle;
            tablaFlujo = inicializaTabla($('#TblFlujo'), dsFlujo, ColumnasFlujo, 0, "asc", false, true, false);

            $("#Secuencia").val(dsFlujo.length +1);

           

            var element2 = document.querySelector('.cavanceactual');
            var avancer = new EasyPieChart(element2, {
                delay: 3000,
                barColor: '#000070',
                trackColor: '#FFFFFF',
                scaleColor: false,
                lineWidth: 10,
                trackWidth: 50,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    this.el.children[0].innerHTML = Indicadores.AvanceRealPorc;
                }
            });
            avancer.update(Indicadores.AvanceRealPorc);
            avancer.disableAnimation();
            avancer.enableAnimation();

            var element3 = document.querySelector('.cavanceesperado');
            var avancees = new EasyPieChart(element3, {
                delay: 3000,
                barColor: '#000070',
                trackColor: '#FFFFFF',
                scaleColor: false,
                lineWidth: 10,
                trackWidth: 16,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    this.el.children[0].innerHTML = Indicadores.AvanceCompPorc;
                }

            });
            avancees.update(Indicadores.AvanceCompPorc);
            avancees.disableAnimation();
            avancees.enableAnimation();

            var element4 = document.querySelector('.cdesfase');
            var desfasees = new EasyPieChart(element4, {
                delay: 3000,
                barColor: function () {
                    if (Indicadores.DesfaseProc <= 5) {

                        return '#08C127'
                    }
                    else if (Indicadores.DesfaseProc <= 15) {
                        return '#fea223'

                    }
                    else {
                        return '#D12106'
                    }
                },
                trackColor: '#FFFFFF',
                scaleColor: false,
                lineWidth: 10,
                trackWidth: 16,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    this.el.children[0].innerHTML = Indicadores.DesfaseProc;
                }

                
            });
            desfasees.update(Indicadores.DesfaseProc);
            desfasees.disableAnimation();
            desfasees.enableAnimation();

            ValidarSubirBajar();


        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}
function CargarFlujoDetalleTabla() {



    var url = $('#urlObtieneFlujoDetalle').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdFlujo: $('#IdFlujo').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var datos = jQuery.parseJSON(data.Flujo)

            dsFlujo = datos.FlujoDetalle;
            tablaFlujo = inicializaTabla($('#TblFlujo'), dsFlujo, ColumnasFlujo, 0, "asc", false, true, false);



            $("#LblTotalProyecto").text("$ " + $.number(datos.TotalProyecto, '2', '.', ','));
            $("#LblTotalFacturado").text("$ " + $.number(datos.TotalFacturado, '2', '.', ','));
            $("#LblTotalPagado").text("$ " + $.number(datos.TotalPagado, '2', '.', ','));
            $("#LblSaldo").text("$ " + $.number(datos.Saldo, '2', '.', ','));


            $("#LblTotalProyectoHoras").text( $.number(datos.TotalProyectoHoras, '2', '.', ','));
            $("#LblTotalFacturadoHoras").text( $.number(datos.TotalFacturadoHoras, '2', '.', ','));
            $("#LblTotalPagadoHoras").text($.number(datos.TotalPagadoHoras, '2', '.', ','));
            $("#LblSaldoHoras").text( $.number(datos.SaldoHoras, '2', '.', ','));


            $("#Secuencia").val(dsFlujo.length + 1);

            ValidarSubirBajar();

            $('div.pg-loading-screen').remove();


        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}

function CambiaTipoFecha(tipo) {

    $('#TipoFecha').val(tipo);
    CargarFlujo();

}


$(document).on('click', '#BtnFiltrarFP', function (e) {

    CargarFlujo();
    $(".filter-settings").toggleClass("active");
    return false;

});


$(document).on('click', '#BtnGuardarFP', function (e) {


    var Mensaje = ValidaCamposRequeridos(".ReqFP");


    if (Mensaje.length == 0) {


        var Flujo = {
            IdFlujoPago: $('#IdFlujo').val(),
            IdProyecto: $('#SelProyectoFP').val(),
            PrecioHora: $('#TxtPrecioHoraFP').val().trim(),
            PorcIVA: $('#TxtIVAFP').val().trim(),
            HorasTotales: $('#TxtTotalHoras').val(),
            HorasAmortizar: $('#TxtHorasAmortizar').val(),
            Activo: $('#ChkActivoFPD').prop('checked')
        }

        LlamadaGuardarDatosFP(Flujo);


    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});

function LlamadaGuardarDatosFP(Flujo) {

    var url = $('#urlGuardarFlujo').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Flujo),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosFP,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarDatosFP(data) {
    if (data.Exito) {

        MensajeExito(data.Mensaje);
        $('#ModalNuevoFlujo').modal('hide');


        setTimeout(function () {
            VerFlujo(data.Respuesta);
        }, 3000);


    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}


$(document).on('click', '#BtnModificarFP', function (e) {


    $("#ModalNuevoFlujo").modal('show');

});

$(document).on('click', '#BtnNuevoFPD', function (e) {


    LimpiarModaNFPD();
    $("#TxtSecuencia").text($("#Secuencia").val());
    $("#ModalNuevoFlujoDetalle").modal('show');

    $('#parentsFPD-div').addClass('hidden');
    $('#show-parentsFPD-div').hide();
    $('.divMensajes.div-parentsFPD-repo').empty();


});

function LimpiarModaNFPD() {
    $("#TxtSecuencia").text("");
    $("#TxtConceptoFPD").val("");
    $("#TxtHorasFPD").val("");
    $("#TxtHorasAFPD").val("");
    $("#TxtPorcentajeFPD").val("");
    $("#TxtMontoFPD").val("");
    $("#IdFlujoDet").val("0");



}


$(document).on('click', '#BtnGuardarFPD', function (e) {


    var Mensaje = ValidaCamposRequeridos(".ReqFPD");


    if (Mensaje.length == 0) {


        var Flujo = {
            IdFlujoPago: $('#IdFlujo').val(),
            IdFlujoPagoDet: $('#IdFlujoDet').val(),
            Secuencia: $("#Secuencia").val(),
            Concepto: $('#TxtConceptoFPD').val().trim(),
            Horas: $('#TxtHorasFPD').val().trim(),
            Amortizadas: $('#TxtHorasAFPD').val().trim(),
            Procentaje: $('#TxtPorcentajeFPD').val(),
            Monto: $('#TxtMontoFPD').val()
            
        }

        LlamadaGuardarDatosFPD(Flujo);


    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});

function LlamadaGuardarDatosFPD(Flujo) {

    var url = $('#urlGuardaFlujoPagoDetalle').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Flujo),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosFPD,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarDatosFPD(data) {
    if (data.Exito) {

        MensajeExito(data.Mensaje);
        $('#ModalNuevoFlujoDetalle').modal('hide');

        CargarFlujoDetalleTabla();

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

function VerFlujo(Id) {

    var url = $('#urlFlujoDetalle').val() + "/" + Id;

    window.location.href = url;


}

function ValidarSubirBajar() {
    $('#TblFlujo>tbody>tr').each(function () {

        var row = tablaFlujo.api().row(this);
        var datosFila = row.data();
        if (datosFila != undefined) {

            var Secuencia = datosFila.Secuencia;
            var btnSubir = $("#btnSubir" + datosFila.IdFlujoPagoDet);
            var btnBajar = $("#btnBajar" + datosFila.IdFlujoPagoDet);

            if (Secuencia == 1) {
                btnSubir.hide();

            }
            else if (Secuencia == dsFlujo.length) {
                btnBajar.hide();

            }
        }

    });

}



$(document).on('click', '.btnFechaDev', function (e) {
  
    var filaPadre = $(this).closest('tr');
    var row = tablaFlujo.api().row(filaPadre);
    var datosFila = row.data();

    $('#TituloRecFPD').text("Ingresar fecha dev - " + datosFila.Concepto);
    $('#TipoFecha').val(1);
    $('#IdFlujoDetFecha').val(datosFila.IdFlujoPagoDet);
 

    $('#ModalCapturarFecha').modal('show');



});


$(document).on('click', '.btnFechaFactura', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaFlujo.api().row(filaPadre);
    var datosFila = row.data();

    $('#TituloRecFFPD').text("Ingresar fecha de factura - " + datosFila.Concepto);
    $('#TipoFecha').val(2);
    $('#IdFlujoDetFecha').val(datosFila.IdFlujoPagoDet);


    $('#ModalCapturarFechaFactura').modal('show');



});


$(document).on('click', '.btnFechaProgramada', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaFlujo.api().row(filaPadre);
    var datosFila = row.data();

    $('#TituloRecFPD').text("Ingresar fecha programada de pago - " + datosFila.Concepto);
    $('#TipoFecha').val(3);
    $('#IdFlujoDetFecha').val(datosFila.IdFlujoPagoDet);


    $('#ModalCapturarFecha').modal('show');



});

$(document).on('click', '.btnFechaPago', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaFlujo.api().row(filaPadre);
    var datosFila = row.data();

    $('#TituloRecFPD').text("Ingresar fecha pago - " + datosFila.Concepto);
    $('#TipoFecha').val(4);
    $('#IdFlujoDetFecha').val(datosFila.IdFlujoPagoDet);


    $('#ModalCapturarFecha').modal('show');



});


$(document).on('click', '#BtnGuardarCapturaFPD', function (e) {


    var Mensaje = ValidaCamposRequeridos(".ReqFechaFPD");


    if (Mensaje.length == 0) {


        var Flujo = {
            IdFlujoPagoDet: $('#IdFlujoDetFecha').val(),
            TipoFecha: $("#TipoFecha").val(),
            Fecha: $('#TxtFechaFPD').val().trim()
        }

        LlamadaGuardarDatosFechaFPD(Flujo);


    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});

$(document).on('click', '#BtnGuardarCapturaFFPD', function (e) {


    var Mensaje = ValidaCamposRequeridos(".ReqFechaFFPD");


    if (Mensaje.length == 0) {


        var Flujo = {
            IdFlujoPagoDet: $('#IdFlujoDetFecha').val(),
            TipoFecha: $("#TipoFecha").val(),
            Factura: $('#TxtFacturaFFPD').val().trim(),
            Fecha: $('#TxtFechaFFPD').val().trim()
        }

        LlamadaGuardarDatosFechaFFPD(Flujo);


    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});


function LlamadaGuardarDatosFechaFPD(Flujo) {


    var url = $('#urlGuardarFlujoPagoFechas').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Flujo),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosFechaFPD,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

}

function LlamadaGuardarDatosFechaFFPD(Flujo) {


    var url = $('#urlGuardarFlujoPagoFechas').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Flujo),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosFechaFFPD,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

}


function SuccessLlamadaGuardarDatosFechaFPD(data) {
    if (data.Exito) {

        MensajeExito(data.Mensaje);
     
        $('#ModalCapturarFecha').modal('hide');

        CargarFlujoDetalleTabla();
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

function SuccessLlamadaGuardarDatosFechaFFPD(data) {
    if (data.Exito) {

        MensajeExito(data.Mensaje);
        $('#ModalCapturarFechaFactura').modal('hide');
       

        CargarFlujoDetalleTabla();
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}


$(document).on('click', '.BtnEditarFPD', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaFlujo.api().row(filaPadre);
    var datosFila = row.data();


    $('#IdFlujoDet').val(datosFila.IdFlujoPagoDet);
    $('#TxtConceptoFPD').val(datosFila.Concepto);
    $('#TxtHorasFPD').val(datosFila.Horas);
    $('#TxtPorcentajeFPD').val(datosFila.Procentaje);
    $('#TxtMontoFPD').val(datosFila.Monto);
    $('#TxtSecuencia').text(datosFila.Secuencia);
    $('#TxtHorasAFPD').val(datosFila.Amortizadas);


    $('#parentsFPD-div').addClass('hidden');
    $('#show-parentsFPD-div').show();
    $('.divMensajes.div-parentsFPD-repo').empty();


    ConsultaActividadRelacionesFPD();

    $('#ModalNuevoFlujoDetalle').modal('show');



});

$('#BtnExportarFPD').click(e => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("IdFlujo", $('#IdFlujo').val())
    DOWNLOAD('/Proyectos/DescargarExcelFlujoPagosDetalle', 'DetalleFlujoPago.xlsx', formData, true);
});


$(document).on('click', '.btnEliminarFlujoDetalle', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaFlujo.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdFlujoDetEliminar').val(datosFila.IdFlujoPagoDet);

    MensajeConfirmarAccion("¿Desea eliminar esta registro?", "BtnEliminaFlujoDetalle");

    return false;



});



$(document).on('click', '#BtnEliminaFlujoDetalle', function (e) {

    var IdFlujoPagoDet = $('#IdFlujoDetEliminar').val();

    var url = $('#urlEliminarFlujoPagoDetalle').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdFlujoPagoDet: IdFlujoPagoDet }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                CargarFlujoDetalleTabla();


            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al cancelar la actividad, intente de nuevo.");
        }
    });

    return false;
});


$('#show-parentsFPD-div').click(() => {
    if ($('#parentsFPD-div').hasClass('hidden')) {
        $('#parentsFPD-div').removeClass('hidden');
        $('#SelActividadFPD').focus();

        $("#SelActividadFPD").select2({
            ajax: {
                url: $('#urlBuscarActividadesOpcion2').val(),
                dataType: 'json',
                delay: 950,
                async: false,
                data: function (params) {
                    return {
                        Texto: params.term,
                        IdProyecto: $("#IdProyectoFPD").val(),
                        IdActividad: 0
                    };
                },
                processResults: function (data, params) {

                    var lst = JSON.parse(data.LstActividades);

                    return {
                        results: JSON.parse(data.LstActividades),

                    };
                },
                cache: true
            },
            formatLoadMore: "Cargando...",
            placeholder: 'Ingrese la actividad...',
            minimumInputLength: 2,
            templateResult: formatRepoFPD,
        });
    }
    else
        $('#parents-div').addClass('hidden')
});


function formatRepoFPD(repo) {
    if (repo.loading) {
        return repo.text;
    }

    var $container = "";

    $container = $("<div class='task-item task-progreess' style='cursor:pointer;'  id='" + repo.IdActividad + "'>    " +
        "<div class='task-text' >" +
        "<span><img class='img-dt' src='" + repo.AsignadoPath + "' alt='" + repo.TipoActividadStr + "' title='" + repo.TipoActividadStr + "' style='width:24px; height:24px;'></span>" +
        " <b> " + repo.IdActividadStr + "</b>" +
        "<p>" + repo.Descripcion + "</p>" +
        "<button style='' id='' class='btn btn-default pull-right'onclick='RelacionarActividadFPD(" + repo.IdActividad + ")'>Agregar</button>" +
        "</div> </div>");


    return $container;
}



$('#hide-parentsFPD-div').click(() => {
    $('#parentsFPD-div').addClass('hidden');
});


async function ConsultaActividadRelacionesFPD() {
    const data = await POST('/actividades/ConsultaActividadRelacionesFPD', { IdFlujoPagoDet: $("#IdFlujoDet").val() });

    const html = data.Activitys.map((l, i) =>
        `<div style="position: relative;">
                <div class="autogenerado comentario-container-repo ${i === 0 ? "first" : ""}">
                    <div class="first">
                        <div class="center-cropper">
                            <div class="comentarios" style="height: 24px !important" title="${l.TipoNombre}"">

                                <img  style="height:18px; width:18px;"   src="/Content/Project/Imagenes/${l.TipoUrl}" alt="${l.TipoNombre}">
                            </div>
                        </div>
                    </div>
                    <div class="second">
                         <a target="_blank" href="/Share/s/${l.IdActividad}">${l.IdActividadStr}</a>
                    </div>
                </div>
                <div style="padding: 0px 10px">
                    <p>${l.BR.replaceAll('\n', '<br />') ?? ''}</p>
                </div>
                <button style="margin-bottom: -12px" class="btnTooltip abajo fa fa-trash btnEliminarActividadRelacionFPD" data-id="${l.IdActividadR1}" ></button>
            </div>`
    ).join('');

    $('.divMensajes.div-parents-FPD').empty().html(html);
}



async function RelacionarActividadFPD(IdActividadR) {


    const data = await POST('/Actividades/GuardarRelacionActividadFPD', { IdFlujoPagoDet: $("#IdFlujoDet").val(), IdActividad: IdActividadR }, false);

    if (data.Exito) {
        $('#SelActividadFPD').val(null).empty().select2('destroy');

        $('#parentsFPD-div').addClass('hidden');
        ConsultaActividadRelacionesFPD();
    } else {
        MensajeAdvertencia(data.Mensaje);
    }

}

$(document).on('click', '.btnEliminarActividadRelacionFPD', async e => {
    e.preventDefault();

    $("#IdActividadDependenciaFPD").val($(e.target).data('id'));
    MensajeConfirmarAccion("¿Desea eliminar esta actividad?", "btnEliminarActividadRelacionFPDC");

    return false;

});



//async function EliminarRelacionarActividad(IdFlujoPagoDetAct) {


//    const data = await POST('/Actividades/EliminaRelacionActividad', { IdActividadR: IdActividadR }, false);

//    if (data.Exito) {
//        ConsultaActividadRelaciones();
//    } else {
//        MensajeAdvertencia(data.Mensaje);
//    }


//    return false;
//}

$(document).on('click', '#btnEliminarActividadRelacionFPDC', async e => {
    e.preventDefault();


    var IdFlujoPagoDetAct = $("#IdActividadDependenciaFPD").val();


    const data = await POST('/actividades/EliminaRelacionActividadFPD', { IdFlujoPagoDetAct: IdFlujoPagoDetAct }, false);

    if (data.Exito) {
        MensajeExito("Se eliminó la relación");
        ConsultaActividadRelacionesFPD();

    } else {
        MensajeAdvertencia(data.Mensaje);
    }
});

