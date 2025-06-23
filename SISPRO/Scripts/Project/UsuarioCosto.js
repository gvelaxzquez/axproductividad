var idUsuarioCosto = 0;
var dtCosto = null;
var colCosto = [
    {
        "data": "Nombre",
        "class": "text-left"
    },
    {
        "data": "CostoMensual",
        "class": "text-right",
        "render": data => '$ ' + formatMoney(data)
    },
    {
        "data": "CostoHora",
        "class": "text-right",
        "render": data => '$ ' + formatMoney(data)
    },
    {
        "class": "text-center",
        "render": () => '<button class="btn btn-primary-light btn-sm btnEditarCosto"><i class="fa fa-edit"></i></button>'
    }
];

$(document).ready(e => {
    LeerUsuarioCosto();
});

const LeerUsuarioCosto = async () => {
    const data = await POST("/Usuarios/LeerUsuarioCosto");
    if (data.Exito) {
        dtCosto =
            InicializaTabla({
                tabla: $('#dtCosto'),
                datos: data.Usuarios,
                columnas: colCosto
            });
    } else {
        MensajeAdvertencia(data.Mensaje);
    }
};

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

    DOWNLOAD(
        "/Usuarios/DescargarExcelUsuarioCosto",
        'Costos.xlsx'
    );
});

$('#btnImportar').click(e => {
    $('#mdlImportar').modal('show');
});

$('#btnImportarExcel').click(async e => {
    e.preventDefault();

    const file = document.getElementById('fileImportar');
    let form = new FormData();
    form.append('archivo', file.files[0]);
    form.append('tipo', $('input[name="TipoCarga"]:checked').val());

    try {
        const data = await POST(
            '/Usuarios/ImportarUsuarioCosto',
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