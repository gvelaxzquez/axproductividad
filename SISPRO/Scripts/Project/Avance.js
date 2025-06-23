var App = {
    avance: {},
    detalle: {},
    evidencia: {},
    autorizacion: {},
    avances: [],
    detalles: [],
    modalDetalle: {},
    modalAutorizacion: {},
    modalEvidencia: {},
    modalRechazo: {},
    tabla: {},

    Inicializar: function () {
        $('#tablaAvances').DataTable({
            language: lenguajeEs,
            "bAutoWidth": false,
            "bLengthChange": true,
            fnDrawCallback: function (oSettings) {
                $('.dataTables_length select').removeClass("input-sm");
            },
            "columns": [
                { "data": "Id" },
                { "data": "OrdenCompra" },
                { "data": "Proveedor" },
                { "data": "Departamento" },
                {
                    "data": "OrdenCompraFecha",
                    "render": function (data, type, row) {
                        return moment(data).format('DD/MM/YYYY');
                    }
                },
                {
                    "data": "Avance",
                    "render": function (data, type, row) {
                        return '<div class="progress"><div class="progress-bar progress-bar-colorful" role="progressbar" style="width: ' + data + '%">' + data + '%</div></div>';
                    }
                },
                {
                    "data": "Id",
                    "render": function (data, type, row) {
                        return '<a class="btn btn-default btn-small fa fa-pencil-square-o" onclick="App.AbrirDetalles(' + data + ')" aria-expanded="false"></a>';
                    }
                },
                {
                    "data": "Id",
                    "render": function (data, type, row) {
                        return '<a class="btn btn-danger btn-small  glyphicon glyphicon-remove-circle" onclick="App.CancelarAvance(' + data + ')"></a>';
                    }
                },
            ]
        });
        App.Actualizar();
    },
    Actualizar: function () {
        var url = "Avances/Index";
        App.Ajax(url, {}, function (data) {
            if (data.Exito) {

                App.tabla = $('#tablaAvances').DataTable();
                App.avances = data.Avances;
                App.tabla.clear();
                App.tabla.rows.add(data.Avances);
                App.tabla.draw();

               var dsAvances = data.Avances;
               for (var i in dsAvances) {
               
                rows = "<tr>"
                       + "<td class='text-center'>" + dsAvances[i].Id + "</td>"
                       + "<td class='text-center'>" + dsAvances[i].OrdenCompra + "</td>"
                       + "<td class='text-center'>" + dsAvances[i].Proveedor+ "</td>"
                       + "<td class='text-center'>" + dsAvances[i].Departamento + "</td>"
                       + "<td class='text-center'>" + moment(dsAvances[i].OrdenCompraFecha).format("DD/MM/YYYY")  + "</td>"
                       + "<td class='text-center'>" + dsAvances[i].Avance + "</td>"

                 
                 
                 + "</tr>";
            $("#TblAvanceExportar tbody").append(rows);
               }

            }
            else {
                MensajeError(data.Error);
            }
        });
    },
    CancelarAvance: function (id) {

        MensajeConfirmar('¿Estás seguro de que desea cancelar el avance de obra?');
        App.avance = find(App.avances, id, 'Id', true);
        var url = "Avances/Cancelar";

        $('.btn-Confirmar').one('click touchstart', function () {
            App.Ajax(url, { id: App.avance.Id }, function (data) {
                MensajeExito("Se canceló el avance de obra exitosamente");
                App.Actualizar();
            });
        });

        $('.btn-Cancelar').one('click touchstart', function () {
            $('.btn-Confirmar').off('click touchstart');
        });
    },
    AbrirDetalles: function (id) {

        var parametros = {};
        parametros["id"] = id;
        
        var url =  "Avances/Avance";

        this.Ajax(url, { id: id }, function (data) {

           if(!data.PermisoGuardar){

            $('#formDetalle').addClass('hide');
            $('#BtnGuardarAvance').addClass('hide');
            }
            else {
             $('#formDetalle').removeClass('hide');
            $('#BtnGuardarAvance').removeClass('hide');
            }

            App.modalDetalle = $('#detalleAvance').clone(false);
             App.avance = find(App.avances, id, 'Id', true);

            App.modalDetalle.bindModel(data.Resultado);
            App.detalles = data.Resultado.Detalles;
            App.ActualizarDetalles(0);
            App.modalDetalle = $(App.modalDetalle).modal({
               // backdrop: 'static',
                keyboard: false
            });
        });
    },
    ActualizarDetalles: function (origen) {
        var modal = App.modalDetalle;
        var detalles = App.detalles;
        modal.find('#tablaDetalles').html('');


        for (var i = 0; i < detalles.length; i++) {

            var title = 'En proceso';
            title = detalles[i].Estatus == "A" ? 'Aprobada' : title;
            title = detalles[i].Estatus == "R" ? 'Rechazada, click para ver detalles' : title;
            title = detalles[i].Estatus == "S" ? 'Solicitar aprobación' : title;

            var estatus = 'proceso';
            estatus = detalles[i].Estatus == "A" ? 'aprobada' : estatus;
            estatus = detalles[i].Estatus == "R" ? 'rechazada' : estatus;
            estatus = detalles[i].Estatus == "S" ? 'solicitar' : estatus;

            var row = '';
            row += '<tr>';
   
            row += '<td><div title="' + title + '" class="Estatus-' + estatus + '" data-toggle="tooltip" data-placement="right" ' + (detalles[i].Estatus == "R" ? 'onclick="App.AbrirRechazoTipo(' + detalles[i].Tipo + ',' +  detalles[i].Id + ','+ true +')"' : '') + '></div></td>';
            row += '<td>' + detalles[i].Secuencia + '</td>';
            row += '<td>' + detalles[i].Porcentaje + '</td>';
            if (origen == 1)
            {
                row += '<td>' + moment(detalles[i].Fecha, "DD/MM/YYYY").format("DD/MM/YYYY") + '</td>';
            }
            else {
                row += '<td>' + moment(detalles[i].Fecha).format("DD/MM/YYYY") + '</td>';

            }
           
            row += '<td>' + detalles[i].OrdenCompra + '</td>';
            row += '<td>' + detalles[i].Descripcion + '</td>';
            row += '<td>' + (detalles[i].Tipo == "1" ? 'Anticipo' : 'Avance') + '</td>';
            if (detalles[i].PermisoGuardar){
            row += '<td><a onclick="App.EditarDetalle(' + i + ')" class="btn btn-default btn-sm fa fa-pencil-square-o"></a></td>';
            row += '<td><a onclick="App.EliminarDetalle(' + i + ')" class="btn btn-danger btn-sm fa fa-trash-o"></a></td>';
            }
            else{
            row += '<td>&nbsp;</td>';
            row += '<td>&nbsp;</td>';
            }



            //row += '<td><a onclick="App.EditarDetalle(' + i + ')" class="btn btn-default btn-sm fa fa-pencil-square-o"></a></td>';
            //row += '<td><a onclick="App.EliminarDetalle(' + i + ')" class="btn btn-danger btn-sm fa fa-trash-o"></a></td>';
            row += (detalles[i].Id != 0 ? '<td><a class="btn btn-default btn-sm fa fa-mail-forward" onclick="App.AgregarEvidencia(' + i + ')"></a></td>' : '<td></td>');
            row += (detalles[i].Id != 0 ? '<td><a class="btn btn-success btn-sm fa fa-check-circle-o" onclick="App.AbrirAprobacion(' + i + ')"></a></td>' : '<td></td>');
            row += '</tr>';

            modal.find('#tablaDetalles').append(row);
        }
    },
    EditarDetalle: function (id) {
        var detalle = App.detalles[id];
        if (detalle.Estatus !== 'A') {
            App.modalDetalle.find('#formDetalle').setObject(detalle);
            App.modalDetalle.find('#formDetalle .form-control').removeClass('error');
        }
        else {
            MensajeAdvertencia('No puedes editar este elemento porque ya fue aprobado.');
        }
    },
    AgregarDetalle: function () {

        var modal = App.modalDetalle;
        var data = modal.find('#formDetalle').serializeObject();
        var anticipo = find(App.detalles, 1, 'Tipo', true);

        if (modal.find('#formDetalle')[0].checkValidity()) {

            var total = 0;
            for (var i = 0; i < App.detalles.length; i++) {
                total = total + parseInt(App.detalles[i].Porcentaje);
            }

            if (data.Id > 0) {
                var id = find(App.detalles, data.Id, 'Id');
                if ((anticipo != null && data.Tipo == String(App.detalles[id].Tipo)) || anticipo == null) {
                    anticipo = true;
                    App.detalles[id] = data;
                }
            }
            else {
                if (data.Secuencia > 0) {
                    var secuencia = find(App.detalles, data.Secuencia, 'Secuencia');
                    if ((anticipo != null && data.Tipo == App.detalles[secuencia].Tipo) || anticipo == null) {
                        anticipo = true;
                        App.detalles[secuencia] = data;
                    }
                }
                else {
                    if ((anticipo != null && data.Tipo != '1') || anticipo == null) {
                        anticipo = true;
                        data.Secuencia = App.detalles.length + 1;
                        data.Estatus = 'G';
                        App.detalles.push(data);
                    }
                }
            }

            if (anticipo === true) {
                modal.find('#formDetalle')[0].reset();
                modal.find('#formDetalle').children('[type=hidden]').val('');
                App.ActualizarDetalles(1);
                App.modalDetalle.find('#formDetalle .form-control').removeClass('error');
            }
            else {
                MensajeAdvertencia('El anticipo del avance ya se encuentra registrado');
            }
        }
        else {

            var mensaje = "Los siguientes campos son requeridos: <br><br>";
            var campos = App.modalDetalle.find('#formDetalle')[0].elements;

            for (var i = 0; i < campos.length; i++) {
                if (campos[i].willValidate === true) {
                    if (!campos[i].checkValidity()) {
                        mensaje += campos[i].title + "<br>"
                        $(campos[i]).addClass('error');
                    }
                    else {
                        $(campos[i]).removeClass('error');
                    }
                }
            }

            MensajeAdvertencia(mensaje);
        }
    },
    EliminarDetalle: function (id) {

        var detalle = App.detalles[id];
        if (detalle.Estatus !== 'A') {

            MensajeConfirmar('¿Estás seguro de que desea eliminar este elemento?');

            $('.btn-Confirmar').one('click touchstart', function () {
                App.detalles.splice(id, 1);
                for (var i = 0; i < App.detalles.length; i++) {
                    App.detalles[i].Secuencia = i + 1;
                }
                App.ActualizarDetalles(0);
            });

            $('.btn-Cancelar').one('click touchstart', function () {
                $('.btn-Confirmar').off('click touchstart');
            });
        }
        else {
            MensajeAdvertencia('No puedes eliminar este elemento porque ya fue aprobado.');
        }
    },
    GuardarDetalles: function () {

        var total = 0;
        var anticipos = 0;
        var url = "Avances/Guardar";

        for (var i = 0; i < App.detalles.length; i++) {
            total = total + parseInt(App.detalles[i].Porcentaje);
            anticipos = String(App.detalles[i].Tipo) == '1' ? anticipos + 1 : anticipos;
            secuenciaAnticipo =  String(App.detalles[i].Tipo) == '1' ? App.detalles[i].Secuencia : 1;
            App.detalles[i].Fecha = moment(App.detalles[i].Fecha, "DD/MM/YYYY").format("DD/MM/YYYY");
        }

        //JMM: Se válida que el anticipo solo este en la primera línea
        if (secuenciaAnticipo > 1){
         MensajeAdvertencia('El anticipo solo puede ser ingresado en la primera línea del avance');
         return false;
        }


        if (total === 100) {
            if (anticipos < 2) {
                this.Ajax(url, {
                    id: App.avance.Id,
                    elementos: App.detalles
                }, function (data) {
                    $('.modal').modal('hide');
                    MensajeExito('Los datos se guardaron correctamente.');
                    App.Actualizar();
                });
            }
            else {
                MensajeAdvertencia('Solo se puede registrar un anticipo.');
            }
        }
        else {
            MensajeAdvertencia('El porcentaje total no puede ser diferente de 100%.');
        }
    },

    AgregarEvidencia: function (i) {
        
          App.detalle = App.detalles[i];
         var aprobadosanteriores = $.map(App.detalles, function (obj, index) {
        if ( obj.Secuencia < App.detalle.Secuencia) {

            if(obj.Estatus != "A"){
                        return index;
            }
           }
         });

        
        if (aprobadosanteriores.length > 0)
        {
        MensajeAdvertencia("Para solicitar el avance de obra, todos los avances anteriores deben de estar aprobados.");
        return false;
         }

        //var aprobados = App.detalles.
        //App.detalle = App.detalles[i];
        App.modalEvidencia = $('#evidenciaAvance').clone(false);
        var url = "Avances/Detalle";
        this.Ajax(url, { id: App.detalle.Id, tipo: App.detalle.Tipo}, function (data) {
            App.detalle = data.Resultado;
            App.modalEvidencia.bindModel(data.Resultado);

            if (App.detalle.Evidencia !== null) {
                App.modalEvidencia.find('#btnEvidencia').show();
                App.modalEvidencia.find('#btnEvidencia').attr('href', './Archivos/AvanceObra/' + App.detalle.Evidencia.split("\\").pop())
            }

            App.modalEvidencia = $(App.modalEvidencia).modal({
                backdrop: 'static',
                keyboard: false
            });
        });
    },
    GuardarEvidencia: function () {
        App.evidencia.id = App.detalle.Id;
        var url = "Avances/GuardarEvidencia";

        App.evidencia.comentario = App.modalEvidencia.find('#txtComentarioEvidencia').val();
        this.Ajax(url, App.evidencia, function (data) {
            App.evidencia = { id: 0, archivo: '', comentario: '' };
           $('.modal').modal('hide');
            MensajeExito("Los datos se guardaron correctamente.");
        });
    },

    AbrirRechazo: function (idAut, idAB, Consulta) {
        App.modalRechazo = $('#rechazarAvance').clone(false);
        var url = "Avances/ConsultaRechazo";
        this.Ajax(url, { IdAutorizacion: idAut, IdAvanceObraDet: idAB }, function (datos) {
          
            if (datos.Exito) {

           App.modalRechazo.find('#SelMotivoRechazoAV').append(datos.LstMotivos);
           App.modalRechazo.find('#SelMotivoRechazoAV').val(datos.DetalleRechazo.RechazoId);
           App.modalRechazo.find('#TxtDescricionRechazoAV').val(datos.DetalleRechazo.RechazoDescripcion);
           App.modalRechazo.find('#IdAutorizacion').val(idAut);
           App.modalRechazo.find('#IdAvanceObraDet').val(idAB);


           if(Consulta)
           {
            App.modalRechazo.find('#BtnGuardarRechazoAv').hide();
           }


            
            }

        });

        App.modalRechazo = $(App.modalRechazo).modal({
            backdrop: 'static',
            keyboard: false
        });

    },
    AbrirRechazoTipo: function (tipo, idAB, Consulta) {
        App.modalRechazo = $('#rechazarAvance').clone(false);
        var url = "Avances/ConsultaRechazoTipo";
        this.Ajax(url, { Tipo: tipo, IdAvanceObraDet: idAB }, function (datos) {
          
            if (datos.Exito) {

           App.modalRechazo.find('#SelMotivoRechazoAV').append(datos.LstMotivos);
           App.modalRechazo.find('#SelMotivoRechazoAV').val(datos.DetalleRechazo.RechazoId);
           App.modalRechazo.find('#TxtDescricionRechazoAV').val(datos.DetalleRechazo.RechazoDescripcion);
           App.modalRechazo.find('#IdAutorizacion').val(idAut);
           App.modalRechazo.find('#IdAvanceObraDet').val(idAB);


           if(Consulta)
           {
            App.modalRechazo.find('#BtnGuardarRechazoAv').hide();
           }


            
            }

        });

        App.modalRechazo = $(App.modalRechazo).modal({
            backdrop: 'static',
            keyboard: false
        });

    },

    AbrirAprobacion: function (i) {
        App.detalle = App.detalles[i];
        if(App.detalle.Estatus =="G"){
        
            MensajeAdvertencia("Solo se pueden aprobar avances con estatus 'Solicitar aprobación'.");
        return false;
        }

        App.modalAutorizacion = $('#autorizacionAvance').clone(false);
        var url = "Avances/Detalle";
        this.Ajax(url, { id: App.detalle.Id,  tipo: App.detalle.Tipo  }, function (data) {
            App.detalle = data.Resultado;

            if (data.Aprobar === true) {
                App.modalAutorizacion.find('#autorizar').show();
            }
            App.modalAutorizacion.find('#btnEvidenciaAprobar').attr('href', './Archivos/AvanceObra/' + App.detalle.Evidencia.split("\\").pop())

            App.modalAutorizacion = $(App.modalAutorizacion).modal({
                backdrop: 'static',
                keyboard: false
            });

            var table = App.modalAutorizacion.find('.datatable').DataTable({
                language: lenguajeEs,
                data: App.detalle.Autorizaciones,
                paging: false,
                searching: false,
                info: false,
                columns: [
                    {
                         "class": "text-center",
                        render: function (data, type, row) {

                            var title = 'En proceso';
                            title = row.Estatus == "A" ? 'Aprobada' : title;
                            title = row.Estatus == "R" ? 'Rechazada, click para ver motivo de rechazo' : title;

                            var estatus = 'proceso';
                            estatus = row.Estatus == "A" ? 'aprobada' : estatus;
                            estatus = row.Estatus == "R" ? 'rechazada' : estatus;
                            if(row.Estatus  == "R")
                            {
                            return '<div title="' + title + '" class="Estatus-' + estatus + '" data-toggle="tooltip" data-placement="right" onclick="App.AbrirRechazo(' + row.Id + ',' + row.IdAvanceObraDet + ',true)"></div>';
                            }
                            else{
                                                        return '<div title="' + title + '" class="Estatus-' + estatus + '" data-toggle="tooltip" data-placement="right"></div>';
                            }
                        }
                    },
                    { "data": "Responsable" },
                    { "data": "Nombre" },
                    {
                        "data": "Fecha",
                        render: function (data, type, row) {
                        if(data != null){
                         return moment(data).format("DD/MM/YYYY");
                        }
                        else{
                        return '';
                        }
                           
                        }
                    },

                      {
                          "class": "text-center",
                          render: function (data, type, row) {
                          if(row.Autorizado){
                          if(row.EstatusDetalle == "S" ){
                              return ' <button class="btn btn-success glyphicon glyphicon-ok" onclick="App.AprobarAvance(' + row.Id + ',' + row.IdAvanceObraDet + ')" ></button>';
                          }
                          else  {
                          return '';
                          }
                          }
                           else  {
                          return '';
                          }
                          }
                      },
                       {
                           "class": "text-center",
                           render: function (data, type, row) {
                            if(row.EstatusDetalle == "S" && row.Autorizado == true){
                               return '<button class="btn btn-danger glyphicon glyphicon-remove" onclick="App.AbrirRechazo(' + row.Id + ',' + row.IdAvanceObraDet + ',false)" >';
                               }
                                else {
                                return '';
                               }
                           }
                       },
                ]
            });


        });
    },
    AprobarAvance: function (idAut, idAB) {
        var data = { IdAutorizacion: idAut, IdAvanceObraDet: idAB };
        var url = "Avances/AutorizarAvance";
        this.Ajax(url, data, function (data) {
            if (data.Exito) {
                $('.modal').modal('hide');
                App.Actualizar();
                MensajeExito("Se aprobó el avance de obra correctamente.");
            }
        });
    },
    RechazarAvance: function () {

        var IdAut = App.modalRechazo.find('#IdAutorizacion').val();
        var IdAB = App.modalRechazo.find('#IdAvanceObraDet').val();
        var Rechazoid = App.modalRechazo.find('#SelMotivoRechazoAV').val();
        var motivo = App.modalRechazo.find('#TxtDescricionRechazoAV').val();
  
        var data = { IdAutorizacion: IdAut, IdAvanceObraDet: IdAB,RechazoId: Rechazoid,  Motivo: motivo };
      

         if (data.RechazoId == '-1') {
            $('#SelMotivoRechazoAV').addClass('error');
            MensajeAdvertencia('El motivo de rechazo es requerido, favor de validar.');
            return false;
        }

         var url = "Avances/Rechazar";
            this.Ajax(url, data, function (datos) {
                if (datos.Exito) {
                    $('.modal').modal('hide');
                    App.Actualizar();
                    MensajeExito("Se rechazó el avance de obra correctamente.");
                }
            });
        
      

    },
    Ajax: function (url, data, callback) {
        return $.ajax({
            url: url,
            type: "POST",
            data: data,
            async: true,
            global: false,
            beforeSend: function () { },
            complete: function () { },
            success: function (data) {
                if (data.Exito) {
                    callback(data);
                }
                else {
                    MensajeError(data.Error);
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
             MensajeError("La sesión se ha terminado, por favor actualice la página.");
            }
        });
    }
};

$(document).ready(function () {



    IniciarAvance();

    //App.Inicializar();

    ////$(document).on('loaded.bs.modal', '#detalleAvanceObra', function () {
    ////    ActualizarDetalles();
    ////});

    //$(document).on('shown.bs.modal', '.modal', function () {
    //    var zIndex = 1040 + (10 * $('.modal:visible').length);
    //    $(this).css('z-index', zIndex);
    //    setTimeout(function () {
    //        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    //    }, 0);
    //});

    //$(document).on("click, focus", ".date span, .date input", function () {
    //    $(this).parents('.date').datetimepicker({
    //        locale: 'es',
    //        inline: false,
    //        format: 'DD/MM/YYYY',
    //    }).data("DateTimePicker").show();
    //});

    //$(document).on("change", ".fileinput ", function (e) {

    //    if (e.target.files != undefined) {
    //        var reader = new FileReader();
    //        reader.onload = function (f) {
    //            App.evidencia.archivo = f.target.result;
    //        };
    //        reader.readAsDataURL(e.target.files.item(0));
    //    }
    //});

});

function IniciarAvance() {
    App.Inicializar();

    //$(document).on('loaded.bs.modal', '#detalleAvanceObra', function () {
    //    ActualizarDetalles();
    //});

    $(document).on('shown.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });

    $(document).on("click, focus", ".date span, .date input", function () {
        $(this).parents('.date').datetimepicker({
            locale: 'es',
            inline: false,
            format: 'DD/MM/YYYY',
        }).data("DateTimePicker").show();
    });

    $(document).on("change", ".fileinput ", function (e) {

        if (e.target.files != undefined) {
            var reader = new FileReader();
            reader.onload = function (f) {
                App.evidencia.archivo = f.target.result;
            };
            reader.readAsDataURL(e.target.files.item(0));
        }
    });

}
//function RecargaAvance() {
//    App.Actualizar();

//    //$(document).on('loaded.bs.modal', '#detalleAvanceObra', function () {
//    //    ActualizarDetalles();
//    //});

//    $(document).on('shown.bs.modal', '.modal', function () {
//        var zIndex = 1040 + (10 * $('.modal:visible').length);
//        $(this).css('z-index', zIndex);
//        setTimeout(function () {
//            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
//        }, 0);
//    });

//    $(document).on("click, focus", ".date span, .date input", function () {
//        $(this).parents('.date').datetimepicker({
//            locale: 'es',
//            inline: false,
//            format: 'DD/MM/YYYY',
//        }).data("DateTimePicker").show();
//    });

//    $(document).on("change", ".fileinput ", function (e) {

//        if (e.target.files != undefined) {
//            var reader = new FileReader();
//            reader.onload = function (f) {
//                App.evidencia.archivo = f.target.result;
//            };
//            reader.readAsDataURL(e.target.files.item(0));
//        }
//    });

//    $.fn.serializeObject = function () {
//        var o = {};
//        var a = this.serializeArray();
//        $.each(a, function () {
//            if (o[this.name] !== undefined) {
//                if (!o[this.name].push) {
//                    o[this.name] = [o[this.name]];
//                }
//                o[this.name].push(this.value || '');
//            } else {
//                o[this.name] = this.value || '';
//            }
//        });
//        return o;
//    };

//    $.fn.setObject = function (o) {
//        for (var property in o) {
//            var input = $(this).find('[name="' + property + '"]');
//            if (property == 'Fecha') {
//                input.val(moment(o[property]).format('DD/MM/YYYY'));
//            }
//            else {
//                input.val(o[property]);
//            }
//        }
//    };

//    $.fn.bindModel = function (model) {
//        $(this).find('[data-model]').each(function () {


//            if (this.dataset.model != '') {

//                var prop = this.dataset.model;
//                var format = this.dataset.format;
//                var value = model[prop];

//                if (format !== undefined) {
//                    switch (format) {
//                        case 'date': value = moment(value, "DD/MM/YYYY").format('DD/MM/YYYY'); break;
//                        case 'tipo': value = value == 1 ? 'Anticipo' : 'Avance'; break;
//                        case 'file': value = value === null ? this.innerText : value.split("\\").pop(); break;
//                    }
//                    this.removeAttribute('data-model');
//                }

//                this.removeAttribute('data-model');
//                this.innerText = value;
//            }

//        });
//    };

//}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.setObject = function (o) {
    for (var property in o) {
        var input = $(this).find('[name="' + property + '"]');
        if (property == 'Fecha') {
            input.val(moment(o[property]).format('DD/MM/YYYY'));
        }
        else {
            input.val(o[property]);
        }
    }
};

$.fn.bindModel = function (model) {
    $(this).find('[data-model]').each(function () {


        if (this.dataset.model != '') {

            var prop = this.dataset.model;
            var format = this.dataset.format;
            var value = model[prop];

            if (format !== undefined) {
                switch (format) {
                    case 'date': value = moment(value, "DD/MM/YYYY").format('DD/MM/YYYY'); break;
                    case 'tipo': value = value == 1 ? 'Anticipo' : 'Avance'; break;
                    case 'file': value = value === null ? this.innerText : value.split("\\").pop(); break;
                    case 'number': value = $.number(value, 2, ".", ",");
                }
                this.removeAttribute('data-model');
            }

            this.removeAttribute('data-model');
            this.innerText = value;
        }

    });
};

var parseDate = function (obj, format) {
    if (obj !== null) {
        if (obj.indexOf('Date') > -1) {
            return moment(new Date(parseInt(obj.replace("/Date(", "").replace(")/", ""), 10))).format(format)
        }
    }
    return obj;
}

var find = function (obj, value, prop, object) {
    for (var i = 0; i < obj.length; i++) {
        if (String(obj[i][prop]) === String(value)) {
            if (object === true) {
                return obj[i];
            }
            return i;
        }
    }
    return null;
}





