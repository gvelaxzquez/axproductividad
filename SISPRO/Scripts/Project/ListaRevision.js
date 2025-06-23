const ListaRevisionProyecto = {
    Controles: {
        dtPeerReview: $('#modulo-revision').find('.dtPeerReview'),
        btnNuevo: $('#modulo-revision').find('.btnNuevo'),
        btnCopiar: $('#modulo-revision').find('.btnCopiar'),
        btnImportar: $('#modulo-revision').find('.btnImportar'),
        documento: $(document)
    },
    Constantes: {
        colListaControl: [
            {
                "data": "Nombre",
                "class": "text-left"
            },
            {
                "data": "Fase.DescLarga",
                "class": "text-left"
            },
            {
                "data": "Clasificacion.DescLarga",
                "class": "text-left"
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm modulo-revision btnEditar"><i class="fa fa-edit"></i></button>'
            },
            {
                "data": "Activo",
                "class": "text-center",
                "render": data => `<label class="switch switch-small"><input type="checkbox" class="modulo-revision chkActivar" ${data ? "checked" : ""}/><span></span></label>`
            }
        ],
        urlLeer: $('#LeerListaRevision').val(),
        urlActivar: $('#ActivarListaRevision').val(),
    },
    Eventos: {
        InicializaEventos: function () {
            ListaRevisionProyecto.Controles.btnNuevo.off('click').click(ListaRevisionProyecto.Funciones.Nuevo);
            ListaRevisionProyecto.Controles.btnCopiar.off('click').click(ListaRevisionProyecto.Funciones.Copiar);
            ListaRevisionProyecto.Controles.btnImportar.off('click').click(ListaRevisionProyecto.Funciones.Importar);
            ListaRevisionProyecto.Controles.documento.off('click', '.modulo-revision.btnEditar').on('click', '.modulo-revision.btnEditar', ListaRevisionProyecto.Funciones.Editar);
            ListaRevisionProyecto.Controles.documento.off('click', '.modulo-revision.chkActivar').on('click', '.modulo-revision.chkActivar', ListaRevisionProyecto.Funciones.Activar);
        }
    },
    Funciones: {
        Nuevo: e => {
            e.preventDefault();

            ListaRevision.Funciones.Nuevo(ListaRevisionProyecto.Variables.idProyecto);
        },
        Copiar: e => {
            e.preventDefault();

            ListaRevisionCopiar.Funciones.ModalCopiar(ListaRevisionProyecto.Variables.idProyecto);
        },
        Editar: e => {
            e.preventDefault();

            const id = ObtenerData(ListaRevisionProyecto.Variables.dtPeerReview, e).IdListaRevision;
            ListaRevision.Funciones.Editar(ListaRevisionProyecto.Variables.idProyecto, id);
        },
        Importar: e => {
            e.preventDefault();

            ListaRevisionImportar.Funciones.ModalImportar(ListaRevisionProyecto.Variables.idProyecto);
        },
        Activar: async e => {
            const idListaRevision = ObtenerData(ListaRevisionProyecto.Variables.dtPeerReview, e).IdListaRevision;

            const data = await POST(ListaRevisionProyecto.Constantes.urlActivar,
                {
                    IdListaRevision: idListaRevision,
                    Activo: $(e.target).prop('checked')
                },
                false
            );

            if (data.Exito) {
                MensajeExito(data.Mensaje);
            } else {
                $(e.target).prop('checked', !$(e.target).prop('checked'))
                MensajeAdvertencia(data.Mensaje);
            }
        },
        Init: () => {
            ListaRevisionProyecto.Variables.idProyecto = parseInt($('#IdProyecto').val());
            ListaRevisionProyecto.Eventos.InicializaEventos();
            ListaRevisionProyecto.Variables.Actualizacion.MonitorearCambios();
            ListaRevisionProyecto.Funciones.LeerListaRevision();
        },
        LeerListaRevision: async (load = true) => {
            const data =
                await POST(
                    ListaRevisionProyecto.Constantes.urlLeer,
                    { idProyecto: ListaRevisionProyecto.Variables.idProyecto },
                    load);

            if (data.Exito) {
                // eslint-disable-next-line
                ListaRevisionProyecto.Variables.dtPeerReview =
                    InicializaTabla({
                        tabla: ListaRevisionProyecto.Controles.dtPeerReview,
                        datos: data.ListasRevision,
                        columnas: ListaRevisionProyecto.Constantes.colListaControl,
                        nonOrderableColumns: [3]
                    });
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        }
    },
    Variables: {
        dtPeerReview: null,
        idProyecto: 0,
        Actualizacion: {
            MonitorearCambios: () => {
                ListaRevision.Variables.Actualizacion =
                    new Proxy(ListaRevision.Variables.Actualizacion, ListaRevisionProyecto.Variables.Actualizacion.handler);
                ListaRevisionCopiar.Variables.Actualizacion =
                    new Proxy(ListaRevisionCopiar.Variables.Actualizacion, ListaRevisionProyecto.Variables.Actualizacion.handler);
                ListaRevisionImportar.Variables.Actualizacion =
                    new Proxy(ListaRevisionImportar.Variables.Actualizacion, ListaRevisionProyecto.Variables.Actualizacion.handler);
            },
            handler: {
                set(target, property, value) {
                    target[property] = value;
                    ListaRevisionProyecto.Funciones.LeerListaRevision(false);
                }
            }
        }
    }
}

const ListaRevisionImportar = {
    Controles: {
        mdlImportar: $('#mdlImportarListaRevision'),
        btnImportar: $('#mdlImportarListaRevision').find('.btnImportar'),
        chkTipo: $('#mdlImportarListaRevision').find('[name="TipoCarga"]'),
        fileImportar: $('#mdlImportarListaRevision').find('.fileImportar')
    },
    Constantes: {
        urlImportar: $('#ImportarListaRevision').val(),
    },
    Eventos: {
        InicializaEventos: function () {
            ListaRevisionImportar.Controles.btnImportar.off('click').click(ListaRevisionImportar.Funciones.Importar);
        }
    },
    Funciones: {
        Importar: async e => {
            e.preventDefault();

            let form = new FormData();
            form.append('idProyecto', ListaRevisionImportar.Variables.idProyecto);
            form.append('archivo', ListaRevisionImportar.Controles.fileImportar[0].files[0]);
            form.append('tipoCarga', ListaRevisionImportar.Controles.chkTipo.filter(':checked').val());

            const data = await POST(
                ListaRevisionImportar.Constantes.urlImportar,
                form,
                true,
                true
            );

            if (data.Exito) {
                MensajeExito(data.Mensaje);
                // eslint-disable-next-line
                ListaRevisionImportar.Controles.fileImportar[0].value = '';
                $('.file-input-name').text('');
                $('#rdoCarga').prop('checked', true);
                ListaRevisionImportar.Variables.Actualizacion.actualizar = true;
                ListaRevisionImportar.Controles.mdlImportar.modal('hide');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ModalImportar: async (idProyecto) => {
            ListaRevisionImportar.Funciones.Init();
            ListaRevisionImportar.Variables.idProyecto = idProyecto;
            ListaRevisionImportar.Controles.mdlImportar.modal('show');
        },
        Init: async () => {
            ListaRevisionImportar.Eventos.InicializaEventos();
        },
    },
    Variables: {
        idProyecto: 0,
        Actualizacion: {
            actualizar: false
        }
    }
}

const ListaRevisionCopiar = {
    Controles: {
        mdlCopiar: $('#mdlCopiarListaRevision'),
        dtListaRevision: $('#mdlCopiarListaRevision').find('.dtListaRevision'),
        cmbProyecto: $('#mdlCopiarListaRevision').find('.cmbProyecto'),
        chkTodos: $('#mdlCopiarListaRevision').find('.chkTodos'),
        btnGuardar: $('#mdlCopiarListaRevision').find('.btnGuardar'),
        documento: $(document)
    },
    Constantes: {
        colListaRevision: [
            {
                "data": "IdListaRevision",
                "class": "text-center",
                "render": data => `<input class="modulo-revision chkLista" data-idrevision=${data} type="checkbox" />`
            },
            {
                "data": "Nombre",
                "class": "text-left"
            },
        ],
        urlLeerProyectos: $('#mdlCopiarListaRevision').find('#LeerComboProyecto').val(),
        urlLeer: $('#LeerListaRevision').val(),
        urlCopiar: $('#CopiarListaRevisionDetalle').val(),
    },
    Eventos: {
        InicializaEventos: function () {
            ListaRevisionCopiar.Funciones.InicializaTabla();
            ListaRevisionCopiar.Controles.cmbProyecto.off('change').change(ListaRevisionCopiar.Funciones.LeerListasRevision);
            ListaRevisionCopiar.Controles.btnGuardar.off('click').click(ListaRevisionCopiar.Funciones.Copiar);
            ListaRevisionCopiar.Controles.chkTodos.off('click').click(ListaRevisionCopiar.Funciones.SeleccionarTodos);
            ListaRevisionCopiar.Controles.documento.off('click', '.modulo-revision.chkLista').on('click', '.modulo-revision.chkLista', ListaRevisionCopiar.Funciones.SeleccionarRevision);
        }
    },
    Funciones: {
        Copiar: async e => {
            e.preventDefault();

            const ids =
                ListaRevisionCopiar.Variables.dtListaRevision
                    .api().rows().nodes().to$().find('.modulo-revision.chkLista').filter(':checked').toArray()
                    .map(x => $(x).data('idrevision'))

            if (ids.length === 0) {
                MensajeAdvertencia('No se ha seleccionado ningun registro.');
                return;
            }

            const data = await POST(ListaRevisionCopiar.Constantes.urlCopiar, {
                idProyecto: ListaRevisionCopiar.Variables.idProyecto,
                listasRevision: ids
            });

            if (data.Exito) {
                ListaRevisionCopiar.Variables.Actualizacion.actualizar = true;
                ListaRevisionCopiar.Controles.mdlCopiar.modal('hide');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        SeleccionarTodos: e => {
            $('.modulo-revision.chkLista').prop('checked', e.target.checked);
        },
        SeleccionarRevision: e => {
            ListaRevisionCopiar.Controles.chkTodos.prop('checked', $('.modulo-revision.chkLista').not(':checked').length === 0);
        },
        ModalCopiar: async (idProyecto) => {
            ListaRevisionCopiar.Funciones.Init();
            ListaRevisionCopiar.Variables.idProyecto = idProyecto;
            ListaRevisionCopiar.Controles.mdlCopiar.modal('show');
        },
        Init: async () => {
            ListaRevisionCopiar.Eventos.InicializaEventos();
            ListaRevisionCopiar.Funciones.LeerProyectos();
        },
        LeerProyectos: async () => {
            const data = await POST(ListaRevisionCopiar.Constantes.urlLeerProyectos, {}, false);

            if (data.Exito) {
                ListaRevisionCopiar.Controles.cmbProyecto.empty().append(data.CmbProyecto);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LeerListasRevision: async e => {
            const id = e.target.value;

            if (id !== '-1') {
                const data =
                    await POST(ListaRevisionCopiar.Constantes.urlLeer, { idProyecto: id }, false);

                if (data.Exito) {
                    // eslint-disable-next-line
                    ListaRevisionCopiar.Funciones.InicializaTabla(data.ListasRevision);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } else {
                ListaRevisionCopiar.Funciones.InicializaTabla();
            }
        },
        InicializaTabla: (datos = []) => {
            ListaRevisionCopiar.Variables.dtListaRevision =
                InicializaTabla({
                    tabla: ListaRevisionCopiar.Controles.dtListaRevision,
                    columnas: ListaRevisionCopiar.Constantes.colListaRevision,
                    datos: datos,
                    nonOrderableColumns: [0],
                    columnaOrdena: 1
                });
        }
    },
    Variables: {
        idProyecto: 0,
        dtListaRevision: null,
        Actualizacion: {
            actualizar: false
        }
    }
}

const ListaRevision = {
    Controles: {
        mdlListaRevision: $('#mdlListaRevision'),
        btnGuardar: $('#mdlListaRevision').find('.btnGuardar'),
        txtNombre: $('#mdlListaRevision').find('.txtNombre'),
        cmbProceso: $('#mdlListaRevision').find('.cmbProceso'),
        cmbSubproceso: $('#mdlListaRevision').find('.cmbSubproceso'),
        chkActivo: $('#mdlListaRevision').find('.chkActivo'),
        txtControl: $('#mdlListaRevision').find('.txtControl'),
        btnAgregarControl: $('#mdlListaRevision').find('.btnAgregarControl'),
        dtDetalle: $('#mdlListaRevision').find('.dtListaRevisionDetalle'),
        documento: $(document)
    },
    Constantes: {
        colDetalle: [
            {
                "data": "Control",
                "class": "text-left"
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm mdlListaRevision btnEditarDetalle"><i class="fa fa-edit"></i></button>'
            },
            {
                "data": "Activo",
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm mdlListaRevision btnEliminarDetalle"><i class="fa fa-trash"></i></button>'
            }
        ],
        urlLeerComboProceso: $('#LeerComboProceso').val(),
        urlLeerComboSubproceso: $('#LeerComboSubproceso').val(),
        urlCrear: $('#CrearListaRevision').val(),
        urlLeerPorId: $('#LeerListaRevisionPorId').val(),
        urlLeerDetalle: $('#LeerListaRevisionDetalle').val(),
        urlEditar: $('#EditarListaRevision').val(),
        urlGuardarDetalle: $('#GuardarListaRevisionDetalle').val(),
        urlEliminarControl: $('#EliminarListaControlDetalle').val(),
    },
    Eventos: {
        InicializaEventos: function () {
            ListaRevision.Controles.documento.off('click', '.mdlListaRevision.btnEditarDetalle').on('click', '.mdlListaRevision.btnEditarDetalle', ListaRevision.Funciones.EditarControl);
            ListaRevision.Controles.documento.off('click', '.mdlListaRevision.btnEliminarDetalle').on('click', '.mdlListaRevision.btnEliminarDetalle', ListaRevision.Funciones.EliminarControl);
            ListaRevision.Controles.btnAgregarControl.off('click').click(ListaRevision.Funciones.GuardarControl);
            ListaRevision.Controles.btnGuardar.off('click').click(ListaRevision.Funciones.Guardar);
            ListaRevision.Controles.cmbProceso.off('change').change(ListaRevision.Funciones.ChangeCmbProceso);
        }
    },
    Funciones: {
        LeerComboProceso: async () => {
            const data = await POST(ListaRevision.Constantes.urlLeerComboProceso, {}, false);

            if (data.Exito) {
                ListaRevision.Controles.cmbProceso.empty().append(data.CmbProceso);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ChangeCmbProceso: e => {
            const id = e.target.value;
            ListaRevision.Funciones.LeerComboSubproceso(id);
        },
        LeerComboSubproceso: async id => {
            if (id === '-1') {
                ListaRevision.Controles.cmbSubproceso.empty().append('<option value="-1">--Seleccionar--</option>');
            } else {
                const data = await POST(
                    ListaRevision.Constantes.urlLeerComboSubproceso,
                    { idProceso: id },
                    false
                );

                if (data.Exito) {
                    ListaRevision.Controles.cmbSubproceso.empty().append(data.CmbSubproceso);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            }
        },
        Nuevo: async (idProyecto) => {
            ListaRevision.Funciones.Init();

            const idLista = await ListaRevision.Funciones.Crear(idProyecto);
            if (idLista) {
                ListaRevision.Funciones.LimpiarModal(idProyecto, idLista);
                ListaRevision.Controles.mdlListaRevision.modal('show');
            }
        },
        Editar: async (idProyecto, idListaRevision) => {
            ListaRevision.Funciones.Init();

            ListaRevision.Funciones.LimpiarModal(idProyecto, idListaRevision);
            const exito = await ListaRevision.Funciones.LeerPorId(idListaRevision);
            if (exito)
                ListaRevision.Controles.mdlListaRevision.modal('show');
        },
        LeerPorId: async (idListaRevision) => {
            try {
                const data = await POST(ListaRevision.Constantes.urlLeerPorId, { idListaRevision });
                const detalle = await ListaRevision.Funciones.LeerDetalle();

                if (data.Exito && detalle) {
                    const peer = data.ListaRevision;

                    ListaRevision.Controles.txtNombre.val(peer.Nombre);
                    ListaRevision.Controles.cmbProceso.val(peer.CatalogoFaseId);
                    await ListaRevision.Funciones.LeerComboSubproceso(peer.CatalogoFaseId);
                    ListaRevision.Controles.cmbSubproceso.val(peer.CatalogoClasificacionId);
                    ListaRevision.Controles.chkActivo.prop('checked', peer.Activo);

                    return data.Exito;
                } else if (!data.Exito) {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.statusText);
            }
        },
        LeerDetalle: async () => {
            const idListaRevision = ListaRevision.Variables.idListaRevision;
            const data = await POST(ListaRevision.Constantes.urlLeerDetalle, { idListaRevision }, false);

            try {
                if (data.Exito) {
                    ListaRevision.Variables.dtDetalle =
                        InicializaTabla({
                            tabla: ListaRevision.Controles.dtDetalle,
                            datos: data.Detalle,
                            columnas: ListaRevision.Constantes.colDetalle,
                            nonOrderableColumns: [1, 2]
                        });
                    return data.Exito;
                } else {
                    MensajeAdvertencia(data.Exito ? data.Mensaje : detalle.Mensaje);
                }
            } catch (e) {
                MensajeError(e.statusText);
            }
        },
        Crear: async (idProyecto) => {
            try {
                const data = await POST(ListaRevision.Constantes.urlCrear, { idProyecto });

                if (data.Exito) {
                    return data.IdListaRevision;
                }
                else
                    MensajeAdvertencia(data.Mensaje);
            } catch (e) {
                MensajeError(e.statusText);
            }
        },
        Guardar: async e => {
            e.preventDefault();
            e.stopPropagation();

            let mensaje = ValidaCamposRequeridos('.RequeridoLR');
            if (mensaje.length > 0) {
                MensajeAdvertencia(mensaje);
                return;
            }

            const listaRevision = {
                IdProyecto: ListaRevision.Variables.idProyecto,
                IdListaRevision: ListaRevision.Variables.idListaRevision,
                Nombre: ListaRevision.Controles.txtNombre.val(),
                CatalogoFaseId: ListaRevision.Controles.cmbProceso.val(),
                CatalogoClasificacionId: ListaRevision.Controles.cmbSubproceso.val(),
                Activo: ListaRevision.Controles.chkActivo.prop('checked')
            };

            try {
                const data = await POST(
                    ListaRevision.Constantes.urlEditar,
                    { listaRevision }
                );

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    ListaRevision.Variables.Actualizacion.actualizar = true;
                }
                else
                    MensajeAdvertencia(data.Mensaje);
            } catch (e) {
                MensajeError(e.statusText);
            }
        },
        LimpiarModal: (idProyecto, idListaRevision) => {
            ListaRevision.Variables.idProyecto = idProyecto;
            ListaRevision.Variables.idListaRevision = idListaRevision;
            ListaRevision.Controles.txtNombre.val('');
            ListaRevision.Controles.cmbProceso.val('-1');
            ListaRevision.Controles.cmbSubproceso.val('-1');
            ListaRevision.Controles.txtControl.val('');
            ListaRevision.Variables.dtDetalle =
                InicializaTabla({
                    tabla: ListaRevision.Controles.dtDetalle,
                    datos: [],
                    columnas: ListaRevision.Constantes.colDetalle,
                    nonOrderableColumns: [1, 2]
                });
            ListaRevision.Controles.btnAgregarControl.val('Agregar');
        },
        GuardarControl: async e => {
            e.preventDefault();

            const mensaje = ValidaCamposRequeridos('.RequeridoLRControl');

            if (mensaje.length > 0) {
                MensajeAdvertencia(mensaje);
                return;
            }

            const control = ListaRevision.Controles.txtControl.val().trim();
            const idListaRevision = ListaRevision.Variables.idListaRevision;
            const idListaRevisionDetalle = ListaRevision.Variables.idListaRevisionDetalle;

            try {
                const data = await POST(
                    ListaRevision.Constantes.urlGuardarDetalle,
                    {
                        IdListaRevision: idListaRevision,
                        IdListaRevisionDetalle: idListaRevisionDetalle,
                        Control: control
                    },
                    false
                );

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    // eslint-disable-next-line
                    ListaRevision.Variables.idListaRevisionDetalle = 0;
                    ListaRevision.Controles.txtControl.val('');
                    ListaRevision.Controles.btnAgregarControl.val('Agregar');
                    ListaRevision.Funciones.LeerDetalle();
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.statusText);
            }
        },
        EditarControl: e => {
            e.preventDefault();

            const data = ObtenerData(ListaRevision.Variables.dtDetalle, e)
            const idListaRevisionDetalle = data.IdListaRevisionDetalle;
            const control = data.Control;

            ListaRevision.Variables.idListaRevisionDetalle = idListaRevisionDetalle;
            ListaRevision.Controles.txtControl.val(control);
            ListaRevision.Controles.btnAgregarControl.val('Editar');
        },
        EliminarControl: e => {
            e.preventDefault();

            Bootbox.Confirmacion('Eliminar Control', '¿Desea eliminar el control?', () => ListaRevision.Funciones.ConfirmarEliminarControl(e));
        },
        ConfirmarEliminarControl: async e => {
            const datos = ObtenerData(ListaRevision.Variables.dtDetalle, e);
            const idListaRevisionDetalle = datos.IdListaRevisionDetalle;

            const data = await POST(
                ListaRevision.Constantes.urlEliminarControl,
                {
                    IdListaRevision: ListaRevision.Variables.idListaRevision,
                    IdListaRevisionDetalle: idListaRevisionDetalle
                },
                false
            );

            if (data.Exito) {
                // eslint-disable-next-line
                ListaRevision.Variables.idListaRevisionDetalle = 0;
                ListaRevision.Funciones.LeerDetalle();
                MensajeExito(data.Mensaje);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        Init: async () => {
            ListaRevision.Eventos.InicializaEventos();
            await ListaRevision.Funciones.LeerComboProceso();
        },
    },
    Variables: {
        idProyecto: 0,
        idListaRevision: 0,
        idListaRevisionDetalle: 0,
        dtDetalle: null,
        Actualizacion: {
            actualizar: false
        }
    }
}