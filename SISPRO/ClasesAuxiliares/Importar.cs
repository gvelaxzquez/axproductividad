using CapaDatos;
using CapaDatos.Constants;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using DocumentFormat.OpenXml.Office2010.PowerPoint;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace AxProductividad.ClasesAuxiliares
{
    public static class Importar
    {
        static readonly CD_CatalogoGeneral cd_CatGeneral;

        static Importar()
        {
            cd_CatGeneral = new CD_CatalogoGeneral();
        }

        public static (List<(string Nombre, long IdFase, long IdClasificacion, List<string> Controles)>, bool Estatus, string Errores) ImportarListaControl(HttpPostedFileBase archivo, string conexionEF)
        {
            try
            {
                using (var package = new ExcelPackage(archivo.InputStream))
                {
                    var lista = new List<(string Nombre, long IdFase, long IdClasificacion, List<string> Controles)>();

                    foreach (ExcelWorksheet sheet in package.Workbook.Worksheets)
                    {
                        int ultimaFila = sheet.Dimension.End.Row;

                        if (ultimaFila < 3)
                            return (null, false, $"La pestaña {sheet.Name} debe tener definido Proceso y Subproceso.");

                        var nombre = sheet.Cells[1, 1].Value?.ToString()?.Trim();
                        if (nombre == null || nombre == "")
                            return (null, false, $"La pestaña {sheet.Name} no tiene un nombre de Lista de Control valido.");

                        var columnaCategoria = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Proceso")?.FirstOrDefault()?.Start?.Column;
                        var columnaSubcategoria = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Subproceso")?.FirstOrDefault()?.Start?.Column;
                        var columnaControl = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Puntos a revisar")?.FirstOrDefault()?.Start?.Column;

                        if (columnaCategoria == null || columnaSubcategoria == null || columnaControl == null)
                            return (null, false, $"Las columnas 'Proceso', 'Subproceso' y 'Puntos a revisar' son obligatorias en la pestaña {sheet.Name}.");

                        var categoria = sheet.Cells[3, (int)columnaCategoria].Value?.ToString()?.Trim();
                        var subcategoria = sheet.Cells[3, (int)columnaSubcategoria].Value?.ToString()?.Trim();

                        if (categoria == null || categoria == "" || subcategoria == null || subcategoria == "")
                            return (null, false, $"La pestaña {sheet.Name} requiere los campos Proceso y Subproceso.");

                        var Procesos = cd_CatGeneral.ObtenerCatalogoGeneral(2, conexionEF);
                        var idFase = Procesos.FirstOrDefault(x => x.DescCorta == categoria || x.DescLarga == categoria)?.IdCatalogo;
                        if (idFase == null)
                            return (null, false, $"La pestaña {sheet.Name} no tiene un proceso valido.");

                        var Subprocesos = cd_CatGeneral.ObtenerClasificacionActividad((long)idFase, conexionEF);
                        var idClasificacion = Subprocesos.FirstOrDefault(X => X.DescCorta == subcategoria || X.DescLarga == subcategoria)?.IdCatalogo;
                        if (idClasificacion == null)
                            return (null, false, $"La pestaña {sheet.Name} no tiene un subproceso valido.");

                        var controles = new List<string>();
                        if (ultimaFila > 4)
                        {
                            controles = sheet.Cells[5, (int)columnaControl, ultimaFila, (int)columnaControl]
                                .Where(x => x.Value != null && x.Value?.ToString()?.Trim() != "").Select(x => x.Value.ToString()).ToList();

                            var controlDuplicado = controles
                            .GroupBy(x => x, StringComparer.OrdinalIgnoreCase)
                            .Where(x => x.Count() > 1)
                            .Any();
                            if (controlDuplicado) return (null, false, $"La pestaña {sheet.Name} tiene puntos a revisar duplicados.");
                        }

                        lista.Add((nombre, (long)idFase, (long)idClasificacion, controles));
                    }

                    return (lista, true, "");
                }
            }
            catch (Exception)
            {
                return (null, false, "Error al leer el documento, por favor verifique que el documento es el correcto.");
            }
        }

        public static (List<ActividadesModel> Bugs, bool Estatus, string Errores) ImportarBug(char tipo, HttpPostedFileBase archivo, List<long> proyectosUsuario, long idUsuario, string conexionEF)
        {
            try
            {
                using (var package = new ExcelPackage(archivo.InputStream))
                {
                    var bugs = new List<ActividadesModel>();

                    foreach (ExcelWorksheet sheet in package.Workbook.Worksheets)
                    {
                        int ultimaFila = sheet.Dimension.End.Row;

                        if (ultimaFila < 2)
                            return (null, false, $"La pestaña {sheet.Name} no tiene registros para importar.");

                        int? columnaId = null;
                        if (tipo == 'a')
                            columnaId = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "NoActividad")?.FirstOrDefault()?.Start?.Column;

                        var columnaProyecto = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "ClaveProy")?.FirstOrDefault()?.Start?.Column;
                        var columnaReferencia = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "ActividadRef")?.FirstOrDefault()?.Start?.Column;
                        var columnaBR = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "BR")?.FirstOrDefault()?.Start?.Column;
                        var columnaResponsable = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Responsable")?.FirstOrDefault()?.Start?.Column;
                        var columnaAsignado = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Asignado")?.FirstOrDefault()?.Start?.Column;
                        var columnaClasificacion = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Clasificacion")?.FirstOrDefault()?.Start?.Column;
                        var columnaDescripcion = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Descripcion")?.FirstOrDefault()?.Start?.Column;
                        //var columnaHorasFacturables = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "HorasFacturables")?.FirstOrDefault()?.Start?.Column;
                        //var columnaHorasPlaneadas = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "HorasPlaneadas")?.FirstOrDefault()?.Start?.Column;
                        //var columnaFechaInicio = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "InicioPlaneado")?.FirstOrDefault()?.Start?.Column;
                        //var columnaFechaFin = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "FinPlaneado")?.FirstOrDefault()?.Start?.Column;

                        if ((tipo == 'a' && columnaId == null) || columnaProyecto == null || columnaReferencia == null || columnaResponsable == null || columnaAsignado == null || columnaClasificacion == null || columnaDescripcion == null)
                            return (null, false, $"Todas las columnas encontradas en el Layout son obligatorias en la pestaña {sheet.Name}.");

                        var proyectos = sheet.Cells[2, (int)columnaProyecto, ultimaFila, (int)columnaProyecto].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var referencias = sheet.Cells[2, (int)columnaReferencia, ultimaFila, (int)columnaReferencia].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var brs = sheet.Cells[2, (int)columnaBR, ultimaFila, (int)columnaBR].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var asignados = sheet.Cells[2, (int)columnaAsignado, ultimaFila, (int)columnaAsignado].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var responsables = sheet.Cells[2, (int)columnaResponsable, ultimaFila, (int)columnaResponsable].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var clasificaciones = sheet.Cells[2, (int)columnaClasificacion, ultimaFila, (int)columnaClasificacion].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var descripciones = sheet.Cells[2, (int)columnaDescripcion, ultimaFila, (int)columnaDescripcion].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        //var horasFac = sheet.Cells[2, (int)columnaHorasFacturables, ultimaFila, (int)columnaHorasFacturables].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        //var horasPlan = sheet.Cells[2, (int)columnaHorasPlaneadas, ultimaFila, (int)columnaHorasPlaneadas].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        //var fechasIni = sheet.Cells[2, (int)columnaFechaInicio, ultimaFila, (int)columnaFechaInicio].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        //var fechasFin = sheet.Cells[2, (int)columnaFechaFin, ultimaFila, (int)columnaFechaFin].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var ids = proyectos;
                        if (tipo == 'a')
                            ids = sheet.Cells[2, (int)columnaId, ultimaFila, (int)columnaId].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        else
                            ids = null;

                        if (tipo == 'a')
                        {
                            if (ids.FirstOrDefault(x => x.Value == null || !long.TryParse(x.Value?.ToString(), out _)) is var _ids && _ids != null)
                                return (null, false, $"La pestaña {sheet.Name} no contiene el id o el dato no es numerico en la fila {_ids.i}");
                        }

                        if (proyectos.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _proyecto && _proyecto != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene clave de proyecto en la fila {_proyecto.i}");

                        if (referencias.FirstOrDefault(x => x.Value == null || !long.TryParse(x.Value?.ToString(), out _)) is var _referencia && _referencia != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene una referencia correcta en la fila {_referencia.i}");

                        if (brs.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _br && _br != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene el br en la fila {_br.i}");

                        if (responsables.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _responsables && _responsables != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene el usuario responsable en la fila {_responsables.i}");

                        if (asignados.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _asignados && _asignados != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene el usuario asignado en la fila {_asignados.i}");

                        if (clasificaciones.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _clasificaciones && _clasificaciones != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene la clasificacion en la fila {_clasificaciones.i}");

                        if (descripciones.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _descripciones && _descripciones != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene descripcion en la fila {_descripciones.i}");

                        //if (horasFac.FirstOrDefault(x => x.Value == null || !decimal.TryParse(x.Value?.ToString(), out _)) is var _horasFac && _horasFac != null)
                        //    return (null, false, $"La pestaña {sheet.Name} no contiene las horas facturables o el dato no es correcto en la fila {_horasFac.i}");

                        //if (horasPlan.FirstOrDefault(x => x.Value == null || !decimal.TryParse(x.Value?.ToString(), out _)) is var _horasPlan && _horasPlan != null)
                        //    return (null, false, $"La pestaña {sheet.Name} no contiene las horas asignadas o el dato no es correcto en la fila {_horasPlan.i}");

                        //if (fechasIni.FirstOrDefault(x => x.Value == null || !DateTime.TryParse(x.Value?.ToString(), out _)) is var _fechasIni && _fechasIni != null)
                        //    return (null, false, $"La pestaña {sheet.Name} no contiene la fecha de inicio o el dato no es correcto en la fila {_fechasIni.i}");

                        //if (fechasFin.FirstOrDefault(x => x.Value == null || !DateTime.TryParse(x.Value?.ToString(), out _)) is var _fechasFin && _fechasFin != null)
                        //    return (null, false, $"La pestaña {sheet.Name} no contiene la fecha de fin o el dato no es correcto en la fila {_fechasFin.i}");

                        var bdProyectos = new List<ProyectosModel>();
                        var bdClasificaciones = new List<CatalogoGeneralModel>();
                        using (var contexto = new BDProductividad_DEVEntities(conexionEF))
                        {
                            if (tipo == 'a')
                            {
                                var id = ids.Select(x => Convert.ToInt64(x.Value)).ToList();
                                var proyectosActividades = contexto.Actividad.Where(x => id.Contains(x.IdActividad)).Select(x => x.IdProyecto).Distinct().ToList();

                                if (!proyectosActividades.All(p => proyectosUsuario.Contains(p)))
                                    return (null, false, "No puede modificar proyectos en los que no esta asignado");
                            }

                            var claves = proyectos.Select(x => x.Value.ToString()).Distinct().ToList();
                            bdProyectos =
                                contexto.Proyecto
                                .Where(p => proyectosUsuario.Contains(p.IdProyecto) && claves.Contains(p.Clave) && p.Activo == true)
                                .Select(p => new ProyectosModel
                                {
                                    IdProyecto = p.IdProyecto,
                                    Clave = p.Clave,
                                    Actividades = contexto.Actividad.Where(a => a.IdProyecto == p.IdProyecto && new[] { "R", "L" }.Contains(a.Estatus))
                                    .Select(x => new ActividadesModel
                                    {
                                        IdActividad = x.IdActividad
                                    }).ToList(),
                                }).ToList();

                            bdProyectos.ForEach(x => x.Usuarios = new CD_Proyecto().ConsultarEquipoProyecto(x.IdProyecto, conexionEF));

                            bdClasificaciones = cd_CatGeneral.ObtenerClasificacionActividad(FasePSP.Bug, conexionEF);
                        }

                        for (int fila = 2; fila <= ultimaFila; fila++)
                        {
                            var bug = new ActividadesModel
                            {
                                Estatus = "A",
                                Prioridad = 1,
                                Retrabajo = true,
                                FechaCreo = DateTime.Now,
                                IdUCreo = idUsuario,
                                TipoActividadId = FasePSP.Bug,
                                Descripcion = descripciones.FirstOrDefault(x => x.i == fila).Value.ToString(),
                                BR = brs.FirstOrDefault(x => x.i == fila).Value.ToString(),
                                //HorasAsignadas = Convert.ToDecimal(horasPlan.FirstOrDefault(x => x.i == fila).Value),
                                //HorasFacturables = Convert.ToDecimal(horasFac.FirstOrDefault(x => x.i == fila).Value),
                                //FechaInicio = Convert.ToDateTime(fechasIni.FirstOrDefault(x => x.i == fila).Value),
                                //FechaSolicitado = Convert.ToDateTime(fechasFin.FirstOrDefault(x => x.i == fila).Value),
                                HorasAsignadas = 0,
                                HorasFacturables = 0,
                                FechaInicio = DateTime.Now.Date.AddDays(1).AddSeconds(-1),
                                FechaSolicitado = DateTime.Now.Date.AddDays(1).AddSeconds(-1),
                                IdIteracion = fila
                            };

                            if (tipo == 'a')
                            {
                                bug.IdActividad = Convert.ToInt64(ids.FirstOrDefault(x => x.i == fila).Value);
                            }

                            bug.ClasificacionId =
                                bdClasificaciones
                                .FirstOrDefault(x => x.DescCorta == clasificaciones.FirstOrDefault(y => y.i == fila).Value.ToString()
                                || x.DescLarga == clasificaciones.FirstOrDefault(y => y.i == fila).Value.ToString())
                                ?.IdCatalogo ?? throw new Exception($"La clasificacion no pertenece a BUG en la pestaña {sheet.Name} fila {fila}");
                            bug.IdProyecto =
                                bdProyectos
                                .FirstOrDefault(x => x.Clave == proyectos.FirstOrDefault(y => y.i == fila).Value.ToString())
                                ?.IdProyecto ?? throw new Exception($"La clave del proyecto es incorrecta en la pestaña {sheet.Name} fila {fila}");
                            bug.IdActividadRef =
                                bdProyectos.FirstOrDefault(x => x.IdProyecto == bug.IdProyecto).Actividades
                                .FirstOrDefault(x => x.IdActividad == Convert.ToInt64(referencias.FirstOrDefault(y => y.i == fila).Value))
                                ?.IdActividad ?? throw new Exception($"La actividad de referencia no pertenece al proyecto en la pestaña {sheet.Name} fila {fila}");
                            bug.IdUsuarioResponsable =
                                 bdProyectos.FirstOrDefault(x => x.IdProyecto == bug.IdProyecto).Usuarios
                                 .FirstOrDefault(x => x.NumEmpleado == responsables.FirstOrDefault(y => y.i == fila).Value.ToString())
                                 ?.IdUsuario ?? throw new Exception($"El usuario no pertenece al proyecto en la pestaña {sheet.Name} fila {fila}");
                            bug.IdUsuarioAsignado =
                                 bdProyectos.FirstOrDefault(x => x.IdProyecto == bug.IdProyecto).Usuarios
                                 .FirstOrDefault(x => x.NumEmpleado == asignados.FirstOrDefault(y => y.i == fila).Value.ToString())
                                 ?.IdUsuario ?? throw new Exception($"El usuario no pertenece al proyecto en la pestaña {sheet.Name} fila {fila}");

                            bugs.Add(bug);
                        }
                    }

                    return (bugs, true, "Archivo correcto");
                }
            }
            catch (Exception e)
            {
                return (null, false, e.Message);
            }
        }

        public static (List<UsuarioCostoModel> UsuarioCostos, bool Estatus, string Errores) ImportarUsuarioCosto(HttpPostedFileBase archivo, char tipo, long idUsuario, string conexionEF)
        {
            try
            {
                using (var package = new ExcelPackage(archivo.InputStream))
                {
                    var costos = new List<UsuarioCostoModel>();

                    foreach (ExcelWorksheet sheet in package.Workbook.Worksheets)
                    {
                        int ultimaFila = sheet.Dimension.End.Row;

                        if (ultimaFila < 2)
                            return (null, false, $"La pestaña {sheet.Name} no tiene registros para importar.");

                        int? columnaId = null;
                        if (tipo == 'a')
                            columnaId = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Id")?.FirstOrDefault()?.Start?.Column;

                        var columnaUsuario = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "ClaveUsuario")?.FirstOrDefault()?.Start?.Column;
                        var columnaMensual = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "SueldoMensual")?.FirstOrDefault()?.Start?.Column;
                        var columnaHora = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "SueldoHora")?.FirstOrDefault()?.Start?.Column;


                        if (tipo == 'a' && columnaId == null)
                            return (null, false, $"La columna Id es requerida en la pestaña {sheet.Name}.");

                        if (columnaUsuario == null)
                            return (null, false, $"La columna ClaveUsuario es requerida en la pestaña {sheet.Name}.");

                        var ids =
                            tipo == 'c' ?
                            null :
                            sheet.Cells[2, (int)columnaId, ultimaFila, (int)columnaId].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var usuarios = sheet.Cells[2, (int)columnaUsuario, ultimaFila, (int)columnaUsuario].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var sueldosMensuales =
                            columnaMensual == null ?
                            null :
                            sheet.Cells[2, (int)columnaMensual, ultimaFila, (int)columnaMensual].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var sueldosHoras =
                            columnaHora == null ?
                            null :
                            sheet.Cells[2, (int)columnaHora, ultimaFila, (int)columnaHora].Select((x, i) => new { x.Value, i = i + 2 }).ToList();

                        if (ids != null)
                        {
                            if (ids.FirstOrDefault(x => x.Value == null || !long.TryParse(x.Value?.ToString(), out _)) is var _ids && _ids != null)
                                return (null, false, $"La pestaña {sheet.Name} no contiene el id o el dato no es numerico en la fila {_ids.i}");
                        }

                        if (usuarios.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _usuarios && _usuarios != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene clave de usuario en la fila {_usuarios.i}");

                        if (sueldosMensuales != null)
                        {
                            if (sueldosMensuales.FirstOrDefault(x => !decimal.TryParse(x.Value?.ToString() ?? "0", out _)) is var _sueldosMensuales && _sueldosMensuales != null)
                                return (null, false, $"La pestaña {sheet.Name} no contiene un dato numerico para el sueldo mensual en la fila {_sueldosMensuales.i}");
                        }

                        if (sueldosHoras != null)
                        {
                            if (sueldosHoras.FirstOrDefault(x => !decimal.TryParse(x.Value?.ToString() ?? "0", out _)) is var _sueldosHoras && _sueldosHoras != null)
                                return (null, false, $"La pestaña {sheet.Name} no contiene un dato numerico para el sueldo mensual en la fila {_sueldosHoras.i}");
                        }

                        var usuariosIds = new List<UsuarioModel>();
                        using (var contexto = new BDProductividad_DEVEntities(conexionEF))
                        {
                            var claves = usuarios.Select(x => x.Value.ToString().ToUpper()).ToList();
                            var duplicados = claves
                                .GroupBy(x => x, StringComparer.OrdinalIgnoreCase)
                                .Where(x => x.Count() > 1)
                                .Any();
                            if (duplicados) return (null, false, $"La pestaña {sheet.Name} tiene usuarios duplicados.");

                            usuariosIds = contexto.Usuario
                                .Where(x => claves.Contains(x.NumEmpleado.ToUpper()))
                                .Select(x => new UsuarioModel { IdUsuario = x.IdUsuario, NumEmpleado = x.NumEmpleado })
                                .ToList();
                        }

                        for (int fila = 2; fila <= ultimaFila; fila++)
                        {
                            var costo = new UsuarioCostoModel
                            {
                                CostoMensual = Convert.ToDecimal(sueldosMensuales?.FirstOrDefault(x => x.i == fila)?.Value ?? 0),
                                CostoHora = Convert.ToDecimal(sueldosHoras?.FirstOrDefault(x => x.i == fila)?.Value ?? 0),
                                IdUCreo = idUsuario,
                                FechaCreo = DateTime.Now
                            };

                            if (tipo == 'a')
                            {
                                costo.IdUsuarioCosto = Convert.ToInt64(ids.FirstOrDefault(x => x.i == fila).Value);
                            }

                            costo.IdUsuario =
                                usuariosIds
                                .FirstOrDefault(x => x.NumEmpleado.ToUpper() == usuarios.FirstOrDefault(y => y.i == fila).Value.ToString().ToUpper())
                                ?.IdUsuario ?? throw new Exception($"El numero de usuario no existe en la pestaña {sheet.Name} fila {fila}");

                            costos.Add(costo);
                        }
                    }

                    return (costos, true, "Archivo correcto");
                }
            }
            catch (Exception e)
            {
                return (null, false, e.Message);
            }
        }

        public static (List<UsuarioCostoMensualModel> UsuarioCostos, bool Estatus, string Errores) ImportarUsuarioCostoMensual(HttpPostedFileBase archivo,int Anio, int Mes, long idUsuario, string conexionEF)
        {
            try
            {
                using (var package = new ExcelPackage(archivo.InputStream))
                {
                    var costos = new List<UsuarioCostoMensualModel>();

                    foreach (ExcelWorksheet sheet in package.Workbook.Worksheets)
                    {
                        int ultimaFila = sheet.Dimension.End.Row;

                        if (ultimaFila < 2)
                            return (null, false, $"La pestaña {sheet.Name} no tiene registros para importar.");


                        var columnaUsuario = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Clave")?.FirstOrDefault()?.Start?.Column;
                        var columnaMensual = sheet.Cells.Where(y => y.Value?.ToString()?.Trim() == "Costo")?.FirstOrDefault()?.Start?.Column;



                        if (columnaUsuario == null)
                            return (null, false, $"La columna Clave es requerida en la pestaña {sheet.Name}.");


                        var usuarios = sheet.Cells[2, (int)columnaUsuario, ultimaFila, (int)columnaUsuario].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                        var sueldosMensuales =columnaMensual == null ? null : sheet.Cells[2, (int)columnaMensual, ultimaFila, (int)columnaMensual].Select((x, i) => new { x.Value, i = i + 2 }).ToList();
                       

                        if (usuarios.FirstOrDefault(x => x.Value == null || x.Value?.ToString()?.Trim() == "") is var _usuarios && _usuarios != null)
                            return (null, false, $"La pestaña {sheet.Name} no contiene clave de usuario en la fila {_usuarios.i}");

                        if (sueldosMensuales != null)
                        {
                            if (sueldosMensuales.FirstOrDefault(x => !decimal.TryParse(x.Value?.ToString() ?? "0", out _)) is var _sueldosMensuales && _sueldosMensuales != null)
                                return (null, false, $"La pestaña {sheet.Name} no contiene un dato numerico para el sueldo mensual en la fila {_sueldosMensuales.i}");
                        }



                        var usuariosIds = new List<UsuarioModel>();
                        using (var contexto = new BDProductividad_DEVEntities(conexionEF))
                        {
                            var claves = usuarios.Select(x => x.Value.ToString().ToUpper()).ToList();
                            var duplicados = claves
                                .GroupBy(x => x, StringComparer.OrdinalIgnoreCase)
                                .Where(x => x.Count() > 1)
                                .Any();
                            if (duplicados) return (null, false, $"La pestaña {sheet.Name} tiene usuarios duplicados.");

                            usuariosIds = contexto.Usuario
                                //.Where(x => claves.Contains(x.NumEmpleado.ToUpper()))
                                .Select(x => new UsuarioModel { IdUsuario = x.IdUsuario, NumEmpleado = x.NumEmpleado })
                                .ToList();
                        }

                        for (int fila = 2; fila <= ultimaFila; fila++)
                        {
                            var costo = new UsuarioCostoMensualModel
                            {
                                CostoMensual = Convert.ToDecimal(sueldosMensuales?.FirstOrDefault(x => x.i == fila)?.Value ?? 0),
                                Anio =  Anio,
                                Mes = Mes,
                                IdUCreo = idUsuario,
                                FechaCreo = DateTime.Now
                            };


                            costo.IdUsuario = usuariosIds.FirstOrDefault(x => x.NumEmpleado.ToUpper() == usuarios.FirstOrDefault(y => y.i == fila).Value.ToString().ToUpper())?.IdUsuario ?? throw new Exception($"El numero de usuario no existe en la pestaña {sheet.Name} fila {fila}");

                            costos.Add(costo);
                        }
                    }

                    return (costos, true, "Archivo correcto");
                }
            }
            catch (Exception e)
            {
                return (null, false, e.Message);
            }
        }




    }
}