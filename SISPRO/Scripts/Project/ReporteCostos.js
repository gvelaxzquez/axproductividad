const ReporteCostos = {
    Controles: {
        cmbProyectos: $('#cmbReporteCostoProyecto'),
        datePeriodo: $('#dateReporteCostoPeriodo'),
        btnBuscar: $('#btnReporteCostoBuscar'),
        dtReporte: $('#dtReporteCosto'),
        btnExportar: $('#btnReporteCostosExportar'),
    },
    Constantes: {
        colReporte: [
            {
                "data": "Proyecto",
                "class": "text-left",
                "render": data => `<a target="_blank" href="/Proyectos/Proyecto/${data}">${data}</a>`
            },
            {
                "data": "Lider",
                "class": "text-left",
            },
            {
                "data": "Presupuesto",
                "class": "text-right",
                "render": (data) => "$ " + formatMoney(data)
            },
            {
                "data": "Directo",
                "class": "text-right",
                "render": (data) => "$ " + formatMoney(data)
            },
            {
                "data": "Indirecto",
                "class": "text-right",
                "render": (data) => "$ " + formatMoney(data)
            },
            {
                "data": "Total",
                "class": "text-right",
                "render": (data, type, row) => `<label class="badge" 
                            style="width: 100%;
                            background-color: ${row.Consumido <= 100 ? "#488000" : row.Consumido <= 105 ? "#ffff79" : "#ff3f3f"}; 
                            color: ${row.Consumido <= 100 ? "white" : row.Consumido <= 105 ? "#656d78" : "white"} ">
                            $ ${formatMoney(data)}</label>`
            },
            {
                "data": "Consumido",
                "class": "text-right",
                "render": (data) => `<label class="badge" 
                            style="width: 100%;
                            background-color: ${data <= 100 ? "#488000" : data <= 105 ? "#ffff79" : "#ff3f3f"}; 
                            color: ${data <= 100 ? "white" : data <= 105 ? "#656d78" : "white"} ">
                            ${data.toFixed(2)} %</label>`
            },
        ]
    },
    Eventos: {
        InicializaEventos: () => {
            ReporteCostos.Controles.btnBuscar.click(ReporteCostos.Funciones.ObtenerReporte);
            ReporteCostos.Controles.btnExportar.click(ReporteCostos.Funciones.ExportarReporte);
        }
    },
    Funciones: {
        Init: () => {
            ReporteCostos.Controles.datePeriodo.val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));
            ReporteCostos.Variables.dtReporte =
                InicializaTabla({ tabla: ReporteCostos.Controles.dtReporte, columnas: ReporteCostos.Constantes.colReporte, datos: [] });
            ReporteCostos.Eventos.InicializaEventos();
            ReporteCostos.Funciones.CargaProyectos();
        },
        ObtenerReporte: async e => {
            e.preventDefault();
            const proyectos = ReporteCostos.Controles.cmbProyectos.val();

            try {
                const data = await POST('/Report/ObtenerReporteCostos', {
                    proyectos,
                    inicio: ReporteCostos.Controles.datePeriodo.val().split(' - ')[0],
                    fin: ReporteCostos.Controles.datePeriodo.val().split(' - ')[1]
                });
                if (data.Exito) {
                    ReporteCostos.Variables.dtReporte =
                        InicializaTabla({ tabla: ReporteCostos.Controles.dtReporte, columnas: ReporteCostos.Constantes.colReporte, datos: data.Reporte });
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeAdvertencia('Ha habido un error');
                console.log(e);
            }
        },
        ExportarReporte: async (e) => {
            e.preventDefault();

            const p = ReporteCostos.Controles.cmbProyectos.val();

            let formData = new FormData();
            p.forEach((x, i) => {
                formData.append("proyectos[" + i + "]", x);
            });
            formData.append("inicio", ReporteCostos.Controles.datePeriodo.val().split(' - ')[0])
            formData.append("fin", ReporteCostos.Controles.datePeriodo.val().split(' - ')[1])

            DOWNLOAD(
                "/Report/DescargarExcelInformeCostoDetalle",
                'Costos.xlsx',
                formData,
                true
            );
        },
        CargaProyectos: async () => {
            try {
                const data = await POST('/Proyectos/CargaComboProyecto', {}, false);
                if (data.Exito) {
                    ReporteCostos.Controles.cmbProyectos
                        .empty()
                        .append(data.LstProyectos);
                    ReporteCostos.Controles.cmbProyectos.selectpicker('refresh');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeAdvertencia('Ha habido un error');
                console.log(e);
            }
        },
    },
    Variables: {
        dtReporte: null,
    }
}

ReporteCostos.Funciones.Init();



