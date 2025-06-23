using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Configuration;
using System.IO;
using CapaDatos.Models;
using CapaDatos;
using System.Net;

namespace AxProductividad.Controllers
{
    public class FilesController : Controller
    {

        private readonly string _storageAccount;
        private readonly string _accessKey;
        private readonly string _containerName;
        private readonly HttpClient _httpClient;


        public FilesController()
        {
            _storageAccount = ConfigurationManager.AppSettings["StorageAccount"];
             _accessKey = "sp=rcdl&st=2025-01-15T20:07:59Z&se=2030-01-16T04:07:59Z&spr=https&sv=2022-11-02&sr=c&sig=gnzTWYyzc4wJpM6uLl9Mq5GjIQZKAFgjxAYQoiVYIE4%3D";
            _containerName = ConfigurationManager.AppSettings["ContainerName"];
            _httpClient = new HttpClient();
        }


        [HttpPost]
        public async Task<JsonResult> Upload(long IdWorkSpaceTab)
        {
            try
            {

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var file = Request.Files[0];
                if (file == null || file.ContentLength == 0)
                {
                    return Json(new { success = false, message = "No file uploaded" });
                }

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                string blobName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                string folder = Usuario.IdOrganizacion.ToString();
                string ws = IdWorkSpaceTab.ToString();

                // Construir la URL del blob
                string blobUrl = $"https://{_storageAccount}.blob.core.windows.net/{_containerName}/{folder}/Workspace/{ws}/{blobName}";

    
                string sasToken = _accessKey;

                using (var stream = file.InputStream)
                {
                    var request = new HttpRequestMessage(HttpMethod.Put, $"{blobUrl}?{sasToken}");
                    request.Content = new StreamContent(stream);
                    request.Content.Headers.Add("x-ms-blob-type", "BlockBlob");
                    request.Content.Headers.Add("Content-Type", file.ContentType);

                    var response = await _httpClient.SendAsync(request);

                    if (!response.IsSuccessStatusCode)
                    {
                        return Json(new { success = false, message = "Error uploading file" });
                    }
                }

                
                WorkSpaceTabsFileModel wfm = new WorkSpaceTabsFileModel();
                CD_Workspace cd_w = new CD_Workspace();
                wfm.IdWorkSpaceTab = IdWorkSpaceTab;
                wfm.BlobId = blobName;
                wfm.Nombre = file.FileName;
                wfm.Tipo = file.ContentType;
                wfm.Tamano = file.ContentLength;
                wfm.IdUCreo = Usuario.IdUsuario;

                bool Exito = cd_w.GuardarArchivo(wfm, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                return Json(new
                {
                    success = true,
                    message = "File uploaded successfully",
                    //file = fileInfo
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> Download(long IdWorkSpaceTab,string Nombre,  string BlobId)
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string folder = Usuario.IdOrganizacion.ToString();
                string ws = IdWorkSpaceTab.ToString();


                string blobUrl = $"https://{_storageAccount}.blob.core.windows.net/{_containerName}/{folder}/Workspace/{ws}/{BlobId}";


                var response = await _httpClient.GetAsync($"{blobUrl}?{_accessKey}");

                if (!response.IsSuccessStatusCode)
                {
                    return HttpNotFound();
                }

                var stream = await response.Content.ReadAsStreamAsync();
                var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";

                // Obtener el nombre original del archivo de tu base de datos
                string fileName = Nombre; // Reemplazar con el nombre real

                return File(stream, contentType, fileName);
            }
            catch (Exception ex)
            {
                return Content("Error: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<JsonResult> Delete(long IdWorkSpaceTab, long IdWorkSpaceTabFile,  string BlobId)
        {
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                if (BlobId != null)
                {
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

         
                    string folder = Usuario.IdOrganizacion.ToString();
                    string ws = IdWorkSpaceTab.ToString();

                    string blobUrl = $"https://{_storageAccount}.blob.core.windows.net/{_containerName}/{folder}/Workspace/{ws}/{BlobId}";
                    string sasToken = _accessKey; // 'd' para delete

                    var response = await _httpClient.DeleteAsync($"{blobUrl}?{sasToken}");

                    if (!response.IsSuccessStatusCode)
                    {
                        return Json(new { success = false, message = "File not found" });
                    }


                }

                CD_Workspace cd_w =new  CD_Workspace();

                bool exito = cd_w.EliminarArchivo(IdWorkSpaceTabFile, Encripta.DesencriptaDatos(Usuario.ConexionEF));




                return Json(new { success = true, message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> SaveUrl(long IdWorkSpaceTab, string Url, string Nombre)
        {
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                WorkSpaceTabsFileModel wfm = new WorkSpaceTabsFileModel();
                CD_Workspace cd_w = new CD_Workspace();
                wfm.IdWorkSpaceTab = IdWorkSpaceTab;
                wfm.Nombre = Nombre;
                wfm.URL = Url;
                wfm.IdUCreo = Usuario.IdUsuario;

                bool Exito = cd_w.GuardarArchivoURL(wfm, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                return Json(new
                {
                    success = true,
                    message = "File uploaded successfully",
                    //file = fileInfo
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }



    


    }
    
}
