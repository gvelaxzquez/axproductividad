using System;
using System.Collections.Generic;
using System.Linq;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System.Data;


namespace CapaDatos
{
   public class CD_Niveles
    {

        public List<NivelesModel> ConsultaLista(string Conexion) {
            try
            {
                List<NivelesModel> LstNivelesModel = new List<NivelesModel>();

                using (var context = new BDProductividad_DEVEntities(Conexion)) {

                    context.Configuration.LazyLoadingEnabled = true;

                    LstNivelesModel = context.Niveles.Select(s => new NivelesModel() {
                        IdNivel = s.IdNivel,
                        Nombre = s.Nivel,
                        FactorCumplimiento = s.FactorCumplimiento,
                        FactorHoras = s.FactorHoras,
                        EstandarDiario = s.EstandarDiario,
                        Activo = s.Activo

                    }).ToList();
                }

                return LstNivelesModel;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int AltaEdicionNivel(NivelesModel Nivel, string Conexion) {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {



                    //Registro nuevo
                    if (Nivel.IdNivel == 0)
                    {

                        var existe = contexto.Niveles.Where(w => w.Nivel.ToUpper() == Nivel.Nombre.ToUpper()).FirstOrDefault();

                        if (existe != null) {

                            return 2;
                        }

                        Niveles n = new Niveles();

                        n.Nivel = Nivel.Nombre;
                        n.FactorCumplimiento = Nivel.FactorCumplimiento;
                        n.FactorHoras = Nivel.FactorHoras;
                        n.Estandar = 0;
                        n.EstandarDiario = Nivel.EstandarDiario;
                        n.SemanasEstabilizacion = 0;
                        n.Activo = Nivel.Activo;
                        n.IdUCreo = Nivel.IdUCreo;
                        n.FechaCreo = DateTime.Now;

                        contexto.Niveles.Add(n);

                    }
                    //Edición
                    else {


                        var existe = contexto.Niveles.Where(w => w.Nivel.ToUpper() == Nivel.Nombre.ToUpper() && w.IdNivel != Nivel.IdNivel).FirstOrDefault();

                        if (existe != null)
                        {

                            return 2;
                        }

                        Niveles n = contexto.Niveles.Where(w => w.IdNivel == Nivel.IdNivel).FirstOrDefault();

                        if (n != null) {

                            n.Nivel = Nivel.Nombre;
                            n.FactorCumplimiento = Nivel.FactorCumplimiento;
                            n.FactorHoras = Nivel.FactorHoras;
                            n.Estandar = 0;
                            n.EstandarDiario = Nivel.EstandarDiario;
                            n.SemanasEstabilizacion = 0;
                            n.Activo = Nivel.Activo;
                            n.IdUCreo = Nivel.IdUCreo;
                            n.FechaCreo = DateTime.Now;
                        }

                    }

                    contexto.SaveChanges();


                }

                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        

        public NivelesHorasModel ConsultaHorasMes (NivelesHorasModel Nivel, string Conexion)
        {
            try
            {
                NivelesHorasModel n = new NivelesHorasModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    var nh = contexto.NivelesHoras.Where(w => w.IdAnio == Nivel.IdAnio && w.IdNivel == Nivel.IdNivel).FirstOrDefault();


                    if (nh != null)
                    {

                        n.IdNivelHoras = nh.IdNivelHoras;
                        n.Enero = nh.Enero;
                        n.Febrero = nh.Febrero;
                        n.Marzo = nh.Marzo;
                        n.Abril = nh.Abril;
                        n.Mayo = nh.Mayo;
                        n.Junio = nh.Junio;
                        n.Julio = nh.Julio;
                        n.Agosto = nh.Agosto;
                        n.Septiembre = nh.Septiembre;
                        n.Octubre = nh.Octubre;
                        n.Noviembre = nh.Noviembre;
                        n.Diciembre = nh.Diciembre;

                    }

                    else
                    {
                        n.IdNivelHoras = 0;
                        n.IdNivelHoras = 0;
                        n.Enero = 0;
                        n.Febrero = 0;
                        n.Marzo = 0;
                        n.Abril = 0;
                        n.Mayo = 0;
                        n.Junio = 0;
                        n.Julio = 0;
                        n.Agosto = 0;
                        n.Septiembre = 0;
                        n.Octubre = 0;
                        n.Noviembre = 0;
                        n.Diciembre = 0;

                    }

                }


                return n;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        public bool GuardaHorasMes (NivelesHorasModel  Nivel, string Conexion)
        {

            try
            {

                using(var contexto =new BDProductividad_DEVEntities(Conexion))
                {


                    var n = contexto.NivelesHoras.Where(w => w.IdNivelHoras == Nivel.IdNivelHoras).FirstOrDefault();

                    if (n != null)
                    {
                        n.Enero = Nivel.Enero;
                        n.Febrero = Nivel.Febrero;
                        n.Marzo = Nivel.Marzo;
                        n.Abril = Nivel.Abril;
                        n.Mayo = Nivel.Mayo;
                        n.Junio = Nivel.Junio;
                        n.Julio = Nivel.Julio;
                        n.Agosto = Nivel.Agosto;
                        n.Septiembre = Nivel.Septiembre;
                        n.Octubre = Nivel.Octubre;
                        n.Noviembre = Nivel.Noviembre;
                        n.Diciembre = Nivel.Diciembre;
                        n.IdUMod = Nivel.IdUCreo;
                        n.FechaMod = DateTime.Now; 

                    }
                    else
                    {

                        NivelesHoras nivel = new NivelesHoras();
                        nivel.Enero = Nivel.Enero;
                        nivel.Febrero = Nivel.Febrero;
                        nivel.Marzo = Nivel.Marzo;
                        nivel.Abril = Nivel.Abril;
                        nivel.Mayo = Nivel.Mayo;
                        nivel.Junio = Nivel.Junio;
                        nivel.Julio = Nivel.Julio;
                        nivel.Agosto = Nivel.Agosto;
                        nivel.Septiembre = Nivel.Septiembre;
                        nivel.Octubre = Nivel.Octubre;
                        nivel.Noviembre = Nivel.Noviembre;
                        nivel.Diciembre = Nivel.Diciembre;
                        nivel.IdNivel = Nivel.IdNivel;
                        nivel.IdAnio = Nivel.IdAnio;
                        nivel.IdUCreo = Nivel.IdUCreo;
                        nivel.FechaCreo = DateTime.Now;

                        contexto.NivelesHoras.Add(nivel);


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
