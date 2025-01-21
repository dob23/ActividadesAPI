/**
* Este metodo es para realizar la prueba de linea
* @return:json con parámetros resultantes del test
* @author:Juan David Rodriguez
* @version:1.0
*/
const url = window.location.origin + "/apli/tools/";

function viewTestLine(phoneNumber){
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'viewTestLine',
            'phoneNumber': phoneNumber,
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $("#loadScreen").fadeOut('fast');
        },
    }).done(function (data) {
        if(data.type == 'error'){
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            })
        }else{
            document.getElementById('pruebaLinea').innerHTML = "";
            var parametros = data.data.NarrowBand
            var bodyTable = document.getElementById('pruebaLinea');
            bodyTable.innerHTML += `<tr>
                                        <th class="bg-light"><b>RequestID</b></th>
                                        <td>${data.data.RequestId}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>Tipo test</b></th>
                                        <td>${data.data.EventInformation.TestType}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>Fecha</b></th>
                                        <td>${data.data.EventInformation.Date}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>Valor</b></th>
                                        <td>${data.data.EventInformation.VerCode.Value}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>Tipo</b></th>
                                        <td> ${data.data.EventInformation.VerCode.Type}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>Categoria</b></th>
                                        <td>${data.data.EventInformation.VerCode.Category}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>Descripción</b></th>
                                        <td>${data.data.EventInformation.VerCode.Description}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>VA Cat</b></th>
                                        <td>${parametros.VACat}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>VA Cbt</b></th>
                                        <td>${parametros.VACbt}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>VA Cab</b></th>
                                        <td>${parametros.VACab}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>VD Cat</b></th>
                                        <td>${parametros.VDCat}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>VD Cbt</b></th>
                                        <td>${parametros.VDCbt}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>VD Cab</b></th>
                                        <td>${parametros.VDCab}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>RAT</b></th>
                                        <td>${parametros.Rat}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>RBT</b></th>
                                        <td>${parametros.Rbt}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>RAB</b></th>
                                        <td>${parametros.Rab}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>CTAT</b></th>
                                        <td>${parametros.Ctat}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>CTBT</b></th>
                                        <td>${parametros.Ctbt}</td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light"><b>CTAB</b></th>
                                        <td>${parametros.Ctab}</td>
                                    </tr>`
            $('#Linea').modal('show');
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
function viewParameters(phoneNumber){
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                'action': 'viewParameters',
                'telefono': phoneNumber
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn('fast');
            },
            complete: function () {
                $('#loadScreen').fadeOut('fast');
            },
        }).done(function (data) {
            $('#flag_component').html('')
            if (data.type==='error') {
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error'
                });
            } else {
                const parameters = data.data
                if(parameters.flagParameters === true){
                    var $flag_component = $("<div>", {
                        "class": "alert alert-success alert-dismissible",
                        html: `<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                                <h5><i class="icon fas fa-check"></i> Válido!</h5>
                                Los paŕametros cumplen con la normativa técnica de Emcali.`
                    })
                }
                else {
                    var $flag_component = $("<div>", {
                        "class": "alert alert-danger alert-dismissible",
                        html: `<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                                <h5><i class="icon fas fa-ban"></i> Inválido!</h5>
                                Los parámetros NO CUMPLEN con la normativa técnica de Emcali.`
                    })
                }  
                if(data.data.tecnologia==='ftth'){
                    $('#card_ftth').show();
                    $('#card_copper').hide();

                    $("#values_parameters_fiber tr td:eq(0)").html(`${parameters.power_down_olt_tx}&nbsp dBm`);
                    $("#values_parameters_fiber tr td:eq(1)").html(`${parameters.power_up_ont_tx}&nbsp dBm`);
                    $("#values_parameters_fiber tr td:eq(2)").html(`${parameters.power_up_Attenuation}&nbsp dBm`);
                    $("#values_parameters_fiber tr td:eq(3)").html(`${parameters.power_up_olt_rx}&nbsp dBm`);
                    $("#values_parameters_fiber tr td:eq(4)").html(`${parameters.power_down_ont_rx}&nbsp dBm`);
                    $("#values_parameters_fiber tr td:eq(5)").html(`${parameters.power_down_Attenuation}&nbsp dBm`);
                }
                else{
                    $('#card_ftth').hide();
                    $('#card_copper').show();

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
                }
                $("#flag_component").append($flag_component)
                $("#mdl_parameters").modal('show');
            }
        }).fail(function (textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        });
}
/**
* Este metodo enlista los cpe del instalador en bodega para luego cambiarlo con el del cliente
* @return: array con dispositivos en bodega del instalador
* @author:Juan David Rodriguez
* @version:1.0
*/
function viewChangeCPE(idContrato, idOldCPE, marcaCPE, tipoCPE, modeloCPE, serialCPE){
    $('#dispositivosBodega').empty();
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: {
            'action': 'getDevice',
            'tipoCPE': tipoCPE
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function(data){
        if (data.type == 'success') {
            $('#responseCurrentCPE').html("");
            strPrintout='';
            // Listar opciones del select
            //DEFAULT
            $('#dispositivosBodega').append(`<option value="0">Seleccionar Dispositivo</option>`);
            for(let i in data.data){
                $('#dispositivosBodega').append(`<option value="${data.data[i]['id__cpe']}"> ${data.data[i]['Tipo']} ${data.data[i]['nombre_marca']} Serial: ${data.data[i]['serial']} </option>`);
            }
            $('#dispositivosBodega').select2({
                dropdownParent: $('#mdl_changeCPE .modal-body'), 
                theme: 'bootstrap4'
            });
            strPrintout += `<div class="row">
                                <input type="hidden" id="idContrato" value="${idContrato}">
                                <input type="hidden" id="idOldCPE" value="${idOldCPE}">
                                <div class="col-sm-6"><b>Tipo:</b>${tipoCPE}</div>
                                <div class="col-sm-6"><b>Marca:</b>${marcaCPE}</div>
                                <div class="col-sm-6"><b>Modelo:</b>${modeloCPE}</div>
                                <div class="col-sm-6"><b>Serial:</b>${serialCPE}</div>
                            </div>`

            $("#responseCurrentCPE").html(strPrintout);
            $("#mdl_changeCPE").modal('show');
        } else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.msg,
            })
        }
    });
}
/**
* Este metodo asigan un cpe disponible en bodega a un suscriptor, y cpe viejo lo deja en custodia de el
* @return:json 
* @author:Juan David Rodriguez 2023-05-13
* @version:1.0
*/
$('#cambiarCpeSuscriptor').on('click', function(){
    if (dispositivosBodega.value != 0){
        $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: {
            'action': 'changeCpeSuscriber',
            'idOld': idOldCPE.value,
            'idNew': dispositivosBodega.value,
            'idContrato': idContrato.value,
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
        }).done( function(data){
            if (data.type == 'error') {
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error'
                })
            } else {
                $("#mdl_changeCPE").modal('hide');
                Swal.fire({
                    title: 'Correcto!',
                    text: data.msg,
                    icon: 'success'
                })
            }
        });
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: "Debe seleccionar un dispositivo",
        })
    }
});
function buscarCPElegalizar(phoneNumber) {
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'buscar_leg',
            'telefono':phoneNumber
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $("#loadScreen").fadeOut();
        },
    }).done(function(data) {
        if (data['type'] == 'error') {
            Swal.fire({
                title: 'Error!',
                text: data['msg'],
                icon: 'error'
            })
        } else {
            document.getElementById('campo').innerHTML = "";
            for (let i = 0; i < data.length; i++) {
                if (data[i].autorizacion == 'legalizado') {
                    document.getElementById('campo').innerHTML += `<tr>
                                                                        <td style='text-align:center'> ${data[i].tipo} </td>
                                                                        <td style='text-align:center'> ${data[i].framed_ip_address} </td>
                                                                        <td style='text-align:center'> ${data[i].mac} </td>
                                                                        <td style='text-align:center'> ${data[i].autorizacion} </td>
                                                                    </tr>`
                } else {
                    document.getElementById('campo').innerHTML += `<tr>
                                                                        <td style='text-align:center'> ${data[i].tipo} </td>
                                                                        <td style='text-align:center'> ${data[i].framed_ip_address} </td>
                                                                        <td style='text-align:center'> ${data[i].mac} </td>
                                                                        <td style='text-align:center'><button onClick="legalizar('${data[i].mac}', ${phoneNumber})" id='legalizar' class='btn btn-dark'><i class='nav-icon fas fa-clipboard'></i> Legalizar</button></td>
                                                                    </tr>`
                }
            }
            $('#modalBuscarLeg').modal('show');
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
function legalizar(mac, phoneNumber) {
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'legalizar',
            'telefono':phoneNumber,
            'mac': mac
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $("#loadScreen").fadeOut('fast');
        },
    }).done(function (data) {
        if (data.type == 'error') {
            Swal.fire({
                title: 'Error!',
                text: data.mess,
                icon: 'error'
            })
        } else {
            Swal.fire({
                title: 'Correcto!',
                text: data.mess,
                icon: 'success'
            })
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
/**
* Este trae la configuracion de wifi
* @return:json 
* @author:Juan David Rodriguez 2023-05-17
* @version:1.0
*/
function getWifiConfig(uam,tarjeta, puerto, instancia){
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'getWifiConfig',
            'uam': uam,
            'tarjeta': tarjeta,
            'puerto': puerto,
            'instancia': instancia
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $("#loadScreen").fadeOut('fast');
        },
    }).done(function(data) {
        parametersHidden='';
        if(data.type == 'success'){
            parametersHidden +=`<input type="hidden" id="uam" value="${uam}">
                                <input type="hidden" id="tarjeta" value="${tarjeta}">
                                <input type="hidden" id="puerto" value="${puerto}">
                                <input type="hidden" id="instancia" value="${instancia}">`
            $("#hiddenParameters").html(parametersHidden);

            $("#responseCurrentWifiConfig_24Ghz").val(data.data[0]);
            $("#responseCurrentWifiConfig_5Ghz").val(data.data[1]);
            $("#responseNewSSID").val("");
            $("#respondeNewPassword").val("");

            // ACCION DE MOSTRAR OCULTAR CONTRASEÑA DEL MODAL
            $("#show_password").click(function() {
                let contrasenaInput = $("#respondeNewPassword");
              
                if (contrasenaInput.attr("type") === "password") {
                  contrasenaInput.attr("type", "text");
                } else {
                  contrasenaInput.attr("type", "password");
                }
              });

            $("#mdl_wifiConfig").modal('show');
        } else{
            Swal.fire({
                title: 'Error',
                text: data.msg,
                icon: 'error'
            })
        }
        
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
/**
* Envia la configuracion de wifi por gestion nivel 3
* @return:json 
* @author:Juan David Rodriguez 2023-05-17
* @version:1.0
*/
$('#changeWifiConfig').on('click', function () {
    let validateSSID = /^[a-zA-Z0-9_]+$/;
    let validatePassword = /^[\w\@\!\*\+]+$/;

    if (responseNewSSID.value != "" && respondeNewPassword.value !=""){
        if(responseNewSSID.value.length >= 8 && validateSSID.test(responseNewSSID.value) && respondeNewPassword.value.length >= 8 && validatePassword.test(respondeNewPassword.value)){
            console.log("Input Valido");
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {
                    'action': 'changeWifiConfig',
                    'uam': uam.value,
                    'tarjeta': tarjeta.value,
                    'puerto': puerto.value,
                    'instancia': instancia.value,
                    'ssid': responseNewSSID.value,
                    'password': respondeNewPassword.value
                },
                beforeSend: function () {
                    $("#loadScreen").fadeIn();
                },
                complete: function () {
                    $('#loadScreen').fadeOut();
                },
                }).done( function(data){
                    if (data.type == 'error') {
                        Swal.fire({
                            title: 'Error!',
                            text: data.msg,
                            icon: 'error'
                        })
                    } else {
                        $("#mdl_wifiConfig").modal('hide');
                        Swal.fire({
                            title: 'Correcto!',
                            text: data.msg,
                            icon: 'success'
                        })
                    }
                });
        }
        else{
            Swal.fire({
                title: 'Error',
                text: 'Ingrese valores válidos para cambiar la configuración del Wifi',
                icon: 'error'
            })
        };
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: "Debe escribir un SSID y contraseña",
        })
    }
})
/**
* Envia los parametros para enrutar ordenes de SMQR a la cola danos fibra
* @return:Sweet alert con respuesta del WS 
* @author:Juan David Rodriguez 2023-05-20
* @version:1.0
*/
function smqrRouteReport(phoneNumber){
    // Limpiar campos
    $("#locationRedirectOT").val("0")
    $("#causalRedirectOT").val("0")
    $("#observations").val("");

    $("#mdl_redirectot_smqr").modal('show');

    $("#redirectOtSmqr").click(function(){
        let arrData = {
            phoneNumber: phoneNumber,
            queueCode: $("#queueFTTH").val(),
            locationCode: $("#locationRedirectOT").val(),
            failureCauseCode: $("#causalRedirectOT").val(),
            comments: $("#observations").val()
        };
        if(arrData.failureCauseCode, arrData.locationCode != 0 && arrData.comments != ""){
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {
                    'action': 'redirectOt',
                    'parameters': JSON.stringify(arrData)
                },
                beforeSend: function(){
                    $('#loadScreen').fadeIn();
                },
                complete: function(){
                    $('#loadScreen').fadeOut();
                },
            }).done(function(data){
                $("#mdl_redirectot_smqr").modal('hide');
                console.log(data)
                if(data.type== 'success'){
                    Swal.fire({
                        title: 'Correcto!',
                        text: data.msg,
                        icon: 'success'
                    })
                    setTimeout(function () {
                        location.href = window.location.pathname
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
        else {
            Swal.fire({
                title: 'Advertencia',
                text: 'Debe rellenar todos los campos',
                icon: 'warning'
            });
        }
        
    })
} 
function setCustomerLdap(suscriptor){
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: {
            'action': 'setCustomerLdap',
            'suscriptor': suscriptor
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
                title: 'Sincronizado!',
                text: data.msg,
                icon: 'success'
            })
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            })
        }
    });
}

function ConfigurationCPE(phoneNumber){
    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        data: {
            'action': 'ConfigurationCPE',
            'parameters': phoneNumber
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        }
    }).done(function(data){
        if (data.type == 'success') {
            let msg_config = '';
            for(const [key, value] of Object.entries(data.data)){
                msg_config += `<div><b>${key}:</b> ${value}</div>`;
            };
            Swal.fire({
                title: 'Configurado!',
                html: msg_config,
                icon: 'success'
            })
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            })
        }
    })
}

function closeOT(phoneNumber){
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'viewParameters',
            'telefono': phoneNumber
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $("#loadScreen").fadeOut('fast');
        },
    }).done(function(data){
        if(data.type === 'success'){
            if(data.data.flagParameters == true){
                window.sessionStorage.setItem("parameters", JSON.stringify(data.data));
                window.location.href = window.location.origin.concat('/apli/orden/close/')
            }
            else {
                Swal.fire({
                    title: '¡Advertencia!',
                    text: 'Los parámetros no cumplen con la normativa de Emcali.',
                    icon: 'warning'
                });
            }
        }
        else{
            Swal.fire({
                title: 'Error!',
                text: 'No se logró obtener información del puerto.',
                icon: 'error'
            });
        }
    })
}

function viewLastConnections(phoneNumber){
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'lastConnections',
            'phoneNumber': phoneNumber,
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $("#loadScreen").fadeOut('fast');
        },
    }).done(function (data) {
        if(data.type == 'error'){
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            })
        } else {
            console.warn("entro");
            console.warn(data);
            parametersHidden = '';
            data.data.forEach(elemento => {
                console.log(elemento);
                parametersHidden += `<tr>
                                        <td style='text-align:center'> ${elemento.type} </td>
                                        <td style='text-align:center'> ${elemento.Framed_IP_Address}</td>
                                        <td style='text-align:center'> ${elemento.bras_mac}</td>
                                        <td style='text-align:center'> ${elemento.Acct_Start_Time}</td>
                                        <td style='text-align:center'> ${elemento.speed_down}</td>
                                        <td style='text-align:center'> ${elemento.speed_up}</td>
                                        <td style='text-align:center'> ${elemento.BRASName}</td>
                                    </tr>`;
            });
            $("#campoLastConnections").html(parametersHidden);
            $('#modalLastConnections').modal('show');
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
function viewParametersPortFtth(nameUam, slot, port, instance) {
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: {
            'action': 'viewParametersPortFtth',
            'nameUam': nameUam,
            'slot': slot,
            'port': port,
            'instance': instance,
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $('#loadScreen').fadeOut('fast');
        },
    }).done(function (data) {
        console.warn(data);
        $('#flag_component').html('')
        if (data.type==='error') {
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            });
        } else {
            const parameters = data.data
            if(parameters.flagParameters === true){
                var $flag_component = $("<div>", {
                    "class": "alert alert-success alert-dismissible",
                    html: `<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                            <h5><i class="icon fas fa-check"></i> Válido!</h5>
                            Los paŕametros cumplen con la normativa técnica de Emcali.`
                })
            }
            else {
                var $flag_component = $("<div>", {
                    "class": "alert alert-danger alert-dismissible",
                    html: `<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                            <h5><i class="icon fas fa-ban"></i> Inválido!</h5>
                            Los parámetros NO CUMPLEN con la normativa técniva de Emcali.`
                })
            }  
            if(data.data.tecnologia==='ftth'){
                $('#card_ftth').show();
                $('#card_copper').hide();

                $("#values_parameters_fiber tr td:eq(0)").html(`${parameters.power_down_olt_tx}&nbsp dBm`);
                $("#values_parameters_fiber tr td:eq(1)").html(`${parameters.power_up_ont_tx}&nbsp dBm`);
                $("#values_parameters_fiber tr td:eq(2)").html(`${parameters.power_up_Attenuation}&nbsp dBm`);
                $("#values_parameters_fiber tr td:eq(3)").html(`${parameters.power_up_olt_rx}&nbsp dBm`);
                $("#values_parameters_fiber tr td:eq(4)").html(`${parameters.power_down_ont_rx}&nbsp dBm`);
                $("#values_parameters_fiber tr td:eq(5)").html(`${parameters.power_down_Attenuation}&nbsp dBm`);
            }
            else{
                $('#card_ftth').hide();
                $('#card_copper').show();

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
            }
            $("#flag_component").append($flag_component)
            $("#mdl_parameters").modal('show');
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
function viewLastConnectionsUsername(username){
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'lastConnectionsUserName',
            'username': username,
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $("#loadScreen").fadeOut('fast');
        },
    }).done(function (data) {
        if(data.type == 'error'){
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            })
        } else {
            console.warn("entro");
            console.warn(data);
            parametersHidden = '';
            data.data.forEach(elemento => {
                console.log(elemento);
                parametersHidden += `<tr>
                                        <td style='text-align:center'> ${elemento.type} </td>
                                        <td style='text-align:center'> ${elemento.Framed_IP_Address}</td>
                                        <td style='text-align:center'> ${elemento.bras_mac}</td>
                                        <td style='text-align:center'> ${elemento.Acct_Start_Time}</td>
                                        <td style='text-align:center'> ${elemento.speed_down}</td>
                                        <td style='text-align:center'> ${elemento.speed_up}</td>
                                        <td style='text-align:center'> ${elemento.BRASName}</td>
                                    </tr>`;
            });
            $("#campoLastConnections").html(parametersHidden);
            $('#modalLastConnections').modal('show');
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
function configurationWifi(idCustomer,nameDevice, slot, port, instance, serialOnt, description) {
    var arrData = new Object();
    arrData.idCustomer = idCustomer;
    arrData.nameDevice = nameDevice;
    arrData.slot = slot;
    arrData.port = port;
    arrData.instance = instance;
    arrData.serialOnt = serialOnt;
    arrData.description = description;
    arrData.mode = 'trunk';
    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        data: {
            'action': 'configurationWifi',
            'parameters': arrData
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        }
    }).done(function(data){
        if (data.type == 'success') {
            Swal.fire({
                title: 'Configurado!',
                html: data.msg,
                icon: 'success'
            })
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            })
        }
    })
}
function buscarCPElegalizarDn(dn,container,base) {
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'buscar_leg_dn',
            'dn': dn,
            'container': container,
            'base':base
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $("#loadScreen").fadeOut();
        },
    }).done(function (data) {
        //console.warn(data);
        if (data['type'] == 'error') {
            Swal.fire({
                title: 'Error!',
                text: data['msg'],
                icon: 'error'
            })
        } else {
            document.getElementById('campo').innerHTML = "";
            dataFinal = data.data;
            for (let i = 0; i < dataFinal.length; i++) {
                if (dataFinal[i].authorization == 'legalizado') {
                    document.getElementById('campo').innerHTML += `<tr>
                                                                        <td style='text-align:center'> ${dataFinal[i].type} </td>
                                                                        <td style='text-align:center'> ${dataFinal[i].framed_ip_address} </td>
                                                                        <td style='text-align:center'> ${dataFinal[i].mac} </td>
                                                                        <td style='text-align:center'> ${dataFinal[i].authorization} </td>
                                                                    </tr>`
                } else {
                    document.getElementById('campo').innerHTML += `<tr>
                                                                        <td style='text-align:center'> ${dataFinal[i].type} </td>
                                                                        <td style='text-align:center'> ${dataFinal[i].framed_ip_address} </td>
                                                                        <td style='text-align:center'> ${dataFinal[i].mac} </td>
                                                                        <td style='text-align:center'><button onClick="legalizarDn('${dataFinal[i].mac}','${dn}','${container}','${base}')" id='legalizar' class='btn btn-dark'><i class='nav-icon fas fa-clipboard'></i> Legalizar</button></td>
                                                                    </tr>`
                }
            }
            $('#modalBuscarLeg').modal('show');
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
function legalizarDn(mac,dn,container,base) {
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'action': 'legalizarDn',
            'mac': mac,
            'dn': dn,
            'container': container,
            'base':base
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $("#loadScreen").fadeOut('fast');
        },
    }).done(function (data) {
        if (data.type == 'success') {
            Swal.fire({
                title: 'Correcto!',
                text: data.msg,
                icon: 'success'
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