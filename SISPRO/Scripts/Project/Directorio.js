var page = 1;
var pageSize = 16;
var totalPages = 1;

$(function () { Inicializar(); });

function Inicializar() {

    console.log("Iniciado vista de directorio");

    $('body').on('ifChanged', '#formUpdate input', function (e) {
        Actualizar();
    });
    $('body').on('change', '#formUpdate input', function (e) {
        Actualizar();
    });
    $('body').on('change', '#formUpdate select', function (e) {
        Actualizar();
    });

    $('body').on('click', '#paginas .paginate_button', function (e) {
        Paginado(this.id.replace("page-", ""));
    });

    $('body').on('show.bs.collapse', '.contact-info', function (e) {
        var actives = $('#lstProvedores').find('.in, .collapsing');
        actives.each(function (index, element) {
            $(element).collapse('hide');
        })
    })

    Actualizar();
};

function Actualizar() {
    $.ajax({
        url: window.location + "/Obtener",
        type: "POST",
        data: $('#formUpdate').serialize(),
        async: true,
        global: false,
        beforeSend: function () { },
        success: Presentar,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            MensajeError("Ocurrió un error al obtener la información, intente mas tarde");
        }
    });
}

function Presentar(data) {
    if (data.Exito) {

        $('#nContactos').html(data.LstPtoveedores.length);
        $('#lstProvedores').children().remove();
        $('.pages .added').remove();

        if ($('#lstGiros').children().length == 1) {
            for (var i = 0; i < data.lstGiros.length; i++) {
                $('#lstGiros').append('<option class="new" value="' + data.lstGiros[i].IdCatalogo + '">' + data.lstGiros[i].DescCorta + '</option>');
                $('.selectpicker').selectpicker('refresh');
            }
        }

        for (var i = 0; i < data.LstPtoveedores.length; i++) {

            var provedor = data.LstPtoveedores[i];
            var template = '<div class="col-md-3 page-@page" style="display: none">' +
                                '<div class="panel panel-default">' +
                                    '<a  data-toggle="collapse" href="#collapse-@id" class="panel-body profile">' +
                                        '<div class="profile-data">' +
                                            '<div class="profile-data-name">@title</div>' +
                                        '</div>' +
                                    '</a>' +
                                    '<div class="panel-body collapse contact-info" id="collapse-@id">' +
                                            '<p class="contact-info-item"><small>Contacto predeterminado</small><br>@nombre</p>' +
                                            '<p class="contact-info-item"><small>Teléfono fijo</small><br>@telefono</p>' +
                                            '<p class="contact-info-item"><small>Correo electrónico</small><br>@correo</p>' +
                                            '<p><small>Dirección</small><br>@direccion</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';

            totalPages = Math.ceil((i + 1) / pageSize);
            template = template.replace('@page', totalPages);
            template = template.replace('@title', provedor.NombreComercial);
            template = template.split('@id').join(i);

            if (provedor.Contactos !== undefined) {
                template = template.replace('@nombre', provedor.Contactos[0].Nombre);
                template = template.replace('@telefono', provedor.Contactos[0].TelefonoFijo);
                template = template.replace('@correo', provedor.Contactos[0].CorreoElectronico);
            }
            else {
                template = $(template);
                template.remove('.contact-info-item')
            }

            template = template.replace('@direccion',
                "No. " + provedor.DirNoExterior +
                ", Calle " + provedor.DirCalle +
                ", " + provedor.DirColonia +
                ", " + provedor.DirCiudad +
                ", " + provedor.DirEstado
                );


            $('#lstProvedores').append(template);
        }



        for (var i = 2; i <= totalPages; i++) {
            $('.pages').append('<a class="paginate_button added" id="page-' + i + '" tabindex="0">' + i + '</a>')
        }

        Paginado(1);
    }
}

function Paginado(pagina) {
    switch (pagina) {
        case "prev":
            if (page > 1) {
                Paginado(page - 1);
            } break;
        case "next":
            if (page < totalPages) {
                Paginado(page + 1);
            } break;
        default:
            page = parseInt(pagina);
            $('#lstProvedores').children().hide();
            $(".page-" + page).show();
            $('.pages .paginate_button').removeClass('current');
            $(".pages #page-" + page).addClass('current');
            break;
    }
}

