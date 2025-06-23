using System.Linq;
using System.IO;
using System.Data;
using ClosedXML.Excel;
using CapaDatos.Models;
using ClosedXML.Report;
using System;

using MoreLinq;

namespace AxProductividad
{
    public static class Reportes
    {
        public static byte[] CrearExcel<T>(T data)
        {
            XLWorkbook wb = new XLWorkbook();

            if (data is DataSet)
            {
                var dataSet = data as DataSet;

                foreach (DataTable tabla in dataSet.Tables)
                {
                    wb.Worksheets.Add(tabla, tabla.TableName);
                }
            }
            else if (data is DataTable)
            {
                var dataTable = data as DataTable;
                wb.Worksheets.Add(dataTable, dataTable.TableName);
            }
            else
            {
                return new byte[0x00];
            }

            wb.Worksheets.ToList().ForEach(x =>
            {
                x.Columns().AdjustToContents();
                x.Cells().Style.Alignment.SetWrapText(true);
                x.Cells().Style.Alignment.SetVertical(XLAlignmentVerticalValues.Top);
            });
            MemoryStream stream = ObtenerStream(wb);
            return stream.ToArray();
        }

        public static byte[] ReporteAuditoriaFinalizada(object auditoria)
        {
            var template = new ClosedXML.Report.XLTemplate(AppDomain.CurrentDomain.BaseDirectory + "Archivos\\Formatos\\Reporte_Auditoria_Finalizada.xlsx");
            template.AddVariable(auditoria);
            template.Generate();

            // Agrupar Hallazgos
            template.Workbook.Worksheets.ToList().ForEach(x =>
            {
                var cuenta = 0;
                int[] posiciones = { 0, 0 };
                x.Worksheet.Rows().ForEach(y =>
                {
                    var descripcion = template.Workbook.Worksheets.FirstOrDefault().Cell(y.RowNumber(), "B").Value.ToString();
                    if(descripcion == "Descripción" && cuenta == 0)
                    {
                        posiciones[0] = y.RowNumber();
                        cuenta++;
                    }
                    if(descripcion == "" && cuenta == 1)
                    {
                        posiciones[1] = y.RowNumber() - 1;
                        cuenta++;
                    }
                    if(cuenta == 2)
                    {
                        x.Rows(posiciones[0], posiciones[1]).Group();
                        x.Rows(posiciones[0], posiciones[1]).Collapse();
                        cuenta = 0;
                        posiciones.ForEach(z => z = 0);
                    }
                });
            });

            MemoryStream stream = ObtenerStream(template);
            return stream.ToArray();
        }

        private static MemoryStream ObtenerStream<T>(T excelWorkbook)
        {
            MemoryStream fs = new MemoryStream();

            if (excelWorkbook is XLWorkbook)
            {
                var workbook = excelWorkbook as XLWorkbook;
                workbook.SaveAs(fs);
                fs.Position = 0;

            }
            else if (excelWorkbook is XLTemplate)
            {
                var workbook = excelWorkbook as XLTemplate;
                workbook.SaveAs(fs);
                fs.Position = 0;
            }

            return fs;
        }
    }
}