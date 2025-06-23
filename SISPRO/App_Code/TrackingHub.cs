using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Timers;
using System.Diagnostics;
using DocumentFormat.OpenXml.Drawing.ChartDrawing;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Vml.Spreadsheet;

namespace AxProductividad.App_Code
{
    public class TrackingHub : Hub
    {
        private static readonly Timer _timer = new Timer();
        private static readonly Dictionary<string, List<Seconds>> _actividades;
        private static readonly Dictionary<string, Dictionary<string, List<Seconds>>> _usuarios;
        private static readonly List<string> _groups;
        private static readonly List<string> _users;
        private static readonly IHubContext hub = GlobalHost.ConnectionManager.GetHubContext<TrackingHub>();

        private class Seconds
        {
            public int IdTracking { get; set; }
            public bool Running { get; set; }
            public int Time { get; set; }
            public string Etapa { get; set; }
        }

        static TrackingHub()
        {
            _timer.Interval = 1000;
            _timer.Elapsed += TimerElapsed;
            _timer.Start();

            _actividades = new Dictionary<string, List<Seconds>>();
            _usuarios = new Dictionary<string, Dictionary<string, List<Seconds>>>();
            _groups = new List<string>();
            _users = new List<string>();
        }

        static void TimerElapsed(object sender, ElapsedEventArgs e)
        {
            foreach (KeyValuePair<string, List<Seconds>> pair in _actividades)
            {
                pair.Value.Where(x => x.Running).ToList().ForEach(x => x.Time++);
            }

            foreach (var group in _groups)
            {
                if (_actividades.ContainsKey(group))
                    hub.Clients.Group(group).seconds(_actividades[group]);
            }

            foreach (var user in _users)
            {
                if (_usuarios.ContainsKey(user))
                    hub.Clients.Group(user).activities(_usuarios[user]);
            }
        }

        public void AddUser(string usuario)
        {
            if (usuario != "" && usuario != null)
                hub.Groups.Add(Context.ConnectionId, usuario);
        }

        public void AddGroup(string idActividad)
        {
            if (idActividad != null && idActividad != "")
                hub.Groups.Add(Context.ConnectionId, idActividad);

            if (!_groups.Contains(idActividad))
                _groups.Add(idActividad);
        }

        public void Stop(string idActividad, int idTracking)
        {
            if (!_actividades.ContainsKey(idActividad))
                _actividades.Add(idActividad, new List<Seconds>());

            if (idTracking > 0)
            {
                var second = _actividades[idActividad].FirstOrDefault(x => x.IdTracking == idTracking);
                _actividades[idActividad].Remove(second);
            }
            else
            {
                var second = _actividades[idActividad].FirstOrDefault(x => x.IdTracking == idTracking);
                second.Running = false;
            }

            hub.Clients.Group(idActividad).stop(idTracking);

            if (_actividades[idActividad].Count() == 0)
            {
                _actividades.Remove(idActividad);
                _groups.Remove(idActividad);
            }
        }

        public void StopBug(string idActividad, int idTracking)
        {
            if (!_actividades.ContainsKey(idActividad))
                _actividades.Add(idActividad, new List<Seconds>());

            var second = _actividades[idActividad].FirstOrDefault(x => x.IdTracking == 0);
            _actividades[idActividad].Remove(second);

            if (_actividades[idActividad].Count() == 0)
            {
                _actividades.Remove(idActividad);
                _groups.Remove(idActividad);
            }
        }

        public void Start(string usuario, string etapa, string idActividad, int idTracking, int initialTime)
        {
            if (!_groups.Contains(idActividad))
                _groups.Add(idActividad);

            if (!_actividades.ContainsKey(idActividad))
                _actividades.Add(idActividad, new List<Seconds>());

            if (!_actividades[idActividad].Any(x => x.IdTracking == idTracking))
                _actividades[idActividad].Add(new Seconds
                {
                    IdTracking = idTracking,
                    Running = true,
                    Time = initialTime,
                    Etapa = etapa
                });
            else
            {
                var track = _actividades[idActividad].FirstOrDefault(x => x.IdTracking == idTracking);
                track.Running = true;
            }

            if (!_usuarios.ContainsKey(usuario) && usuario != "")
                _usuarios.Add(usuario, new Dictionary<string, List<Seconds>>());

            if (!_users.Contains(usuario) && usuario != "")
                _users.Add(usuario);

            var userActivity = _usuarios[usuario].ContainsKey(idActividad);
            if (usuario != "" && !userActivity)
                _usuarios[usuario].Add(idActividad, _actividades[idActividad]);
        }
    }
}