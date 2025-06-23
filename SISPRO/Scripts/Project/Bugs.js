var Usuario;
var TipoUsuario;
var EsBug = true;

var lacalesDTRP = {
    format: 'DD/MM/YYYY',
    applyLabel: 'Aplicar',
    cancelLabel: 'Cancelar',
    fromLabel: 'De:',
    toLabel: 'A:',
    customRangeLabel: 'Personalizar rango',
    daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};

const Bugs = {
    Constantes: {
        colActividades: [
            //{
            //    "class": "text-center",
            //    "render": () => '<button style="height: 30px" class="btn btn-default btn-small fa fa-list-alt btnVerActividad T"></button>'
            //},

            //{
            //    "data": "AsignadoPath",
            //    "class": "text-center",
            //    "render": data => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
            //},
            {
                "data": "IdActividadStr",
                "class": "text-left",
                "render": (data, row) => `<button style="color: #337ab7" class="btn btn-link btnVerActividad T">${data}</button>`
            },


            //{
            //    "data": "IdActividadRef",
            //    "class": "text-center",
            //    "render": (data, row) => `<a href="#" onclick="clickalerta(${data})">${data}</a>`
            //},
            {
                "data": "Estatus",
                "class": "text-center",
                "render": (data, _type, row) => {
                    let color = '';
                    let rechazada = ''
                    const estatus = row.Estatus;

                    if (data == 'A') {

                        return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-info "></span> </button>';

                    }
                    else if (data == 'P') {
                        return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-progress "></span> </button>';

                    }
                    else if (data == 'R' || data == 'V') {
                        return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-warning "></span> </button>';

                    }
                    else if (data == 'X') {
                        return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-danger "></span> </button>';

                    }
                    else if (data == 'L') {
                        return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-success "></span> </button>';

                    }
                    else if (data == 'C') {
                        return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-muted "></span> </button>';

                    }

           
                }
            },
           
            {
                "data": "BR",
                "class": "text-left",
            },
            {
                "data": "PrioridadStr",
                "class": "text-left",
            },
            {
                "data": "ProyectoStr",
                "class": "text-left",
            },

            {
                "data": "ClasificacionStr",
                "class": "text-left",
            },
            {
                "data": "Sprint",
                "class": "text-left",
            },
            {
                "data": "ClaveUsuario",
                "class": "text-left",
                "render": function (data, type, row) {
                    if (data == "") {

                        return "";
                    }
                    else {

                        return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.AsignadoStr}" class="img-dt" style="width: 35px; height: 35px" />`
                    }

                }
            },
            {
                "data": "ResponsablePath",
                "class": "text-left",
                "render": function (data, type, row) {
                    if (data == "") {

                        return "";
                    }
                    else {

                        return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.ResponsableStr}" class="img-dt" style="width: 35px; height: 35px" />`
                    }

                }
            },

            {
                "data": "FechaCreo",
                "class": "text-center",
                "render": data => (data === null || data === "" ? "" : moment(data).format("YYYY/MM/DD"))
            },
            {
                "data": "FechaTermino",
                "class": "text-center",
                "render": data => (data === null || data === "" ? "" : moment(data).format("YYYY/MM/DD"))
            },
            {
                "data": "HorasFinales",
                "class": "text-right",
            },

            {
                "data": "MotivoRechazoId",
                "visible": false
            },
            {
                "data": "IdActividad",
                "class": "text-center",
                "visible": false
            },
            {
                "data": "DescripcionRechazo",
                "visible": false
            },
            {
                "class": "text-center",
                "render": (_data, _type, row) =>
                    '<div class="btn-group pull-right" >'
                    + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                    '<span class="caret"></span>' +
                    '<span class="sr-only">Toggle Dropdown</span>'
                    + '</button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                    '<li><a href="#" onclick="CapturaTrabajo(' + row.IdActividad + "," + row.PSP + ",'" + row.ClasificacionStr + "'" + ' )"> <i class="fa fa-share pull-right"></i>Captura trabajo</a></li>' +
                    '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                    '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                    '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +
                    '<li class="divider"></li>' +
                    '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                    '</ul></div>'
            },
        ],
        colActividadesV: [
            {
                "class": "text-center",
                "render": () => Bugs.Variables.validar ? '<input type="checkbox" class="SeleccionarV">' : ''
            },

            {
                "data": "IdActividadStr",
                "class": "text-left",
                "render": (data, row) => `<button style="color: #337ab7" class="btn btn-link btnVerActividad V">${data}</button>`
            },

            {
                "data": "BR",
                "class": "text-left",
            },
            {
                "data": "ProyectoStr",
                "class": "text-left",
            },

            {
                "data": "ClasificacionStr",
                "class": "text-left",
            },
            {
                "data": "Sprint",
                "class": "text-left",
            },
            {
                "data": "ClaveUsuario",
                "class": "text-left",
                "render": function (data, type, row) {
                    if (data == "") {

                        return "";
                    }
                    else {

                        return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.AsignadoStr}" class="img-dt" style="width: 35px; height: 35px" />`
                    }

                }
            },
            {
                "data": "ResponsablePath",
                "class": "text-left",
                "render": function (data, type, row) {
                    if (data == "") {

                        return "";
                    }
                    else {

                        return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.ResponsableStr}" class="img-dt" style="width: 35px; height: 35px" />`
                    }

                }
            },

            //{
            //    "data": "AsignadoStr",
            //    "class": "text-left",
            //},
            //{
            //    "data": "ResponsableStr",
            //    "class": "text-left",
            //},
            //{
            //    "data": "HorasAsignadas",
            //    "class": "text-right sum",
            //},
            {
                "data": "FechaCreo",
                "class": "text-center",
                "render": data => (data === null || data === "" ? "" : moment(data).format("YYYY/MM/DD"))
            },
            {
                "data": "FechaTermino",
                "class": "text-center",
                "render": data => (data === null || data === "" ? "" : moment(data).format("YYYY/MM/DD"))
            },
            {
                "data": "HorasFinales",
                "class": "text-right",
            },

            {
                "class": "text-center",
                "render": (_data, _type, row) =>
                    '<div class="btn-group pull-right" >'
                    + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                    '<span class="caret"></span>' +
                    '<span class="sr-only">Toggle Dropdown</span>'
                    + '</button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                    '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                    '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                    '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +
                    '<li class="divider"></li>' +
                    '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                    '</ul></div>'
            },
            {
                "data": "IdActividad",
                "class": "text-center",
                "visible": false
            },
        ],
        colActividadesL: [
            {
                "class": "text-center",
                "render": () => Bugs.Variables.liberar ? '<input type="checkbox" class="SeleccionarL">' : ''
            },
            //{
            //    "class": "text-center",
            //    "render": () => '<button style="height: 30px" class="btn btn-default btn-small fa fa-list-alt btnVerActividad L"></button>'
            //},

            //{
            //    "data": "AsignadoPath",
            //    "class": "text-center",
            //    "render": data => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
            //},
            {
                "data": "IdActividadStr",
                "class": "text-left",
                "render": (data, row) => `<button style="color: #337ab7" class="btn btn-link btnVerActividad L">${data}</button>`
            },

            //{
            //    "data": "IdActividadRef",
            //    "class": "text-center",
            //    "render": data => `<a href="#" onclick="clickalerta(${data})">${data}</a>`
            //},
            {
                "data": "BR",
                "class": "text-left",
            },
            {
                "data": "ProyectoStr",
                "class": "text-left",
            },

            {
                "data": "ClasificacionStr",
                "class": "text-left",
            },
            {
                "data": "AsignadoStr",
                "class": "text-left",
            },
            {
                "data": "ResponsableStr",
                "class": "text-left",
            },

            {
                "data": "FechaSolicitado",
                "class": "text-center",
                "render": data => (data === null || data === "" ? "" : moment(data).format("YYYY/MM/DD"))
            },
            {
                "data": "FechaTermino",
                "class": "text-center",
                "render": data => (data === null || data === "" ? "" : moment(data).format("YYYY/MM/DD"))
            },
            {
                "data": "HorasFinales",
                "class": "text-right",
            },

            {
                "class": "text-center",
                "render": (_data, _type, row) =>
                    '<div class="btn-group pull-right" >'
                    + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                    '<span class="caret"></span>' +
                    '<span class="sr-only">Toggle Dropdown</span>'
                    + '</button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                    '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                    '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                    '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +
                    '<li class="divider"></li>' +
                    '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                    '</ul></div>'
            },
            {
                "data": "IdActividad",
                "class": "text-center",
                "visible": false
            },
        ],
        urlCargaCombosFiltros: $('#CargaCombosFiltros').val(),
        urlLeerBugs: $('#LeerBugs').val(),
        urlValidacionMasiva: $('#ValidacionMasiva').val(),
        urlLiberacionMasiva: $('#LiberacionMasiva').val(),
        urlImportarBugs: $('#ImportarBugs').val(),
        urlDescargarExcelBug: $('#DescargarExcelBug').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            $('#BtnFiltrar').click(Bugs.Funciones.LeerBugs);
            $('#BtnModalImportar').click(Bugs.Funciones.AbrirModalImportar); 
            $('#btnImportar').click(Bugs.Funciones.ImportarBugs);
            $('#BtnNuevaActividad').click(Bugs.Funciones.NuevaActividad);
            $('#BtnExportar').click(Bugs.Funciones.ExportarBugs);
            $('#ChkTodosV').click(Bugs.Funciones.SeleccionarTodosValidacion);
            $('#BtnValidacionM').click(Bugs.Funciones.ValidacionMasiva);
            $(document).on('click', '.SeleccionarV', Bugs.Funciones.SeleccionarValidacion);
            $('#ChkTodosL').click(Bugs.Funciones.SeleccionarTodosLiberacion);
            $('#BtnLiberacionM').click(Bugs.Funciones.LiberacionMasiva);
            $('input[name="TipoCarga"]').click(Bugs.Funciones.CambiaArchivoLayout);
            $(document).on('click', '.SeleccionarL', Bugs.Funciones.SeleccionarLiberacion);
            $(document).on('click', '.btnVerActividad', Bugs.Funciones.EditarActividad);
        }
    },
    Funciones: {
        Init: () => {
           /* $('.datetimepicker').datetimepicker({ format: 'DD/MM/YYYY' });*/
            Bugs.Eventos.InicializaEventos();
            Bugs.Funciones.CargaCombosFiltros();
          
            $('.DateRangePicker').daterangepicker({
                locale: lacalesDTRP,
                ranges: {
                    'Hoy': [moment(), moment()],
                    'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Últimos 7 días ': [moment().subtract(6, 'days'), moment()],
                    'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                    'Este mes': [moment().startOf('month'), moment().endOf('month')],
                    'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    "Este año": [moment().startOf('year'), moment().endOf('year')],
                    "Último año": [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                },
                startDate: moment().startOf('month'),
                endDate: moment().endOf('month')
            });

            $('#TxtRangoFechas').val(moment().subtract(90, 'days').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));


            Bugs.Funciones.LeerBugs();

            $(".filter-settings-icon").on("click", function () {
                $(".filter-settings").toggleClass("active");
            });
        },
        CambiaArchivoLayout: e => {
            const tipo = e.target.value;
            if (tipo === 'c') {
                $('#layoutCrearBug').removeClass('hidden');
                $('#layoutActualizarBug').addClass('hidden');
            } else {
                $('#layoutCrearBug').addClass('hidden');
                $('#layoutActualizarBug').removeClass('hidden');
            }
        },
        ExportarBugs: e => {
            e.preventDefault();
            e.stopPropagation();

            if (Bugs.Variables.dtActividades.api().rows()[0].length === 0) {
                MensajeAdvertencia("No hay registros para exportar");
                return;
            }

            const form = new FormData();

            //const filtros = {

            //    FechaSolIni: ($("#TxtRangoFechas").val()).split('-')[0],
            //    FechaSolFin: ($("#TxtRangoFechas").val()).split('-')[1],
            //    LstClasificacion: $('#SelClasificacionF').val(),
            //    LstResponsable: $('#SelResponsableF').val(),
            //    LstAsignado: $('#SelUsuarioAsignadoF').val(),
            //    LstProyecto: $('#SelProyectoF').val(),
            //    LstEstatus: $('#SelEstatusF').val(),

            //}

            form.append("FechaSolIni", ($("#TxtRangoFechas").val()).split('-')[0]);
            form.append("FechaSolFin", ($("#TxtRangoFechas").val()).split('-')[1]);
            form.append("LstClasificacion", $('#SelClasificacionF').val());
            form.append("LstResponsable", $('#SelResponsableF').val());
            form.append("LstAsignado", $('#SelUsuarioAsignadoF').val());
            form.append("LstEstatus", $('#SelEstatusF').val());
            form.append("LstProyecto", $('#SelProyectoF').val());
           


            

            //Bugs.Variables.dtActividades.api().rows({ filter: 'applied' }).every(function () {
            //    form.append('listaActividades[]', this.data().IdActividad);
            //});

            DOWNLOAD(
                Bugs.Constantes.urlDescargarExcelBug,
                'Bugs.xlsx',
                form,
                true
            );
        },
        AbrirModalImportar: e => {
            e.preventDefault();
            $('#mdlImportar').modal('show');
        },
        ImportarBugs: async e => {
            e.preventDefault();
            e.stopPropagation();

            let form = new FormData();
            form.append('archivo', document.getElementById('fileImportar').files[0]);
            form.append('tipoCarga', $('[name="TipoCarga"]:checked').val());

            const data = await POST(
                Bugs.Constantes.urlImportarBugs,
                form,
                true,
                true
            );

            if (data.Exito) {
                MensajeExito(data.Mensaje);
                Bugs.Funciones.LeerBugs();
                // eslint-disable-next-line
                document.getElementById('fileImportar').value = '';
                $('.file-input-name').text('');
                $('#rdo1').prop('checked', true);
                $('#layoutCrearBug').removeClass('hidden');
                $('#layoutActualizarBug').addClass('hidden');
                $('#mdlImportar').modal('hide');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        ValidacionMasiva: async e => {
            e.preventDefault();

            const ids = Bugs.Variables.dtActividadesV.api().rows($('input[type="checkbox"]:checked').closest('tr')).data().map(x => x.IdActividad).join();

            if (ids.length === 0) {
                MensajeAdvertencia('No ha seleccionado ninguna actividad.');
            } else {
                const data = await POST(Bugs.Constantes.urlValidacionMasiva, { Actividades: ids });

                if (data.Exito) {
                    Bugs.Funciones.LeerBugs();
                    MensajeExito(data.Mensaje);
                }
                else {
                    MensajeAdvertencia(data.Mensaje);
                }
            }
        },
        SeleccionarTodosValidacion: e => {
            Bugs.Variables.dtActividadesV.api().column(0).nodes().to$().find('input[type="checkbox"]').prop('checked', $(e.target).prop('checked'));
        },
        SeleccionarValidacion: () => {
            const total = Bugs.Variables.dtActividadesV.api().column(0).nodes().to$().find('input[type="checkbox"]').length;
            const seleccionados = Bugs.Variables.dtActividadesV.api().column(0).nodes().to$().find('input[type="checkbox"]:checked').length;
            $('#ChkTodosV').prop('checked', total === seleccionados);
        },
        LiberacionMasiva: async e => {
            e.preventDefault();

            const ids = Bugs.Variables.dtActividadesL.api().rows($('input[type="checkbox"]:checked').closest('tr')).data().map(x => x.IdActividad).join();

            if (ids.length === 0) {
                MensajeAdvertencia('No ha seleccionado ninguna actividad.');
            } else {
                const data = await POST(Bugs.Constantes.urlLiberacionMasiva, { Actividades: ids });

                if (data.Exito) {
                    Bugs.Funciones.LeerBugs();
                    MensajeExito(data.Mensaje);
                }
                else {
                    MensajeAdvertencia(data.Mensaje);
                }
            }
        },
        SeleccionarTodosLiberacion: e => {
            Bugs.Variables.dtActividadesL.api().column(0).nodes().to$().find('input[type="checkbox"]').prop('checked', $(e.target).prop('checked'));
        },
        SeleccionarLiberacion: () => {
            const total = Bugs.Variables.dtActividadesL.api().column(0).nodes().to$().find('input[type="checkbox"]').length;
            const seleccionados = Bugs.Variables.dtActividadesL.api().column(0).nodes().to$().find('input[type="checkbox"]:checked').length;
            $('#ChkTodosL').prop('checked', total === seleccionados);
        },
        CargaCombosFiltros: async () => {
            const data = await POST(Bugs.Constantes.urlCargaCombosFiltros);

            if (data.Exito) {
                $('#SelProyectoF').empty().append(data.LstProyectos);
                $('#SelUsuarioAsignadoF').empty().append(data.LstUsuarios);
                $('#SelResponsableF').empty().append(data.LstUsuarios);
                $('#SelClasificacionF').empty().append(data.LstTiposBug);

              
                $('.selectpicker').selectpicker('refresh');
                // eslint-disable-next-line
                Bugs.Variables.idTipoUsuario = data.TipoUsuario;
                TipoUsuario = data.TipoUsuario;
                // eslint-disable-next-line
                Bugs.Variables.idUsuario = data.Usuario;
                Usuario = data.Usuario;
            }
            else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LeerBugs: async () => {

       

            const filtros = {

                FechaSolIni: ($("#TxtRangoFechas").val()).split('-')[0],
                FechaSolFin: ($("#TxtRangoFechas").val()).split('-')[1],
                LstClasificacion: $('#SelClasificacionF').val(),
                LstResponsable: $('#SelResponsableF').val(),
                LstAsignado: $('#SelUsuarioAsignadoF').val(),
                LstProyecto: $('#SelProyectoF').val(),
                LstEstatus: $('#SelEstatusF').val(),

            }

            const data = await POST(Bugs.Constantes.urlLeerBugs, { filtros });

            if (data.Exito) {
       
                // eslint-disable-next-line
                Bugs.Variables.validar = data.Valida;
                // eslint-disable-next-line
                Bugs.Variables.liberar = data.Libera;

                if (!data.Valida) { $("#BtnValidacionM").hide(); $("#ChkTodosV").hide(); }
                if (!data.Libera) { $("#BtnLiberacionM").hide(); $("#ChkTodosL").hide(); }


               
                    $("#Todo").text("Todo (" + data.Total + ")");
                    $("#Autorizar").text("Pendiente autorizar (" + data.TotalV + ")");
                    $("#Liberar").text("Pendiente liberar (" + data.TotalL + ")");
                    Bugs.Variables.dtActividades = InicializaTabla({ tabla: $('#TblActividades'), datos: data.Actividades, columnas: Bugs.Constantes.colActividades });
                    Bugs.Variables.dtActividadesV = InicializaTabla({ tabla: $('#TblActividadesV'), datos: data.ActividadesV, columnas: Bugs.Constantes.colActividadesV });
                    Bugs.Variables.dtActividadesL = InicializaTabla({ tabla: $('#TblActividadesL'), datos: data.ActividadesL, columnas: Bugs.Constantes.colActividadesL });
               



                $("#LblAbierto").text("Abiertas (" + data.TotalAbiertas + ")");
                $("#LblProgreso").text("Progreso (" + data.TotalProgreso + ")");
                $("#LblValidacion").text("Validación (" + data.TotalValidacion + ")");
                $("#LblTerminadas").text("Terminadas (" + data.TotalLiberadas + ")");
                $("#LblRechazadas").text("Rechazadas (" + data.TotalRechazadas + ")");

                $("#tasks_assigned").empty();
                $("#tasks_progreess").empty();
                $("#task_validate").empty();
                $("#tasks_re").empty();
                $("#tasks_ok").empty();



                $("#tasks_assigned").append(data.ActividadesA);
                $("#tasks_progreess").append(data.ActividadesP);
                $("#task_validate").append(data.ActividadesR);
                $("#tasks_re").append(data.ActividadesX);
                $("#tasks_ok").append(data.ActividadesLi);
                resizeTaskList();
                page_content_onresize();
                $('div.pg-loading-screen').remove();


                //$('#LblTotal').text('Total horas: ' + (data.Total > 0 ? Bugs.Variables.dtActividades.api().column('.sum').data().reduce((sum, x) => sum + x).toFixed(2) : '0.00'));
                //$('#LblTotalV').text('Total horas: ' + (data.TotalV > 0 ? Bugs.Variables.dtActividadesV.api().column('.sum').data().reduce((sum, x) => sum + x).toFixed(2) : '0.00'));
                //$('#LblTotalL').text('Total horas: ' + (data.TotalL > 0 ? Bugs.Variables.dtActividadesL.api().column('.sum').data().reduce((sum, x) => sum + x).toFixed(2) : '0.00'));
            }
            else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        NuevaActividad: e => {
            e.preventDefault();
            newItem(7);
            //$('#TituloActividades').text("Captura de bug");
            //InicializaAltaActividades();
            //$('#ModalActividades').modal({ keyboard: false });
        },
        EditarActividad: e => {
            e.preventDefault();
            $('#ModalActividades').modal({ keyboard: false });

            const elem = $(e.target);
            let idActividad = 0;

            if (elem.hasClass('T')) {
                idActividad = Bugs.Variables.dtActividades.api().row(elem.closest('tr')).data().IdActividad;
            }
            if (elem.hasClass('V')) {
                idActividad = Bugs.Variables.dtActividadesV.api().row(elem.closest('tr')).data().IdActividad;
            }
            if (elem.hasClass('L')) {
                idActividad = Bugs.Variables.dtActividadesL.api().row(elem.closest('tr')).data().IdActividad;
            }

            $('#TituloActividades').text("Actividad #" + idActividad);
            $('#IdActividad').val(idActividad);
            $('#ModalActividades').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                Bugs.Funciones.LeerBugs();
            });

            InicializaEdicionActividad();
            $('#ModalActividades').modal({ keyboard: false });
        }
    },
    Variables: {
        idTipoUsuario: 0,
        idUsuario: 0,
        validar: false,
        liberar: false,
        dtActividades: null,
        dtActividadesV: null,
        dtActividadesL: null
    }
}
Bugs.Funciones.Init();
//var CargaActividades = async () => {
//    //const filtros = {
//    //    FechaCreoIni: $('#TxtFechaAIF').val().trim(),
//    //    FechaCreoFin: $('#TxtFechaAFF').val().trim(),
//    //    FechaSolIni: $('#TxtFechaSIF').val().trim(),
//    //    FechaSolFin: $('#TxtFechaSFF').val().trim(),
//    //    FechaCierreIni: $('#TxtFechaCIF').val().trim(),
//    //    FechaCierreFin: $('#TxtFechaCFF').val().trim(),
//    //    LstTipoActividad: $('#SelActividadF').val(),
//    //    LstClasificacion: $('#SelClasificacionF').val(),
//    //    LstAsignado: $('#SelUsuarioAsignadoF').val(),
//    //    LstResponsable: $('#SelResponsableF').val(),
//    //    LstProyecto: $('#SelProyectoF').val(),
//    //    LstPrioridad: $('#SelPrioridadF').val(),
//    //    LstEstatus: $('#SelEstatusF').val(),
//    //    Actividades: $('#TxtActividadF').val()
//    //}


//    var incio, fin;
//    if ($("#TxtRangoFechas").val() != "") {
//        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
//        fin = ($("#TxtRangoFechas").val()).split('-')[1];
//    }

//    const filtros = {

//        FechaSolIni: ($("#TxtRangoFechas").val()).split('-')[0],
//        FechaSolFin: ($("#TxtRangoFechas").val()).split('-')[1],
//        LstClasificacion: $('#SelClasificacionF').val(),
//        LstResponsable: $('#SelResponsableF').val(),
//        LstAsignado: $('#SelUsuarioAsignadoF').val(),
//        LstProyecto: $('#SelProyectoF').val(),
//        LstEstatus: $('#SelEstatusF').val(),

//    }
//    const data = await POST(Bugs.Constantes.urlLeerBugs, { filtros });

//    if (data.Exito) {


     


//        //$("#Todo").text("Todo (" + data.Total + ")");
//        //$("#Autorizar").text("Pendiente autorizar (" + data.TotalV + ")");
//        //$("#Liberar").text("Pendiente liberar (" + data.TotalL + ")");

      
//        Bugs.Variables.validar = data.Valida;
   
//        Bugs.Variables.liberar = data.Libera;

//        if (!data.Valida) { $("#BtnValidacionM").hide(); $("#ChkTodosV").hide(); }
//        if (!data.Libera) { $("#BtnLiberacionM").hide(); $("#ChkTodosL").hide(); }


//        $("#tab-third").fadeOut(500, function () {
//            $("#Todo").text("Todo (" + data.Total + ")");
//            $("#Autorizar").text("Pendiente autorizar (" + data.TotalV + ")");
//            $("#Liberar").text("Pendiente liberar (" + data.TotalL + ")");
//            Bugs.Variables.dtActividades = InicializaTabla({ tabla: $('#TblActividades'), datos: data.Actividades, columnas: Bugs.Constantes.colActividades });
//            Bugs.Variables.dtActividadesV = InicializaTabla({ tabla: $('#TblActividadesV'), datos: data.ActividadesV, columnas: Bugs.Constantes.colActividadesV });
//            Bugs.Variables.dtActividadesL = InicializaTabla({ tabla: $('#TblActividadesL'), datos: data.ActividadesL, columnas: Bugs.Constantes.colActividadesL });
//        });
//        $("#tab-third").fadeIn(500);

//        //Bugs.Variables.dtActividades = InicializaTabla({ tabla: $('#TblActividades'), datos: data.Actividades, columnas: Bugs.Constantes.colActividades });
//        //Bugs.Variables.dtActividadesV = InicializaTabla({ tabla: $('#TblActividadesV'), datos: data.ActividadesV, columnas: Bugs.Constantes.colActividadesV });
//        //Bugs.Variables.dtActividadesL = InicializaTabla({ tabla: $('#TblActividadesL'), datos: data.ActividadesL, columnas: Bugs.Constantes.colActividadesL });

//        $('#LblTotal').text('Total horas: ' + (data.Total > 0 ? Bugs.Variables.dtActividades.api().column('.sum').data().reduce((sum, x) => sum + x).toFixed(2) : '0.00'));
//        $('#LblTotalV').text('Total horas: ' + (data.TotalV > 0 ? Bugs.Variables.dtActividadesV.api().column('.sum').data().reduce((sum, x) => sum + x).toFixed(2) : '0.00'));
//        $('#LblTotalL').text('Total horas: ' + (data.TotalL > 0 ? Bugs.Variables.dtActividadesL.api().column('.sum').data().reduce((sum, x) => sum + x).toFixed(2) : '0.00'));
//    }
//    else {
//        MensajeAdvertencia(data.Mensaje);
//    }
//}

$("#tasks_assigned,#tasks_progreess, #task_validate,#tasks_re, #tasks_ok").sortable({
    items: "> .task-item",
    connectWith: "#tasks_assigned, #tasks_progreess, #task_validate,#tasks_re,#tasks_ok",
    handle: ".task-text",
    receive: function (event, ui) {
        if (this.id == "task_validate") {
            //  alert("Se paso a validación");
            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-info");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-validate");

            AbrirModalCapturaTiempo(item);
            //ActualizaEstatus(item, 'V');
            //ui.item.addClass("task-complete");
            //.find(".task-footer > .pull-right").remove();
        }
        if (this.id == "tasks_progreess") {
            //alert("Se paso a progreso");
            var item = $(ui).attr('item')[0].id;
            //var item2 = ui.id;
            ui.item.removeClass("task-info");
            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.addClass("task-progreess");
            ActualizaEstatus(item, 'P');

            //ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
        }
        if (this.id == "tasks_assigned") {
            //alert("Se paso a pendiente");
            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-info");
            ActualizaEstatus(item, 'A');


        }

        if (this.id == "tasks_re") {

            var item = $(ui).attr('item')[0].id
            AbrirModalRechazoActividad(item);



        }

        if (this.id == "tasks_ok") {


            var item = $(ui).attr('item')[0].id
            Actividad = {
                IdActividad: item,
                IdAutorizacion: 0,
                IdActividadVal: 0,
                Valida: true
            };

            ValidaRechazaActividadKanban(Actividad);
            Bugs.Funciones.LeerBugs();
            /*  alert("Se paso a liberado");*/

            //var item = $(ui).attr('item')[0].id
            //AbrirModalRechazoActividad(item);



        }
        page_content_onresize();
    }
}).disableSelection();

function AbrirModalCapturaTiempo(IdActividad) {

    $("#IdActividadCT").val(IdActividad);
    $('#TituloRec').text("Capturar fecha fin de actividad #" + IdActividad);
    var date = new Date();
    $('#TxtFinActividad').datetimepicker(
        {
            format: 'DD/MM/YYYY',
            maxDate: date
        });

    $('#ModalCapturarTiempo').on('hidden.bs.modal', function () {

        CargaActividades();
        $(this).off('hidden.bs.modal');

    });

    $('#ModalCapturarTiempo').modal({ keyboard: false });

    return false;

}

function ActualizaEstatus(IdActividad, Estatus) {

    var url = $('#urlActualizaEstatus').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdActividad: IdActividad, Estatus: Estatus }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (!data.Exito) {

                MensajeAdvertencia(data.Mensaje);

            }
            else {
                Bugs.Funciones.LeerBugs();
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

function AbrirModalRechazoActividad(IdActividad) {

    InicializaModalRechazar();
    $('#ActividadR').val(IdActividad);



    $('#TituloRec').text("Rechazar actividad #" + IdActividad);


    $('#ModalRechazarActividad').on('hidden.bs.modal', function () {
        Bugs.Funciones.LeerBugs();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalRechazarActividad').modal({ keyboard: false });


    return false;

}



//function format(d, nombreTabla) {
//    var htmlDetalle = '';


//    dsDetalle = $.grep(listaDetalle, function (a, b) {
//        return a.IdActividad === d.IdActividad;
//    });

//    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdActividad);
//    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdActividad);

//    //auxOc = d.Oc;
//    return htmlDetalle;

//}

//function refrescaTablaAct() {
//    tablasEncabezado['TblActividades'].api().clear().rows.add(dsEncabezado).draw();
//}


$("#BtnImportarAct").click(function () {

    $("#FlImportaActividades").parent().next().text("");
    $("#FlImportaActividades").val("");
    $('#BtnImportarActividad').addClass('hidden');
    $('#ModalImportarActividades').modal({ keyboard: false });

    return false;

});

function ActualizaTablaExportar(data) {

    var dsExportar = jQuery.parseJSON(data);


    $('#TblActividadesExportar tbody').html('');

    for (var i in dsExportar) {


        rows = "<tr>"
            + "<td class='text-center'>" + dsExportar[i].IdActividad + "</td>"
            + "<td class='text-center'>" + dsExportar[i].EstatusStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].PrioridadStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].Descripcion + "</td>"
            + "<td class='text-center'>" + dsExportar[i].ProyectoStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].TipoActividadStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].ClasificacionStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].AsignadoStr + "</td>"
            + "<td class='text-center'>" + dsExportar[i].ResponsableStr + "</td>"
            + "<td class='text-right'>" + dsExportar[i].HorasAsignadas + "</td>"
            + "<td class='text-center'>" + moment(dsExportar[i].FechaSolicitado).format("DD/MM/YYYY") + "</td>"
            + "<td class='text-right'>" + dsExportar[i].HorasFinales + "</td>"
            + "<td class='text-center'>" + (dsExportar[i].FechaTermino === null ? '' : moment(dsExportar[i].FechaTermino).format("DD/MM/YYYY")) + "</td>"
            + "</tr>";
        $("#TblActividadesExportar tbody").append(rows);
    }


}



$(document).on("change", "#FlImportaActividades", function (e) {
    $("#FlImportaActividades").parent().next().next().text("");



    if (e.target.files != undefined) {

        var reader = new FileReader();

        reader.onload = function (f) {

            $('#BtnImportarActividad').removeClass('hidden');
        };
        reader.readAsDataURL(e.target.files.item(0));
    }

});

$(document).on('click', '#BtnImportarActividad', function (e) {


    ImportaArchivo();

    return false;
});

function ImportaArchivo() {
    var url = $('#urlImportaActividades').val();

    var form_data = new FormData();
    form_data.append("Archivo", $("#FlImportaActividades").prop("files")[0]);


    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        //dataType: "script",
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {

            var Resultado = Respuesta.split('|');


            $('div.pg-loading-screen').remove();
            if (Resultado[0] == "E") {

                CargaActividades();
                MensajeExito(Resultado[1]);
            }
            else {
                CargaActividades();
                MensajeAdvertencia(Resultado[1]);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });
}
function CapturaTrabajo(IdActividad, PSP, Descripcion) {
    if (PSP === 1) {
        var url = $('#urlTracking').val() + "?Id=" + IdActividad;
        window.open(url, '_blank');

    } else {

        $("#IdActividadCTra").val(IdActividad);
        $("#LblActividadDesc").text(IdActividad + "-" + Descripcion);
        var date = new Date();
        $('#TxtFechaTrab').datetimepicker(
            {
                format: 'DD/MM/YYYY',
                maxDate: date
            });
        $("#TxtTiempo").val("");
        $("#TxtComentarioTrabajo").val("");
        CargarTrabajos();
        $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {
            CargaActividades();
            $(this).off('hidden.bs.modal');
        });
        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });
    }
}



