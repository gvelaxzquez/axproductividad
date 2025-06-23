using System;
using System.Collections.Generic;

using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class UsuarioModel
    {
        public long IdUsuario { get; set; }
        public long IdOrganizacion { get; set; }
        public string NumEmpleado { get; set; }
        public string Nombre { get; set; }
        public string ApPaterno { get; set; }
        public string ApMaterno { get; set; }
        public string Correo { get; set; }
        public int IdTipoUsuario { get; set; }
        public string DescripcionTipoUsuario { get; set; }
        public Nullable<long> IdUGerente { get; set; }
        public long DepartamentoId { get; set; }
        public string DescripcionDepartamento { get; set; }
        public Nullable<int> IntentosBloqueo { get; set; }
        public bool Activo { get; set; }
        public bool Bloqueado { get; set; }
        public int CapturaF { get; set; }
        public int Contesta { get; set; }
        public string Contrasena { get; set; }
        public string ContrasenaNueva { get; set; }
        public System.DateTime FechaContrasena { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<long> FechaModifico { get; set; }
        public string NombreCompleto { get; set; }
        public bool VerPresupuesto { get; set; }
        public Nullable<long> IdNivel { get; set; }
        public Nullable<DateTime> FechaIngreso { get; set; }
        public Nullable<DateTime> FechaCambioNivel { get; set; }

        public DateTime FechaUltCaptura { get; set; }
        public string FechaUltCapturaStr { get; set; }
        public int Cumplimiento { get; set; }

        public decimal Productividad { get; set; }
        public long IdProyectoUsuario { get; set; }

        public bool Captura { get; set; }
        public List<UsuarioAutorizacionModel> LstAurotizaciones { set; get; }

        public string FotoUrl { get; set; }
        public decimal? Objetivo { get; set; }
        public string ActivoStr { get; set; }

        public string Lider { get; set; }
        public string Nivel { get; set; }

       public string Perfil { get; set; }

        public string ConexionEF { get; set; }
        public string ConexionSP { get; set; }

        public Nullable<decimal> Participacion { get; set; }

        public decimal EstandarDiario { get; set; }
        public decimal HorasDisponibles { get; set; }
        public decimal HorasAsignadas { get; set; }
        public decimal PorcOcupacion { get; set; }
        public int CantActividades { get; set; }

        public string imgURL { get { return "/Archivos/Fotos/" + NumEmpleado + ".jpg"; } }
        public decimal CostoMensual { get; set; }
        public decimal CostoHora { get; set; }
        public decimal EstandarMes { get; internal set; }
        public decimal ProductivdadAnterior { get; internal set; }
        public decimal ProductividadActual { get; internal set; }
        public decimal ProductividadMes { get; internal set; }
        public int Dias { get; internal set; }
        public bool AdministraProy { get; set; }
        public string RespuestaF { get;  set; }
        public string RespuestaF2 { get;  set; }

        public long IdPregunta { get;  set; }
        public string Pregunta { get;  set; }
        public long IdCuenta { get;  set; }
        public int CantOrg { get;  set; }
    }
}
