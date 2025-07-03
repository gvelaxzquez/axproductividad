/*/*const { trim } = require("jquery");*/

$(document).ready(() => {

    Menu();
    /*    ActualizaAlerta();*/
    $('.modal').css('overflow-y', 'auto');
    $('.dropdown-toggle').dropdown();
    getUser();

    var i = $("#CapturaF").val();

    if ($("#CapturaF").val() == 1) {
        $('#ModalFeels').modal({ backdrop: 'static', keyboard: false });

    }

    if ($("#CV").val() == 1) {
        MensajeAdvertencia("Su contraseña ha caducado, favor de actualizarla.");

        $('#ModalContrasenia').modal({ backdrop: 'static', keyboard: false });
        $("#BtnCerrarPass").hide();

    }



    $("#divsel").hide();

});


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

        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });
        var tm = false;
        $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {

            var a = tm;
            if (tm) { tm = false; return; }
            else { tm = true; CargaActividadesPanel(); }


        });


    }
}


async function ActualizaAlerta() {


    const data = await POST('/Home/ActualizaAlerta', {});

    if (data.Exito) {

        $('#NoNotif').text(data.NoAlertas);

        $('#NotInternas').empty();
        $('#NotExternas').empty();
        if (data.TipoUser == 19) {

            $("#BtnVerInternas").hide();
            $("#BtnVerExternas").hide();
        }



        $("#BtnVerInternas").text("Internas (" + data.NoAlertasI + ")");
        $("#BtnVerExternas").text("Cliente (" + data.NoAlertasE + ")");
        $('#NotInternas').append(data.ComentariosI);
        $('#NotExternas').append(data.ComentariosE);

    }
    else {

        console.log('error')
    }


}


async function DeleteNot(Id) {


    const data = await POST('/Home/DeleteNot', { Id: Id });



    if (data.Exito) {


        ActualizaAlerta()

    }
    else {

        MensajeError(data.Mensaje);
    }

}



$(document).on('click', '#BtnVerInternas', function (e) {

    $("#BtnVerInternas").removeClass("btn-default");
    $("#BtnVerInternas").addClass("btn-info");




    $("#BtnVerExternas").removeClass("btn-info");
    $("#BtnVerExternas").addClass("btn-default");



    $("#NotInternas").show();
    $("#NotExternas").hide();

    return false;
});


$(document).on('click', '#BtnVerExternas', function (e) {

    $("#BtnVerExternas").removeClass("btn-default");
    $("#BtnVerExternas").addClass("btn-info");




    $("#BtnVerInternas").removeClass("btn-info");
    $("#BtnVerInternas").addClass("btn-default");



    $("#NotExternas").show();
    $("#NotInternas").hide();

    return false;
});




//function ActualizaAlerta() {
//    var url = $('#urlAlertas').val();

//    $.ajax({

//        url: url,
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//          beforeSend: function () { return;},
//        success: function (data) {

//            if (data.Exito) {

//                $('#NotInternas').empty();
//                $('#NotExternas').empty();

//                $('#NoNotif').text(data.NoAlertas);

//                $('#NotInternas').append(data.ComentariosI);
//                $('#NotExternas').append(data.ComentariosE);

//            }
//            else {

//                MensajeError(data.Mensaje);
//            }
//        },
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(data.Mensaje);
//        }
//    });
//    return false;

//}



$(document).on('focusin', function (e) {
    if ($(e.target).closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root").length) {
        e.stopImmediatePropagation();
    }
});

$(function () {
    window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: '/Content/Emoji/img/',
        popupButtonClasses: 'fa fa-smile-o' // far fa-smile if you're using FontAwesome 5
    });

    window.emojiPicker.discover();
});
var columnasTiemposCapturadosDia = [
    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" target="_blank" href="/Share/s/' + row.IdActividad + '" >' + data + '</a>'


        }
    },
    {
        "data": "Descripcion",
        "class": "text-left"
    },

    {
        "data": "FechaCreo",
        "class": "text-left",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "FechaMod",
        "class": "text-left",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "HorasAsignadas",
        "class": "text-center",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "ComentariosFinales",
        "class": "text-left"
    },
];
var columnasActividadesTerminadasDia = [
    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="clickalerta(' + row.IdActividad + ' )" >' + data + '</a>'
        }
    },
    {
        "data": "Descripcion",
        "class": "text-left"
    },
    {
        "data": "FechaTermino",
        "class": "text-left",
        "render": function (data, type, row) {
            return (data == null || data == "" ? '' : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "HorasAsignadas",
        "class": "text-center",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
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
    }


];


$(".search-icon").click(function () {


    if ($('#divsel:visible').length) {
        $('#divsel').hide("slide", { direction: "right" }, 500);

    }

    else {
        $("#SelActividadSearch").select2({

            ajax: {
                url: $('#urlBuscarActividades').val(),
                dataType: 'json',
                delay: 950,
                async: true,
                data: function (params) {
                    return {
                        Texto: params.term
                    };
                },
                processResults: function (data, params) {
                    var lst = JSON.parse(data.LstActividades);

                    return {
                        results: JSON.parse(data.LstActividades),
                    };
                },
                cache: true
            },
            formatLoadMore: "Cargando...",
            placeholder: 'Ingrese la actividad a buscar',
            minimumInputLength: 3,
            templateResult: formatRepo,
        });

        $('#divsel').show("slide", { direction: "right" }, 500);

    }




});

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }

    var $container = "";

    $container = $("<div class='task-item task-progreess' style='cursor:pointer;'  id='" + repo.IdActividad + "'>    " +
        "<div class='task-text'  onclick='clickalertasearch(" + repo.IdActividad + ")'>" +
        "<span><img class='img-dt' src='" + repo.AsignadoPath + "' alt='" + repo.TipoActividadStr + "' title='" + repo.TipoActividadStr + "' style='width:24px; height:24px;'></span>" +
        " <b> " + repo.IdActividadStr + "</b>" +
        "<p>" + repo.Descripcion + "</p>" +
        "</div> </div>");


    return $container;
}

function formatRepoSelection(repo) {
    return repo.full_name || repo.text;
}




function Menu() {
    var actual = $.grep($(".x-navigation").find("a"), function (a, b) { //Comparamos la ruta actual con el menu
        return window.location.pathname == $(a).attr("href");
    });
    //if (actual.length == 0) {
    //    actual = $.grep($(".x-navigation").find("a"), function (a, b) { // sino, encuentra la carpeta padre
    //        return (window.location.pathname).indexOf($(a).attr("href")) >= 0;
    //    });
    //}

    if (actual.length > 0) {

        if ($(actual[0].closest("ul")).hasClass("x-navigation")) {
            var tab;
            if (!$(actual[0].closest("li")).hasClass("xn-logo"))
                tab = actual[0];
            else
                tab = actual[1];
            $(tab).css("background", "#F9FBFD").children("span.fa").css("color", "#53575e");
        }
        else {
            $(actual[0]).css({ "color": "#53575e", "padding-left": "30px", "background": "#F9FBFD", "border-left": "1px solid #000070" }).closest("ul").closest(".xn-openable").addClass("active");
            $(actual[0]).children("span.fa").css("color", "#000070");
        }

    }

    funcionAjustartamano();
}


var colsOrganizacion = [

    {
        "data": "DescripcionDepartamento",
        "class": "text-left"
    },

    {
        "data": "IdOrganizacion",
        "class": "text-center",
        "render": function (data, type, row) {

            return '<a class="btn btn-default "  title="Cambiar" onclick="CambiaOrganizacion(' + data + ')"><i class="fa fa-exchange" ></i></a>'


        }
    }



];


$("#BtnOrganizacion").click(function () {

    ConsultaOrganizaciones();
    $("#ModalChangeOrg").modal('show');


});


async function ConsultaOrganizaciones() {


    const data = await POST('/Home/ConsultaOrganizaciones', {});



    if (data.Exito) {

        var dsOrgs = jQuery.parseJSON(data.Lst);

        //$("#tBug").text("Bugs (" + dsBugs.length + ")");

        var tablaOrgs = inicializaTabla($('#TblOrganizacion'), dsOrgs, colsOrganizacion, 0, "asc", false, false, false);

        $("#TblOrganizacion_info").hide();

    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function CambiaOrganizacion(Id) {

    const data = await POST('/Login/CambiarOrganizacion', { Id: Id });


    /* var ds = jQuery.parseJSON(data);*/
    if (data.Exito) {

        window.location.href = data.URL;
    }
    else {

        MensajeError(data.Mensaje);
    }

}

//$(document).on('click', '#BtnOrganizacion', function (e) {

//    $("#ModalChangeOrg").modal('show');



//    return false;
//});



function funcionAjustartamano() {
    $('.page-content ').css('height', 'auto');
    $(".page-sidebar").css('height', '-webkit-fill-available');
}
var temagraficas = {
    color: [
        '#0033cc', '#9933cc', '#1d1d95', '#f4811d', '#00cccc', '#99cc00',
        '#ffff00', '#99cc00', '#00cc33', '#cc0099'
    ],
    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: '#FFF',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#FFF',
                type: 'dashed'
            },
            crossStyle: {
                color: '#FFF'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#FFF',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

var temagraficasavanceproy = {
    color: [
        '#000070', '#08C127', '#D12106'
    ],
    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: '#FFF',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#FFF',
                type: 'dashed'
            },
            crossStyle: {
                color: '#FFF'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#FFF',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};
var temagraficaburndown = {
    color: [
        '#D12106', '#000070', '#08C127'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: '#FFF',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#FFF',
                type: 'dashed'
            },
            crossStyle: {
                color: '#FFF'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#FFF',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};



var temagraficaestatusTC = {
    color: [
        '#08C127', '#b64645', '#ff9900', "#3fbae4", "#CCD0D9"
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: '#FFF',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#FFF',
                type: 'dashed'
            },
            crossStyle: {
                color: '#FFF'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#FFF',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

var temagraficaestatustask = {
    color: [
        '#3fbae4', '#CCD0D9', '#ffCC00', "#08C127", "#b64645", "#ff9900", "#ff9900"
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },
    textStyle: {
        fontsize: 8,
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

var temagraficas2 = {
    color: [
        '#D12106', '#08C127', '#5470C6'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#eee',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0,
        right: '5%',
        left: '5%'
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};
var temaEstatusCPS = {
    color: [
        '#3fbae4', '#08C127', '#D12106', '#ff9900', '#CCD0D9'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#eee',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0,
        right: '5%',
        left: '5%'
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

var temaEstatusPerformance = {
    color: [
        '#3fbae4', '#08C127', '#0033cc', '#9933cc'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: '#FFF',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#FFF',
                type: 'dashed'
            },
            crossStyle: {
                color: '#FFF'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#eee',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0,
        right: '5%',
        left: '5%'
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

var temaEstatusKPI = {
    color: [
        '#3fbae4', '#08C127', "#D12106", '#0033cc', '#9933cc', '#FF9900', '#08C127'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#eee',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0,
        right: '5%',
        left: '5%'
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};




var temaHistoricoCalidad = {
    color: [
        '#3fbae4', '#0033cc'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'lighter',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#eee',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0,
        right: '5%',
        left: '5%'
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

function ObtieneFecha(fechacapturada) {

    var fecha;

    if (fechacapturada.trim() != "") {

        var fechav = fechacapturada.split('/');
        var diav = parseInt(fechav[0]);
        var mesv = parseInt(fechav[1]) - 1;
        var aniov = parseInt(fechav[2]);
        fecha = new Date(aniov, mesv, diav, 0, 0, 0);
    }
    else {
        fecha = null;
    }

    return fecha;


}


//function ActualizaAlerta() {
//    var url = $('#urlAlertas').val();

//    $.ajax({

//        url: url,
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        beforeSend: function () { return; },
//        success: function (data) {

//            if (data.Exito) {

//                $('#divNotificacion').empty();

//                $('#LblCantidadAct').text(data.NoAlertas);
//                $('#LblCantidadActNo').text(data.NoAlertas);
//                $('#divNotificacion').append(data.Alertas);

//            }
//            else {

//                MensajeError(data.Mensaje);
//            }
//        },
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(data.Mensaje);
//        }
//    });
//    return false;

//}


$(document).on('click touchstart', '.btn-GuardarPass', function () {

    var Mensaje = ValidaCamposRequeridos(".ReqPass");

    //}
    if (Mensaje.length == 0) {

        if ($("#TxtContrasenaNueva").val().trim() != $("#TxtConfirmarContrasena").val().trim()) {

            $("#TxtConfirmarContrasena").focus(function () { $(this).select(); });
            MensajeAdvertencia("La confirmación de contraseña no coincide.");
            $('#ModalContrasenia').modal('toggle');


            return false;
        }


        var url = $('#urlActualizaPass').val();

        var parametros = {};
        parametros["ContrasenaAnterior"] = $("#TxtContrasenaAnterior").val().trim();
        parametros["ContrasenaNueva"] = $("#TxtContrasenaNueva").val().trim();

        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {

                    MensajeExito(data.Mensaje);
                    $('#ModalContrasenia').modal('hide');

                }
                else {

                    MensajeAdvertencia(data.Mensaje);
                    $('#ModalContrasenia').modal('toggle');

                }

            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                MensajeError(data.Mensaje);
            }
        });


    }
    else {

        MensajeAdvertencia(Mensaje);
        $('#ModalContrasenia').modal('toggle');
    }


    return false;

});

$(".btn-CambiarPass").click(function () {

    $('#TxtContrasenaAnterior').val("");
    $('#TxtContrasenaNueva').val("");
    $('#TxtConfirmarContrasena').val("");
    $("#BtnCerrarPass").show();

    $('#ModalContrasenia').modal({ backdrop: 'static', keyboard: false });

    return false;

});


$(document).on('click', '#BtnGuardarFeels', function (e) {


    if ($("#ResultadoUF").val() == 0) {

        MensajeAdvertencia("Selecciona una opción");
        $('#ModalFeels').modal('toggle');
        return false;
    }

    var Mensaje = ValidaCamposRequeridos(".ReqF");
    if (Mensaje.length > 0) {

        MensajeAdvertencia(Mensaje);
        $('#ModalFeels').modal('toggle');
        return false;
    }


    var Usuario = {
        Resultado: $('#ResultadoUF').val(),
        IdPregunta: $('#IdPregunta').val(),
        Comentarios: $('#TxtFComentariosUF').val().trim()

    }

    var url = $('#urlGuardarUF').val();

    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify({ Usuario: Usuario }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {


                $("#ModalFeels").modal('hide');

            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error");
        }
    });




});


$(".btn-trabajo").click(function () {


    $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });

    return false;

});

function SeleccionarUF(opcion, control) {

    $('.btnUF').css({ "background-color": '#FFF' });


    $(control).css({ "background-color": '#DDD' });

    $("#ResultadoUF").val(opcion);

}



$(".btnTest").click(function () {

    $('#ModalPerfil').modal({ backdrop: 'static', keyboard: false });
    ConsultaPerfil(111);
    return false;

});

function CapturaAsistencia() {


    $('#ModalAsistencia').modal({ backdrop: 'static', keyboard: false });

    ConsultarAsistencia();

    return false;

}

function ConsultarAsistencia() {

    $("#BtnRegistrarSalidaComer").hide();
    $("#BtnOkRegistrarSalidaComer").hide();
    $("#BtnRegistrarEntradaComer").hide();
    $("#BtnOkRegistrarEntradaComer").hide();
    $("#BtnRegistrarSalida").hide();
    $("#BtnOkRegistrarSalida").hide();


    var url = $('#urlConsultaAsistencia').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {

                var dsDatos = jQuery.parseJSON(data.Asistencia);

                if (dsDatos != null) {


                    $("#LblHoraEntrada").text(moment(dsDatos.HoraEntrada).format("DD/MM/YYYY hh:mm:ss"));

                    $("#BtnRegistrarEntrada").hide();
                    $("#BtnOkRegistrarEntrada").show();


                    if (dsDatos.HoraEntrada != null) {


                        $("#BtnRegistrarSalidaComer").show();
                    }


                    if (dsDatos.HoraSalidaComer != null) {
                        $("#LblHoraSalidaComer").text(moment(dsDatos.HoraSalidaComer).format("DD/MM/YYYY hh:mm:ss"));
                        $("#BtnOkRegistrarSalidaComer").show();
                        $("#BtnRegistrarSalidaComer").hide();
                        $("#BtnRegistrarEntradaComer").show();
                    }

                    if (dsDatos.HoraEntradaComer != null) {
                        $("#LblHoraEntradaComer").text(moment(dsDatos.HoraEntradaComer).format("DD/MM/YYYY hh:mm:ss"));
                        $("#BtnOkRegistrarEntradaComer").show();
                        $("#BtnRegistrarEntradaComer").hide();
                        $("#BtnRegistrarSalida").show();
                    }

                    if (dsDatos.HoraSalida != null) {

                        $("#LblHoraSalida").text(moment(dsDatos.HoraSalida).format("DD/MM/YYYY hh:mm:ss"));
                        $("#BtnRegistrarSalida").hide();
                        $("#BtnOkRegistrarSalida").show();

                    }

                }
                else {

                    $("#BtnRegistrarEntrada").show();
                    $("#BtnOkRegistrarEntrada").hide();
                    $("#BtnRegistrarSalidaComer").hide();
                    $("#BtnOkRegistrarSalidaComer").hide();
                    $("#BtnRegistrarEntradaComer").hide();
                    $("#BtnOkRegistrarEntradaComer").hide();
                    $("#BtnRegistrarSalida").hide();
                    $("#BtnOkRegistrarSalida").hide();
                }

                //$('#ModalListaActividades').modal();

                /*   $('#table1').append(data.Tabla1);*/

                //CargaGrafica(data, dsDatos.Productividad);
            }
            else {

                MensajeAdvertencia(data.Mensaje);


            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

}

function RegistrarAsistencia(Tipo) {


    var url = $('#urlRegistraAsistencia').val();

    $.ajax({

        url: url,
        type: "POST",
        data: JSON.stringify({ Tipo: Tipo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {


                MensajeExito(data.Mensaje);
                ConsultarAsistencia();



                //$('#ModalListaActividades').modal();

                /*   $('#table1').append(data.Tabla1);*/

                //CargaGrafica(data, dsDatos.Productividad);
            }
            else {

                MensajeAdvertencia(data.Mensaje);


            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

}


$(".btn-AccesoDirectoActividades").click(function () {

    $('#ModalActividades').modal({ keyboard: false });
    $('#TituloActividades').text("Captura actividad");
    $('#IdProyectoAct').val(0);
    InicializaAltaActividades();


    return false;

});

function clickalerta(Actividad) {



    $('#ModalActividades').on('hidden.bs.modal', function () {

        $(this).off('hidden.bs.modal');
    });

    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });
    /* $('#TituloActividades').text("Actividad #" + Actividad);*/
    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);
    $('#IdActividadRel').val(0);
    $('#IdTipoActividad').val(0)
    InicializaEdicionActividad();


    return false;
};


function showitemfromsponsor(Actividad) {



    $('#ModalActividades').on('hidden.bs.modal', function () { ConsultaBacklog(); $(this).off('hidden.bs.modal'); });

    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });
    /* $('#TituloActividades').text("Actividad #" + Actividad);*/
    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);
    $('#IdActividadRel').val(0);
    $('#IdTipoActividad').val(0);
    $("#liLiberar").text("Aprobar");
    InicializaEdicionActividad();
    $("#ulchangest").show();

    return false;
};


function showitemlfromsponsor(Actividad) {



    $('#ModalActividades').on('hidden.bs.modal', function () { ConsultaBacklog(); $(this).off('hidden.bs.modal'); });

    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });
    /* $('#TituloActividades').text("Actividad #" + Actividad);*/
    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);
    $('#IdActividadRel').val(0);
    $('#IdTipoActividad').val(0);
    $("#liLiberar").text("Aprobar");
    $("#ulchangest").hide();
    InicializaEdicionActividad();


    return false;
};




function showitemfromprofile(Actividad) {


    $('#ModalPerfil').modal('hide');
    $('#ModalActividades').on('hidden.bs.modal', function () {

        ConsultaPerfil($('#IdUPerfil').val());
        $(this).off('hidden.bs.modal');
    });

    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });
    /* $('#TituloActividades').text("Actividad #" + Actividad);*/
    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);
    $('#IdActividadRel').val(0);
    $('#IdTipoActividad').val(0);
    InicializaEdicionActividad();


    return false;
};


function showitemfrombl(Actividad) {


    $('#ModalPerfil').modal('hide');
    //$('#ModalActividades').on('hidden.bs.modal', function () {

    //    ConsultaBacklog();
    //    ConsultaBacklogasync(1);
    //});

    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });
    /* $('#TituloActividades').text("Actividad #" + Actividad);*/
    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);
    $('#IdActividadRel').val(0);
    $('#IdTipoActividad').val(0);
    InicializaEdicionActividad();


    return false;
};

function CopyItemfrombl(Actividad) {




    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });

    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);
    $('#IdActividadRel').val(0);
    $('#IdTipoActividad').val(0);
    InicializaEdicionActividad(true);


    return false;
};





function clickalertasearch(Actividad) {




    $('#SelActividadSearch').val(null).empty().select2('destroy');
    $('#ModalActividades').on('hidden.bs.modal', function () { $(this).off('hidden.bs.modal'); });

    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });
    /* $('#TituloActividades').text("Actividad #" + Actividad);*/
    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);

    $('#IdTipoActividad').val(0);
    $('#IdActividadRel').val(0);
    InicializaEdicionActividad();


    return false;
};


function newItem(Tipo) {


    $('#ModalActividades').modal({ keyboard: false });
    if (Tipo == 7) {

        EsBug = true;
    }
    else {
        EsBug = false;
    }
    /*    $('#TituloActividades').text("Captura actividad");*/
    $('#IdTipoActividad').val(Tipo);
    $('#IdProyectoAct').val(0);
    $('#IdActividadRel').val(0);
    InicializaAltaActividades();



    return false;
};


function newEpic() {


    $('#ModalActividades').modal({ keyboard: false });
    $('#IdTipoActividad').val(2);
    $('#IdProyectoAct').val($("#SelProyectoBL").val());
    $('#IdActividadRel').val(0);
    InicializaAltaActividades();



    return false;
};



function newItemBL(Tipo, IdActividadRel) {


    $('#ModalActividades').modal({ keyboard: false });

    $('#ModalActividades').on('hidden.bs.modal', function () { ConsultaBacklog(); ConsultaBacklogasync(1); $(this).off('hidden.bs.modal'); });
    /*    $('#TituloActividades').text("Captura actividad");*/
    if (Tipo == 7) {

        EsBug = true;
    } else {
        EsBug = false;
    }
    $('#IdTipoActividad').val(Tipo);
    $('#IdProyectoAct').val($("#SelProyectoBL").val());
    $('#IdActividadRel').val(IdActividadRel);
    InicializaAltaActividades();



    return false;
};

function newItemCalendarProfile(start, end, allDay) {


    $('#ModalActividades').modal({ keyboard: false });

    $('#ModalActividades').on('hidden.bs.modal', function () { CargarActividadesDP(); $(this).off('hidden.bs.modal'); });

    if (1 == 7) {

        EsBug = true;
    } else {
        EsBug = false;
    }
    $('#IdTipoActividad').val(1);
    $('#IdProyectoAct').val($("#SelProyectoBL").val());
    $('#IdActividadRel').val(0);
    InicializaAltaActividades();

    setTimeout(function () {
        $('#TxtFechaInicio').val(moment(start).format("DD/MM/YYYY"));
        $('#TxtFechaPlan').val(moment(end).add('days', -1).format("DD/MM/YYYY"));
    }, 1000);

    return false;
};


//function showDetailDayCalendar(start, end, allDay) {


//    MensajeExito("Se dío click");

//    return false;
//};




function showItemCalendarProfile(Actividad) {



    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargarActividadesDP();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalActividades').modal({ backdrop: 'static', keyboard: false });
    /* $('#TituloActividades').text("Actividad #" + Actividad);*/
    $('#IdActividad').val(Actividad);
    $('#divsel').hide("slide", { direction: "right" }, 500);
    $('#IdActividadRel').val(0);
    $('#IdTipoActividad').val(0)
    InicializaEdicionActividad();


    return false;
};




function ValidaCorreo(email) {
    var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (regex.test(email)) {
        return true;
    }
    else {
        return false;
    }
}


function ValidaCamposRequeridos(Grupo) {
    var Campos = "";
    var Mensaje = "";

    $('input' + Grupo + ',select' + Grupo).each(function () {
        val = $(this).val().trim();
        if ($(this).val().trim() == "" || $(this).val() == -1) {
            Campos += "-" + $(this).attr('item') + "  <br>";
        }
    });
    $('textarea' + Grupo).each(function () {
        if ($(this).code() == "") {
            Campos += "-" + $(this).attr('item') + "  <br>";
        }
    });

    if (Campos.length > 0) {
        Mensaje = "Los siguientes campos son requeridos: <br> " + Campos;
    }

    return Mensaje;
}
function ValidaCamposRequeridos2(Grupo) {
    var Campos = "";
    var Mensaje = "";

    $('input' + Grupo + ',select' + Grupo).each(function () {
        val = $(this).val().trim();
        if ($(this).val().trim() == "" || $(this).val() == -1) {
            Campos += "-" + $(this).attr('item') + "  <br>";
        }
    });
    $('textarea' + Grupo).each(function () {
        if ($(this).code() == "") {
            Campos += "-" + $(this).attr('item') + "  <br>";
        }
    });

    if (Campos.length > 0) {
        Mensaje = Campos;
    }

    return Mensaje;
}

function FinalizaLoading() {
    if (window.loading_screen !== undefined) {
        window.loading_screen.finish();
        window.loading_screen = undefined;
    }
}

var lenguajeEs = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "No se encontraron resultados.",
    //"info": "Página _START_ de _PAGES_",
    "sInfo": "Registros _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "",
    //"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
}

// construye un dataTable y devuelve el objeto del mismo
// parametros:
//      tabla: Objeto <table> que se refiere a la tabla que se construirá, se debe pasar como $("#nombreTabla").
//      datos: Objeto datasource, lista de datos.
//      columnas: arreglo de objetos donde se especifica la definición de las columnas.
//      columnaOrdena: valor de tipo entero que se refiere al index de la columna por la cual estará ordenada la informacion en la carga inicial del grid.
//      tipoOrdenacion: valor de tipo string que se refiere a si la ordenación inicial será de forma ascendente (asc) o descendente (desc).
//      paginada: booleano que indica si el grid será paginado.
//      encabezadoFijo: booleano que indica si el encabezado de las columnas será fijo.
//      incluyeBusqueda: booleano que indicará si el grid tendrá la función para buscar (entrada de texto para buscar).
// ejemplo de llamada: inicializaTabla($("#nombreTabla"),dsDatos,columnasTabla,0,'asc',true,true).
function inicializaTabla(tabla, datos, columnas, columnaOrdena = 0, tipoOrdenacion = 'asc', paginada = true, encabezadoFijo = true, incluyeBusqueda = true, nonOrderableColumns = []) {
    var tablaConstruida;

    tablaConstruida = tabla.dataTable({
        language: lenguajeEs,
        responsive: true,
        fixedHeader: encabezadoFijo,
        searching: incluyeBusqueda,
        stateSave: true,
        "bSort": false,
        search: {
            smart: true
        },
        "bSortCellsTop": true,
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": paginada,
        destroy: true,
        data: datos,
        columns: columnas,
        ordering: true,
        "columnDefs": [
            { "orderable": false, "targets": nonOrderableColumns }
        ],
        "order": [[columnaOrdena, tipoOrdenacion]],
        initComplete: function () {
            setTimeout(function () {
                this.api().search('').draw();
            }, 300);
        }

        //"initComplete": function (settings, json) {
        //    // Add autocomplete="off" to the search input field
        //    // $('input[type="search"]').attr('autocomplete', 'nope').attr('autofocus','false');
        //    table.search("").draw();
        //    // if that doesn't work, use it with a timeout of 200, for example
        //}

    });

    return tablaConstruida;
}
function inicializaTablaCB(tabla, datos, columnas, columnaOrdena = 0, tipoOrdenacion = 'asc', paginada = true, encabezadoFijo = true, incluyeBusqueda = true, nonOrderableColumns = []) {
    var tablaConstruida;

    tablaConstruida = tabla.dataTable({
        language: lenguajeEs,
        responsive: true,
        fixedHeader: encabezadoFijo,
        searching: incluyeBusqueda,
        "rowCallback": function (row, d) {
            if (d.date == "2") {
                /*    $('td:eq(4)', row).html('<b>A</b>');*/

                $(row).find('td:eq(2)').css('background-color', 'red');
            }
        },
        stateSave: true,
        "bSort": false,
        search: {
            smart: true
        },
        "bSortCellsTop": true,
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": paginada,
        destroy: true,
        data: datos,
        columns: columnas,
        ordering: true,
        "columnDefs": [
            { "orderable": false, "targets": nonOrderableColumns }
        ],
        "order": [[columnaOrdena, tipoOrdenacion]],
    });

    return tablaConstruida;
}


function inicializaTablaExport(tabla, datos, columnas, columnaOrdena = 0, tipoOrdenacion = 'asc', paginada = true, encabezadoFijo = true, incluyeBusqueda = true, nonOrderableColumns = []) {
    var tablaConstruida;

    tablaConstruida = tabla.dataTable({
        language: lenguajeEs,
        dom: 'Bfrtip',
        buttons: [
            { extend: 'copy', attr: { id: 'allan' } }, 'csv', 'excel', 'pdf'
        ],
        responsive: true,
        fixedHeader: encabezadoFijo,
        searching: incluyeBusqueda,
        stateSave: true,
        "bSort": false,
        search: {
            smart: false
        },
        "bSortCellsTop": true,
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": paginada,
        destroy: true,
        data: datos,
        columns: columnas,
        ordering: true,
        "columnDefs": [
            { "orderable": false, "targets": nonOrderableColumns }
        ],
        "order": [[columnaOrdena, tipoOrdenacion]],
    });

    return tablaConstruida;
}


function inicializaTabla5(tabla, datos, columnas, columnaOrdena = 0, tipoOrdenacion = 'asc', paginada = true, encabezadoFijo = true, incluyeBusqueda = true, nonOrderableColumns = []) {
    var tablaConstruida;

    tablaConstruida = tabla.dataTable({

        lengthMenu: [
            [5, 10, 25, 50, -1],
            ['5', '10', '25 ', '50', 'Todo']
        ],
        pageLength: 5,
        language: lenguajeEs,
        responsive: true,
        fixedHeader: encabezadoFijo,
        searching: incluyeBusqueda,
        stateSave: true,
        "bSort": false,
        search: {
            smart: false
        },
        "bSortCellsTop": true,
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": paginada,
        destroy: true,
        data: datos,
        columns: columnas,
        ordering: true,
        "columnDefs": [
            { "orderable": false, "targets": nonOrderableColumns }
        ],
        "order": [[columnaOrdena, tipoOrdenacion]],
    });

    return tablaConstruida;
}

function refrescaTabla(tabla, datos) {
    tabla.api().clear().rows.add(datos).draw();
}
function refrescaTablaPaginada(tabla, datos, page) {
    tabla.api().clear().rows.add(datos).page(page).draw();
}


function cambiaEstadoSwitch(checkbox, checked) {
    if (checked) {
        if (!checkbox.prop('checked'))
            checkbox.click();
    }
    else {
        if (checkbox.prop('checked'))
            checkbox.click();
    }
}

function ValidarEmail(email) {
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return expr.test(email);
}

function SoloNumerosPositivos(texto) {
    var e = event;
    var pattern = /^[0-9]+$/;
    if (!pattern.test(String.fromCharCode(e.keyCode))) {
        e.returnValue = false;
    }
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode; return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function NumDecimal(e, field) {
    tecla = e.keyCode ? e.keyCode : e.which
    if (tecla == 8 || tecla == 35 || tecla == 36 || tecla == 46) return true

    if ((tecla < 48 || tecla > 57) && (tecla != 46) && (tecla != 8)) {
        return false;
    } else {

        var len = $(field).val().length;
        var index = $(field).val().indexOf('.');

        if (index > 0 && tecla == 46) {
            return false;
        }

        if (index > 0) {
            var CharAfterdot = (len + 1) - index;
            if (CharAfterdot > 3) {
                return false;
            }
        }
    }

    return true;
};

function MonedaValdacion(o) {
    var e = event;
    var s = o.value.split('.');

    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46) {
        //Validamos que solo se registre un punto
        if (e.keyCode == 46 && s.length > 1) {
            e.returnValue = false;
            return false;
        }
        // restrigir numero de decimales 
        if (s.length > 1) {
            if (s[1].length >= 2) {
                e.returnValue = false;
                return false;
            }
            e.returnValue = ((e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46));
        }
        // validamos que solo metan 6 numeros antes del punto
        if (e.keyCode == 46) {
            e.returnValue = true;
            return true;
        }
        if (s.length == 1) {
            if (s[0].length >= 18) {
                if (e.keyCode == 46) {
                    e.returnValue = true;
                    return true;
                }
                e.returnValue = false;
                return false;
            }

            e.returnValue = ((e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46));
        }


        e.returnValue = true;
        return true;
    }

    e.returnValue = false;
    return false;

}
function resizeTaskList() {
    setTimeout(function () {
        $(".x_panel .tasks").css("height", "auto");
        $(".x_panel .tasks").css("min-height", "auto");

        var maximo = 0;
        $.each($(".x_panel .tasks"), function (e, v) {
            if ($(v).height() != null && maximo < $(v).height()) {
                maximo = $(v).height();
            }
        });

        $(".x_panel .tasks").css("height", maximo + "px");
        $(".x_panel .tasks").css("min-height", maximo + "px");


    }, 1);

}


function PorcentajesValdacion(o) {
    var e = event;
    var s = o.value.split('.');
    if (s[0] == 100) {
        e.returnValue = false;
        return false;
    }
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46) {
        //Validamos que solo se registre un punto
        if (e.keyCode == 46 && s.length > 1) {
            e.returnValue = false;
            return false;
        }
        if (s[0].length >= 8) {
            e.returnValue = false;
            return false;
        }
        // restrigir numero de decimales 
        if (s.length > 1) {
            if (s[1].length >= 2) {
                e.returnValue = false;
                return false;
            }
            e.returnValue = ((e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46));
        }
        // validamos que el numero antes del punto sea menorque 101 y mayor que 0
        if (s.length == 1) {
            if (s[0].length > 1) {
                if (s[0] == 10 && e.keyCode == 48 || e.keyCode == 46) {
                    e.returnValue = true;
                    return true;
                }
                e.returnValue = false;
                return false;
            }

            e.returnValue = ((e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46));
        }

    }
    else {
        e.returnValue = false;
        return false;
    }
}
function SoloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key == 8) || (key == 46))
}



const getUser = async () => {
    try {
        const data = await POST('/Base/Usuario', {}, false);
        $('#usuario-correo').val(data.usuario);

        const activities = $.connection.trackingHub;

        $.connection.hub.start().then(() => {
            activities.server.addUser(data.usuario);
        });

        $.connection.hub.disconnected(function () {
            setTimeout(function () {
                $.connection.hub.start();
            }, 5000);
        });

        activities.on("activities", (user) => {
            $('#clock-tracking').empty();
            let html = '';

            const totalLenght = Object.values(user).flat().filter(x => x.Running).length;
            document.title = (totalLenght > 0 ? `(${totalLenght}) ` : '') + 'YITPRO';

            if (totalLenght > 0) {
                $('#list-tracking-clock').removeClass('hidden')
                $('#count-tracking-clock').html(totalLenght)

                html = Object.keys(user).map(u => {
                    const html =
                        `<div style=" border-bottom: 1px solid gray; margin-bottom: 15px;">
                    <label class="badge badge-info" style=" font-size: 15px; margin: 0;"><a style="color: white" href="/Actividades/Tracking/${u.substring(u.lastIndexOf('-') + 2, u.length)}">${u}</a></label>
                    ${user[u].map(t => {
                            const horas = Math.floor(t["Time"] / 3600);
                            const minutos = Math.floor(t["Time"] % 3600 / 60);
                            const segundos = Math.floor(t["Time"] % 3600 % 60);
                            const tracking =
                                `<div style="display:flex; flex-direction: column">
                                    <div style=" font-size: 14px; padding: 10px 0px 0px;">Etapa: <strong>${t["Etapa"]}</strong></div>
                                    <div style=" padding: 0px 0px 0px; display: flex; align-items: center;">
                                        <span onclick="stopActivity('${u}',${t['IdTracking']},'${horas + ':' + minutos + ':' + segundos}')" style="color: red; font-size: 15px; cursor:pointer; padding-right: 20px"><i class="fa fa-stop"></i></span>
                                        <label style="font-size: 24px; margin: 0">${("0" + horas).slice(-2)}:${("0" + minutos).slice(-2)}:${("0" + segundos).slice(-2)}</label>
                                    </div>
                                </div>`;

                            return t["Running"] ? tracking : '';
                        }).join("")}
                </div>`
                    return user[u].filter(x => x.Running).length === 0 ? '' : html;
                }).join("");

                $('#clock-tracking').append(html);
            } else {
                $('#list-tracking-clock').addClass('hidden')
            }
        });
    } catch (e) {
        console.log(e);
    }
}

async function stopActivity(idActividad, idTracking, time) {
    const chat = $.connection.trackingHub;
    chat.server.stop(idActividad, idTracking);

    const tracking = {
        IdActividad: idActividad.substring(idActividad.lastIndexOf('-') + 2, idActividad.length),
        IdActividadTracking: idTracking,
        strTrabajado: time
    }

    if (idTracking !== 0) {
        try {
            const data = await POST($('#urlGuardarTracking').val(), { tracking }, false);

            if (data.Exito) {
                MensajeExito(data.Mensaje);
            }
            else {
                MensajeAdvertencia(data.Mensaje);
            }
        } catch (e) {
            MensajeError(e);
        }
    }
}

$('.selectpicker').selectpicker();
$('.bootstrap-select').selectpicker();

$('.selectpicker').on('append', function (e) {
    $(this).selectpicker('refresh');
});

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

$('.DateRangePicker').daterangepicker(
    {
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
        startDate: moment().startOf('month').format('DD/MM/YYYY'),
        endDate: moment().endOf('month').format('DD/MM/YYYY'),
    });



////////////

function POST(url, parametros = {}, loading = true, formData = false) {
    return $.ajax({
        url: url,
        type: "POST",
        contentType: formData ? false : "application/json; charset=utf-8",
        dataType: "json",
        processData: !formData,
        data: formData ? parametros : JSON.stringify(parametros),
        beforeSend: function () { if (loading) { CargaLoading(); } }
    });
}

async function DOWNLOAD(url, nombreArchivo, parametros = {}, formData = false) {
    try {
        CargaLoading();
        const response =
            await fetch(
                url,
                {
                    method: 'POST',
                    body: !formData
                        ? JSON.stringify(parametros)
                        : parametros
                }
            );

        if (response.ok) {
            const respuesta = await response.blob();

            const url = window.URL.createObjectURL(respuesta);
            const a = document.createElement('a');
            const nombre = nombreArchivo;

            a.style.display = 'none';
            a.href = url;
            a.download = nombre;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            FinalizaLoading();
            page_content_onresize();
        } else {
            FinalizaLoading();
            page_content_onresize();
            const error = response.statusText;
            MensajeAdvertencia(error);
        }
    } catch (error) {
        FinalizaLoading();
        page_content_onresize();
        res = error.statusText;
        MensajeAdvertencia(res);
    }

}

function InvertirColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 140
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function InicializaTabla({
    tabla, datos, columnas, columnaOrdena = 0, tipoOrdenacion = 'asc', paginada = true, encabezadoFijo = true,
    incluyeBusqueda = true, nonOrderableColumns = [], scrollX = false, scrollCollapse = false, columnasFijas = {}, info = true
}) {
    var dataTable;

    dataTable = tabla.dataTable({
        language: lenguajeEs,
        responsive: true,
        fixedHeader: encabezadoFijo,
        searching: incluyeBusqueda,
        "info": info,
        "bSort": false,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": paginada,
        destroy: true,
        data: datos,
        "bSortCellsTop": true,
        columns: columnas,
        ordering: true,
        "columnDefs": [
            { "orderable": false, "targets": nonOrderableColumns }
        ],
        "order": [[columnaOrdena, tipoOrdenacion]],
        "scrollX": scrollX,
        "scrollCollapse": scrollCollapse,
        stateSave: true,
        fixedColumns: columnasFijas
    });

    return dataTable;
}

function ObtenerData(tabla, e) {
    return tabla.api().row($(e.target).closest('tr')).data();
}

function Distinct(value, index, self) {
    return self.indexOf(value) === index;
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

var lut = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
function e7() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}