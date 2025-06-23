using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;

namespace CapaDatos
{
    public class CD_Configuracion
    {

        public ConfiguracionModel ObtenerConfiguracion(string Conexion)
        {
            try
            {
                ConfiguracionModel conf = new ConfiguracionModel();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var LstConf = contexto.Configuracion.ToList();


                    conf.MailServidor = LstConf.Where(i => i.IdConf == 1).Select(o => o.Valor).FirstOrDefault();
                    conf.MailPuerto = LstConf.Where(i => i.IdConf == 2).Select(o => o.Valor).FirstOrDefault();
                    conf.MailUsuario = LstConf.Where(i => i.IdConf == 3).Select(o => o.Valor).FirstOrDefault();
                    conf.MailContrasena = LstConf.Where(i => i.IdConf == 4).Select(o => o.Valor).FirstOrDefault();
                    conf.MailRemitente = LstConf.Where(i => i.IdConf == 5).Select(o => o.Valor).FirstOrDefault();
                    conf.MailSSL = Convert.ToBoolean(LstConf.Where(i => i.IdConf == 6).Select(o => o.Valor).FirstOrDefault());

                    conf.Intentos = Convert.ToInt32(LstConf.Where(i => i.IdConf == 7).Select(o => o.Valor).FirstOrDefault());
                    conf.Vigencia = Convert.ToInt32(LstConf.Where(i => i.IdConf == 8).Select(o => o.Valor).FirstOrDefault());
                    conf.Caracteresmin = Convert.ToInt32(LstConf.Where(i => i.IdConf == 9).Select(o => o.Valor).FirstOrDefault());
                    conf.LDAP = LstConf.Where(i => i.IdConf == 32).Select(o => o.Valor).FirstOrDefault();

                    conf.CompensacionCumplimiento = Convert.ToDecimal(LstConf.Where(i => i.IdConf == 10).Select(o => o.Valor).FirstOrDefault());
                    conf.CompensacionHoras = Convert.ToDecimal(LstConf.Where(i => i.IdConf == 11).Select(o => o.Valor).FirstOrDefault());
                    conf.VigenciaTareas = Convert.ToInt32(LstConf.Where(i => i.IdConf == 13).Select(o => o.Valor).FirstOrDefault());
                    conf.DiasProceso = Convert.ToInt32(LstConf.Where(i => i.IdConf == 14).Select(o => o.Valor).FirstOrDefault());

                    conf.ProyectoMejora = LstConf.FirstOrDefault(x => x.IdConf == Constants.Configuracion.ProyectoMejora)?.Valor;

                    conf.ActivaAsistencia = Convert.ToBoolean(LstConf.Where(i => i.IdConf == 27).Select(o => o.Valor).FirstOrDefault());
                    conf.HoraEntrada = LstConf.Where(i => i.IdConf == 23).Select(o => o.Valor).FirstOrDefault();
                    conf.Tolerancia = Convert.ToInt32(LstConf.Where(i => i.IdConf == 24).Select(o => o.Valor).FirstOrDefault());
                    conf.TiempoComida = Convert.ToInt32(LstConf.Where(i => i.IdConf == 26).Select(o => o.Valor).FirstOrDefault());
                    conf.Jornada = Convert.ToDecimal(LstConf.Where(i => i.IdConf == 25).Select(o => o.Valor).FirstOrDefault());

                    conf.TipoMeta = LstConf.Where(i => i.IdConf == 28).Select(o => o.Valor).FirstOrDefault() == "1" ? true : false; ;
                    conf.IndFinancieros = Convert.ToBoolean(LstConf.Where(i => i.IdConf == 33).Select(o => o.Valor).FirstOrDefault());
                    conf.PreguntaSeguimiento = Convert.ToBoolean(LstConf.Where(i => i.IdConf == 34).Select(o => o.Valor).FirstOrDefault());

             

                }

                return conf;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public string ObtenerConfiguracionID(int IdConf, string Conexion)
        {
            try
            {
                string Valor = string.Empty;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;
                    Valor = contexto.Configuracion.Where(x => x.IdConf == IdConf).Select(c => c.Valor).FirstOrDefault().ToString();
                }
                return Valor;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool GuardaDatosCorreo(ConfiguracionModel configuracion, string Conexion)
        {
            try
            {
                bool exito;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    List<Configuracion> Lstconf = contexto.Configuracion.ToList();

                    foreach (var conf in Lstconf)
                    {

                        switch (conf.IdConf)
                        {
                            case 1:
                                conf.Valor = configuracion.MailServidor;
                                break;
                            case 2:
                                conf.Valor = configuracion.MailPuerto;
                                break;
                            case 3:
                                conf.Valor = configuracion.MailUsuario;
                                break;
                            case 4:
                                conf.Valor = configuracion.MailContrasena;
                                break;
                            case 5:
                                conf.Valor = configuracion.MailRemitente;
                                break;
                            case 6:
                                conf.Valor = configuracion.MailSSL == true ? "true" : "false";
                                break;

                        }
                    }


                    contexto.SaveChanges();
                    exito = true;

                }



                return exito;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool GuardaDatosContrasenia(ConfiguracionModel configuracion, string Conexion)
        {
            try
            {
                bool exito;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    List<Configuracion> Lstconf = contexto.Configuracion.ToList();

                    foreach (var conf in Lstconf)
                    {

                        switch (conf.IdConf)
                        {
                            case 7:
                                conf.Valor = configuracion.Intentos.ToString();
                                break;
                            case 8:
                                conf.Valor = configuracion.Vigencia.ToString();
                                break;
                            case 9:
                                conf.Valor = configuracion.Caracteresmin.ToString();
                                break;
                            case 32:
                                conf.Valor = configuracion.LDAP.ToString();
                                break;

                        }
                    }

                    contexto.SaveChanges();
                    exito = true;

                }



                return exito;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool GuardaDatosCompensacion(ConfiguracionModel configuracion, string Conexion)
        {
            try
            {
                bool exito;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    List<Configuracion> Lstconf = contexto.Configuracion.ToList();

                    foreach (var conf in Lstconf)
                    {

                        switch (conf.IdConf)
                        {
                            case 10:
                                conf.Valor = configuracion.CompensacionCumplimiento.ToString();
                                break;
                            case 11:
                                conf.Valor = configuracion.CompensacionHoras.ToString();
                                break;
                            case 13:
                                conf.Valor = configuracion.VigenciaTareas.ToString();
                                break;
                            case 14:
                                conf.Valor = configuracion.DiasProceso.ToString();
                                break;

                        }
                    }

                    contexto.SaveChanges();
                    exito = true;

                }



                return exito;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool GuardaDatosAsistencia(ConfiguracionModel configuracion, string Conexion)
        {
            try
            {
                bool exito;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    List<Configuracion> Lstconf = contexto.Configuracion.ToList();

                    foreach (var conf in Lstconf)
                    {

                        switch (conf.IdConf)
                        {
                            case 23:
                                conf.Valor = configuracion.HoraEntrada;
                                break;
                            case 24:
                                conf.Valor = configuracion.Tolerancia.ToString();
                                break;
                            case 25:
                                conf.Valor = configuracion.Jornada.ToString();
                                break;
                            case 26:
                                conf.Valor = configuracion.TiempoComida.ToString();
                                break;
                            case 27:
                                conf.Valor = configuracion.ActivaAsistencia == true ? "true" : "false";
                                break;
                            case 28:
                                conf.Valor = configuracion.TipoMeta == true ? "1" : "0";
                                break;
                            case 33:
                                conf.Valor = configuracion.IndFinancieros == true ? "true" : "false";
                                break;
                            case 34:
                                conf.Valor = configuracion.PreguntaSeguimiento == true ? "true" : "false";
                                break;
                        }

                        
                    }


                    contexto.SaveChanges();
                    exito = true;

                }



                return exito;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public (bool Estatus, string Mensaje) GuardarDatosProyecto(long idProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                var conf = contexto.Configuracion.SingleOrDefault(x => x.IdConf == Constants.Configuracion.ProyectoMejora);

                if (conf != null)
                {
                    conf.Valor = idProyecto.ToString();
                    contexto.SaveChanges();

                    return (true, Mensaje.MensajeGuardadoExito);
                }

                return (false, "Debe agregar la configuracion de proyecto de mejora continua");
            }
        }
    }
}
