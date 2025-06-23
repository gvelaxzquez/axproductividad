namespace AxTracking.Controles
{
    partial class Card
    {
        /// <summary> 
        /// Variable del diseñador necesaria.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Limpiar los recursos que se estén usando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de componentes

        /// <summary> 
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido de este método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            this.LblIdActividad = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.LblProyecto = new System.Windows.Forms.Label();
            this.LblDescripcion = new System.Windows.Forms.Label();
            this.LblTiempo = new System.Windows.Forms.Label();
            this.LblFecha = new System.Windows.Forms.Label();
            this.pictureBox2 = new System.Windows.Forms.PictureBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.btnVerActividad = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // LblIdActividad
            // 
            this.LblIdActividad.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.LblIdActividad.Location = new System.Drawing.Point(12, 11);
            this.LblIdActividad.Name = "LblIdActividad";
            this.LblIdActividad.Size = new System.Drawing.Size(56, 13);
            this.LblIdActividad.TabIndex = 0;
            this.LblIdActividad.Text = "xIdActividad";
            this.LblIdActividad.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.ForeColor = System.Drawing.Color.White;
            this.label2.Location = new System.Drawing.Point(68, 11);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(9, 13);
            this.label2.TabIndex = 1;
            this.label2.Text = "|";
            // 
            // LblProyecto
            // 
            this.LblProyecto.ForeColor = System.Drawing.Color.Green;
            this.LblProyecto.Location = new System.Drawing.Point(74, 11);
            this.LblProyecto.Name = "LblProyecto";
            this.LblProyecto.Size = new System.Drawing.Size(133, 13);
            this.LblProyecto.TabIndex = 2;
            this.LblProyecto.Text = "xProyecto";
            this.LblProyecto.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // LblDescripcion
            // 
            this.LblDescripcion.ForeColor = System.Drawing.SystemColors.MenuHighlight;
            this.LblDescripcion.Location = new System.Drawing.Point(12, 33);
            this.LblDescripcion.Name = "LblDescripcion";
            this.LblDescripcion.Size = new System.Drawing.Size(272, 29);
            this.LblDescripcion.TabIndex = 3;
            this.LblDescripcion.Text = "xDescripcion";
            // 
            // LblTiempo
            // 
            this.LblTiempo.AutoSize = true;
            this.LblTiempo.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(0)))), ((int)(((byte)(0)))));
            this.LblTiempo.Location = new System.Drawing.Point(37, 77);
            this.LblTiempo.Name = "LblTiempo";
            this.LblTiempo.Size = new System.Drawing.Size(47, 13);
            this.LblTiempo.TabIndex = 4;
            this.LblTiempo.Text = "xTiempo";
            // 
            // LblFecha
            // 
            this.LblFecha.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(0)))), ((int)(((byte)(0)))));
            this.LblFecha.Location = new System.Drawing.Point(118, 73);
            this.LblFecha.Name = "LblFecha";
            this.LblFecha.Size = new System.Drawing.Size(70, 21);
            this.LblFecha.TabIndex = 5;
            this.LblFecha.Text = "xFecha";
            this.LblFecha.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // pictureBox2
            // 
            this.pictureBox2.Image = global::AxTracking.Properties.Resources.clock;
            this.pictureBox2.Location = new System.Drawing.Point(15, 73);
            this.pictureBox2.Name = "pictureBox2";
            this.pictureBox2.Size = new System.Drawing.Size(16, 21);
            this.pictureBox2.TabIndex = 7;
            this.pictureBox2.TabStop = false;
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = global::AxTracking.Properties.Resources.calendar1;
            this.pictureBox1.Location = new System.Drawing.Point(96, 73);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(16, 21);
            this.pictureBox1.TabIndex = 6;
            this.pictureBox1.TabStop = false;
            // 
            // btnVerActividad
            // 
            this.btnVerActividad.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(128)))), ((int)(((byte)(128)))), ((int)(((byte)(255)))));
            this.btnVerActividad.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnVerActividad.Image = global::AxTracking.Properties.Resources.eye;
            this.btnVerActividad.Location = new System.Drawing.Point(250, 7);
            this.btnVerActividad.Name = "btnVerActividad";
            this.btnVerActividad.Size = new System.Drawing.Size(34, 21);
            this.btnVerActividad.TabIndex = 8;
            this.btnVerActividad.UseVisualStyleBackColor = false;
            // 
            // Card
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.Controls.Add(this.btnVerActividad);
            this.Controls.Add(this.pictureBox2);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.LblFecha);
            this.Controls.Add(this.LblTiempo);
            this.Controls.Add(this.LblDescripcion);
            this.Controls.Add(this.LblProyecto);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.LblIdActividad);
            this.Cursor = System.Windows.Forms.Cursors.Hand;
            this.Name = "Card";
            this.Size = new System.Drawing.Size(287, 102);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label LblIdActividad;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label LblProyecto;
        private System.Windows.Forms.Label LblDescripcion;
        private System.Windows.Forms.Label LblTiempo;
        private System.Windows.Forms.Label LblFecha;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.PictureBox pictureBox2;
        private System.Windows.Forms.Button btnVerActividad;
    }
}
