namespace AxTracking.Controles
{
    partial class Fase
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
            this.BtnFinalizar = new System.Windows.Forms.Button();
            this.BtnRecord = new System.Windows.Forms.Button();
            this.tableLayoutPanel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // LblFase
            // 
            this.LblFase.Font = new System.Drawing.Font("Arial Narrow", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblFase.ForeColor = System.Drawing.Color.SteelBlue;
            this.LblFase.Location = new System.Drawing.Point(3, 0);
            this.LblFase.Name = "LblFase";
            this.LblFase.Size = new System.Drawing.Size(213, 43);
            this.LblFase.TabIndex = 0;
            this.LblFase.Text = "XFase";
            this.LblFase.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // LblTiempo
            // 
            this.LblTiempo.Font = new System.Drawing.Font("Arial Narrow", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblTiempo.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(0)))), ((int)(((byte)(0)))));
            this.LblTiempo.Location = new System.Drawing.Point(249, 0);
            this.LblTiempo.Name = "LblTiempo";
            this.LblTiempo.Size = new System.Drawing.Size(79, 43);
            this.LblTiempo.TabIndex = 1;
            this.LblTiempo.Text = "XTiempo";
            this.LblTiempo.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // LblTrabajado
            // 
            this.LblTrabajado.Font = new System.Drawing.Font("Arial Narrow", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblTrabajado.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(0)))), ((int)(((byte)(0)))));
            this.LblTrabajado.Location = new System.Drawing.Point(334, 0);
            this.LblTrabajado.Name = "LblTrabajado";
            this.LblTrabajado.Size = new System.Drawing.Size(63, 43);
            this.LblTrabajado.TabIndex = 2;
            this.LblTrabajado.Text = "XTraba";
            this.LblTrabajado.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // tableLayoutPanel1
            // 
            this.tableLayoutPanel1.BackColor = System.Drawing.Color.Black;
            this.tableLayoutPanel1.ColumnCount = 5;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 74.39353F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 25.60647F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 71F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 43F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 51F));
            this.tableLayoutPanel1.Controls.Add(this.LblFase, 0, 0);
            this.tableLayoutPanel1.Controls.Add(this.BtnFinalizar, 4, 0);
            this.tableLayoutPanel1.Controls.Add(this.LblTiempo, 1, 0);
            this.tableLayoutPanel1.Controls.Add(this.BtnRecord, 3, 0);
            this.tableLayoutPanel1.Controls.Add(this.LblTrabajado, 2, 0);
            this.tableLayoutPanel1.Location = new System.Drawing.Point(3, 3);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 1;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tableLayoutPanel1.Size = new System.Drawing.Size(497, 43);
            this.tableLayoutPanel1.TabIndex = 6;
            // 
            // BtnFinalizar
            // 
            this.BtnFinalizar.BackColor = System.Drawing.Color.Transparent;
            this.BtnFinalizar.BackgroundImage = global::AxTracking.Properties.Resources.iconfinder_notification_done_48784;
            this.BtnFinalizar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Center;
            this.BtnFinalizar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.BtnFinalizar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.BtnFinalizar.Location = new System.Drawing.Point(448, 3);
            this.BtnFinalizar.Name = "BtnFinalizar";
            this.BtnFinalizar.Size = new System.Drawing.Size(40, 37);
            this.BtnFinalizar.TabIndex = 5;
            this.BtnFinalizar.UseVisualStyleBackColor = false;
            // 
            // BtnRecord
            // 
            this.BtnRecord.BackColor = System.Drawing.Color.Transparent;
            this.BtnRecord.BackgroundImage = global::AxTracking.Properties.Resources.iconfinder_player_record_48792__1_;
            this.BtnRecord.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.BtnRecord.Cursor = System.Windows.Forms.Cursors.Hand;
            this.BtnRecord.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.BtnRecord.Location = new System.Drawing.Point(405, 3);
            this.BtnRecord.Name = "BtnRecord";
            this.BtnRecord.Size = new System.Drawing.Size(37, 35);
            this.BtnRecord.TabIndex = 4;
            this.BtnRecord.UseVisualStyleBackColor = false;
            // 
            // Fase
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.Controls.Add(this.tableLayoutPanel1);
            this.Name = "Fase";
            this.Size = new System.Drawing.Size(503, 49);
            this.tableLayoutPanel1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label LblFase;
        private System.Windows.Forms.Label LblTiempo;
        private System.Windows.Forms.Label LblTrabajado;
        private System.Windows.Forms.Button BtnRecord;
        private System.Windows.Forms.Button BtnFinalizar;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
    }
}
