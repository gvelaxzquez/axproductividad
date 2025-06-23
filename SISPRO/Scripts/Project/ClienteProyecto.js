
var $tblPendientes = $('#tblPendiente');
var $tblAprobado = $('#tblAprobado');

var recarga = false;


var tablaActividadesP;
var tablaActividadesA;

var columnasBL = [
    {
        "data": "IdActividadStr",
        "class": "text-left",

        //"render": function (data, type, row) {

        //    return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        //}


    },
    {
        "data": "ProyectoStr",
        "class": "text-center",
    },

    {
        "data": "BR",
        "class": "text-left",
        "render": function (data, type, row) {

            //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link"  onclick="showitemfromsponsor(' + row.IdActividad + ' )">' + data + '</a>';
          /*  return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px; margin-left:0px;" />' + data;*/
        }
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
        "data": "FechaRevision",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },


];



$(document).ready(function () {
    if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
        $(".page-container").removeClass("page-navigation-toggled");
        x_navigation_minimize("open");
    } else {
        $(".page-container").addClass("page-navigation-toggled");
        x_navigation_minimize("close");
    }

    onresize();
  /*  CargaInicial();*/
    ConsultaBacklog();
    CargarSprints();

});

function CargaInicial() {

    var url = $('#urlCargaInicial').val();

    $.ajax({

        url: url,
        type: "POST",

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicial,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaInicial(data) {
    if (data.Exito) {


        $('#TotalProyectos').text(data.TotalProyectos);

        CreaTarjetasProyecto(data.LstProyectos);
        $('div.pg-loading-screen').remove();
    }
    else {

        MensajeError(data.Mensaje);
    }

}



function CreaTarjetasProyecto(LstProyectos) {

    $('#DivProyectos').empty();
    $('#scripts').empty();


    var dsDatos = JSON.parse(LstProyectos);

    var num = 1;

    $.each(dsDatos, function (key, value) {

        var NombreProyecto = value.Nombre;
        var ClaveProyecto = value.Clave;
        var Cliente = value.IdClienteStr;
        var Lider = value.Lider;
        var DiaMilestone = value.DiaMilestone;
        var MesMilestone = value.MesMilestone;
        var Milestone = value.Milestone;
        var grafica1 = Math.floor(Math.random() * 100) + 1
        var grafica2 = Math.floor(Math.random() * 100) + 1


        var vargrafica = "grafica1" + num.toString();
        var vargrafica2 = "grafica2" + num.toString();
        var varelement1 = "element1" + num.toString();
        var varelement2 = "element2" + num.toString();

        var varobjeto1 = "objeto1" + num.toString();
        var varobjeto2 = "objeto2" + num.toString();

        var estatus = "";

        if (value.Estatus == "P") {

            estatus = "text-info"
        }
        else if (value.Estatus == "E") {

            estatus = "text-progress"
        }
        else if (value.Estatus == "C") {

            estatus = "text-warning"
        }
        else if (value.Estatus == "D") {

            estatus = "text-danger"
        }
        else if (value.Estatus == "L") {

            estatus = "text-success"
        }
        else if (value.Estatus == "X") {

            estatus = "text-muted"
        }
        //else {

        //    estatus = "text-info"
        //}

        /*    onclick = "$(' + "'#" + vartabla + "'" + ')*/

        var card = "<div class='col-md-3'>" +
            '<div class="panel panel-default projectcard" onclick="VerProyecto(' + "'" + ClaveProyecto + "'" + ')" style="min-height:0;">' +
            '<div class="panel-body profile">' +
            ' <div class="row headerproyecto" style="min-height:50px;">' +
            '     <div class="col-md-8"> ' +
            '        <h5>' + ClaveProyecto + '- ' + NombreProyecto + '</h5>' +
            '    </div>' +
            '     <div class="col-md-4"> ' +
            '<button  class="btn btn-small btn-card" style="text-align:left; width:100%;"><span>' + value.EstatusIdStr + '<span><span  class="fa fa-fw fa-circle ' + estatus + ' "></span> </button>' +
            /* '        <p>' + ClaveProyecto +  '</p>' +*/
            '    </div>' +
            '    </div>' +
            '    </div>' +
            '    <div> ' +
            '<div class="col-md-12">' +
            //         '   <div class="col-md-4"> ' +
            //          '       <section class="shape-section"> ' + 
            //'         <div class="container diamond-shape">' +
            //'            <div class="item-count">' + DiaMilestone + '<br> <small>' + MesMilestone + '</small></div>' +
            //                    '</div>'+
            //               ' </section>'+
            //' <p>' + Milestone + '</p>'+
            //'</div>' +
            '   <div class="col-md-6"> ' +
            '<span class="chart"  id="' + vargrafica + '" data-percent="86">' +
            '    <span class="percent"></span><br>' +
            '       <p>Avance esperado</p>' +
            '</span>' +
            '</div>' +
            '    <div class="col-md-6">' +
            '<span class="chart"  id="' + vargrafica2 + '" data-percent="86">' +
            '          <span class="percent"></span><br> ' +
            '              <p>Avance actual</p>' +
            ' </span>' +
            '</div>' +
            '       </div>' +
            '    </div>' +
            '   <div class="row">' +
            '     <div class="col-md-12 projectfooter" style="min-height:55px;">' +
            '       <div class="col-md-6"><p>' + Lider + '</p></div>' +
            '       <div class="col-md-6"><p>' + Cliente + '</p></div>' +
            ' </div>' +
            ' </div>' +
            ' </div>' +
            ' </div>';


        var script = " <script> var " + varelement1 + " = document.querySelector('#" + vargrafica + "');" +
            "var " + varobjeto1 + " = new EasyPieChart(" + varelement1 + ", {   " +
            "delay: 3000," +
            "barColor: '#000070'," +
            "trackColor: '#FFFFFF'," +
            "scaleColor: false," +
            "lineWidth: 10," +
            "trackWidth: 16," +
            "lineCap: 'butt'," +
            "onStep: function (from, to, percent) {" +
            "this.el.children[0].innerHTML =" + value.AvanceCompPorc + ";" +
            "}" +
            "});" +
            varobjeto1 + ".update(" + value.AvanceCompPorc + ");" +
            varobjeto1 + ".disableAnimation();" +
            varobjeto1 + ".enableAnimation();" +
            "</script>";

        var script2 = " <script> var " + varelement2 + " = document.querySelector('#" + vargrafica2 + "');" +
            "var " + varobjeto2 + " = new EasyPieChart(" + varelement2 + ", {   " +
            "delay: 3000," +
            "barColor: function () {" +
            "    if (" + value.DesfaseProc + "<= 5) {" +
            "return '#08C127'" +
            "}" +
            "else if (" + value.DesfaseProc + "<= 15) {" +
            "   return '#fea223'" +
            "}" +
            "else {" +
            "    return '#D12106'" +
            "}" +
            "}," +
            "trackColor: '#FFFFFF'," +
            "scaleColor: false," +
            "lineWidth: 10," +
            "trackWidth: 16," +
            "lineCap: 'butt'," +
            "onStep: function (from, to, percent) {" +
            "this.el.children[0].innerHTML =" + value.AvanceRealPorc + ";" +
            "}" +
            "});" +
            varobjeto2 + ".update(" + value.AvanceRealPorc + ");" +
            varobjeto2 + ".disableAnimation();" +
            varobjeto2 + ".enableAnimation();" +
            "</script>";

        $('#DivProyectos').append(card);
        $('#scripts').append(script);
        $('#scripts').append(script2);


        num++;

    });
}



function VerProyecto(clave) {



    var url = $('#urlVerProyecto').val() + "/" + clave;


    window.location.href = url;

/*    window.open(url);*/

}




async function ConsultaBacklog() {


    const data = await POST('/Actividades/ObtieneActividadesSponsor', {});

    if (data.Exito) {

        var dsPendientes = jQuery.parseJSON(data.ActividadesV);
        var dsAprobados = jQuery.parseJSON(data.ActividadesL);

        $("#tP").text("Pendientes de aprobar (" + dsPendientes.length + ")");
        $("#tA").text("Aprobados (" + dsAprobados.length + ")");



        //tablaActividadesP = inicializaTabla($('#tblPendiente'), dsPendientes, columnasBL, 4, "asc", false, false, true);
        //tablaActividadesA = inicializaTabla($('#tblAprobado'), dsAprobados, columnasBL, 4, "asc", false, false, true);

        if (recarga) {

            $tblPendientes.bootstrapTable('load', dsPendientes);
            $tblAprobado.bootstrapTable('load', dsAprobados);

        }
        else {

            $tblPendientes.bootstrapTable({

                data: dsPendientes,
                idField: 'IdActividad',
               /* toolbar: "#toolbar",*/
                search: true,
                idtable: "saveId",
                columns: [
                    {
                        field: 'IdActividadStr',
                        title: '#',
                        width: "100px"
                    },

                    {
                        field: 'ProyectoStr',
                        title: 'Proyecto',
                        width: "150px"
                    },
                    {
                        field: 'TipoNombre',
                        title: 'Tipo',
                        width: "100px"
                    },

                    {
                        field: 'BR',
                        title: 'Título',
                    /*    width: "350px",*/
                        sortable: true,
                        formatter: function (value, row, index) {

                            return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" /> <a style="color: #337ab7" class="btn btn-link" onclick="showitemfromsponsor(' + row.IdActividad + ' )">' + value + '</a>';

                        }
                    },
                    {
                        field: 'Estatus',
                        title: 'Estatus',
                        sortable: true,
                        width: "160px",
                        align: 'left',
                        formatter: function (value, row, index) {

                            if (row.TipoId == 2) {

                                return "";
                            }
                            else {

                                if (value == 'A') {

                                    return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'P') {
                                    return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'R' || value == 'V') {
                                    return '<span  class="fa fa-fw fa-circle text-warning "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'X') {
                                    return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'L') {
                                    return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + "Aprobada" + '<span>';

                                }
                                else if (value == 'C') {
                                    return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }


                            }


                        }
                    },
                    {
                        field: 'FechaRevision',
                        title: 'Envío',
                        width: "90px",
                        align: 'center',
                        sortable: true,
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                        }
                    },



                ],
              
            })


            $tblAprobado.bootstrapTable({

                data: dsAprobados,
                idField: 'IdActividad',
                /* toolbar: "#toolbar",*/
                search: true,
                idtable: "saveId",
                columns: [
                    {
                        field: 'IdActividadStr',
                        title: '#',
                        width: "100px"
                    },

                    {
                        field: 'ProyectoStr',
                        title: 'Proyecto',
                        width: "150px"
                    },
                    {
                        field: 'TipoNombre',
                        title: 'Tipo',
                        width: "100px"
                    },

                    {
                        field: 'BR',
                        title: 'Título',
                        /*    width: "350px",*/
                        sortable: true,
                        formatter: function (value, row, index) {

                            return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" /> <a style="color: #337ab7" class="btn btn-link" onclick="showitemlfromsponsor(' + row.IdActividad + ' )">' + value + '</a>';

                        }
                    },
                    {
                        field: 'Estatus',
                        title: 'Estatus',
                        sortable: true,
                        width: "160px",
                        align: 'left',
                        formatter: function (value, row, index) {

                            if (row.TipoId == 2) {

                                return "";
                            }
                            else {

                                if (value == 'A') {

                                    return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'P') {
                                    return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'R' || value == 'V') {
                                    return '<span  class="fa fa-fw fa-circle text-warning "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'X') {
                                    return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'L') {
                                    return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + "Aprobada" + '<span>';

                                }
                                else if (value == 'C') {
                                    return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }


                            }


                        }
                    },
                    {
                        field: 'FechaLiberacion',
                        title: 'Aprobado',
                        width: "90px",
                        align: 'center',
                        sortable: true,
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                        }
                    },



                ],

            })
            recarga = true;

        }

        //$('#GraficaBL').empty();

        //$('#scriptsBL').empty();

        //var dsDatos = JSON.parse(data.GraficaBL);

        //$.each(dsDatos, function (key, value) {


        //    var id = value.id;
        //    var nombre = value.Nombre;
        //    var tipo = value.Tipo;
        //    var series = value.Series;
        //    /*     var columnas = value.LstColumnas;*/
        //    var valores = value.LstValores;
        //    /*   var tabla = value.Tabla;*/
        //    var idgrafica = "grafica" + numV.toString();
        //    var vargrafica = "vargrafica" + numV.toString();
        //    var vartabla = "vartabla" + numV.toString();

        //    var tema = nombre == "Estatus" ? "temagraficaestatusTC" : "temagraficaestatustask";


        //    if (tipo == "Pie") {
        //        var grafica = "<div class='col-md-12'>"
        //            + "     <div class=''>"
        //            + "                         <div class=''>"
        //            + "                               <div id='" + idgrafica + "' style='height:300px;' > "
        //            + "                                </div>"
        //            + "                         </div>"
        //            + "                       </div>"
        //            + "                 </div>"


        //        var script = "<script>"
        //            + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
        //            + "" + vargrafica + ".setOption({ "
        //            + "              tooltip: {"
        //            + "                   trigger: 'item',"
        //            + "                   formatter: '{a} <br/>{b} : {c} ({d}%)'"
        //            + "               },"
        //            + "              calculable: true,"
        //            + "               legend: { "
        //            + '                   orient: "horizontal",'
        //            + '                   x: "right",'
        //            + "                   y: 'bottom',"
        //            + '                   data:' + series + ''
        //            + "               },"
        //            + "               toolbox: {"
        //            + "show: false,"
        //            + " feature: { "
        //            + "            mark: { show: true },"
        //            + "            magicType: { show: true, type: ['funnel', 'pie'] , title:''},"
        //            + "    saveAsImage: {"
        //            + "        show: false, "
        //            + "        title: 'Descargar'"
        //            + "    }"
        //            + "}"
        //            + "               }, "
        //            + "               series: [{ "
        //            + "                   name: '',"
        //            + "                   type: 'pie', "
        //            + "                   radius: ['0%', '65%'],"
        //            + "                   itemStyle: { "
        //            + "                       normal: { "
        //            + "                           label: { "
        //            + "                               show: false "
        //            + "                           },"
        //            + "                           labelLine: {"
        //            + "                               show: false "
        //            + "                           }"
        //            + "                       },"
        //            + "                       emphasis: {"
        //            + "                           label: {"
        //            + "                               show: true,"
        //            + "                               position: 'right',"
        //            + "                               textStyle: {"
        //            + "                                   fontSize: '10',"
        //            + "                                   fontWeight: 'normal' "
        //            + "                               } "
        //            + "                           }"
        //            + "                       }"
        //            + "                   },"
        //            + '                   data: ' + valores + ''
        //            + "               }]"
        //            + "           });"
        //            + "</script>"


        //        $('#GraficaBL').append(grafica);
        //        $('#scriptsBL').append(script);

        //    }








        //    numV = numV + 1;

        //});



    }
    else {

        MensajeError(data.Mensaje);
    }

} 

function VerQuery(IdUnique) {


    var url = "/Querys/q/" + IdUnique;
    window.open(url, '_blank');
    return false;

}




async function CargarSprints() {


    const data = await POST('/Proyectos/ConsultarSprintsCompartidos', { });

    if (data.Exito) {
        $('#tblSprintDetalle').empty();

        sprints = jQuery.parseJSON(data.Sprints);

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

