var dsValidaciones = [];
var tablaValidacion;


var columnasValidacion = [
           {
               "data": "IdActividadVal",
               "visible": false
           },
            {
                  "data": "Estatus",
                  "class": "text-center",
                  "render": function (data, type, row) {
                      var estlo = "";

                      switch (data) {
                          case 'P':
                              estlo = "Estatus-asignada";
                              break;
                          case 'L':
                              estlo = "Estatus-liberada";
                              break;
                          case 'X':
                              estlo = "Estatus-rechazada";
                              break;
                      }

                      return '<div class="' + estlo + '" data-toggle="tooltip" data-placement="right" "></div>';
                  }
              },
              {
                  "data": "NombreAut",
                  "class": "text-left"
              },
            {
                "data": "NombreValido",
                "class": "text-left"
            },

             {
                 "data": "FechaAtendio",
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                 }
             },

            {
                "data": "Valida",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? '<div class="btn-group"><button class="btn btn-success btn-xs glyphicon glyphicon-ok BtnAprobarAct"></button><button class="btn btn-success btn-xs glyphicon glyphicon-remove BtnRechazarAct"></button></div>' : "";
                }
            },
             {
                 "data": "MotivoRechazoId",
                  "visible": false
             },
             {
                 "data": "DescripcionRechazo",
                  "visible": false
             }
];


