namespace AxTracking
{
    partial class SISPRO
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(SISPRO));
            this.gpxheader = new System.Windows.Forms.GroupBox();
            this.LblNombreUsuario = new System.Windows.Forms.Label();
            this.linkLabel1 = new System.Windows.Forms.LinkLabel();
            this.flActividades = new System.Windows.Forms.FlowLayoutPanel();
            this.gpxActividad = new System.Windows.Forms.GroupBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.LblFechaIni = new System.Windows.Forms.Label();
            this.LblHorasAsignadas = new System.Windows.Forms.Label();
            this.LblNomProyecto = new System.Windows.Forms.Label();
            this.LblIdActividad = new System.Windows.Forms.Label();
            this.LblFechaFin = new System.Windows.Forms.Label();
            this.LblHorasT = new System.Windows.Forms.Label();
            this.LblSprint = new System.Windows.Forms.Label();
            this.LblBR = new System.Windows.Forms.Label();
            this.flFases = new System.Windows.Forms.FlowLayoutPanel();
            this.BtnTerminar = new System.Windows.Forms.Button();
            this.label9 = new System.Windows.Forms.Label();
            this.LblDescripcion = new System.Windows.Forms.Label();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.gpxheader.SuspendLayout();
            this.gpxActividad.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // gpxheader
            // 
            this.gpxheader.BackColor = System.Drawing.Color.Black;
            this.gpxheader.Controls.Add(this.linkLabel1);
            this.gpxheader.Controls.Add(this.LblNombreUsuario);
            this.gpxheader.Controls.Add(this.pictureBox1);
            this.gpxheader.Location = new System.Drawing.Point(2, 1);
            this.gpxheader.Name = "gpxheader";
            this.gpxheader.Size = new System.Drawing.Size(972, 70);
            this.gpxheader.TabIndex = 0;
            this.gpxheader.TabStop = false;
            // 
            // LblNombreUsuario
            // 
            this.LblNombreUsuario.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblNombreUsuario.ForeColor = System.Drawing.SystemColors.ActiveCaption;
            this.LblNombreUsuario.Location = new System.Drawing.Point(422, 16);
            this.LblNombreUsuario.Name = "LblNombreUsuario";
            this.LblNombreUsuario.Size = new System.Drawing.Size(544, 23);
            this.LblNombreUsuario.TabIndex = 1;
            this.LblNombreUsuario.Text = "xNombre";
            this.LblNombreUsuario.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // linkLabel1
            // 
            this.linkLabel1.AutoSize = true;
            this.linkLabel1.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.linkLabel1.ForeColor = System.Drawing.SystemColors.ActiveCaption;
            this.linkLabel1.Location = new System.Drawing.Point(910, 39);
            this.linkLabel1.Name = "linkLabel1";
            this.linkLabel1.Size = new System.Drawing.Size(56, 18);
            this.linkLabel1.TabIndex = 2;
            this.linkLabel1.TabStop = true;
            this.linkLabel1.Text = "Logout";
            this.linkLabel1.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkLabel1_LinkClicked);
            // 
            // flActividades
            // 
            this.flActividades.AutoScroll = true;
            this.flActividades.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(46)))), ((int)(((byte)(46)))), ((int)(((byte)(46)))));
            this.flActividades.Location = new System.Drawing.Point(2, 73);
            this.flActividades.Name = "flActividades";
            this.flActividades.Size = new System.Drawing.Size(316, 636);
            this.flActividades.TabIndex = 1;
            // 
            // gpxActividad
            // 
            this.gpxActividad.AutoSize = true;
            this.gpxActividad.BackColor = System.Drawing.Color.Black;
            this.gpxActividad.Controls.Add(this.LblDescripcion);
            this.gpxActividad.Controls.Add(this.label9);
            this.gpxActividad.Controls.Add(this.BtnTerminar);
            this.gpxActividad.Controls.Add(this.flFases);
            this.gpxActividad.Controls.Add(this.LblFechaFin);
            this.gpxActividad.Controls.Add(this.LblHorasT);
            this.gpxActividad.Controls.Add(this.LblSprint);
            this.gpxActividad.Controls.Add(this.LblBR);
            this.gpxActividad.Controls.Add(this.LblFechaIni);
            this.gpxActividad.Controls.Add(this.LblHorasAsignadas);
            this.gpxActividad.Controls.Add(this.LblNomProyecto);
            this.gpxActividad.Controls.Add(this.LblIdActividad);
            this.gpxActividad.Controls.Add(this.label8);
            this.gpxActividad.Controls.Add(this.label7);
            this.gpxActividad.Controls.Add(this.label3);
            this.gpxActividad.Controls.Add(this.label6);
            this.gpxActividad.Controls.Add(this.label5);
            this.gpxActividad.Controls.Add(this.label4);
            this.gpxActividad.Controls.Add(this.label2);
            this.gpxActividad.Controls.Add(this.label1);
            this.gpxActividad.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.gpxActividad.Location = new System.Drawing.Point(324, 73);
            this.gpxActividad.Name = "gpxActividad";
            this.gpxActividad.Size = new System.Drawing.Size(650, 655);
            this.gpxActividad.TabIndex = 2;
            this.gpxActividad.TabStop = false;
            this.gpxActividad.Visible = false;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.Color.White;
            this.label1.Location = new System.Drawing.Point(19, 16);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(71, 16);
            this.label1.TabIndex = 0;
            this.label1.Text = "Actividad:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.ForeColor = System.Drawing.Color.White;
            this.label2.Location = new System.Drawing.Point(21, 40);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(68, 16);
            this.label2.TabIndex = 1;
            this.label2.Text = "Proyecto:";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.ForeColor = System.Drawing.Color.White;
            this.label4.Location = new System.Drawing.Point(21, 91);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(116, 16);
            this.label4.TabIndex = 3;
            this.label4.Text = "Horas asignadas:";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.ForeColor = System.Drawing.Color.White;
            this.label5.Location = new System.Drawing.Point(357, 16);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(30, 16);
            this.label5.TabIndex = 4;
            this.label5.Text = "BR:";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.ForeColor = System.Drawing.Color.White;
            this.label6.Location = new System.Drawing.Point(357, 40);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(50, 16);
            this.label6.TabIndex = 5;
            this.label6.Text = "Sprint:";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.ForeColor = System.Drawing.Color.White;
            this.label3.Location = new System.Drawing.Point(357, 91);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(119, 16);
            this.label3.TabIndex = 6;
            this.label3.Text = "Horas trabajadas:";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label7.ForeColor = System.Drawing.Color.White;
            this.label7.Location = new System.Drawing.Point(357, 66);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(71, 16);
            this.label7.TabIndex = 7;
            this.label7.Text = "Fecha fin:";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label8.ForeColor = System.Drawing.Color.White;
            this.label8.Location = new System.Drawing.Point(20, 66);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(90, 16);
            this.label8.TabIndex = 8;
            this.label8.Text = "Fecha inicio:";
            // 
            // LblFechaIni
            // 
            this.LblFechaIni.AutoSize = true;
            this.LblFechaIni.BackColor = System.Drawing.Color.Black;
            this.LblFechaIni.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblFechaIni.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblFechaIni.Location = new System.Drawing.Point(178, 66);
            this.LblFechaIni.Name = "LblFechaIni";
            this.LblFechaIni.Size = new System.Drawing.Size(72, 16);
            this.LblFechaIni.TabIndex = 12;
            this.LblFechaIni.Text = "XFechaIni";
            // 
            // LblHorasAsignadas
            // 
            this.LblHorasAsignadas.AutoSize = true;
            this.LblHorasAsignadas.BackColor = System.Drawing.Color.Black;
            this.LblHorasAsignadas.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblHorasAsignadas.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblHorasAsignadas.Location = new System.Drawing.Point(177, 91);
            this.LblHorasAsignadas.Name = "LblHorasAsignadas";
            this.LblHorasAsignadas.Size = new System.Drawing.Size(61, 16);
            this.LblHorasAsignadas.TabIndex = 11;
            this.LblHorasAsignadas.Text = "xHorasA";
            // 
            // LblNomProyecto
            // 
            this.LblNomProyecto.AutoSize = true;
            this.LblNomProyecto.BackColor = System.Drawing.Color.Black;
            this.LblNomProyecto.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblNomProyecto.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblNomProyecto.Location = new System.Drawing.Point(179, 40);
            this.LblNomProyecto.Name = "LblNomProyecto";
            this.LblNomProyecto.Size = new System.Drawing.Size(72, 16);
            this.LblNomProyecto.TabIndex = 10;
            this.LblNomProyecto.Text = "xProyecto";
            // 
            // LblIdActividad
            // 
            this.LblIdActividad.AutoSize = true;
            this.LblIdActividad.BackColor = System.Drawing.Color.Black;
            this.LblIdActividad.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblIdActividad.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblIdActividad.Location = new System.Drawing.Point(177, 16);
            this.LblIdActividad.Name = "LblIdActividad";
            this.LblIdActividad.Size = new System.Drawing.Size(75, 16);
            this.LblIdActividad.TabIndex = 9;
            this.LblIdActividad.Text = "xActividad";
            // 
            // LblFechaFin
            // 
            this.LblFechaFin.AutoSize = true;
            this.LblFechaFin.BackColor = System.Drawing.Color.Black;
            this.LblFechaFin.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblFechaFin.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblFechaFin.Location = new System.Drawing.Point(515, 66);
            this.LblFechaFin.Name = "LblFechaFin";
            this.LblFechaFin.Size = new System.Drawing.Size(76, 16);
            this.LblFechaFin.TabIndex = 16;
            this.LblFechaFin.Text = "XFechaFin";
            // 
            // LblHorasT
            // 
            this.LblHorasT.AutoSize = true;
            this.LblHorasT.BackColor = System.Drawing.Color.Black;
            this.LblHorasT.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblHorasT.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblHorasT.Location = new System.Drawing.Point(516, 91);
            this.LblHorasT.Name = "LblHorasT";
            this.LblHorasT.Size = new System.Drawing.Size(61, 16);
            this.LblHorasT.TabIndex = 15;
            this.LblHorasT.Text = "XHorasT";
            // 
            // LblSprint
            // 
            this.LblSprint.AutoSize = true;
            this.LblSprint.BackColor = System.Drawing.Color.Black;
            this.LblSprint.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblSprint.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblSprint.Location = new System.Drawing.Point(515, 40);
            this.LblSprint.Name = "LblSprint";
            this.LblSprint.Size = new System.Drawing.Size(54, 16);
            this.LblSprint.TabIndex = 14;
            this.LblSprint.Text = "xSprint";
            // 
            // LblBR
            // 
            this.LblBR.AutoSize = true;
            this.LblBR.BackColor = System.Drawing.Color.Black;
            this.LblBR.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblBR.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblBR.Location = new System.Drawing.Point(516, 16);
            this.LblBR.Name = "LblBR";
            this.LblBR.Size = new System.Drawing.Size(34, 16);
            this.LblBR.TabIndex = 13;
            this.LblBR.Text = "xBR";
            // 
            // flFases
            // 
            this.flFases.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.flFases.Location = new System.Drawing.Point(23, 179);
            this.flFases.Name = "flFases";
            this.flFases.Size = new System.Drawing.Size(612, 415);
            this.flFases.TabIndex = 17;
            // 
            // BtnTerminar
            // 
            this.BtnTerminar.BackColor = System.Drawing.Color.Green;
            this.BtnTerminar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.BtnTerminar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.BtnTerminar.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.BtnTerminar.ForeColor = System.Drawing.Color.White;
            this.BtnTerminar.Location = new System.Drawing.Point(518, 605);
            this.BtnTerminar.Name = "BtnTerminar";
            this.BtnTerminar.Size = new System.Drawing.Size(115, 31);
            this.BtnTerminar.TabIndex = 18;
            this.BtnTerminar.Text = "TERMINAR";
            this.BtnTerminar.UseVisualStyleBackColor = false;
            this.BtnTerminar.Click += new System.EventHandler(this.BtnTerminar_Click);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label9.ForeColor = System.Drawing.Color.White;
            this.label9.Location = new System.Drawing.Point(21, 117);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(86, 16);
            this.label9.TabIndex = 19;
            this.label9.Text = "Descripción:";
            // 
            // LblDescripcion
            // 
            this.LblDescripcion.BackColor = System.Drawing.Color.Black;
            this.LblDescripcion.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblDescripcion.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(192)))), ((int)(((byte)(0)))));
            this.LblDescripcion.Location = new System.Drawing.Point(179, 117);
            this.LblDescripcion.Name = "LblDescripcion";
            this.LblDescripcion.Size = new System.Drawing.Size(427, 59);
            this.LblDescripcion.TabIndex = 20;
            this.LblDescripcion.Text = "xDescripcion";
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = global::AxTracking.Properties.Resources.axsislogo_black1;
            this.pictureBox1.Location = new System.Drawing.Point(10, 7);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(178, 50);
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            // 
            // SISPRO
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.ClientSize = new System.Drawing.Size(983, 727);
            this.Controls.Add(this.gpxActividad);
            this.Controls.Add(this.flActividades);
            this.Controls.Add(this.gpxheader);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "YITPRO";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "YITPRO";
            this.Load += new System.EventHandler(this.Principal_Load);
            this.gpxheader.ResumeLayout(false);
            this.gpxheader.PerformLayout();
            this.gpxActividad.ResumeLayout(false);
            this.gpxActividad.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.GroupBox gpxheader;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.LinkLabel linkLabel1;
        private System.Windows.Forms.Label LblNombreUsuario;
        private System.Windows.Forms.FlowLayoutPanel flActividades;
        private System.Windows.Forms.GroupBox gpxActividad;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label LblFechaFin;
        private System.Windows.Forms.Label LblHorasT;
        private System.Windows.Forms.Label LblSprint;
        private System.Windows.Forms.Label LblBR;
        private System.Windows.Forms.Label LblFechaIni;
        private System.Windows.Forms.Label LblHorasAsignadas;
        private System.Windows.Forms.Label LblNomProyecto;
        private System.Windows.Forms.Label LblIdActividad;
        private System.Windows.Forms.FlowLayoutPanel flFases;
        private System.Windows.Forms.Button BtnTerminar;
        private System.Windows.Forms.Label LblDescripcion;
        private System.Windows.Forms.Label label9;
    }
}