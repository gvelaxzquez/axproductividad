
var sprintgantt = false;

var numV = 1;
$(document).ready(function () {


 /*   $(".headersprint").hide();*/
    CargarSprintsAll();
 

});


$(document).on('click', '#BtnFiltrarSP', function (e) {

    CargarSprints();

    $(".headersprint").show();

    return false;
});



$(document).on('change', '#SelProyectoSP', function (e) {


    CargarSprints();

    if ($('#SelProyectoSP').val() == - 1) {
        $("#liData").addClass('hide');
        $("#liData").removeClass('active');

        $("#liLista").addClass('active');
        $("#tab-lista").addClass('active');
    }
    else {

        $("#liData").removeClass('hide');

    }

    if ($("#liData").hasClass('active')) {
        ConsultaGraficasSprintData();
        ConsultaGraficasSprintHoras();

    }

    $(".headersprint").show();

    return false;

});


$(document).on('change', '#SelEstatusSP', function (e) {


    CargarSprints();

    if ($('#SelProyectoSP').val() == - 1) {
       
        $("#liData").addClass('hide');
        $("#liData").removeClass('active');

        $("#liLista").addClass('active');
        $("#tab-lista").addClass('active');
    }
    else {

        $("#liData").show();

    }



    if ($("#liData").hasClass('active')) {
        ConsultaGraficasSprintData();
        ConsultaGraficasSprintHoras();

    }


    $(".headersprint").show();

    return false;

});



$(document).on('click', '#BtnCerrarAct', function (e) {


    $("#colActividad").hide();
    $("#colSprints").removeClass('col-md-6');
    $("#colSprints").addClass('col-md-9');

    return false;
});

$(document).on('click', '#BtnAgregarPBI', function (e) {


    $("#colActividad").show();
    $("#colSprints").addClass('col-md-6');
    $("#colSprints").removeClass('col-md-9');


    return false;
});

$(document).on('click', '#BtnAgregarIteracion', function (e) {

    if ($('#SelProyectoSP').val() == -1) {
        MensajeError("Debe seleccionar un proyecto para crear el sprint.");

        return false;
    }

    InicializaModalSprint();
    $('#ModalIteraciones').modal('show');

    return false;
});

function InicializaModalSprint() {

    $('#TxtFechaFinI,#TxtFechaInicioI').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });
    $('#TxtNombreI').val('');
    $('#IdIteracion').val('0');
    $('#TxtObjetivoI').val('');
    $('#TxtFechaFinI').val('');
    $('#TxtFechaInicioI').val('');

}

$(document).on('click', '#BtnGuardarSprint', function (e) {


    GuardarSprint();
    return false;
});

function GuardarSprint() {
    var Mensaje = ValidaCamposRequeridos(".ReqIteracion");


    if (Mensaje.length == 0) {


        var Sprint = {
            IdProyecto: $('#SelProyectoSP').val(),
            Nombre: $('#TxtNombreI').val().trim(),
            Objetivo: $('#TxtObjetivoI').val().trim(),
            FechaInicio: ObtieneFecha($('#TxtFechaInicioI').val().trim()),
            FechaFin: ObtieneFecha($('#TxtFechaFinI').val().trim())
        }
        LlamadaGuardarDatosSprint(Sprint);
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

}

function LlamadaGuardarDatosSprint(Sprint) {

    var url = $('#urlGuardarSprint').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Sprint),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarSprint,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarSprint(data) {
    if (data.Exito) {
        //$('#divsprints').empty();
        //$('#divsprints').append(data.Sprints);
        $('#ModalIteraciones').modal('hide');
    /*    InicializaPlugins();*/
        $('div.pg-loading-screen').remove();
        MensajeExito(data.Mensaje);
        ConsultasInicialSprints();

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

function CargarSprints() {

        ConsultasInicialSprints();

}

function ConsultasInicialSprints() {
    var url = $('#urlCargaSprints').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#SelProyectoSP').val(), Estatus: $('#SelEstatusSP').val() }),
        dataType: "json",
        async: true,
        success: successCargaSprints,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaSprints(data) {
    if (data.Exito) {


        $('#tblSprintDetalle').empty();


        var sprints = jQuery.parseJSON(data.Sprints);

        if (sprints.length > 0) {
            $.each(sprints, function (key, value) {


                var sp = '<tr>' +
                    '<td><a onclick= "VerSprint(' + value.IdIteracion + ')"><h4 class="no-margins font-extra-bold">' + value.Nombre +
                    "<span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>" + value.EstatusStr + "<span><span class='fa fa-fw fa-circle " + value.Estatus + "'></span> </span>" +
                    '</h4></a> <small>' + value.Objetivo + '</small>' +
                    '<div class="progress progress-small">' +
                    '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:' + value.Avance + '%;"></div>' +
                    '</div>' +
                    '</td>' +
                    '<td><div class="pull-right font-bold text-primary"> <h4 class="text-default">' + value.Avance + '%</h4></div> </td>' +
                    '</tr>'

                $('#tblSprintDetalle').append(sp);

            });


        }
        else {

            var sp = '<tr><td><h4 class="no-margins font-extra-bold"> No hay sprints </h4>  </td></tr>'

            $('#tblSprintDetalle').append(sp);
        }




        var g = jQuery.parseJSON(data.Gantt);

        gantt.config.min_column_width = 80;
        gantt.plugins({
            export_api: true,
        });

        //gantt.config.scales = [
        //    { unit: "month", step: 1, format: "%M" },
        //    { unit: "year", step: 1, format: "%Y" },
        //    { unit: "day", format: "%d %M" }
        //];
        //gantt.config.scale_height = 3 * 28;

        gantt.config.columns = [

            { name: "text", label: "Sprint", tree: true, width: 250, resize: true, min_width: 10 },
            { name: "start_date", label: "Fecha inicio", align: "center", width: 120, resize: true },
            { name: "end_date", label: "Fecha fin", align: "center", width: 120, resize: true },
            { name: "avance", label: "avance", align: "right", width: 120, resize: true }
 
        ];

        var zoomConfig = {
            levels: [
                {
                    name: "day",
                    scale_height: 27,
                    min_column_width: 80,
                    scales: [
                        { unit: "day", step: 1, format: "%d %M" }
                    ]
                },
                {
                    name: "week",
                    scale_height: 50,
                    min_column_width: 50,
                    scales: [
                        {
                            unit: "week", step: 1, format: function (date) {
                                var dateToStr = gantt.date.date_to_str("%d %M");
                                var endDate = gantt.date.add(date, -6, "day");
                                var weekNum = gantt.date.date_to_str("%W")(date);
                                return  dateToStr(date) + " - " + dateToStr(endDate);
                            }
                        },
                        { unit: "day", step: 1, format: "%j" }
                    ]
                },
                {
                    name: "month",
                    scale_height: 50,
                    min_column_width: 80,
                    scales: [
                       
                        { unit: "month", step: 1, format: "%F" },
                        { unit: "year", step: 1, format: "%Y" },
                        { unit: "day",  format: "%j %M" }
                    
                    ]
                },
                {
                    name: "quarter",
                    height: 50,
                    min_column_width: 90,
                    scales: [
                        { unit: "month", step: 1, format: "%M" },
                        {
                            unit: "quarter", step: 1, format: function (date) {
                                var dateToStr = gantt.date.date_to_str("%M");
                                var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                                return dateToStr(date) + " - " + dateToStr(endDate);
                            }
                        }
                    ]
                },
                {
                    name: "year",
                    scale_height: 50,
                    min_column_width: 30,
                    scales: [
                        { unit: "year", step: 1, format: "%Y" },
                         { unit: "month", format: "%F"}
                    ]
                }
            ]
        };

        gantt.templates.task_class = function (start, end, task) {


            if (task.progress >= 1) {
                return "bg-success"

            }

        };

   
        gantt.ext.zoom.init(zoomConfig);
        gantt.ext.zoom.setLevel("month");

    
        gantt.config.readonly = true;
        gantt.i18n.setLocale("es");

        gantt.init("roadmap");
        gantt.clearAll(); 
        gantt.parse({
            data:g

        });




        page_content_onresize();


    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function ConsultaGraficasSprintData() {

    const data = await POST('/Dashboard/ConsultaGraficaVelocidad', { IdProyecto: $('#SelProyectoSP').val() });

    if (data.Exito) {
        var dsDatos = JSON.parse(data.Grafica);
        $('#GraficasSprint').empty();
        $('#scriptsSprints').empty();

        $.each(dsDatos, function (key, value) {
            var id = value.id;
            var nombre = value.Nombre;
            var tipo = value.Tipo;
            var series = value.Series;
            var columnas = value.LstColumnas;
            var valores = value.LstValores;
            var tabla = value.Tabla;
            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema = "temaEstatusCPS";
            var grafica = "<div class='col-md-10'>"
                + "     <div class=''>"
                + "                         <div class=''>"
                + "                               <div id='" + idgrafica + "' style='height:400px;' > "
                + "                                </div>"
                + "                         </div>"
                + "                       </div>"
                + "                 </div>"


            var script = "<script>"
                + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                + "" + vargrafica + ".setOption({ "
                + "    title: { "
                + "        text: '',"
                + "        subtext: '' "
                + "    },"
                + "    tooltip: {"
                + "        trigger: 'axis'"
                + "    },"

                + " legend: {"
                + '  data: ' + series + ''
                + " },"
                + "    toolbox: {"
                + "        show: true,"
                + "        feature: {"
                + "            mark: { show: true },"
                + "            magicType: { show: true, type: ['bar', 'line','pie'] , title:''},"
                + "            saveAsImage: { show: true, title: 'Descargar' }"
                + "        } "
                + "    },"
                + "    calculable: true,"
                + "    xAxis: ["
                + "        {"
                + " type: 'category', "
                + "            boundaryGap: true, "
                + '            data: ' + columnas + ''
                + "        }"
                + "    ],"
                + "    yAxis: ["
                + "        {"
                + "            type: 'value',"
                + "            name: '',"
                + "            position: 'left',"
                + "            axisLabel: {"
                + "                formatter: '{value}'"
                + "            }"
                + "        },"
                + "    ],"
                + 'series: ' + valores + ''
                + " });"
                + "</script>"

            $('#GraficasSprint').append(grafica);
            $('#scriptsSprints').append(script);

            numV = numV + 1;

        });

    }
    else {

        MensajeError(data.Mensaje);
    }

}

async function ConsultaGraficasSprintHoras() {

    const data = await POST('/Dashboard/ConsultaGraficaSprintHoras', { IdProyecto: $('#SelProyectoSP').val() });

    if (data.Exito) {
        var dsDatos = JSON.parse(data.Grafica);
        $('#GraficasSprintHoras').empty();
        $('#scriptsSprintsHoras').empty();

        $.each(dsDatos, function (key, value) {
            var id = value.id;
            var nombre = value.Nombre;
            var tipo = value.Tipo;
            var series = value.Series;
            var columnas = value.LstColumnas;
            var valores = value.LstValores;
            var tabla = value.Tabla;
            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema = "temaEstatusPerformance";
            var grafica = "<div class='col-md-10'>"
                + "     <div class=''>"
                + "                         <div class=''>"
                + "                               <div id='" + idgrafica + "' style='height:400px;' > "
                + "                                </div>"
                + "                         </div>"
                + "                       </div>"
                + "                 </div>"


            var script = "<script>"
                + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                + "" + vargrafica + ".setOption({ "
                + "    title: { "
                + "        text: '',"
                + "        subtext: '' "
                + "    },"
                + "    tooltip: {"
                + "        trigger: 'axis'"
                + "    },"

                + " legend: {"
                + '  data: ' + series + ''
                + " },"
                + "    toolbox: {"
                + "        show: true,"
                + "        feature: {"
                + "            mark: { show: true },"
                + "            magicType: { show: true, type: ['bar', 'line','pie'] , title:''},"
                + "            saveAsImage: { show: true, title: 'Descargar' }"
                + "        } "
                + "    },"
                + "    calculable: true,"
                + "    xAxis: ["
                + "        {"
                + "            type: 'category', "
                + "            boundaryGap: true, "
                + '            data: ' + columnas + ''
                + "        }"
                + "    ],"
                + "    yAxis: ["
                + "        {"
                + "            type: 'value',"
                + "            name: '',"
                + "            position: 'left',"
                + "            axisLabel: {"
                + "                formatter: '{value}'"
                + "            }"
                + "        },"
                + "    ],"
                + 'series: ' + valores + ''
                + " });"
                + "</script>"

            $('#GraficasSprintHoras').append(grafica);
            $('#scriptsSprintsHoras').append(script);

            numV = numV + 1;

        });

    }
    else {

        MensajeError(data.Mensaje);
    }

}


function zoomIn() {
    gantt.ext.zoom.zoomIn();
}
function zoomOut() {
    gantt.ext.zoom.zoomOut()
}

function CambiarZoom(zoom) {
    gantt.ext.zoom.setLevel(zoom);
}


async function CargarSprintsAll() {


    const data = await POST('/Proyectos/ConsultarSprintsUsuario', { IdUsuario: -1 });

    if (data.Exito) {
        $('#tblSprintDetalle').empty();

        var sprints = jQuery.parseJSON(data.Sprints);

        if (sprints.length > 0) {
            $.each(sprints, function (key, value) {


                var sp = '<tr>' +
                    '<td><a onclick= "VerSprint(' + value.IdIteracion + ')"><h4 class="no-margins font-extra-bold">' + value.Nombre +
                    "<span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>" + value.EstatusStr + "<span><span class='fa fa-fw fa-circle " + value.Estatus + "'></span> </span>" +
                    '</h4></a> <small>' + value.Objetivo + '</small>' +
                    '<div class="progress progress-small">' +
                    '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:' + value.Avance + '%;"></div>' +
                    '</div>' +
                    '</td>' +
                    '<td><div class="pull-right font-bold text-primary"> <h4 class="text-default">' + value.Avance + '%</h4></div> </td>' +
                    '</tr>'

                $('#tblSprintDetalle').append(sp);

            });


        }
        else {

            var sp = '<tr><td><h4 class="no-margins font-extra-bold"> No hay sprints </h4>  </td></tr>'

            $('#tblSprintDetalle').append(sp);
        }





        var g = jQuery.parseJSON(data.Gantt);

        gantt.config.min_column_width = 80;
        gantt.plugins({
            export_api: true,
        });

        //gantt.config.scales = [
        //    { unit: "month", step: 1, format: "%M" },
        //    { unit: "year", step: 1, format: "%Y" },
        //    { unit: "day", format: "%d %M" }
        //];
        //gantt.config.scale_height = 3 * 28;

        gantt.config.columns = [

            { name: "text", label: "Sprint", tree: true, width: 250, resize: true, min_width: 10 },
            { name: "start_date", label: "Fecha inicio", align: "center", width: 120, resize: true },
            { name: "end_date", label: "Fecha fin", align: "center", width: 120, resize: true },
            { name: "avance", label: "avance", align: "right", width: 120, resize: true }

        ];

        var zoomConfig = {
            levels: [
                {
                    name: "day",
                    scale_height: 27,
                    min_column_width: 80,
                    scales: [
                        { unit: "day", step: 1, format: "%d %M" }
                    ]
                },
                {
                    name: "week",
                    scale_height: 50,
                    min_column_width: 50,
                    scales: [
                        {
                            unit: "week", step: 1, format: function (date) {
                                var dateToStr = gantt.date.date_to_str("%d %M");
                                var endDate = gantt.date.add(date, -6, "day");
                                var weekNum = gantt.date.date_to_str("%W")(date);
                                return dateToStr(date) + " - " + dateToStr(endDate);
                            }
                        },
                        { unit: "day", step: 1, format: "%j" }
                    ]
                },
                {
                    name: "month",
                    scale_height: 50,
                    min_column_width: 80,
                    scales: [

                        { unit: "month", step: 1, format: "%F" },
                        { unit: "year", step: 1, format: "%Y" },
                        { unit: "day", format: "%j %M" }

                    ]
                },
                {
                    name: "quarter",
                    height: 50,
                    min_column_width: 90,
                    scales: [
                        { unit: "month", step: 1, format: "%M" },
                        {
                            unit: "quarter", step: 1, format: function (date) {
                                var dateToStr = gantt.date.date_to_str("%M");
                                var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                                return dateToStr(date) + " - " + dateToStr(endDate);
                            }
                        }
                    ]
                },
                {
                    name: "year",
                    scale_height: 50,
                    min_column_width: 30,
                    scales: [
                        { unit: "year", step: 1, format: "%Y" },
                        { unit: "month", format: "%F" }
                    ]
                }
            ]
        };

        gantt.templates.task_class = function (start, end, task) {


            if (task.progress >= 1) {
                return "bg-success"

            }

        };


        gantt.ext.zoom.init(zoomConfig);
        gantt.ext.zoom.setLevel("month");


        gantt.config.readonly = true;
        gantt.i18n.setLocale("es");

        gantt.init("roadmap");
        gantt.clearAll();
        gantt.parse({
            data: g

        });




        page_content_onresize();


        page_content_onresize();

    }
    else {

        MensajeError(data.Mensaje);
    }

}


function VerSprint(IdIteracion) {


    var url = $('#urlSprintReport').val() + "/" + IdIteracion;
    window.open(url, '_blank');


}



