// LOADER
$(document).ready(function () {
    $('#loadScreen').fadeOut();
});
var uam_name, tecnologiaOrden, telefono;

function consultarDetalles() {
    var comercial = '', infraest = '', cpePrintOut = '';
    telefono = document.getElementById('monitoreo').value;
    $("#response_unit").html("");
    $("#response_unit2").html(""); 
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'monitoreo',
            'telefono': telefono,
        },
        beforeSend: function() {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $('#loadScreen').fadeOut('fast');
        },
    }).done(function (d) {
        //console.log(d)
        if (d == 'error') {
            Swal.fire({
                title: 'Error!',
                text: 'No se encontro información sobre este número.',
                icon: 'error'
            });
        } else {
            $('#getWifiConfig').remove();
            $('#phoneNumber').val(d.commercial.telefono_factura);
            detailedInfo.style.visibility = 'visible'
            // COMERCIAL LIST
            comercial += `<div class="row">`
                $.each(Object.entries(d.commercial), function(index, [key,value]){
                    comercial += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                })
            comercial += `</div>`
            $('#comercial').html(comercial);
            // INFRAESTRUCTURE
            // CUANDO ES FIBRA
            if (d.Idtecnologia == 5) {
                $('#testLine').hide();
                infraest += `<div class="row">`
                            $.each(Object.entries(d.infrastructure.datos), function(index, [key,value]){
                                infraest += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                            })
                infraest += `</div>`
                $('#infrastructure').html(infraest);
                // VALIDACION PARA AGREGAR BOTON CAMBIAR WIFI CONFIG
                if(d.Idtecnologia == 5 && d.device.cpe[0] != undefined && d.device.cpe[0].marca == "FIBERHOME"){
                    $('#botones').append(`<button onClick="getWifiConfig('${d.infrastructure.datos.uam}','${d.infrastructure.datos.tarjeta}','${d.infrastructure.datos.puerto}','${d.infrastructure.datos.instancia}')" id="getWifiConfig" class="btn btn-secondary"><i class="fa-solid fa-wifi"></i> Wifi </button>`)
                }
            } else {
                $('#testLine').show();
                // CUANDO ES COBRE 
                if(d.infrastructure.hasOwnProperty('datos')){
                    infraest+= `<div class="row">
                                    <div class="col-sm-6">
                                        <div class="card">
                                            <div class="card-header bg-light text-center"><i class="fa-solid fa-phone-volume"></i> Voz</div>
                                                <div class="card-body">
                                                    <div class="card-text">`
                                                    $.each(Object.entries(d.infrastructure.voz), function(index, [key,value]){
                                                        infraest += `<div class="col"> <b>${key}:</b> ${value}</div>`    
                                                    })
                    infraest += `                   </div>
                                                </div>
                                            </div>
                                        </div>
                                    <div class="col-sm-6">
                                        <div class="card">
                                            <div class="card-header bg-light text-center"><i class="fa-solid fa-wifi"></i> Datos</div>
                                                <div class="card-body">
                                                    <div class="card-text">`
                                                    $.each(Object.entries(d.infrastructure.datos), function(index, [key,value]){
                                                        infraest += `<div class="col"> <b>${key}:</b> ${value}</div>`    
                                                    })
                    infraest += `                   </div>
                                                </div>
                                            </div>
                                        </div>`
                    $('#infrastructure').html(infraest);
                // CUANDO ES LINEA BASICA
                } else {
                    infraest += `<div class="row">`
                        $.each(Object.entries(d.infrastructure.voz), function(index, [key,value]){
                            infraest += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                        })
                    infraest += `</div>`
                    $('#infrastructure').html(infraest);
                };
            };
            // CPE LIST
            const ListData = d.device.cpe
            if (d.type === 'success'){
                ListData.map((e) => {
                    cpePrintOut += `<div class="card" id="cpeList">
                                        <div class="col-sm-12">
                                            <div class="row">
                                                <div class=" col-sm-3"> <b>Tipo:</b> ${e.tipo}</td> </div>
                                                <div class=" col-sm-3"> <b>Modelo:</b> ${e.modelo}</td> </div>
                                                <div class=" col-sm-3"> <b>Serial</b>:${e.serial}</td> </div>
                                                <div class=" col-sm-3"> <b>Mac:</b> ${e.mac}</td> </div>
                                            </div>
                                        </div>
                                    </div>`
                });
                $('#cpeList').html(cpePrintOut);
            } 
            if (d.device.cpe == '') {
                cpePrintOut += `<div class="callout callout-danger">
                                    <p><i class="fa-solid fa-circle-exclamation"></i> Este número no tiene CPE registrados.</p>
                                </div>`
                $("#cpeList").html(cpePrintOut);
            }
    }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}
function otPendientes(){
    var arrData = new Object();
    var phoneNumber = new Object();
    var instPrintOut='';
    var repPrintOut='';
    arrData.telefono_factura=monitoreo.value;
    phoneNumber.phoneNumber=monitoreo.value;

    // SOLICITUD AJAX PARA VALIDAR INSTALACION
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'getOtIdPortalServicios',
            'parameters': JSON.stringify(arrData)
        },
        beforeSend: function () {
            $("#loading").html("<img src='../../static/img/small_loader.gif'>");
        },
        complete: function () {
            $("#loading").html("");
        },
    }).done(function (data) {
        const ListData = data.data
        if (data.type === 'success') {
            ListData.map((e) => {
                instPrintOut += `<div id="response_unit" class="callout callout-danger">
                                    <div class="card-header">
                                        <h3 class="card-title">
                                            <i class="fa-solid fa-toolbox"></i> INSTALACIÓN
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <dl class="row">
                                            <dt class="col-sm-2">Id Orden:</dt>
                                            <dd class="col-sm-10">${e.id__ordenes}</dd>
                                            <dt class="col-sm-2">Estado:</dt>
                                            <dd class="col-sm-10">${e.Estado}</dd>
                                            <dt class="col-sm-2">Tipo de orden:</dt>
                                            <dd class="col-sm-10">${e.tipoOrden}</dd>
                                        </dl>
                                    </div>
                                </div>`;  
            });
            $("#response_unit").html(instPrintOut);
        } else if (data.type === 'error') {

            instPrintOut += `<div id="response_unit" class="callout callout-success">
                                <h5><b>Instalación</b></h5>
                                <p>Este número no tiene ordenes de instalación.</p>
                            </div>`
            $("#response_unit").html(instPrintOut);
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
    // SOLICITUD AJAX PARA VALIDAR REPARACION
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'getSmqrReport',
            'phoneNumber':phoneNumber
        },
        beforeSend: function() {
            $("#loading2").html("<img src='../../static/img/small_loader.gif'>");
        },
        complete: function() {
            $("#loading2").html("");
        },
    }).done(function (data) {
        let ListData2 = data.data
        ListData2 = JSON.parse(ListData2);
        if (data.type === 'success') {            
            repPrintOut += `<div id="response_unit2" class="card callout callout-danger">
                                <div class="card-header">
                                    <h3 class="card-title">
                                        <i class="fa-solid fa-screwdriver-wrench"></i>  REPARACIÓN
                                    </h3>
                                </div>
                                <div class="card-body">
                                    <dl class="row">
                                        <dt class="col-sm-2">Nombre:</dt>
                                            <dd class="col-sm-10">${ListData2.contactName}</dd>
                                        <dt class="col-sm-2">Contacto:</dt>
                                            <dd class="col-sm-10">${ListData2.contactPhone}</dd>
                                        <dt class="col-sm-2">Servicio:</dt>
                                            <dd class="col-sm-10">${ListData2.service}</dd>
                                        <dt class="col-sm-2">Fecha creación:</dt>
                                            <dd class="col-sm-10">${ListData2.createDate}</dd>
                                        <dt class="col-sm-2">Tipo de reclamo:</dt>
                                            <dd class="col-sm-10">${ListData2.claimType}</dd>
                                        <dt class="col-sm-2">Cola actual:</dt>
                                            <dd class="col-sm-10">${ListData2.currentQueue}</dd>
                                        <dt class="col-sm-2">Causa de falla:</dt>
                                            <dd class="col-sm-10">${ListData2.failureCause}</dd>
                                        <dt class="col-sm-2">Localicación falla:</dt>
                                            <dd class="col-sm-10">${ListData2.failureLocation}</dd>
                                        <dt class="col-sm-2">Comentarios:</dt>
                                        <dd class="col-sm-10">${ListData2.creationComment}</dd>
                                        <dd class="col-sm-10 offset-sm-2">${ListData2.comments}</dd>
                                    </dl>
                                </div>
                            </div>`
            $("#response_unit2").html(repPrintOut);
        } else if (data.type === 'error') {
            repPrintOut += `<div id="response_unit" class="callout callout-success">
                                <h5><b>Reparación</b></h5>
                                <p>Este número no tiene reportes SMQR para reparación.</p>
                            </div>`
            $("#response_unit2").html(repPrintOut);
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });   
}
// $('#btn_view_parameters').on('click', function () {
//     phone = phoneNumber.value;
//     $.ajax({
//         url: '../tools/',
//         type: 'POST',
//         dataType: 'json',
//         data: {
//             'action': 'viewParameters',
//             'telefono': phone
//         },
//         beforeSend: function () {
//             $("#loadScreen").fadeIn('fast');
//         },
//         complete: function () {
//             $('#loadScreen').fadeOut('fast');
//         },
//     }).done(function (data) {
//         if (data.type=='error') {
//             Swal.fire({
//                 title: 'Error!',
//                 text: data.msg,
//                 icon: 'error'
//             });
//         } else {
//             $("#response_parameters").html("");
//             const objectParameters = data.data;
//             var strPrintout = '';
//             for (const property in objectParameters) {
//                 if (property != 'flagParameters') {
//                     strPrintout += `<b>${property}</b> ${objectParameters[property]} </br>`;    
//                 }
//             }
//             if (objectParameters.flagParameters==false) {
//                 strPrintout += `<hr>
//                                 <div class="alert alert-danger" role="alert">
//                                 No cumple con la norma tecnica de EMCALI para ${objectParameters.tecnologia.toUpperCase()}
//                                 </div>`;    
//             }
//             $("#response_parameters").html(strPrintout);
//             $("#mdl_parameters").modal('show');
//         }
//     }).fail(function (textStatus, errorThrown) {
//         alert(textStatus + ': ' + errorThrown);
//     });
// });

