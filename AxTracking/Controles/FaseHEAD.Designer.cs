namespace AxTracking.Controles
{
    partial class FaseHEAD
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
            this.LblFase = new System.Windows.Forms.Label();
            this.LblTiempo = new System.Windows.Forms.Label();
            this.LblTrabajado = new System.Windows.Forms.Label();
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.tableLayoutPanel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // LblFase
            // 
            this.LblFase.Font = new System.Drawing.Font("Arial Black", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblFase.ForeColor = System.Drawing.Color.White;
            this.LblFase.Location = new System.Drawing.Point(3, 0);
            this.LblFase.Name = "LblFase";
            this.LblFase.Size = new System.Drawing.Size(213, 25);
            this.LblFase.TabIndex = 0;
            this.LblFase.Text = "FASE";
            this.LblFase.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // LblTiempo
            // 
            this.LblTiempo.Font = new System.Drawing.Font("Arial Black", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblTiempo.ForeColor = System.Drawing.Color.White;
            this.LblTiempo.Location = new System.Drawing.Point(254, 0);
            this.LblTiempo.Name = "LblTiempo";
            this.LblTiempo.Size = new System.Drawing.Size(80, 25);
            this.LblTiempo.TabIndex = 1;
            this.LblTiempo.Text = "ASIGN";
            this.LblTiempo.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // LblTrabajado
            // 
            this.LblTrabajado.Font = new System.Drawing.Font("Arial Black", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblTrabajado.ForeColor = System.Drawing.Color.White;
            this.LblTrabajado.Location = new System.Drawing.Point(340, 0);
            this.LblTrabajado.Name = "LblTrabajado";
            this.LblTrabajado.Size = new System.Drawing.Size(63, 25);
            this.LblTrabajado.TabIndex = 2;
            this.LblTrabajado.Text = "TRAB";
            this.LblTrabajado.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // tableLayoutPanel1
            // 
            this.tableLayoutPanel1.ColumnCount = 5;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 74.39353F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 25.60647F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 71F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 43F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 45F));
            this.tableLayoutPanel1.Controls.Add(this.LblFase, 0, 0);
            this.tableLayoutPanel1.Controls.Add(this.LblTiempo, 1, 0);
            this.tableLayoutPanel1.Controls.Add(this.LblTrabajado, 2, 0);
            this.tableLayoutPanel1.Location = new System.Drawing.Point(3, 3);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 1;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tableLayoutPanel1.Size = new System.Drawing.Size(497, 25);
            this.tableLayoutPanel1.TabIndex = 6;
            // 
            // FaseHEAD
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.Controls.Add(this.tableLayoutPanel1);
            this.Name = "FaseHEAD";
            this.Size = new System.Drawing.Size(503, 28);
            this.tableLayoutPanel1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label LblFase;
        private System.Windows.Forms.Label LblTiempo;
        private System.Windows.Forms.Label LblTrabajado;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
    }
}
