$(document).ready(function() {
    $("#enviarBtn").click(sendForm);
});

function sendForm() {
    if (validateRadios()) {
        var answers_form = $("#form_encuesta").serializeArray();
        console.log(answers_form)
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'encuesta',
                'parameters': JSON.stringify(answers_form),
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $('#loadScreen').fadeOut();
            },
        }).done(function (data) {
            showSweetAlert(data.title, data.msg, data.type)
        }).fail(function (textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }) 
    } else {
        showSweetAlert('¡Alerta!', 'Debe completar todos los campos correctamente para cerrar la orden.', 'warning');
    }
};

function validateRadios() {
    let isValid = true;
    $("fieldset").each(function() {
        const radios = $(this).find("input[type='radio']");
        const isChecked = radios.is(":checked");

        if (!isChecked) {
            isValid = false;
            return false; // Salir del bucle si se encuentra un conjunto sin selección
        }
    });
    return isValid;
};

function showSweetAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
};
