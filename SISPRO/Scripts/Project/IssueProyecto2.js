const IssueProyecto = {
    Controles: {
        dtIssue: $('#dtIssue'),
        documento: $(document),
        mdlComentarios: $('#mdlComentarios'),
        btnNuevo: $('#btnNuevo'),
        btnExportar: $('#btnExportar'),
        cmbFiltroProyecto: $('#cmbFiltroProyecto'),
        cmbFiltroEstatus: $('#cmbFiltroEstatus'),
        btnFiltrar: $('#btnFiltrar'),
        IdProyecto: $('#IdProyecto'),
        inputFiltro: $('#modulo-issues').find('#dtIssue input'),
        window: window
    },
    Constantes: {
        colIssue: [
            {
                "data": "NoIssue",
                "class": "text-left",
                "render": data => `<a class="btnEditarIssue" role="button">${data}</a>`
            },
            //{
            //    "data": "FechaDeteccion",
            //    "class": "text-center",
            //    "render": data => moment(data).format("DD-MM-YYYY")
            //},
            //{
            //    "class": "text-left",
            //    "render": (_data, _type, row) => row.Usuario.NombreCompleto === "" ? row.ResponsableExterno : row.Usuario.NombreCompleto
            //},
            //{
            //    "data": "FechaCompromiso",
            //    "class": "text-center",
            //    "render": data => data ? moment(data).format("DD-MM-YYYY") : ''
            //},
            {
                "data": "Descripcion",
                "class": "text-left",
                "render": data => `<div class="issue-comentario-desc" style-"width: 100%">${data}</div>`
            },
            //{
            //    "data": "Prioridad.DescLarga",
            //    "class": "text-left"
            //},
            {
                "data": "Estatus",
                "class": "text-left",
                "render": data => `<label class="badge" style="width: 100%; color: white; background-color: ${data.DatoEspecial}">${data.DescLarga}</label>`
            },
            //{
            //    "data": "Bloqueante",
            //    "class": "text-left",
            //    "render": data => data ? '<label class="badge badge-danger">Sí<label>' : 'No'
            //},
            {
                "data": "ProyectoIssueComentario",
                "class": "text-left position-relative",
                "render": data => IssueProyecto.Funciones.Comentarios.DibujarComentarios(data)
            },
            //{
            //    "data": "FechaCierre",
            //    "class": "text-center",
            //    "render": data => data ? moment(data).format("DD-MM-YYYY") : ''
            //},
            {
                "class": "text-right",
                "render": (data, _, row) => {
                    let diferencia;
                    if (row.FechaCierre) {
                        diferencia = moment(row.FechaCierre).diff(moment(row.FechaDeteccion), 'days');
                    } else {
                        diferencia = moment(new Date().getTime()).diff(moment(row.FechaDeteccion), 'days');
                    }
                    return diferencia;
                }
            },

        ],
        urlLeerIssue: $('#LeerIssue').val(),
        urlDescargarExcelIssue: $('#DescargarExcelIssue').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            IssueProyecto.Funciones.InicializaTablaIssue([]);
            IssueProyecto.Controles.btnNuevo.off('click').click(IssueProyecto.Funciones.ClickBtnNuevo);
            IssueProyecto.Controles.btnExportar.off('click').click(IssueProyecto.Funciones.ClickBtnExportar);
            IssueProyecto.Controles.btnFiltrar.off('click').click(IssueProyecto.Funciones.LeerIssue);
            IssueProyecto.Controles.dtIssue.off('page.dt').on('page.dt', Imagenes.ActualizarTamanoImagenes.Resize);
            IssueProyecto.Controles.documento.off('click', '.btnEditarIssue').on('click', '.btnEditarIssue', IssueProyecto.Funciones.ClickBtnEditar);
            IssueProyecto.Controles.documento.off('click', '.modulo-issues.btnVerComentarios').on('click', '.modulo-issues.btnVerComentarios', IssueProyecto.Funciones.LeerComentarios);
            IssueProyecto.Controles.window.addEventListener('resize', Imagenes.ActualizarTamanoImagenes.Resize, false);
            IssueProyecto.Variables.Filtros.IdProyecto = parseInt(IssueProyecto.Controles.IdProyecto.val() ?? 0);
            IssueProyecto.Controles.inputFiltro.off('keyup change clear').on('keyup change clear', IssueProyecto.Funciones.FiltrarTabla);
        }
    },
    Funciones: {
        FiltrarTabla: e => {
            IssueProyecto.Variables.dtIssue.api().column($(e.target).closest('th').index()).search(e.target.value).draw();
        },
        ActualizarFiltrosTabla: () => {
            IssueProyecto.Variables.dtIssue.api().columns().every(function () {
                $(this.header()).parent().next('tr').find('th').eq(this.index()).find('input').val(this.search())
            });
        },
        Comentarios: {
            DibujarComentarios: (data) => {
                const tamaño = data.length;
                let comentarios = '';
                data.forEach((comentario, i) => {
                    if ((i + 1) > (tamaño - 1)) {
                        comentarios +=
                            IssueProyecto.Funciones.Comentarios.ComentarioTabla(comentario.Usuario.imgURL, comentario.Usuario.NumEmpleado, comentario.Usuario.NombreCompleto, moment(comentario.FechaCreo).format("DD-MMM-YYYY"), comentario.Comentario, tamaño);
                    }
                });
                if (tamaño === 0) comentarios = `<button class="btnTooltip modulo-issues btnVerComentarios fa fa-comments" data-toggle="tooltip" title="Ver todos los comentarios (${tamaño})"></button>`
                return `<div class="comentario-tabla">${comentarios}</div>`;
            },
            ComentarioTabla: (urlImg, cveU, nombre, fecha, comentario, tamaño) =>
                `<div class="comentario-tabla-container">
               
                     <div class="second">
                        <small>${nombre} ${fecha}</small>
                        <p>${comentario}</p>
                     </div>
                 </div>
                 <button class="btnTooltip modulo-issues btnVerComentarios fa fa-comments" data-toggle="tooltip" title="Ver todos los comentarios (${tamaño})"></button>`,
            DataUsuario: nombre => `<label style='margin: 0px'>${nombre}</label>`,
            DataUrl: urlImg => `<div class='center-cropper'><div class='data-tooltip'><img src='${urlImg}'/></div></div>`,
        },
        LeerComentarios: e => {
            e.preventDefault();
            e.stopPropagation();

            const id = IssueProyecto.Variables.dtIssue.api().row($(e.target).closest('tr')).data().IdIssue;
            IssueComentarios.Funciones.MostrarComentarios(id);
        },
        LeerIssue: async (loading = true) => {
            const data = await POST(IssueProyecto.Constantes.urlLeerIssue,
                IssueProyecto.Variables.Filtros,
                loading);

            if (data.Exito) {
                const issues = data.Issues;
                IssueProyecto.Funciones.InicializaTablaIssue(issues);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ClickBtnNuevo: e => {
            e.preventDefault();
            e.stopPropagation();

            Issue.Funciones.NuevoIssue(IssueProyecto.Variables.Filtros.IdProyecto);
        },
        ClickBtnEditar: e => {
            e.preventDefault();
            e.stopPropagation();

            const id = IssueProyecto.Variables.dtIssue.api().row($(e.target).closest('tr')).data().IdIssue;
            Issue.Funciones.EditarIssue(id);
        },
        ClickBtnExportar: e => {
            e.preventDefault();
            e.stopPropagation();

            IssueProyecto.Variables.dtIssue.api().rows({ filter: 'applied' }).every(function () {
                IssueProyecto.Variables.listaIssues.push(this.data().IdIssue);
            });

            const form = new FormData();
            for (const id of IssueProyecto.Variables.listaIssues) {
                form.append('listaIssues[]', id);
            }

            if (IssueProyecto.Variables.listaIssues.length === 0) {
                MensajeAdvertencia("No hay registros para exportar");
                return;
            }

            DOWNLOAD(
                IssueProyecto.Constantes.urlDescargarExcelIssue,
                'Resumen_Issues.xlsx',
                form,
                true
            );

            IssueProyecto.Variables.listaIssues = [];
        },
        Init: () => {
            IssueProyecto.Funciones.InicializaTablaIssue([]);
            IssueProyecto.Eventos.InicializaEventos();
            IssueProyecto.Funciones.LeerIssue();
            IssueProyecto.Variables.Actualizacion.actualizar();
            IssueProyecto.Variables.Actualizacion.actualizarComentarios();
        },
        InicializaTablaIssue: issues => {
            IssueProyecto.Variables.dtIssue =
                InicializaTabla({ tabla: IssueProyecto.Controles.dtIssue, datos: issues, columnas: IssueProyecto.Constantes.colIssue});
            Imagenes.ActualizarTamanoImagenes.ActualizarImagenes();
            IssueProyecto.Funciones.ActualizarFiltrosTabla();
        },
    },
    Variables: {
        dtIssue: null,
        Resize: {
            rtime: null,
            timeout: false,
            delta: 200
        },
        Filtros: {
            Proyectos: [],
            Estatus: [],
            IdProyecto: 0
        },
        Actualizacion: {
            actualizar: () => { Issue.Variables.Actualizacion = new Proxy(Issue.Variables.Actualizacion, IssueProyecto.Variables.Actualizacion.handler) },
            actualizarComentarios: () => { IssueComentarios.Variables.Actualizacion = new Proxy(IssueComentarios.Variables.Actualizacion, IssueProyecto.Variables.Actualizacion.handler) },
            handler: {
                set(target, property, value) {
                    target[property] = value;
                    IssueProyecto.Funciones.LeerIssue(false);
                }
            }
        },
        listaIssues: []
    }
}



