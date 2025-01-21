function migrarSip(phoneNumber) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'migrarSip',
            'phone': phoneNumber,
        },
        beforeSend: function () {
            $(".loader").fadeIn('fast');
        },
        complete: function () {
            $('.loader').fadeOut('fast');
        },
    }).done(function (data) {
        if (data.type == 'error') {
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            })
        } else {
            Swal.fire({
                title: 'Correcto!',
                text: data.msg,
                icon: 'success'
            })
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
};
function redirectOt(idOrden){
    // Limpiar campos
    $("#causalRedirectOT").val("0");
    $("#observations").val("");

    $("#mdl_redirectot").modal('show');

    $("#redirectOT").click(function(){
        let queueFTTH = $("#queueFTTH").val();
        let causalRedirectOT = $("#causalRedirectOT").val();
        let observations = $("#observations").val();

        if(causalRedirectOT != "0" && observations !=""){
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    'action': 'redirectOt',
                    'idOrden': idOrden,
                    'queueFTTH': queueFTTH,
                    'causalRedirectOT': causalRedirectOT,
                    'observations': observations
                },
                beforeSend: function(){
                    $('#loadScreen').fadeIn();
                },
                complete: function(){
                    $('#loadScreen').fadeOut();
                },
            }).done(function(data){
                $("#mdl_redirectot").modal('hide');
                if(data.type== 'success'){
                    Swal.fire({
                        title: 'Correcto!',
                        text: 'Se enruto orden con exito',
                        icon: 'success'
                    })
                    setTimeout(function () {
                        location.href = '/apli/orden/instalaciones/activas/'
                    }, 1500);
                }
                else{
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error'
                    });
                }
            });
        }
        else{
            Swal.fire({
                title: 'Advertencia',
                text: "Por favor llene todos los campos",
                icon: 'warning'
            })
        }
    });
};
function setDeviceOt(){
    let html = '', select_new_html = '';
    let ontSelectedValues = '', stbSelectedValues = [];
    let customerDevices = JSON.parse(sessionStorage.getItem("customerDevices"));
    let NumAditionalDeviceSTB = sessionStorage.getItem("NumAditionalDeviceSTB");
    let idOrden = sessionStorage.getItem("idOrden");
    const numStbOptions = Math.abs(customerDevices.length-1)
    switch (true){
        // Only ONT
        case NumAditionalDeviceSTB == 0 && customerDevices.length == 0: 
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    'action': 'getDevice',
                    'tipoCPE': 'CPE'
                },
                beforeSend: function () {
                    $("#loadScreen").fadeIn();
                },
                complete: function () {
                    $('#loadScreen').fadeOut();
                },
            }).done(function(data){
                if(data.type === 'success'){
                    $("#mdl_setDeviceOt").modal('show');
                    select_new_html += `<select class="ontDevice form-control">
                                            <option value="0">Seleccione una opción</option>
                                        </select>
                                        <br>`;
                    $("#select_new_devices").html(select_new_html);
                    $('.ontDevice').each(function() {
                        var $select = $(this);
                        for (let i in data.data) {
                            $select.append(`<option value="${data.data[i]['serial']}"> ${data.data[i]['Tipo']} ${data.data[i]['nombre_marca']} Serial: ${data.data[i]['serial']} </option>`);
                        }
                    });
                    $('#setDeviceSuscriptor').on('click', function() {
                        $('.ontDevice').each(function() {
                            var selectedOption = $(this).val();
                            ontSelectedValues = selectedOption;
                        });
                        $.ajax({
                            url: window.location.pathname,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                'action': 'setDeviceOt',
                                'idOrden': idOrden,
                                'cpe': ontSelectedValues,
                                'stb': JSON.stringify(stbSelectedValues)
                            },
                            beforeSend: function () {
                                $("#loadScreen").fadeIn();
                            },
                            complete: function () {
                                $('#loadScreen').fadeOut();
                            },
                        }).done(function(data){
                            if(data.type === 'success'){
                                Swal.fire({
                                    title: 'Correcto!',
                                    text: data.msg,
                                    icon: 'success'
                                })
                                setTimeout(function () {
                                    location.href = window.location.pathname
                                }, 1500);
                            }
                            else {
                                Swal.fire({
                                    title: 'Error!',
                                    text: data.msg,
                                    icon: 'error'
                                });
                            }
                        })
                    });
                }
                else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'No hay dispositivos en su bodega para asignar.',
                        icon: 'error'
                    });
                }
            })
            break;
        // Only STB
        case NumAditionalDeviceSTB != 0 && customerDevices.length >= 1:
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    'action': 'getDevice',
                    'tipoCPE': 'STB'
                },
                beforeSend: function () {
                    $("#loadScreen").fadeIn();
                },
                complete: function () {
                    $('#loadScreen').fadeOut();
                },
            }).done(function(data){
                if (data.type === 'success') {
                    $("#mdl_setDeviceOt").modal('show');
                    customerDevices.forEach((e, index) => {
                        if (index === 0) {
                            html += `<select class="ontDevice form-control">
                                        <option value="${e.serial}">${e.tipo} ${e.marca} Serial: ${e.serial}</option>
                                    </select>
                                    <br>`;
                        } else {
                            html += `<select class="stbDevices form-control">
                                        <option value="${e.serial}">${e.tipo} ${e.marca} Serial: ${e.serial}</option>
                                    </select>
                                    <br>`;
                        }
                    });
                    $("#current_devices").html(html);
                    // Generamos los select requeridos de acuerdo al numero de puntos adicionales (npa) y los cpes aginados
                    for (let i = 0; i < numStbOptions; i++) {
                        select_new_html += `<select class="stbDevices form-control">
                                                <option value="0">Seleccione una opción</option>
                                            </select>
                                            <br>`;
                    }
                    $("#select_new_devices").html(select_new_html);
                    // Agregar opciones a todos los select, y bloquear para evitar opciones repetidas
                    $('.stbDevices').each(function(index, element) {
                        var $select = $(element);
                        for (let i in data.data) {
                            $select.append(`<option value="${data.data[i]['serial']}"> ${data.data[i]['Tipo']} ${data.data[i]['nombre_marca']} Serial: ${data.data[i]['serial']} </option>`);
                        }
                        $select.on('change', function() {
                            var selectedOption = $(this).val();
                            if (selectedOption === '0') {
                                return;
                            }
                            $('.stbDevices').not(this).each(function() {
                                var $otherSelect = $(this);
                                $otherSelect.find('option').prop('disabled', false); // Habilita todas las opciones en cada cambio
                                var selectedOptions = $('.stbDevices').not($otherSelect).map(function() {
                                    return $(this).val();
                                }).get(); 
                                $otherSelect.find('option').each(function() {
                                    var optionValue = $(this).val();
                                    if (optionValue !== '0' && selectedOptions.includes(optionValue)) {
                                        $(this).prop('disabled', true); // Bloquea las opciones que ya han sido seleccionadas en otros select
                                    }
                                });
                            });
                        });
                    });
                    $('#setDeviceSuscriptor').on('click', function() {
                        $('.ontDevice').each(function() {
                            var selectedOption = $(this).val();
                            ontSelectedValues = selectedOption;
                        });
                        $('.stbDevices').each(function() {
                            var selectedOption = $(this).val();
                            stbSelectedValues.push(selectedOption);
                        });
                        const validateIdDevices = stbSelectedValues.some((value) => value == 0);
                        if(validateIdDevices){
                            Swal.fire({
                                title: 'Error!',
                                text: 'Seleccione un dispositivo en todos los campos.',
                                icon: 'info'
                            });
                        }
                        else {
                            $.ajax({
                                url: window.location.pathname,
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    'action': 'setDeviceOt',
                                    'idOrden': idOrden,
                                    'cpe': ontSelectedValues,
                                    'stb': JSON.stringify(stbSelectedValues)
                                },
                                beforeSend: function () {
                                    $("#loadScreen").fadeIn();
                                },
                                complete: function () {
                                    $('#loadScreen').fadeOut();
                                },
                            }).done(function(data){
                                if(data.type === 'success'){
                                    Swal.fire({
                                        title: 'Correcto!',
                                        text: data.msg,
                                        icon: 'success'
                                    })
                                    setTimeout(function () {
                                        location.href = window.location.pathname
                                    }, 1500);
                                }
                                else {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: data.msg,
                                        icon: 'error'
                                    });
                                }
                            })
                        }
                    })
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'No hay dispositivos en su bodega para asignar.',
                        icon: 'error'
                    });
                }
            })
        break;
        // ONT and STB
        case NumAditionalDeviceSTB != 0 && customerDevices.length == 0:
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    'action': 'getDevice',
                    'tipoCPE': ''
                },
                beforeSend: function () {
                    $("#loadScreen").fadeIn();
                },
                complete: function () {
                    $('#loadScreen').fadeOut();
                },
            }).done(function(data){
                if(data.type === 'success'){
                    $("#mdl_setDeviceOt").modal('show');
                    const alldata = data.data
                    const arraySTB = alldata.filter(item => item.Tipo === 'STB');
                    const arrayONTCPE = alldata.filter(item => item.Tipo === 'ONT' || item.Tipo === 'CPE');
                    // Generar select para ont
                    html += `<select class="ontDevice form-control">
                                <option value="0">Seleccione una opción </option>
                            </select>
                            <br>`
                    $("#current_devices").html(html);
                    // Generar selects para stb
                    for (let i = 0; i < NumAditionalDeviceSTB; i++) {
                        select_new_html += `<select class="stbDevices form-control">
                                                <option value="0">Seleccione una opción</option>
                                            </select>
                                            <br>`;
                    }
                    $("#select_new_devices").html(select_new_html);
                    // Agregar opciones a todos los select, y bloquear para evitar opciones repetidas
                    $('.ontDevice').each(function() {
                        var $select = $(this);
                        for (let i in arrayONTCPE) {
                            $select.append(`<option value="${arrayONTCPE[i]['serial']}"> ${arrayONTCPE[i]['Tipo']} ${arrayONTCPE[i]['nombre_marca']} Serial: ${arrayONTCPE[i]['serial']} </option>`);
                        }
                    });
                    $('.stbDevices').each(function(index, element) {
                        var $select = $(element);
                        for (let i in arraySTB) {
                            $select.append(`<option value="${arraySTB[i]['serial']}"> ${arraySTB[i]['Tipo']} ${arraySTB[i]['nombre_marca']} Serial: ${arraySTB[i]['serial']} </option>`);
                        }
                        $select.on('change', function() {
                            var selectedOption = $(this).val();
                            if (selectedOption === '0') {
                                return;
                            }
                            $('.stbDevices').not(this).each(function() {
                                var $otherSelect = $(this);
                                $otherSelect.find('option').prop('disabled', false); // Habilita todas las opciones en cada cambio
                                var selectedOptions = $('.stbDevices').not($otherSelect).map(function() {
                                    return $(this).val();
                                }).get(); 
                                $otherSelect.find('option').each(function() {
                                    var optionValue = $(this).val();
                                    if (optionValue !== '0' && selectedOptions.includes(optionValue)) {
                                        $(this).prop('disabled', true); // Bloquea las opciones que ya han sido seleccionadas en otros select
                                    }
                                });
                            });
                        });
                    });
                    $('#setDeviceSuscriptor').on('click', function() {
                        $('.ontDevice').each(function() {
                            var selectedOption = $(this).val();
                            ontSelectedValues = selectedOption;
                        });
                        $('.stbDevices').each(function() {
                            var selectedOption = $(this).val();
                            stbSelectedValues.push(selectedOption);
                        });
                        const validateIdDevices = stbSelectedValues.some((value) => value == 0);
                        if(validateIdDevices){
                            Swal.fire({
                                title: 'Error!',
                                text: 'Seleccione un dispositivo en todos los campos.',
                                icon: 'info'
                            });
                        }
                        else {
                            $.ajax({
                                url: window.location.pathname,
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    'action': 'setDeviceOt',
                                    'idOrden': idOrden,
                                    'cpe': ontSelectedValues,
                                    'stb': JSON.stringify(stbSelectedValues)
                                },
                                beforeSend: function () {
                                    $("#loadScreen").fadeIn();
                                },
                                complete: function () {
                                    $('#loadScreen').fadeOut();
                                },
                            }).done(function(data){
                                if(data.type === 'success'){
                                    Swal.fire({
                                        title: 'Correcto!',
                                        text: data.msg,
                                        icon: 'success'
                                    })
                                    setTimeout(function () {
                                        location.href = window.location.pathname
                                    }, 1500);
                                }
                                else {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: data.msg,
                                        icon: 'error'
                                    });
                                }
                            })
                        }
                    })
                }
                else{
                    Swal.fire({
                        title: 'Error!',
                        text: 'No hay dispositivos en su bodega para asignar.',
                        icon: 'error'
                    });
                }
            })
        break;
    }
}
