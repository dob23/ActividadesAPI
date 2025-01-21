var Id;
//FUNCION INICIAL
$(function () {
    const tblListRep = $('#data').DataTable({
        scrollX: true,
        // responsive: true,
        info: false,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        sAjaxDataProp: "",
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'list_Ot_war',
            },
            dataType: 'json',
            beforeSend: function () {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $("#loadScreen").fadeOut();
            },
        },
        columns: [
            { "data": "id" },
            { "data": "clientType" },
            { "data": "currentQueueName"},
            { "data": "technology" },
            { "data": "phoneNumber" },
            { "data": "instalador" },
            { "data": "tipoOrden" },
            { "data": "fechaInstalacion" },
            {
                "class": "details-control",
                "orderable": false,
                "data": null,
                "defaultContent": ""
            },
        ],
        initComplete: function (settings, json) {
        }
    });
      /*CHILD ROWS BODY*/
      $('#data tbody').on('click', 'td.details-control', function () {
            var data = tblListRep.row($(this).parents('tr')).data(); // VARIABLE QUE CAPTURA LA DATA COMPLETA DE LA FILA
            var tr = $(this).closest('tr');
            var row = tblListRep.row(tr);
            Id = data.id
            comments =data.comments
            window.sessionStorage.setItem("idOrden", data.id);

            $.ajax({
                type: "POST",
                url: window.location.pathname,
                scrollX: true,
                data: {
                    'action': 'detailsOtWar',
                    'telefono': data.phoneNumber
                },
                beforeSend: function () {
                    $("#loadScreen").fadeIn('fast');
                },
                complete: function () {
                    $('#loadScreen').fadeOut('fast');
                },
                success: function (data) {
                    if (row.child.isShown()) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    } else {
                        // Open this row
                        row.child(format(data)).show();
                        tr.addClass('shown');
                    }
                },
            });
      });
})
//FUNCION PARA DETALLES DE LA ORDEN
function format(d){
    console.log(d);
    window.sessionStorage.setItem("customerDevices", JSON.stringify(d.device.cpe));

    window.sessionStorage.setItem("phoneNumber", d.commercial.telefono_factura); //TELEFONO
    window.sessionStorage.setItem("checkTypeOt", 1);

    window.sessionStorage.setItem("speed_down", d.commercial.down);
    window.sessionStorage.setItem("speed_up", d.commercial.up);
    if(d.infrastructure.hasOwnProperty('datos')){
        window.sessionStorage.setItem("technology", d.infrastructure.datos.tecnologia);
    }
    else {
        window.sessionStorage.setItem("technology", 'Linea Basica');
    }
    window.sessionStorage.setItem("idTechnology", d.Idtecnologia);


    window.sessionStorage.setItem("tipoOrden", "Garantia");
    window.sessionStorage.setItem("mail", d.commercial.mail);

    var html = ``
    html += `<div id = "loader"></div>
            <table class="table">
                <thead thead style="text-align: center;" class="thead-dark">
                    <tr>
                        <th scope="col"><i class="fa-solid fa-user-tag"></i> COMERCIAL </th>
                        <th scope="col"><i class="fa-solid fa-network-wired"></i> INFRAESTRUCTURA</th>
                        <th scope="col"><i class="fa-regular fa-hard-drive"></i> CPE </th>
                        <th scope="col"><i class="fa-solid fa-user-tag"></i> OBSERVACIONES</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style = "width:25%">
                            <dl>`
                                $.each(Object.entries(d.commercial), function(index, [key,value]){
                                    html += `<dt>${key}:</dt><dd> ${value}</dd>`    
                                })
    html+=                 `</dl>
                        </td>
                        <td style = "width:25%">`
                        if (d.Idtecnologia == 5) {
                            $.each(Object.entries(d.infrastructure.datos), function(index, [key,value]){
                                html += `<div> <b>${key}:</b> ${value}</div>`    
                            })
                        } else {
                            `<div> No se logró obtener información de la infraestructura</div>`
                        };
    html+=             `</td>
                        <td style = "width:25%">`
                        const ListData = d.device.cpe
                        if (d.type === 'success'){
                            ListData.map((e) => {
                                const idCpe = e.id__cpe
                                const tipoCpe = e.tipo
                                const marcaCpe = e.marca
                                const modeloCpe = e.modelo
                                const serialCPe = e.serial
                                
                                html += `<div class="card bg-transparent">
                                            <div class="card-body p-1 m-1">
                                                <div class="row">
                                                    <div class="col-xl-7">
                                                        <div> <b>Tipo:</b> ${e.tipo} </div>
                                                        <div> <b>Modelo:</b> ${e.modelo} </div>
                                                        <div> <b>Serial</b>:${e.serial} </div>
                                                        <div> <b>Mac:</b> ${e.mac} </div>
                                                    </div>
                                                    <div class="col-xl-5 d-flex align-items-center justify-content-center">
                                                        <button id="openModalChangeCPE" onClick="viewChangeCPE('${d.idContrato}','${idCpe}', '${marcaCpe}','${tipoCpe}', '${modeloCpe}', '${serialCPe}')" class="btn btn-dark btn-sm mx-auto d-block"><i class="fa-solid fa-repeat"></i> Cambiar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                            });
                        }  
                        if (d.device.cpe == '') {
                            html +=`<div class="callout callout-danger">
                                        <p><i class="fa-solid fa-circle-exclamation"></i> Este número no tiene CPE registrados.</p>
                                    </div>`
                        }
    html+=              `</td>
                        <td style = "width:25%">
                            <div>${comments}</div>
                        </td>
                    </tr>
                </tbody>`
    html +=`<tfooter class="thead-dark">
            <td colspan="4"><div id="divP" style="text-align: center;">
                <a id="read" onClick="viewParameters(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1" ><i class="nav-icon fas fa-eye"></i> PARÁMETROS</a>`
    if (d.Idtecnologia != 5) {
        html += `<button onClick="viewTestLine(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1" ><i class="nav-icon fas fa-phone-volume"></i> PRUEBA LÍNEA</button>`;
    }
    html+=     `<button onClick = "setCustomerLdap(${d.commercial.suscriptor})" class="btn btn-outline-dark m-1"><i class="nav-icon  fas fa-sync"></i> SINCRONIZAR</button>
                <button onClick = "ConfigurationCPE(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="fa-solid fa-gears"></i> CONFIGURAR</button>
                <button onClick ="buscarCPElegalizar(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="fa-solid fa-hard-drive"></i> LEGALIZAR</button>`
    if(d.infrastructure.hasOwnProperty('datos')){
        html += `<button onClick="closeOT(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="fa-solid fa-check-to-slot"></i> CERRAR OT</button>`
    }
    if (d.Idtecnologia == 5 && d.device.cpe[0] != undefined && d.device.cpe[0].marca == "FIBERHOME"){
        html+= `<button onClick="getWifiConfig('${d.infrastructure.datos.uam}','${d.infrastructure.datos.tarjeta}','${d.infrastructure.datos.puerto}','${d.infrastructure.datos.instancia}')" id="getWifiConfig" class="btn btn-outline-dark m-1"><i class="fa-solid fa-wifi"></i> WIFI </button>`
    }
    if (d.Idtecnologia == 5){
        html+= `<button onClick="smqrRouteReport('${d.commercial.telefono_factura}')" id="smqrRouteReport" class="btn btn-outline-dark m-1"><i class="fa-solid fa-route"></i> ENRUTAR</button>`
    }
    html +=`</div></td>
            </tfooter>`;
    return html;
}


