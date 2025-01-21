//INICIO
$(document).ready(function () {
    //TRAER LAS OLTS
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'searchOlts',
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function (data) {
        //OCULTAR EL LOADER
        $('#loadScreen').fadeOut();
        if (data.type === 'success') {
            for (var x in data.data) {
                $('#select_olt').append(`<option value="${data.data[x]['nombre_normalizado']}">${data.data[x]['nombre_central']}-${data.data[x]['nombre_normalizado']}</option>`);
            }
            // SELECT2
            $('#select_olt').select2({
                theme: 'bootstrap4'
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            }); 
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (jqXHR) {
    });    
});
// CONSULT BUTTON
$('#ejecutar').on('click', function () {
    if (select_olt.value !=0) {
        radio = $('input[name="optradio"]:checked').val();
        command = '';
        parameters = '';
        //ONT NO REGISTRADAS
        switch (radio) {
            case '1':
                command = 'show_onu_uncfg';
                parameters = '';    
            break;
            case '2':
                command = 'show_gpon_onu_state';
                parameters = slot_port_2.value;
                if ($('#slot_port_2').val() == "") {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Debe digitar la tarjeta y puerto',
                        icon: 'error'
                    });
                    $('#slot_port_2').focus();
                    return;
                }
            break;
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'ejecutar',
                'OLT': select_olt.value,
                'command': command,
                'parameters': parameters
                
            },
            beforeSend: function() {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $('#loadScreen').fadeOut();
            },
        }).done(function (data) {
            if (data.type === 'success') {
                $('#loadScreen').fadeOut();
                $("#carta_completa").css('visibility', 'visible');
                $("#response").html(`<div id="div_parrafo"><p>${data.data}</p></div>`)
            } else if (data.type === 'error'){
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error'
                }); 
            }
        }).fail(function (textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        })
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Debe seleccionar una OLTs',
            icon: 'error'
        }); 
    }    
});