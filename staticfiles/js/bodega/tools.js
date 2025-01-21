//Funcion para realizar las acciones de la bodega: enviar,recibir,cancelar
function opciones_bodega(serial, accion, idCpe, idRecibe, idEnvia) {
    if (accion == 'enviar') {
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'cargarUsers',
            },
            beforeSend: function () {
                $(".loader").fadeIn();
            },
            complete: function () {
                $('.loader').fadeOut();
            },
        }).done(function (data) {
            var temp = data.data
            if (data.type == 'error') {
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error'
                })
            } else {
                var $select = $('.sel1');
                for (let i = 0; i < temp.length; i++) {
                    $select.append('<option value="' + temp[i].id__usuarios + '">' + temp[i].Nombre + '</option>');
                }
                $('#modalEnvioCpe').modal('show');
            }
        }).fail(function (textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        });
    } else if (accion == 'recibir') {
        Swal.fire({
            title: 'Atención!',
            text: 'Está por recibir el dispositivo con serial:\ ' + serial + '\n ¿Esta seguro de realizar esta acción?',
            icon: 'info',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'red',
            showCloseButton: true,
            preConfirm: function accionRecibir() {
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'action': 'opcion_bodega',
                        'ejecutar': accion,
                        'idCpe': idCpe,
                        'idRecibe': idRecibe,
                        'idEnvia': idEnvia
                    },
                    beforeSend: function () {
                        $(".loader").fadeIn();
                    },
                    complete: function () {
                        $('.loader').fadeOut();
                    },
                }).done(function (data) {
                    if (data.type == 'success') {
                        Swal.fire({
                            title: 'Correcto!',
                            text: data.msg,
                            icon: 'success',
                            preConfirm: function refresh() {
                                location.href = '/apli/orden/bodega'
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: data.msg,
                            icon: 'error'
                        });
                    }
                }).fail(function (textStatus, errorThrown) {
                    alert(textStatus + ': ' + errorThrown);
                });
            }
        })
    } else if (accion == 'cancelar') {
        Swal.fire({
            title: 'Atención!',
            text: '¿Esta seguro de cancelar el ingreso ó envio del dispositivo con serial:\ ' + serial + '?',
            icon: 'info',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'red',
            showCloseButton: true,
            preConfirm: function accionCancelar() {
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'action': 'opcion_bodega',
                        'ejecutar': accion,
                        'idCpe': idCpe,
                        'idRecibe': idRecibe,
                        'idEnvia': idEnvia
                    },
                    beforeSend: function () {
                        $(".loader").fadeIn();
                    },
                    complete: function () {
                        $('.loader').fadeOut();
                    },
                }).done(function (data) {
                    if (data.type == 'success') {
                        Swal.fire({
                            title: 'Correcto!',
                            text: data.msg,
                            icon: 'success',
                            preConfirm: function refresh() {
                                location.href = '/apli/orden/bodega'
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: data.msg,
                            icon: 'error'
                        });
                    }
                }).fail(function (textStatus, errorThrown) {
                    alert(textStatus + ': ' + errorThrown);
                });
            }
        })
    }
};
//Funcion para enviar el cpe a la persona seleccionada
function enviarCpe(){
    var recibe = document.getElementById('users').value;
    debugger
    Swal.fire({
        title: 'Atención!',
        text: 'Está por Enviar el dispositivo con serial:\ ' + serial + '\n ¿Esta seguro de realizar esta acción?',
        icon: 'info',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: 'red',
        showCloseButton: true,
        preConfirm: function accionEnviar() {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'opcion_bodega',
                    'ejecutar': enviar,
                    'idCpe': idCpe,
                    'idRecibe': recibe,
                    'idEnvia': usuarioR
                },
                beforeSend: function () {
                    $(".loader").fadeIn();
                },
                complete: function () {
                    $('.loader').fadeOut();
                },
            }).done(function (data) {
                if (data.type == 'success') {
                    Swal.fire({
                        title: 'Correcto!',
                        text: data.msg,
                        icon: 'success',
                        preConfirm: function refresh() {
                            location.href = '/apli/orden/bodega'
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error'
                    });
                }
            }).fail(function (textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            });
        }
    })
};