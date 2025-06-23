const ReporteTrabajo = {
    Controles: {
        cmbProyecto: $('#cmbProyecto'),
        dateFecha: $('#dateFecha'),
        dtReporte: $('#dtReporte'),
        btnFiltrar: $('#btnFiltrar'),
        btnExportar: $('#btnExportar'),
    },
    Constantes: {
        colReporte: [
            {
                "data": "Actividad.IdActividad",
                "class": "text-left",
                "render": (data, _type, row) => `<a href="#" onclick="clickalerta(${row.Actividad.IdActividad})">${data}</a>`
            },
            {
                "data": "Usuario.NombreCompleto",
                "class": "text-left"
            },
            {
                "data": "Proyecto.Nombre",
                "class": "text-left"
            },
            {
                "data": "Proyecto.Clave",
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
                "data": "Actividad.BR",
                "class": "text-left",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "Actividad.Descripcion",
                "class": "text-left",
                "render": data => `<div class="row3">${data}</div>`
            },
            {
                "data": "Fecha",
                "class": "text-center",
                "render": data => data === null ? '' : moment(data).format("DD-MM-YYYY")
            },
            {
                "data": "Tiempo",
                "class": "text-center"
            },
            {
                "data": "Comentario",
                "class": "text-left"
            },
        ],
        urlLeerComboProyecto: $('#LeerComboProyecto').val(),
        urlLeerReporteTrabajoTiempo: $('#LeerReporteTrabajoTiempo').val(),
        urlDescargarExcelReporteTrabajo: $('#DescargarExcelReporteTrabajo').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            ReporteTrabajo.Controles.btnFiltrar.click(ReporteTrabajo.Funciones.Filtrar);
            ReporteTrabajo.Controles.btnExportar.click(ReporteTrabajo.Funciones.Exportar);
        }
    },
    Funciones: {
        Exportar: e => {
            e.preventDefault();
            e.stopPropagation();

            if (ReporteTrabajo.Variables.dtReporte.api().rows()[0].length === 0) {
                MensajeAdvertencia("No hay registros para exportar");
                return;
            }

            const form = new FormData();
            ReporteTrabajo.Variables.dtReporte.api().rows({ filter: 'applied' }).every(function () {
                form.append('listaActividades[]', this.data().IdActividadTrabajo);
            });

            DOWNLOAD(
                ReporteTrabajo.Constantes.urlDescargarExcelReporteTrabajo,
                'Reporte.xlsx',
                form,
                true
            );
        },
        Filtrar: async e => {
            e.preventDefault();
            e.stopPropagation();

            const filtros = {
                Proyectos: ReporteTrabajo.Controles.cmbProyecto.val(),
                FechaInicio: ReporteTrabajo.Controles.dateFecha.val().split('-')[0],
                FechaFin: ReporteTrabajo.Controles.dateFecha.val().split('-')[1]
            }

            try {
                const data = await POST(ReporteTrabajo.Constantes.urlLeerReporteTrabajoTiempo, { filtros });

                if (data.Exito) {
                    // eslint-disable-next-line
                    ReporteTrabajo.Variables.dtReporte = inicializaTabla(ReporteTrabajo.Controles.dtReporte, data.Reporte, ReporteTrabajo.Constantes.colReporte);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e);
            }
        },
        LeerComboProyecto: async () => {
            const data = await POST(ReporteTrabajo.Constantes.urlLeerComboProyecto);

            if (data.Exito) {
                ReporteTrabajo.Controles.cmbProyecto.empty().append(data.CmbProyecto);
                ReporteTrabajo.Controles.cmbProyecto.selectpicker('refresh');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        Init: () => {
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var primerDia = new Date(y, m, 1);
            var ultimoDia = new Date(y, m + 1, 0); 
            ReporteTrabajo.Controles.dateFecha.val(moment(primerDia).format("DD/MM/YYYY") + ' - ' + moment(ultimoDia).format("DD/MM/YYYY"));
            ReporteTrabajo.Variables.dtReporte = inicializaTabla(ReporteTrabajo.Controles.dtReporte, [], ReporteTrabajo.Constantes.colReporte);
            ReporteTrabajo.Eventos.InicializaEventos();
            ReporteTrabajo.Funciones.LeerComboProyecto();
        }
    },
    Variables: {
        dtReporte: null
    }
}

ReporteTrabajo.Funciones.Init();