const IssueGeneral = {
    Controles: {
        dtIssue: $('#dtIssue'),
        documento: $(document),
        mdlComentarios: $('#mdlComentarios'),
        btnNuevo: $('#btnNuevo'),
        btnExportar: $('#btnExportar'),
        cmbFiltroProyecto: $('#cmbFiltroProyecto'),
        cmbFiltroEstatus: $('#cmbFiltroEstatus'),
        btnFiltrar: $('#btnFiltrar'),
        inputFiltro: $('#dtIssue input'),
        window: window
    },
    Constantes: {
        lenguajeEs: {
            "lengthMenu": "Mostrando _MENU_ registros por página",
            "zeroRecords": "Sin resultados",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "info": "Página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "search": ""
        },
        colIssue: [
            {
                "data": "NoIssue",
                "class": "text-left",
                "render": data => `<a class="btnEditarIssue" role="button">${data}</a>`
            },
            {
                "data": "Proyecto.Nombre",
                "class": "text-left"
            },
            //{
            //    "data": "FechaDeteccion",
            //    "class": "text-center",
            //    "render": data => moment(data).format("DD-MM-YYYY")
            //},
            {
                "class": "text-left",
                "render": (_data, _type, row) => row.Usuario.NombreCompleto === "" ? row.ResponsableExterno : row.Usuario.NombreCompleto
            },
            {
                "data": "FechaCompromiso",
                "class": "text-center",
                "render": data => data ? moment(data).format("DD-MM-YYYY") : ''
            },
            {
                "data": "Descripcion",
                "class": "text-left",
                "render": data => `<div class="issue-comentario-desc" style-"width: 100%">${data}</div>`
            },
            {
                "data": "Prioridad.DescLarga",
                "class": "text-left"
            },
            {
                "data": "Estatus",
                "class": "text-left",
                "render": data => `<label class="badge" style="width: 100%; color: white; background-color: ${data.DatoEspecial}">${data.DescLarga}</label>`
            },
            {
                "data": "Bloqueante",
                "class": "text-left",
                "render": data => data ? '<label class="badge badge-danger">Sí<label>' : 'No'
            },
            {
                "data": "ProyectoIssueComentario",
                "class": "text-left position-relative",
                "render": data => IssueGeneral.Funciones.Comentarios.DibujarComentarios(data)
            },
            {
                "data": "FechaCierre",
                "class": "text-center",
                "render": data => data ? moment(data).format("DD-MM-YYYY") : ''
            },
            {
                "data": "ResponsableExterno",
                "visible": false
            },
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
    Variables: {
        dtIssue: null,
        Resize: {
            rtime: null,
            timeout: false,
            delta: 200
        },
        Filtros: {
            Proyectos: [],
            Estatus: []
        },
        Actualizacion: {
            actualizar: () => { Issue.Variables.Actualizacion = new Proxy(Issue.Variables.Actualizacion, IssueGeneral.Variables.Actualizacion.handler) },
            //actualizar: () => IssueGeneral.Variables.Actualizacion.handler,
            //actualizarComentarios: () => IssueGeneral.Variables.Actualizacion.handler,
            actualizarComentarios: () => { IssueComentarios.Variables.Actualizacion = new Proxy(IssueComentarios.Variables.Actualizacion, IssueGeneral.Variables.Actualizacion.handler) },
            handler: {
                set(target, property, value) {
                    target[property] = value;
                    IssueGeneral.Funciones.LeerIssue(false);
                }
            }
        },
        listaIssues: []
    },
    Eventos: {
        InicializaEventos: () => {
            IssueGeneral.Funciones.InicializaTablaAuditoria([]);
            IssueGeneral.Controles.btnNuevo.click(IssueGeneral.Funciones.ClickBtnNuevo);
            IssueGeneral.Controles.btnExportar.click(IssueGeneral.Funciones.ClickBtnExportar);
            IssueGeneral.Controles.btnFiltrar.click(IssueGeneral.Funciones.LeerIssue);
            IssueGeneral.Controles.cmbFiltroProyecto.change(IssueGeneral.Funciones.ActualizarFiltros);
            IssueGeneral.Controles.cmbFiltroEstatus.change(IssueGeneral.Funciones.ActualizarFiltros);
            /*            IssueGeneral.Controles.dtIssue.on('page.dt', Imagenes.ActualizarTamanoImagenes.Resize);*/
            IssueGeneral.Controles.documento.on('click', '.btnEditarIssue', IssueGeneral.Funciones.ClickBtnEditar);
            IssueGeneral.Controles.documento.on('click', '.btnVerComentarios', IssueGeneral.Funciones.LeerComentarios);
            /*      IssueGeneral.Controles.window.addEventListener('resize', Imagenes.ActualizarTamanoImagenes.Resize, false);*/
            IssueGeneral.Controles.inputFiltro.on('keyup change clear click', IssueGeneral.Funciones.FiltrarTabla);
            $('input[name="options"]').change(function () { IssueGeneral.Variables.dtIssue.api().draw(); });
        }
    },
    Funciones: {
        POSTI: function (url, parametros = {}, loading = true, formData = false) {
            return $.ajax({
                url: url,
                type: "POST",
                contentType: formData ? false : "application/json; charset=utf-8",
                dataType: "json",
                processData: !formData,
                data: formData ? parametros : JSON.stringify(parametros),
        /*        beforeSend: function () { if (loading) { IssueGeneral.Funciones.CargaLoading(); } }*/
            })
        },
        inicializaTabla: function (tabla, datos, columnas, columnaOrdena = 0, tipoOrdenacion = 'asc', paginada = true, encabezadoFijo = true, incluyeBusqueda = true, nonOrderableColumns = []) {
            var tablaConstruida;

            tablaConstruida = tabla.dataTable({
                language: IssueGeneral.Constantes.lenguajeEs,
                responsive: true,
                fixedHeader: encabezadoFijo,
                searching: incluyeBusqueda,
                stateSave: true,
                "bSort": false,
                search: {
                    smart: true
                },
                "bSortCellsTop": true,
                "bAutoWidth": false,
                "bLengthChange": true,
                "bPaginate": paginada,
                destroy: true,
                data: datos,
                columns: columnas,
                ordering: true,
                "columnDefs": [
                    { "orderable": false, "targets": nonOrderableColumns }
                ],
                "order": [[columnaOrdena, tipoOrdenacion]],
            });

            return tablaConstruida;
        },
        //CargaLoading: function () {
        //    window.loading_screen = window.pleaseWait({
        //        backgroundColor: 'rgba(255,255,255,0.8)',
        //        immediately: true,
        //        loadingHtml: "<i class='fa fa-rotate-right fa-spin text-default'></i><p class='loading-message'>Cargando...</p>"
        //    });
        //}        ,
        FiltrarTabla: e => {
            IssueGeneral.Variables.dtIssue.api().column($(e.target).closest('th').index()).search(e.target.value).draw();
        },
        ActualizarFiltros: e => {
            if (e.target.id === 'cmbFiltroProyecto') IssueGeneral.Variables.Filtros.Proyectos = $(e.target).val() ?? [];
            if (e.target.id === 'cmbFiltroEstatus') IssueGeneral.Variables.Filtros.Estatus = $(e.target).val() ?? [];
        },
        Comentarios: {
            DibujarComentarios: (data) => {
                const tamaño = data.length;
                let comentarios = '';
                data.forEach((comentario, i) => {
                    if ((i + 1) > (tamaño - 1)) {
                        comentarios +=
                            IssueGeneral.Funciones.Comentarios.ComentarioTabla(comentario.Usuario.imgURL, comentario.Usuario.NumEmpleado, comentario.Usuario.NombreCompleto, moment(comentario.FechaCreo).format("DD-MMM-YYYY"), comentario.Comentario, tamaño);
                    }
                });
                if (tamaño === 0) comentarios = `<button class="btnTooltip btnVerComentarios fa fa-comments" data-toggle="tooltip" title="Ver todos los comentarios (${tamaño})"></button>`
                return `<div class="comentario-tabla">${comentarios}</div>`;
            },
            ComentarioTabla: (urlImg, cveU, nombre, fecha, comentario, tamaño) =>
                `<div class="comentario-tabla-container">
                     <div class="first">
                        <div class='center-cropper'><div class='tabla'><img src="${urlImg}" title="" alt="${cveU}" data-usuario="${IssueGeneral.Funciones.Comentarios.DataUsuario(nombre)}" data-url="${IssueGeneral.Funciones.Comentarios.DataUrl(urlImg)}" class="u-a-i" /></div></div>               
                     </div>
                     <div class="second">
                        <small>${nombre}</small>
                        <p>${comentario}</p>
                     </div>
                 </div>
                 <button class="btnTooltip btnVerComentarios fa fa-comments" data-toggle="tooltip" title="Ver todos los comentarios (${tamaño})"></button>`,
            DataUsuario: nombre => `<label style='margin: 0px'>${nombre}</label>`,
            DataUrl: urlImg => `<div class='center-cropper'><div class='data-tooltip'><img src='${urlImg}'/></div></div>`,
        },
        LeerComentarios: e => {
            e.preventDefault();
            e.stopPropagation();

            const id = IssueGeneral.Variables.dtIssue.api().row($(e.target).closest('tr')).data().IdIssue;
            IssueComentarios.Funciones.MostrarComentarios(id);
        },

        LeerIssue: async (loading = true) => {
            const data = await IssueGeneral.Funciones.POSTI(
                url = IssueGeneral.Constantes.urlLeerIssue,
                parametros = IssueGeneral.Variables.Filtros,
                loading = loading,
                formData= false            );

            if (data.Exito) {
                const issues = data.Issues;
                IssueGeneral.Funciones.InicializaTablaAuditoria(issues);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },

        ClickBtnNuevo: e => {
            e.preventDefault();
            e.stopPropagation();

            Issue.Funciones.NuevoIssue();
        },
        ClickBtnEditar: e => {
            e.preventDefault();
            e.stopPropagation();

            const id = IssueGeneral.Variables.dtIssue.api().row($(e.target).closest('tr')).data().IdIssue;
            Issue.Funciones.EditarIssue(id);
        },
        ClickBtnExportar: e => {
            e.stopPropagation();

            const form = new FormData();
            IssueGeneral.Variables.dtIssue.api().rows({ filter: 'applied' }).every(function () {
                IssueGeneral.Variables.listaIssues.push(this.data().IdIssue);
                form.append('listaIssues[]', this.data().IdIssue);
            });

            if (IssueGeneral.Variables.listaIssues.length === 0) {
                MensajeAdvertencia("No hay registros para exportar");
                return;
            }

            DOWNLOAD(
                IssueGeneral.Constantes.urlDescargarExcelIssue,
                'Resumen_Issues.xlsx',
                form,
                true
            );

            IssueGeneral.Variables.listaIssues = [];
        },
        Init: () => {
            IssueGeneral.Funciones.InicializaTablaAuditoria([]);
            IssueGeneral.Eventos.InicializaEventos();
            IssueGeneral.Funciones.LeerIssue();
            IssueGeneral.Funciones.LeerCombos();
            IssueGeneral.Variables.Actualizacion.actualizar();
            IssueGeneral.Variables.Actualizacion.actualizarComentarios();
        },
        InicializaTablaAuditoria: issues => {
            IssueGeneral.Variables.dtIssue = IssueGeneral.Funciones.inicializaTabla(IssueGeneral.Controles.dtIssue, issues, IssueGeneral.Constantes.colIssue);
            Imagenes.ActualizarTamanoImagenes.ActualizarImagenes();
            IssueGeneral.Funciones.ActualizarFiltrosTabla();
        },
        ActualizarFiltrosTabla: () => {
            IssueGeneral.Variables.dtIssue.api().columns().every(function () {
                const input = $(this.header()).parent().next('tr').find('th').eq(this.index()).find('input');

                input.autocomplete(
                    {
                        source: this.nodes().to$().toArray().map(e => e.innerText).filter(Distinct).sort(),
                        change: IssueGeneral.Funciones.FiltrarTabla,
                        select: function (a, b) {
                            $(this).val(b.item.value);
                            $(this).autocomplete('close');
                            IssueGeneral.Funciones.FiltrarTabla(a);
                        }
                    });
                input.data("ui-autocomplete")?._trigger("change");
                input.val(this.search())
            });
        },
        LeerCombos: async () => {
            try {
                const data = await Promise.all([
                    IssueGeneral.Funciones.POSTI(Issue.Constantes.urlLeerComboProyecto(), { multiple: true }, false),
                    IssueGeneral.Funciones.POSTI(Issue.Constantes.urlLeerComboIssueEstatus(), { multiple: true }, false)
                ])

                const error = data.find(x => !x.Exito);
                if (error) {
                    MensajeAdvertencia(error.Mensaje);
                    return error;
                } else {
                    IssueGeneral.Controles.cmbFiltroProyecto.empty().append(data[0].CmbProyecto);
                    IssueGeneral.Controles.cmbFiltroEstatus.empty().append(data[1].CmbEstatus);
                    IssueGeneral.Controles.cmbFiltroProyecto.selectpicker('refresh');
                    IssueGeneral.Controles.cmbFiltroEstatus.selectpicker('refresh');
                }
            } catch (error) {
                console.log(error);
            
           /*     MensajeError(error);*/
            }
        }
    }

}

IssueGeneral.Funciones.Init();

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var opt = parseInt($('input[name="options"]:checked').val(), 10);

        var dato = data[10]; // use data for the age column

        if (opt === 0) {
            return true;
        }
        else if (opt === 1 && dato === "") {
            return true
        } else if (opt === 2 && dato !== "") {
            return true;
        }
        return false;
    }
);