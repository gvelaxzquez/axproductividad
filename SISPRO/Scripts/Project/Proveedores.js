
var dsProveedores = [];
var dsContactos = [];
var tablaProveedores;
var tablaContacto;
var archivoev = "";
var control1 = $("#FlArchivoEvIntegridad");

var columnasProveedores = [
           {
               "data": "IdProveedor",
               "visible": false
           },
           {
               "data": "VPNumber",
               "class": "text-center"
           },
              {
                  "data": "NombreComercial",
                  "class": "text-center"
              },
            {
                "data": "RazonSocial",
                "class": "text-center"
            },
            {
                "data": "DescripcionGiro",
                "class": "text-center"
            },
            {
                "data": "BranchPlant",
                "class": "text-center"
            },
             {
                 "data": "Nacionalidad",
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return (data == 1) ? "Nacional" : "Extranjero";
                 }
             },

            {
                "data": "Contactos",
                "class": "text-center",
                "render": function (data, type, row) {
                    var nombres = "";
                    for (var i in data) {
                        nombres += data[i].Nombre + '</br>'
                    }
                    return nombres;
                }
            },
            {
                "data": "Contactos",
                "class": "text-center",
                "render": function (data, type, row) {
                    var correos = "";
                    for (var i in data) {
                        correos += data[i].CorreoElectronico + '</br>'
                    }
                    return correos;
                }
            },

            {
                "data": "Contactos",
                "class": "text-center",
                "render": function (data, type, row) {
                    var telefonos = "";
                    for (var i in data) {
                        telefonos += data[i].TelefonoFijo + '</br>'
                    }
                    return telefonos;
                }
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
                    return '<button class="btn btn-default BtnEditarDatos"><span class="fa fa-pencil-square-o"></span></button>'


                }
            }
];

var columnasContactos = [
           {
               "data": "IdProveedorCont",
               "visible": false
           },
           {
               "data": "Nombre",
               "class": "text-center"
           },
            {
                "data": "Puesto",
                "class": "text-center"
            },
            {
                "data": "Departamento",
                "class": "text-center"
            },
            {
                "data": "TelefonoFijo",
                "class": "text-center"
            },
            {
                "data": "TelefonoMovil",
                "class": "text-center"
            },
             {
                 "data": "CorreoElectronico",
                 "class": "text-center"
             },

            {
                "data": "Predeterminado",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? "Si" : "No";
                }
            },

            {
                "class": "text-center",
                "render": function (data, type, row) {
                    return '<button class="btn btn-default BtnEditarContactos"><span class="fa fa-pencil-square-o"></span></button>'


                }
            },
             {
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return '<button class="btn btn-default BtnEliminarContactos"><span class="fa fa-trash-o"></span></button>'


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

        dsProveedores = jQuery.parseJSON(data.LstPtoveedores);
        tablaProveedores = inicializaTabla($('#TblProveedores'), dsProveedores, columnasProveedores, 1, "asc", true, true, true);
        $('#TblProveedores').removeClass('hide');

        tablaContacto = inicializaTabla($('#TblContactos'), dsContactos, columnasContactos, 1, "asc", true, true, true);
        $('#TblContactos').removeClass('hide');

        $('#SelGiro').empty();
        $('#SelGiro').append(data.CmbGiro);

    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

function LimpiarFormularioProveedores() {
    $('#IdProveedor').val(0);
    $('#IdProveedorContacto').val(0);

    dsContactos = [];
    $('#TxtNumVP').val("");
    $('#TxtNombreComercial').val("");
    $('#TxtRazonSocial').val("");
    $('#TxtRFC').val("");
    $('#TxtBranchPlant').val("");
    $('#TxtPaginaWeb').val("");
    $('#TxtCalle').val("");
    $('#TxtNExterior').val("");
    $('#TxtNInterior').val("");
    $('#TxtColonia').val("");
    $('#TxtEstado').val("");
    $('#TxtCiudad').val("");
    $('#TxtPais').val("");
    $('#TxtCodigoPostal').val("");
    $('#TxtNombreContacto').val("");
    $('#TxtPuestoContacto').val("");
    $('#TxtDepartamentoContacto').val("");
    $('#TxtTelefonoFijoContacto').val("");
    $('#TxtTelefonoMovilContacto').val("");
    $('#TxtCorreoElectronicoContacto').val("");
    $('#TxtTerminos').code("");
    $('#UltimaActualizacion').text("");

    $('#SelGiro').val(-1);
    $('#SelEvaluacionIntegridad').val(-1);


    cambiaEstadoSwitch($('#ChkActivo'), true);
    cambiaEstadoSwitch($('#ChkPredeterminado'), true);

    $('#LblRdoFisica').click();
    $('#LblRdoMexicana2').click();

    $('#accTwoColOne').addClass('panel-body-open');
    $('#accTwoColOne').css('display', 'block');
    $('#accTwoColTwo').removeClass('panel-body-open');
    $('#accTwoColTwo').css('display', 'none');

    $('#accTwoColThree').removeClass('panel-body-open');
    $('#accTwoColThree').css('display', 'none');

    $('#accTwoColFour').removeClass('panel-body-open');
    $('#accTwoColFour').css('display', 'none');

}

$(document).on('click', '#BtnNuevo', function (e) {
    LimpiarFormularioProveedores();

    tablaContacto = inicializaTabla($('#TblContactos'), dsContactos, columnasContactos, 1, "asc", true, true, true);
    $('#TblContactos').removeClass('hide');

    $('#ModalProveedores').modal({ backdrop: 'static', keyboard: false });
})

function LimpiarFormularoContacto() {
    $('#IdProveedorContacto').val(0);
    $('#TxtNombreContacto').val("");
    $('#TxtPuestoContacto').val("");
    $('#TxtDepartamentoContacto').val("");
    $('#TxtTelefonoFijoContacto').val("");
    $('#TxtTelefonoMovilContacto').val("");
    $('#TxtCorreoElectronicoContacto').val("");
    cambiaEstadoSwitch($('#ChkPredeterminado'), true);
}

$(document).on('click', '#BtnAgregarContactos', function (e) {
    debugger;
    var Mensaje = ValidaCamposRequeridos(".ReqContacto");

    if (!ValidarEmail($('#TxtCorreoElectronicoContacto').val().trim()))
        Mensaje = "Correo no válido.";


    if (Mensaje.length == 0) {
        debugger;

        if ($('#IdProveedorContacto').val().trim() == 0) {
            //validacion para ver si existe otro contacto predeterminado
            var existePredeterminado = $.grep(dsContactos, function (a, b) {
                return a.Predeterminado == true
            });
            if (existePredeterminado.length > 0 && $('#ChkPredeterminado').prop('checked')) {
                MensajeAdvertencia("Ya existe un contacto predeterminado.");
            }
            else {
                // Comprobamos que el nombre no exista.
                var exiteNombre = $.grep(dsContactos, function (a, b) {
                    return a.Nombre == $('#TxtNombreContacto').val().trim()
                });
                if (exiteNombre.length == 0) {
                    //no existe nombre
                    // Comprobamos que no exista el mismo numero
                    var existeTelMovil = $.grep(dsContactos, function (a, b) {
                        return a.TelefonoMovil == $('#TxtTelefonoMovilContacto').val().trim()
                    });
                    if (existeTelMovil.length == 0) {
                        // No existe movil repetido.
                        // Comrpobamos que el correo no exista
                        var existeCorreo = $.grep(dsContactos, function (a, b) {
                            return a.CorreoElectronico == $('#TxtCorreoElectronicoContacto').val().trim()
                        });
                        if (existeCorreo.length == 0) {
                            // No existe Correo repetido.
                            var nuevoContacto = {
                                IdProveedorCont: dsContactos.length + 10000,
                                IdProveedor: $('#IdProveedor').val().trim(),
                                Nombre: $('#TxtNombreContacto').val().trim(),
                                Puesto: $('#TxtPuestoContacto').val().trim(),
                                TelefonoFijo: $('#TxtTelefonoFijoContacto').val().trim(),
                                TelefonoMovil: $('#TxtTelefonoMovilContacto').val().trim(),
                                CorreoElectronico: $('#TxtCorreoElectronicoContacto').val().trim(),
                                Predeterminado: $('#ChkPredeterminado').prop('checked'),
                                Departamento: $('#TxtDepartamentoContacto').val().trim(),

                            }
                            dsContactos.push(nuevoContacto);
                            refrescaTabla(tablaContacto, dsContactos);
                            LimpiarFormularoContacto();
                        }
                        else {
                            MensajeAdvertencia("Se encuentra repetido el correo electrónico del contacto.");

                        }
                    }
                    else {
                        MensajeAdvertencia("Se encuentra repetido el teléfono móvil del contacto.");

                    }
                }
                else {
                    MensajeAdvertencia("Se encuentra repetido el nombre del contacto.");

                }
            }
        }
        else {
            var existePredeterminado = $.grep(dsContactos, function (a, b) {
                return a.Predeterminado == true && a.IdProveedorCont != $('#IdProveedorContacto').val().trim()
            });
            if (existePredeterminado.length > 0 && $('#ChkPredeterminado').prop('checked')) {
                MensajeAdvertencia("Ya existe un contacto predeterminado.");
            }
            else {
                var exiteNombre = $.grep(dsContactos, function (a, b) {
                    return a.Nombre == $('#TxtNombreContacto').val().trim() && a.IdProveedorCont != $('#IdProveedorContacto').val().trim()
                });
                if (exiteNombre.length == 0) {
                    //no existe nombre
                    // Comprobamos que no exista el mismo numero
                    var existeTelMovil = $.grep(dsContactos, function (a, b) {
                        return a.TelefonoMovil == $('#TxtTelefonoMovilContacto').val().trim() && a.IdProveedorCont != $('#IdProveedorContacto').val().trim()
                    });
                    if (existeTelMovil.length == 0) {
                        // No existe movil repetido.
                        // Comrpobamos que el correo no exista
                        var existeCorreo = $.grep(dsContactos, function (a, b) {
                            return a.CorreoElectronico == $('#TxtCorreoElectronicoContacto').val().trim() && a.IdProveedorCont != $('#IdProveedorContacto').val().trim()
                        });
                        if (existeCorreo.length == 0) {
                            // No existe Correo repetido.

                            //editar
                            var nuevoContacto = {
                                IdProveedorCont: $('#IdProveedorContacto').val().trim(),
                                IdProveedor: $('#IdProveedor').val().trim(),
                                Nombre: $('#TxtNombreContacto').val().trim(),
                                Puesto: $('#TxtPuestoContacto').val().trim(),
                                TelefonoFijo: $('#TxtTelefonoFijoContacto').val().trim(),
                                TelefonoMovil: $('#TxtTelefonoMovilContacto').val().trim(),
                                CorreoElectronico: $('#TxtCorreoElectronicoContacto').val().trim(),
                                Predeterminado: $('#ChkPredeterminado').prop('checked'),
                                Departamento: $('#TxtDepartamentoContacto').val().trim(),

                            }

                            if (nuevoContacto.IdProveedorCont > 0) {
                                var indexes = $.map(dsContactos, function (obj, index) {
                                    if (obj.IdProveedorCont == nuevoContacto.IdProveedorCont) {
                                        return index;
                                    }
                                });
                                dsContactos.splice(indexes[0], 1);
                            }

                            dsContactos.push(nuevoContacto);

                            refrescaTabla(tablaContacto, dsContactos);


                            LimpiarFormularoContacto();

                        }
                        else {
                            MensajeAdvertencia("Se encuentra repetido el correo electrónico del contacto.");

                        }
                    }
                    else {
                        MensajeAdvertencia("Se encuentra repetido el teléfono móvil del contacto.");

                    }
                }
                else {
                    MensajeAdvertencia("Se encuentra repetido el nombre del contacto.");

                }
            }
        }
    }

    else {

        MensajeAdvertencia(Mensaje);
    }
    return false;
})

$(document).on('click', '#BtnGuardarProveedor', function (e) {
    var Mensaje = ValidaCamposRequeridos(".ReqProv");


    var existePredeterminado = $.map(dsContactos, function (obj, index) {
        if (obj.Predeterminado == true) {
            return index;
        }
    });

    if (existePredeterminado.length == 0) {
        MensajeAdvertencia("Debe existir un contacto predeterminado.");
        return false;
    }

    if (existePredeterminado.length == 0) {
        MensajeAdvertencia("Debe existir un contacto predeterminado.");
        return false;
    }

    //if ($('#SelEvaluacionIntegridad').val() == 1)
    //{
    //    if (archivoCotizacion1 == "") {
    //        MensajeAdvertencia("Debe.");
    //        return false;
    //    }
    //}


    if (Mensaje.length == 0) {

        if (dsContactos.length > 0) {


            var datosProveedor = {
                IdProveedor: $('#IdProveedor').val(),
                VPNumber: $('#TxtNumVP').val().trim(),
                TipoProv: $('input:radio[name=RdoFisica]:checked').val(),
                NombreComercial: $('#TxtNombreComercial').val().trim(),
                RazonSocial: $('#TxtRazonSocial').val().trim(),
                Nacionalidad: $('input:radio[name=RdoNacionalidad2]:checked').val(),
                RFCTAXID: $('#TxtRFC').val().trim(),
                GiroId: $('#SelGiro').val().trim(),
                BranchPlant: $('#TxtBranchPlant').val().trim(),
                PaginaWeb: $('#TxtPaginaWeb').val().trim(),
                EvIntegridad: $('#SelEvaluacionIntegridad').val(),
                EvIntegridadPath: archivoev,
                Activo: $('#ChkActivo').prop('checked'),

                DirCalle: $('#TxtCalle').val().trim(),
                DirNoExterior: $('#TxtNExterior').val().trim(),
                DirNoInterior: $('#TxtNInterior').val().trim(),
                DirColonia: $('#TxtColonia').val().trim(),
                DirEstado: $('#TxtEstado').val().trim(),
                DirPais: $('#TxtPais').val().trim(),
                DirCP: $('#TxtCodigoPostal').val().trim(),
                DirCiudad: $('#TxtCiudad').val().trim(),
                TerminosCondiciones: $('#TxtTerminos').code(),

                Contactos: dsContactos

            }
            LlamadaGuardarDatosProveedor(datosProveedor);
        }
        else {
            MensajeAdvertencia("Debe registrar mínimo un contacto para el proveedor.");
        }
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

})

function LlamadaGuardarDatosProveedor(datosProveedor) {

    var url = $('#urlGuardarDatosP').val();

    $.ajax({

        url: url,
        data: JSON.stringify(datosProveedor),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosProveedor,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosProveedor(data) {
    if (data.Exito) {
        LimpiarFormularioProveedores();

        MensajeExito(data.Mensaje);
        $('#ModalProveedores').modal('toggle');
        FinalizaLoading();

        CargaInicial();

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

$(document).on('click', '.BtnEditarDatos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaProveedores.api().row(filaPadre);
    var datosFila = row.data();

    LlamadaConsultarDatosProveedor(datosFila.IdProveedor);

})

function LlamadaConsultarDatosProveedor(idProveedor) {

    var url = $('#urlConsultarDatosP').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idProveedor: idProveedor }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaConsultarDatosProveedor,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaConsultarDatosProveedor(data) {
    if (data.Exito) {
        LimpiarFormularioProveedores();


        var datosProveedor = jQuery.parseJSON(data.DatosProveedor);
        $('#IdProveedor').val(datosProveedor.IdProveedor);
        $('#IdProveedorContacto').val(0);

        dsContactos = datosProveedor.Contactos;
        refrescaTabla(tablaContacto, dsContactos);
        $('#TxtNumVP').val(datosProveedor.VPNumber);
        $('#TxtNombreComercial').val(datosProveedor.NombreComercial);
        $('#TxtRazonSocial').val(datosProveedor.RazonSocial);
        $('#TxtRFC').val(datosProveedor.RFCTAXID);
        $('#TxtBranchPlant').val(datosProveedor.BranchPlant);
        $('#TxtPaginaWeb').val(datosProveedor.PaginaWeb);
        $('#TxtCalle').val(datosProveedor.DirCalle);
        $('#TxtNExterior').val(datosProveedor.DirNoExterior);
        $('#TxtNInterior').val(datosProveedor.DirNoInterior);
        $('#TxtColonia').val(datosProveedor.DirColonia);
        $('#TxtEstado').val(datosProveedor.DirEstado);
        $('#TxtCiudad').val(datosProveedor.DirCiudad);
        $('#TxtPais').val(datosProveedor.DirPais);
        $('#TxtCodigoPostal').val(datosProveedor.DirCP);

        $('#TxtTerminos').code(datosProveedor.TerminosCondiciones);

        $('#SelGiro').val(datosProveedor.GiroId);
        $('#SelEvaluacionIntegridad').val(datosProveedor.EvIntegridad);

        if (datosProveedor.EvIntegridad == 1) {
            $("#divEvEvidencia").removeClass("hide");

            $("#urlEvIntegridad").val(datosProveedor.EvIntegridadPath);

          
        }

        $('#UltimaActualizacion').text("Ultima actualización: " + moment(datosProveedor.FechaUltimaActualizacion).format("DD/MM/YYYY HH:mm"))




        cambiaEstadoSwitch($('#ChkActivo'), datosProveedor.Activo);
        cambiaEstadoSwitch($('#ChkPredeterminado'), false);


        if (datosProveedor.TipoProv == 1) {
            $("#LblRdoFisica").click();
        }
        else {
            $("#LblRdoMoral").click();

        }
        if (datosProveedor.Nacionalidad == 1) {
            $("#LblRdoMexicana2").click();
        }
        else {
            $("#LblRdoExtranjera2").click();

        }
         

        $('#ModalProveedores').modal('show');

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
     $('div.pg-loading-screen').remove();
}

$(document).on('click', '.BtnEliminarContactos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaContacto.api().row(filaPadre);
    var datosFila = row.data();
    var idContacto = datosFila.IdProveedorCont;

    var indexes = $.map(dsContactos, function (obj, index) {
        if (obj.IdProveedorCont == idContacto) {
            return index;
        }
    });
    dsContactos.splice(indexes[0], 1);
    refrescaTabla(tablaContacto, dsContactos);

    return false;
})

$(document).on('click', '.BtnEditarContactos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaContacto.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdProveedorContacto').val(datosFila.IdProveedorCont);

    $('#TxtNombreContacto').val(datosFila.Nombre);
    $('#TxtPuestoContacto').val(datosFila.Puesto);
    $('#TxtDepartamentoContacto').val(datosFila.Departamento);
    $('#TxtTelefonoFijoContacto').val(datosFila.TelefonoFijo);
    $('#TxtTelefonoMovilContacto').val(datosFila.TelefonoMovil);
    $('#TxtCorreoElectronicoContacto').val(datosFila.CorreoElectronico);

    cambiaEstadoSwitch($('#ChkPredeterminado'), datosFila.Predeterminado);

    return false;
})

$(document).on('click', '#BtnLimpiarFormularoContacto', function (e) {


    LimpiarFormularoContacto();
    return false;
})



$(document).on('click', '#RdoMexicana2', function (e) {

    $('#LblRFC').text("R.F.C.*");
    debugger;
})
$(document).on('click', '#RdoExtranjera2', function (e) {

    $('#LblRFC').text("TAX ID*");
    debugger;
})



$('#RdoMexicana2').on('ifChecked', function (event) {
    $('#LblRFC').text("R.F.C.*");
});
$('#RdoExtranjera2').on('ifChecked', function (event) {
    $('#LblRFC').text("TAX ID*");
});

$(document).on("change", "#FlArchivoEvIntegridad", function (e) {
    $("#FlArchivoEvIntegridad").parent().next().next().text("");

    var imgVal = $('#FlArchivoEvIntegridad').val();
    if (imgVal == '') {
        archivoev = "";


    }
    else {

        if (e.target.files != undefined) {

            var reader = new FileReader();

            reader.onload = function (f) {
                archivoev = f.target.result;
            };
            reader.readAsDataURL(e.target.files.item(0));
        }
    }
});

$(document).on('change', '#SelEvaluacionIntegridad', function (e) {
    var idev = $('#SelEvaluacionIntegridad').val();
    if(idev == 1){
    
       $("#divEvEvidencia").removeClass("hide");
    }
    else {
          $("#divEvEvidencia").addClass("hide");
    }

  
});

$(document).on('click', '#BtnVerEvIntegridad', function (e) {

    var url = $('#urlEvIntegridad').val();
    if (url != "") {
        $('#VerArchivoCotizacion').attr('src', $('#urlEvIntegridad').val());

        // $('#ModalProveedores').modal('toggle');
        $('#ModalVerArchivo').modal('show');
    }
    else {
        MensajeAdvertencia("Aún no se ha cargado la evidencia de evaluación de integridad.");
    }
    return false;
})
