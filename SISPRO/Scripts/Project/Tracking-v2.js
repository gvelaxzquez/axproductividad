class Track {
    constructor() {
        this.actividad = "";
        this.track = [];
        this.usuario = $('#usuario-correo').val();
    }

    init() {
        this.actividad = $('#actividad').data('proyecto') + ' - ' + $('#actividad').data('actividad');
        this.idActividad = this.actividad.substring(this.actividad.lastIndexOf('-') + 2, this.actividad.length);
        this.url = $('#urlGuardarTracking').val();
        this.urlBug = $('#urlGuardarDefecto').val();
        this.chat = $.connection.trackingHub;

        $.connection.hub.start().then(() => {
            this.chat.server.addGroup(this.actividad);
        });

        $.connection.hub.disconnected(function () {
            setTimeout(function () {
                $.connection.hub.start();
            }, 5000);
        });

        $('.chrono-start').each((i, e) => {
            const id = $(e).data('id');

            if (id !== undefined) {
                $('[data-id="' + id + '"]').click(async (e) => {
                    e.preventDefault();
                    let track = this.track.find(x => x.idTracking == id);

                    if (track == null) {
                        this.track.push({
                            idTracking: id,
                            track: new Time(id, $('[data-id="' + id + '"]').data('initial-seconds')),
                            isRunning: false,
                            etapa: $('[data-id="' + id + '"]').data('stage')
                        })
                    }

                    track = this.track.find(x => x.idTracking == id);

                    if (this.usuario === '') {
                        const data = await POST('/Base/Usuario', {}, false);
                        this.usuario = data.usuario;
                    }

                    if (!track.isRunning) {
                        track.isRunning = true;

                        e.target.innerHTML = 'Detener';
                        e.target.classList.remove('btn-success');
                        e.target.classList.add('btn-danger');
                        this.chat.server.start(this.usuario, track.etapa, this.actividad, id, track.track.initial);
                    } else {
                        track.isRunning = false;
                        e.target.innerHTML = 'Continuar';
                        e.target.classList.add('btn-success');
                        e.target.classList.remove('btn-danger');
                        this.chat.server.stop(this.actividad, id);

                        const time = track.track.time;
                        const tracking = {
                            IdActividad: this.idActividad,
                            IdActividadTracking: track.idTracking,
                            strTrabajado: time.hours + ":" + time.minutes + ":" + time.seconds
                        }

                        track.track.initial = time.hours * 3600 + time.minutes * 60 + time.seconds;

                        if (track.idTracking !== 0) {
                            try {
                                const data = await POST(this.url, { tracking }, false);

                                if (data.Exito) {
                                    MensajeExito(data.Mensaje);
                                }
                                else {
                                    MensajeAdvertencia(data.Mensaje);
                                }
                            } catch (e) {
                                MensajeError(e);
                            }
                        }
                    }

                    if (track.idTracking === 0 && track.isRunning) {
                        $('#BtnGuardarDefecto').addClass('hidden');
                    } else {
                        $('#BtnGuardarDefecto').removeClass('hidden');
                    }
                });
            }
        });

        $.connection.trackingHub.on("seconds", (time) => {
            if (!time.map(x => x.IdTracking).every(x => this.track.map(y => y.idTracking).includes(x)))
                time.filter(x => !this.track.map(y => y.idTracking).includes(x.IdTracking)).forEach(x => {
                    this.track.push({
                        idTracking: x.IdTracking,
                        isRunning: x.Running,
                        track: new Time(x.IdTracking, x.IdTracking === 0 && !x.Running ? x.Time : x.Time - 1),
                        etapa: x.Etapa
                    })

                    if (x.IdTracking === 0 && !x.Running) {
                        $('[data-hours="0"]').html(('0' + (Math.floor((x.Time) / 3600))).slice(-2));
                        $('[data-minutes="0"]').html(('0' + (Math.floor((x.Time) % 3600 / 60))).slice(-2));
                        $('[data-seconds="0"]').html(('0' + (Math.floor((x.Time) % 3600 % 60))).slice(-2));
                    }
                })

            time.filter(x => x.IdTracking !== 0 || x.Running).forEach(x => {
                const button = $('[data-id="' + x.IdTracking + '"]');
                button.html('Detener');
                button.removeClass('btn-success');
                button.addClass('btn-danger');
            })

            this.track.filter(x => time.map(y => y.IdTracking).includes(x.idTracking) && x.isRunning).forEach(x => x.track.addSecond());
        });

        $.connection.trackingHub.on("stop", (idTracking) => {
            const track = this.track.find(x => x.idTracking === idTracking);

            const time = track.track.time;
            track.track.initial = time.hours * 3600 + time.minutes * 60 + time.seconds;
            track.isRunning = false;

            $('[data-id="' + idTracking + '"]')[0].innerHTML = 'Continuar';
            $('[data-id="' + idTracking + '"]')[0].classList.add('btn-success');
            $('[data-id="' + idTracking + '"]')[0].classList.remove('btn-danger');

            if (idTracking === 0) {
                $('#BtnGuardarDefecto').removeClass('hidden');
            }
        });

        //////////////////// Defectos ////////////////////
        $('#btnCapturarDefecto').click(async e => {
            e.preventDefault();

            await CargaInicialDefecto(this.idActividad);
            $('#ModalCapturarDefecto').modal({ backdrop: 'static', keyboard: false });

            let track = this.track.find(x => x.idTracking == 0);

            if (track == null) {
                this.track.push({
                    idTracking: 0,
                    isRunning: false,
                    track: new Time(0, 0),
                    etapa: "Bug",
                    //detalle: {
                    //    tipo: '-1',
                    //    fecha: '',
                    //    inyectado: '-1',
                    //    eliminado: '-1',
                    //    descripcion: ''
                    //}
                })
            }

            if (track.isRunning) {
                $('#BtnGuardarDefecto').addClass('hidden');
            } else {
                $('#BtnGuardarDefecto').removeClass('hidden');
            }

            $('[data-hours="0"]').html(('0' + (Math.floor((track.track.initial) / 3600))).slice(-2));
            $('[data-minutes="0"]').html(('0' + (Math.floor((track.track.initial) % 3600 / 60))).slice(-2));
            $('[data-seconds="0"]').html(('0' + (Math.floor((track.track.initial) % 3600 % 60))).slice(-2));

            //$('#SelTipoDefecto').val(track.detalle.tipo);
            //$('#SelTipoDefecto').selectpicker('refresh');

            //$('#SelFaseI').val(track.detalle.inyectado);
            //$('#SelFaseI').selectpicker('refresh');

            //$('#SelFaseE').val(track.detalle.eliminado);
            //$('#SelFaseE').selectpicker('refresh');

            //$('#TxtDescripcionDefecto').val(track.detalle.descripcion);

            //$('#TxtFechaDefecto').val(track.detalle.fecha);
        });

        $('#BtnGuardarDefecto').click(async e => {
            e.preventDefault();

            var mensaje = ValidaCamposRequeridos(".ReqCapturaDefecto");

            if (mensaje.length == 0) {
                const track = this.track.find(x => x.idTracking == 0);
                const time = track.track.time;

                const defecto = {
                    IdActividad: this.idActividad,
                    TipoDefectoId: $('#SelTipoDefecto').val(),
                    IdFaseInyeccion: $('#SelFaseI').val(),
                    IdFaseRemocion: $('#SelFaseE').val(),
                    FechaDefecto: $('#TxtFechaDefecto').val(),
                    Descripcion: $("#TxtDescripcionDefecto").val().trim(),
                    TiempoStr: time.hours + ":" + time.minutes + ":" + time.seconds
                };

                try {
                    const data = await POST(this.urlBug, { defecto });

                    if (data.Exito) {
                        this.chat.server.stopBug(this.actividad, 0);
                        this.track = this.track.filter(x => x.idTracking !== 0);

                        $('[data-id="0"]')[0].innerHTML = 'Iniciar';
                        $('[data-id="0"]')[0].classList.add('btn-success');
                        $('[data-id="0"]')[0].classList.remove('btn-danger');

                        $('#ModalCapturarDefecto').modal('hide');
                        MensajeExito(data.Mensaje);
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                } catch (e) {
                    MensajeError(e.textStatus);
                }
            }
            else {
                MensajeAdvertencia(mensaje);
            }
        })

        //$('#SelTipoDefecto').change(e => {
        //    let track = this.track.find(x => x.idTracking == 0);

        //    track.detalle.tipo = e.target.value;
        //});

        //$('#SelFaseI').change(e => {
        //    let track = this.track.find(x => x.idTracking == 0);

        //    track.detalle.inyectado = e.target.value;
        //});

        //$('#SelFaseE').change(e => {
        //    let track = this.track.find(x => x.idTracking == 0);

        //    track.detalle.eliminado = e.target.value;
        //});

        //$('#TxtFechaDefecto').change(e => {
        //    let track = this.track.find(x => x.idTracking == 0);

        //    track.detalle.fecha = e.target.value;
        //});

        //$('#TxtDescripcionDefecto').click(e => {
        //    let track = this.track.find(x => x.idTracking == 0);

        //    track.detalle.descripcion = e.target.value;
        //});
    }
}

class Time {
    idTracking = 0;
    time = {};

    constructor(idTracking, initial) {
        this.idTracking = idTracking;
        this.initial = initial;
        this.time = {
            hours: Math.floor((initial) / 3600),
            minutes: Math.floor((initial) % 3600 / 60),
            seconds: Math.floor((initial) % 3600 % 60),
        }
    }

    addSecond() {
        this.time.seconds++;

        if (this.time.seconds >= 60) {
            this.time.seconds = 0;
            this.time.minutes++;
        }

        if (this.time.minutes >= 60) {
            this.time.minutes = 0;
            this.time.hours++;
        }

        $('[data-hours="' + this.idTracking + '"]').html(('0' + this.time.hours).slice(-2));
        $('[data-minutes="' + this.idTracking + '"]').html(('0' + this.time.minutes).slice(-2));
        $('[data-seconds="' + this.idTracking + '"]').html(('0' + this.time.seconds).slice(-2));
    }
}

$(document).ready(function () {
    new Track().init();
});

async function CargaInicialDefecto(idActividad) {
    try {
        const url = $('#urlCargaInicialDefecto').val();
        const data = await POST(url, { idActividad }, false);

        $('#SelTipoDefecto').empty();
        $('#SelTipoDefecto').append(data.LstTipoDef);
        $('#SelTipoDefecto').selectpicker('refresh');

        $('#SelFaseI').empty();
        $('#SelFaseI').append(data.LstFases);
        $('#SelFaseI').selectpicker('refresh');

        $('#SelFaseE').empty();
        $('#SelFaseE').append(data.LstFases);
        $('#SelFaseE').selectpicker('refresh');

        $('#TxtFechaDefecto').val('');
        $("#TxtDescripcionDefecto").val('');

        $('[data-hours="0"]').html('00');
        $('[data-minutes="0"]').html('00');
        $('[data-seconds="0"]').html('00');
    } catch (e) {
        MensajeError(e);
    }
}





//var timerdefecto = {
//          hour: 0,
//           second: 0,
//           minute: 0
//      };

function CapturarTamanoTrack() {
    $('#ModalCapturarTamano').modal({ backdrop: 'static', keyboard: false });
    InicializarModalTamanos($('#IdActividadTrack').val());
}

//function successGuardarDefecto(data){

//    if (data.Exito) {
//       MensajeExito(data.Mensaje);
//      $('#ModalCapturarDefecto').modal('hide');
//    }
//    else  {

//     MensajeError(data.Mensaje);

//    }
//}