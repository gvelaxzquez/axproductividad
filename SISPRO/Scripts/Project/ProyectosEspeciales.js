var $tblReporte = $('#TblReporte');

var recarga = false;

$(document).on('change', '#SelClienteRPE', function (e) {

    ConsultaReporteEspecial();


    return false;

});


async function ConsultaReporteEspecial() {


    const data = await POST('/Report/ConsultaReporteEspecial', { IdCliente: $("#SelClienteRPE").val()});

    if (data.Exito) {

        var dsReporte = jQuery.parseJSON(data.LstReporte);


        if (recarga) {

            $tblReporte.bootstrapTable('load', dsReporte);
     

        }
        else {

            $tblReporte.bootstrapTable({

                data: dsReporte,
                idField: 'IdProyecto',
                /* toolbar: "#toolbar",*/
           /*     search: true,*/
                idtable: "saveId",
                columns: [
                    {
                        field: 'NombreProy',
                        title: 'Proyecto',
                        align: 'left',
                        width: "250px",
                        formatter: function (value, row, index) {

                            if (row.IdProyecto < 998) {

                                return value 
                            }
                            else {

                                return "<h5><b>" + value  +"</b></h5>";
                            }


                        }



                    },

                    {
                        field: 'HorasTotales',
                        title: 'Horas facturables',
                        align: 'right',
                        formatter: function (value, row, index) {

                            if (row.IdProyecto == 999) {
                               
                                return "<h5><b> $ " + $.number(value, '2', '.', ',') + "</b></h5>";
                            }
                            else if (row.IdProyecto == 998) {

                                return "<h5><b>" + $.number(value, '2', '.', ',') + "</b></h5>";
                            }

                            else {

                                return $.number(value, '2', '.', ',');
                                

                            }
                               

                        }
                    },

                    {
                        field: 'HorasAmortizar',
                        title: 'Horas anticipo',
                        align: 'right',
                        formatter: function (value, row, index) {
                            if (row.IdProyecto == 999) {

                                return "<h5><b> $ " + $.number(value, '2', '.', ',') + "</b></h5>";
                            }
                            else if (row.IdProyecto == 998) {

                                return "<h5><b>" + $.number(value, '2', '.', ',') + "</b></h5>";
                            }

                            else {

                                return $.number(value, '2', '.', ',');


                            }


                        }
                    },
                    {
                        field: 'Amortizadas',
                        title: 'Amortizadas',
                        align: 'right',
                        formatter: function (value, row, index) {

                            if (row.IdProyecto == 999) {

                                return "<h5><b> $ " + $.number(value, '2', '.', ',') + "</b></h5>";
                            }
                            else if (row.IdProyecto == 998) {

                                return "<h5><b>" + $.number(value, '2', '.', ',') + "</b></h5>";
                            }

                            else {

                                return $.number(value, '2', '.', ',');


                            }


                        }
                    },
                    {
                        field: 'PendienteAmortizar',
                        title: 'Pendiente amortizar',
                        align: 'right',
                        formatter: function (value, row, index) {

                            if (row.IdProyecto == 999) {

                                return "<h5><b> $ " + $.number(value, '2', '.', ',') + "</b></h5>";
                            }
                            else if (row.IdProyecto == 998) {

                                return "<h5><b>" + $.number(value, '2', '.', ',') + "</b></h5>";
                            }

                            else {

                                return $.number(value, '2', '.', ',');


                            }


                        }
                    },

                    {
                        field: 'Facturado',
                        title: 'Facturado',
                        align: 'right',
                        formatter: function (value, row, index) {

                            if (row.IdProyecto == 999) {

                                return "<h5><b> $ " + $.number(value, '2', '.', ',') + "</b></h5>";
                            }
                            else if (row.IdProyecto == 998) {

                                return "<h5><b>" + $.number(value, '2', '.', ',') + "</b></h5>";
                            }

                            else {

                                return $.number(value, '2', '.', ',');


                            }


                        }
                    },
                    {
                        field: 'PendienteFacturar',
                        title: 'Pendiente facturar',
                        align: 'right',
                        formatter: function (value, row, index) {

                            if (row.IdProyecto == 999) {

                                return "<h5><b> $ " + $.number(value, '2', '.', ',') + "</b></h5>";
                            }
                            else if (row.IdProyecto == 998) {

                                return "<h5><b>" + $.number(value, '2', '.', ',') + "</b></h5>";
                            }

                            else {

                                return $.number(value, '2', '.', ',');


                            }


                        }
                    },

                    {
                        field: 'Avance',
                        title: 'Avance',
                        align: 'center',
                        formatter: function (value, row, index) {


                            if (row.IdProyecto == 999) {

                                return "";
                            }
                            else if (row.IdProyecto == 998) {

                                return "<h5><b>" +  $.number(value, '2', '.', ',') + "% </b></h5>";
                            }

                            else {

                                return $.number(value, '2', '.', ',') + "%";


                            }





                        }
                    },


                ],

            })


           
            recarga = true;

        }


    }
    else {

        MensajeError(data.Mensaje);
    }

}

