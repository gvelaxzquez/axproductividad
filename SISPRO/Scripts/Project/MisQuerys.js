
var dsQuerys;
var dsQuerysC;
var recarga = false;
var $tableQuerys = $('#TbQuerysM');


var $tableQuerysC = $('#TbQuerysC');

$(document).ready(function () {

    CargarQuerys();

});



async function CargarQuerys() {


    const data = await POST('/Querys/ConsultaQuerys', {  });

    if (data.Exito) {

        dsQuerys = jQuery.parseJSON(data.LstQuerysP);
        dsQuerysC = jQuery.parseJSON(data.LstQuerysC);


        if (recarga) {

            $tableQuerys.bootstrapTable('load', dsQuerys);
            $tableQuerysC.bootstrapTable('load', dsQuerysC);
        }
        else {

            $tableQuerys.bootstrapTable({
                data: dsQuerys,
                idField: 'IdQuery',
                search: true,
                idtable: "saveId",
                columns: [

                    {
                        field: 'Nombre',
                        title: 'Id',
                        align: 'left',
                        sortable: true,
                        formatter: function (value, row, index) {

                            return '<a style="color: #337ab7" class="btn btn-link" onclick="VerQuery(' + "'" + row.IdUnique + "'" + ' )">' + value + '</a>';
                        }
                    },

                ]
            });

            $tableQuerysC.bootstrapTable({
                data: dsQuerysC,
                idField: 'IdQuery',
                search: true,
                idtable: "saveId",
                columns: [

                    {
                        field: 'Nombre',
                        title: 'Id',
                        align: 'left',
                        sortable: true,
                        formatter: function (value, row, index) {

                            return '<a style="color: #337ab7" class="btn btn-link" onclick="VerQuery(' + "'" + row.IdUnique + "'" + ' )">' + value + '</a>';
                        }
                    },

                ]
            });

            recarga = true;
        }
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