const ListaControlProyecto = {
    Controles: {
        mdlListaControl: $('#mdlListaControl'),
        dtListaControl: $('#dtListaControl'),
        dtListaControlDetalle: $('#dtListaControlDetalle'),
        btnAgergarControl: $('#btnAgregarControl'),
        btnGuardarListaControl: $('#btnGuardarListaControl'),
        txtControl: $('#txtControl'),
        lblNombre: $('#lblNombre'),
        lblProceso: $('#lblProceso'),
        lblSubproceso: $('#lblSubproceso'),
        chkActivoControl: $('#chkActivoControl'),
        documento: $(document)
    },

    Constantes: {
        colListaControl: [
            {
                "data": "ListaControl.Nombre",
                "class": "text-left"
            },
            {
                "data": "ListaControl.Proceso.DescLarga",
                "class": "text-left"
            },
            {
                "data": "ListaControl.Subproceso.DescLarga",
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
        urlLeerProyectoListaControl: $('#LeerProyectoListaControl').val(),
        urlLeerProyectoListaControlPorId: $('#LeerProyectoListaControlPorId').val(),
        urlCrearListaControl: $('#CrearListaControl').val(),
        urlEditarProyectoListaControl: $('#EditarProyectoListaControl').val(),
        urlActivarProyectoListaControl: $('#ActivarProyectoListaControl').val(),
        urlProyectoEditarListaControlDetalle: $('#EditarProyectoListaControlDetalle').val(),
        urlEliminarProyectoListaControlDetalle: $('#EliminarProyectoListaControlDetalle').val(),
    },

    Eventos: {
        InicializaEventos: function () {
            ListaControlProyecto.Variables.dtListaControl = inicializaTabla(ListaControlProyecto.Controles.dtListaControl, [], ListaControlProyecto.Constantes.colListaControl);
            ListaControlProyecto.Variables.dtListaControlDetalle = inicializaTabla(ListaControlProyecto.Controles.dtListaControlDetalle, [], ListaControlProyecto.Constantes.colListaControlDetalle);
            ListaControlProyecto.Controles.documento.off('click', '.btnEditarListaControlDetalle').on('click', '.btnEditarListaControlDetalle', ListaControlProyecto.Funciones.ClickBtnEditarListaControlDetalle);
            ListaControlProyecto.Controles.documento.off('click', '.btnEliminarListaControlDetalle').on('click', '.btnEliminarListaControlDetalle', ListaControlProyecto.Funciones.ClickBtnEliminarListaControlDetalle);
            //ListaControlProyecto.Controles.documento.on('click', '.chkActivarListaControlDetalle', ListaControlProyecto.Funciones.ClickChkActivarListaControlDetalle);
            ListaControlProyecto.Controles.documento.off('click', '.btnEditarListaControl').on('click', '.btnEditarListaControl', ListaControlProyecto.Funciones.ClickBtnEditarListaControl);
            ListaControlProyecto.Controles.documento.off('click', '.chkActivarListaControl').on('click', '.chkActivarListaControl', ListaControlProyecto.Funciones.ClickChkActivarListaControl);
            ListaControlProyecto.Controles.btnAgergarControl.off('click').click(ListaControlProyecto.Funciones.ClickBtnAgregarControl);
            ListaControlProyecto.Controles.btnGuardarListaControl.off('click').click(ListaControlProyecto.Funciones.ClickBtnGuardarListaControl);
        }
    },

    Funciones: {
        LimpiarModal: () => {
            ListaControlProyecto.Controles.lblNombre.text('');
            ListaControlProyecto.Controles.lblProceso.text('');
            ListaControlProyecto.Controles.lblSubproceso.text('');
            ListaControlProyecto.Controles.txtControl.val('');
            ListaControlProyecto.Variables.index = -1;
            ListaControlProyecto.Variables.listaControles = [];
            ListaControlProyecto.Variables.idProyectoListaControl = 0;
            ListaControlProyecto.Controles.btnAgergarControl.val('Agregar');
        },
        ClickBtnAgregarControl: async e => {
            e.preventDefault();
            e.stopPropagation();

            const mensaje = ValidaCamposRequeridos('.RequeridoControl');
            const control = ListaControlProyecto.Controles.txtControl.val().trim();

            if (mensaje.length === 0) {
                if (ListaControlProyecto.Variables.listaControles.filter(x => x.Index !== ListaControlProyecto.Variables.index && x.Control === control).length > 0) {
                    MensajeAdvertencia('Se encuentra repetido el nombre.');
                    return;
                }

                const idListaControl = ListaControlProyecto.Variables.idProyectoListaControl;
                const idListaControlDetalle = ListaControlProyecto.Variables.idProyectoListaControlDetalle;

                const data = await POST(
                    ListaControlProyecto.Constantes.urlProyectoEditarListaControlDetalle,
                    {
                        IdProyectoListaControl: idListaControl,
                        IdProyectoListaControlDetalle: idListaControlDetalle,
                        Control: ListaControlProyecto.Controles.txtControl.val()
                    },
                    false
                );

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    // eslint-disable-next-line
                    ListaControlProyecto.Variables.listaControles = data.ProyectoListaControlDetalle;
                    ListaControlProyecto.Funciones.EstablecerIndex();
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }

                ListaControlProyecto.Controles.btnAgergarControl.val('Agregar');
                // eslint-disable-next-line
                ListaControlProyecto.Variables.dtListaControlDetalle =
                    inicializaTabla(ListaControlProyecto.Controles.dtListaControlDetalle, ListaControlProyecto.Variables.listaControles, ListaControlProyecto.Constantes.colListaControlDetalle);
                // eslint-disable-next-line
                ListaControlProyecto.Variables.index = -1;
                // eslint-disable-next-line
                ListaControlProyecto.Variables.idProyectoListaControlDetalle = 0;
                ListaControlProyecto.Controles.txtControl.val('');
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        ClickBtnGuardarListaControl: async e => {
            e.preventDefault();
            e.stopPropagation();

            const listaControl = {
                IdProyectoListaControl: ListaControlProyecto.Variables.idProyectoListaControl,
                ProyectoListaControlDetalle: ListaControlProyecto.Variables.listaControles,
                Activo: ListaControlProyecto.Controles.chkActivoControl.prop('checked')
            };

            const data = await POST(
                ListaControlProyecto.Constantes.urlEditarProyectoListaControl,
                { proyectoListaControl: listaControl }
            );

            if (data.Exito) {
                MensajeExito(data.Mensaje);
                ListaControlProyecto.Funciones.LeerProyectoListaControl(false);
            }
            else
                MensajeAdvertencia(data.Mensaje);
        },
        ClickBtnEditarListaControlDetalle: e => {
            e.preventDefault();
            e.stopPropagation();

            const index = ListaControlProyecto.Variables.dtListaControlDetalle.api().row($(e.target).closest('tr')).index();
            const idProyectoListaControlDetalle = ListaControlProyecto.Variables.dtListaControlDetalle.api().row($(e.target).closest('tr')).data().IdProyectoListaControlDetalle;
            const obj = ListaControlProyecto.Variables.listaControles.filter(x => x.Index === index)[0];

            ListaControlProyecto.Variables.index = index;
            ListaControlProyecto.Variables.idProyectoListaControlDetalle = idProyectoListaControlDetalle;
            ListaControlProyecto.Controles.txtControl.val(obj.Control);
            ListaControlProyecto.Controles.btnAgergarControl.val('Editar');
        },
        ClickBtnEliminarListaControlDetalle: e => {
            e.preventDefault();
            e.stopPropagation();

            Bootbox.Confirmacion('Eliminar Control', '¿Desea eliminar el control?', () => ListaControlProyecto.Funciones.EliminarListaControlDetalle(e.target));
        },
        EliminarListaControlDetalle: async element => {
            const obj = ListaControlProyecto.Variables.dtListaControlDetalle.api().row($(element).closest('tr')).data();
            const idListaControl = obj.IdProyectoListaControl;
            const idListaControlDetalle = obj.IdProyectoListaControlDetalle;

            const data = await POST(
                ListaControlProyecto.Constantes.urlEliminarProyectoListaControlDetalle,
                {
                    IdProyectoListaControl: idListaControl,
                    idProyectoListaControlDetalle: idListaControlDetalle
                },
                false
            );

            if (data.Exito) {
                // eslint-disable-next-line
                ListaControlProyecto.Variables.listaControles = data.ProyectoListaControlDetalle;
                MensajeExito(data.Mensaje);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }

            ListaControlProyecto.Funciones.EstablecerIndex();
            // eslint-disable-next-line
            ListaControlProyecto.Variables.dtListaControlDetalle = inicializaTabla(ListaControlProyecto.Controles.dtListaControlDetalle, ListaControlProyecto.Variables.listaControles, ListaControlProyecto.Constantes.colListaControlDetalle);
        },
        EstablecerIndex: () => {
            ListaControlProyecto.Variables.listaControles.forEach((x, i) => {
                x.Index = i;
            })
        },
        ClickBtnEditarListaControl: async e => {
            e.preventDefault();
            e.stopPropagation();

            ListaControlProyecto.Funciones.LimpiarModal();
            const idProyectoListaControl = ListaControlProyecto.Variables.dtListaControl.api().row($(e.target).closest('tr')).data().IdProyectoListaControl;
            ListaControlProyecto.Variables.idProyectoListaControl = idProyectoListaControl;

            const data = await POST(
                ListaControlProyecto.Constantes.urlLeerProyectoListaControlPorId,
                {
                    idProyectoListaControl: idProyectoListaControl
                }
            );

            if (data.Exito) {
                ListaControlProyecto.Controles.lblNombre.text(data.ListaControl.ListaControl.Nombre);
                ListaControlProyecto.Controles.lblProceso.text(data.ListaControl.ListaControl.Proceso.DescLarga);
                ListaControlProyecto.Controles.lblSubproceso.text(data.ListaControl.ListaControl.Subproceso.DescLarga);
                ListaControlProyecto.Controles.chkActivoControl.prop('checked', data.ListaControl.Activo);
                // eslint-disable-next-line
                ListaControlProyecto.Variables.listaControles = data.ListaControl.ProyectoListaControlDetalle;
                ListaControlProyecto.Funciones.EstablecerIndex();

                // eslint-disable-next-line
                ListaControlProyecto.Variables.dtListaControlDetalle =
                    inicializaTabla(ListaControlProyecto.Controles.dtListaControlDetalle, ListaControlProyecto.Variables.listaControles, ListaControlProyecto.Constantes.colListaControlDetalle);

                ListaControlProyecto.Controles.mdlListaControl.modal('show');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickChkActivarListaControl: async e => {
            e.stopPropagation();

            const idListaControl = ListaControlProyecto.Variables.dtListaControl.api().row($(e.target).closest('tr')).data().IdProyectoListaControl;

            const data = await POST(
                ListaControlProyecto.Constantes.urlActivarProyectoListaControl,
                {
                    IdProyectoListaControl: idListaControl,
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
            ListaControlProyecto.Eventos.InicializaEventos();
            ListaControlProyecto.Funciones.LeerProyectoListaControl();
        },
        LeerProyectoListaControl: async (load = true) => {
            const data = await POST(ListaControlProyecto.Constantes.urlLeerProyectoListaControl, {}, load);

            if (data.Exito) {
                // eslint-disable-next-line
                ListaControlProyecto.Variables.dtListaControl = inicializaTabla(ListaControlProyecto.Controles.dtListaControl, data.ListaControles, ListaControlProyecto.Constantes.colListaControl);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        }
    },

    Variables: {
        dtListaControl: null,
        dtListaControlDetalle: null,
        listaControles: [],
        idProyectoListaControl: 0,
        idProyectoListaControlDetalle: 0,
        index: -1
    }
}