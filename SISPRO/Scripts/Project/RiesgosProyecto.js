const RiesgosProyecto = {
    Controles: {
        btnNuevo: $('#modulo-riesgos').find('.btnNuevo'),
        btnFiltrar: $('#modulo-riesgos').find('.btnFiltrar'),
        btnExportar: $('#modulo-riesgos').find('.btnExportar'),
        dtRiesgo: $('#modulo-riesgos').find('.dtRiesgo'),
        documento: $(document),
        cmbFiltroProyecto: $('#modulo-riesgos').find('.cmbFiltroProyecto'),
        inputFiltro: $('#modulo-riesgos').find('.dtRiesgo input'),
    },
    Constantes: {
        colRiesgo: [
            {
                "data": "NoRiesgo",
                "class": "text-left th-medium border-right",
                "render": data => `<a class="btnEditarRiesgo" role="button">${data}</a>`
            },
            {
                "data": "FechaIdentificacion",
                "class": "text-center th-small",
                "render": data => moment(data).format("DD-MM-YYYY")
            },
            {
                "data": "Categoria.DescCorta",
                "class": "text-left th-small"
            },
            {
                "data": "Fuente.DescCorta",
                "class": "text-left th-small"
            },
            {
                "data": "DescripcionRiesgo",
                "class": "text-left th-large",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "DescripcionEfecto",
                "class": "text-left th-large",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "Causas",
                "class": "text-left th-medium",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "EventoMaterializacion",
                "class": "text-left th-medium",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "Impacto.Cualitativo",
                "class": "text-left th-small"
            },
            {
                "data": "Probabilidad.Cualitativo",
                "class": "text-left th-small"
            },
            {
                "class": "text-left  th-small",
                "render": (_data, _type, row) => row.Impacto.Valor * row.Probabilidad.Valor
            },
            {
                "class": "text-left  th-small",
                "render": (_data, _type, row) => {
                    const severidad = row.Impacto.Valor * row.Probabilidad.Valor;
                    const evaluacion = row.Evaluacion.filter(x => severidad >= x.Minimo && severidad <= x.Maximo)[0];
                    return `<label class="badge" style="width: 100%; background-color: ${evaluacion.Color}; font-weight: 700; color: ${InvertirColor(evaluacion.Color, true)}">${evaluacion.Severidad}</label>`
                }
            },
            {
                "class": "text-center border-left th-xsmall",
                "render": () => '<i class="fa fa-comments modulo-riesgos btnVerComentarios font-i"></i><i class="fa fa-trash btnEliminarProyectoRiesgo font-i"></i>'
            },
        ],
        urlLeerComboProyecto: $('#modulo-riesgos').find('#LeerComboProyecto').val(),
        urlLeerProyectoRiesgo: $('#modulo-riesgos').find('#LeerProyectoRiesgo').val(),
        urlDescargarExcelRiesgo: $('#modulo-riesgos').find('#DescargarExcelRiesgo').val(),
        urlEliminarProyectoRiesgo: $('#modulo-riesgos').find('#EliminarProyectoRiesgo').val()
    },
    Eventos: {
        InicializaEventos: () => {
            RiesgosProyecto.Funciones.InicializarTabla([]);
            RiesgosProyecto.Controles.btnNuevo.off('click').click(RiesgosProyecto.Funciones.NuevoRiesgo);
            RiesgosProyecto.Controles.btnFiltrar.off('click').click(RiesgosProyecto.Funciones.ClickBtnFiltar);
            RiesgosProyecto.Controles.btnExportar.off('click').click(RiesgosProyecto.Funciones.ClickBtnExportar);
            RiesgosProyecto.Controles.cmbFiltroProyecto.off('change').change(RiesgosProyecto.Funciones.SeleccionarProyecto);
            RiesgosProyecto.Controles.documento.off('click', '.btnEditarRiesgo').on('click', '.btnEditarRiesgo', RiesgosProyecto.Funciones.ClickBtnEditarRiesgo);
            RiesgosProyecto.Controles.documento.off('click', '.modulo-riesgos.btnVerComentarios').on('click', '.modulo-riesgos.btnVerComentarios', RiesgosProyecto.Funciones.LeerComentarios);
            RiesgosProyecto.Controles.documento.off('click', '.btnEliminarProyectoRiesgo').on('click', '.btnEliminarProyectoRiesgo', RiesgosProyecto.Funciones.ClickBtnEliminarProyectoRiesgo);
            RiesgosProyecto.Controles.inputFiltro.off('keyup change clear').on('keyup change clear', RiesgosProyecto.Funciones.FiltrarTabla);
        }
    },
    Funciones: {
        ClickBtnEliminarProyectoRiesgo: e => {
            e.preventDefault();
            e.stopPropagation();

            Bootbox.Confirmacion('Eliminar Riesgo', '¿Desea eliminar el riesgo?', () => RiesgosProyecto.Funciones.EliminarRiesgo(e));
        },
        EliminarRiesgo: async e => {
            const idProyectoRiesgo = ObtenerData(RiesgosProyecto.Variables.dtRiesgo, e).IdProyectoRiesgo

            const data = await POST(
                RiesgosProyecto.Constantes.urlEliminarProyectoRiesgo,
                {
                    idProyectoRiesgo
                },
                false
            );

            if (data.Exito) {
                RiesgosProyecto.Funciones.LeerRiesgo(RiesgosProyecto.Variables.idProyecto, false);
                MensajeExito(data.Mensaje);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        FiltrarTabla: e => {
            RiesgosProyecto.Variables.dtRiesgo.api().column($(e.target).closest('th').index()).search(e.target.value).draw();
        },
        ActualizarFiltrosTabla: () => {
            RiesgosProyecto.Variables.dtRiesgo.api().columns().every(function () {
                $(this.header()).parent().next('tr').find('th').eq(this.index()).find('input').val(this.search())
            });
        },
        LeerComentarios: e => {
            e.preventDefault();
            e.stopPropagation();

            const id = ObtenerData(RiesgosProyecto.Variables.dtRiesgo, e).IdProyectoRiesgo;
            RiesgoComentarios.Funciones.MostrarComentarios(id);
        },
        Comentarios: {
            DibujarComentarios: (data) => {
                const tamaño = data.length;
                let comentarios = '';
                data.forEach((comentario, i) => {
                    if ((i + 1) > (tamaño - 1)) {
                        comentarios +=
                            RiesgosProyecto.Funciones.Comentarios.ComentarioTabla(comentario.Usuario.imgURL, comentario.Usuario.NumEmpleado, comentario.Usuario.NombreCompleto, moment(comentario.FechaCreo).format("DD-MMM-YYYY"), comentario.Comentario, tamaño);
                    }
                });
                if (tamaño === 0) comentarios = `<button class="btnTooltip modulo-riesgos btnVerComentarios fa fa-comments" data-toggle="tooltip" title="Ver todos los comentarios (${tamaño})"></button>`
                return `<div class="comentario-tabla">${comentarios}</div>`;
            },
            ComentarioTabla: (urlImg, cveU, nombre, fecha, comentario, tamaño) =>
                `<div class="comentario-tabla-container">
                     <div class="first">
                        <div class='center-cropper'><div class='tabla'><img src="${urlImg}" title="" alt="${cveU}" data-usuario="${RiesgosProyecto.Funciones.Comentarios.DataUsuario(nombre)}" data-url="${RiesgosProyecto.Funciones.Comentarios.DataUrl(urlImg)}" class="u-a-i" /></div></div>               
                     </div>
                     <div class="second">
                        <small>${nombre} ${fecha}</small>
                        <p>${comentario}</p>
                     </div>
                 </div>
                 <button class="btnTooltip modulo-riesgos btnVerComentarios fa fa-comments" data-toggle="tooltip" title="Ver todos los comentarios (${tamaño})"></button>`,
            DataUsuario: nombre => `<label style='margin: 0px'>${nombre}</label>`,
            DataUrl: urlImg => `<div class='center-cropper'><div class='data-tooltip'><img src='${urlImg}'/></div></div>`,
        },
        ClickBtnExportar: e => {
            e.preventDefault();
            e.stopPropagation();

            if (RiesgosProyecto.Variables.dtRiesgo.api().rows()[0].length === 0) {
                MensajeAdvertencia("No hay registros para exportar");
                return;
            }

            const form = new FormData();
            RiesgosProyecto.Variables.dtRiesgo.api().rows({ filter: 'applied' }).every(function () {
                form.append('listaRiesgos[]', this.data().IdProyectoRiesgo);
            });

            DOWNLOAD(
                RiesgosProyecto.Constantes.urlDescargarExcelRiesgo,
                'Riesgos.xlsx',
                form,
                true
            );
        },
        SeleccionarProyecto: e => {
            RiesgosProyecto.Variables.idProyecto = parseInt($(e.target).val());
        },
        NuevoRiesgo: e => {
            e.preventDefault();
            e.stopPropagation();

            const idProyecto = RiesgosProyecto.Variables.idProyecto;
            if (idProyecto > 0) {
                Riesgo.Funciones.NuevoRiesgo(idProyecto);
            } else {
                MensajeAdvertencia('Por favor selecciona un proyecto');
            }
        },
        ClickBtnEditarRiesgo: e => {
            e.preventDefault();
            e.stopPropagation();

            const idRiesgo = ObtenerData(RiesgosProyecto.Variables.dtRiesgo, e).IdProyectoRiesgo;
            RiesgosProyecto.Funciones.EditarRiesgo(idRiesgo);
        },
        EditarRiesgo: idRiesgo => {
            Riesgo.Funciones.EditarRiesgo(idRiesgo, RiesgosProyecto.Variables.idProyecto);
        },
        Init: () => {
            RiesgosProyecto.Funciones.LeerProyecto()
            RiesgosProyecto.Eventos.InicializaEventos();
            RiesgosProyecto.Funciones.LeerCombos();
            RiesgosProyecto.Variables.Actualizacion.MonitorearCambios();
            RiesgosProyecto.Variables.Actualizacion.MonitorearComentarios();
            if (RiesgosProyecto.Variables.idProyecto > 0) RiesgosProyecto.Funciones.LeerRiesgo(RiesgosProyecto.Variables.idProyecto, false);
        },
        LeerProyecto: () => {
            RiesgosProyecto.Variables.idProyecto = parseInt($('#IdProyecto').val() ?? 0);
        },
        ClickBtnFiltar: e => {
            e.preventDefault();
            e.stopPropagation();

            const idProyecto = RiesgosProyecto.Variables.idProyecto
            if (idProyecto > 0) {
                RiesgosProyecto.Funciones.LeerRiesgo(idProyecto);
            } else {
                MensajeAdvertencia('Por favor selecciona un proyecto');
            }
        },
        LeerRiesgo: async (idProyecto, loading = true) => {
            try {
                RiesgosProyecto.Variables.xPosition = RiesgosProyecto.Variables.dtRiesgo.fnSettings().nScrollBody.scrollLeft;
                const data = await POST(RiesgosProyecto.Constantes.urlLeerProyectoRiesgo, { idProyecto }, loading);

                if (data.Exito) {
                    const riesgos = data.Riesgos;
                    // eslint-disable-next-line
                    RiesgosProyecto.Funciones.InicializarTabla(riesgos);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        LeerCombos: async () => {
            try {
                const data = await POST(RiesgosProyecto.Constantes.urlLeerComboProyecto, {}, false);

                if (data.Exito) {
                    RiesgosProyecto.Controles.cmbFiltroProyecto.empty().append(data.CmbProyecto);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        InicializarTabla: (riesgos) => {
            RiesgosProyecto.Variables.dtRiesgo = InicializaTabla({
                tabla: RiesgosProyecto.Controles.dtRiesgo,
                datos: riesgos,
                columnas: RiesgosProyecto.Constantes.colRiesgo,
                columnaOrdena: 0,
                scrollX: true,
                scrollCollapse: true,
                columnasFijas: { leftComluns: 1, rightColumns: 1 },
                nonOrderableColumns: [12]
            });
            RiesgosProyecto.Funciones.ActualizarFiltrosTabla();
            RiesgosProyecto.Variables.dtRiesgo.fnSettings().nScrollBody.scrollLeft = RiesgosProyecto.Variables.xPosition
            Imagenes.ActualizarTamanoImagenes.ActualizarImagenes();
        }
    },
    Variables: {
        dtRiesgo: null,
        idProyecto: 0,
        xPosition: 0,
        Actualizacion: {
            MonitorearCambios: () => { Riesgo.Variables.Actualizacion = new Proxy(Riesgo.Variables.Actualizacion, RiesgosProyecto.Variables.Actualizacion.handler) },
            MonitorearComentarios: () => { RiesgoComentarios.Variables.Actualizacion = new Proxy(RiesgoComentarios.Variables.Actualizacion, RiesgosProyecto.Variables.Actualizacion.handler) },
            handler: {
                set(target, property, value) {
                    target[property] = value;
                    RiesgosProyecto.Funciones.LeerRiesgo(RiesgosProyecto.Variables.idProyecto, false);
                }
            }
        }
    }
}

RiesgosProyecto.Funciones.Init();