$(document).ready(function () {
    $('#loadScreen').fadeOut();
    var idTechnology = sessionStorage.getItem("idTechnology")
    const parameters = JSON.parse(sessionStorage.getItem("parameters"));

    if (idTechnology != 5){
        //STEP 1 - Inicializar vista parameteros
        $('#card_ftth').hide();
        $('#card_copper').show();

        $('#technology_suscriber2').html(function(index, oldHtml) {
            return `<strong>${oldHtml}</strong>&nbsp ${(parameters.tecnologia).toUpperCase()}`;
        });
        $('#state').html(function(index, oldHtml) {
            return `<strong>${oldHtml}</strong>&nbsp ${(parameters.manageState).toUpperCase()}`;
        });
        $("#values_parameters_copper tr td:eq(0)").html(`${parameters.AturChanCurrTxRate}&nbsp Kbps`);
        $("#values_parameters_copper tr td:eq(1)").html(`${parameters.AtucChanCurrTxRate}&nbsp Kbps`);
        $("#values_parameters_copper tr td:eq(2)").html(`${parameters.AtucCurrSnrMgn}&nbsp dB`);
        $("#values_parameters_copper tr td:eq(3)").html(`${parameters.AturCurrSnrMgn}&nbsp dB`);
        $("#values_parameters_copper tr td:eq(4)").html(`${parameters.AtucCurrAtn}&nbsp dB`);
        $("#values_parameters_copper tr td:eq(5)").html(`${parameters.AturCurrAtn}&nbsp dB`);
        $("#values_parameters_copper tr td:eq(6)").html(`${parameters.AturOutputPwr}&nbsp dB`);
        $("#values_parameters_copper tr td:eq(7)").html(`${parameters.AtucOutputPwr}&nbsp dB`);
        $("#values_parameters_copper tr td:eq(8)").html(`${parameters.AturAttainableRate}&nbsp Kbps`);
        $("#values_parameters_copper tr td:eq(9)").html(`${parameters.AtucAttainableRate}&nbsp Kbps`);
        // STEP 3 - Inicializar formulario materiales
        $('.fibra').hide()
        $('.cobre').show()
    }
    else {
        //STEP 1 - Inicializar vista parameteros
        $('#card_ftth').show();
        $('#card_copper').hide();

        $('#technology_suscriber').html(function(index, oldHtml) {
            return `<strong>${oldHtml}</strong>&nbsp ${(parameters.tecnologia).toUpperCase()}`;
        });    
        $('#type_conector').html(function(index, oldHtml) {
            return `<strong>${oldHtml}</strong>&nbsp ${(parameters.sfp).toUpperCase()}`;
        });
        $("#values_parameters_fiber tr td:eq(0)").html(`${parameters.power_down_olt_tx}&nbsp dBm`);
        $("#values_parameters_fiber tr td:eq(1)").html(`${parameters.power_up_ont_tx}&nbsp dBm`);
        $("#values_parameters_fiber tr td:eq(2)").html(`${parameters.power_up_Attenuation}&nbsp dBm`);
        $("#values_parameters_fiber tr td:eq(3)").html(`${parameters.power_up_olt_rx}&nbsp dBm`);
        $("#values_parameters_fiber tr td:eq(4)").html(`${parameters.power_down_ont_rx}&nbsp dBm`);
        $("#values_parameters_fiber tr td:eq(5)").html(`${parameters.power_down_Attenuation}&nbsp dBm`);
        // STEP 3 - Inicializar formulario materiales
        $('.fibra').show()
        $('.cobre').hide()
    }
});
let currentStep = 1;
let isStep2Validated = false;

function updateProgress() {
    const progressWidth = currentStep * 25;
    const progressBar = $("#progressBar").css("width", `${progressWidth}%`);

    $(".circle").each(function (index) {
        $(this).toggleClass("grey", index >= currentStep).find("i").toggleClass("green-icon", index < currentStep);
    });
    $(".step").each(function (index) {
        $(this).toggleClass("valid", index <= currentStep);
    });

    const prevBtn = $("#prevBtn").prop("disabled", currentStep === 1);
    const nextBtn = $("#nextBtn").prop("disabled", currentStep === 4);
    
    // Show/hide step blocks using switch case
    $("#block_step1").toggle(currentStep === 1);
    $("#block_step2").toggle(currentStep === 2);
    $("#block_step3").toggle(currentStep === 3);
    $("#block_step4").toggle(currentStep === 4);
}
async function nextStep() {
    if (currentStep === 2) {
        try {
            await internetValidation();
            currentStep++;
            updateProgress();
        } catch (error) {
            Swal.fire({
                title: '¡Alerta!',
                text: 'Debe validar el internet antes de continuar con el cierre de la orden.',
                icon: 'warning'
            });
        }
    }
    else if (currentStep === 3){
        try {
            await materialsValidation();
            currentStep++;
            updateProgress();
        } catch (error) {
            Swal.fire({
                title: '¡Alerta!',
                text: 'Debe completar correctamente el formulario antes de continuar.',
                icon: 'warning'
            });
            return; // Salir de la función si la validación falla
        }
    }
    else if (currentStep < 4) {
        currentStep++;
        updateProgress();
    }
}
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
    }
}
// Marcar el primer círculo como válido y configurar el progreso inicial
$(".circle:first").removeClass("grey").find("i").addClass("green-icon");
updateProgress();

function closeOT(){
    var usedMaterials = $('#materials_form').serializeArray();

    const arrData = {
        'materiales': usedMaterials,
        'orden': sessionStorage.getItem('idOrden'),
        'instalador': sessionStorage.getItem('instalador'),
        'loginSigt': sessionStorage.getItem('loginSigt'),
        'tipoOrden': sessionStorage.getItem("tipoOrden"),
        'tecnologia': sessionStorage.getItem("technology"),
        'idTecnologia': sessionStorage.getItem("idTechnology"),
        'telefono': sessionStorage.getItem("phoneNumber"),
        'firma': sessionStorage.getItem("signature"),
        'itemCambioMedio': $("input[name='optionItemCambioMedio']:checked").val() || "0",
        'checkTypeOt': sessionStorage.getItem("checkTypeOt"),
        'parameters': sessionStorage.getItem("parameters"),
        'name': $("#name").val(),
        'identification': $("#identification").val(),
        'contact_phoneNumber': $("#contact_phoneNumber").val(),
        'observations': $("#observations").val(),
        'reparationCode': $("#reparacion").val() || '0',
        'failureCauseCode': $("#causa").val() || '0',
        'locationCode': $("#localizacion").val() || '0',
        'mail': sessionStorage.getItem("mail"),
        'idReparador': sessionStorage.getItem("idReparador") || '0',
    }
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'closeOT',
            'parameters': JSON.stringify(arrData)
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function(data){
        if (data.type == 'success') {
            Swal.fire({
                title: 'Correcto!',
                text: data.msg,
                icon: 'success'
            })
            setTimeout(function () {
                location.href = window.location.origin.concat('/apli/dashboard/');
                sessionStorage.clear();
            }, 1500);
        }else {
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