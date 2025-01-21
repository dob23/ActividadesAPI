// LOADER
$(document).ready(function () {
    $('#loadScreen').fadeOut();
});
var uam_name, tecnologiaOrden, telefono;

function consultarDetallesCorporativo() {
    var comercial = '', infraest = '', cpePrintOut = '';
    idCliente = document.getElementById('idCliente').value;
    //$("#response_unit").html("");
    //$("#response_unit2").html(""); 
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'monitoreoCorporativo',
            'id': idCliente,
        },
        beforeSend: function() {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $('#loadScreen').fadeOut('fast');
        },
    }).done(function (d){
        //console.log(d)
        if (d.type == 'error') {
            Swal.fire({
                title: 'Error!',
                text: 'No se encontro información con id de cliente.',
                icon: 'error'
            });
        } else {
            detailedInfo.style.visibility = 'visible';
            //COMERCIAL
            $('#comercial').html("");
            if (d.data.commercial !== "") { 
                //console.warn(d.data.port)
                comercial += `<div class="row">`
                            $.each(Object.entries(d.data.commercial), function(index, [key,value]){
                                comercial += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                            })
                comercial += `</div>`
                $('#comercial').html(comercial);
            }
            //INFRAESTRUCTURA 
            $('#infrastructure').html("");
            if (d.data.port != null) { 
                //console.warn(d.data.port)
                infraest += `<div class="row">`
                            $.each(Object.entries(d.data.port), function(index, [key,value]){
                                infraest += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                            })
                infraest += `</div>`
                $('#infrastructure').html(infraest);
            }
            $('#cpeList').html("");
            //DISPOSITIVOS
            if (esObjetoVacio(d.data.device) == false) {
                const ListData = d.data.device
                console.warn(d.data.device);
                ListData.map((e) => {
                    cpePrintOut += `<div class="card" id="cpeList">
                                        <div class="col-sm-12">
                                            <div class="row">
                                                <div class=" col-sm-3"> <b>Tipo:</b> ${e.typeDevice}</td> </div>
                                                <div class=" col-sm-3"> <b>Modelo:</b> ${e.nameModeloDevice}</td> </div>
                                                <div class=" col-sm-3"> <b>Serial</b>:${e.serial}</td> </div>
                                                <div class=" col-sm-3"> <b>Mac:</b> ${e.mac}</td> </div>
                                            </div>
                                        </div>
                                    </div>`
                });
                $('#cpeList').html(cpePrintOut);
            }
            //SERVICIOS
            var strInternet = '', strGestion = '', strIpTruk = '', strH248 = '';
            $('#internet').html("");
            $('#gestion').html("");
            $('#iptrunk').html("");
            $('#h248').html("");
            //INTERNET
            if (esObjetoVacio(d.data.products.internet) == false) {
                strInternet += `<div>
                                    <div class="card-header text-center bg-dark">
                                        <div class="col-sm-12"><i class="fa-regular fa-hard-drive"></i> <b>INTERNET</b></div>
                                    </div>
                                    <div class=card>
                                    <div class="card-body">`;
                strInternet += `    <div class="row">`
                                        $.each(Object.entries(d.data.products.internet), function (index, [key, value]) {
                                            strInternet += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                                        })
                strInternet += `    </div>`
                strInternet += `    </div>
                                    </div>
                                </div>`;
                $('#internet').html(strInternet);
            }
            //GESTION
            if (esObjetoVacio(d.data.products.gestion) == false) {
                strGestion += `<div>
                                    <div class="card-header text-center bg-dark">
                                        <div class="col-sm-12"><i class="fa-regular fa-hard-drive"></i> <b>GESTION</b></div>
                                    </div>
                                    <div class=card>
                                    <div class="card-body">`;
                strGestion += `    <div class="row">`
                                        $.each(Object.entries(d.data.products.gestion), function (index, [key, value]) {
                                            strGestion += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                                        })
                strGestion += `    </div>`
                strGestion += `    </div>
                                    </div>
                                </div>`;
                $('#gestion').html(strGestion);
            }
            //IPTRUNK
            if (esObjetoVacio(d.data.products.iptrunk) == false) {
                strIpTruk += `<div>
                                    <div class="card-header text-center bg-dark">
                                        <div class="col-sm-12"><i class="fa-regular fa-hard-drive"></i> <b>IP-TRUNK</b></div>
                                    </div>
                                    <div class=card>
                                    <div class="card-body">`;
                strIpTruk += `    <div class="row">`
                                        $.each(Object.entries(d.data.products.iptrunk), function (index, [key, value]) {
                                            strIpTruk += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                                        })
                strIpTruk += `    </div>`
                strIpTruk += `    </div>
                                    </div>
                                </div>`;
                $('#iptrunk').html(strIpTruk);
            }
            //H248
            if (esObjetoVacio(d.data.products.h248) == false) {
                strH248 += `<div>
                                    <div class="card-header text-center bg-dark">
                                        <div class="col-sm-12"><i class="fa-regular fa-hard-drive"></i> <b>H248</b></div>
                                    </div>
                                    <div class=card>
                                    <div class="card-body">`;
                strH248 += `    <div class="row">`
                                        $.each(Object.entries(d.data.products.h248), function (index, [key, value]) {
                                            strH248 += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                                        })
                strH248 += `    </div>`
                strH248 += `    </div>
                                    </div>
                                </div>`;
                $('#h248').html(strH248);
            }
            var strBotones =  ``;
            //BOTON DE ULTIMAS CONEXIONES TRIPLE AAA
            if (d.data.port != null) {
                strBotones += `<a id="read" onClick="viewParametersPortFtth('${d.data.port.nombreDispositivo}',${d.data.port.forTarjeta},${d.data.port.forPuerto},${d.data.port.forInstancia})" title="" class="btn btn-outline-dark m-1"><i class="nav-icon fas fa-eye"></i> PARÁMETROS</a>`;
            }
            if (esObjetoVacio(d.data.products.internet) == false) {
                uid = d.data.products.internet.user_pppoe.split("@");
                strBotones += `<button id="lastConnections" onClick="viewLastConnectionsUsername('${d.data.products.internet.user_pppoe}')" class="btn btn-outline-dark m-1"><i class="fas fa fa-signal"></i> Ultimas Conexiones</button>`;
                strBotones += `<button onClick ="buscarCPElegalizarDn('${uid[0]}','true','${uid[1]}')" type = "button" class="btn btn-outline-dark m-1"><i class="fa-solid fa-hard-drive"></i> &nbsp;LEGALIZAR</button>`;
            }
            $('#botones').html(strBotones);
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}

// Validar si un objeto este vacio
function esObjetoVacio(obj) {
    return Object.keys(obj).length === 0;
}