using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using CapaDatos.Models;
namespace CapaDatos
{
    public class ConvertirDatos
    {
        public static string GenerarTablaHtml(DataTable dt)
        {
            try
            {
                string TablaBody = string.Empty;
                TablaBody = "<thead> ";
                for (int i = 2; i < dt.Columns.Count; i++)
                {
                    TablaBody += "<th>" + dt.Columns[i].ColumnName.ToString() + "</th>";
                }
                TablaBody  += "</thead> <tbody>";

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    TablaBody += "<tr>";
                    for (int j = 2; j < dt.Columns.Count; j++)
                    {

                        TablaBody += "<td>" + dt.Rows[i][j].ToString() + "</td>";

                    }
                    TablaBody += "</tr>";

                }

                TablaBody += "</tbody>";

                return TablaBody;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public static string GenerarTablaTiempos(DataTable dt)
        {
            try
            {
                string TablaBody = string.Empty;
                TablaBody = "<thead> ";
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    TablaBody += "<th>" + dt.Columns[i].ColumnName.ToString() + "</th>";
                }
                TablaBody += "</thead> <tbody>";

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    TablaBody += "<tr>";
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {

                        TablaBody += "<td>" + dt.Rows[i][j].ToString() + "</td>";

                    }
                    TablaBody += "</tr>";

                }

                TablaBody += "</tbody>";

                return TablaBody;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public static string GenerarAlertas(List<ActividadesModel> LstActividades)
        {
            try
            {
                string div = string.Empty;
                foreach (var item in LstActividades)
                {

                    div += " <div class='list-group-item xn-principal'  style='cursor: pointer;' onclick='clickalerta(" + item.IdActividad + ")'>" +
                            "<span class='contacts-title'>Actividad. <span id= 'LblNoActividad' >" + item.IdActividad + "</ span ></ span >" +
                            "<p> Proyecto:" + item.ProyectoStr + "</p>" +
                            "<p> Descripción:" + item.Descripcion + "</p>" +
                            "<p>Estatus:" + item.EstatusStr + "</p>" +
                            "<p>Prioridad:" + item.PrioridadStr + "</p>" +
                             "</div>";

                }


                return div;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
    }
}
