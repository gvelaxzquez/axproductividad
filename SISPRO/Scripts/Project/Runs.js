
var sprintgantt = false;
var recarga = false;
var numV = 1;
var $table = $('#table');
var dsBugs = [];
var dsECP = [];


var columnasBugs = [


    //{
    //    "data": "IdActividadStr",
    //    "class": "text-left",
    //},
    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {

            //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }
    },
    {
        "data": "BR",
        "class": "text-left",
    },
    //{
    //    "data": "PrioridadStr",
    //    "class": "text-center",
    //},
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



var columnasECP = [


    {
        "data": "NombreCP",
        "class": "text-left",
        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="VerECP(' + row.IdCicloCaso + ' )">' + data + '</a>';

        }
    },
    {
        "data": "FechaEjecucion",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "EstatusP",
        "class": "text-left",
        "render": function (data, type, row) {



            if (data == 'A') {

                return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

            }
            else if (data == 'F') {
                return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

            }

            else if (data == 'B') {
                return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

            }
            else if (data == 'L') {
                return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

            }
            else if (data == 'O') {
                return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

            }



   
        }
    },
    {
        "data": "AsignadoPath",
        "class": "text-left",
        "render": function (data, type, row) {
            if (data == "") {

                return "";
            }
            else {

                return `<img src="/Archivos/Fotos/${data}.jpg" class="img-dt" style="width: 35px; height: 35px" /><label > ${row.Asignado}</label>`
            }

        }

    }

];




$(document).ready(function () {


    $(".headerCP").hide();

 

});


$(document).on('change', '#SelProyectoCP', function (e) {


    ConsultaCPS();
    ConsultaTC(0);
    ConsultaBugs();
    $(".headerCP").show();

    return false;

});


$(document).on('change', '#SelEstatusCP', function (e) {


    ConsultaCPS();
    $(".headerCP").show();

    return false;

});



$(document).on('click', '#BtnAddCP', function (e) {

    InicializaModalCP();
    $('#ModalCP').modal('show');

    return false;
});






function InicializaModalCP() {

    $('#TxtFechaFinCP,#TxtFechaInicioCP').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });
    $('#TxtNombreCP').val('');
    $('#TxtAmbienteCP').val('');
    $('#TxtDescripcionCP').val('');
    $('#TxtFechaFinCP').val('');
    $('#TxtFechaInicioCP').val('');

}



$(document).on('click', '#BtnGuardarCP', function (e) {


    GuardarCP();
    return false;
});


function GuardarCP() {
    var Mensaje = ValidaCamposRequeridos(".ReqCP");


    if (Mensaje.length == 0) {


        var CP = {
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
        $('div.pg-loading-screen').remove();
        MensajeExito(data.Mensaje);
        ConsultaCPS();

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}


function ConsultaCPS() {
    var url = $('#urlCargaCPS').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#SelProyectoCP').val(), Estatus: $('#SelEstatusCP').val() }),
        dataType: "json",
        async: true,
        success: successCargaCiclos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}

var num = 1;
function successCargaCiclos(data) {
    if (data.Exito) {


        $('#tblCasosPrueba').empty();
 

 

        var ciclos = jQuery.parseJSON(data.Ciclos);

        $("#tCC").text("Sprints (" + ciclos.length + ")");

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
                    '<span class="chart"  id="' + vargrafica + '" data-percent="86">' +
                    '    <span class="percent"></span><br>' +
                    '       <p> % Avance </p>' +
                    '</span>' +
                    '</td>' +
                    '<td>' +
                    '<span class="chart"  id="' + vargrafica2 + '" data-percent="86">' +
                    '    <span class="percent"></span><br>' +
                    '       <p>% Aprobado</p>' +
                    '</span>' +
                    '</td>' +
               /*     '<td><div class="pull-right font-bold text-primary"> <h4 class="text-default">' + value.Avance + '%</h4></div> </td>' +*/
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
                $('#scripts').append(script);
                $('#scripts').append(script2);


                num++;
             

            });


        }
        else {

            var sp = '<tr><td><h4 class="no-margins font-extra-bold"> No hay ciclos de prueba </h4>  </td></tr>'

            $('#tblCasosPrueba').append(sp);
        }







        page_content_onresize();


    }
    else {

        MensajeError(data.Mensaje);
    }

}




function VerCP(IdCicloP) {


    var url = $('#urlRun').val() + "/" + IdCicloP;
    window.open(url, '_blank');


}




async function ConsultaTC(Tipo) {

    Filtros = {
        IdProyecto: $("#SelProyectoCP").val(),
        Tipo: Tipo

    }
    const data = await POST('/QA/ConsultaBacklogQA', { Filtros: Filtros });

    if (data.Exito) {

        var dsBacklog2 = jQuery.parseJSON(data.LstTC);

        $("#tCP").text("Casos de prueba (" + dsBacklog2.length + ")");

        if (recarga) {

            $table.bootstrapTable('load', dsBacklog2);
        }
        else {

            $table.bootstrapTable({

                data: dsBacklog2,
                idField: 'IdActividad',
                toolbar: "#toolbar",
                search: true,
                idtable: "saveId",
                columns: [
                

                    {
                        field: 'IdActividadStr',
                        title: '#',
                        width: "80px",
                        formatter: function (value, row, index) {
                            return '<a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>';
                         /*   return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" /> <a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>';*/

                        }
                    },

                    {
                        field: 'BR',
                        title: 'Título',
                        width: "350px",
                        sortable: true,
  
                    },
                    {
                        field: 'ClasificacionStr',
                        sortable: true,
                        title: 'Tipo',
                       
                    },
                    {
                        field: 'Estatus',
                        title: 'Estatus',
                        sortable: true,
                        align: 'left',
                        formatter: function (value, row, index) {

                            if (row.TipoId == 4) {

                                return "";
                            }
                            else {

                                if (value == 'A') {

                                    return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'F') {
                                    return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                              
                                else if (value == 'B') {
                                    return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'L') {
                                    return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'O') {
                                    return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }


                            }


                        }
                    },
                    {
                        field: 'IdActividad',
                        title: '',
                        width: "20",
                        formatter: function (value, row, index) {

                            if (row.TipoId == 4) {

                                return "";
                            }
                            else {

                                return "<button class='btn btn-grid' title='Ver historial de ejecuciones' onclick='RunHistory(" + value + ");' style='cursor: pointer;'> <span class='fa fa-search-plus'></span></button>"
                            }

                          

                        }
                    }
                  
                ],
                //treeShowField: 'BR',
                //parentIdField: 'IdActividadR1',
                //onPostBody: function () {
                //    var columns = $table.bootstrapTable('getOptions').columns

                //    if (columns && columns[0][1].visible) {
                //        $table.treegrid({
                //            treeColumn: 2,
                //            initialState: "collapsed",
                //            onChange: function () {
                //                $table.bootstrapTable('resetView')
                //            }
                //        })
                //    }
                //}
            })

            recarga = true;

        }

        $('#GraficaBL').empty();
  
        $('#scriptsBL').empty();

        var dsDatos = JSON.parse(data.GraficaBL);

        $.each(dsDatos, function (key, value) {


            var id = value.id;
            var nombre = value.Nombre;
            var tipo = value.Tipo;
            var series = value.Series;
            /*     var columnas = value.LstColumnas;*/
            var valores = value.LstValores;
            /*   var tabla = value.Tabla;*/
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
                    + '                   orient: "horizontal",'
                    + '                   x: "right",'
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


                $('#GraficaBL').append(grafica);
                $('#scriptsBL').append(script);

            }








            numV = numV + 1;

        });



    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function ConsultaBugs() {


    const data = await POST('/QA/LeerBugsCP', { IdProyecto: $("#SelProyectoCP").val() });

    

    if (data.Exito) {

        var dsBugs = data.LstBugs;

        $("#tBug").text("Bugs (" + dsBugs.length + ")");

        tablaBugs = inicializaTabla($('#TblBugs'), dsBugs, columnasBugs, 0, "asc", false, false, false);
       
   
        $('#GraficaBugs').empty();

        $('#scriptsBugs').empty();

        var dsDatos = data.GraficaBugs;

        $.each(dsDatos, function (key, value) {


            var id = value.id;
            var nombre = value.Nombre;
            var tipo = value.Tipo;
            var series = value.Series;
            /*     var columnas = value.LstColumnas;*/
            var valores = value.LstValores;
            /*   var tabla = value.Tabla;*/
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
                    + '                   orient: "horizontal",'
                    + '                   x: "right",'
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


                $('#GraficaBugs').append(grafica);
                $('#scriptsBugs').append(script);

            }

            numV = numV + 1;

        });



    }
    else {

        MensajeError(data.Mensaje);
    }

}

function ExpandCollappse(tipo) {

    $('#table').treegrid(tipo);


    /*    $table.bootstrapTable(tipo);*/
}


function newTestCaseCC() {


    $('#ModalActividades').modal({ keyboard: false });

    $('#ModalActividades').on('hidden.bs.modal', function () {

        ConsultaTC(0);
        $(this).off('hidden.bs.modal');

    });

    $('#IdTipoActividad').val(8);
    $('#IdProyectoAct').val($("#SelProyectoCP").val());
    $('#IdActividadRel').val(0);
    InicializaAltaActividades();



    return false;
};


$(document).on('click', '#BtnModalImportarCP', function (e) {


    $("#fileImportarCP").parent().next().text("");
    $("#fileImportarCP").val("");
    $('#btnImportarCP').addClass('hidden');
    $('#mdlImportarCP').modal('show');

    return false;
});

$(document).on("change", "#fileImportarCP", function (e) {
    $("#fileImportarCP").parent().next().next().text("");



    if (e.target.files != undefined) {

        var reader = new FileReader();

        reader.onload = function (f) {

            $('#btnImportarCP').removeClass('hidden');
        };
        reader.readAsDataURL(e.target.files.item(0));
    }

});

$(document).on('click', '#btnImportarCP', function (e) {


    ImportaArchivoCP();

    return false;
});

function ImportaArchivoCP() {
    var url = $('#urlImportarCasosPrueba').val();

    var form_data = new FormData();
    form_data.append("Archivo", $("#fileImportarCP").prop("files")[0]);
    form_data.append("IdProyecto", $("#SelProyectoCP").val());
    form_data.append("Tipo", 1);

    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        //dataType: "script",
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {


            $('#mdlImportarCP').modal('hide');
            var Resultado = Respuesta.split('|');


            $('div.pg-loading-screen').remove();
            if (Resultado[0] == "E") {

                ConsultaTC(0);
                MensajeExito(Resultado[1]);
            }
            else {
                ConsultaTC(0);
                MensajeAdvertencia(Resultado[1]);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });
}


async function RunHistory(IdCasoP) {


    const data = await POST('/QA/ConsultaEjecucionesCP', { IdCasoP: IdCasoP });


    if (data.Exito) {

        var dsE = jQuery.parseJSON(data.Lst);


        var tablaE = inicializaTabla($('#TblEjecuciones'), dsE, columnasECP, 0, "asc", false, false, false);


    }
    else {

        MensajeError(data.Mensaje);
    }


    $('#MdlRunHistory').modal('show');

}

function VerECP(IdCicloCaso) {

    InicializarEjeucionPrueba(IdCicloCaso, 0);

    $('#MdlEjecutarCasoPrueba').modal({ keyboard: false });
    return false;

}





