var numV = 1;

$(document).ready(function () {


    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });


    //if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
    //    $(".page-container").removeClass("page-navigation-toggled");
    //    x_navigation_minimize("open");
    //} else {
    //    $(".page-container").addClass("page-navigation-toggled");
    //    x_navigation_minimize("close");
    //}

    onresize();
/*    document.body.style.zoom = "85%"*/

    InicializarKPIS();
    CargarIndicadoresOperativos();
    CargarIndicadoresFinancieros();


});
function InicializarKPIS() {


    var url = '/Dashboard/InicializarKPIS';

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
async function CargarIndicadoresOperativos() {


    const data = await POST('/Dashboard/ConsultaIndicadoresEficiencia', { IdAnio: $('#SelAnioKPI').val(), IdMes: $('#SelMesKPI').val() });

    if (data.Exito) {


        $("#hTitle").text("KPIS " + $("#SelMesKPI option:selected").text()  + " / " + $("#SelAnioKPI option:selected").text() );

        $("#topmes").text("Mensual");
        $("#topanio").text("Anual");

        var datos = jQuery.parseJSON(data.Indicadores);



        $("#LblObjetivo").text(datos.Objetivo );
        $("#LblCapturado").text(datos.HorasReportadas );
        $("#LblValorGanado").text(datos.HorasProductivas);
        $("#LblHorasDefectos").text(datos.HorasDefectos );
        $("#LblCantDefectos").text(datos.Bugs );



        $("#LblCapturaPorc").text(datos.PorcCaptura + "%");
        $("#LblProductividad").text(datos.Productividad +  "%");
        $("#LblCalidadPorc").text(datos.Calidad + "%");

        $("#LblEficiencia").text(datos.OEE + "%");

        $("#LblProductividadAnual").text(datos.ProductividadAnual + "%");
        $("#LblCalidadAnual").text(datos.CalidadAnual + "%");

        if (datos.PorcCaptura >= 85) {
            $("#tLblCapturaPorc").removeClass("text-danger").removeClass("text-warning").addClass("text-success");
           }
        else if (datos.PorcCaptura >= 70) {
            $("#tLblCapturaPorc").removeClass("text-danger").removeClass("text-success").addClass("text-warning");
         }
         else {
            $("#tLblCapturaPorc").removeClass("text-warning").removeClass("text-success").addClass("text-danger");
         }


        if (datos.Calidad >= 85) {
            $("#tLblCalidadPorc").removeClass("text-danger").removeClass("text-warning").addClass("text-success");
        }
        else if (datos.Calidad >= 70) {
            $("#tLblCalidadPorc").removeClass("text-danger").removeClass("text-success").addClass("text-warning");
        }
        else {
            $("#tLblCalidadPorc").removeClass("text-warning").removeClass("text-success").addClass("text-danger");
        }



        if (datos.Productividad >= 85) {
            $("#tLblProductividad").removeClass("text-danger").removeClass("text-warning").addClass("text-success");
        }
        else if (datos.Productividad >= 70) {
            $("#tLblProductividad").removeClass("text-danger").removeClass("text-success").addClass("text-warning");
        }
        else {
            $("#tLblProductividad").removeClass("text-warning").removeClass("text-success").addClass("text-danger");
        }


        if (datos.OEE >= 85) {
            $("#tLblEficiencia").removeClass("text-danger").removeClass("text-warning").addClass("text-success");
        }
        else if (datos.OEE >= 70) {
            $("#tLblEficiencia").removeClass("text-danger").removeClass("text-success").addClass("text-warning");
        }
        else {
            $("#tLblEficiencia").removeClass("text-warning").removeClass("text-success").addClass("text-danger");
        }



        var dsDatos = JSON.parse(data.Grafica);
        $('#GraficaEficiencia').empty();
        $('#scriptsEficiencia').empty();
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

            var tema = "temaEstatusKPI";


         

            var grafica = "  <div id='" + idgrafica + "' style='height:450px;'>  </div>";
             



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
                    + "            boundaryGap: true, "
                    + '            data: ' + columnas + ''
                    + "        }"
                    + "    ],"
                    + "    yAxis: ["
                    + "        {"
                    + "            type: 'value',"
                    + "            name: 'Horas',"
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
                    + "                formatter: '{value} %'"
                    + "            }"
                    + "        }"
                    + "    ],"
                    + 'series: ' + valores + ''
                    + " });"
                + "</script>"






            $('#GraficaEficiencia').append(grafica);
            $('#scriptsEficiencia').append(script);
            
            numV = numV + 1;

        });




    }
    else {

        MensajeError(data.Mensaje);
    }

}

async function CargarIndicadoresFinancieros() {


    const data = await POST('/Dashboard/ConsultaIndicadoresFinancieros', { IdAnio: $('#SelAnioKPI').val(), IdMes: $('#SelMesKPI').val() });

    if (data.Exito) {


        $("#tfinmes").text("Mensual");
        $("#tfinanio").text("Anual");

        var datos = jQuery.parseJSON(data.Indicadores);



        $("#LblIngresosM").text("$ " + $.number(datos.Ingresos, '2', '.', ','));
        $("#LblCostosM").text("$ " + $.number(datos.Costos, '2', '.', ','));

        $("#LblIngresosAnual").text("$ " + $.number(datos.IngresosAnual, '2', '.', ','));
        $("#LblCostosAnual").text("$ " + $.number(datos.CostosAnual, '2', '.', ','));



        var element2 = document.querySelector('.cRentabilidad');
        var avancer = new EasyPieChart(element2, {
            delay: 3000,
            barColor: function () {
                if (datos.Rentabilidad >= 45) {
                    return '#08C127'
                }
                else if (datos.OEE >= 30) {
                    return '#fea223'
                }
                else {
                    return '#D12106'
                }
            },
            trackColor: '#FFFFFF',
            scaleColor: false,
            size: 180,
            lineWidth: 15,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = datos.Rentabilidad;
            }
        });
        avancer.update(datos.Rentabilidad);
        avancer.disableAnimation();
        avancer.enableAnimation();



        var element = document.querySelector('.cRentabilidadAnual');
        var avance = new EasyPieChart(element, {
            delay: 3000,
            barColor: function () {
                if (datos.RentabilidadAnual >= 45) {
                    return '#08C127'
                }
                else if (datos.RentabilidadAnual >= 30) {
                    return '#fea223'
                }
                else {
                    return '#D12106'
                }
            },
            trackColor: '#FFFFFF',
            scaleColor: false,
            size: 180,
            lineWidth: 15,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = datos.RentabilidadAnual;
            }
        });
        avance.update(datos.RentabilidadAnual);
        avance.disableAnimation();
        avance.enableAnimation();


        var dsDatos = JSON.parse(data.Grafica);
        $('#GraficaFinancieros').empty();
        $('#scriptsFinancieros').empty();
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

            var tema = "temagraficas2";




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
                + "            boundaryGap: true, "
                + '            data: ' + columnas + ''
                + "        }"
                + "    ],"
                + "    yAxis: ["
                + "        {"
                + "            type: 'value',"
                + "            name: 'MDP',"
                + "            position: 'left',"
                + "            axisLabel: {"
                + "                formatter: '$ {value}'"
                + "            }"
                + "        },"
                + "        {"
                + "            type: 'value',"
                + "            name: '%',"
                + "            position: 'right',"
                + "            axisLabel: {"
                + "                formatter: '{value} %'"
                + "            }"
                + "        }"

                + "    ],"
                + 'series: ' + valores + ''
                + " });"
                + "</script>"

            $('#GraficaFinancieros').append(grafica);
            $('#scriptsFinancieros').append(script);

            numV = numV + 1;

        });




    }
    else {

        MensajeError(data.Mensaje);
    }

}


$(document).on('click', '#BtnFiltrarKPIS', function (e) {

    CargarIndicadoresOperativos();
    CargarIndicadoresFinancieros();

});
