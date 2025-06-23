using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Workspace
    {

        public string GuardarWorkspace(WorkSpaceModel W, string Conexion)
        {
            try
            {

                string g = string.Empty;
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    WorkSpace ws = new WorkSpace();

                    var gd = Guid.NewGuid();
                    ws.Nombre = W.Nombre;
                    ws.IdUnique = gd.ToString();
                    ws.Descripcion = W.Descripcion;
                    ws.IdUCreo = W.IdUCreo;
                    ws.FechaCreo = DateTime.Now;
                    ws.Activo = true;
                    ws.IdUMod = W.IdUCreo;
                    ws.FechaMod = DateTime.Now;


                    List<WorkSpaceTabs> wst = new List<WorkSpaceTabs>();
                    List<WorkSpaceTabsModel> wstmdl = new List<WorkSpaceTabsModel>();

                    wstmdl = contexto.Views.Where(w => w.Defecto == true)
                     .Select(s => new WorkSpaceTabsModel
                     {
                         Nombre = s.Nombre,
                         Parametros = "",
                         Filtros = "",
                         Tipo = s.Tipo,
                         Orden = 1,
                         Fijo = true,
                         IdUCreo = W.IdUCreo,
                         FechaCreo = DateTime.Now


                     }
                     ).ToList();

                    wst = wstmdl.Select(s => new WorkSpaceTabs
                    {
                        Nombre = s.Nombre,
                        Parametros = s.Parametros,
                        Filtros = s.Filtros,
                        Tipo = s.Tipo,
                        Orden = 1,
                        Fijo = true,
                        IdUCreo = W.IdUCreo,
                        FechaCreo = DateTime.Now

                    }).ToList();

                    ws.WorkSpaceTabs = wst;


                    // Agrego por defecto al dueño en shared

                    List<WorkSpaceShare> lstwss = new List<WorkSpaceShare>();
                    WorkSpaceShare wss = new WorkSpaceShare();
                    wss.IdUsuario = W.IdUCreo;
                    wss.IdUCreo = W.IdUCreo;
                    wss.FechaCreo = DateTime.Now;
                    lstwss.Add(wss);
                    

                    ws.WorkSpaceShare = lstwss;

                    g = ws.IdUnique.ToString();



                    contexto.WorkSpace.Add(ws);
                    contexto.SaveChanges();


                    g = ws.IdUnique.ToString();

                }

                return g;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<WorkSpaceModel> ConsultaWorkspaces(long IdUsuario, string Conexion)
        {

            try
            {
                List<WorkSpaceModel> Lst = new List<WorkSpaceModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    //Lst = contexto.WorkSpace.Where(w => w.Activo == true)
                    //     .Select(s => new WorkSpaceModel {

                    //         IdWorkSpace = s.IdWorkSpace,
                    //         Nombre = s.Nombre,
                    //         IdUnique = s.IdUnique
                    //     }).ToList();


                    Lst.AddRange(contexto.WorkSpaceShare.Where(w => w.IdUsuario == IdUsuario && w.WorkSpace.Activo == true).
                        Select(s => new WorkSpaceModel()
                        {

                            IdWorkSpace = s.IdWorkSpace,
                            Nombre = s.WorkSpace.Nombre,
                            IdUnique = s.WorkSpace.IdUnique

                        }).ToList());

                    //Lst.AddRange(contexto.Query.Where(w => w.IdUCreo == IdUsuario && w.Activo == true).
                    //      Select(s => new QueryModel()
                    //      {

                    //          IdQuery = s.IdQuery,
                    //          Nombre = s.Nombre,
                    //          IdUnique = s.IdUnique

                    //      }).ToList());

                    //Lst.AddRange(contexto.QueryShare.Where(w => w.IdUsuario == IdUsuario && w.Query.Activo == true).
                    //    Select(s => new QueryModel()
                    //    {

                    //        IdQuery = s.IdQuery,
                    //        Nombre = s.Query.Nombre,
                    //        IdUnique = s.Query.IdUnique

                    //    }).ToList());


                }


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool ValidaAccesoWorkSpace(string IdUnique, long IdUsuario, string Conexion) {
            try
            {
                WorkSpaceShare ws = new WorkSpaceShare();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    ws = contexto.WorkSpaceShare.Where(w => w.IdUsuario == IdUsuario && w.WorkSpace.IdUnique == IdUnique && w.WorkSpace.Activo== true).FirstOrDefault();


                }

                return ws == null ? false: true;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }


        public WorkSpaceModel ConsultaWorkSpace(string Id, string Conexion) {

            try
            {
                WorkSpaceModel ws = new WorkSpaceModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    ws = contexto.WorkSpace.Where(w => w.IdUnique == Id).Select(s => new WorkSpaceModel {
                        IdUnique = s.IdUnique,
                        IdWorkSpace = s.IdWorkSpace,
                        Nombre = s.Nombre,
                        Descripcion = s.Descripcion,
                        WorkSpaceTabs = s.WorkSpaceTabs.Select(sw => new WorkSpaceTabsModel {
                            IdWorkSpaceTab = sw.IdWorkSpaceTab,
                            Nombre = sw.Nombre,
                            Parametros = sw.Parametros,
                            Filtros = sw.Filtros,
                            Tipo = sw.Tipo,
                            Orden = sw.Orden
                        }).OrderBy(o=> o.Orden).ToList(),
                      

                    }).FirstOrDefault();


                }

                return ws;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public WorkSpaceModel ConsultaWorkSpaceId(long IdWorkSpace, string Conexion)
        {

            try
            {
                WorkSpaceModel ws = new WorkSpaceModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    ws = contexto.WorkSpace.Where(w => w.IdWorkSpace == IdWorkSpace).Select(s => new WorkSpaceModel
                    {
                        IdUnique = s.IdUnique,
                        IdWorkSpace = s.IdWorkSpace,
                        Nombre = s.Nombre,
                        Descripcion = s.Descripcion,
                        WorkSpaceTabs = s.WorkSpaceTabs.Select(sw => new WorkSpaceTabsModel
                        {
                            IdWorkSpaceTab = sw.IdWorkSpaceTab,
                            Nombre = sw.Nombre,
                            Parametros = sw.Parametros,
                            Filtros = sw.Filtros,
                            Tipo = sw.Tipo,
                            Orden = sw.Orden
                        }).OrderBy(o => o.Orden).ToList(),


                    }).FirstOrDefault();


                }

                return ws;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<WorkSpaceModel> ConsultaWorkSpaceList(long IdUsuario, string Conexion)
        {

            try {


                List<WorkSpaceModel> Lst = new List<WorkSpaceModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {



                    Lst.AddRange(contexto.WorkSpaceShare.Where(w => w.IdUsuario == IdUsuario && w.WorkSpace.Activo == true).
                        Select(s => new WorkSpaceModel()
                        {

                            IdWorkSpace = s.IdWorkSpace,
                            Nombre = s.WorkSpace.Nombre,
                            IdUnique = s.WorkSpace.IdUnique,
                            Propietario = s.IdUCreo == IdUsuario ? true: false,
                            Descripcion = s.WorkSpace.Descripcion

                        }).ToList());



                }


                return Lst;



            }




            catch (Exception ex)
            {

                throw ex;
            }

        }


        public WorkSpaceTabsModel ConsultaWorkSpaceTab(long IdWorkSpaceTab, string Conexion)
        {

            try
            {
                WorkSpaceTabsModel ws = new WorkSpaceTabsModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var www = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpaceTab == IdWorkSpaceTab).FirstOrDefault();

                    ws = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpaceTab == IdWorkSpaceTab).Select(s => new WorkSpaceTabsModel {

                        IdWorkSpaceTab = s.IdWorkSpaceTab,
                        Nombre = s.Nombre,
                        Parametros = s.Parametros,
                        Filtros = s.Filtros,
                        Widgets= s.Widgets,
                        LayoutConfig= s.LayoutConfig,
                        NextId=s.NextId,
                        Tipo = s.Tipo,
                        Orden = s.Orden,
                        Agrupador = s.Agrupador,
                        Columnas= s.Columnas


                    }
                    ).FirstOrDefault();


                }

                return ws;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool GuardaFiltrosTab(long IdWorkSpaceTab, string Filtros, string Conexion) {
            try
            {


                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {

                    var wst = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpaceTab == IdWorkSpaceTab).FirstOrDefault();
                    wst.Filtros = Filtros;

                    contexto.SaveChanges();



                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ViewsModel> ConsultaVistasDisponibles(string Conexion)
        {

            try
            {

                List<ViewsModel> Lst = new List<ViewsModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.Views.Select(s => new ViewsModel {
                        Nombre = s.Nombre,
                        Tipo = s.Tipo,
                        Icono = s.Icono,
                        Defecto = s.Defecto,
                        IdView = s.IdView


                    }).ToList();

                }


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }



        }
        public List<WidgetModel> ConsultaWidgetsDisponibles(string Conexion)
        {

            try
            {

                List<WidgetModel> Lst = new List<WidgetModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.Widget.Where(w=> w.Activo == true).Select(s => new WidgetModel
                    {
                        IdWidget= s.IdWidget,
                        type= s.type,
                        defaultTitle= s.defaultTitle,
                        group = s.group,
                        Descripcion = s.Descripcion
                    }).ToList();

                }


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }



        }

        public bool ActualizaNombreWs(WorkSpaceModel ws, string Conexion) {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var wsp = contexto.WorkSpace.Where(w => w.IdWorkSpace == ws.IdWorkSpace).FirstOrDefault();

                    wsp.Nombre = ws.Nombre;
                    wsp.IdUMod = ws.IdUMod;
                    wsp.FechaMod = DateTime.Now;

                    contexto.SaveChanges();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public WorkSpaceTabsModel AgregarTabWorkspace(WorkSpaceTabsModel ww, long IdUsuario, string Conexion) {

            try
            {
                WorkSpaceTabsModel wm = new WorkSpaceTabsModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var vista = contexto.Views.Where(w => w.IdView == ww.IdView).FirstOrDefault();
                    var tabs = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpace == ww.IdWorkSpace).ToList();



                    WorkSpaceTabs wst = new WorkSpaceTabs();

                    wst.IdWorkSpace = ww.IdWorkSpace;
                    wst.Nombre = vista.Nombre + " " + (tabs.Where(w => w.Tipo == vista.Tipo).Count() + 1).ToString();
                    wst.Tipo = vista.Tipo;
                    wst.Parametros = "";
                    wst.Filtros = "";
                    wst.Orden = (tabs.Count() + 1);
                    wst.Fijo = false;
                    wst.IdUCreo = IdUsuario;
                    wst.FechaCreo = DateTime.Now;

                    contexto.WorkSpaceTabs.Add(wst);
                    contexto.SaveChanges();

                    wm.IdWorkSpace = wst.IdWorkSpace;
                    wm.IdWorkSpaceTab = wst.IdWorkSpaceTab;
                    wm.Tipo = wst.Tipo;
                    wm.Nombre = wst.Nombre;
                    wm.Parametros = wst.Parametros;
                    wm.Filtros = wst.Filtros;
                    wm.Orden = wst.Orden;
                    wm.Fijo = wst.Fijo;
                    wm.IdUCreo = wst.IdUCreo;
                    wm.FechaCreo = wst.FechaCreo;

                }

                return wm;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public List<WorkSpaceShareModel> ConsultaUsuariosWS(long IdWorkSpace, string Conexion) {
            try
            {
                List<WorkSpaceShareModel> Lst = new List<WorkSpaceShareModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion)) { 
                
                 Lst = contexto.WorkSpaceShare.Where(w=> w.IdWorkSpace == IdWorkSpace)
                       .Select(s=> new WorkSpaceShareModel { 
                         IdWorkSpaceShare= s.IdWorkSpaceShare,
                         IdUsuario = s.IdUsuario,
                         Nombre = s.Usuario.Nombre +  " " + s.Usuario.ApPaterno,
                         NumEmpleado = s.Usuario.NumEmpleado
                       
                       }).ToList();

                
                }

                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

        public long GuardaWorkSpaceShare(WorkSpaceShareModel ws, string Conexion)
        {
            try
            {

                long IdWorkSpaceShare = 0 ;
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var existe = contexto.WorkSpaceShare.Where(we=> we.IdWorkSpace == ws.IdWorkSpace && we.IdUsuario == ws.IdUsuario).FirstOrDefault();

                    if (existe != null)
                    {
                        IdWorkSpaceShare = 0;

                    }
                    else {

                        WorkSpaceShare w = new WorkSpaceShare();
                        w.IdWorkSpace = ws.IdWorkSpace;
                        w.IdUsuario = ws.IdUsuario;
                        w.IdUCreo = ws.IdUCreo;
                        w.FechaCreo = DateTime.Now;

                        contexto.WorkSpaceShare.Add(w);


                        contexto.SaveChanges();

                        IdWorkSpaceShare = w.IdWorkSpaceShare;
                    }
               

                }

                return IdWorkSpaceShare;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public bool EliminaWorkSpaceShare(long IdWorkSpaceShare, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    WorkSpaceShare ws = contexto.WorkSpaceShare.Where(w => w.IdWorkSpaceShare == IdWorkSpaceShare).FirstOrDefault();

                    if (ws != null)
                    {
                        contexto.WorkSpaceShare.Remove(ws);

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

        public bool EliminaWorkSpace(long IdWorkSpace,long IdUsuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    WorkSpace ws = contexto.WorkSpace.Where(w => w.IdWorkSpace == IdWorkSpace).FirstOrDefault();

                    if (ws != null)
                    {
                        ws.Activo = false;
                        ws.IdUMod = IdUsuario;
                        ws.FechaMod = DateTime.Now;
      

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



        public bool ActualizaNombreTab(WorkSpaceTabsModel ws, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var wsp = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpaceTab == ws.IdWorkSpaceTab).FirstOrDefault();

                    wsp.Nombre = ws.Nombre;

                    contexto.SaveChanges();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool ActualizarOrdenTabs(List<WorkSpaceTabsModel> Lst, string Conexion) {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {


                    foreach (var i in Lst) { 
                    
                    var wst  = contexto.WorkSpaceTabs.Where(w=> w.IdWorkSpaceTab == i.IdWorkSpaceTab).FirstOrDefault();

                      if (wst != null)
                        {

                            wst.Orden = i.Orden;
                        }
                    
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

        public bool ActualizarAgrupadorTab(WorkSpaceTabsModel ws, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                 
                    var wst = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpaceTab == ws.IdWorkSpaceTab).FirstOrDefault();

                    if (wst != null)
                    {

                        wst.Agrupador = ws.Agrupador;
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

        public bool ActualizarColumnasTab(WorkSpaceTabsModel ws, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {



                    var wst = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpaceTab == ws.IdWorkSpaceTab).FirstOrDefault();

                    if (wst != null)
                    {

                        wst.Columnas = ws.Columnas;
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

      
        public bool EliminarTab(long IdWorkSpaceTab, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    var wst = contexto.WorkSpaceTabs.Where(w=> w.IdWorkSpaceTab== IdWorkSpaceTab).FirstOrDefault();
                    if (wst != null) {


                        contexto.WorkSpaceTabs.Remove(wst);
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
        public bool ActualizarPanelWidgets(WorkSpaceTabsModel ws, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {



                    var wst = contexto.WorkSpaceTabs.Where(w => w.IdWorkSpaceTab == ws.IdWorkSpaceTab).FirstOrDefault();

                    if (wst != null)
                    {

                        wst.Widgets = ws.Widgets;
                        wst.LayoutConfig = ws.LayoutConfig;
                        wst.NextId = ws.NextId;
                        ws.IdUMod= ws.IdUMod;
                        ws.FechaMod = ws.FechaMod;
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

        public bool GuardarArchivo(WorkSpaceTabsFileModel file, string Conexion) {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) { 
                
                WorkSpaceTabsFile f = new WorkSpaceTabsFile();

                    f.IdWorkSpaceTab = file.IdWorkSpaceTab;
                    f.BlobId = file.BlobId;
                    f.Nombre = file.Nombre;
                    f.Tipo = file.Tipo;
                    f.Tamano = file.Tamano;
                    f.IdUCreo = file.IdUCreo;
                    f.FechaCreo = DateTime.Now;

                    contexto.WorkSpaceTabsFile.Add(f);

                    contexto.SaveChanges();
                
                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

        public bool GuardarArchivoURL(WorkSpaceTabsFileModel file, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    WorkSpaceTabsFile f = new WorkSpaceTabsFile();

                    f.IdWorkSpaceTab = file.IdWorkSpaceTab;
                    f.Nombre = file.Nombre;
                    f.URL = file.URL;
                    f.IdUCreo = file.IdUCreo;
                    f.FechaCreo = DateTime.Now;

                    contexto.WorkSpaceTabsFile.Add(f);

                    contexto.SaveChanges();

                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<WorkSpaceTabsFileModel> ConsultaArchivos(long IdWorkSpaceTab, string Conexion)
        {
            try
            {
                List<WorkSpaceTabsFileModel> Lst = new List<WorkSpaceTabsFileModel>(); 
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {



                    Lst = contexto.WorkSpaceTabsFile.Where(w => w.IdWorkSpaceTab == IdWorkSpaceTab)
                        .Select(s => new WorkSpaceTabsFileModel 
                        {
                            IdWorkSpaceTabFile = s.IdWorkSpaceTabFile,
                            BlobId= s.BlobId,
                            Nombre = s.Nombre == null ? s.URL : s.Nombre ,
                            URL = s.URL,
                            Tipo = s.Tipo == null ? "web" : s.Tipo,
                            Tamano  = s.Tamano,
                            Creo = s.Usuario.Nombre  +  " " + s.Usuario.ApPaterno,
                            IdUCreo = s.IdUCreo,
                            FechaCreo = DateTime.Now
                        }).ToList();

         

                }
                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool EliminarArchivo(long IdWorkSpaceTabFile, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    WorkSpaceTabsFile f = contexto.WorkSpaceTabsFile.Where(w => w.IdWorkSpaceTabFile == IdWorkSpaceTabFile).FirstOrDefault();

                    if(f!= null)
                    {

                        contexto.WorkSpaceTabsFile.Remove(f);
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




    }
}

