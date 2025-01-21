$(document).ready(function(){
    cargarDevices()
    $('.select2').select2({
        theme: 'bootstrap4'
    });
});
//esta funcion se encarga de cargar todos lo dipositivos de la vista de bodega en data table.
function cargarDevices() {
    $(function () {
        tblBodega = $('#bodega').DataTable({
            // scrollX: true,
            info: false,
            responsive: true,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            sAjaxDataProp: "",
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'devices_bodega'
                },
                dataType: 'json',
            },
            columns: [
                { "data": "serial" },
                { "data": "mac" },
                { "data": "nombre_modelo" },
                { "data": "nombre_marca" },
                { "data": "loginRecibe" },
                { "data": "recibido" },
                { "data": "Tipo" },
                { "data": "loginEnviador" },
                { "data": "recibido", "data": "user", "data": "loginRecibe" }
            ],
            columnDefs: [
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        x = data
                        if (x == '1') {
                            return '<b>Recibido</b>';

                        } else {
                            return '<b>Por Recibir</b>';
                        }
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        cancelar = "cancelar"
                        recibir = "recibir"
                        enviar = "enviar"
                        serial = row.serial
                        if (row.loginRecibe != row.user && row.recibido == '0') {
                            var buttons = "<button onclick ='opciones_bodega(\"" + row.serial + "\",\"" + cancelar + "\",\"" + row.id__cpe + "\",\"" + row.idRecibe + "\",\"" + row.idEnviado + "\");' id='cancelarCPE' class='btn btn-danger btn-xs m-1' value='cancelar'><i class='nav-icon fas fa-window-close'></i></button>"
                        } else if (row.loginRecibe == row.user && row.recibido == '0') {
                            var buttons = "<button onclick ='opciones_bodega(\"" + row.serial + "\",\"" + recibir + "\",\"" + row.id__cpe + "\",\"" + row.idRecibe + "\",\"" + row.idEnviado + "\");' id='recibirCPE' class='btn btn-primary btn-xs m-1' value='recibir'><i class='nav-icon far fa-envelope-open'></i></button>"
                            buttons += "<button onclick ='opciones_bodega(\"" + row.serial + "\",\"" + cancelar + "\",\"" + row.id__cpe + "\",\"" + row.idRecibe + "\",\"" + row.idEnviado + "\");' id='cancelarCPE' class='btn btn-danger btn-xs m-1' value='cancelar'><i class='nav-icon fas fa-window-close'></i></button>"
                        } else if (row.loginRecibe == row.user && row.recibido == '1') {
                            idCpe = row.id__cpe
                            usuarioR = row.idRecibe
                            var buttons = "<button onclick ='opciones_bodega(\"" + row.serial + "\",\"" + enviar + "\",\"" + row.id__cpe + "\",\"" + row.idRecibe + "\",\"" + row.idEnviado + "\");' id='enviarCPE' class='btn btn-success btn-xs m-1' value='enviar'><i class='nav-icon far fa-paper-plane'></i></button>"
                        }
                        return buttons;
                    }
                }
            ],
            initComplete: function (settings, json) {
                $('#loadScreen').fadeOut();
            }
        });
    });
};
