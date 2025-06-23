var dsEquipo = [];
var tablaEquipo;
var columnasEquipo = [



    {
        "class": "text-center",
        "data": "NumEmpleado",
        "render": function (data, type, row) {
            return '<img class="img-dt" style="width:50px; height:50px;"  src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '">'


        }
    },

    {
        "data": "NombreCompleto",
        "class": "text-left"
    },
    {
        "data": "DescripcionTipoUsuario",
        "class": "text-left"
    }

];
$(document).ready(function () {

    $('#TxtFechaIniProy,#TxtFechaFinProy,#TxtFechaCompProy').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });




/*    CargaInicial();*/
    CargarInformeProyecto();
    IssueProyecto.Funciones.Init();
    //InicializaActividades();
    ///* CargaGannt();*/
    ////CargaActividadesProyecto();
    //page_content_onresize();
    //$('#accTwoColSeven').addClass('panel-body-open');
    //$('#accTwoColSeven').css('display', 'block');
    //$('#accTwoColSeven2').addClass('panel-body-open');
    //$('#accTwoColSeven2').css('display', 'block');


    //$('.DateRangePicker').daterangepicker({
    //    locale: lacalesDTRP,
    //    ranges: {
    //        'Hoy': [moment(), moment()],
    //        'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //        'Últimos 7 días ': [moment().subtract(6, 'days'), moment()],
    //        'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
    //        'Este mes': [moment().startOf('month'), moment().endOf('month')],
    //        'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //        "Este año": [moment().startOf('year'), moment().endOf('year')],
    //        "Último año": [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
    //    },
    //    startDate: moment().startOf('month'),
    //    endDate: moment().endOf('month')
    //});

    //$('#TxtRangoFechasP').val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));


    //LeerRepositorios();

    //$('#smartwizard').smartWizard({
    //    selected: 0, // Initial selected step, 0 = first step
    //    theme: 'dots', // theme for the wizard, related css need to include for other than default theme
    //    justified: true, // Nav menu justification. true/false
    //    lang: { // Language variables for button
    //        next: 'Siguiente',
    //        previous: 'Anterior'
    //    },
    //    keyboardSettings: {
    //        keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
    //    },
    //    toolbarSettings: {
    //        toolbarExtraButtons: [
    //            $('<button></button>').text('Guardar')
    //                .addClass('btn btn-success')
    //                .attr('id', 'btnFinalizarCD')
    //                .on('click', function () {
    //                    FinalizarCostoDirecto();
    //                }),
    //        ]
    //    },
    //});


    $(".filter-settings-icon").on("click", function () {
        $(".filter-settingspanel").toggleClass("active");
    });
});




var numV = 1;
function CargarInformeProyecto() {

    var url = $('#urlConsultaIndicadores').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Clave: $('#hdClave').val() }),
        dataType: "json",
        async: false,
        success: successCargaInformeProyecto,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

function successCargaInformeProyecto(data) {
    if (data.Exito) {

        var Indicadores = jQuery.parseJSON(data.Indicadores);


        $("#lblNombreP").text(Indicadores.Nombre);

        //Fechas
        $("#LblFechaIniPlan").text(Indicadores.FechaInicioPlan == null || Indicadores.FechaInicioPlan == "" ? "Sin Fecha" : moment(Indicadores.FechaInicioPlan).format("DD/MM/YYYY"));
        $("#LblFechaFinPlan").text(Indicadores.FechaFinPlan == null || Indicadores.FechaFinPlan == "" ? "Sin Fecha" : moment(Indicadores.FechaFinPlan).format("DD/MM/YYYY"));
        $("#LblFechaFinProyectada").text(Indicadores.FechaProyectada == null || Indicadores.FechaProyectada == "" ? "Sin Fecha" : moment(Indicadores.FechaProyectada).format("DD/MM/YYYY"));
        $("#LblFechaFinCompromiso").text(Indicadores.FechaFinComprometida == null || Indicadores.FechaFinComprometida == "" ? "Sin Fecha" : moment(Indicadores.FechaFinComprometida).format("DD/MM/YYYY"));

        $("#LblFechaFinProyectada").addClass(Indicadores.FechaFinComprometida < Indicadores.FechaProyectada ? "text-danger" : "text-success");


        //Avance
        var element2 = document.querySelector('.cavanceactual');
        var avancer = new EasyPieChart(element2, {
            delay: 3000,
            barColor: function () {
                if (Indicadores.DesfaseProc <= 5) {
                    return '#08C127'
                }
                else if (Indicadores.DesfaseProc <= 15) {
                    return '#fea223'
                }
                else {
                    return '#D12106'
                }
            },
            trackColor: '#FFFFFF',
            scaleColor: false,
            lineWidth: 10,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = Indicadores.AvanceRealPorc;
            }
        });
        avancer.update(Indicadores.AvanceRealPorc);
        avancer.disableAnimation();
        avancer.enableAnimation();

        var element3 = document.querySelector('.cavanceesperado');
        var avancees = new EasyPieChart(element3, {
            delay: 3000,
            barColor: '#3fbae4 ',
            trackColor: '#FFFFFF',
            scaleColor: false,
            lineWidth: 10,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = Indicadores.AvanceCompPorc;
            }
        });
        avancees.update(Indicadores.AvanceCompPorc);
        avancees.disableAnimation();
        avancees.enableAnimation();




        $('#LblAvanceActualPorc').text(Indicadores.AvanceRealPorc);
        $('#LblAvanceEsperadoPorc').text(Indicadores.AvanceCompPorc);
        $('#LblDesfasePorc').text(Indicadores.DesfaseProc);


        if (Indicadores.DesfaseProc <= 3) {
            $("#WAvActual").removeClass("widget-danger");
            $("#WAvActual").addClass("widget-success");
            $("#WAvActual").removeClass("widget-warning");

        }
        else if (Indicadores.DesfaseProc >= 15) {
            $("#WAvActual").addClass("widget-danger");
            $("#WAvActual").removeClass("widget-success");
            $("#WAvActual").removeClass("widget-warning");

        }
        else {

            $("#WAvActual").removeClass("widget-danger");
            $("#WAvActual").removeClass("widget-success");
            $("#WAvActual").addClass("widget-warning");

        }


        $('#LblTotalHoras').text(Indicadores.HorasAsignadas);
        $('#LblComprometidas').text(Indicadores.HorasCompromiso);
        $('#LblRelizadas').text(Indicadores.AvanceReal);
        $('#LblDesfase').text(Indicadores.Desfase);



        $('#GraficaAvance').empty();

        $('#scriptsAvance').empty();
        var dsDatos = JSON.parse(data.GraficaAvance);
        $.each(dsDatos, function (key, value) {

            //dsGraficasP.push(value);
            var id = value.id;
            var nombre = value.Nombre;
            var tipo = value.Tipo;
            var series = value.Series;
            var columnas = value.LstColumnas;
            var valores = value.LstValores;

            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema = "temagraficasavanceproy";


            if (tipo == "Pie") {
                var grafica = "<div class='col-md-6'>"
                    + "     <div class='panel panel-default'>"
                    + "                           <div class='panel-heading'>"
                    + "                               <div class='panel-title-box'>"
                    + "                                  <h3>" + nombre + "</h3>"
                    + "                              </div>"
                    + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                    + "                             </ul>"
                    + "                         </div>"
                    + "                         <div class='panel-body'>"
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
                    + '                   x: "center",'
                    + "                   y: 'bottom',"
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
                    + "                   name: 'Ordenes',"
                    + "                   type: 'pie', "
                    + "                   radius: ['35%', '55%'],"
                    + "                   itemStyle: { "
                    + "                       normal: { "
                    + "                           label: { "
                    + "                               show: true "
                    + "                           },"
                    + "                           labelLine: {"
                    + "                               show: true "
                    + "                           }"
                    + "                       },"
                    + "                       emphasis: {"
                    + "                           label: {"
                    + "                               show: true,"
                    + "                               position: 'center',"
                    + "                               textStyle: {"
                    + "                                   fontSize: '14',"
                    + "                                   fontWeight: 'normal' "
                    + "                               } "
                    + "                           }"
                    + "                       }"
                    + "                   },"
                    + '                   data: ' + valores + ''
                    + "               }]"
                    + "           });"
                    + "</script>"

                $('#GraficaAvance').append(grafica);
                $('#scriptsAvance').append(script);

            }
            else if (tipo == "bar") {
                var grafica = "<div class='col-md-12'>"
                    + "     <div class='panel panel-default'>"
                    + "                           <div class='panel-heading'>"
                    + "                               <div class='panel-title-box'>"
                    + "                                  <h3>" + nombre + "</h3>"
                    + "                              </div>"
                    + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                    + "                             </ul>"
                    + "                         </div>"
                    + "                         <div class='panel-body'>"
                    + "                               <div id='" + idgrafica + "' style='height:450px;' > "
                    + "                                </div>"
                    + "                         </div>"
                    + "                       </div>"
                    + "                 </div>"

                var script = "<script>"
                    + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                    + "" + vargrafica + ".setOption({ "
                    + "title: {},"
                    + "tooltip: { trigger: 'axis'},"
                    + " legend: {"
                    + '  data: ' + series + ''
                    + " },"
                    + "  toolbox: {"
                    + "show: true,"
                    + " feature: { "
                    + "            mark: { show: true },"
                    + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                    + "    saveAsImage: {"
                    + "        show: true, "
                    + "        title: 'Descargar'"
                    + "    }"
                    + "}"
                    + "},"
                    + "calculable: true,"
                    + " xAxis: [{ "
                    + " type: 'category',"
                    + ' data:' + columnas + ''
                    + " }],"
                    + " yAxis: [{ "
                    + " type: 'value' "
                    + "}],"
                    + 'series: ' + valores + ''
                    + "});"
                    + "</script>"


                $('#GraficaAvance').append(grafica);
                $('#scriptsAvance').append(script);

            }
            else if (tipo == "line") {

                var grafica = "<div class='col-md-12'>"
                    + "     <div class='panel panel-default'>"
                    + "                         <div class='panel-body'>"
                    + "                               <div id='" + idgrafica + "' style='height:350px;' > "
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
                    //+ "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                    //+ "            saveAsImage: { show: true, title: 'Descargar' }"
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
                    + "            axisLabel: {"
                    + "                formatter: '{value}'"
                    + "            }"
                    + "        }"
                    + "    ],"
                    + 'series: ' + valores + ''
                    + " });"
                    + "</script>"

                $('#GraficaAvance').append(grafica);
                $('#scriptsAvance').append(script);
            }


            //var tabla = '<div class="col-md-6">'
            //    + '       <div class="panel panel-default"> '
            //    + '                       <div class="panel-heading">'
            //    + '                           <div class="panel-title-box">'
            //    + '                               <h3>' + nombre + '</h3>'
            //    + '                           </div> '
            //    + '                           <ul class="panel-controls" style="margin-top: 2px;">'
            //    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
            //    + '                           </ul>'
            //    + '                           <div class="btn-group pull-right">'
            //    + '                               <button class="btn btn-danger dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bars"></i> Exportar</button>'
            //    + '                               <ul class="dropdown-menu">'
            //    + ' <li><a href="#" onclick="$(' + "'#" + vartabla + "'" + ').tableExport({type:' + "'excel',escape:" + "'false'" + '});' + '"' + '><img src="./Content/Project/Imagenes/xls.png" width="24" /> XLS</a></li>'
            //    + '                            </ul>'
            //    + '                           </div> '
            //    + '                       </div> '
            //    + '                       <div class="panel-body padding-0"> '
            //    + '                           <div class="panel-body" style="height:auto;">'
            //    + '                               <table id="' + vartabla + '" class="table table-striped">'
            //    + '' + tabla
            //    + '                               </table>'
            //    + '                                  </div> '
            //    + '                       </div> '
            //    + '                   </div>'
            //    + '               </div>'


            numV = numV + 1;

        });



        //Sprints
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


        dsEquipo = jQuery.parseJSON(data.Equipo);
        tablaEquipo = inicializaTabla($('#TblEquipo'), dsEquipo, columnasEquipo, 1, "asc", false, false,false );


        $('div.pg-loading-screen').remove();
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