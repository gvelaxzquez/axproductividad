var idUsuarioCosto = 0;
var dtCosto = null;

var TablaDistribucion = null;
var dsDistribucion = [];
var colCosto = [
    {
        "class": "text-center",
        "data": "Clave",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Lider + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:60px; height:60px;cursor:pointer;">'


        }
    },
    {
        "data": "Clave",
        "class": "text-left"
    },
    {
        "data": "Nombre",
        "class": "text-left"
    },
    {
        "data": "NombreMes",
        "class": "text-center",
    },

    {
        "data": "Anio",
        "class": "text-center",
    },
    //{
    //    "data": "NombreMes",
    //    "class": "text-left"
    //},
    {
        "data": "CostoMensual",
        "class": "text-right",
        "render": data => '$ ' + formatMoney(data)
    },

    {
        "data": "LstDistrbucion",
        "class": "text-left",
        "render": function (data, type, row) {
            var contenido = "<ul>";

            data.forEach((cont, i) => {
            
                    contenido += "<li>" + cont.Proyecto + "  <b> " + $.number(cont.Porcentaje, '2', '.', ',')  + "% </b> </li>";
            });
            
            contenido += "</ul>"
            return contenido;
        }
    },

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-default BtnDistribuirCosto" ><span class="glyphicon glyphicon-random"></span></button>'
        }
    },

];
var coldistribucion = [

    {
        "data": "Proyecto",
        "class": "text-left"
    },
    {
        "data": "Porcentaje",
        "class": "text-right",
        "render": data => $.number(data, '2', '.', ',')
    },

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-default BtnEditarCosto"><span class="fa fa-pencil-square-o"></span></button>'


        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-default BtnEliminarCosto" ><span class="fa fa-trash"></span></button>'
        }
    },

];

$(document).ready(e => {


    $('#SelAnioUCM').val($('#AnioActual').val());
    $('#SelAnioUCM').selectpicker('refresh');

    $('#SelMesUCM').val($('#MesActual').val());
    $('#SelMesUCM').selectpicker('refresh');


    $('#SelAnioFUCM').val($('#AnioActual').val());
    $('#SelAnioFUCM').selectpicker('refresh');

    $('#SelMesFUCM').val($('#MesActual').val());
    $('#SelMesFUCM').selectpicker('refresh');


    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });

    LeerUsuarioCosto();
});

const LeerUsuarioCosto = async () => {
    const data = await POST("/Usuarios/ObtieneUsuarioCostoMensual", { Anio: $('#SelAnioFUCM').val(), Mes: $('#SelMesFUCM').val()}, true);
    if (data.Exito) {



        $("#lblCostoT").text( "$ " +  $.number(data.Total, '2', '.', ','));

        dtCosto =
            InicializaTabla({
                tabla: $('#dtCosto'),
                datos: data.LstCostosUsuario,
                columnas: colCosto,
                columnaOrdena: 1
            });
    } else {
        MensajeAdvertencia(data.Mensaje);
    }
};


$('#BtnFiltraUCM').click(async e => {

    LeerUsuarioCosto();
});



$('#btnNuevo').click(async e => {
    e.preventDefault();
    LimpiarModal();

    const data = await POST("/Usuarios/LeerUsuarioCostoFaltante", {}, false);
    if (data.Exito) {
        $('#cmbUsuarios').empty().append(data.Combo);
        $('#cmbUsuarios').selectpicker('refresh');
        $('#mdlCosto').modal('show');
    } else {
        MensajeAdvertencia(data.Mensaje);
    }
});

$(document).on('click', '.btnEditarCosto', async e => {
    e.preventDefault();
    LimpiarModal();
    const usuario = ObtenerData(dtCosto, e);

    const data = await POST("/Usuarios/LeerUsuarioCostoFaltante", { idUsuario: usuario.IdUsuario }, true);
    if (data.Exito) {
        $('#cmbUsuarios').empty().append(data.Combo)
        $('#cmbUsuarios').val(usuario.IdUsuario);
        $('#cmbUsuarios').selectpicker('refresh');
        $('#txtCostoMensual').val(usuario.CostoMensual);
        $('#txtCostoHora').val(usuario.CostoHora);
        idUsuarioCosto = usuario.IdUsuarioCosto;
        $('#mdlCosto').modal('show');
    } else {
        MensajeAdvertencia(data.Mensaje);
    }
});

$('#btnGuardar').click(async e => {
    const mensaje = ValidaCamposRequeridos('.ReqCosto');
    if (mensaje.length === 0) {
        const uc = {
            IdUsuarioCosto: idUsuarioCosto,
            CostoMensual: $('#txtCostoMensual').val(),
            CostoHora: $('#txtCostoHora').val(),
            IdUsuario: $('#cmbUsuarios').val()
        }
        const url = idUsuarioCosto === 0 ? "/Usuarios/CrearUsuarioCosto" : "/Usuarios/EditarUsuarioCosto";

        try {
            const data = await POST(url, { usuarioCosto: uc });
            if (data.Exito) {
                MensajeExito(data.Mensaje);
                LeerUsuarioCosto();
                $('#mdlCosto').modal('hide');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        } catch (e) {
            MensajeError('Error en el servidor');
            console.log(e);
        }
    } else {
        MensajeAdvertencia(mensaje);
    }
});

const LimpiarModal = () => {
    $('#cmbUsuarios').val('-1');
    $('#txtCostoMensual').val('');
    $('#txtCostoHora').val('');
    idUsuarioCosto = 0;
}

$('#btnExportar').click(async e => {
    e.preventDefault();

    if (dtCosto.api().rows()[0].length === 0) {
        MensajeAdvertencia("No hay registros para exportar");
        return;
    }

    let formData = new FormData();
    formData.append("Anio", $('#SelAnioFUCM').val());
    formData.append("Mes", $('#SelMesFUCM').val());
    DOWNLOAD('/Usuarios/DescargarExcelUsuarioCostoMensual', 'Costos.xlsx', formData, true);


});



function DescargarFormatoUCM() {
        DOWNLOAD(
        "/Usuarios/DescargarExcelEjemploUsuarioCostoMensual",
        'PlantillaCostos.xlsx'
    );
}


$('#btnImportar').click(e => {
    $('#mdlImportar').modal('show');
});

$('#btnImportarExcel').click(async e => {
    e.preventDefault();

    const file = document.getElementById('fileImportar');
    let form = new FormData();
    form.append('archivo', file.files[0]);
    form.append('Anio', $('#SelAnioUCM').val());
    form.append('Mes', $('#SelMesUCM').val());


    try {
        const data = await POST(
            '/Usuarios/ImportarUsuarioCostoMensual',
            form,
            true,
            true
        );

        if (data.Exito) {
            MensajeExito(data.Mensaje);
            // eslint-disable-next-line
            file.value = '';
            $('.file-input-name').text('');
            $('#rdoCarga').prop('checked', true);
            $('#mdlImportar').modal('hide');
            LeerUsuarioCosto();
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } catch (e) {
        MensajeError('Error en el servidor');
        console.log(e);
    }
});


$(document).on('click', '.BtnDistribuirCosto', function (e) {
  
    var filaPadre = $(this).closest('tr');
    var row = dtCosto.api().row(filaPadre);
    var datosFila = row.data();

    $("#MesDist").val(datosFila.Mes);
    $("#AnioDist").val(datosFila.Anio);
    $("#IdUsuarioDist").val(datosFila.IdUsuario);



    $("#TituloModalDist").text("Distribución costo - " + datosFila.NombreMes + "/" + datosFila.Anio + " - " + datosFila.Nombre);

    var url = $('#urlCargaCostoDistribucion').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Anio: $('#AnioDist').val(), Mes: $('#MesDist').val(), IdUsuario: $('#IdUsuarioDist').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            dsDistribucion = data.LstCosto;
           
            TablaDistribucion = inicializaTabla($('#TblDistribucion'), dsDistribucion, coldistribucion, 0, "asc", false, true, false);

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

    $('#ModalDistribuirCosto').modal('show');

});


 $(document).on('click', '#btnGuardarDCM', function (e) {


        var url = $('#urlGuardarDistribucionCosto').val();

        var ds = dsDistribucion;

        $.ajax({
            url: url,
            data: JSON.stringify({ LstCosto: dsDistribucion, Anio: $('#AnioDist').val(), Mes: $('#MesDist').val(), IdUsuario: $('#IdUsuarioDist').val() }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {


                if (data.Exito) {
                    MensajeExito("Los datos se guardaron correctamente");
                    LeerUsuarioCosto();
                    $('#ModalDistribuirCosto').modal('hide');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }


            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {

                MensajeError("Error al realizar la consulta, intente de nuevo.");
            }
        });

    

    });

$(document).on('click', '.BtnEditarCosto', function () {

    var filaPadre = $(this).closest('tr');
    var row = TablaDistribucion.api().row(filaPadre);
    var datosFila = row.data();


    $("#SelProyectoDCM").val(datosFila.IdProyecto);
    $('#SelProyectoDCM').selectpicker('refresh');


    $("#TxtPorcentajeDCM").val(datosFila.Porcentaje);


    return false;
});


$(document).on('click', '#btnAgregarCDM', function (e) {




    var Mensaje = ValidaCamposRequeridos(".ReqDCME");

    if (Mensaje.length == 0) {


        indexes = $.map(dsDistribucion, function (obj, index) {
            if (obj.IdProyecto == $("#SelProyectoDCM").val()) {
                return index;
            }
        });
        var indice = indexes[0];


        if (indice === undefined) {

            var costo = {
                IdProyecto: $("#SelProyectoDCM").val(),
                Porcentaje: $("#TxtPorcentajeDCM").val(),
                Proyecto: $("#SelProyectoDCM option:selected").text()
                 
            }

            dsDistribucion.push(costo);


        }
        else {
            dsDistribucion[indexes[0]].Porcentaje = $("#TxtPorcentajeDCM").val();

        }

        TablaDistribucion = inicializaTabla($('#TblDistribucion'), dsDistribucion, coldistribucion, 0, "asc", false, true, false);


        $("#SelProyectoDCM").val(-1);
        $('#SelProyectoDCM').selectpicker('refresh');


        $("#TxtPorcentajeDCM").val(0);


    }
    else {

        MensajeAdvertencia(Mensaje);

        return false;
    }


    return false;

});


$(document).on('click', '.BtnEliminarCosto', function () {

    var filaPadre = $(this).closest('tr');
    var row = TablaDistribucion.api().row(filaPadre);
    var datosFila = row.data();

    dsDistribucion = $.grep(dsDistribucion, function (a, b) {

        return a.IdProyecto != datosFila.IdProyecto;
    });


    TablaDistribucion = inicializaTabla($('#TblDistribucion'), dsDistribucion, coldistribucion, 0, "asc", false, true, false);


    return false;
});









