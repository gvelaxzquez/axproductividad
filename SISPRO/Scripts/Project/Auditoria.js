const Auditoria = {
    Controles: {
        btnNuevo: $('#btnNuevo'),
        mdlAuditoria: $('#mdlAuditoria'),
        mdlHallazgos: $('#mdlHallazgos'),
        mdlEnvio: $('#mdlEnvio'),
        dtAuditoria: $('#dtAuditoria'),
        dtActividades: $('#dtActividades'),
        dtControles: $('#dtControles'),
        dtHallazgos: $('#dtHallazgos'),
        btnGuardarAuditoria: $('#btnGuardarAuditoria'),
        btnFinzalizarAuditoria: $('#btnFinzalizarAuditoria'),
        lblNoAuditoria: $('#lblNoAuditoria'),
        cmbProyecto: $('#cmbProyecto'),
        cmbProyectoListaControl: $('#cmbListaControl'),
        lblProceso: $('#lblProceso'),
        lblSubproceso: $('#lblSubproceso'),
        timeInicio: $('#timeInicio'),
        lblFin: $('#lblFin'),
        txtComentarios: $('#txtComentarios'),
        //btnCerrarHallazgo: $('#btnCerrarHallazgo'),
        //btnCerrarAuditoria: $('#btnCerrarAuditoria'),
        cmbGravedad: $('#cmbGravedad'),
        chkCorregidoHallazgo: $('#chkCorregidoHallazgo'),
        btnGuardarHallazgo: $('#btnGuardarHallazgo'),
        txtDescripcionHallazgo: $('#txtDescripcionHallazgo'),
        chkMostrarAuditor: $('#chkMostrarAuditor'),
        btnExportar: $('#btnExportar'),
        btnFiltrar: $('#btnFiltrar'),
        dateFiltroInicio: $('#dateFiltroInicio'),
        dateFiltroFin: $('#dateFiltroFin'),
        cmbFiltroAuditor: $('#cmbFiltroAuditor'),
        cmbFiltroProyecto: $('#cmbFiltroProyecto'),
        cmbFiltroEstatus: $('#cmbFiltroEstatus'),
        btnExportarDetalle: $('#btnExportarDetalle'),
        btnNuevaMejora: $('#btnNuevaMejora'),
        btnModalEnviar: $('#btnModalEnviar'),
        btnEnviarAuditoria: $('#btnEnviarAuditoria'),
        cmbCorreos: $('#cmbCorreos'),
        document: $(document),
        window: window
    },
    Constantes: {
        colAuditoria: [
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm btnEditarAuditoria"><i class="fa fa-eye"></i></button>'
            },
            {
                "data": "NoAuditoria",
                "class": "text-left"
            },
            {
                "class": "text-center",
                "render": (_data, _type, row) => `${moment(row.FechaInicio).format("DD-MM-YYYY")} ${row.FechaFin !== null ? "/ " + moment(row.FechaFin).format("DD-MM-YYYY").toString() : ""}`
            },
            {
                "data": "Estatus",
                "class": "text-center",
                "render": (data, _, row) => `<span style="font-size: 12px;" class="label label-${row.IdEstatus === "P" ? "info" : row.IdEstatus === "X" ? "default" : "success"}">${data}</span>`
            },
            {
                "data": "ProyectoListaControl.Proyecto.Nombre",
                "class": "text-left"
            },
            {
                "data": "ProyectoListaControl.ListaControl.Nombre",
                "class": "text-left",
            },
            {
                "data": "UsuarioAuditor",
                "class": "text-left",
                "render": (data, _type, _row, x) => {
                    let html = '<div class="usuario-auditoria-grid">';
                    let i = 0, r = 0;
                    for (usuario of data) {
                        if (i % 3 === 0) { i = 0; r++ };
                        i++;

                        html += `<div class="usuario-columna usuario-columna-${i}" style="grid-row:${r};">`;
                        //html += `<img src="${usuario.imgURL}" data-toggle="tooltip" data-html="true" title="${usuario.NombreCompleto}" alt="${usuario.NumEmpleado}" class="usuario-auditoria-imagen tooltip-imagen-${x.row}">`
                        html += `<img src="${usuario.imgURL}" title="" alt="${usuario.NumEmpleado}" data-usuario="<label style='margin: 0px'>${usuario.NombreCompleto}</label>" data-url="<div class='center-cropper'><div class='data-tooltip'><img src='${usuario.imgURL}'/></div></div>" class="usuario-auditoria-imagen u-a-i">`
                        html += '</div>'
                    }
                    html += "<div>"
                    return html;
                }
            },
            {
                "class": "text-left",
                "render": (_data, _type, row) => `Total: ${row.CuentaControlTotal}<br/>Revisados: ${row.CuentaControlRevisados}<br/>Cumple: ${row.CuentaControlCumple}<br />No cumple: ${row.CuentaControlNoCumple}`
            },
            {
                "class": "text-left",
                "render": (_data, _type, row) => `Bajo: ${row.CuentaInconformidadBajo}<br/>Medio: ${row.CuentaInconformidadMedio}<br />Grave: ${row.CuentaInconformidadGrave}`
            }
        ],
        colAtividades: [
            {
                "data": "IdActividad",
                "class": "text-center",
                "render": data => `<a href="#" onclick="EsMejora = true;clickalerta(${data})">${data}</a>`
            },
            {
                "data": "Descripcion",
                "class": "text-left",
                "render": data => `<div class='row2'>${data}</div>`
            },
            {
                "data": "ResponsableStr",
                "class": "text-left"
            },
            {
                "data": "Estatus",
                "class": "text-center",
                "render": (data, _type, row) => {
                    let color = '';
                    let rechazada = ''
                    let string = '';

                    switch (data) {
                        case 'A':
                            color = "#3fbae4";
                            string = "Abierto";
                            break;
                        case 'R':
                            color = "#ff9900";
                            string = "Revisión";
                            break;
                        case 'V':
                            color = "#003399";
                            string = "Validación";
                            break;
                        case 'L':
                            color = "#00B432";
                            string = "Liberado";
                            break
                        case 'C':
                            color = "#a3a375";
                            string = "Cancelado";
                            break;
                        case 'X':
                            color = "#FF0000";
                            string = "Rechazado";
                            rechazada = "BtnVerRechazoP";
                            break;
                        case 'P':
                            color = "#3fbae4";
                            string = "En progreso";
                            break;
                    }

                    return `<label style="background-color: ${color}; color: white; width: 100%" class="badge BtnVerRechazoP ${rechazada}">${string}</label>`;
                }
            },
            {
                "data": "FechaSolicitado",
                "class": "text-center",
                "render": data => moment(data).format("DD-MM-YYYY")
            },
        ],
        colControles: [
            {
                "data": "ProyectoListaControlDetalle.Control",
                "class": "text-left"
            },
            {
                "data": "Usuario",
                "class": "text-center position-relative",
                "render": data => data !== null ? `<img src="${data.imgURL}" data-toggle="tooltip" title="${data.NombreCompleto}" alt="${data.NumEmpleado}" class="usuario-auditoria-imagen">` : ''
            },
            {
                "data": "Cumple",
                "class": "text-center position-relative",
                "render": (data, _, _row, x) => `<i style="font-size: 20px; color: ${data === null ? '' : data ? 'darkgreen' : 'darkred'};" class="${data === null ? 'fa fa-minus' : data ? 'fa fa-check' : 'fa fa-times'}"></i><button id=${x.row} class="btnTooltip fa fa-ellipsis-v" data-placement="left" data-toggle="tooltip" data-html="true" title='${Auditoria.Funciones.LeerTooltip()}'></button>`
            },
            {
                "data": "TotalHallazgos",
                "render": (data, _, row) =>
                    `<div style="display: flex; align-items: center;">
                        <div style="width: 50%; text-align: right; padding-right: 10px;">
                            <label style="margin-bottom: 0px !important">${data}</label>
                        </div>
                        <a class="btnLeerHallazgos" href="#"><i style="font-size: 25px; color: #08C127; cursor: pointer;" class="fa fa-plus-circle"></i></a>
                    </div>
                    ${data > 0 ?
                        `<div style="display: flex; justify-content: center;">
                            <span class="label label-success" style="font-size: 10px;">${row.TotalHallazgosCorregido}</span>
                            <span class="label label-danger" style="font-size: 10px;">${row.TotalHallazgosNoCorregido}</span>
                        </div>` :
                        ''}`
            }
        ],
        colHallazgos: [
            {
                "data": "Corregido",
                "class": "text-center",
                "render": data => `${data ? "✔" : "✖"}`
            },
            {
                "data": "Descripcion",
                "class": "text-left"
            },
            {
                "data": "Gravedad",
                "class": "text-left",
                "render": data => `${data === 1 ? "Bajo" : data === 2 ? "Medio" : data === 3 ? "Grave" : ""}`
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm btnEditarHallazgo"><i class="fa fa-edit"></i></button>'
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm btnEliminarHallazgo"><i class="fa fa-trash"></i></button>'
            }
        ],
        tooltip: `<a class="btnCumple" href="#"><i style="font-size: 20px; color: green;" class="fa fa-check-circle"></i></a>
                  <a class="btnNoCumple" href="#"><i style="font-size: 20px; color: red;" class="fa fa-times-circle"></i></a>`,
        urlLeerAuditoria: $('#LeerAuditoria').val(),
        urlLeerAuditoriaPorId: $('#LeerAuditoriaPorId').val(),
        urlLeerComboProyecto: $('#LeerComboProyecto').val(),
        urlLeerComboListaControl: $('#LeerComboListaControl').val(),
        urlLeerProcesoSubproceso: $('#LeerProcesoSubproceso').val(),
        urlFinalizarAuditoria: $('#FinalizarAuditoria').val(),
        urlCrearAuditoria: $('#CrearAuditoria').val(),
        urlEditarAuditoria: $('#EditarAuditoria').val(),
        urlLeerAuditoriaControl: $('#LeerAuditoriaControl').val(),
        urlLeerAuditoriaControlHallazgo: $('#LeerAuditoriaControlHallazgo').val(),
        urlActualizarControlCumple: $('#ActualizarControlCumple').val(),
        urlCrearHallazgo: $('#CrearHallazgo').val(),
        urlEditarHallazgo: $('#EditarHallazgo').val(),
        urlEliminarHallazgo: $('#EliminarHallazgo').val(),
        urlLeerAuditoriaPorFiltro: $('#LeerAuditoriaPorFiltro').val(),
        urlDescargarExcelAuditoria: $('#DescargarExcelAuditoria').val(),
        urlDescargarExcelAuditoriaDetalle: $('#DescargarExcelAuditoriaDetalle').val(),
        urlLeerComboAuditor: $('#LeerComboAuditor').val(),
        urlLeerAuditoriaActividadMejora: $('#LeerAuditoriaActividadMejora').val(),
        urlCrearAuditoriaActividadMejora: $('#CrearAuditoriaActividadMejora').val(),
        urlEnviarAuditoriaFinalizada: $('#EnviarAuditoriaFinalizada').val(),
        urlLeerCorreos: $('#LeerCorreos').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            Auditoria.Controles.cmbCorreos.selectpicker({
                noneResultsText: '<button class="btn btn-dark btnAgregarOpcion">Agregar</button>',
                multipleSeparator: '; ',
                styleBase: 'form-control'
            })
            Auditoria.Controles.btnNuevo.click(Auditoria.Funciones.ClickBtnNuevo);
            Auditoria.Controles.cmbProyecto.change(Auditoria.Funciones.ChangeCmbProyecto);
            Auditoria.Controles.cmbProyectoListaControl.change(Auditoria.Funciones.ChangeCmbListaControl);
            Auditoria.Controles.btnFiltrar.click(Auditoria.Funciones.ClickBtnFiltrar);
            Auditoria.Controles.btnGuardarAuditoria.click(Auditoria.Funciones.ClickBtnGuardarAuditoria);
            Auditoria.Controles.btnFinzalizarAuditoria.click(Auditoria.Funciones.ClickBtnFinzalizarAuditoria);
            Auditoria.Controles.chkMostrarAuditor.click(Auditoria.Funciones.ClickChkMostrarAuditor);
            Auditoria.Controles.btnExportar.click(Auditoria.Funciones.ClickBtnExportar);
            Auditoria.Controles.btnExportarDetalle.click(Auditoria.Funciones.ClickBtnExportarDetalle);
            Auditoria.Controles.document.on('click', '.btnEditarAuditoria', Auditoria.Funciones.ClickBtnEditarAuditoria);
            Auditoria.Controles.document.on('click', '.btnEliminarHallazgo', Auditoria.Funciones.ClickBtnEliminarHallazgo);
            Auditoria.Controles.document.on('click', '.btnEditarHallazgo', Auditoria.Funciones.ClickBtnEditarHallazgo);
            Auditoria.Controles.document.on('mouseenter', '.btnTooltip', Auditoria.Funciones.Tooltip.MouseEnterTooltip);
            Auditoria.Controles.document.on('mouseleave', '.btnTooltip', Auditoria.Funciones.Tooltip.MouseLeaveTooltip);
            Auditoria.Controles.document.on('click', '.btnTooltip', Auditoria.Funciones.Tooltip.MouseEnterTooltip);
            Auditoria.Controles.document.on('mouseenter', '.tooltip', Auditoria.Funciones.Tooltip.MouseEnterTooltipClass);
            Auditoria.Controles.document.on('mouseleave', '.tooltip', Auditoria.Funciones.Tooltip.MouseLeaveTooltipClass);
            Auditoria.Controles.document.on('click', '.btnCumple', Auditoria.Funciones.ClickBtnCumple);
            Auditoria.Controles.document.on('click', '.btnNoCumple', Auditoria.Funciones.ClickBtnNoCumple);
            Auditoria.Controles.document.on('click', '.btnLeerHallazgos', Auditoria.Funciones.ClickBtnLeerHallazgos);
            Auditoria.Controles.document.on('click', '.btnAgregarOpcion', Auditoria.Funciones.ClickCtnAgregarOpcion);
            Auditoria.Controles.mdlHallazgos.on('hidden.bs.modal', Auditoria.Funciones.CerrarModalHallazgos);
            Auditoria.Controles.mdlEnvio.on('hidden.bs.modal', Auditoria.Funciones.CerrarModalEnvio);
            //Auditoria.Controles.btnCerrarHallazgo.click(Auditoria.Funciones.CerrarModalHallazgos);
            //Auditoria.Controles.btnCerrarAuditoria.click(Auditoria.Funciones.CerrarModalAuditoria);
            Auditoria.Controles.btnGuardarHallazgo.click(Auditoria.Funciones.ClickBtnGuardarHallazgo);
            Auditoria.Controles.btnNuevaMejora.click(Auditoria.Funciones.ClickBtnNuevaMejora);
            Auditoria.Controles.btnEnviarAuditoria.click(Auditoria.Funciones.ClickBtnEnviarAuditoria);
            Auditoria.Controles.btnModalEnviar.click(Auditoria.Funciones.ClickBtnModalEnviar);
            Auditoria.Controles.window.addEventListener('resize', Auditoria.Funciones.Resize, false);
        }
    },
    Funciones: {
        ClickCtnAgregarOpcion: e => {
            e.preventDefault();

            var correo = $(e.target).parents('div.dropdown-menu.open').find('.bs-searchbox').find('input').val();
            $(e.target).parents('div').siblings('#cmbCorreos').append($("<option></option>").text(correo)).val([...$('#cmbCorreos').val() ?? [], correo]);
            Auditoria.Controles.cmbCorreos.selectpicker('refresh');
        },
        ClickBtnModalEnviar: async () => {
            Auditoria.Controles.cmbCorreos.empty();
            Auditoria.Controles.cmbCorreos.selectpicker('refresh');

            const data = await POST(Auditoria.Constantes.urlLeerCorreos, { idAuditoria: Auditoria.Variables.idAuditoria }, false);

            if (data.Exito) {
                data.Correos.forEach(x => Auditoria.Controles.cmbCorreos.append(`<option value="${x}">${x}</option>`));
                Auditoria.Controles.cmbCorreos.selectpicker('refresh');

                Auditoria.Controles.mdlAuditoria.modal('hide');
                Auditoria.Controles.mdlEnvio.modal('show');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickBtnEnviarAuditoria: async () => {
            const correos = Auditoria.Controles.cmbCorreos.val();

            if (correos !== [] || correos == null) {
                const data =
                    await POST(Auditoria.Constantes.urlEnviarAuditoriaFinalizada,
                        {
                            correos,
                            idAuditoria: Auditoria.Variables.idAuditoria
                        });

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    Auditoria.Controles.mdlEnvio.modal('hide');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } else {
                MensajeAdvertencia('No se han seleccionado correos');
            }
        },
        ClickBtnNuevaMejora: e => {
            e.preventDefault();

            EsMejora = true;
            $('#TituloActividades').text("Captura de Mejora");
            InicializaAltaActividades();
            $('#ModalActividades').modal({ keyboard: false });
        },
        ClickBtnFiltrar: async e => {
            e.preventDefault();
            e.stopPropagation();

            const fechaInicio_1 = Auditoria.Controles.dateFiltroInicio.val().split('-')[0];
            const fechaInicio_2 = Auditoria.Controles.dateFiltroInicio.val().split('-')[1];
            const fechaFin_1 = Auditoria.Controles.dateFiltroFin.val().split('-')[0];
            const fechaFin_2 = Auditoria.Controles.dateFiltroFin.val().split('-')[1];
            const auditores = Auditoria.Controles.cmbFiltroAuditor.val();
            const proyectos = Auditoria.Controles.cmbFiltroProyecto.val();
            const estatus = Auditoria.Controles.cmbFiltroEstatus.val();

            const data = await POST(
                Auditoria.Constantes.urlLeerAuditoriaPorFiltro,
                {
                    FechaInicio_1: fechaInicio_1,
                    FechaInicio_2: fechaInicio_2,
                    FechaFin_1: fechaFin_1,
                    FechaFin_2: fechaFin_2,
                    UsuariosAuditories: auditores,
                    Proyectos: proyectos,
                    Estatus: estatus
                }
            );

            if (data.Exito) {
                const auditorias = data.Auditorias;
                // eslint-disable-next-line
                Auditoria.Variables.dtAuditoria = inicializaTabla(Auditoria.Controles.dtAuditoria, auditorias, Auditoria.Constantes.colAuditoria, 1, undefined, undefined, undefined, undefined, [0]);
                Auditoria.Funciones.ActualizarImagenes();
            } else {
                MensajeAdvertencia(data.Mensaje)
            }
        },
        ClickBtnExportar: e => {
            e.stopPropagation();

            Auditoria.Variables.dtAuditoria.api().rows({ filter: 'applied' }).every(function () {
                Auditoria.Variables.listaAuditoria.push(this.data().IdAuditoria);
            });

            const form = new FormData();
            for (const id of Auditoria.Variables.listaAuditoria) {
                form.append('listaAuditorias[]', id);
            }

            if (Auditoria.Variables.listaAuditoria.length === 0) {
                MensajeAdvertencia("No hay registros para exportar");
                return;
            }

            DOWNLOAD(
                Auditoria.Constantes.urlDescargarExcelAuditoria,
                'Resumen_Auditorias.xlsx',
                form,
                true
            );

            Auditoria.Variables.listaAuditoria = [];
        },
        Resize: () => {
            Auditoria.Variables.Resize.rtime = new Date();
            Auditoria.Variables.Resize.timeout = true;
            setTimeout(Auditoria.Funciones.ResizeTermino, Auditoria.Variables.Resize.delta);
        },
        ResizeTermino: () => {
            if (new Date() - Auditoria.Variables.Resize.rtime < Auditoria.Variables.Resize.delta) {
                setTimeout(Auditoria.Variables.Resize.ResizeTermino, Auditoria.Variables.Resize.delta);
            } else {
                Auditoria.Variables.Resize.timeout = false;
                Auditoria.Funciones.ActualizarImagenes();
            }
        },
        ActualizarImagenes: () => {
            $.powerTip.destroy();
            for (const img of $('.u-a-i').toArray()) {
                $(img).data("powertipjq", $([
                    $(img).data('usuario'),
                    '<hr style="margin: 5px 0px"/>',
                    $(img).data('url')
                ].join('\n')));
                $(img).powerTip({
                    placement: 'w'
                });
            }
        },
        ClickChkMostrarAuditor: e => {
            Auditoria.Variables.dtControles.api().column(1).visible(e.target.checked);
        },
        ClickBtnGuardarAuditoria: async e => {
            e.preventDefault();
            e.stopPropagation();

            const mensaje = ValidaCamposRequeridos('.RequeridoAuditoria');

            if (mensaje.length === 0) {
                data = await Auditoria.Funciones.GuardarAuditoria();

                if (data.Exito) {
                    Auditoria.Controles.btnExportarDetalle.removeClass('hidden');
                    Auditoria.Controles.btnModalEnviar.removeClass('hidden');

                    MensajeExito(data.Mensaje);
                    Auditoria.Funciones.LeerAuditoria();
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        GuardarAuditoria: async () => {
            const data = await POST(
                Auditoria.Constantes.urlEditarAuditoria,
                {
                    IdAuditoria: Auditoria.Variables.idAuditoria,
                    IdProyectoListaControl: Auditoria.Controles.cmbProyectoListaControl.val(),
                    FechaInicio: Auditoria.Controles.timeInicio.val(),
                    Comentarios: Auditoria.Controles.txtComentarios.val()
                }
            );

            return data;
        },
        ClickBtnFinzalizarAuditoria: async e => {
            e.preventDefault();
            e.stopPropagation();

            const mensaje = ValidaCamposRequeridos('.RequeridoAuditoria');

            if (mensaje.length === 0) {
                data = await Auditoria.Funciones.GuardarAuditoria();

                if (data.Exito) {
                    Auditoria.Controles.btnExportarDetalle.removeClass('hidden');
                    Auditoria.Controles.btnModalEnviar.removeClass('hidden');

                    Auditoria.Funciones.LeerAuditoria(false);

                    const data = await POST(
                        Auditoria.Constantes.urlFinalizarAuditoria,
                        { idAuditoria: Auditoria.Variables.idAuditoria }
                    )

                    if (data.Exito) {
                        const auditorias = data.Auditorias;
                        // eslint-disable-next-line
                        Auditoria.Variables.dtAuditoria = inicializaTabla(Auditoria.Controles.dtAuditoria, auditorias, Auditoria.Constantes.colAuditoria, 1, undefined, undefined, undefined, undefined, [0]);
                        Auditoria.Funciones.ActualizarImagenes();

                        MensajeExito(data.Mensaje);

                        Auditoria.Controles.mdlAuditoria.modal('hide');
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        ClickBtnExportarDetalle: e => {
            e.preventDefault();
            e.stopPropagation();

            const form = new FormData();
            form.append('idAuditoria', Auditoria.Variables.idAuditoria);

            DOWNLOAD(
                Auditoria.Constantes.urlDescargarExcelAuditoriaDetalle,
                'Resumen_Auditorias.xlsx',
                form,
                true
            );
        },
        ChangeCmbProyecto: e => {
            const idProyecto = e.target.value;

            if (idProyecto === '-1') {
                Auditoria.Controles.cmbProyectoListaControl.empty().append('<option value="-1">--Seleccionar--</option>');
                Auditoria.Controles.lblProceso.text('');
                Auditoria.Controles.lblSubproceso.text('');
            } else {
                Auditoria.Funciones.LeerComboListaControl(idProyecto);
            }
        },
        LeerComboListaControl: async (idProyecto) => {
            const data = await POST(
                Auditoria.Constantes.urlLeerComboListaControl,
                { idProyecto },
                false
            );

            if (data.Exito) {
                Auditoria.Controles.cmbProyectoListaControl.empty().append(data.CmbListaControl);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LeerComboAuditor: async () => {
            const data = await POST(
                Auditoria.Constantes.urlLeerComboAuditor,
                {},
            );

            if (data.Exito) {
                Auditoria.Controles.cmbFiltroAuditor.empty().append(data.CmbAuditores);
                Auditoria.Controles.cmbFiltroAuditor.selectpicker('refresh');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ChangeCmbListaControl: async () => {
            const idProyectoListaControl = Auditoria.Controles.cmbProyectoListaControl.val();

            if (idProyectoListaControl !== '-1') {
                const data = await POST(
                    Auditoria.Constantes.urlLeerProcesoSubproceso,
                    { idProyectoListaControl },
                    false
                );

                Auditoria.Controles.lblProceso.text(data.Proceso);
                Auditoria.Controles.lblSubproceso.text(data.Subproceso);

                Auditoria.Funciones.LeerAuditoriaDetalle(true);
            } else {
                Auditoria.Controles.lblProceso.text('');
                Auditoria.Controles.lblSubproceso.text('');
                Auditoria.Variables.dtControles = inicializaTabla(Auditoria.Controles.dtControles, [], Auditoria.Constantes.colControles);
                Auditoria.Variables.dtControles.api().column(1).visible(Auditoria.Controles.chkMostrarAuditor.prop('checked'));
            }
        },
        LeerAuditoriaDetalle: async (loading) => {
            const idProyecto = Auditoria.Controles.cmbProyecto.val();
            const idProyectoListaControl = Auditoria.Controles.cmbProyectoListaControl.val();

            if (idProyecto !== '-1' && idProyectoListaControl !== '-1') {
                const data = await POST(
                    Auditoria.Constantes.urlLeerAuditoriaControl,
                    {
                        idProyecto,
                        idProyectoListaControl,
                        idAuditoria: Auditoria.Variables.idAuditoria
                    },
                    loading
                );

                if (data.Exito) {
                    const auditoriaControles = data.AuditoriaControles;
                    // eslint-disable-next-line
                    Auditoria.Variables.dtControles = inicializaTabla(Auditoria.Controles.dtControles, auditoriaControles, Auditoria.Constantes.colControles);
                    Auditoria.Variables.dtControles.api().column(1).visible(Auditoria.Controles.chkMostrarAuditor.prop('checked'));
                } else {
                    Auditoria.Controles.cmbProyectoListaControl.val('-1');
                    Auditoria.Controles.lblProceso.text('');
                    Auditoria.Controles.lblSubproceso.text('');
                    MensajeAdvertencia(data.Mensaje);
                }
            }
        },
        ClickBtnNuevo: e => {
            e.stopPropagation();

            Auditoria.Funciones.LimpiarModalAuditoria();
            Auditoria.Funciones.CrearAuditoria();
        },
        CrearAuditoria: async () => {
            const data = await POST(Auditoria.Constantes.urlCrearAuditoria);

            if (data.Exito) {
                Auditoria.Funciones.LeerComboProyecto();
                // eslint-disable-next-line
                Auditoria.Variables.idAuditoria = data.Auditoria.IdAuditoria;
                Auditoria.Controles.lblNoAuditoria.text(data.Auditoria.NoAuditoria);
                // eslint-disable-next-line
                Auditoria.Variables.dtControles = inicializaTabla(Auditoria.Controles.dtControles, [], Auditoria.Constantes.colControles);
                Auditoria.Variables.dtControles.api().column(1).visible(Auditoria.Controles.chkMostrarAuditor.prop('checked'));

                Auditoria.Controles.mdlAuditoria.modal('show');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LeerAuditoriaActividades: async () => {
            const data = await
                POST(Auditoria.Constantes.urlLeerAuditoriaActividadMejora,
                    {
                        idAuditoria: Auditoria.Variables.idAuditoria
                    }, false);

            if (data.Exito) {
                Auditoria.Variables.dtActividades =
                    inicializaTabla(Auditoria.Controles.dtActividades, data.Actividades, Auditoria.Constantes.colAtividades);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickBtnEditarAuditoria: async e => {
            e.preventDefault();
            e.stopPropagation();

            Auditoria.Funciones.LimpiarModalAuditoria();

            Auditoria.Variables.idAuditoria = Auditoria.Variables.dtAuditoria.api().row($(e.target).closest('tr')).data().IdAuditoria;
            const data = await POST(
                Auditoria.Constantes.urlLeerAuditoriaPorId,
                { idAuditoria: Auditoria.Variables.idAuditoria }
            );

            if (data.Exito) {
                Auditoria.Controles.btnExportarDetalle.removeClass('hidden');
                Auditoria.Controles.btnModalEnviar.removeClass('hidden');

                await Auditoria.Funciones.LeerComboProyecto();
                await Auditoria.Funciones.LeerComboListaControl(data.Auditoria.ProyectoListaControl.IdProyecto);

                const auditoria = data.Auditoria;
                Auditoria.Controles.lblNoAuditoria.text(auditoria.NoAuditoria);
                Auditoria.Controles.cmbProyecto.val(auditoria.ProyectoListaControl.IdProyecto);
                Auditoria.Controles.cmbProyectoListaControl.val(auditoria.ProyectoListaControl.IdProyectoListaControl);
                Auditoria.Controles.lblProceso.text(auditoria.ProyectoListaControl.ListaControl.Proceso.DescLarga);
                Auditoria.Controles.lblSubproceso.text(auditoria.ProyectoListaControl.ListaControl.Subproceso.DescLarga);
                Auditoria.Controles.timeInicio.val(moment(auditoria.FechaInicio).format("YYYY-MM-DD"));
                if (auditoria.FechaFin !== null)
                    Auditoria.Controles.lblFin.text(moment(auditoria.FechaFin).format("DD-MM-YYYY"));
                Auditoria.Controles.txtComentarios.val(auditoria.Comentarios);
                const detalle = Auditoria.Funciones.LeerAuditoriaDetalle(false);
                const actividades = Auditoria.Funciones.LeerAuditoriaActividades();

                await detalle;
                await actividades;

                Auditoria.Controles.mdlAuditoria.modal('show');
            } else {
                // eslint-disable-next-line
                Auditoria.Variables.idAuditoria = 0;
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickBtnEliminarHallazgo: async e => {
            e.preventDefault();
            e.stopPropagation();

            const idAuditoriaControlHallazgo = Auditoria.Variables.dtHallazgos.api().row($(e.target).closest('tr')).data().IdAuditoriaControlHallazgo;
            const data = await POST(
                Auditoria.Constantes.urlEliminarHallazgo,
                {
                    IdAuditoria: Auditoria.Variables.idAuditoria,
                    IdAuditoriaControl: Auditoria.Variables.idAuditoriaControl,
                    IdAuditoriaControlHallazgo: idAuditoriaControlHallazgo
                },
                false
            );

            if (data.Exito) {
                MensajeExito(data.Mensaje);

                const hallazgos = data.Hallazgos;
                // eslint-disable-next-line
                Auditoria.Variables.dtHallazgos = inicializaTabla(Auditoria.Controles.dtHallazgos, hallazgos, Auditoria.Constantes.colHallazgos, 1, undefined, undefined, undefined, undefined, [0, 3, 4]);
                Auditoria.Funciones.LeerAuditoria(false);
                Auditoria.Funciones.LeerAuditoriaDetalle(false);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickBtnEditarHallazgo: e => {
            e.preventDefault();
            e.stopPropagation();

            const data = Auditoria.Variables.dtHallazgos.api().row($(e.target).closest('tr')).data();
            Auditoria.Variables.idAuditoriaControlHallazgo = data.IdAuditoriaControlHallazgo;
            Auditoria.Controles.cmbGravedad.val(data.Gravedad);
            Auditoria.Controles.txtDescripcionHallazgo.val(data.Descripcion);
            Auditoria.Controles.chkCorregidoHallazgo.prop('checked', data.Corregido);
            Auditoria.Controles.btnGuardarHallazgo.html('Editar <span class="fa fa-floppy-o fa-right"></span>');
        },
        ClickBtnCumple: e => {
            e.preventDefault();
            e.stopPropagation();

            Auditoria.Funciones.ActualizarControlCumple(e.currentTarget, true);
        },
        ClickBtnNoCumple: e => {
            e.preventDefault();
            e.stopPropagation();

            Auditoria.Funciones.ActualizarControlCumple(e.currentTarget, false);
        },
        ActualizarControlCumple: async (element, cumple) => {
            try {
                const id = $(element).parent().parent()[0].id;
                const rowElement = $(`[aria-describedby="${id}"]`);
                const data = Auditoria.Variables.dtControles.api().row(rowElement.closest('tr')).data();

                if (data === null || data === undefined)
                    MensajeAdvertencia('Hubo un error al guardar los cambios.');
                else {
                    const idAuditoriaControl = data.IdAuditoriaControl;
                    const resp = await POST(
                        Auditoria.Constantes.urlActualizarControlCumple,
                        {
                            IdAuditoria: Auditoria.Variables.idAuditoria,
                            IdAuditoriaControl: idAuditoriaControl,
                            Cumple: cumple,
                            IdProyectoListaControl: Auditoria.Controles.cmbProyectoListaControl.val()
                        },
                        false
                    );

                    if (resp.Exito) {
                        const auditoriaControles = resp.AuditoriaControles;
                        MensajeExito(resp.Mensaje);
                        // eslint-disable-next-line
                        Auditoria.Variables.dtControles = inicializaTabla(Auditoria.Controles.dtControles, auditoriaControles, Auditoria.Constantes.colControles);
                        Auditoria.Variables.dtControles.api().column(1).visible(Auditoria.Controles.chkMostrarAuditor.prop('checked'));
                        Auditoria.Funciones.LeerAuditoria(false);
                    } else {
                        MensajeAdvertencia(resp.Mensaje);
                    }
                }
            } catch (e) {
                MensajeAdvertencia('Hubo un error al guardar los cambios.');
            }
        },
        ClickBtnGuardarHallazgo: async e => {
            e.preventDefault();
            e.stopPropagation();

            const mensaje = ValidaCamposRequeridos('.RequeridoHallazgoAuditoria');

            if (mensaje.length === 0) {
                const gravedad = Auditoria.Controles.cmbGravedad.val();
                const descripcion = Auditoria.Controles.txtDescripcionHallazgo.val();
                const corregido = Auditoria.Controles.chkCorregidoHallazgo.prop('checked');

                let data
                if (Auditoria.Variables.idAuditoriaControlHallazgo === 0) {
                    data = await POST(
                        Auditoria.Constantes.urlCrearHallazgo,
                        {
                            IdAuditoriaControl: Auditoria.Variables.idAuditoriaControl,
                            IdAuditoria: Auditoria.Variables.idAuditoria,
                            Gravedad: gravedad,
                            Descripcion: descripcion,
                            Corregido: corregido
                        },
                        false
                    );
                } else {
                    data = await POST(
                        Auditoria.Constantes.urlEditarHallazgo,
                        {
                            IdAuditoriaControlHallazgo: Auditoria.Variables.idAuditoriaControlHallazgo,
                            IdAuditoriaControl: Auditoria.Variables.idAuditoriaControl,
                            IdAuditoria: Auditoria.Variables.idAuditoria,
                            Gravedad: gravedad,
                            Descripcion: descripcion,
                            Corregido: corregido
                        },
                        false
                    );
                }

                if (data.Exito) {
                    MensajeExito(data.Mensaje);

                    const hallazgos = data.Hallazgos;
                    // eslint-disable-next-line
                    Auditoria.Variables.dtHallazgos = inicializaTabla(Auditoria.Controles.dtHallazgos, hallazgos, Auditoria.Constantes.colHallazgos, 1, undefined, undefined, undefined, undefined, [0, 3, 4]);
                    Auditoria.Funciones.LeerAuditoriaDetalle(false);
                    Auditoria.Funciones.LeerAuditoria(false);

                    // eslint-disable-next-line
                    Auditoria.Variables.idAuditoriaControlHallazgo = 0;
                    Auditoria.Controles.cmbGravedad.val('-1');
                    Auditoria.Controles.txtDescripcionHallazgo.val('');
                    Auditoria.Controles.chkCorregidoHallazgo.prop('checked', false);
                    Auditoria.Controles.btnGuardarHallazgo.html('Guardar <span class="fa fa-floppy-o fa-right"></span>');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        Init: () => {
            Auditoria.Eventos.InicializaEventos();
            Auditoria.Funciones.LeerAuditoria();
            Auditoria.Funciones.LeerCombosFiltros();
            Auditoria.Variables.Actualizacion.MonitorearCambios();
        },
        LeerCombosFiltros: () => {
            Auditoria.Funciones.LeerComboAuditor();
            Auditoria.Funciones.LeerComboProyecto(true);
        },
        ClickBtnLeerHallazgos: async e => {
            e.preventDefault();
            e.stopPropagation();

            Auditoria.Funciones.LimpiarModalHallazgos();
            Auditoria.Variables.idAuditoriaControl = Auditoria.Variables.dtControles.api().row($(e.target).closest('tr')).data().IdAuditoriaControl;

            const data = await POST(
                Auditoria.Constantes.urlLeerAuditoriaControlHallazgo,
                {
                    IdAuditoria: Auditoria.Variables.idAuditoria,
                    IdAuditoriaControl: Auditoria.Variables.idAuditoriaControl
                }
            );

            if (data.Exito) {
                const hallazgos = data.Hallazgos;

                // eslint-disable-next-line
                Auditoria.Variables.dtHallazgos = inicializaTabla(Auditoria.Controles.dtHallazgos, hallazgos, Auditoria.Constantes.colHallazgos, 1, undefined, undefined, undefined, undefined, [0, 3, 4]);

                Auditoria.Controles.mdlAuditoria.modal('hide');
                Auditoria.Controles.mdlHallazgos.modal('show');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        CerrarModalHallazgos: e => {
            e.preventDefault();
            Auditoria.Controles.mdlAuditoria.modal('show');
            Auditoria.Controles.mdlHallazgos.modal('hide');
        },
        CerrarModalEnvio: e => {
            e.preventDefault();
            Auditoria.Controles.mdlAuditoria.modal('show');
            Auditoria.Controles.mdlEnvio.modal('hide');
        },
        CerrarModalAuditoria: e => {
            e.preventDefault();
            Auditoria.Controles.mdlAuditoria.modal('hide');
        },
        LeerTooltip: () => {
            return Auditoria.Constantes.tooltip;
        },
        LeerComboProyecto: async (multiple = false) => {
            const data = await POST(Auditoria.Constantes.urlLeerComboProyecto, { multiple: multiple });

            if (data.Exito) {
                Auditoria.Controles.cmbProyecto.empty().append(data.CmbProyecto);
                if (multiple) {
                    Auditoria.Controles.cmbFiltroProyecto.empty().append(data.CmbProyecto);
                    Auditoria.Controles.cmbFiltroProyecto.selectpicker('refresh');
                }
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LeerAuditoria: async (loading = true) => {
            const data = await POST(Auditoria.Constantes.urlLeerAuditoria, {}, loading);

            if (data.Exito) {
                const auditorias = data.Auditorias;
                // eslint-disable-next-line
                Auditoria.Variables.dtAuditoria = inicializaTabla(Auditoria.Controles.dtAuditoria, auditorias, Auditoria.Constantes.colAuditoria, 1, undefined, undefined, undefined, undefined, [0]);
                Auditoria.Funciones.ActualizarImagenes();
            } else {
                MensajeAdvertencia(data.Mensaje)
            }
        },
        Tooltip: {
            MouseEnterTooltip: e => {
                e.preventDefault();
                $('.btnTooltip').not(`button.btnTooltip#${e.target.id}`).trigger('blur');
                e.target.focus();
                Auditoria.Variables.mostrarTooltip = true;
            },
            MouseLeaveTooltip: e => {
                Auditoria.Variables.mostrarTooltip = false;
                e.preventDefault();
                setTimeout(() => { if (!Auditoria.Variables.mostrarTooltip) { $(`.btnTooltip`).trigger('blur'); $('.tooltip').tooltip('hide'); } }, 500);
            },
            MouseEnterTooltipClass: e => {
                e.preventDefault();
                Auditoria.Variables.mostrarTooltip = true;
            },
            MouseLeaveTooltipClass: e => {
                e.preventDefault();
                setTimeout(() => {
                    $(`.btnTooltip`).trigger('blur'); $('.tooltip').tooltip('hide');
                }, 300);
                Auditoria.Variables.mostrarTooltip = false;
            }
        },
        LimpiarModalAuditoria: () => {
            Auditoria.Controles.lblNoAuditoria.text('');
            Auditoria.Controles.cmbProyecto.empty().append('<option value="-1">--Seleccionar--</option>');
            Auditoria.Controles.cmbProyectoListaControl.empty().append('<option value="-1">--Seleccionar--</option>');
            Auditoria.Controles.lblProceso.text('');
            Auditoria.Controles.lblSubproceso.text('');
            Auditoria.Controles.timeInicio.val('');
            Auditoria.Controles.lblFin.text('');
            Auditoria.Controles.txtComentarios.val('');
            Auditoria.Variables.dtControles = inicializaTabla(Auditoria.Controles.dtControles, [], Auditoria.Constantes.colControles);
            Auditoria.Variables.dtActividades = inicializaTabla(Auditoria.Controles.dtActividades, [], Auditoria.Constantes.colAtividades);
            Auditoria.Variables.idAuditoria = 0;
            Auditoria.Variables.idAuditoriaControl = 0;
            Auditoria.Controles.btnModalEnviar.addClass('hidden');
            Auditoria.Controles.btnExportarDetalle.addClass('hidden');
        },
        LimpiarModalHallazgos: () => {
            Auditoria.Controles.cmbGravedad.val('-1');
            Auditoria.Controles.txtDescripcionHallazgo.val('');
            Auditoria.Controles.chkCorregidoHallazgo.prop('checked', false);
            Auditoria.Variables.dtHallazgos = inicializaTabla(Auditoria.Controles.dtHallazgos, [], Auditoria.Constantes.colHallazgos, undefined, undefined, undefined, undefined, undefined, [2, 3]);
            Auditoria.Variables.idAuditoriaControlHallazgo = 0;
            Auditoria.Variables.idAuditoriaControl = 0;
        },
        CrearAuditoriaActividadMejora: async (idActividad) => {
            const data = await
                POST(Auditoria.Constantes.urlCrearAuditoriaActividadMejora,
                    {
                        idAuditoria: Auditoria.Variables.idAuditoria,
                        idActividad
                    });

            if (data.Exito) {
                Auditoria.Funciones.LeerAuditoriaActividades();
            } else {
                MensajeAdvertencia(`La actividad ${idActividad} se creó correctemente pero no se asigno a la auditoria`);
            }
        }
    },
    Variables: {
        dtAuditoria: null,
        dtActividades: null,
        dtControles: null,
        dtHallazgos: null,
        mostrarTooltip: false,
        idAuditoria: 0,
        idAuditoriaControl: 0,
        idAuditoriaControlHallazgo: 0,
        listaAuditoria: [],
        Resize: {
            rtime: null,
            timeout: false,
            delta: 200
        },
        Actualizacion: {
            MonitorearCambios: () => { ActividadCreada = new Proxy(ActividadCreada, Auditoria.Variables.Actualizacion.handler) },
            handler: {
                set(target, property, value) {
                    target[property] = value;
                    Auditoria.Funciones.CrearAuditoriaActividadMejora(value);
                }
            }
        }
    }
}

Auditoria.Funciones.Init();

function CargaActividades() {
    var a = "Dummy function";
}