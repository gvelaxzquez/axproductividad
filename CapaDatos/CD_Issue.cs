using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2016.Drawing.Charts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Issue
    {
        public List<ProyectoIssueModel> LeerIssue(ProyectoIssueFiltroModel filtros, string conexionEF, UsuarioModel usuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var proyectos = new CD_Proyecto().ConsultaProyectos(usuario, conexionEF).Select(x => x.IdProyecto).ToList();

                var issues =
                    (from I in contexto.ProyectoIssue
                     join P in contexto.Proyecto on I.IdProyecto equals P.IdProyecto
                     join E in contexto.CatalogoGeneral on I.CatalogoEstatusId equals E.IdCatalogo
                     join PR in contexto.CatalogoGeneral on I.CatalogoPrioridadId equals PR.IdCatalogo
                     where P.EstatusId == 253 &&
                     proyectos.Contains(P.IdProyecto) &&
                     (filtros.Proyectos.Contains(P.IdProyecto) || filtros.Proyectos.Count == 0) &&
                     (filtros.Estatus.Contains(E.IdCatalogo) || filtros.Estatus.Count == 0) &&
                     (P.IdProyecto == filtros.IdProyecto || filtros.IdProyecto == 0)
                     select new ProyectoIssueModel
                     {
                         IdIssue = I.IdIssue,
                         IdIssueProyecto = I.IdIssueProyecto,
                         Descripcion = I.Descripcion,
                         FechaDeteccion = I.FechaDeteccion,
                         FechaCompromiso = I.FechaCompromiso,
                         FechaCierre = I.FechaCierre,
                         Bloqueante = I.Bloqueante,
                         ResponsableExterno = I.ResponsableExterno,
                         Usuario = new UsuarioModel
                         {
                             NombreCompleto = contexto.Usuario.Where(x => x.IdUsuario == I.IdUResponsable).Select(x => x.Nombre + " " + x.ApPaterno + " " + x.ApMaterno).FirstOrDefault() ?? "",
                             NumEmpleado = ""
                         },
                         Proyecto = new ProyectosModel
                         {
                             Nombre = P.Nombre,
                             Clave = P.Clave
                         },
                         Estatus = new CatalogoGeneralModel
                         {
                             DescLarga = E.DescLarga,
                             DatoEspecial = E.DatoEspecial
                         },
                         Prioridad = new CatalogoGeneralModel
                         {
                             DescLarga = PR.DescLarga,
                             DatoEspecial = PR.DatoEspecial
                         },
                         ProyectoIssueComentario =
                            (from IC in contexto.ProyectoIssueComentario
                             join U in contexto.Usuario on IC.IdUCreo equals U.IdUsuario
                             where IC.IdIssue == I.IdIssue && IC.Activo
                             select new ProyectoIssueComentarioModel
                             {
                                 IdIssueComentario = IC.IdIssueComentario,
                                 Comentario = IC.Comentario,
                                 Autogenerado = IC.Autogenerado,
                                 FechaCreo = IC.FechaCreo,
                                 Usuario = new UsuarioModel
                                 {
                                     NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                                     NumEmpleado = U.NumEmpleado
                                 }
                             }).OrderBy(x => x.FechaCreo).ToList()
                     }).ToList();

                return issues;
            }
        }

        public ProyectoIssueModel LeerIssuePorId(long idIssue, string conexionEF, UsuarioModel usuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var proyectos = new CD_Proyecto().ConsultaProyectos(usuario, conexionEF).Select(x => x.IdProyecto).ToList();

                var issues =
                    (from I in contexto.ProyectoIssue
                     join P in contexto.Proyecto on I.IdProyecto equals P.IdProyecto
                     join E in contexto.CatalogoGeneral on I.CatalogoEstatusId equals E.IdCatalogo
                     join PR in contexto.CatalogoGeneral on I.CatalogoPrioridadId equals PR.IdCatalogo
                     where I.IdIssue == idIssue && proyectos.Contains(P.IdProyecto)
                     select new ProyectoIssueModel
                     {
                         IdIssue = I.IdIssue,
                         IdIssueProyecto = I.IdIssueProyecto,
                         Descripcion = I.Descripcion,
                         FechaDeteccion = I.FechaDeteccion,
                         FechaCompromiso = I.FechaCompromiso,
                         FechaCierre = I.FechaCierre,
                         IdUResponsable = I.IdUResponsable,
                         ResponsableExterno = I.ResponsableExterno,
                         Bloqueante = I.Bloqueante,
                         Proyecto = new ProyectosModel
                         {
                             IdProyecto = P.IdProyecto,
                             Nombre = P.Nombre,
                             Clave = P.Clave
                         },
                         Estatus = new CatalogoGeneralModel
                         {
                             IdCatalogo = E.IdCatalogo
                         },
                         Prioridad = new CatalogoGeneralModel
                         {
                             IdCatalogo = PR.IdCatalogo
                         },
                         ProyectoIssueComentario =
                            (from IC in contexto.ProyectoIssueComentario
                             join U in contexto.Usuario on IC.IdUCreo equals U.IdUsuario
                             where IC.IdIssue == I.IdIssue && IC.Activo
                             select new ProyectoIssueComentarioModel
                             {
                                 IdIssueComentario = IC.IdIssueComentario,
                                 Comentario = IC.Comentario,
                                 Autogenerado = IC.Autogenerado,
                                 FechaCreo = IC.FechaCreo,
                                 Usuario = new UsuarioModel
                                 {
                                     NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno
                                 }
                             }).ToList()
                     }).FirstOrDefault();

                return issues;
            }
        }

        public (bool Estatus, string Mensaje, long IdIssue) CrearIssue(string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var nulos = contexto.ProyectoIssue.Where(x => x.IdProyecto == null);
                var nulosComentarios = contexto.ProyectoIssueComentario.Where(x => nulos.Select(y => y.IdIssue).ToList().Contains(x.IdIssue));

                if (nulos != null) contexto.ProyectoIssueComentario.RemoveRange(nulosComentarios);
                if (nulosComentarios != null) contexto.ProyectoIssue.RemoveRange(nulos);
                contexto.SaveChanges();

                var issue = new ProyectoIssue
                {
                    IdIssueProyecto = 0,
                    Descripcion = "",
                    Bloqueante = false,
                    FechaDeteccion = DateTime.Now,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.ProyectoIssue.Add(issue);
                contexto.SaveChanges();

                var usuario = contexto.Usuario.Find(idUsuario);
                contexto.ProyectoIssueComentario.Add(new ProyectoIssueComentario
                {
                    IdIssue = issue.IdIssue,
                    Activo = true,
                    Autogenerado = true,
                    Comentario = usuario.Nombre + " " + usuario.ApPaterno + " creó el Issue.",
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                });
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito, issue.IdIssue);
            }
        }

        public (bool Estatus, string Mensaje) EditarIssue(ProyectoIssueModel _issue, string conexionEF, UsuarioModel usuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var proyectos = new CD_Proyecto().ConsultaProyectos(usuario, conexionEF);
                if (!proyectos.Select(x => x.IdProyecto).ToList().Contains(Convert.ToInt64(_issue.IdProyecto))) return (false, Mensaje.MensajeErrorDatos);

                var usuarios = new CD_Proyecto().ConsultarEquipoProyecto(Convert.ToInt64(_issue.IdProyecto), conexionEF);
                if (!usuarios.Select(x => x.IdUsuario).ToList().Contains(Convert.ToInt64(_issue.IdUResponsable)) && _issue.IdUResponsable != null && _issue.IdUResponsable > 0) return (false, Mensaje.MensajeErrorDatos);

                var duplicado = contexto.ProyectoIssue.Any(x => x.IdIssue != _issue.IdIssue && x.IdProyecto == _issue.IdProyecto && x.Descripcion == _issue.Descripcion);
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                var issue = contexto.ProyectoIssue.Find(_issue.IdIssue);

                if (issue == null) return (false, Mensaje.MensajeErrorDatos);
                if (issue.IdProyecto != _issue.IdProyecto && issue.IdProyecto != null) return (false, "No es posible cambiar el proyecto");
                if (_issue.FechaCompromiso < _issue.FechaDeteccion) return (false, "La fecha de compromiso no puede ser menor a la fecha de detección");
                if (_issue.FechaCierre < _issue.FechaDeteccion) return (false, "La fecha de cierre no puede ser menor a la fecha de detección");

                var comentarios = "";
                if (issue.CatalogoEstatusId != _issue.CatalogoEstatusId)
                {
                    var estatus = contexto.CatalogoGeneral.FirstOrDefault(x => x.IdCatalogo == _issue.CatalogoEstatusId);
                    comentarios += usuario.Nombre + " " + usuario.ApPaterno + " cambió el Estatus a " + estatus.DescLarga + ".<br />";
                }
                if (issue.FechaCompromiso != _issue.FechaCompromiso && _issue.FechaCompromiso != null)
                {
                    comentarios += "Fecha Compromiso: " + _issue.FechaCompromiso?.ToString("dd/MM/yyyy") + ".<br />";
                }
                if (issue.FechaCierre != _issue.FechaCierre && _issue.FechaCierre != null)
                {
                    comentarios += "Fecha de Cierre: " + _issue.FechaCierre?.ToString("dd/MM/yyyy") + ".<br />";
                }

                if (comentarios != "")
                {
                    contexto.ProyectoIssueComentario.Add(new ProyectoIssueComentario
                    {
                        IdIssue = issue.IdIssue,
                        Activo = true,
                        Autogenerado = true,
                        Comentario = comentarios.Substring(0, comentarios.Length - 6),
                        IdUCreo = usuario.IdUsuario,
                        FechaCreo = DateTime.Now
                    });
                }

                issue.Descripcion = _issue.Descripcion.Trim();
                issue.FechaDeteccion = _issue.FechaDeteccion;
                issue.FechaCompromiso = _issue.FechaCompromiso;
                issue.FechaCierre = _issue.FechaCierre;
                issue.CatalogoPrioridadId = _issue.CatalogoPrioridadId;
                issue.CatalogoEstatusId = _issue.CatalogoEstatusId;
                issue.IdProyecto = _issue.IdProyecto;
                issue.Bloqueante = _issue.Bloqueante;
                issue.IdUResponsable = _issue.IdUResponsable < 1 ? null : _issue.IdUResponsable;
                issue.ResponsableExterno = _issue.IdUResponsable > 1 ? null : _issue.ResponsableExterno.Trim();
                issue.IdUModifico = usuario.IdUsuario;
                issue.FechaModifico = DateTime.Now;
                contexto.SaveChanges();
                if (issue.IdIssueProyecto == 0)
                    issue.IdIssueProyecto = (contexto.ProyectoIssue.Where(x => x.IdProyecto == _issue.IdProyecto)?.Max(x => x.IdIssueProyecto) ?? 0) + 1;
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public List<ProyectoIssueComentarioModel> LeerIssueComentario(long idIssue, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var comentarios =
                    (from IC in contexto.ProyectoIssueComentario
                     join U in contexto.Usuario on IC.IdUCreo equals U.IdUsuario
                     where IC.IdIssue == idIssue && IC.Activo
                     select new ProyectoIssueComentarioModel
                     {
                         IdIssueComentario = IC.IdIssueComentario,
                         IdIssue = IC.IdIssue,
                         Comentario = IC.Comentario,
                         Autogenerado = IC.Autogenerado,
                         FechaCreo = IC.FechaCreo,
                         Usuario = new UsuarioModel
                         {
                             NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                             NumEmpleado = U.NumEmpleado
                         }
                     }).OrderBy(x => x.FechaCreo).ToList();

                return comentarios;
            }
        }

        public (bool Estatus, string Mensaje) CrearIssueComentario(ProyectoIssueComentarioModel _comentario, string conexionEF, UsuarioModel usuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var issue = contexto.ProyectoIssue.Find(_comentario.IdIssue);
                if (issue == null) return (false, Mensaje.MensajeErrorDatos);

                var proyectos = new CD_Proyecto().ConsultaProyectos(usuario, conexionEF);
                if (!proyectos.Select(x => x.IdProyecto).ToList().Contains(Convert.ToInt64(issue.IdProyecto)) && issue.IdProyecto != null) return (false, Mensaje.MensajeErrorDatos);

                var comentario = new ProyectoIssueComentario
                {
                    IdIssue = issue.IdIssue,
                    Comentario = _comentario.Comentario?.Trim(),
                    Activo = true,
                    Autogenerado = false,
                    IdUCreo = usuario.IdUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.ProyectoIssueComentario.Add(comentario);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EliminarIssueComentario(long idIssueComentario, string conexionEF, UsuarioModel usuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var issueComentario = contexto.ProyectoIssueComentario.Find(idIssueComentario);
                if (issueComentario == null) return (false, Mensaje.MensajeErrorDatos);

                var issue = contexto.ProyectoIssue.Find(issueComentario.IdIssue);

                var proyectos = new CD_Proyecto().ConsultaProyectos(usuario, conexionEF);
                if (!proyectos.Select(x => x.IdProyecto).ToList().Contains(Convert.ToInt64(issue.IdProyecto)) && issue.IdProyecto != null) return (false, Mensaje.MensajeErrorDatos);

                if (issueComentario.Autogenerado) return (false, Mensaje.MensajeErrorDatos);

                issueComentario.Activo = false;
                issueComentario.IdUElimino = usuario.IdUsuario;
                issueComentario.FechaElimino = DateTime.Now;
                contexto.SaveChanges();

                return (true, Mensaje.MensajeEliminadoExito);
            }
        }

        public List<ProyectoIssueModel> LeerIssueDescarga(List<long> _listaIssues, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaAuditorias =
                    (from I in contexto.ProyectoIssue
                     join P in contexto.Proyecto on I.IdProyecto equals P.IdProyecto
                     join E in contexto.CatalogoGeneral on I.CatalogoEstatusId equals E.IdCatalogo
                     join PR in contexto.CatalogoGeneral on I.CatalogoPrioridadId equals PR.IdCatalogo
                     where _listaIssues.Contains(I.IdIssue)
                     select new ProyectoIssueModel
                     {
                         IdIssueProyecto = I.IdIssueProyecto,
                         Proyecto = new ProyectosModel
                         {
                             Clave = P.Clave,
                             Nombre = P.Nombre
                         },
                         FechaDeteccion = I.FechaDeteccion,
                         FechaCompromiso = I.FechaCompromiso,
                         Descripcion = I.Descripcion,
                         Usuario = contexto.Usuario.Where(x => x.IdUsuario == I.IdUResponsable).Select(x => new UsuarioModel
                         {
                             NombreCompleto = x.Nombre + " " + x.ApPaterno
                         }).FirstOrDefault(),
                         ResponsableExterno = I.ResponsableExterno,
                         Estatus = new CatalogoGeneralModel
                         {
                             DescLarga = E.DescLarga
                         },
                         Prioridad = new CatalogoGeneralModel
                         {
                             DescLarga = PR.DescLarga
                         },
                         ProyectoIssueComentario =
                         contexto.ProyectoIssueComentario.Where(x => x.IdIssue == I.IdIssue && x.Activo && !x.Autogenerado).Select(x => new ProyectoIssueComentarioModel
                         {
                             FechaCreo = x.FechaCreo,
                             Comentario = x.Comentario
                         }).ToList(),
                         FechaCierre = I.FechaCierre
                     }).ToList();

                return listaAuditorias;
            }
        }
    }
}
