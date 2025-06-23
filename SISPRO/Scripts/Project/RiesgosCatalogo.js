const RiesgosCatalogo = {
    Controles: {
        btnNuevo: $('#btnNuevo'),
        dtRiesgo: $('#dtRiesgo'),
        btnExportar: $('#btnExportar'),
        inputFiltro: $('#dtRiesgo input'),
        documento: $(document)
    },
    Constantes: {
        colRiesgo: [
            {
                "data": "NoRiesgo",
                "class": "text-center th-small border-right",
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
                "data": "Activo",
                "class": "text-center border-left th-xsmall",
                "render": data => `<label class="switch switch-small"><input type="checkbox" class="chkActivarRiesgo" ${data ? "checked" : ""}/><span></span></label>`
            }
        ],
        urlLeerRiesgo: $('#LeerRiesgo').val(),
        urlActivarRiesgo: $('#ActivarRiesgo').val(),
        urlDescargarExcelRiesgo: $('#DescargarExcelRiesgo').val()
    },
    Eventos: {
        InicializaEventos: () => {
            RiesgosCatalogo.Controles.btnNuevo.click(RiesgosCatalogo.Funciones.NuevoRiesgo);
            RiesgosCatalogo.Controles.btnExportar.click(RiesgosCatalogo.Funciones.ClickBtnExportar);
            RiesgosCatalogo.Controles.documento.on('click', '.btnEditarRiesgo', RiesgosCatalogo.Funciones.ClickBtnEditarRiesgo);
            RiesgosCatalogo.Controles.documento.on('click', '.chkActivarRiesgo', RiesgosCatalogo.Funciones.ActivarRiesgo);
            RiesgosCatalogo.Controles.inputFiltro.on('keyup change clear', RiesgosCatalogo.Funciones.FiltrarTabla);
        }
    },
    Funciones: {
        ActivarRiesgo: async e => {
            e.stopPropagation();

            const idRiesgo = ObtenerData(RiesgosCatalogo.Variables.dtRiesgo, e).IdRiesgo;

            const data = await POST(
                RiesgosCatalogo.Constantes.urlActivarRiesgo,
                {
                    idRiesgo,
                    activo: $(e.target).prop('checked')
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
        FiltrarTabla: e => {
            RiesgosCatalogo.Variables.dtRiesgo.api().column($(e.target).closest('th').index()).search(e.target.value).draw();
        },
        ActualizarFiltrosTabla: () => {
            RiesgosCatalogo.Variables.dtRiesgo.api().columns().every(function () {
                $(this.header()).parent().next('tr').find('th').eq(this.index()).find('input').val(this.search())
            });
        },
        ClickBtnExportar: e => {
            e.preventDefault();
            e.stopPropagation();

            if (RiesgosCatalogo.Variables.dtRiesgo.api().rows()[0].length === 0) {
                MensajeAdvertencia("No hay registros para exportar");
                return;
            }

            const form = new FormData();
            RiesgosCatalogo.Variables.dtRiesgo.api().rows({ filter: 'applied' }).every(function () {
                form.append('listaRiesgos[]', this.data().IdRiesgo);
            });

            DOWNLOAD(
                RiesgosCatalogo.Constantes.urlDescargarExcelRiesgo,
                'Riesgos.xlsx',
                form,
                true
            );
        },
        NuevoRiesgo: e => {
            e.preventDefault();
            e.stopPropagation();

            Riesgo.Funciones.NuevoRiesgo();
        },
        ClickBtnEditarRiesgo: e => {
            e.preventDefault();
            e.stopPropagation();

            const idRiesgo = ObtenerData(RiesgosCatalogo.Variables.dtRiesgo, e).IdRiesgo;
            RiesgosCatalogo.Funciones.EditarRiesgo(idRiesgo);
        },
        EditarRiesgo: idRiesgo => {
            Riesgo.Funciones.EditarRiesgo(idRiesgo);
        },
        Init: () => {
            RiesgosCatalogo.Funciones.InicializaTabla([]);
            RiesgosCatalogo.Eventos.InicializaEventos();
            RiesgosCatalogo.Funciones.LeerRiesgo();
            RiesgosCatalogo.Variables.Actualizacion.MonitorearCambios();
        },
        LeerRiesgo: async (loading = true) => {
            try {
                RiesgosCatalogo.Variables.xPosition = RiesgosCatalogo.Variables.dtRiesgo.fnSettings().nScrollBody.scrollLeft;
                const data = await POST(RiesgosCatalogo.Constantes.urlLeerRiesgo, {}, loading);

                if (data.Exito) {
                    const riesgos = data.Riesgos;
                    // eslint-disable-next-line
                    RiesgosCatalogo.Funciones.InicializaTabla(riesgos);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        InicializaTabla: (riesgos) => {
            RiesgosCatalogo.Variables.dtRiesgo = InicializaTabla({
                tabla: RiesgosCatalogo.Controles.dtRiesgo,
                datos: riesgos,
                columnas: RiesgosCatalogo.Constantes.colRiesgo,
                columnaOrdena: 0,
                scrollX: true,
                scrollCollapse: true,
                columnasFijas: { leftColumns: 1, rightColumns: 1 },
                nonOrderableColumns: [12]
            });
            RiesgosCatalogo.Funciones.ActualizarFiltrosTabla();
            RiesgosCatalogo.Variables.dtRiesgo.fnSettings().nScrollBody.scrollLeft = RiesgosCatalogo.Variables.xPosition
        }
    },
    Variables: {
        dtRiesgo: null,
        xPosition: 0,
        Actualizacion: {
            MonitorearCambios: () => { Riesgo.Variables.Actualizacion = new Proxy(Riesgo.Variables.Actualizacion, RiesgosCatalogo.Variables.Actualizacion.handler) },
            handler: {
                set(target, property, value) {
                    target[property] = value;
                    RiesgosCatalogo.Funciones.LeerRiesgo(false);
                }
            }
        }
    }
}

RiesgosCatalogo.Funciones.Init();