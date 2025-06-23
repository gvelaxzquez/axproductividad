
var dsCosto = [];
var tablaCosto;


var dsCostoDetalle = [];
var tablaCostoDetalle;
var numV = 1;

$(document).ready(function () {

    $('#SelAnioPC').val($('#AnioActual').val());
    $('#SelAnioPC').selectpicker('refresh');


    CargarCostos();
    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });
});

var ColumnasCosto = [
    {
        "data": "NombreProy",
        "class": "text-left",


    },
    {
        "data": "CostoHoraPlan",
        "class": "text-right",
        "render": function (data, type, row) {
                return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },
    {
        "data": "CostoHoraReal",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoHoraMes(' + row.IdProyecto + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return '<a style="cursor:pointer" href="#" onclick="VerCostoHoraMes(-1)" >' + $.number(data, '2', '.', ','); + '</a>'
            }
        }
    },

    {
        "data": "Ene",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(1,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',')  + "<b>"  ;
            }


            

        }
    },
    {
        "data": "Feb",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(2,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }

           
        }
    },
    {
        "data": "Mar",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(3,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }


           
        }
    },
    {
        "data": "Abr",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(4,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }

           
        }
    },
    {
        "data": "May",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(5,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }


         
        }
    },
    {
        "data": "Jun",
        "class": "text-right",
        "render": function (data, type, row) {

            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(6,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }


            
        }
    },
    {
        "data": "Jul",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(7,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "Ago",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(8,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "Sep",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(9,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "Oct",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(10,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {

                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "Nov",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(11,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {
                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "Dic",
        "class": "text-right",
        "render": function (data, type, row) {
            if (row.IdProyecto != 0) {
                return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(12,' + "" + row.IdProyecto + "," + data + ')" >' + $.number(data, '2', '.', ','); + '</a>'
            }
            else {
                return "<b>" + $.number(data, '2', '.', ',') + "<b>";
            }
        }
    },
    {
        "data": "Planeado",
        "class": "text-right",
        "render": function (data, type, row) {
                return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },
    {
        "data": "Acumulado",
        "class": "text-right",
        "render": function (data, type, row) {


            return "<b>" + $.number(data, '2', '.', ',') + "<b>";


        }
    },
    {
        "data": "CostoProyectado",
        "class": "text-right",
        "render": function (data, type, row) {

            if (row.CostoProyectado >= row.Planeado) {
                return '<span class="btn btn-danger btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }
            else {

                return '<span class="btn btn-success btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
            }


        }
    },
    {
        "data": "PorcUtilizado",
        "class": "text-right",
        "render": function (data, type, row) {


            if (row.IdProyecto != 0) {

                if (row.PorcUtilizado >= 100) {
                    return '<span class="btn btn-danger btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
                }
                else if (row.PorcUtilizado >= 85) {

                    return '<span class="btn btn-warning btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
                }
                else {

                    return '<span class="btn btn-success btn-small " style="width:80%;text-align:right;">' + $.number(data, '2', '.', ',') + '</span>'
                }

            }
            else {

                return '';
            }





        }
    },


];
var ColumnasCostoDetalle = [

    {
        "class": "text-center",
        "data": "Clave",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Lider + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:60px; height:60px;cursor:pointer;">'
        }
    },
    {
        "data": "Recurso",
        "class": "text-left",
    },
    {
        "data": "Mes",
        "class": "text-left",
        "render": function (data, type, row) {
            return row.NombreMes + "/" + row.Anio;
        }
    },
    {
        "data": "Porcentaje",
        "class": "text-right",
        "render": data => $.number(data, '2', '.', ',')
    },
    {
        "data": "TotalMes",
        "class": "text-right",
        "render": data => $.number(data, '2', '.', ',')
    }
];


function CargarCostos() {

    var url = $('#urlObtieneCostos').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Anio: $('#SelAnioPC').val(), Abierto: $('#ChkAbiertos').prop('checked')}),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {


            $("#lblAniofiltro").text($("#SelAnioPC option:selected").text());

            dsCosto = jQuery.parseJSON(data.LstCostos);
            tablaCosto = inicializaTabla($('#TblCostos'), dsCosto, ColumnasCosto, 0, "desc", false, true, true);

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}



$(document).on('click', '#BtnFiltrarPC', function (e) {

    CargarCostos();
    $(".filter-settings").toggleClass("active");
    return false;

});

$(document).on('click', '#BtnNuevoFP', function (e) {

    VerFlujo(0);
    return false;

});

function VerFlujo(Id) {

    var url = $('#urlFlujoDetalle').val() + "/" + Id;

    window.open(url, '_blank');
}

$('#BtnExportarPC').click(e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("Anio", $('#SelAnioPC').val());
    formData.append("Abierto", $('#ChkAbiertos').prop('checked'));


    DOWNLOAD('/Proyectos/DescargarExcelCostosMensuales', 'CostosMensuales.xlsx', formData, true);
});

function VerFlujoMes(Mes, IdProyecto, Total) {

    var url = $('#urlObtieneFlujoMes').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Anio: $('#SelAnioFP').val(),Mes : Mes, IdProyecto: IdProyecto, TipoFecha: $('#TipoFecha').val(), Archivado: $('#ChkArchivado').prop('checked') }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            dsFlujoMes = jQuery.parseJSON(data.LstFlujoMes);
            tablaFlujoMes = inicializaTabla($('#TblFlujoMes'), dsFlujoMes, ColumnasFlujoMes, 0, "desc", false, true, true);
            $('#MesD').val(Mes);
            $('#IdProyectoD').val(IdProyecto);

            $("#LblTotalFlujoMes").text("$ " + $.number(Total, '2', '.', ','));

            $("#ModalDetallePagosMes").modal('show');

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

$('#BtnExportarFPDM').click(e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("Anio", $('#SelAnioFP').val())
    formData.append("Mes", $('#MesD').val())
    formData.append("TipoFecha", $('#TipoFecha').val())
    formData.append("IdProyecto", $('#IdProyectoD').val())
    formData.append("Archivado", $('#ChkArchivado').prop('checked'))
    DOWNLOAD('/Proyectos/DescargaExcelFlujoPagosMes', 'FlujoPagos.xlsx', formData, true);
});


function VerCostoMes(Mes, IdProyecto, Total) {



    var url = $('#urlObtieneCostosDetalle').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Anio: $('#SelAnioPC').val(), Mes: Mes, IdProyecto: IdProyecto}),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            dsCostoDetalle = jQuery.parseJSON(data.LstCostos);
            tablaCostoDetalle = inicializaTabla($('#TblCostoMes'), dsCostoDetalle, ColumnasCostoDetalle, 0, "desc", false, true, true);
    

            $("#LblTotalCostoMesDet").text("$ " + $.number(Total, '2', '.', ','));

            $("#TituloDCM").text("Proyecto: " + data.Proyecto);

            $("#ModalDetalleCostosMes").modal('show');

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}


function VerCostoHoraMes(IdProyecto) {




    $('#GraficaCostoHoraModal').empty();
    $('#TablaCostoHoraModal').empty();

    $('#scriptsCostoHoramodal').empty();
    $("#ModalGraficaCostoHora").modal('show');

    var url = $('#urlConsultaGraficaCostoHoraProyecto').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdProyecto: IdProyecto }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {


            var dsDatos = JSON.parse(data.GraficaCostoHora);

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

                    $('#GraficaCostoHoraModal').append(grafica);
                    $('#scriptsCostoHoramodal').append(script);

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


                    $('#GraficaCostoHoraModal').append(grafica);
                    $('#scriptsCostoHoramodal').append(script);

                }
                else if (tipo == "line") {

                    var grafica = "<div class='col-md-12'>"
                        + "     <div class='panel panel-default'>"
                        + "                         <div class='panel-body'>"
                        + "                               <div id='" + idgrafica + "' style='height:450px;' > "
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
                        + "            axisLabel: {"
                        + "                formatter: '{value}'"
                        + "            }"
                        + "        }"
                        + "    ],"
                        + 'series: ' + valores + ''
                        + " });"
                        + "</script>"

                    $('#GraficaCostoHoraModal').append(grafica);
                    $('#scriptsCostoHoramodal').append(script);
                }




                var table = '<div class="btn-group pull-right">'
                    + '                               <button class="btn btn-danger dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bars"></i> Exportar</button>'
                    + '                               <ul class="dropdown-menu">'
                    + ' <li><a href="#" onclick="$(' + "'#" + vartabla + "'" + ').tableExport({type:' + "'excel',escape:" + "'false'" + '});' + '"' + '><img src="./Content/Project/Imagenes/xls.png" width="24" /> XLS</a></li>'
                    + '                            </ul>'
                    + '                           </div> '
                    + ' <div class="panel-body" style="height:600px;">'
                    + '<div class="col-md-12">'
                    + '<div class="table-responsive">'
                    + '                               <table id="' + vartabla + '" class="table datatable text table-striped">'
                    + '' + tabla
                    + '                               </table>'
                    + '                           </div> '
                    + '                           </div> '
                    + '                           </div> '

                $('#TablaCostoHoraModal').append(table);



                numV = numV + 1;

            });




        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}



function MostrarGraficasM() {
    $('#TablaCostoHoraModal').hide();
    $('#GraficaCostoHoraModal').show();
}

function MostrarTablasM() {
    $('#TablaCostoHoraModal').show();
    $('#GraficaCostoHoraModal').hide();
}


