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
    public partial class TrackWindow : Form
    {
        long IdActividad;
        long IdActividadTracking;
        Timer t = new Timer();
        public TrackWindow(long _IdActividad,long _IdActividadTracking,string _Fase, string _Trabajado)
        {
            InitializeComponent();

            IdActividad = _IdActividad;
            IdActividadTracking = _IdActividadTracking;
            this.LblTiempo.Text = _Trabajado;
            this.LblIdActividad.Text = "#" + IdActividad.ToString();
            this.LblFase.Text = _Fase;
        }

        private void TrackWindow_Load(object sender, EventArgs e)
        {
            t.Interval = 1000;  //in milliseconds

            t.Tick += new EventHandler(t_Tick);
        }
        private void t_Tick(object sender, EventArgs e)
        {
            //get current time
            DateTime dt =  DateTime.Parse(this.LblTiempo.Text);

            int hh = dt.Hour;
            int mm = dt.Minute;
            int ss = dt.Second;

            ss++;

            if (ss == 60) {

                mm++;
                ss = 0;
            }
            if (mm == 60) {

                hh++;
                mm = 0;
            }

            //time
            string time = "";

            //padding leading zero
            if (hh < 10)
            {
                time += "0" + hh;
            }
            else
            {
                time += hh;
            }
            time += ":";

            if (mm < 10)
            {
                time += "0" + mm;
            }
            else
            {
                time += mm;
            }
            time += ":";

            if (ss < 10)
            {
                time += "0" + ss;
            }
            else
            {
                time += ss;
            }

            //update label
            LblTiempo.Text = time;
        }

        private void BtnStart_Click(object sender, EventArgs e)
        {
            t.Start();

        }

        private void BtnPause_Click(object sender, EventArgs e)
        {
            t.Stop();
        }

        private void BtnStop_Click(object sender, EventArgs e)
        {
            try
            {
                ActividadTrackingModel tra = new ActividadTrackingModel();
                CD_Actividad cd_act = new CD_Actividad();
                string conexion = ConfigurationSettings.AppSettings["BDProductividad"].ToString();

                t.Stop();
                tra.IdActividad = IdActividad;
                tra.IdActividadTracking = IdActividadTracking;
                tra.Trabajado = TimeSpan.Parse(this.LblTiempo.Text.ToString());

                int respuesta = cd_act.ActualizaTiempoTrabajo(tra, conexion);

                Close();
            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message, ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
