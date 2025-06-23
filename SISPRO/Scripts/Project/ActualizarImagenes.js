var Imagenes = {
    ActualizarTamanoImagenes: {
        Resize: () => {
            Imagenes.Variables.Resize.rtime = new Date();
            Imagenes.Variables.Resize.timeout = true;
            setTimeout(Imagenes.ActualizarTamanoImagenes.ResizeTermino, Imagenes.Variables.Resize.delta);
        },
        ResizeTermino: () => {
            if (new Date() - Imagenes.Variables.Resize.rtime < Imagenes.Variables.Resize.delta) {
                setTimeout(Imagenes.Variables.Resize.ResizeTermino, Imagenes.Variables.Resize.delta);
            } else {
                Imagenes.Variables.Resize.timeout = false;
                Imagenes.ActualizarTamanoImagenes.ActualizarImagenes();
            }
        },
        ActualizarImagenes: () => {
            $.powerTip.destroy();
            for (const img of $('.u-a-i').toArray()) {
                $(img).data("powertipjq", $([
                    $(img).data('usuario'),
                    '<hr style="margin: 5px 0px"/>',
                    $(img).data('url')
                ].join('\n')));
                $(img).powerTip({
                    placement: 'w'
                });
            }
        }
    },
    Variables: {
        dtIssue: null,
        Resize: {
            rtime: null,
            timeout: false,
            delta: 200
        },
    }
}
