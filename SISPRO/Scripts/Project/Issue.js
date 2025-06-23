var Issue = {
    Controles: {
        mdlIssue: $('#mdlIssue'),
        rdoResponsable: $('#mdlIssue').find('[name="rdoResponsable"]'),
        cmbResponsable: $('#mdlIssue').find('#cmbResponsable'),
        txtDescripcion: $('#mdlIssue').find('#txtDescripcion'),
        dtFechaDeteccion: $('#mdlIssue').find('#dtFechaDeteccion'),
        dtFechaCompromiso: $('#mdlIssue').find('#dtFechaCompromiso'),
        dtFechaCierre: $('#mdlIssue').find('#dtFechaCierre'),
        txtResponsable: $('#mdlIssue').find('#txtResponsable'),
        cmbProyectoissue: $('#mdlIssue').find('#cmbProyectoissue'),
        lblProyecto: $('#mdlIssue').find('#lblProyecto'),
        cmbEstatus: $('#mdlIssue').find('#cmbEstatus'),
        cmbPrioridad: $('#mdlIssue').find('#cmbPrioridad'),
        chkBloqueante: $('#mdlIssue').find('#chkBloqueante'),
        lblNoIssue: $('#mdlIssue').find('#lblNoIssue'),
        divNoIssue: $('#mdlIssue').find('#divNoIssue'),
        divProyecto: $('#mdlIssue').find('#divProyecto'),
        btnGuardarIssue: $('#mdlIssue').find('#btnGuardarIssue'),
        btnVerComentarios: $('#mdlIssue').find('#btnVerComentarios'),
    },
    Constantes: {
        urlCrearIssue: () => Issue.Controles.mdlIssue.find('#CrearIssue').val(),
        urlEditarIssue: () => Issue.Controles.mdlIssue.find('#EditarIssue').val(),
        urlLeerComboProyecto: () => Issue.Controles.mdlIssue.find('#LeerComboProyecto').val(),
        urlLeerComboIssueEstatus: () => Issue.Controles.mdlIssue.find('#LeerComboIssueEstatus').val(),
        urlLeerComboIssuePrioridad: () => Issue.Controles.mdlIssue.find('#LeerComboIssuePrioridad').val(),
        urlLeerComboUsuarios: () => Issue.Controles.mdlIssue.find('#LeerComboUsuarios').val(),
        urlLeerIssuePorId: () => Issue.Controles.mdlIssue.find('#LeerIssuePorId').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            Issue.Controles.rdoResponsable.click(Issue.Funciones.CambiarResponsable);
            Issue.Controles.cmbProyectoissue.change(Issue.Funciones.ChangeCmbProyectoissue);
            Issue.Controles.btnGuardarIssue.click(Issue.Funciones.ClickBtnGuardarIssue);
            Issue.Controles.btnVerComentarios.click(Issue.Funciones.ClickBtnVerComentarios);
            Issue.Controles.cmbResponsable.empty().append('<option value="-1">--Seleccionar--</option>');
        }
    },
    Funciones: {
        ClickBtnGuardarIssue: e => {
            e.preventDefault();
            e.stopPropagation();


          
            const mensaje = ValidaCamposRequeridos('.RequeridoIssue');

            if (mensaje.length === 0) {
                Issue.Funciones.GuardarIssue();
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        ClickBtnVerComentarios: e => {
            e.preventDefault();
            Issue.Variables.ModalAbierto = true;
            IssueComentarios.Funciones.MostrarComentarios(Issue.Variables.IdIssue);
        },
        GuardarIssue: async () => {
            try {
                const idIssue = parseInt(Issue.Variables.IdIssue);

                const data = await POST(Issue.Constantes.urlEditarIssue(), {
                    IdIssue: idIssue,
                    IdProyecto: Issue.Controles.cmbProyectoissue.val(),
                    Descripcion: Issue.Controles.txtDescripcion.val(),
                    FechaDeteccion: Issue.Controles.dtFechaDeteccion.val(),
                    CatalogoPrioridadId: Issue.Controles.cmbPrioridad.val(),
                    CatalogoEstatusId: Issue.Controles.cmbEstatus.val(),
                    IdUResponsable: Issue.Controles.cmbResponsable.val(),
                    ResponsableExterno: Issue.Controles.txtResponsable.val(),
                    FechaCompromiso: Issue.Controles.dtFechaCompromiso.val(),
                    FechaCierre: Issue.Controles.dtFechaCierre.val(),
                    Bloqueante: Issue.Controles.chkBloqueante.prop('checked')
                });

                if (data.Exito) {
                    // eslint-disable-next-line
                    Issue.Variables.Actualizacion.actualizar = true;
                    Issue.Funciones.EditarIssue(idIssue, false);
                    MensajeExito(data.Mensaje);

                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (error) {
                MensajeAdvertencia(error);
            }
        },
        Init: () => {
            Issue.Eventos.InicializaEventos();
            Issue.Variables.Actualizacion.actualizarComentarios();
        },
        LeerCombos: async () => {
            try {
                const data = await Promise.all([
                    POST(Issue.Constantes.urlLeerComboProyecto(), false),
                    POST(Issue.Constantes.urlLeerComboIssueEstatus(), false),
                    POST(Issue.Constantes.urlLeerComboIssuePrioridad(), false)
                ])

                const error = data.find(x => !x.Exito);
                if (error) {
                    MensajeAdvertencia(error.Mensaje);
                    return error;
                } else {
                    Issue.Controles.cmbProyectoissue.empty().append(data[0].CmbProyecto);
                    Issue.Controles.cmbEstatus.empty().append(data[1].CmbEstatus);
                    Issue.Controles.cmbPrioridad.empty().append(data[2].CmbPrioridad);
                }
            } catch (error) {
                MensajeAdvertencia(error);
                return true;
            }
        },
        ChangeCmbProyectoissue: e => {
            e.stopPropagation();

            Issue.Funciones.LeerComboUsuariosPorProyecto(e.target.value);
        },
        LeerComboUsuariosPorProyecto: async id => {
            if (id !== '-1') {
                try {
                    const data = await POST(Issue.Constantes.urlLeerComboUsuarios(), {
                        idProyecto: id
                    }, false);

                    if (data.Exito) {
                        Issue.Controles.cmbResponsable.empty().append(data.CmbResponsable);
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                } catch (error) {
                    MensajeError(error);
                }
            } else {
                Issue.Controles.cmbResponsable.empty().append('<option value="-1">--Seleccionar--</option>');
            }
        },
        CambiarResponsable: e => {
            e.stopPropagation();

            const opcion = Issue.Controles.rdoResponsable.filter(':checked').val();
            if (opcion === 'Interno') {
                Issue.Controles.cmbResponsable.removeClass('hidden');
                Issue.Controles.cmbResponsable.addClass('RequeridoIssue');
                Issue.Controles.txtResponsable.removeClass('RequeridoIssue');
                Issue.Controles.txtResponsable.addClass('hidden');
                Issue.Controles.txtResponsable.val('');
            } else if (opcion === 'Externo') {
                Issue.Controles.txtResponsable.removeClass('hidden');
                Issue.Controles.txtResponsable.addClass('RequeridoIssue');
                Issue.Controles.cmbResponsable.removeClass('RequeridoIssue');
                Issue.Controles.cmbResponsable.addClass('hidden');
                Issue.Controles.cmbResponsable.val('-1');
            }
        },
        NuevoIssue: async (idProyecto = 0) => {
            Issue.Funciones.LimpiarModalIssue();
            const errorCombos = await Issue.Funciones.LeerCombos();
            if (errorCombos === true) return;
            if (errorCombos) {
                MensajeAdvertencia(data.Mensaje);
                return;
            }

            const data = await Issue.Funciones.CrearIssue();

            if (data?.Exito) {
                Issue.Controles.divNoIssue.css('display', 'none');
                Issue.Controles.btnVerComentarios.css('display', 'none');
                Issue.Controles.btnVerComentarios.css('display', 'none');
                if (idProyecto !== 0) {
              
                    Issue.Controles.divProyecto.css('display', 'none');
                    Issue.Controles.cmbProyectoissue.val(`${idProyecto}`).trigger('change');
                   
                }
                Issue.Controles.mdlIssue.modal('show');
            }
        },
        CrearIssue: async () => {
            try {
                const data = await POST(Issue.Constantes.urlCrearIssue());

                if (data.Exito) {
                    // eslint-disable-next-line
                    Issue.Variables.IdIssue = data.IdIssue;
                    return data;
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.status.toString() + ' - ' + e.statusText);
            }
        },
        EditarIssue: async (id, loading = true) => {
            Issue.Funciones.LimpiarModalIssue();
            if (loading) {
                const errorCombos = await Issue.Funciones.LeerCombos();
                if (errorCombos === true) return;
                if (errorCombos) {
                    MensajeAdvertencia(data.Mensaje);
                    return;
                }
            }

            const data = await Issue.Funciones.LeerIssuePorId(id, loading);

            if (data?.Exito) {
                const issue = data.Issue;
                await Issue.Funciones.LeerComboUsuariosPorProyecto(issue.Proyecto.IdProyecto);

                Issue.Controles.lblNoIssue.text(issue.NoIssue);
                Issue.Controles.cmbProyectoissue.val(issue.Proyecto.IdProyecto).addClass('hidden').removeClass('RequeridoIssue');
                //Issue.Controles.cmbProyectoissue.val(issue.Proyecto.IdProyecto).toggleClass('.RequeridoIssue');
/*                Issue.Controles.cmbProyectoissue.val(issue.Proyecto.IdProyecto).removeClass('.RequeridoIssue');*/
                Issue.Controles.lblProyecto.text(issue.Proyecto.Nombre).removeClass('hidden');
                Issue.Controles.txtDescripcion.val(issue.Descripcion);
                Issue.Controles.dtFechaDeteccion.val(moment(issue.FechaDeteccion).format("YYYY-MM-DD"));
                Issue.Controles.dtFechaCompromiso.val(moment(issue.FechaCompromiso).format("YYYY-MM-DD"));
                Issue.Controles.cmbEstatus.val(issue.Estatus.IdCatalogo);
                Issue.Controles.cmbPrioridad.val(issue.Prioridad.IdCatalogo);
                if (issue.IdUResponsable !== null) {
                    Issue.Controles.rdoResponsable.filter('[value="Externo"]').prop('checked', false);
                    Issue.Controles.rdoResponsable.filter('[value="Interno"]').prop('checked', true);
                    Issue.Controles.rdoResponsable.filter('[value="Interno"]').trigger('click');
                    Issue.Controles.cmbResponsable.val(issue.IdUResponsable);
                    Issue.Controles.txtResponsable.val('');
                }
                else {
                    Issue.Controles.rdoResponsable.filter('[value="Externo"]').prop('checked', true);
                    Issue.Controles.rdoResponsable.filter('[value="Interno"]').prop('checked', false);
                    Issue.Controles.rdoResponsable.filter('[value="Externo"]').trigger('click');
                    Issue.Controles.txtResponsable.val(issue.ResponsableExterno);
                    Issue.Controles.cmbResponsable.val('-1');
                }
                if (issue.FechaCierre !== null) Issue.Controles.dtFechaCierre.val(moment(issue.FechaCierre).format("YYYY-MM-DD"));
                Issue.Controles.chkBloqueante.prop('checked', issue.Bloqueante);
                if (loading) Issue.Controles.mdlIssue.modal('show');
            }
        },
        LeerIssuePorId: async (id, loading = true) => {
            try {
                const data = await POST(Issue.Constantes.urlLeerIssuePorId(), { idIssue: id }, loading);

                if (data.Exito) {
                    // eslint-disable-next-line
                    Issue.Variables.IdIssue = data.Issue.IdIssue;
                    return data;
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.status?.toString() + ' - ' + e.statusText);
            }
        },
        LimpiarModalIssue: () => {
            Issue.Controles.lblNoIssue.text('');
            Issue.Controles.divProyecto.css('display', 'block');
            Issue.Controles.cmbProyectoissue.val('-1').removeClass('hidden').addClass('RequeridoIssue');
            Issue.Controles.lblProyecto.text('').addClass('hidden');
            Issue.Controles.txtDescripcion.val('');
            Issue.Controles.dtFechaDeteccion.val('');
            Issue.Controles.dtFechaCompromiso.val('');
            Issue.Controles.cmbPrioridad.val('-1');
            Issue.Controles.cmbEstatus.val('-1');
            Issue.Controles.rdoResponsable.filter('[value="Externo"]').prop('checked', false);
            Issue.Controles.rdoResponsable.filter('[value="Interno"]').prop('checked', true);
            Issue.Controles.rdoResponsable.filter('[value="Interno"]').trigger('click');
            Issue.Controles.cmbResponsable.val('-1');
            Issue.Controles.txtResponsable.val('');
            Issue.Controles.dtFechaCierre.val('');
            Issue.Controles.chkBloqueante.prop('checked', false);
            Issue.Variables.IdIssue = 0;
            Issue.Controles.divNoIssue.css('display', 'block');
            Issue.Controles.btnVerComentarios.css('display', 'block');
        }
    },
    Variables: {
        IdIssue: 0,
        ModalAbierto: false,
        Actualizacion: {
            actualizar: false,
            actualizarComentarios: () => { IssueComentarios.Variables.Actualizacion = new Proxy(IssueComentarios.Variables.Actualizacion, Issue.Variables.Actualizacion.handler) },
            handler: {
                set(target, property, value) {
                    target[property] = value;
                    //if ((Issue.Controles.mdlIssue.data('bs.modal') || {}).isShown)
                    //    Issue.Funciones.EditarIssue(Issue.Variables.IdIssue, false);
                }
            }
        }
    }
}

var IssueComentarios = {
    Controles: {
        mdlIssue: $('#mdlIssue'),
        mdlComentarios: $('#mdlIssueComentarios'),
        txtComentario: $('#mdlIssueComentarios').find('#txtComentario'),
        titulo: $('#mdlIssueComentarios').find('.modal-title'),
        btnAgregarComentario: $('#mdlIssueComentarios').find('#btnAgregarComentario'),
        divMensajes: $('#mdlIssueComentarios').find('#divMensajes'),
    },
    Constantes: {
        urlLeerIssueComentario: () => IssueComentarios.Controles.mdlComentarios.find('#LeerIssueComentario').val(),
        urlCrearIssueComentario: () => IssueComentarios.Controles.mdlComentarios.find('#CrearIssueComentario').val(),
        urlEliminarIssueComentario: () => IssueComentarios.Controles.mdlComentarios.find('#EliminarIssueComentario').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            IssueComentarios.Controles.btnAgregarComentario.click(IssueComentarios.Funciones.CrearIssueComentario);
            IssueComentarios.Controles.mdlComentarios.on('hidden.bs.modal', IssueComentarios.Funciones.CerrarModalComentarios);
        }
    },
    Funciones: {
        CerrarModalComentarios: () => {
            if (Issue.Variables.ModalAbierto)
                IssueComentarios.Controles.mdlIssue.modal('show');
            IssueComentarios.Controles.mdlComentarios.modal('hide');
            Issue.Variables.ModalAbierto = false;
        },
        MostrarComentarios: id => {
            IssueComentarios.Funciones.LeerIssueComentario(id);
        },
        CrearIssueComentario: async e => {
            try {
                e.stopPropagation();
                const mensaje = ValidaCamposRequeridos('#mdlIssueComentarios.RequeridoComentario');

                if (mensaje.length === 0) {
                    const id = IssueComentarios.Variables.IdIssue;
                    const comentario = IssueComentarios.Controles.txtComentario.val();

                    const data = await POST(IssueComentarios.Constantes.urlCrearIssueComentario(),
                        {
                            comentario: {
                                IdIssue: id,
                                Comentario: comentario
                            }
                        },
                        false
                    );

                    if (data.Exito) {
                        MensajeExito(data.Mensaje);
                        await IssueComentarios.Funciones.LeerIssueComentario(id, false);
                        // eslint-disable-next-line
                        IssueComentarios.Variables.Actualizacion.actualizar = true;
                        IssueComentarios.Controles.txtComentario.val('');
                        IssueComentarios.Controles.divMensajes.animate({ scrollTop: IssueComentarios.Controles.divMensajes.prop("scrollHeight") }, 500);
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                } else {
                    MensajeAdvertencia(mensaje);
                }
            } catch (e) {
                MensajeError(e.status.toString() + ' - ' + e.statusText);
            }
        },
        LeerIssueComentario: async (id, loading = true) => {
            try {
                const data = await POST(IssueComentarios.Constantes.urlLeerIssueComentario(), { idIssue: id }, loading);
                if (data.Exito) {
                    // eslint-disable-next-line
                    IssueComentarios.Variables.IdIssue = id;
                    IssueComentarios.Controles.titulo.text(data.NoIssue);
                    const comentarios = IssueComentarios.Funciones.DibujarComentarios(data.Comentarios);
                    IssueComentarios.Controles.divMensajes.empty().append(comentarios);
                    IssueComentarios.Funciones.BindEmiminar();
                    IssueComentarios.Controles.mdlIssue.modal('hide');
                    IssueComentarios.Controles.mdlComentarios.modal('show');
                    IssueComentarios.Controles.divMensajes.animate({ scrollTop: IssueComentarios.Controles.divMensajes.prop("scrollHeight") }, 650);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.status.toString() + ' - ' + e.statusText);
            }
        },
        DibujarComentarios: comentarios => {
            let html = '';
            comentarios.forEach((c, i) => {
                html +=
                    `<div class="comentario-container ${i === 0 ? 'first' : ''}">
                            <div class="first">
                                <div class='center-cropper'>
                                    <div class='comentarios'>
                                        <img src="${c.Usuario.imgURL}" alt="${c.Usuario.NumEmpleado}" />
                                    </div>
                                </div>
                            </div>
                            <div class="second">
                                <div>
                                    <strong>${c.Usuario.NombreCompleto}</strong> <small>${moment(c.FechaCreo).format("DD-MMM-YYYY HH:mm:ss")}</small>
                                </div>
                                <p>${c.Comentario.replaceAll('\n', '<br />')}</p>
                            </div>
                            ${c.Autogenerado ? '' : `<button class="btnTooltip abajo fa fa-trash hidden btnEliminarComentario" data-id="${c.IdIssueComentario}"></button>`}
                         </div> `
            });

            return html;
        },
        BindEmiminar: () => {
            $('.comentario-container').hover(IssueComentarios.Funciones.MostrarBtnEliminar, IssueComentarios.Funciones.OcultarBtnEliminar);
            $('.btnEliminarComentario').click(IssueComentarios.Funciones.EliminarIssueComentario)
        },
        EliminarIssueComentario: async e => {
            try {
                e.stopPropagation();
                const id = $(e.target).data('id');
                const data = await POST(IssueComentarios.Constantes.urlEliminarIssueComentario(), { idIssueComentario: id }, false);

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    // eslint-disable-next-line
                    IssueComentarios.Variables.Actualizacion.actualizar = true;
                    IssueComentarios.Funciones.LeerIssueComentario(IssueComentarios.Variables.IdIssue, false);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.status.toString() + ' - ' + e.statusText);
            }
        },
        MostrarBtnEliminar: e => {
            e.stopPropagation();
            $(e.currentTarget).find('.btnEliminarComentario').eq(0).removeClass('hidden');
        },
        OcultarBtnEliminar: e => {
            e.stopPropagation();
            $(e.currentTarget).find('.btnEliminarComentario').eq(0).addClass('hidden');
        },
        Init: () => {
            IssueComentarios.Eventos.InicializaEventos();
        }
    },
    Variables: {
        IdIssue: 0,
        Actualizacion: {
            actualizar: false
        }
    }
}

Issue.Funciones.Init();
IssueComentarios.Funciones.Init();