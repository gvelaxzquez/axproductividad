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

namespace AxTracking
{
    public partial class Login : Form
    {
        public Login()
        {
            InitializeComponent();
            this.TxtContrasena.KeyPress += new System.Windows.Forms.KeyPressEventHandler(CheckEnterKeyPress);
        }

        private void btnIngresar_Click(object sender, EventArgs e)
        {
            try
            {

                Acceso();
            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message,ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void CheckEnterKeyPress(object sender, System.Windows.Forms.KeyPressEventArgs e)
        {
            try {
                if (e.KeyChar == (char)Keys.Enter)

                {
                    Acceso();

                }
                   

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, Application.ProductName, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
        }
        
        private void Acceso() {
            try
            {
                if (TxtUsuario.Text.Trim() == string.Empty)
                {
                    MessageBox.Show("Ingrese el usuario.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
                if (TxtContrasena.Text.Trim() == string.Empty)
                {
                    MessageBox.Show("Ingrese la contraseña.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                CD_Login cdlogin = new CD_Login();
                CD_Configuracion cdconf = new CD_Configuracion();
                UsuarioModel User = new UsuarioModel();

                User = cdlogin.Login(TxtUsuario.Text.Trim(), "");

                if (User != null)
                {
                    var contraseniaenc = ClasesAuxiliares.Encripta.EncriptaContrasena(TxtContrasena.Text.Trim());
                    var pass = ClasesAuxiliares.Encripta.DesencriptaContrasena(User.Contrasena);
                    // Usuario bloqueado
                    if (User.Bloqueado)
                    {

                        MessageBox.Show("El usuario se encuentra bloqueado.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;
                    }

                    // Usuario inactivo
                    if (!User.Activo)
                    {
                        MessageBox.Show("El usuario se encuentra inactivo.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;
                    }

                    // Contraseña incorrecta
                    if (User.Contrasena != contraseniaenc)
                    {

                        CD_Configuracion cd_conf = new CD_Configuracion();

                        int intentosconf = int.Parse(cd_conf.ObtenerConfiguracionID(7, ""));

                        int? Intentos = User.IntentosBloqueo + 1;
                        bool Bloqueado = Intentos >= intentosconf ? true : false;

                        //cdlogin.AumentaIntentos(User.IdUsuario, Intentos, Bloqueado);


                        MessageBox.Show("La contraseña no es válida.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;

                    }

                    //cdlogin.ReseteoIntentoBloqueo(User.IdUsuario);
                    ClasesAuxiliares.Sesion.User = User;

                    SISPRO home = new SISPRO();
                    home.Show();
                    this.Hide();


                }
                else
                {
                    MessageBox.Show("El usuario no existe.", ClasesAuxiliares.Variables.NombreApp, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
    }
}
