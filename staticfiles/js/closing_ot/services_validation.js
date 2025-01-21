//DATOS CUSTOMER DEVICE - STEP 2
const customerDevices = JSON.parse(sessionStorage.getItem("customerDevices"));
const ontValues = customerDevices[0];

$("#marca").text(ontValues.marca);
$("#modelo").text(ontValues.modelo);
$("#serial").text(ontValues.serial);
$("#mac").text(ontValues.mac);

// VALIDACION SERVICIOS-INTERNET | PASO 2
function internetValidation() {
    return new Promise(function(resolve, reject) {
        if (!isStep2Validated){
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'validateInternet',
                    'phoneNumber': sessionStorage.getItem("phoneNumber"),
                    'speed_up': sessionStorage.getItem("speed_up"),
                    'speed_down': sessionStorage.getItem("speed_down")
                },
                beforeSend: function () {
                    $("#loadScreen").fadeIn();
                },
                complete: function () {
                    $('#loadScreen').fadeOut();
                },
            }).done(function(data){
                if(data.type === 'success'){
                    $('#ip_address').text(data.data.ip_address).removeClass('text-danger').css('color', 'green');
                    $('#speed').html(`${(data.data.speed_down)/1000} Mbps`).removeClass('text-danger').css('color', 'green');
        
                    Swal.fire({
                        title: '¡Correcto!',
                        text: 'Se comprobó satisfactoriamente la dirección IP y la velocidad contratada.',
                        icon: 'success'
                    });
                    isStep2Validated = true;
                    $('#block_internet_validation').html(`<button id='block_internet_validation' class='btn btn-outline-success' disabled><i class='fa-solid fa-wifi'></i> INTERNET VALIDADO</button>`)
                    resolve();
                }
                else{
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error'
                    });
                    reject();
                }
            });
        } else {
            resolve();
        }
    })
}