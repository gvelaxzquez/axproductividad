
var dsActividades = [];

var recarga = false;
var $tableActs = $('#TblActividades');





$(document).ready(function () {

    $('#Calendar').fullCalendar({
        locale: 'es',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        buttonIcons: true,
        navLinks: true,
        editable: false,
        eventClick: function (info) {
            clickalerta(info.id);
        }
    });


        EjecutarQuery();


});



async function EjecutarQuery() {


    const data = await POST('/Querys/EjecutaQueryExt', { IdQuery: $("#IdQuery").val(), Org: $("#Org").val(), });

    if (data.Exito) {

        dsActividades = jQuery.parseJSON(data.Actividades);
   


        if (recarga) {

            $tableActs.bootstrapTable('load', dsActividades);

        }
        else {

            $tableActs.bootstrapTable({

                data: dsActividades,
                idField: 'IdActividad',
                search: true,
                idtable: "saveId",

                columns: [

                    {
                        field: 'IdActividad',
                        align: 'left',
                        title: '',
                        formatter: function (value, row, index) {

                            return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px;" />';
                        }
                    },

                    {
                        field: 'IdActividadStr',
                        title: 'Id',
                        align: 'left',
                        sortable: true,
                        formatter: function (value, row, index) {

                            return '<a style="color: #337ab7" class="btn btn-link" onclick="VerActividad(' + row.IdActividad + ' )">' + value + '</a>';
                        }
                    },

                    {
                        field: 'BR',
                        align: 'left',
                        title: 'Titulo',
                        sortable: true,
                    },
                    {
                        field: 'Estatus',
                        title: 'Estatus',
                        sortable: true,
                        align: 'left',
                        formatter: function (value, row, index) {



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
                                return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                            }
                            else if (value == 'C') {
                                return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                            }





                        }
                    },

                    {
                        field: 'PrioridadStr',
                        title: 'Prioridad',
                        align: 'left',
                        sortable: true,

                    },
                    {
                        field: 'ClaveUsuario',
                        sortable: true,
                        align: 'left',
                        title: 'Assigned',
                        formatter: function (value, row, index) {
                            if (value == "") {

                                return "";
                            }
                            else {

                                return `<img src=" https://app.yitpro.com/Archivos/Fotos/${value}.jpg" class="img-dt" style="width: 35px; height: 35px" /><a class="btn btn-link"> ${row.AsignadoStr}</a>`
                            }

                        }
                    },

                    {
                        field: 'Sprint',
                        title: 'Sprint',
                        sortable: true,
                        align: 'left',
                    },

                    {
                        field: 'TipoActividadStr',
                        title: 'Fase',
                        sortable: true,
                        align: 'left',
                    },

                    {
                        field: 'ClasificacionStr',
                        title: 'Clasificación',
                        sortable: true,
                        align: 'left',
                    },

                    //{
                    //    field: 'FechaCreo',
                    //    title: 'Fecha alta',
                    //    sortable: true,
                    //    /*   width: "450px",*/
                    //    formatter: function (value, row, index) {

                    //        return (data == null || data == "" ? "" : moment(value).format("YYYY/MM/DD"))

                    //    }
                    //},

                    {
                        field: 'FechaSolicitado',
                        title: 'Fecha objetivo',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (data == null || data == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    },
                    {
                        field: 'FechaTermino',
                        title: 'Fecha fin',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (data == null || data == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    }
                ]
            })

            recarga = true;

        }



        $("#LblAbierto").text("Abiertas (" + data.TotalAbiertas + ")");
        $("#LblProgreso").text("Progreso (" + data.TotalProgreso + ")");
        $("#LblValidacion").text("Validación (" + data.TotalValidacion + ")");
        $("#LblTerminadas").text("Terminadas (" + data.TotalLiberadas + ")");
        $("#LblRechazadas").text("Rechazadas (" + data.TotalRechazadas + ")");

        $("#tasks_assigned").empty();
        $("#tasks_progreess").empty();
        $("#task_validate").empty();
        $("#tasks_re").empty();
        $("#tasks_ok").empty();



        $("#tasks_assigned").html(data.ActividadesA)
        $("#tasks_progreess").html(data.ActividadesP)
        $("#task_validate").append(data.ActividadesR);
        $("#tasks_re").append(data.ActividadesX);
        $("#tasks_ok").append(data.ActividadesLi);

        var events = JSON.parse(data.Eventos);

        $('#Calendar').fullCalendar('removeEvents');
        $('#Calendar').fullCalendar('addEventSource', events);
        $('#Calendar').fullCalendar('rerenderEvents');




        resizeTaskList();

    }
    else {

        MensajeError(data.Mensaje);
    }

}



function VerActividad(IdUnique) {


    var url = "/share/a/" + $("#Org").val() + "/"  + IdUnique;
    window.open(url, '_blank');
    return false;

}







