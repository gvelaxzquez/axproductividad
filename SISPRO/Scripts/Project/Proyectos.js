var dsProyectos = [];

var tablaProyectos;
var clave;
var recarga = false;

var $table = $('#tblProyectos');

var columnasProyectos = [
            { 
                "data": "IdProyecto",
                "visible": false
            },
            { 
                "data": "IdCliente",
                "visible": false
            },
            { 
                "data": "TipoProyectoId",
                "visible": false
            },
            { 
                "data": "IdULider",
                "visible": false
            },
            //{ 
            //    "data": "SemaforoID",
            //    "visible": false
            //},
              { 
                "data": "Descripcion",
                "visible": false
            },
              { 
                "data": "Avance",
                "visible": false
              },
              { 
                "data": "AvanceReal",
                "visible": false
            },

            {
                "data": "Clave",
                "class": "text-left"
            },
            {
                "data": "Nombre",
                "class": "text-left"

            },
            {
                "data": "IdClienteStr",
                "class": "text-left"
            },
            {
                "data": "TipoProyectoStr",
                "class": "text-left"
            },
            {
                "data": "IdULiderStr",
                "class": "text-left"
            },
            {
                "data": "MetodologiaIdStr",
                "class": "text-left"
            },
            {
                "data": "EstatusIdStr",
                "class": "text-left"
            },
            {

                "data": "Activo",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? "Si" : "No";
                }
            },

              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnEditarDatos"><span class="fa fa-pencil-square-o"></span></button>'


                  }
              },
              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnVerProyecto"><span class="fa fa-share"></span></button>'


                  }
              }

];

$(document).ready(function () {

    CargaInicial();
    BuscarProyectos();
    $('#TxtFechaIniProy,#TxtFechaFinProy,#TxtFechaCompProy').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });


    $("#wzProy").smartWizard({
        // This part of code can be removed FROM

        selected: 0,

        enableAllSteps: true,
        enableFinishButton: false,
        labelNext: 'Siguiente', // label for Next button
        labelPrevious: 'Anterior', // label for Previous button
        labelFinish: '',

        includeFinishButton: false,
      /*  onLeaveStep: PasoSiguiente,*/
        onShowStep: function (obj) {
            var wizard = obj.parents(".wizard");

  
            return true;
        

        }
    });

    if ($(".tagsinput").length > 0) {

        $(".tagsinput").each(function () {

            if ($(this).data("placeholder") != '') {
                var dt = $(this).data("placeholder");
            } else
                var dt = 'add tag';

            $(this).tagsInput({ width: '100%', height: 'auto', defaultText: dt });
        });

    }



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

        $('#SelClientePr').empty();
        $('#SelClientePr').append(data.LstClientes);

        $('#SelTipoProyectoP').empty();
        $('#SelTipoProyectoP').append(data.LstTipoProyecto);

        $('#SelLiderP').empty();
        $('#SelLiderP').append(data.LstLideres);

        $('#SelMetodologiaP').empty();
        $('#SelMetodologiaP').append(data.LstMetodologia);

        $('#SelEstatusP').empty();
        $('#SelEstatusP').append(data.LstEstatus);

        $('#SelWorkFlowP').empty();
        $('#SelWorkFlowP').append(data.LstWorkflow);


        $('div.pg-loading-screen').remove();
     }
    else {
  
        MensajeError(data.Mensaje);
    }

}
$(document).on('click', '.BtnEditarDatos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaProyectos.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdProyecto').val(datosFila.IdProyecto);
    $('#TxtClaveP').val(datosFila.Clave);
    $('#TxtNombreP').val(datosFila.Nombre);
    $('#TxtDescripcionP').val(datosFila.Descripcion);
    $('#SelClientePr').val(datosFila.IdCliente);
    $('#SelTipoProyectoP').val(datosFila.TipoProyectoId);
    $('#SelLiderP').val(datosFila.IdULider);
    $('#SelMetodologiaP').val(datosFila.MetodologiaId);
    $('#SelEstatusP').val(datosFila.EstatusId);

     cambiaEstadoSwitch($('#ChkActivo'), datosFila.Activo);

     $('#ModalEditarProyecto').modal('show');

 

});



$(document).on('click', '.BtnVerProyecto', function (e) {
 
    var filaPadre = $(this).closest('tr');
    var row = tablaProyectos.api().row(filaPadre);
    var datosFila = row.data();

    var nombre = datosFila.Clave;

    var url = $('#urlVerProyecto').val() +  "?Id=" +  nombre;
    //var url = $('#urlVerProyecto').val();


   // var url2 = url.replace("Id", nombre);


    window.open(url, '_blank');
    //window.location.href = url;
  

});


function VerProyecto(clave) {



    var url = $('#urlVerProyecto').val() + "/" + clave;
    //var url = $('#urlVerProyecto').val();


    // var url2 = url.replace("Id", nombre);


    window.open(url, '_blank');
    //window.location.href = url;

}


$(document).on('click', '#BtnNuevo', function (e) {

    $('#IdProyecto').val("0");
    $('#TxtClaveP').val("");
    $('#TxtNombreP').val("");
    $('#SelClientePr').val(-1);
    $('#SelTipoProyectoP').val(-1);
    $('#SelLiderP').val(-1);
    $('#SelEstatusP').val(-1);
    $('#SelMetodologiaP').val(-1);
    $('#SelWorkFlowP').val(-1);
    //$('#SelSemaforoP').val(-1);
    $('#TxtDescripcionP').val("");
/*    $('#TxtTecnologias_tagsinput').empty();*/

    //$("#TxtTecnologias").tagsInput({
    //    'defaultText': 'Agregar',
    //    /*'interactive': true,*/
    //});

    $('span[class="tag"]').each(function (index, value) { value.remove(); });


    $('#IdPlantilla').val(0);
    $('#TxtConfHorasProm').val("0");
    $('#TxtConfHorasProy').val("0");
    $('#TxtFechaIniProy').val("");
    $('#TxtFechaFinProy').val("");
    $('#TxtFechaCompProy').val("");
    $('#TxtConfIngreso').val("");
    $('#TxtConfPrecioHora').val("");
    $('#TxtConfIVA').val("");
    $('#TxtConfCosto').val("");
    $('.plantilla').css({ "background-color": '#FFF' });

    $("a[href='#step-1']").click();


    cambiaEstadoSwitch($('#ChkActivo'), true);
    cambiaEstadoSwitch($('#ChkCalculaHoras'), false);
    cambiaEstadoSwitch($('#ChkCalculaFechas'), false);
    $('#ModalEditarProyecto').modal('show');

    return false;
});



$(document).on('click', '#BtnGuardar', function (e) {

    
    var Mensaje = ValidaCamposRequeridos(".ReqProyecto");


    if (Mensaje.length == 0) {

  
        var Proyecto = {
            IdProyecto: $('#IdProyecto').val(),
            Clave: $('#TxtClaveP').val().trim(),
            Nombre: $('#TxtNombreP').val().trim(),
            TipoProyectoId : $('#SelTipoProyectoP').val(),
            IdCliente: $('#SelClientePr').val(),
            IdULider: $('#SelLiderP').val(),
            MetodologiaId: $('#SelMetodologiaP').val(),
            IdWorkFlow: $('#SelWorkFlowP').val(),
            EstatusId: $('#SelEstatusP').val(),
            Descripcion : $('#TxtDescripcionP').val(),
            Activo: $('#ChkActivo').prop('checked'),
            Tecnologias: $('#TxtTecnologias_tagsinput').val(),
            PSP: $('#ChkPSP').prop('checked'),
            IdPlantilla: $('#IdPlantilla').val(),
            //Agrego lo de horas
            FijarHoras: $('#ChkCalculaHoras').prop('checked'),
            HorasEstimadasInicial: $('#TxtConfHorasProy').val(),
            HorasPromedio: $('#TxtConfHorasProm').val(),
            //Fechas
            FijarFechas: $('#ChkCalculaFechas').prop('checked'),
            FechaInicioPlan: $('#TxtFechaIniProy').val(),
            FechaFinPlan: $('#TxtFechaFinProy').val(),
            FechaFinComprometida: $('#TxtFechaCompProy').val(),
            //Ingreso
            IngresoPlan: $('#TxtConfIngreso').val(),
            PrecioHora: $('#TxtConfPrecioHora').val(),
            PorcIVA: $('#TxtConfIVA').val(),
           //Costo
            CostoPlan: $('#TxtConfCosto').val(),
            


        }
        clave = $('#TxtClaveP').val().trim();
        LlamadaGuardarDatosProyecto(Proyecto);


    }

    else {
  
        MensajeAdvertencia(Mensaje);
    }

})

function LlamadaGuardarDatosProyecto(Proyecto) {

    var url = $('#urlGuardarProyecto').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Proyecto),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosProyecto,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        
            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosProyecto(data) {
    if (data.Exito) {

        MensajeExito(data.Mensaje);
        $('#ModalEditarProyecto').modal('toggle');
        var url = $('#urlVerProyecto').val() +"/" +  clave;
        window.open(url, '_blank');
        CargaInicial();
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

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
        else if (value.Estatus ==  "E") {

            estatus = "text-progress"
        }
        else if (value.Estatus ==  "C") {

            estatus = "text-warning"
        }
        else if (value.Estatus ==  "D") {

            estatus = "text-danger"
        }
        else if (value.Estatus ==  "L") {

            estatus = "text-success"
        }
        else if (value.Estatus == "X") {

            estatus = "text-muted"
        }


        var card = "<div class='col-md-4'>" +
            '<div class="panel panel-default projectcard" onclick="VerProyecto(' + "'" + ClaveProyecto + "'" + ')" style="min-height:0;">'+
                   '<div class="panel-body profile">'+
                   ' <div class="row headerproyecto" style="min-height:50px;">' +
                    '     <div class="col-md-8"> ' +
            '        <h5>' + ClaveProyecto + '- ' + NombreProyecto + '</h5>' +
            '    </div>' +
            '     <div class="col-md-4"> ' +
            '<button  class="btn btn-small btn-card" style="text-align:left; width:100%;"><span>' + value.EstatusIdStr + '<span><span  class="fa fa-fw fa-circle '  +estatus+ ' "></span> </button>' +

                    '    </div>' +
            '    </div>' +
            '    </div>' +
            '    <div> ' + 
                    '<div class="col-md-12">'+

            '   <div class="col-md-6"> ' +
            '<span class="chart"  id="' + vargrafica +'" data-percent="86">'+
                                 '    <span class="percent"></span><br>'+
                                 '       <p>Avance esperado</p>'+
                            '</span>'+
                        '</div>'+
                            '    <div class="col-md-6">'+
            '<span class="chart"  id="' + vargrafica2 + '" data-percent="86">' +
                              '          <span class="percent"></span><br> ' +
                               '              <p>Avance actual</p>'+
                           ' </span>'+
                        '</div>'+
                        '       </div>'+
                        '    </div>'+
                         '   <div class="row">'+
            '     <div class="col-md-12 projectfooter" style="min-height:55px;">' +
        '       <div class="col-md-6"><p>' + Lider + '</p></div>' +
            '       <div class="col-md-6"><p>' + Cliente + '</p></div>' +
                ' </div>' +
                ' </div>' +
                ' </div>' +
            ' </div>';


        var script = " <script> var " + varelement1 + " = document.querySelector('#" + vargrafica + "');" +
            "var " + varobjeto1+  " = new EasyPieChart(" + varelement1 + ", {   " +
            "delay: 3000," +
            "barColor: '#000070'," +
            "trackColor: '#FFFFFF'," +
            "scaleColor: false," +
            "lineWidth: 10," +
            "trackWidth: 16," +
            "lineCap: 'butt'," +
            "onStep: function (from, to, percent) {" +
            "this.el.children[0].innerHTML =" + value.AvanceCompPorc  + ";" +
            "}" +
            "});" +
            varobjeto1 +".update(" + value.AvanceCompPorc + ");" +
            varobjeto1 + ".disableAnimation();" +
             varobjeto1 +".enableAnimation();" +
            "</script>";

        var script2 = " <script> var " + varelement2 + " = document.querySelector('#" + vargrafica2 + "');" +
            "var " + varobjeto2 + " = new EasyPieChart(" + varelement2 + ", {   " +
            "delay: 3000," +
            "barColor: function () {"+
            "    if (" + value.DesfaseProc +  "<= 5) {" +
                    "return '#08C127'"+
                "}"+
                "else if (" + value.DesfaseProc  +"<= 15) {"+
                 "   return '#fea223'" +
                "}"+
                "else {"+
                "    return '#D12106'"+
                "}"+
            "},"+
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

$(document).on('click', '#BtnBuscarProys', function (e) {

    BuscarProyectos();

    return false;
});


function BuscarProyectos() {

    var url = $('#urlBuscarProyectos').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Texto: $('#TxtBusqueda').val().trim(), Estatus: $('#SelEstatusPro').val()  }),
        dataType: "json",
        async: false,
        success: successCargaBusquedaProys,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}


$(document).on('change', '#SelEstatusPro', function (e) {

    BuscarProyectos();

    return false;

});

function successCargaBusquedaProys(data) {
    $('#TotalProyectos').text(data.TotalProyectos);
    CreaTarjetasProyecto(data.LstProyectos);

    var dsProyectos = jQuery.parseJSON(data.LstProyectos);
    if (recarga) {

        $table.bootstrapTable('load', dsProyectos);
    }
    else {
        $table.bootstrapTable({

            data: dsProyectos,
            idField: 'IdProyecto',
            search: true,
            columns: [
                {
                    field: 'Nombre',
                    title: 'Nombre',
                    sortable: true,
                    align: 'left',
                    width: "200px",
                    formatter: function (value, row, index) {
                        return '<a style="color: #337ab7" class="btn btn-link" onclick="VerProyecto(' + "'" + row.Clave + "'" + ')">' + row.Clave + " " + value + '</a>';
                    }
                },

                {
                    field: 'IdClienteStr',
                    title: 'Cliente',
                    sortable: true,
                    align: 'left',
                    width: "200px"
                },
                {
                    field: 'Estatus',
                    title: 'Estatus',
                    sortable: true,
                    align: 'left',
                    /*     width: "300px",*/
                    formatter: function (value, row, index) {

                        if (value == 'P') {

                            return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:70px;"><span>' + row.EstatusIdStr + '<span>';

                        }
                        else if (value == 'E') {
                            return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:70px;"><span>' + row.EstatusIdStr + '<span>';

                        }
                        else if (value == 'C') {
                            return '<span  class="fa fa-fw fa-circle text-warning "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:70px;"><span>' + row.EstatusIdStr + '<span>';

                        }
                        else if (value == 'D') {
                            return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:70px;"><span>' + row.EstatusIdStr + '<span>';

                        }
                        else if (value == 'L') {
                            return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:70px;"><span>' + row.EstatusIdStr + '<span>';

                        }
                        else if (value == 'X') {
                            return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:70px;"><span>' + row.EstatusIdStr + '<span>';
                        }
                    }

                },


                {
                    field: 'AvanceCompPorc',
                    title: 'Plan',
                    sortable: true,
                    align: 'right',
                    formatter: function (value, row, index) {
                        return value + "%";
                    }

                },
                {
                    field: 'AvanceRealPorc',
                    title: 'Actual',
                    sortable: true,
                    align: 'right',
                    formatter: function (value, row, index) {
                        return value + "%";
                    }

                },
                {
                    field: 'DesfaseProc',
                    title: 'Desfase',
                    sortable: true,
                    align: 'right',
                    formatter: function (value, row, index) {
                        return value + "%";
                    }

                },
                {
                    field: 'FechaInicioPlan',
                    title: 'Inicio',
                    sortable: true,
                    align: 'center',
                    formatter: function (value, row, index) {
                        return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                    }


                },

                {
                    field: 'FechaFinPlan',
                    title: 'Fin plan ',
                    sortable: true,
                    align: 'center',
                    formatter: function (value, row, index) {
                        return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                    }

                },
                {
                    field: 'FechaFinComprometida',
                    title: 'Compromiso ',
                    sortable: true,
                    align: 'center',
                    formatter: function (value, row, index) {
                        return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                    }

                },
                {
                    field: 'FechaProyectada',
                    title: 'Proyectada ',
                    sortable: true,
                    align: 'center',
                    formatter: function (value, row, index) {
                        return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                    }

                },
                {
                    field: 'Lider',
                    title: 'Lider',
                    sortable: true,
                    align: 'left',
                    formatter: function (value, row, index) {
                        if (value == "") {

                            return "";
                        }
                        else {

                            return `<img src=" https://app.yitpro.com/Archivos/Fotos/${row.IdULiderStr}.jpg" class="img-dt" style="width: 35px; height: 35px" /><a class="btn btn-link"> ${value}</a>`
                        }

                    }
                }
            ]
        });
        recarga = true;
    }

    var g = jQuery.parseJSON(data.Gantt);

    gantt.config.min_column_width = 50;
    gantt.plugins({
        export_api: true,
    });

    gantt.config.scale_height = 90;

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
                min_column_width: 90,
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
    gantt.ext.zoom.setLevel("year");
    gantt.config.readonly = true;
    gantt.i18n.setLocale("es");
    gantt.init("roadmap");
    gantt.clearAll();
    gantt.parse({
        data: g
    });

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
function VerProyListado() {

    $("#DivProyectostabla").show();
    $("#DivProyectosGantt").hide();
    $("#DivProyectos").hide();

}

function VerProyGantt() {
    $("#DivProyectosGantt").show();
    $("#DivProyectostabla").hide();
    $("#DivProyectos").hide();

}

function VerProyMosaico() {
    $("#DivProyectos").show();
    $("#DivProyectostabla").hide();
    $("#DivProyectosGantt").hide();
   

}


function CambiaModoFechas(e) {

    var activo = $('#ChkCalculaFechas').prop('checked')
    if (!activo) {

        $("#divFechasManual").removeClass("hidden");
    }
    else {
        $("#divFechasManual").addClass("hidden");
    }

    $("#TxtFechaIniProy").toggleClass("ReqProyecto");
    $("#TxtFechaFinProy").toggleClass("ReqProyecto");
    $("#TxtFechaCompProy").toggleClass("ReqProyecto");
}


function CambiaModoHoras(e) {

    var activo = $('#ChkCalculaHoras').prop('checked')
    if (!activo) {

        $("#divHorasManual").removeClass("hidden");
    }
    else {
        $("#divHorasManual").addClass("hidden");
    }

    $("#TxtConfHorasProy").toggleClass("ReqProyecto");
    $("#TxtConfHorasProm").toggleClass("ReqProyecto");

}


function SeleccionarPlantilla(IdPlantilla, control) {
    $('.plantilla').css({ "background-color": '#FFF' });

    $(control).css({ "background-color": '#DDD' });

    $("#IdPlantilla").val(IdPlantilla);
}

