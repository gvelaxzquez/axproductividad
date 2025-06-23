var dsCasosPrueba = [];

var tablaCasosPrueba;
var numV = 1;

var columnasCasosPrueba = [
    {
        "data": "IdCicloCaso",
        "class": "text-center",
        "render": function (data, type, row) {


            if (row.AsignadoPath == "") {
                return '<input type="checkbox" class="SeleccionarECP">';
            }
            else {
                return '<input type = "checkbox" class="SeleccionarECP"><a class="btn btn-default btn-grid BtnEjecutarCP" id="" title"Ejecutar"><i class="fa fa-play-circle  text-success" style="font-size:18px;"></i></a>'
            }

           
 
        }

    },

    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividadCaso + ' )">' + data + '</a>';

        }


    },
    {
        "data": "Titulo",
        "class": "text-left"
        //"render": function (data, type, row) {

        //    //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
        //    return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividadCaso + ' )">' + data + '</a>';

        //}
    },
    {
        "data": "Clasificacion",
        "class": "text-left",


    },
    {
        "data": "TiempoEjecucion",
        "class": "text-right",
    },

    {
        "data": "EstatusP",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'O') {

                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-info "></span> </button>';

            }

            else if (data == 'F') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-warning "></span> </button>';

            }
            else if (data == 'R') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-success "></span> </button>';

            }
            else if (data == 'L') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-success "></span> </button>';

            }
            else if (data == 'A') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-muted "></span> </button>';

            }
            else if (data == 'B') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-danger "></span> </button>';

            }
        }
    },


    {
        "data": "AsignadoPath",
        "class": "text-left",
        "render": function (data, type, row) {
            if (data == "") {

                return 'Sin asignar';
            }
            else {

                return `<img src="https://app.yitpro.com/Archivos/Fotos/${data}.jpg" class="img-dt" style="width: 35px; height: 35px" />${row.Asignado}`
            }

        }

    },


    {
        "data": "FechaInicio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },

    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },

    {

        "class": "text-center",
        "render": () => '<button class="btn btn-primary-light btn-sm btnEliminarACP"><i class="fa fa-trash"></i></button>'
    }



];
var columnasBugs = [


    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }
    },
    {
        "data": "BR",
        "class": "text-left",
    },

    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

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
        "data": "ClasificacionStr",
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

                return `<img src="/Archivos/Fotos/${data}.jpg" class="img-dt" style="width: 35px; height: 35px" /><label > ${row.AsignadoStr}</label>`
            }

        }

    },

];

$(document).ready(function () {


    //$("#BtnActualizaProgresoSprint").hide();
    //$("#BtnActualizaAbiertoSprint").hide();
    //$("#BtnActualizaTerminarSprint").hide();
    //$("#BtnActualizaCancelarSprint").hide();
/*    $("#BtnVerRetrospectiva").hide();*/

    $("#BtnMostrarInd").hide();
    $('#TxtFechaFinCP,#TxtFechaInicioCP').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

    //$('#Calendar').fullCalendar({
    //    locale: 'es',
    //    header: {
    //        left: 'prev,next today',
    //        center: 'title',
    //        right: 'month,agendaWeek,agendaDay,listMonth'
    //    },
    //    buttonIcons: true, // show the prev/next text
    //    navLinks: true, // can click day/week names to navigate views
    //    editable: false,
    //    eventClick: function (info) {
    //        clickalerta(info.id);
    //    }


    //});
    $("#BtnAsignaMCP").hide();
    CargarCicloReport();
    ConsultaBugs();
  


});

function CargarCicloReport() {



    var url = $('#urlConsultaCicloReport').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdCicloP: $('#IdCicloP').val(), Estatus: $('#SelEstatusCPE').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {


            var datos = jQuery.parseJSON(data.CicloPrueba);

            $("#IdProyectoCP").val(datos.IdProyecto);
            /*  $("#lblNombreP").text(datos.Proyecto);*/
            $("#lblNombreCP").text(datos.Nombre + " | " + datos.Ambiente)
            $("#LblCicloP").text(datos.Nombre);
            $("#lblDescripcion").text(datos.Descripcion);
            $("#lblFechaInicio").text(moment(datos.FechaInicio).format("DD/MM/YYYY"));
            $("#lblFechaFin").text(moment(datos.FechaFin).format("DD/MM/YYYY"));

            $("#lblTiempoEjecucion").text($.number(datos.TiempoEjecucion, '2', '.', ',') +  " hrs.");

            $("#TituloCPModal").text(datos.Nombre);
            $('#TxtNombreCP').val(datos.Nombre);
            $('#TxtAmbienteCP').val(datos.Ambiente);
            $('#TxtDescripcionCP').val(datos.Descripcion);
            $('#TxtFechaInicioCP').val(moment(datos.FechaInicio).format("DD/MM/YYYY"));
            $('#TxtFechaFinCP').val(moment(datos.FechaFin).format("DD/MM/YYYY"));


            $('#titleEBugs').text("Bugs (" + datos.Defectos + ")");

            $("#spEstatusCSP").removeClass("text-info text-progress text-warning text-success text-danger text-muted");

            $("#IdCicloEstatus").val(datos.Estatus);

            if (datos.Estatus == "A") {
                $("#spEstatusCSP").addClass("text-info");
                $("#BtnEstatusSP").text("Abierto");
                $("#BtnActualizaProgresoCP").show();
                $("#BtnActualizaAbiertoCP").hide();
                $("#BtnActualizaTerminarCP").hide();


            }
            if (datos.Estatus == "P") {
                $("#spEstatusCSP").addClass("text-progress");
                $("#BtnEstatusSP").text("En progreso");



                $("#BtnActualizaProgresoCP").hide();
                $("#BtnActualizaAbiertoCP").show();
                $("#BtnActualizaTerminarCP").show();

            }
            if (datos.Estatus == "L") {
                $("#spEstatusCSP").addClass("text-success");
                $("#BtnEstatusSP").text("Terminado");



                $("#BtnActualizaProgresoCP").hide();
                $("#BtnActualizaAbiertoCP").show();

                $("#BtnActualizaTerminarCP").hide();
                $("#BtnActualizaCancelarCP").hide();


            }
            if (datos.Estatus == "C") {
                $("#spEstatusCSP").addClass("text-muted");
                $("#BtnEstatusSP").text("Cancelado");


                $("#BtnActualizaProgresoCP").show();
                $("#BtnActualizaAbiertoCP").show();
                $("#BtnActualizaTerminarCP").hide();
                $("#BtnActualizaCancelarCP").hide();



            }


            


            dsCasosPrueba = datos.CasosPrueba;
            tablaCasosPrueba = inicializaTabla($('#TblCasosPrueba'), dsCasosPrueba, columnasCasosPrueba, 5, "asc", false,false, true);

            $("#tCC").text("Casos de prueba (" + dsCasosPrueba.length + ")");

            var element2 = document.querySelector('.cavanceactual');
            var avancer = new EasyPieChart(element2, {
                delay: 2000,
                barColor: '#3fbae4',
                trackColor: '#FFFFFF',
                scaleColor: false,
                lineWidth: 30,
                trackWidth: 40,
                lineCap: 'square',
                size: 220,
                onStep: function (from, to, percent) {
                    this.el.children[0].innerHTML = datos.Avance;
                }
            });
            avancer.update(datos.Avance);
            avancer.disableAnimation();
            avancer.enableAnimation();


            $('#GraficaCP').empty();
            $('#GraficaEBugs').empty();
            $('#scriptsCP').empty();

            var dsDatos = JSON.parse(data.GraficaCP);

            $.each(dsDatos, function (key, value) {


                var id = value.id;
                var nombre = value.Nombre;
                var tipo = value.Tipo;
                var series = value.Series;
                var valores = value.LstValores;
                var idgrafica = "grafica" + numV.toString();
                var vargrafica = "vargrafica" + numV.toString();
                var vartabla = "vartabla" + numV.toString();

                var tema = nombre == "Estatus" ? "temagraficaestatusTC" : "temagraficaestatustask";


                if (tipo == "Pie") {
                    var grafica = "<div class='col-md-12'>"
                        + "     <div class=''>"
                        + "                         <div class=''>"
                        + "                               <div id='" + idgrafica + "' style='height:300px;' > "
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
                        + "show: false,"
                        + " feature: { "
                        + "            mark: { show: true },"
                        + "            magicType: { show: true, type: ['funnel', 'pie'] , title:''},"
                        + "    saveAsImage: {"
                        + "        show: false, "
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
                        + "                               position: 'left',"
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

                    if (nombre == "Estatus") {

                        $('#GraficaCP').append(grafica);
                    }
                    else {

                        $('#GraficaEBugs').append(grafica);
                    }
                    
                    $('#scriptsCP').append(script);

                }
                //else if (tipo == "bar") {
                //    var grafica = "<div class='col-md-12'>"
                //        + "     <div class='panel panel-default'>"
                //        + "                           <div class='panel-heading'>"
                //        + "                               <div class='panel-title-box'>"
                //        + "                                  <h3>" + nombre + "</h3>"
                //        + "                              </div>"
                //        + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                //        + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                //        + "                             </ul>"
                //        + "                         </div>"
                //        + "                         <div class='panel-body'>"
                //        + "                               <div id='" + idgrafica + "' style='height:450px;' > "
                //        + "                                </div>"
                //        + "                         </div>"
                //        + "                       </div>"
                //        + "                 </div>"

                //    var script = "<script>"
                //        + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                //        + "" + vargrafica + ".setOption({ "
                //        + "title: {},"
                //        + "tooltip: { trigger: 'axis'},"
                //        + " legend: {"
                //        + '  data: ' + series + ''
                //        + " },"
                //        + "  toolbox: {"
                //        + "show: true,"
                //        + " feature: { "
                //        + "            mark: { show: true },"
                //        + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                //        + "    saveAsImage: {"
                //        + "        show: true, "
                //        + "        title: 'Descargar'"
                //        + "    }"
                //        + "}"
                //        + "},"
                //        + "calculable: true,"
                //        + " xAxis: [{ "
                //        + " type: 'category',"
                //        + ' data:' + columnas + ''
                //        + " }],"
                //        + " yAxis: [{ "
                //        + " type: 'value' "
                //        + "}],"
                //        + 'series: ' + valores + ''
                //        + "});"
                //        + "</script>"


                //    $('#GraficaBurndown').append(grafica);
                //    $('#scriptsBurndown').append(script);

                //}
                //else if (tipo == "line") {

                //    var grafica = "<div class='col-md-12'>"
                //        + "     <div class=''>"
                //        + "                         <div class=''>"
                //        + "                               <div id='" + idgrafica + "' style='height:450px;' > "
                //        + "                                </div>"
                //        + "                         </div>"
                //        + "                       </div>"
                //        + "                 </div>"


                //    var script = "<script>"
                //        + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                //        + "" + vargrafica + ".setOption({ "
                //        + "    title: { "
                //        + "        text: '',"
                //        + "        subtext: '' "
                //        + "    },"
                //        + "    tooltip: {"
                //        + "        trigger: 'axis'"
                //        + "    },"
                //        + " legend: {"
                //        + '  data: ' + series + ''
                //        + " },"
                //        + "    toolbox: {"
                //        + "        show: true,"
                //        + "        feature: {"
                //        + "            mark: { show: true },"
                //        + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                //        + "            saveAsImage: { show: true, title: 'Descargar' }"
                //        + "        } "
                //        + "    },"
                //        + "    calculable: true,"
                //        + "    xAxis: ["
                //        + "        {"
                //        + " type: 'category', "
                //        + "            boundaryGap: false, "
                //        + '            data: ' + columnas + ''
                //        + "        }"
                //        + "    ],"
                //        + "    yAxis: ["
                //        + "        {"
                //        + "            type: 'value',"
                //        + "            axisLabel: {"
                //        + "                formatter: '{value}'"
                //        + "            }"
                //        + "        }"
                //        + "    ],"
                //        + 'series: ' + valores + ''
                //        + " });"
                //        + "</script>"

                //    $('#GraficaBurndown').append(grafica);
                //    $('#scriptsBurndown').append(script);
                //}




      


                numV = numV + 1;

            });







        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}

function CargarCicloReport_Tabla() {



    var url = $('#urlConsultaCicloReport').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdCicloP: $('#IdCicloP').val(), Estatus: $('#SelEstatusCPE').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var datos = jQuery.parseJSON(data.CicloPrueba);

            dsCasosPrueba = datos.CasosPrueba;
            tablaCasosPrueba = inicializaTabla($('#TblCasosPrueba'), dsCasosPrueba, columnasCasosPrueba, 5, "asc", false, false, true);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}

async function ConsultaBugs() {


    const data = await POST('/QA/LeerBugsCicloReport', { IdCicloP: $('#IdCicloP').val(), Estatus: $('#SelEstatusCPB').val() });



    if (data.Exito) {

        var dsBugs = data.LstBugs;

        $("#tBug").text("Bugs (" + dsBugs.length + ")");

        tablaBugs = inicializaTabla($('#TblBugs'), dsBugs, columnasBugs, 0, "asc", false, false, false);


    }
    else {

        MensajeError(data.Mensaje);
    }

}



$(document).on('change', '#SelEstatusCPE', function (e) {


    CargarCicloReport_Tabla();

    return false;

});

$(document).on('change', '#SelEstatusCPB', function (e) {


    ConsultaBugs();

    return false;

});


$(document).on('click', '#BtnModificarCP', function (e) {




    $("#ModalCP").modal('show');



});




function zoomIn() {
    gantt.ext.zoom.zoomIn();
}
function zoomOut() {
    gantt.ext.zoom.zoomOut()
}

function CambiarZoom(zoom) {
    gantt.ext.zoom.setLevel(zoom);
}



$(document).on('click', '#BtnOcultarInd', function (e) {


    $("#BtnOcultarInd").hide();
    $("#BtnMostrarInd").show();

    $("#divIndicadores").hide("slow");


});

$(document).on('click', '#BtnMostrarInd', function (e) {

    $("#BtnMostrarInd").hide();
    $("#BtnOcultarInd").show();

    $("#divIndicadores").show("slow");

});



$(document).on('click', '#BtnGuardarCP', function (e) {


    GuardarCP();
    return false;
});

function GuardarCP() {
    var Mensaje = ValidaCamposRequeridos(".ReqCP");


    if (Mensaje.length == 0) {


        var CP = {
            IdCicloP: $('#IdCicloP').val(),
            IdProyecto: $('#SelProyectoCP').val(),
            Nombre: $('#TxtNombreCP').val().trim(),
            Ambiente: $('#TxtAmbienteCP').val().trim(),
            Descripcion: $('#TxtDescripcionCP').val().trim(),
            FechaInicio: ObtieneFecha($('#TxtFechaInicioCP').val().trim()),
            FechaFin: ObtieneFecha($('#TxtFechaFinCP').val().trim())
        }
        LlamadaGuardarDatosCP(CP);
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

}



function LlamadaGuardarDatosCP(CP) {

    var url = $('#urlGuardarCP').val();

    $.ajax({

        url: url,
        data: JSON.stringify(CP),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarCP,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarCP(data) {
    if (data.Exito) {

        $('#ModalCP').modal('hide');

        setTimeout(function () {
            location.reload();
        }, 3000);

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}


function BuscarCasosPrueba() {


    $("#tbuscar").text("Agregar casos de prueba a " + $("#lblNombreCP").text());

    $("#IdProyectoBWICP").val($("#IdProyectoCP").val());
    $("#IdCicloPBWICP").val($("#IdCicloP").val());


    $('#MdlBuscarCasosPrueba').modal({ keyboard: false });

    CargaWorkItemsCP();
    FiltrarCasosPrueba(-1);

    return false;
};


$(document).on('click', '#BtnAgrearBWI', function (e) {


    var validar = '';

    $.map(dsBacklogBuscar, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ningún caso de prueba.');
        return false;
    }

    var url = $('#urlAsignacionCasosPruebaMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar, IdCicloP: $('#IdCicloP').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                $('#MdlBuscarCasosPrueba').modal('hide');
                MensajeExito("Se agregaron los elementos al ciclo de prueba");
                CargarCicloReport();


            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;

});


$(document).on('click', '.BtnEjecutarCP', function (e) {


    if ($("#IdCicloEstatus").val() != "P") {

        MensajeAdvertencia("Solo se pueden ejecutar pruebas cuando el estatus del sprint es ´En progreso´");

        return false;
    }


    var filaPadre = $(this).closest('tr');
    var row = tablaCasosPrueba.api().row(filaPadre);
    var datosFila = row.data();


    if (datosFila.Asignado == "") {

        MensajeAdvertencia("Para ejecutar el caso de prueba, primero debe asignarlo");

        return false;
    }

    InicializarEjeucionPrueba(datosFila.IdCicloCaso,0);

    $('#MdlEjecutarCasoPrueba').modal({ keyboard: false });
    $('#MdlEjecutarCasoPrueba').on('hidden.bs.modal', function () {

        CargarCicloReport();
        $(this).off('hidden.bs.modal');
    });


    /*  LlamadaConsultarDatosUsuario(datosFila.IdUsuario);*/

});



function ActualizaEstatusCP(Estatus) {

    var url = $('#urlActualizaEstatusCP').val();


    $.ajax({
        url: url,
        data: JSON.stringify({ IdCicloP: $('#IdCicloP').val(), Estatus: Estatus }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {



                $("#spEstatusCSP").removeClass("text-info text-progress text-warning text-success text-danger text-muted");


                $("#IdCicloEstatus").val(Estatus);

                if (Estatus == "A") {
                    $("#spEstatusCSP").addClass("text-info");
                    $("#BtnEstatusSP").text("Abierto");
                    $("#BtnActualizaProgresoCP").show();
                    $("#BtnActualizaAbiertoCP").hide();
                    $("#BtnActualizaTerminarCP").hide();


                }
                if (Estatus == "P") {
                    $("#spEstatusCSP").addClass("text-progress");
                    $("#BtnEstatusSP").text("En progreso");



                    $("#BtnActualizaProgresoCP").hide();
                    $("#BtnActualizaAbiertoCP").show();
                    $("#BtnActualizaTerminarCP").show();

                }
                if (Estatus == "L") {
                    $("#spEstatusCSP").addClass("text-success");
                    $("#BtnEstatusSP").text("Terminado");



                    $("#BtnActualizaProgresoCP").hide();
                    $("#BtnActualizaAbiertoCP").show();

                    $("#BtnActualizaTerminarCP").hide();
                    $("#BtnActualizaCancelarCP").hide();


                }
                if (Estatus == "C") {
                    $("#spEstatusCSP").addClass("text-muted");
                    $("#BtnEstatusSP").text("Cancelado");


                    $("#BtnActualizaProgresoCP").show();
                    $("#BtnActualizaAbiertoCP").show();
                    $("#BtnActualizaTerminarCP").hide();
                    $("#BtnActualizaCancelarCP").hide();



                }


            } else {
                MensajeError(data.Mensaje);

            }


        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}


$(document).on('click', '.btnEliminarACP', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaCasosPrueba.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdCicloPEliminar').val(datosFila.IdCicloCaso);

    MensajeConfirmarAccion("¿Desea eliminar esta registro?", "BtnEliminaACP");

    return false;



});


$(document).on('click', '#BtnEliminaACP', function (e) {
    var IdCicloCaso = $('#IdCicloPEliminar').val();
    var url = $('#urlEliminarACP').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdCicloCaso: IdCicloCaso }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {
                CargarCicloReport();
            }
            else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            MensajeError("Error al eliminar el registro, intente de nuevo.");
        }
    });
    return false;
});

$(document).on('click', '#BtnImprimirCR', function (e) {




    if (dsCasosPrueba.length > 0) {

        var url = $('#urlExportCR').val() + "/" + $('#IdCicloP').val();
        window.open(url, '_self');
    } else {

        MensajeAdvertencia("No existen registros para imprimir");

    }


    return false;

});


var totalhoras = 0;
$(document).on('change', '.SeleccionarECP', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaCasosPrueba.api().row(filaPadre);
    var datosFila = row.data();
    var IdCicloCaso = datosFila.IdCicloCaso;

    var indexes = $.map(dsCasosPrueba, function (obj, index) {
        if (obj.IdCicloCaso == IdCicloCaso) {
            return index;
        }
    });
    dsCasosPrueba[indexes[0]].Seleccionado = $(this).prop('checked');



    var validar = '';
   
    $.map(dsCasosPrueba, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdCicloCaso + ',';
            //totalhoras =  totalhoras + obj.TiempoEjecucion;
        }
        //else {
        //    totalhoras =  totalhoras - obj.TiempoEjecucion;
        //}
    });


    if (validar == '') {

      /*  totalhoras = 0;*/
        $("#BtnAsignaMCP").hide();

    }
    else {


        $("#BtnAsignaMCP").show();
    }





    return false;

});


$(document).on('click', '#BtnAsignaMCP', function (e) {

    var asignar = [];
    var validar = '';
    var tiempoejecucion = 0;
    $.map(dsCasosPrueba, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdCicloCaso + ',';
            tiempoejecucion += obj.TiempoEjecucion;
            asignar.push(obj.IdCicloCaso)

        }
    });


    CPSAsignar = asignar;

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ningun caso de prueba.');
        return false;
    }
    CargaUsuariosACP();

    $('#LblTiempoEjecucion').text($.number(tiempoejecucion, '2', '.', ','));
    $('#TxtFechaInicioACP').val('');
    $('#TxtFechaPlanACP').val('');




    $('#MdlAsignarCP').modal({ keyboard: false });


    return false;

});

