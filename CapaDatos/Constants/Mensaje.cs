using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models.Constants
{
    public class Mensaje
    {
        public const string MensajeGuardadoExito = "Los datos se guardaron correctamente";
        public const string MensajeEliminadoExito = "Los datos se eliminaron correctamente";
        public const string MensajeErrorDatos = "Datos incorrectos";
        public const string MensajeErrorDuplicado = "No puede haber dos registros repetidos.";
        public const string MensajeNoEncontrado = "No se encontro el registro.";
    }
}
