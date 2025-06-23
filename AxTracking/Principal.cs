using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;
using CapaDatos.Models;
using System.Windows.Forms;
using System.Configuration;

namespace AxTracking
{
    public partial class SISPRO : Form
    {
        List<ActividadTrackingModel> LstTracking = new List<ActividadTrackingModel>();
        long IdActividadG = 0;
        public SISPRO()
        {
            InitializeComponent();
            this.LblNombreUsuario.Text = "Bienvenido: " + ClasesAuxiliares.Sesion.User.NombreCompleto;
        }

        private void Principal_Load(object sender, EventArgs e)
        {

            try
            {
                InicializaActividades();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

        }


        #region Eventos
        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            Login login = new Login();
            this.Hide();
            login.Show();
        }
        private void BtnTerminar_Click(object sender, EventArgs e)
        {
            try
            {

                var result = MessageBox.Show("¿Está seguro que desea finalizar la tarea?", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.YesNo);

                if (result == DialogResult.Yes)
                {
                    CD_Actividad cd_act = new CD_Actividad();
                    bool Exito = cd_act.CambiaEstatusActividad("R", "Solictó revisión", IdActividadG, ClasesAuxiliares.Sesion.User.IdUsuario, "");

                    if (Exito)
                    {
                        InicializaActividades();
                        MessageBox.Show("La tarea ha sido enviada a revisión", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    }


                }
            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message, ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        private void VerActividad(object sender, EventArgs e)
        {
            try
            {

                Control ctrl = (Control)sender;
                ctrl.Parent.BackColor = System.Drawing.Color.DarkGray;
                long IdActividad = long.Parse(ctrl.Name.ToString());
                IdActividadG = IdActividad;

                CargaActividad();
                CargaFases();

                gpxActividad.Visible = true;

            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message, ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

        }

        private void Tracking(object sender, EventArgs e)
        {

            try
            {

                Control ctrl = (Control)sender;
                string te = ctrl.Name.Replace("BtnRecord", "").Trim();
                long IdActividadT = long.Parse(ctrl.Name.Replace("BtnRecord", "").Trim());
                ActividadTrackingModel a = LstTracking.Where(w => w.IdActividadTracking == IdActividadT).FirstOrDefault();
                TrackWindow t = new TrackWindow(IdActividadG, IdActividadT, a.Nombre, a.Trabajado.ToString("hh\\:mm\\:ss"));
                t.ShowDialog();
                CargaActividad();
                CargaFases();

            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message, ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

        }
        private void FinalizaFase(object sender, EventArgs e)
        {

            try
            {

                var result = MessageBox.Show("¿Está seguro que desea finalizar la fase?", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.YesNo);

                if (result == DialogResult.Yes)
                {
                    Control ctrl = (Control)sender;

                    long IdActividadT = long.Parse(ctrl.Name.Replace("BtnFinalizar", "").Trim());
                    CD_Actividad cd_act = new CD_Actividad();
                    string conexion = ConfigurationSettings.AppSettings["BDProductividad"].ToString();

                    int Respuesta = cd_act.FinalizaFaseActividad(IdActividadT, conexion);

                    if (Respuesta == 1)
                    {
                        MessageBox.Show("Se finalizó la fase.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Information);
                        CargaFases();
                        return;

                    }
                    else if (Respuesta == 2)
                    {
                        MessageBox.Show("Se deben finalizar las fases anteriores primero.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                        return;
                    }
                    else if (Respuesta == 3)
                    {

                        MessageBox.Show("No se ha capturado tiempo para la fase.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                        return;
                    }
                }

            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message, ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

        }
        #endregion


        #region Metodos

        private void InicializaActividades()
        {
            try
            {
                FiltrosModel Filtros = new FiltrosModel();
                Filtros.IdUsuario = ClasesAuxiliares.Sesion.User.IdUsuario;

                List<string> LstEstatus = new List<string>();
                List<long> LstTipoActividad = new List<long>();
                List<long> LstClasificacion = new List<long>();
                List<long> LstResponsable = new List<long>();
                List<long> LstPrioridad = new List<long>();
                List<long> LstProyectos = new List<long>();
                List<long> LstAsignados = new List<long>();
                List<long> LstSprints = new List<long>();


                LstEstatus.Add("A");
                LstEstatus.Add("P");

                Filtros.LstEstatus = LstEstatus;
                Filtros.LstTipoActividad = LstTipoActividad;
                Filtros.LstClasificacion = LstClasificacion;
                Filtros.LstResponsable = LstResponsable;
                Filtros.LstPrioridad = LstPrioridad;
                Filtros.LstSprints = LstSprints;
                Filtros.LstProyecto = LstProyectos;
                Filtros.LstAsignado = LstAsignados;


                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadesLogModel> LstActividadesLog = new List<ActividadesLogModel>();


                string conexion = ConfigurationSettings.AppSettings["BDProductividad"].ToString(); //  .ConnectionStrings["BDProductividad"].ToString();

                //cd_act.ObtieneActividades(Filtros, ref LstActividades, ref LstActividadesLog, conexion);
                flActividades.Controls.Clear();

                LstActividades = LstActividades.OrderBy(o => o.FechaSolicitado).ToList();
                foreach (var a in LstActividades)
                {
                    Controles.Card card = new Controles.Card();
                    foreach (Control c in card.Controls)
                    {

                        //c.Name = a.IdActividad.ToString();
                        //c.Click += new EventHandler(VerActividad);
                        if (c.Name == "LblIdActividad")
                        {

                            c.Text = "#" + a.IdActividad.ToString();
                        }
                        if (c.Name == "LblProyecto")
                        {

                            c.Text = a.ProyectoStr;
                        }
                        if (c.Name == "LblDescripcion")
                        {

                            c.Text = a.Descripcion;
                        }
                        if (c.Name == "LblTiempo")
                        {

                            c.Text = a.HorasAsignadas.ToString();
                        }
                        if (c.Name == "LblFecha")
                        {

                            c.Text = DateTime.Parse(a.FechaSolicitado.ToString()).ToShortDateString();
                        }
                        if (c.Name == "btnVerActividad")
                        {

                            c.Name = a.IdActividad.ToString();
                            c.Click += new EventHandler(VerActividad);
                        }
                    }
                    //card.Name= a.IdActividad.ToString();
                    //card.Click += new EventHandler(VerActividad);
                    flActividades.Controls.Add(card);


                }

                this.gpxActividad.Visible = false;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        private void CargaFases() {
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                string conexion = ConfigurationSettings.AppSettings["BDProductividad"].ToString();
                LstTracking = cd_act.ConsultaTrackingActividad(IdActividadG, conexion);

                flFases.Controls.Clear();

                Controles.FaseHEAD faseh = new Controles.FaseHEAD();

                flFases.Controls.Add(faseh);

                foreach (var t in LstTracking)
                {
                    Controles.Fase fase = new Controles.Fase();
                    foreach (Control c in fase.Controls[0].Controls)
                    {

                        if (c.Name == "LblFase")
                        {

                            c.Text = t.Nombre;
                        }
                        if (c.Name == "LblTiempo")
                        {

                            c.Text = t.TiempoAsignadoMin;
                        }
                        if (c.Name == "LblTrabajado")
                        {

                            c.Text = t.Trabajado.ToString("hh\\:mm\\:ss");
                        }

                        if (c.Name == "BtnRecord")
                        {

                            //if (t.Finalizado)
                            //{

                            //    c.Visible = false;
                            //}
                            c.Name = "BtnRecord" + t.IdActividadTracking.ToString();

                            c.Click += new EventHandler(Tracking);

                        }

                        if (c.Name == "BtnFinalizar")
                        {

                            if (t.Finalizado)
                            {

                                c.Visible = false;
                            }
                            c.Name = "BtnFinalizar" + t.IdActividadTracking.ToString();

                            c.Click += new EventHandler(FinalizaFase);
                        }

                    }

                    flFases.Controls.Add(fase);
                }


                //Si todas las fases estan terminadas se puede marcar como terminado
                if (LstTracking.Where(w => w.Finalizado == false).Count() == 0)
                {

                    this.BtnTerminar.Visible = true;
                }
                else {
                    this.BtnTerminar.Visible = false;
                }

            }
            catch (Exception ex)
            {

                
            }

        }

        private void CargaActividad() {
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                ActividadesModel actividad = new ActividadesModel();

                actividad = cd_act.ConsultaActividad(IdActividadG, 1, "");
                this.LblIdActividad.Text = "#" + actividad.IdActividad;
                this.LblBR.Text = actividad.BR;
                this.LblNomProyecto.Text = actividad.ProyectoStr;
                this.LblSprint.Text = actividad.Sprint;
                this.LblHorasAsignadas.Text = decimal.Parse(actividad.HorasAsignadas.ToString()).ToString("0.00");
                this.LblHorasT.Text = actividad.HorasFinales.ToString("0.00");
                this.LblFechaIni.Text = DateTime.Parse(actividad.FechaInicio.ToString()).ToShortDateString();
                this.LblFechaFin.Text = DateTime.Parse(actividad.FechaSolicitado.ToString()).ToShortDateString();
                this.LblDescripcion.Text = actividad.Descripcion;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion
    }
}
