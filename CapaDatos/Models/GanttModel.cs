using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class GanttModel
    {
       

        //'id': 2,
        //  'parentId': 1,
        //  'title': 'Requerimientos',
        //  'start': new Date('2019-02-21T05:00:00.000Z'),
        //  'end': new Date('2019-02-26T09:00:00.000Z'),
        //  'progress': 60,
        //  'resource' : 'JMM'

        public long id { get; set; }

        public string clave { get; set; }
        //public long parentId { get; set; }
        public string text { get; set; }
        public string start_date { get; set; }
        public string end_date { get; set; }
        public decimal progress { get; set; }
        public string avance { get; set; }
        public string asignadostr { get; set; }
        public string type { get; set; }
        public bool open { get; set; }
        public bool rollup { get; set; }
        public long parent { get; set; }

    }
}
