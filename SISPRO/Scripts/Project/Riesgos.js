var Riesgo = {
    Controles: {
        mdlRiesgo: $('#mdlRiesgo'),
        mdlEstrategia: $('#mdlEstrategia'),
        btnGuardar: $('#mdlRiesgo').find('.btnGuardar'),
        /////
        lblNoRiesgo: $('#mdlRiesgo').find('.lblNoRiesgo'),
        dateFechaIdentificacion: $('#mdlRiesgo').find('.dateFechaIdentificacion'),
        cmbCategoria: $('#mdlRiesgo').find('.cmbCategoria'),
        cmbFuente: $('#mdlRiesgo').find('.cmbFuente'),
        txtDescripcionRiesgo: $('#mdlRiesgo').find('.txtDescripcionRiesgo'),
        txtDescripcionEfecto: $('#mdlRiesgo').find('.txtDescripcionEfecto'),
        txtCausas: $('#mdlRiesgo').find('.txtCausas'),
        txtEventoMaterializacion: $('#mdlRiesgo').find('.txtEventoMaterializacion'),
        /////
        cmbImpacto: $('#mdlRiesgo').find('.cmbImpacto'),
        cmbProbabilidad: $('#mdlRiesgo').find('.cmbProbabilidad'),
        lblCalificacion: $('#mdlRiesgo').find('.lblCalificacion'),
        lblSeveridad: $('#mdlRiesgo').find('.lblSeveridad'),
        /////
        divProyecto: $('#mdlRiesgo').find('.riesgo-proyecto'),
        btnNuevaEstrategia: $('#mdlRiesgo').find('.btnNuevaEstrategia'),
        dtEstrategias: $('#mdlRiesgo').find('.dtEstrategias'),
        cmbEstrategia: $('#mdlEstrategia').find('.cmbEstrategia'),
        cmbResponsable: $('#mdlEstrategia').find('.cmbResponsable'),
        txtPlanMitigacion: $('#mdlEstrategia').find('.txtPlanMitigacion'),
        txtDisparadorPlan: $('#mdlEstrategia').find('.txtDisparadorPlan'),
        dateFechaIdentificacionEstrategia: $('#mdlEstrategia').find('.dateFechaIdentificacionEstrategia'),
        chkRealizada: $('#mdlEstrategia').find('.chkRealizada'),
        btnGuardarEstrategia: $('#mdlEstrategia').find('.btnGuardarEstrategia'),
        /////
        chkActivo: $('#mdlRiesgo').find('.chkActivo'),
        btnVerComentarios: $('#mdlRiesgo').find('.btnVerComentarios'),
        divSeguimiento: $('#mdlRiesgo').find('.div-Seguimiento'),
        divNoRiesgo: $('#mdlRiesgo').find('.divNoRiesgo'),
        /////
        documento: $(document)
    },
    Constantes: {
        colEstrategias: [
            {
                "data": "Estrategia",
                "class": "text-left",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "PlanMitigacion",
                "class": "text-left",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "Responsable",
                "class": "text-left",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "DisparadorPlan",
                "class": "text-left",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "FechaIdentificacion",
                "class": "text-right",
                "render": data => moment(data).format("DD-MM-YYYY")
            },
            {
                "class": "text-center th-xsmall",
                "render": () => '<button class="btn modulo-riesgos btnEditarEstrategia"><i class="fa fa-edit"></i></button>'
            },
        ],
        urlLeerCombos: $('#mdlRiesgo').find('#LeerCombos').val(),
        urlLeerComboUsuarios: $('#mdlRiesgo').find('#LeerComboUsuarios').val(),
        urlCrearRiesgo: $('#mdlRiesgo').find('#CrearRiesgo').val(),
        urlEditarRiesgo: $('#mdlRiesgo').find('#EditarRiesgo').val(),
        urlCrearProyectoRiesgo: $('#mdlRiesgo').find('#CrearProyectoRiesgo').val(),
        urlEditarProyectoRiesgo: $('#mdlRiesgo').find('#EditarProyectoRiesgo').val(),
        urlLeerRiesgoPorId: $('#mdlRiesgo').find('#LeerRiesgoPorId').val(),
        urlLeerProyectoRiesgoPorId: $('#mdlRiesgo').find('#LeerProyectoRiesgoPorId').val(),
        urlLeerEstrategia: $('#mdlEstrategia').find('#LeerEstrategia').val(),
        urlLeerEstrategiaPorId: $('#mdlEstrategia').find('#LeerEstrategiaPorId').val(),
        urlCrearEstrategia: $('#mdlEstrategia').find('#CrearEstrategia').val(),
        urlEditarEstrategia: $('#mdlEstrategia').find('#EditarEstrategia').val(),
    },
    Eventos: {
        InicializaEventos: () => {
          /*  Riesgo.Variables.dtEstrategias = inicializaTabla(Riesgo.Controles.dtEstrategias, [], Riesgo.Constantes.colEstrategias);*/
            Riesgo.Controles.cmbImpacto.change(Riesgo.Funciones.CalcularSeveridad);
            Riesgo.Controles.cmbProbabilidad.change(Riesgo.Funciones.CalcularSeveridad);
            Riesgo.Controles.btnGuardar.click(Riesgo.Funciones.CickBtnGuardar);
            Riesgo.Controles.btnVerComentarios.click(Riesgo.Funciones.ClickBtnVerComentarios);
            Riesgo.Controles.btnNuevaEstrategia.click(Riesgo.Funciones.ClickBtnNuevaEstrategia);
            Riesgo.Controles.btnGuardarEstrategia.click(Riesgo.Funciones.ClickBtnGuardarEstrategia);
            Riesgo.Controles.mdlEstrategia.on('hidden.bs.modal', Riesgo.Funciones.CerrarModalEstrategia);
            Riesgo.Controles.documento.on('click', '.modulo-riesgos.btnEditarEstrategia', Riesgo.Funciones.LeerEstrategiaPorId);
        }
    },
    Funciones: {
        LeerEstrategias: async () => {
            const data =
                await POST(
                    Riesgo.Constantes.urlLeerEstrategia,
                    { idProyectoRiesgo: Riesgo.Variables.idRiesgo },
                    false);

            if (data.Exito) {
                Riesgo.Variables.dtEstrategias =
                    inicializaTabla(Riesgo.Controles.dtEstrategias, data.Estrategias, Riesgo.Constantes.colEstrategias);
                return data;
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickBtnGuardarEstrategia: async e => {
            e.preventDefault();
            e.stopPropagation();

            try {
                const mensaje = ValidaCamposRequeridos('.RequeridoEstrategia');
                if (mensaje.length === 0) {
                    const estrategia = {
                        IdProyectoRiesgoEstrategia: Riesgo.Variables.idEstrategia,
                        IdProyectoRiesgo: Riesgo.Variables.idRiesgo,
                        CatalogoEstrategiaId: Riesgo.Controles.cmbEstrategia.val(),
                        PlanMitigacion: Riesgo.Controles.txtPlanMitigacion.val(),
                        IdUResponsable: Riesgo.Controles.cmbResponsable.val(),
                        DisparadorPlan: Riesgo.Controles.txtDisparadorPlan.val(),
                        FechaIdentificacion: Riesgo.Controles.dateFechaIdentificacionEstrategia.val(),
                        Realizada: Riesgo.Controles.chkRealizada.prop('checked')
                    }

                    const data = await POST(
                        Riesgo.Variables.idEstrategia === 0 ?
                            Riesgo.Constantes.urlCrearEstrategia :
                            Riesgo.Constantes.urlEditarEstrategia,
                        estrategia,
                        false);

                    if (data.Exito) {
                        MensajeExito(data.Mensaje);
                        await Riesgo.Funciones.LeerEstrategias();

                        Riesgo.Controles.mdlEstrategia.modal('hide');
                        Riesgo.Controles.mdlRiesgo.modal('show');
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                } else {
                    MensajeAdvertencia(mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        CerrarModalEstrategia: () => {
            Riesgo.Controles.mdlEstrategia.modal('hide');
            Riesgo.Controles.mdlRiesgo.modal('show');
        },
        ClickBtnNuevaEstrategia: async e => {
            e.preventDefault();
            Riesgo.Funciones.LimpiarModalEstrategia();

            const usuarios = await Riesgo.Funciones.LeerUsuario();
            const estrategia = await Riesgo.Funciones.LeerComboEstrategia();
            if (!usuarios || !estrategia) return;

            Riesgo.Controles.mdlRiesgo.modal('hide');
            Riesgo.Controles.mdlEstrategia.modal('show');
        },
        LeerEstrategiaPorId: async e => {
            e.preventDefault();
            Riesgo.Funciones.LimpiarModalEstrategia();

            const usuarios = await Riesgo.Funciones.LeerUsuario();
            const estrategia = await Riesgo.Funciones.LeerComboEstrategia();
            if (!usuarios || !estrategia) return;

            const id = ObtenerData(Riesgo.Variables.dtEstrategias, e).IdProyectoRiesgoEstrategia;
            Riesgo.Variables.idEstrategia = id;
            const data = await POST(Riesgo.Constantes.urlLeerEstrategiaPorId, { IdProyectoRiesgoEstrategia: id });
            if (data.Exito) {
                const estrategia = data.Estrategia;
                Riesgo.Controles.cmbEstrategia.val(estrategia.CatalogoEstrategiaId);
                Riesgo.Controles.txtPlanMitigacion.val(estrategia.PlanMitigacion);
                Riesgo.Controles.cmbResponsable.val(estrategia.IdUResponsable);
                Riesgo.Controles.txtDisparadorPlan.val(estrategia.DisparadorPlan);
                Riesgo.Controles.dateFechaIdentificacionEstrategia.val(moment(estrategia.FechaIdentificacion).format("YYYY-MM-DD"));
                Riesgo.Controles.chkRealizada.prop('checked', estrategia.Realizada);

                Riesgo.Controles.mdlRiesgo.modal('hide');
                Riesgo.Controles.mdlEstrategia.modal('show');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LimpiarModalEstrategia: () => {
            Riesgo.Controles.cmbEstrategia.val('');
            Riesgo.Controles.txtPlanMitigacion.val('');
            Riesgo.Controles.cmbResponsable.val('');
            Riesgo.Controles.txtDisparadorPlan.val('');
            Riesgo.Controles.dateFechaIdentificacionEstrategia.val('');
            Riesgo.Controles.chkRealizada.prop('checked', false);
        },
        ClickBtnVerComentarios: e => {
            e.preventDefault();
            Riesgo.Variables.ModalAbierto = true;
            RiesgoComentarios.Funciones.MostrarComentarios(Riesgo.Variables.idRiesgo);
        },
        NuevoRiesgo: async (idProyecto = 0) => {
            Riesgo.Funciones.LimpiarModal(0, idProyecto);
            const combosTask = Riesgo.Funciones.LeerCombos();

            if (idProyecto !== 0) {
                const usuariosTask = Riesgo.Funciones.LeerUsuario();
                const usuarios = await usuariosTask;
                if (!usuarios) return;
            }

            const combos = await combosTask;

            if (!combos) return;
            // eslint-disable-next-line

            Riesgo.Controles.mdlRiesgo.modal('show');
        },
        EditarRiesgo: async (idRiesgo, idProyecto = 0) => {
            Riesgo.Funciones.LimpiarModal(idRiesgo, idProyecto);
            const combosAsync = Riesgo.Funciones.LeerCombos();
            const dataAsync = idProyecto === 0 ? Riesgo.Funciones.LeerRiesgoPorId(idRiesgo) : Riesgo.Funciones.LeerProyectoRiesgoPorId(idRiesgo);

            //if (idProyecto !== 0) {
            //    const usuariosTask = Riesgo.Funciones.LeerUsuario();
            //    const usuarios = await usuariosTask;
            //    if (!usuarios) return;
            //}

            const combos = await combosAsync;
            const riesgo = await dataAsync;
            if (!combos || !riesgo) return;

            // eslint-disable-next-line
            Riesgo.Controles.lblNoRiesgo.text(riesgo.NoRiesgo);
            Riesgo.Controles.dateFechaIdentificacion.val(moment(riesgo.FechaIdentificacion).format("YYYY-MM-DD"));
            Riesgo.Controles.cmbCategoria.val(riesgo.CatalogoCategoriaId);
            Riesgo.Controles.cmbFuente.val(riesgo.CatalogoFuenteId);
            Riesgo.Controles.txtDescripcionRiesgo.val(riesgo.DescripcionRiesgo);
            Riesgo.Controles.txtDescripcionEfecto.val(riesgo.DescripcionEfecto);
            Riesgo.Controles.txtCausas.val(riesgo.Causas);
            Riesgo.Controles.txtEventoMaterializacion.val(riesgo.EventoMaterializacion);
            Riesgo.Controles.cmbImpacto.val(riesgo.IdRiesgoImpacto).trigger('change');
            Riesgo.Controles.cmbProbabilidad.val(riesgo.IdRiesgoProbabilidad).trigger('change');
            if (Riesgo.Variables.idProyecto) {
                Riesgo.Controles.cmbEstrategia.val(riesgo.CatalogoEstrategiaId);
                Riesgo.Controles.txtPlanMitigacion.val(riesgo.PlanMitigacion);
                if (riesgo.IdUResponsable !== -1) Riesgo.Controles.cmbResponsable.val(riesgo.IdUResponsable);
                Riesgo.Controles.txtDisparadorPlan.val(riesgo.DisparadorPlan);
            }
            Riesgo.Controles.chkActivo.prop('checked', riesgo.Activo)

            const estrategias = await Riesgo.Funciones.LeerEstrategias();
            if (!estrategias) return;

            Riesgo.Controles.mdlRiesgo.modal('show');
        },
        LeerRiesgoPorId: async idRiesgo => {
            try {
                const data = await POST(Riesgo.Constantes.urlLeerRiesgoPorId, { idRiesgo });

                if (data.Exito) {
                    return data.Riesgo;
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        LeerProyectoRiesgoPorId: async idProyectoRiesgo => {
            try {
                const data = await POST(Riesgo.Constantes.urlLeerProyectoRiesgoPorId, { idProyectoRiesgo });

                if (data.Exito) {
                    return data.Riesgo;
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        CickBtnGuardar: e => {
            e.preventDefault();
            e.stopPropagation();

            Riesgo.Funciones.CrearRiesgo();
        },
        CrearRiesgo: async () => {
            try {
                const mensaje = ValidaCamposRequeridos('.RequeridoRiesgo');

                if (mensaje.length === 0) {
                    let data;
                    if (Riesgo.Variables.idProyecto === 0) {
                        data = await POST(Riesgo.Variables.idRiesgo > 0 ? Riesgo.Constantes.urlEditarRiesgo : Riesgo.Constantes.urlCrearRiesgo,
                            {
                                IdRiesgo: Riesgo.Variables.idRiesgo,
                                FechaIdentificacion: Riesgo.Controles.dateFechaIdentificacion.val(),
                                CatalogoCategoriaId: Riesgo.Controles.cmbCategoria.val(),
                                CatalogoFuenteId: Riesgo.Controles.cmbFuente.val(),
                                DescripcionRiesgo: Riesgo.Controles.txtDescripcionRiesgo.val(),
                                DescripcionEfecto: Riesgo.Controles.txtDescripcionEfecto.val(),
                                Causas: Riesgo.Controles.txtCausas.val(),
                                EventoMaterializacion: Riesgo.Controles.txtEventoMaterializacion.val(),
                                IdRiesgoImpacto: Riesgo.Controles.cmbImpacto.val(),
                                IdRiesgoProbabilidad: Riesgo.Controles.cmbProbabilidad.val(),
                                Activo: Riesgo.Controles.chkActivo.prop('checked')
                            });
                    } else {
                        data = await POST(Riesgo.Variables.idRiesgo > 0 ? Riesgo.Constantes.urlEditarProyectoRiesgo : Riesgo.Constantes.urlCrearProyectoRiesgo,
                            {
                                idProyectoRiesgo: Riesgo.Variables.idRiesgo,
                                IdProyecto: Riesgo.Variables.idProyecto,
                                FechaIdentificacion: Riesgo.Controles.dateFechaIdentificacion.val(),
                                CatalogoCategoriaId: Riesgo.Controles.cmbCategoria.val(),
                                CatalogoFuenteId: Riesgo.Controles.cmbFuente.val(),
                                DescripcionRiesgo: Riesgo.Controles.txtDescripcionRiesgo.val(),
                                DescripcionEfecto: Riesgo.Controles.txtDescripcionEfecto.val(),
                                Causas: Riesgo.Controles.txtCausas.val(),
                                EventoMaterializacion: Riesgo.Controles.txtEventoMaterializacion.val(),
                                IdRiesgoImpacto: Riesgo.Controles.cmbImpacto.val(),
                                IdRiesgoProbabilidad: Riesgo.Controles.cmbProbabilidad.val(),
                                Activo: Riesgo.Controles.chkActivo.prop('checked')
                            });
                    }

                    if (data.Exito) {
                        // eslint-disable-next-line
                        Riesgo.Variables.Actualizacion.actualizar = true;
                        MensajeExito(data.Mensaje);
                        if (Riesgo.Variables.idRiesgo === 0 && Riesgo.Variables.idProyecto === 0) {
                            Riesgo.Controles.mdlRiesgo.modal('hide');
                        }
                        if (Riesgo.Variables.idRiesgo === 0 && Riesgo.Variables.idProyecto !== 0) {
                            Riesgo.Funciones.EditarRiesgo(data.IdRiesgo, Riesgo.Variables.idProyecto);
                        }
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                } else {
                    MensajeAdvertencia(mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        CalcularSeveridad: () => {
            const impacto = Riesgo.Controles.cmbImpacto.find(':selected').data('especial') ?? 0;
            const probabilidad = Riesgo.Controles.cmbProbabilidad.find(':selected').data('especial') ?? 0;
            const calificacion = impacto * probabilidad;

            if (calificacion !== 0) {
                Riesgo.Controles.lblCalificacion.text(calificacion);
                const severidad = Riesgo.Variables.Severidad.filter(x => calificacion >= x.Minimo && calificacion <= x.Maximo)[0];
                const letra = InvertirColor(severidad.Color, true);
                Riesgo.Controles.lblSeveridad.text(severidad.Severidad);
                Riesgo.Controles.lblSeveridad.addClass('badge');
                Riesgo.Controles.lblSeveridad.css({ 'background-color': severidad.Color, 'color': letra, 'border': '1px solid ' + letra });
            } else {
                Riesgo.Controles.lblCalificacion.text('');
                Riesgo.Controles.lblSeveridad.text('');
                Riesgo.Controles.lblSeveridad.removeClass('badge');
                Riesgo.Controles.lblSeveridad.css({ 'background-color': '', 'color': '', 'border': '' });
            }
        },
        LeerComboEstrategia: async () => {
            try {
                const data = await POST(Riesgo.Constantes.urlLeerCombos, {}, false);

                if (data.Exito) {
                    Riesgo.Controles.cmbEstrategia.empty().append(data.CmbEstrategia);
                    return data;
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        LeerCombos: async () => {
            try {
                const data = await POST(Riesgo.Constantes.urlLeerCombos, {}, false);

                if (data.Exito) {
                    Riesgo.Controles.cmbCategoria.empty().append(data.CmbCategoria);
                    Riesgo.Controles.cmbFuente.empty().append(data.CmbFuente);
                    Riesgo.Controles.cmbImpacto.empty().append(data.CmbImpacto);
                    Riesgo.Controles.cmbProbabilidad.empty().append(data.CmbProbabilidad);
                    Riesgo.Controles.cmbEstrategia.empty().append(data.CmbEstrategia);
                    // eslint-disable-next-line
                    Riesgo.Variables.Severidad = data.Severidad;
                    return data;
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        LeerUsuario: async () => {
            try {
                const data = await POST(Riesgo.Constantes.urlLeerComboUsuarios, { idProyecto: Riesgo.Variables.idProyecto }, false);

                if (data.Exito) {
                    Riesgo.Controles.cmbResponsable.empty().append(data.CmbResponsable);

                    return data;
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        Init: () => {
            Riesgo.Eventos.InicializaEventos();
        },
        LimpiarModal: (idRiesgo, idProyecto) => {
            Riesgo.Variables.idRiesgo = idRiesgo;
            Riesgo.Variables.idProyecto = idProyecto;
            Riesgo.Controles.lblNoRiesgo.text('');
            Riesgo.Controles.dateFechaIdentificacion.val('');
            Riesgo.Controles.cmbCategoria.val('-1');
            Riesgo.Controles.cmbFuente.val('-1');
            Riesgo.Controles.txtDescripcionRiesgo.val('');
            Riesgo.Controles.txtDescripcionEfecto.val('');
            Riesgo.Controles.txtCausas.val('');
            Riesgo.Controles.txtEventoMaterializacion.val('');
            Riesgo.Controles.cmbImpacto.val('-1').trigger('change');
            Riesgo.Controles.cmbProbabilidad.val('-1').trigger('change');
            if (idProyecto !== 0 && idRiesgo !== 0) {
                Riesgo.Controles.divProyecto.removeClass('hidden');
                Riesgo.Controles.cmbEstrategia.val('-1').addClass('RequeridoEstrategia');
                Riesgo.Controles.txtPlanMitigacion.val('').addClass('RequeridoEstrategia');
                Riesgo.Controles.txtDisparadorPlan.val('').addClass('RequeridoEstrategia');
                Riesgo.Controles.cmbResponsable.val('-1').addClass('RequeridoEstrategia');
            } else {
                Riesgo.Controles.divProyecto.addClass('hidden');
                Riesgo.Controles.cmbEstrategia.val('-1').removeClass('RequeridoEstrategia');
                Riesgo.Controles.txtPlanMitigacion.val('').removeClass('RequeridoEstrategia');
                Riesgo.Controles.txtDisparadorPlan.val('').removeClass('RequeridoEstrategia');
                Riesgo.Controles.cmbResponsable.val('-1').removeClass('RequeridoEstrategia');
            }
            if (idRiesgo !== 0) {
                Riesgo.Controles.divSeguimiento.removeClass('hidden');
                Riesgo.Controles.divNoRiesgo.removeClass('hidden');
            } else {
                Riesgo.Controles.divSeguimiento.addClass('hidden');
                Riesgo.Controles.divNoRiesgo.addClass('hidden');
            }
            Riesgo.Controles.chkActivo.prop('checked', true);
        }
    },
    Variables: {
        idProyecto: parseInt($('IdProyecto').val() ?? '0'),
        idEstrategia: 0,
        idRiesgo: 0,
        Severidad: [],
        ModalAbierto: false,
        dtEstrategias: null,
        Actualizacion: {
            actualizar: false
        }
    }
}

var RiesgoComentarios = {
    Controles: {
        mdlRiesgo: $('#mdlRiesgo'),
        mdlComentarios: $('#mdlRiesgoComentarios'),
        txtComentario: $('#mdlRiesgoComentarios').find('.txtComentario'),
        titulo: $('#mdlRiesgoComentarios').find('.modal-title'),
        btnAgregarComentario: $('#mdlRiesgoComentarios').find('.btnAgregarComentario'),
        divMensajes: $('#mdlRiesgoComentarios').find('.divMensajes'),
        chkMostrarHistorico: $('#mdlRiesgoComentarios').find('.chkMostrarHistorico'),
    },
    Constantes: {
        urlLeerRiesgoComentario: () => RiesgoComentarios.Controles.mdlComentarios.find('#LeerRiesgoComentario').val(),
        urlCrearRiesgoComentario: () => RiesgoComentarios.Controles.mdlComentarios.find('#CrearRiesgoComentario').val(),
        urlEliminarRiesgoComentario: () => RiesgoComentarios.Controles.mdlComentarios.find('#EliminarRiesgoComentario').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            RiesgoComentarios.Controles.btnAgregarComentario.click(RiesgoComentarios.Funciones.CrearRiesgoComentario);
            RiesgoComentarios.Controles.chkMostrarHistorico.click(RiesgoComentarios.Funciones.MostrarHistorico);
            RiesgoComentarios.Controles.mdlComentarios.on('hidden.bs.modal', RiesgoComentarios.Funciones.CerrarModalComentarios);
        }
    },
    Funciones: {
        CerrarModalComentarios: () => {
            if (Riesgo.Variables.ModalAbierto)
                RiesgoComentarios.Controles.mdlRiesgo.modal('show');
            RiesgoComentarios.Controles.mdlComentarios.modal('hide');
            Riesgo.Variables.ModalAbierto = false;
        },
        MostrarHistorico: () => {
            if (RiesgoComentarios.Controles.chkMostrarHistorico.prop('checked')) {
                $('.comentario-container').not('.autogenerado').addClass('hidden');
            } else {
                $('.comentario-container').removeClass('hidden');
            }
        },
        MostrarComentarios: id => {
            RiesgoComentarios.Funciones.LeerRiesgoComentario(id);
        },
        CrearRiesgoComentario: async e => {
            try {
                e.stopPropagation();
                const mensaje = ValidaCamposRequeridos('#mdlRiesgoComentarios.RequeridoComentario');

                if (mensaje.length === 0) {
                    const id = RiesgoComentarios.Variables.IdRiesgo;
                    const comentario = RiesgoComentarios.Controles.txtComentario.val();

                    const data = await POST(RiesgoComentarios.Constantes.urlCrearRiesgoComentario(),
                        {
                            comentario: {
                                IdProyectoRiesgo: id,
                                Comentario: comentario
                            }
                        },
                        false
                    );

                    if (data.Exito) {
                        MensajeExito(data.Mensaje);
                        await RiesgoComentarios.Funciones.LeerRiesgoComentario(id, false);
                        // eslint-disable-next-line
                        RiesgoComentarios.Variables.Actualizacion.actualizar = true;
                        RiesgoComentarios.Controles.txtComentario.val('');
                        RiesgoComentarios.Controles.divMensajes.animate({ scrollTop: RiesgoComentarios.Controles.divMensajes.prop("scrollHeight") }, 500);
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
        LeerRiesgoComentario: async (id, loading = true) => {
            try {
                const data = await POST(RiesgoComentarios.Constantes.urlLeerRiesgoComentario(), { idRiesgo: id }, loading);
                if (data.Exito) {
                    // eslint-disable-next-line
                    RiesgoComentarios.Variables.IdRiesgo = id;
                    RiesgoComentarios.Controles.titulo.text(data.NoRiesgo);
                    const comentarios = RiesgoComentarios.Funciones.DibujarComentarios(data.Comentarios);
                    RiesgoComentarios.Controles.divMensajes.empty().append(comentarios);
                    RiesgoComentarios.Funciones.BindEmiminar();
                    RiesgoComentarios.Controles.mdlRiesgo.modal('hide');
                    RiesgoComentarios.Controles.mdlComentarios.modal('show');
                    RiesgoComentarios.Controles.divMensajes.animate({ scrollTop: RiesgoComentarios.Controles.divMensajes.prop("scrollHeight") }, 650);
                    RiesgoComentarios.Funciones.MostrarHistorico();
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
                    `<div class="${c.Autogenerado ? 'autogenerado' : ''} comentario-container ${i === 0 ? 'first' : ''}">
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
                        ${c.Autogenerado ? '' : `<button class="btnTooltip abajo fa fa-trash hidden btnEliminarComentario" data-id="${c.IdProyectoRiesgoComentario}"></button>`}
                     </div> `
            });

            return html;
        },
        BindEmiminar: () => {
            $('.comentario-container').hover(RiesgoComentarios.Funciones.MostrarBtnEliminar, RiesgoComentarios.Funciones.OcultarBtnEliminar);
            $('.btnEliminarComentario').click(RiesgoComentarios.Funciones.EliminarRiesgoComentario)
        },
        EliminarRiesgoComentario: async e => {
            try {
                e.stopPropagation();
                const id = $(e.target).data('id');
                const data = await POST(RiesgoComentarios.Constantes.urlEliminarRiesgoComentario(), { idRiesgoComentario: id }, false);

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    // eslint-disable-next-line
                    RiesgoComentarios.Variables.Actualizacion.actualizar = true;
                    RiesgoComentarios.Funciones.LeerRiesgoComentario(RiesgoComentarios.Variables.IdRiesgo, false);
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
            RiesgoComentarios.Eventos.InicializaEventos();
        }
    },
    Variables: {
        IdRiesgo: 0,
        Actualizacion: {
            actualizar: false
        }
    }
}

Riesgo.Funciones.Init();
RiesgoComentarios.Funciones.Init();