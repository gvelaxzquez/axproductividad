var numV = 1;
var num = 1;

$(document).ready(function () {


    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });


    if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
        $(".page-container").removeClass("page-navigation-toggled");
        x_navigation_minimize("open");
    } else {
        $(".page-container").addClass("page-navigation-toggled");
        x_navigation_minimize("close");
    }

    onresize();


    InicializarQADashboard();
    CargarIndicadoresCalidad();
    CargarSprintsCalidad();
    CargarEstatusCPS();
    ConsultaGraficasQA();


});
function InicializarQADashboard() {
    var url = '/Dashboard/InicializarQA';

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {

                $('#SelAnioKPI').empty();
                $('#SelAnioKPI').append(data.LstAnios);

                $('#SelAnioKPI').val(data.Anio);
                $('#SelMesKPI').val(data.Mes);
                $('#SelAnioKPI').selectpicker('refresh');
                $('#SelMesKPI').selectpicker('refresh');

                $('#SelProyectosQAF').empty();
                $('#SelProyectosQAF').append(data.LstProyectos);
                $('#SelProyectosQAF').selectpicker('refresh');
            }
            else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
async function CargarIndicadoresCalidad() {

    if ($('#SelProyectosQAF').val() == -1) {
        $("#hTitle").text("QA " + $("#SelMesKPI option:selected").text() + " / " + $("#SelAnioKPI option:selected").text());
    }
    else {

        $("#hTitle").text("QA " + $("#SelMesKPI option:selected").text() + " / " + $("#SelAnioKPI option:selected").text() + " / " + $("#SelProyectosQAF option:selected").text());
    }

    const data = await POST('/Dashboard/ConsultaIndicadoresCalidad', { IdAnio: $('#SelAnioKPI').val(), IdMes: $('#SelMesKPI').val(), IdProyecto: $('#SelProyectosQAF').val() });

    if (data.Exito) {


   /*     $("#hTitle").text("KPIS " + $("#SelMesKPI option:selected").text() + " / " + $("#SelAnioKPI option:selected").text());*/

        $("#tfinmes").text("Mensual");
        $("#tfinanio").text("Anual");

        var datos = jQuery.parseJSON(data.Indicadores);

        $("#LblDefectosMes").text(datos.Bugs);
        $("#LblDefectosAnual").text(datos.BugsAnual);

        $("#LblDensidad").text($.number(datos.Densidad, '2', '.', ','));
        $("#LblDensidadAnual").text($.number(datos.DensidadAnual, '2', '.', ','));

        var element2 = document.querySelector('.ccalidadmes');
        var avancer = new EasyPieChart(element2, {
            delay: 3000,
            barColor: function () {
                if (datos.Calidad >= 85) {
                    return '#08C127'
                }
                else if (datos.Calidad >= 75) {
                    return '#fea223'
                }
                else {
                    return '#D12106'
                }
            },
            trackColor: '#FFFFFF',
            scaleColor: false,
          /*  size: 180,*/
            lineWidth: 10,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = datos.Calidad;
            }
        });
        avancer.update(datos.Calidad);
        avancer.disableAnimation();
        avancer.enableAnimation();

        var element = document.querySelector('.ccalidadanual');
        var avance = new EasyPieChart(element, {
            delay: 3000,
            barColor: function () {
                if (datos.CalidadAnual >= 85) {
                    return '#08C127'
                }
                else if (datos.CalidadAnual >= 75) {
                    return '#fea223'
                }
                else {
                    return '#D12106'
                }
            },
            trackColor: '#FFFFFF',
            scaleColor: false,
           /* size: 180,*/
            lineWidth: 10,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = datos.CalidadAnual;
            }
        });
        avance.update(datos.CalidadAnual);
        avance.disableAnimation();
        avance.enableAnimation();

        var dsDatos = JSON.parse(data.Grafica);
        $('#GraficaCalidad').empty();
        $('#scriptsCalidad').empty();
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

            var tema = "temaHistoricoCalidad";

            var grafica = "<div class='col-md-12'>"
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
                + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                + "            saveAsImage: { show: true, title: 'Descargar' }"
                + "        } "
                + "    },"
                + "    calculable: true,"
                + "    xAxis: ["
                + "        {"
                + " type: 'category', "
                + "            boundaryGap: false, "
                + '            data: ' + columnas + ''
                + "        }"
                + "    ],"
                + "    yAxis: ["
                + "        {"
                + "            type: 'value',"
                + "            name: 'Defectos',"
                + "            position: 'left',"
                + "            axisLabel: {"
                + "                formatter: '{value}'"
                + "            }"
                + "        },"
                + "        {"
                + "            type: 'value',"
                + "            name: '%',"
                + "            position: 'right',"
                + "            axisLabel: {"
                + "                formatter: '{value}'"
                + "            }"
                + "        }"

                + "    ],"
                + 'series: ' + valores + ''
                + " });"
                + "</script>"

            $('#GraficaCalidad').append(grafica);
            $('#scriptsCalidad').append(script);

            numV = numV + 1;

        });


    }
    else {

        MensajeError(data.Mensaje);
    }

}
async function CargarSprintsCalidad() {


    const data = await POST('/Dashboard/ConsultaSprintsCalidad', { IdProyecto: $('#SelProyectosQAF').val() });

    if (data.Exito) {
        $('#tblCasosPrueba').empty();

        var ciclos = jQuery.parseJSON(data.Ciclos);

        $("#tCC").text("Ciclos activos (" + ciclos.length + ")");

        if (ciclos.length > 0) {
            $.each(ciclos, function (key, value) {
                var vargrafica = "grafica1" + num.toString();
                var vargrafica2 = "grafica2" + num.toString();
                var varelement1 = "element1" + num.toString();
                var varelement2 = "element2" + num.toString();

                var varobjeto1 = "objeto1" + num.toString();
                var varobjeto2 = "objeto2" + num.toString();

                var sp = '<tr onclick= "VerCP(' + value.IdCicloP + ')" style="cursor:pointer;border: 1px solid #b5b5b5;">' +
                    '<td><a ><h4 class="no-margins font-extra-bold">' + value.Nombre + ' | ' + value.Ambiente +
                    "<span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>" + value.EstatusStr + "<span><span class='fa fa-fw fa-circle " + value.Estatus + "'></span> </span>" +
                    '</h4></a> <small>' + value.Descripcion + '</small>' +


                    '</td>' +

                    '<td>' +
                    '<span class="chart"  id="' + vargrafica + '" data-percent="0">' +
                    '    <span class="percent"></span><br>' +
                    '       <p> % Avance </p>' +
                    '</span>' +
                    '</td>' +
                    '<td>' +
                    '<span class="chart"  id="' + vargrafica2 + '" data-percent="0">' +
                    '    <span class="percent"></span><br>' +
                    '       <p>% Aprobado</p>' +
                    '</span>' +
                    '</td>' +
                    '</tr>'


                var script = " <script> var " + varelement1 + " = document.querySelector('#" + vargrafica + "');" +
                    "var " + varobjeto1 + " = new EasyPieChart(" + varelement1 + ", {   " +
                    "delay: 3000," +
                    "barColor: '#3fbae4'," +
                    "trackColor: '#FFFFFF'," +
                    "scaleColor: false," +
                    "lineWidth: 10," +
                    "trackWidth: 16," +
                    "lineCap: 'butt'," +
                    "onStep: function (from, to, percent) {" +
                    "this.el.children[0].innerHTML =" + value.Avance + ";" +
                    "}" +
                    "});" +
                    varobjeto1 + ".update(" + value.Avance + ");" +
                    varobjeto1 + ".disableAnimation();" +
                    varobjeto1 + ".enableAnimation();" +
                    "</script>";

                var script2 = " <script> var " + varelement2 + " = document.querySelector('#" + vargrafica2 + "');" +
                    "var " + varobjeto2 + " = new EasyPieChart(" + varelement2 + ", {   " +
                    "delay: 3000," +
                    "barColor: function () {" +
                    "    if (" + value.Aprobado + "<= 50) {" +
                    "return '#b64645'" +
                    "}" +
                    "else if (" + value.Aprobado + "<= 90) {" +
                    "   return '#ff9900'" +
                    "}" +
                    "else {" +
                    "    return '#08C127'" +
                    "}" +
                    "}," +
                    "trackColor: '#FFFFFF'," +
                    "scaleColor: false," +
                    "lineWidth: 10," +
                    "trackWidth: 16," +
                    "lineCap: 'butt'," +
                    "onStep: function (from, to, percent) {" +
                    "this.el.children[0].innerHTML =" + value.Aprobado + ";" +
                    "}" +
                    "});" +
                    varobjeto2 + ".update(" + value.Aprobado + ");" +
                    varobjeto2 + ".disableAnimation();" +
                    varobjeto2 + ".enableAnimation();" +
                    "</script>";


                $('#tblCasosPrueba').append(sp);
                $('#scriptsCalidad').append(script);
                $('#scriptsCalidad').append(script2);


                num++;


            });


        }
        else {

            var sp = '<tr><td><h4 class="no-margins font-extra-bold"> No hay ciclos de prueba </h4>  </td></tr>'

            $('#tblCasosPrueba').append(sp);
        }


    }
    else {

        MensajeError(data.Mensaje);
    }

}
async function CargarEstatusCPS() {

    const data = await POST('/Dashboard/ConsultaGraficaEstatusCP', {  IdProyecto: $('#SelProyectosQAF').val() });

    if (data.Exito) {
        var dsDatos = JSON.parse(data.Grafica);
        $('#GraficaEstatusCP').empty();
        $('#scriptsEstatusCP').empty();

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
            var grafica = "<div class='col-md-12'>"
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
                + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                + "            saveAsImage: { show: true, title: 'Descargar' }"
                + "        } "
                + "    },"
                + "    calculable: true,"
                + "    xAxis: ["
                + "        {"
                + " type: 'category', "
                + "            boundaryGap: false, "
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

            $('#GraficaEstatusCP').append(grafica);
            $('#scriptsEstatusCP').append(script);

            numV = numV + 1;

        });

    }
    else {

        MensajeError(data.Mensaje);
    }

}
async function ConsultaGraficasQA() {

    const data = await POST('/Dashboard/ConsultaGraficasQA', { IdProyecto: $('#SelProyectosQAF').val() });

    if (data.Exito) {

        var dsDatos = jQuery.parseJSON(data.LstGraficas);

        $('#GraficaPQA').empty();

        $('#scriptsPQA').empty();

        $.each(dsDatos, function (key, value) {


            var id = value.id;
            var nombre = value.Nombre;
            var tipo = "Pie";
            var series = value.Series;
            /*     var columnas = value.LstColumnas;*/
            var valores = value.LstValores;
            /*   var tabla = value.Tabla;*/
            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema = nombre == "Casos de prueba" ? "temagraficaestatusTC" : "temagraficaestatustask";


            if (tipo == "Pie") {
                var grafica = "<div class='col-md-6'>"
                    + "     <div class='panel panel-default projectcard'>"
                    + "                         <div class='panel-body profile'>"
                    + "                             <div class='row headerproyecto''>"
                    + "                                     <div class='col-md-12'>"
                    + "                                          <h4>" + nombre + " (" + value.Tipo + ")</h4>"
                    + "                                     </div>"
                    + "                               <div id='" + idgrafica + "' style='height:350px;' > "
                    + "                                </div>"
                    + "                         </div>"
                    + "                       </div>"
                    + "                 </div>"





                var script = "<script>"
                    + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                    + "" + vargrafica + ".setOption({ "
                    + "              tooltip: {"
                    + "                   trigger: 'item',"
                    + "                   formatter: '{a} <br/>{b} : {c} ({d}%)'"
                    + "               },"
                    + "              calculable: true,"
                    + "               legend: { "
                    + '                   orient: "vertical",'
                    + '                   x: "left",'
                    + "                   y: 'center',"
                    + '                   data:' + series + ''
                    + "               },"
                    + "               toolbox: {"
                    + "show: true,"
                    + " feature: { "
                    + "            mark: { show: true },"
                    + "            magicType: { show: true, type: ['funnel', 'pie'] , title:''},"
                    + "    saveAsImage: {"
                    + "        show: true, "
                    + "        title: 'Descargar'"
                    + "    }"
                    + "}"
                    + "               }, "
                    + "               series: [{ "
                    + "                   name: '',"
                    + "                   type: 'pie', "
                    + "                   radius: ['0%', '65%'],"
                    + "                   itemStyle: { "
                    + "                       normal: { "
                    + "                           label: { "
                    + "                               show: false "
                    + "                           },"
                    + "                           labelLine: {"
                    + "                               show: false "
                    + "                           }"
                    + "                       },"
                    + "                       emphasis: {"
                    + "                           label: {"
                    + "                               show: true,"
                    + "                               position: 'right',"
                    + "                               textStyle: {"
                    + "                                   fontSize: '10',"
                    + "                                   fontWeight: 'normal' "
                    + "                               } "
                    + "                           }"
                    + "                       }"
                    + "                   },"
                    + '                   data: ' + valores + ''
                    + "               }]"
                    + "           });"
                    + "</script>"


                $('#GraficaPQA').append(grafica);
                $('#scriptsPQA').append(script);

            }

            numV = numV + 1;

        });
    }
    else {

        MensajeError(data.Mensaje);
    }

}
function VerCP(IdCicloP) {
    var url = $('#urlRun').val() + "/" + IdCicloP;
    window.open(url, '_blank');
}

$(document).on('click', '#BtnFiltrarKPIS', function (e) {

    CargarIndicadoresCalidad();
    CargarSprintsCalidad();
    CargarEstatusCPS();
    ConsultaGraficasQA();

    $(".filter-settings").toggleClass("active");

});
