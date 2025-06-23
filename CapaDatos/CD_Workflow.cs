using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using CapaDatos.Models;
using CapaDatos.DataBaseModel;
using System.Data.SqlTypes;
using DocumentFormat.OpenXml.Office2013.PowerPoint;
using DocumentFormat.OpenXml.Drawing.Wordprocessing;

namespace CapaDatos
{
    public class CD_Workflow
    {
        public List<WorkFlowModel> ConsultaFlujo ( FiltrosModel Filtros, string Conexion)
        {
			try
			{
                List<WorkFlowModel> Lst = new List<WorkFlowModel>(); 

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    Lst = contexto.WorkFlow
                           .Where(w => w.IdProyecto == Filtros.IdProyecto && w.IdActividadTipo == Filtros.Tipo)
                           .Select(s => new WorkFlowModel
                           { 
                           
                            IdWorkFlow = s.IdWorkFlow,
                            Nombre = s.Nombre,
                            Color = s.Color,
                            Orden = s.Orden,
                            ColorTexto= s.ColorTexto,
                            EstatusR= s.EstatusR,
                            TipoNotificacion = s.TipoNotificacion,
                            WIP = s.WIP,
                            Editable = s.Editable
                             

                           
                           }).OrderBy(o=> o.Orden).ToList();
                                
 


                }

                return Lst;

            }
			catch (Exception ex)
			{

				throw ex;
			}
        }


        public bool GuardarWorkFlow(long IdProyecto, byte Tipo, List<WorkFlowModel> Lst,long IdUsuario, string Conexion) {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) { 
                
                foreach(var wg in Lst)
                    {

                        var wf = contexto.WorkFlow.Where(w=> w.IdWorkFlow == wg.IdWorkFlow).FirstOrDefault();

                        if (wf != null) // Si es diferente a null existe se actualiza
                        {

                            wf.Nombre = wg.Nombre;
                            wf.Color = wg.Color;
                            wf.Orden = wg.Orden;
                            wf.EstatusR = wg.EstatusR;
                            wf.WIP= wg.WIP;
                            wf.TipoNotificacion= wg.TipoNotificacion;
                            wf.ColorTexto = wg.ColorTexto;
                            wf.IduMod = IdUsuario;
                            wf.FechaMod = DateTime.Now;



                        }
                        else { // SI no es nuevo


                            var wn = new WorkFlow();

                            wn.IdProyecto = IdProyecto;
                            wn.IdActividadTipo = Tipo;
                            wn.Nombre = wg.Nombre;
                            wn.Color = wg.Color;
                            wn.Orden = wg.Orden;
                            wn.EstatusR = wg.EstatusR;
                            wn.WIP = wg.WIP;
                            wn.TipoNotificacion = wg.TipoNotificacion;
                            wn.ColorTexto = wg.ColorTexto;
                            wn.Notifica = true;
                            wn.Editable = true;
                            wn.IdUCreo = IdUsuario;
                            wn.FechaCreo = DateTime.Now;
                            wn.IduMod = IdUsuario;
                            wn.FechaMod = DateTime.Now;


                            contexto.WorkFlow.Add(wn);
                        }


                    }

                    contexto.SaveChanges();
                }


                return true;

            }
            catch (Exception)
            {

                throw;
            }
        
        }

        public bool EliminarWorflow(long IdWorkFlow, string Conexion) {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {


                    var acts = contexto.Actividad.Where(w => w.IdWorkflow == IdWorkFlow).ToList();
                     if(acts.Count > 0)
                    {
                        return false;

                    }

                    var wf = contexto.WorkFlow.Where(w => w.IdWorkFlow == IdWorkFlow).FirstOrDefault();


                    if (wf != null)
                    {

                        contexto.WorkFlow.Remove(wf);
                    }

                    contexto.SaveChanges();
                
                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

        public List<WorkFlowModel> ConsultaEstados(long IdProyecto, long IdActividadTipo, string Conexion) {
            try
            {
                List<WorkFlowModel> Lst = new List<WorkFlowModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) { 
                

                    Lst = contexto.WorkFlow.Where(w=> w.IdProyecto == IdProyecto &&  w.IdActividadTipo == IdActividadTipo)
                        .Select(s=>  new WorkFlowModel { 
                            IdWorkFlow = s.IdWorkFlow,
                            Nombre = s.Nombre,
                            Color =  s.Color
                        
                        })
                        .ToList();
                
                
                }

                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

    }
}
