const ListaControl = {
    Controles: {
        btnNuevo: $('#btnNuevo'),
        mdlListaControl: $('#mdlListaControl'),
        dtListaControl: $('#dtListaControl'),
        dtListaControlDetalle: $('#dtListaControlDetalle'),
        btnAgergarControl: $('#btnAgregarControl'),
        btnGuardarListaControl: $('#btnGuardarListaControl'),
        txtControl: $('#txtControl'),
        txtNombre: $('#txtNombre'),
        cmbProceso: $('#cmbProceso'),
        cmbSubproceso: $('#cmbSubproceso'),
        chkActivo: $('#chkActivo'),
        btnModalImportar: $('#btnModalImportar'),
        btnImportar: $('#btnImportar'),
        mdlImportar: $('#mdlImportar'),
        chkTipoCarga: $('[name="TipoCarga"]'),
        fileImportar: document.getElementById('fileImportar'),
        documento: $(document)
    },

    Constantes: {
        colListaControl: [
            {
                "data": "Nombre",
                "class": "text-left"
            },
            {
                "data": "Proceso.DescLarga",
                "class": "text-left"
            },
            {
                "data": "Subproceso.DescLarga",
                "class": "text-left"
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm btnEditarListaControl"><i class="fa fa-edit"></i></button>'
            },
            {
                "data": "Activo",
                "class": "text-center",
                "render": data => `<label class="switch switch-small"><input type="checkbox" class="chkActivarListaControl" ${data ? "checked" : ""}/><span></span></label>`
            }
        ],
        colListaControlDetalle: [
            {
                "data": "Control",
                "class": "text-left"
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm btnEditarListaControlDetalle"><i class="fa fa-edit"></i></button>'
            },
            {
                "data": "Activo",
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm btnEliminarListaControlDetalle"><i class="fa fa-trash"></i></button>'
            }
        ],
        urlLeerListaControl: $('#LeerListaControl').val(),
        urlLeerListaControlPorId: $('#LeerListaControlPorId').val(),
        urlCrearListaControl: $('#CrearListaControl').val(),
        urlEditarListaControl: $('#EditarListaControl').val(),
        urlLeerComboProceso: $('#LeerComboProceso').val(),
        urlLeerComboSubproceso: $('#LeerComboSubproceso').val(),
        urlActivarListaControl: $('#ActivarListaControl').val(),
        urlEditarListaControlDetalle: $('#EditarListaControlDetalle').val(),
        urlEliminarListaControlDetalle: $('#EliminarListaControlDetalle').val(),
        urlImportarListaControl: $('#ImportarListaControl').val()
    },

    Eventos: {
        InicializaEventos: function () {
            ListaControl.Variables.dtListaControl = inicializaTabla(ListaControl.Controles.dtListaControl, [], ListaControl.Constantes.colListaControl);
            ListaControl.Variables.dtListaControlDetalle = inicializaTabla(ListaControl.Controles.dtListaControlDetalle, [], ListaControl.Constantes.colListaControlDetalle);
            ListaControl.Controles.documento.on('click', '.btnEditarListaControlDetalle', ListaControl.Funciones.ClickBtnEditarListaControlDetalle);
            ListaControl.Controles.documento.on('click', '.btnEliminarListaControlDetalle', ListaControl.Funciones.ClickBtnEliminarListaControlDetalle);
            ListaControl.Controles.documento.on('click', '.chkActivarListaControlDetalle', ListaControl.Funciones.ClickChkActivarListaControlDetalle);
            ListaControl.Controles.documento.on('click', '.btnEditarListaControl', ListaControl.Funciones.ClickBtnEditarListaControl);
            ListaControl.Controles.documento.on('click', '.chkActivarListaControl', ListaControl.Funciones.ClickChkActivarListaControl);
            ListaControl.Controles.btnAgergarControl.click(ListaControl.Funciones.ClickBtnAgregarControl);
            ListaControl.Controles.btnGuardarListaControl.click(ListaControl.Funciones.ClickBtnGuardarListaControl);
            ListaControl.Controles.cmbProceso.change(ListaControl.Funciones.ChangeCmbProceso);
            ListaControl.Controles.btnNuevo.click(ListaControl.Funciones.ClickBtnNuevo);
            ListaControl.Controles.btnModalImportar.click(ListaControl.Funciones.ClickBtnModalImportar);
            ListaControl.Controles.btnImportar.click(ListaControl.Funciones.ClickBtnImportar);
        }
    },

    Funciones: {
        ClickBtnModalImportar: async e => {
            e.preventDefault();
            e.stopPropagation();

            ListaControl.Controles.mdlImportar.modal('show');
        },
        ClickBtnImportar: async e => {
            e.preventDefault();
            e.stopPropagation();

            let form = new FormData();
            form.append('archivo', ListaControl.Controles.fileImportar.files[0]);
            form.append('tipoCarga', $('[name="TipoCarga"]:checked').val());

            const data = await POST(
                ListaControl.Constantes.urlImportarListaControl,
                form,
                true,
                true
            );

            if (data.Exito) {
                MensajeExito(data.Mensaje);
                ListaControl.Funciones.LeerListaControl();
                // eslint-disable-next-line
                ListaControl.Controles.fileImportar.value = '';
                $('.file-input-name').text('');
                $('#rdo1').prop('checked', true);
                ListaControl.Controles.mdlImportar.modal('hide');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LimpiarModal: () => {
            ListaControl.Controles.txtNombre.val('');
            ListaControl.Controles.cmbProceso.empty().append('<option value="-1">--Seleccionar--</option>');
            ListaControl.Controles.cmbSubproceso.empty().append('<option value="-1">--Seleccionar--</option>');
            ListaControl.Controles.chkActivo.prop('checked', true);
            ListaControl.Controles.txtControl.val('');
            ListaControl.Variables.index = -1;
            ListaControl.Variables.listaControles = [];
            ListaControl.Variables.idListaControl = 0;
            ListaControl.Variables.idListaControlDetalle = 0;
            ListaControl.Variables.dtListaControlDetalle = inicializaTabla(ListaControl.Controles.dtListaControlDetalle, ListaControl.Variables.listaControles, ListaControl.Constantes.colListaControlDetalle);
            ListaControl.Controles.btnAgergarControl.val('Agregar');
        },
        ClickBtnAgregarControl: async e => {
            e.preventDefault();
            e.stopPropagation();

            const mensaje = ValidaCamposRequeridos('.RequeridoControl');
            const control = ListaControl.Controles.txtControl.val().trim();

            if (mensaje.length === 0) {
                if (ListaControl.Variables.listaControles.filter(x => x.Index !== ListaControl.Variables.index && x.Control === control).length > 0) {
                    MensajeAdvertencia('Se encuentra repetido el nombre.');
                    return;
                }

                if (ListaControl.Variables.idListaControl !== 0) {
                    const idListaControl = ListaControl.Variables.idListaControl;
                    const idListaControlDetalle = ListaControl.Variables.idListaControlDetalle;

                    const data = await POST(
                        ListaControl.Constantes.urlEditarListaControlDetalle,
                        {
                            IdListaControl: idListaControl,
                            IdListaControlDetalle: idListaControlDetalle,
                            Control: ListaControl.Controles.txtControl.val()
                        },
                        false
                    );

                    if (data.Exito) {
                        MensajeExito(data.Mensaje);
                        // eslint-disable-next-line
                        ListaControl.Variables.listaControles = data.ListaControlDetalle;
                        ListaControl.Funciones.EstablecerIndex();
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                } else {
                    if (ListaControl.Controles.btnAgergarControl.val() === "Agregar") {
                        ListaControl.Variables.listaControles.push({
                            Index: ListaControl.Variables.dtListaControlDetalle.api().rows().count(),
                            Control: control,
                            Activo: true
                        });
                    } else if (ListaControl.Controles.btnAgergarControl.val() === "Editar") {
                        for (let x of ListaControl.Variables.listaControles) {
                            if (x.Index === ListaControl.Variables.index) {
                                x.Control = control;
                                break;
                            }
                        }
                    }
                }

                ListaControl.Controles.btnAgergarControl.val('Agregar');
                // eslint-disable-next-line
                ListaControl.Variables.dtListaControlDetalle = inicializaTabla(ListaControl.Controles.dtListaControlDetalle, ListaControl.Variables.listaControles, ListaControl.Constantes.colListaControlDetalle);
                // eslint-disable-next-line
                ListaControl.Variables.index = -1;
                // eslint-disable-next-line
                ListaControl.Variables.idListaControlDetalle = 0;
                ListaControl.Controles.txtControl.val('');
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        ClickBtnGuardarListaControl: async e => {
            e.preventDefault();
            e.stopPropagation();

            const mensaje = ValidaCamposRequeridos('.Requerido');

            if (mensaje.length === 0) {
                const listaControl = {
                    IdListaControl: ListaControl.Variables.idListaControl,
                    Nombre: ListaControl.Controles.txtNombre.val(),
                    CatalogoFaseId: ListaControl.Controles.cmbProceso.children('option:selected').val(),
                    CatalogoClasificacionId: ListaControl.Controles.cmbSubproceso.children('option:selected').val(),
                    Activo: ListaControl.Controles.chkActivo.prop('checked'),
                    ListaControlDetalle: ListaControl.Variables.idListaControl === 0 ? ListaControl.Variables.listaControles : []
                };

                if (ListaControl.Variables.idListaControl === 0) {
                    const data = await POST(
                        ListaControl.Constantes.urlCrearListaControl,
                        { listaControl },
                        false
                    );

                    if (data.Exito) {
                        ListaControl.Controles.mdlListaControl.modal('hide');
                        MensajeExito(data.Mensaje);
                    }
                    else
                        MensajeAdvertencia(data.Mensaje);
                } else {
                    const data = await POST(
                        ListaControl.Constantes.urlEditarListaControl,
                        { listaControl },
                        false
                    );

                    if (data.Exito)
                        MensajeExito(data.Mensaje);
                    else
                        MensajeAdvertencia(data.Mensaje);
                }

                ListaControl.Funciones.LeerListaControl(false);
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        ClickBtnNuevo: async e => {
            e.preventDefault();
            e.stopPropagation();

            ListaControl.Funciones.LimpiarModal();
            await ListaControl.Funciones.LeerComboProceso();
            ListaControl.Controles.mdlListaControl.modal('show');
        },
        ClickBtnEditarListaControlDetalle: async e => {
            e.preventDefault();
            e.stopPropagation();

            const index = ListaControl.Variables.dtListaControlDetalle.api().row($(e.target).closest('tr')).index();
            const idListaControlDetalle = ListaControl.Variables.dtListaControlDetalle.api().row($(e.target).closest('tr')).data().IdListaControlDetalle;
            const obj = ListaControl.Variables.listaControles.filter(x => x.Index === index)[0];

            ListaControl.Variables.index = index;
            ListaControl.Variables.idListaControlDetalle = idListaControlDetalle;
            ListaControl.Controles.txtControl.val(obj.Control);
            ListaControl.Controles.btnAgergarControl.val('Editar');
        },
        ClickBtnEliminarListaControlDetalle: async e => {
            e.preventDefault();
            e.stopPropagation();

            Bootbox.Confirmacion('Eliminar Control', '¿Desea eliminar el control?', () => ListaControl.Funciones.EliminarListaControlDetalle(e.target));
        },
        EliminarListaControlDetalle: async element => {
            if (ListaControl.Variables.idListaControl === 0) {
                const index = ListaControl.Variables.dtListaControlDetalle.api().row($(element).closest('tr')).index();
                ListaControl.Variables.listaControles = ListaControl.Variables.listaControles.filter(x => x.Index !== index);
            } else {
                const obj = ListaControl.Variables.dtListaControlDetalle.api().row($(element).closest('tr')).data();
                const idListaControl = obj.IdListaControl;
                const idListaControlDetalle = obj.IdListaControlDetalle;

                const data = await POST(
                    ListaControl.Constantes.urlEliminarListaControlDetalle,
                    {
                        IdListaControl: idListaControl,
                        idListaControlDetalle: idListaControlDetalle
                    },
                    false
                );

                if (data.Exito) {
                    // eslint-disable-next-line
                    ListaControl.Variables.listaControles = data.ListaControlDetalle;
                    MensajeExito(data.Mensaje);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            }

            ListaControl.Funciones.EstablecerIndex();
            // eslint-disable-next-line
            ListaControl.Variables.dtListaControlDetalle = inicializaTabla(ListaControl.Controles.dtListaControlDetalle, ListaControl.Variables.listaControles, ListaControl.Constantes.colListaControlDetalle);
        },
        ClickChkActivarListaControlDetalle: async e => {
            e.stopPropagation();

            const index = ListaControl.Variables.dtListaControlDetalle.api().row($(e.target).closest('tr')).index();

            ListaControl.Variables.listaControles.forEach(x => {
                if (x.Index === index) {
                    x.Activo = $(e.target).prop('checked');
                    return;
                }
            });
        },
        EstablecerIndex: () => {
            ListaControl.Variables.listaControles.forEach((x, i) => {
                x.Index = i;
            })
        },
        ClickBtnEditarListaControl: async e => {
            e.preventDefault();
            e.stopPropagation();

            ListaControl.Funciones.LimpiarModal();
            const idListaControl = ListaControl.Variables.dtListaControl.api().row($(e.target).closest('tr')).data().IdListaControl;
            ListaControl.Variables.idListaControl = idListaControl;

            const data = await POST(
                ListaControl.Constantes.urlLeerListaControlPorId,
                {
                    idListaControl: idListaControl
                }
            );

            if (data.Exito) {
                await ListaControl.Funciones.LeerComboProceso();
                await ListaControl.Funciones.LeerComboSubproceso(data.ListaControl.CatalogoClasificacionId);
                ListaControl.Controles.txtNombre.val(data.ListaControl.Nombre);
                ListaControl.Controles.cmbProceso.val(data.ListaControl.CatalogoFaseId);
                ListaControl.Controles.cmbSubproceso.val(data.ListaControl.CatalogoClasificacionId);
                ListaControl.Controles.chkActivo.prop('checked', data.ListaControl.Activo);
                // eslint-disable-next-line
                ListaControl.Variables.listaControles = data.ListaControl.ListaControlDetalle;
                ListaControl.Funciones.EstablecerIndex();

                // eslint-disable-next-line
                ListaControl.Variables.dtListaControlDetalle = inicializaTabla(ListaControl.Controles.dtListaControlDetalle, ListaControl.Variables.listaControles, ListaControl.Constantes.colListaControlDetalle);

                ListaControl.Controles.mdlListaControl.modal('show');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickChkActivarListaControl: async e => {
            e.stopPropagation();

            const idListaControl = ListaControl.Variables.dtListaControl.api().row($(e.target).closest('tr')).data().IdListaControl;

            const data = await POST(
                ListaControl.Constantes.urlActivarListaControl,
                {
                    IdListaControl: idListaControl,
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
        ChangeCmbProceso: async e => {
            e.stopPropagation();

            const id = $(e.target).val();
            await ListaControl.Funciones.LeerComboSubproceso(id);
        },
        Init: () => {
            ListaControl.Eventos.InicializaEventos();
            ListaControl.Funciones.LeerListaControl();
        },
        LeerListaControl: async (load = true) => {
            const data = await POST(ListaControl.Constantes.urlLeerListaControl, {}, load);

            if (data.Exito) {
                // eslint-disable-next-line
                ListaControl.Variables.dtListaControl = inicializaTabla(ListaControl.Controles.dtListaControl, data.ListaControles, ListaControl.Constantes.colListaControl);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LeerComboProceso: async () => {
            const data = await POST(ListaControl.Constantes.urlLeerComboProceso);

            if (data.Exito) {
                ListaControl.Controles.cmbProceso.empty().append(data.CmbProceso);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LeerComboSubproceso: async (id) => {
            const data = await POST(
                ListaControl.Constantes.urlLeerComboSubproceso,
                { idProceso: id }
            );

            if (data.Exito) {
                ListaControl.Controles.cmbSubproceso.empty().append(data.CmbSubproceso);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        }
    },

    Variables: {
        dtListaControl: null,
        dtListaControlDetalle: null,
        listaControles: [],
        idListaControl: 0,
        idListaControlDetalle: 0,
        index: -1
    }
}

ListaControl.Funciones.Init();