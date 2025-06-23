const InformeCostos = {
    Controles: {
        cmbProyectos: $('#cmbInformeCostoProyecto'),
        datePeriodo: $('#dateInformeCostoPeriodo'),
        btnBuscar: $('#btnInformaCostoBuscar'),
        lblPresupuesto: $('#lblInformeCostoPresupuesto'),
        lblDirecto: $('#lblInformeCostoDirecto'),
        lblIndirecto: $('#lblInformeCostoIndirecto'),
        lblTotal: $('#lblInformeCostoTotal'),
        mdlDetalle: $('#mdlInformeCostoDetalle'),
        dtDetalle: $('#dtInformeCostoDetalle'),
        btnExportar: $('#btnInformeCostosExp'),
    },
    Constantes: {
        colCostoDetalle: [
            {
                "data": "Concepto",
                "class": "text-left",
            },
            {
                "data": "Fase",
                "class": "text-left",
            },
            {
                "data": "Fecha",
                "class": "text-center",
            },
            {
                "data": "Costo",
                "class": "text-right",
                "render": (data) => "$ " + formatMoney(data)
            },
        ]
    },
    Eventos: {
        InicializaEventos: () => {
            InformeCostos.Controles.btnBuscar.click(InformeCostos.Funciones.ObtenerInforme);
            InformeCostos.Controles.lblDirecto.parent().click(InformeCostos.Funciones.ObtenerInformeCD);
            InformeCostos.Controles.lblIndirecto.parent().click(InformeCostos.Funciones.ObtenerInformeCI);
            InformeCostos.Controles.btnExportar.click(InformeCostos.Funciones.ExportarDetalle);
        }
    },
    Funciones: {
        Init: () => {
            InformeCostos.Controles.datePeriodo.val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));
            InformeCostos.Eventos.InicializaEventos();
            InformeCostos.Funciones.CargaProyectos();
        },
        ObtenerInforme: async e => {
            e.preventDefault();
            const id = InformeCostos.Controles.cmbProyectos.val();
            const proyectos = [];
            proyectos.push(id);

            try {
                const data = await POST('/Proyectos/ObtenerReporteCostos', {
                    proyectos,
                    inicio: InformeCostos.Controles.datePeriodo.val().split(' - ')[0],
                    fin: InformeCostos.Controles.datePeriodo.val().split(' - ')[1]
                });
                if (data.Exito) {
                    var info = data.Informe;
                    InformeCostos.Controles.lblPresupuesto.html("$ " + formatMoney(info.Presupuesto));
                    InformeCostos.Controles.lblDirecto.html("$ " + formatMoney(info.Directo));
                    InformeCostos.Controles.lblIndirecto.html("$ " + formatMoney(info.Indirecto));
                    InformeCostos.Controles.lblTotal.html("$ " + formatMoney(info.Total));
                    InformeCostos.Funciones.GeneraGraficaFases(info.GraficaPastelFases);
                    InformeCostos.Funciones.GeneraGraficaRecursos(info.GraficaPastelRecursos);
                    InformeCostos.Funciones.GeneraGraficaPeriodo(info.GraficaPeriodo);

                    const porciento = info.Total * 100 / info.Presupuesto;
                    if (porciento <= 100)
                        InformeCostos.Controles.lblTotal.parent().css({ "background-color": "#488000", "color": "white" });
                    else if (porciento <= 105)
                        InformeCostos.Controles.lblTotal.parent().css({ "background-color": "#ffff79", "color": "#656d78" });
                    else
                        InformeCostos.Controles.lblTotal.parent().css({ "background-color": "#ff3f3f", "color": "white" });
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeAdvertencia('Ha habido un error');
                console.log(e);
            }
        },
        ObtenerInformeCD: async () => {
            const idProyecto = InformeCostos.Controles.cmbProyectos.val();
            try {
                InformeCostos.Variables.tipo = 'd';
                const data = await POST('/Proyectos/ObtenerReporteCostosCD', {
                    idProyecto,
                    inicio: InformeCostos.Controles.datePeriodo.val().split(' - ')[0],
                    fin: InformeCostos.Controles.datePeriodo.val().split(' - ')[1]
                });
                if (data.Exito) {
                    var info = data.Reporte;
                    InformeCostos.Variables.dtDetalle =
                        InicializaTabla({ tabla: InformeCostos.Controles.dtDetalle, datos: info, columnas: InformeCostos.Constantes.colCostoDetalle });
                    InformeCostos.Controles.mdlDetalle.modal('show');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeAdvertencia('Ha habido un error');
                console.log(e);
            }
        },
        ObtenerInformeCI: async () => {
            const idProyecto = InformeCostos.Controles.cmbProyectos.val();
            try {
                InformeCostos.Variables.tipo = 'i';
                const data = await POST('/Proyectos/ObtenerReporteCostosCI', {
                    idProyecto,
                    inicio: InformeCostos.Controles.datePeriodo.val().split(' - ')[0],
                    fin: InformeCostos.Controles.datePeriodo.val().split(' - ')[1]
                });
                if (data.Exito) {
                    var info = data.Reporte;
                    InformeCostos.Variables.dtDetalle =
                        InicializaTabla({ tabla: InformeCostos.Controles.dtDetalle, datos: info, columnas: InformeCostos.Constantes.colCostoDetalle });
                    InformeCostos.Controles.mdlDetalle.modal('show');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeAdvertencia('Ha habido un error');
                console.log(e);
            }
        },
        ExportarDetalle: async (e) => {
            e.preventDefault();

            const data = {
                idProyecto: InformeCostos.Controles.cmbProyectos.val(),
                inicio: InformeCostos.Controles.datePeriodo.val().split(' - ')[0],
                fin: InformeCostos.Controles.datePeriodo.val().split(' - ')[1],
                tipo: InformeCostos.Variables.tipo,
            };

            let formData = new FormData();
            formData.append("idProyecto", InformeCostos.Controles.cmbProyectos.val())
            formData.append("inicio", InformeCostos.Controles.datePeriodo.val().split(' - ')[0])
            formData.append("fin", InformeCostos.Controles.datePeriodo.val().split(' - ')[1])
            formData.append("tipo", InformeCostos.Variables.tipo)

            DOWNLOAD(
                "/Proyectos/DescargarExcelInformeCostoDetalle",
                'DetalleCostos.xlsx',
                formData,
                true
            );
        },
        CargaProyectos: async () => {
            try {
                const data = await POST('/Proyectos/CargaComboProyecto', {}, false);
                if (data.Exito) {
                    InformeCostos.Controles.cmbProyectos
                        .empty()
                        .append(data.LstProyectos);
                    InformeCostos.Controles.cmbProyectos.selectpicker('refresh');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeAdvertencia('Ha habido un error');
                console.log(e);
            }
        },
        GeneraGraficaFases: (data) => {
            let myChart = echarts.init(document.getElementById('main'));
            myChart.setOption(InformeCostos.Funciones.ConfigPastel("Costos por Fase", data.data, data.values));
            $('#expGraficaFases').click(e => {
                e.preventDefault();
                ModalGrafica('main', 'Costos por fases', 'pie', data.values, data.data);
            })
        },
        GeneraGraficaRecursos: (data) => {
            let myChart = echarts.init(document.getElementById('main2'));
            myChart.setOption(InformeCostos.Funciones.ConfigPastel("Costos por Recursos", data.data, data.values));
            $('#expGraficaRecurso').click(e => {
                e.preventDefault();
                ModalGrafica('main', 'Costos por recurso', 'pie', data.values, data.data);
            })
        },
        GeneraGraficaPeriodo: (data) => {
            var myChart = echarts.init(document.getElementById('main3'));
            myChart.setOption(InformeCostos.Funciones.ConfigLineal(data.data, data.values));
            $('#expGraficaPeriodo').click(e => {
                e.preventDefault();
                ModalGrafica('main3', 'Costos por periodo', 'lineal', data.values, data.data);
            })
        },
        ConfigPastel: (name, data, values) => {
            const configPastel = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return `${params.seriesName}<br />
                                ${params.name}: $ ${formatMoney(params.data.value)} (${params.percent}%)`
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        magicType: { show: true, type: ['pie'], title: '' },
                        saveAsImage: { show: true, title: 'Descargar' }
                    }
                },
                series: [
                    {
                        avoidLabelOverlap: true,
                        name: name,
                        type: 'pie',
                        radius: ['50%', '70%'],
                        data: values
                    }
                ]
            };
            return configPastel;
        },
        ConfigLineal: (data, values) => {
            const configLineal = {
                title: { text: '', subtext: '' },
                tooltip: { trigger: 'axis' },
                legend: { data: ["Total", "Directo", "Indirecto"] },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        magicType: { show: true, type: ['line', 'bar'], title: '' },
                        saveAsImage: { show: true, title: 'Descargar' }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: data
                    }],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: { formatter: '{value}' }
                    }],
                series: values
            }
            return configLineal;
        }
    },
    Variables: {
        dtDetalle: null,
        tipo: ''
    }
}


InformeCostos.Funciones.Init();


function ModalGrafica(_id, _nombre, _tipo, _valores, _datos) {
    $('#GraficaModal').empty();
    $('#scriptsmodal').empty();
    $('#TablaModal').empty();
    $('#LblRdoGraficaM').click();

    $('#ModalGrafica').modal('show');
    $('#GraficaModal').show();
    $('#TablaModal').hide();
    $('#RdoGraficaM').trigger('change');
    $('#RdoGraficaM').prop('checked',true);
    MostrarGraficasM();

    const nombre = _nombre;
    const tipo = _tipo;
    const valores = _valores;
    const datos = _datos;
    const idGrafica = "graf" + _id;
    const varGrafica = "vargrafica" + idGrafica;
    const idTabla = "tab" + _id;
    const tabla = GenerarTablaGrafica(idTabla, datos, valores, tipo);

    $('#NombreGrafica').text(nombre);

    var tema = "temagraficas";

    if (nombre == "Urgentes/No urgentes") {
        var tema = "temagraficasurgentes"
    }

    if (tipo.toLowerCase() === "lineal") {
        let grafica = "<div id='" + idGrafica + "' style='height:600px;'></div>";

        let conf = {
            title: { text: '', subtext: '' },
            tooltip: { trigger: 'axis' },
            legend: { data: datos },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    magicType: { show: true, type: ['line', 'bar'], title: '' },
                    saveAsImage: { show: true, title: 'Descargar' }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: datos
                }],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: { formatter: '{value}' }
                }],
            series: valores
        }

        var script = "<script>"
            + " var " + varGrafica + " = echarts.init(document.getElementById('" + idGrafica + "')," + tema + ");"
            + "" + varGrafica + ".setOption(" + JSON.stringify(conf) + ");"
            + "</script>"

        $('#GraficaModal').append(grafica);
        $('#scriptsmodal').append(script);
    }
    if (tipo.toLowerCase() === "pie") {
        let grafica = "<div id='" + idGrafica + "' style='height:600px;'></div>";

        let conf = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${params.seriesName}<br />
                                ${params.name}: $ ${formatMoney(params.data.value)} (${params.percent}%)`
                }
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    magicType: { show: true, type: ['pie'], title: '' },
                    saveAsImage: { show: true, title: 'Descargar' }
                }
            },
            series: [
                {
                    avoidLabelOverlap: true,
                    name: nombre,
                    type: 'pie',
                    radius: ['50%', '70%'],
                    data: valores
                }
            ]
        };

        var script = "<script>"
            + " var " + varGrafica + " = echarts.init(document.getElementById('" + idGrafica + "')," + tema + ");"
            + "" + varGrafica + ".setOption(" + JSON.stringify(conf) + ");"
            + "</script>"

        $('#GraficaModal').append(grafica);
        $('#scriptsmodal').append(script);
    }

    $('#TablaModal').append(tabla);
    $(`#${idTabla}`).DataTable({ language: lenguajeEs });
}

function GenerarTablaGrafica(id, datos, valores, tipo) {
    let cuerpo =
        `<thead>
            <tr>
                <th>Dato</th>
                ${datos.map(x => `<th>${x}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${tipo === "lineal" ?
            valores.map(x => `<tr><td>${x.name}</td>${x.data.map(y => `<td>${y}</td>`).join("")}</tr>`).join("")
            : '<tr><td>Total</td>' + valores.map(x => `<td>${x.value}</td>`).join("") + "</tr>"}
        </tbody>`

    let tabla = '<div class="col-md-12">'
        + '                               <button class="btn btn-danger pull-right dropdown-toggle" style="margin-right: 10px; margin-bottom: 10px" data-toggle="dropdown"><i class="fa fa-bars"></i> Exportar</button>'
        + '                               <ul class="dropdown-menu pull-right" style="margin-top: 0px">'
        + ' <li><a href="#" onclick="$(' + "'#" + id + "'" + ').tableExport({type:' + "'excel',escape:" + "'false'" + '});' + '"' + '><img src="./Content/Project/Imagenes/xls.png" width="24" /> XLS</a></li>'
        + '                            </ul>'
        + '                           </div> '
        + ' <div class="panel-body" style="height:600px;">'
        + '                               <table id="' + id + '" class="table table-striped">'
        + '' + cuerpo
        + '                               </table>'
        + '                           </div> '



    return tabla;
}

function MostrarGraficasM() {
    $('#TablaModal').hide();
    $('#GraficaModal').show();
}

function MostrarTablasM() {
    $('#TablaModal').show();
    $('#GraficaModal').hide();
}
