$(document).ready(function () {
    $('#categoryFilter').select2({
        theme: 'bootstrap4'
    });
    $("#data").dataTable({
        "searching": true
    });

    var Id;

    const tblOrden = $('#data').DataTable({
        scrollX: true,
        info: false,
        autoWidth: false,
        destroy: true,
        sAjaxDataProp: "",
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'listarOt',
            },
            dataType: 'json',
        },
        columns: [
            { "data": "id__ordenes" },
            { "data": "login" },
            { "data": "fecha_cita" },
            { "data": "nombre_tipo_orden" },
            { "data": "Medio" },
            { "data": "telefono_factura" },
            {
                "class": "details-control",
                "orderable": false,
                "data": null,
                "defaultContent": ""
            },
        ],
        initComplete: function (settings, json) {
            $('.loader').fadeOut();
        }
    });
    
    $('#data tbody').on('click', 'td.details-control', function () {
        let data = tblOrden.row($(this).parents('tr')).data(); // VARIABLE QUE CAPTURA LA DATA COMPLETA DE LA FILA DEL LISTADO DE OT ACTIVAS
        let tr = $(this).closest('tr');
        let row = tblOrden.row(tr);
        Id = data['id__ordenes']

        $.ajax({
            type: "POST",
            url: window.location.pathname,
            scrollX: true,
            data: {
                'action': 'detalles',
                'id': data['id__ordenes'] /// PARAMETRO QUE FILTRA EL ID_ORDENES DE LA DATA
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn('fast');
            },
            complete: function () {
                $('#loadScreen').fadeOut('fast');
            },
            success: function (data) {
                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    if (data.tipoOrden == 'Instalacion LB' || 'Traslado LB') {
                        if (data.infrastructure.datos == null || undefined) {
                            data.infrastructure.datos = "";
                            row.child(format(data)).show();
                            tr.addClass('shown');
                        } else {
                            row.child(format(data)).show();
                            tr.addClass('shown');
                        }
                    }
                }
            },
        });
    });
    $('#categoryFilter').change(function(){
        tblOrden.columns($(this).data('column')).search($(this).val()).draw();
    });

    function format(d) {
        console.log(d)
        const arrTypeOt = ["8","9","10","11","12","13","14","16","17"];
        
        window.sessionStorage.setItem("customerDevices", JSON.stringify(d.device.cpe));
        window.sessionStorage.setItem("NumAditionalDeviceSTB", d.npa);
    
        window.sessionStorage.setItem("idOrden", d.idOrden); // ID ORDEN
        window.sessionStorage.setItem("phoneNumber", d.commercial.telefono_factura); // TELEFONO
        window.sessionStorage.setItem("checkTypeOt", 0);
        
        window.sessionStorage.setItem("speed_down", d.commercial.down);
        window.sessionStorage.setItem("speed_up", d.commercial.up);
        window.sessionStorage.setItem("technology", d.infrastructure.datos.tecnologia);
        window.sessionStorage.setItem("idTechnology", d.Idtecnologia);
    
        window.sessionStorage.setItem("tipoOrden", d.tipoOrden); // TIPO ORDEN INSTALACION
        window.sessionStorage.setItem("idTipoOrden", d.idTipoOrden); // ID TIPO ORDEN
        window.sessionStorage.setItem("mail", d.commercial.mail); // CORREO CLIENTE
        window.sessionStorage.setItem("instalador", d.instalador); // INSTALADOR
        window.sessionStorage.setItem("loginSigt", d.loginSigt); // logiSigt
        
        let html = '';
    
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
                                        html += `<dt>${key}:</dt><dd>${value}</dd>`    
                                    });
            html+=             `</dl>
                            </td>
                            <td style = "width:25%">`
                                if (d.Idtecnologia == 5) {
                                    $.each(Object.entries(d.infrastructure.datos), function(index, [key,value]){
                                        html += `<div> <b>${key}:</b> ${value}</div>`    
                                    })
                                } else {
                                    if(d.infrastructure.hasOwnProperty('datos')){
                                        html+= `<div class="text-center"><b> VOZ </b></div>`
                                            $.each(Object.entries(d.infrastructure.datos), function(index, [key,value]){
                                                html += `<div><b>${key}:</b> ${value}</div>`    
                                            })
                                    }
                                    if(d.infrastructure.hasOwnProperty('voz')){
                                        html += `<hr><div class="text-center"><b> DATOS </b></div>`
                                            $.each(Object.entries(d.infrastructure.voz), function(index, [key,value]){
                                                html += `<div><b>${key}:</b> ${value}</div>`    
                                            })
                                    };
                                };
            html+=          `</td>
                            <td style = "width:25%">`
                            const ListData = d.device.cpe
                            if(d.device.cpe.length != 0){
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
                                if(!arrTypeOt.includes(d.idTipoOrden)){
                                    html+= `<button id="openModalSetDevice" onClick="setDeviceOt()" class="btn btn-secondary btn-sm btn-block"> <i class="fa-solid fa-upload"></i>  Asignar Dispositivos</button>`
                                }
                            } 
                            else{
                                html += `<button id="openModalSetDevice" onClick="setDeviceOt()" class="btn btn-secondary btn-sm btn-block"> <i class="fa-solid fa-upload"></i>  Asignar Dispositivos</button>`
                            }
            html+=          `</td>
                            <td style="width:25%">
                                <div><b>STB solicitados:</b> ${d.npa}</div>
                                <div><b>Comentarios:</b></div>
                                <div>${d.otObservacion}</div>
                            </td>`
            html +=`</tbody>
                    <tfooter class="thead-light">
                    <td colspan="4"><div id="divP" style="text-align: center;">`;
        html += `<a id="read" onClick="viewParameters(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="nav-icon  fas fa-eye"></i> PARÁMETROS</a>`;
        if (d.Idtecnologia != 5) {
            html += `<button onClick="viewTestLine(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1" ><i class="nav-icon fas fa-phone-volume"></i> PRUEBA LÍNEA</button>`;
        }
        html +=`<button onClick="setCustomerLdap(${d.commercial.suscriptor})" class="btn btn-outline-dark m-1"><i class="nav-icon fas fa-sync"></i> SINCRONIZAR</button>
                <button onClick="ConfigurationCPE(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="fa-solid fa-gears"></i> CONFIGURAR</button>`
        if (d.Idtecnologia == 5 && d.device.cpe[0] != undefined && d.device.cpe[0].marca == "FIBERHOME"){
            html+= `<button onClick="getWifiConfig('${d.infrastructure.datos.uam}','${d.infrastructure.datos.tarjeta}','${d.infrastructure.datos.puerto}','${d.infrastructure.datos.instancia}')" id="getWifiConfig" class="btn btn-outline-dark m-1"><i class="fa-solid fa-wifi"></i> WIFI </button>`
        }
        if (d.idTipoOrden == 16) {
            html += `<button onClick="migrarSip(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="nav-icon fas fa-paper-plane"></i> MIGRAR SIP</button>`;
        }
    
        html +=`<button onClick ="buscarCPElegalizar(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="fa-solid fa-hard-drive"></i> LEGALIZAR</button>
                <button onClick="closeOT(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="fa-solid fa-check-to-slot"></i> CERRAR OT</button>`
        if (d.Idtecnologia == 5){
            html+= `<button id="redirectOt" onClick="redirectOt(${d.idOrden})" class="btn btn-outline-dark m-1"><i class="fa-solid fa-route"></i> ENRUTAR</button>`
        }
        html+= `<button id="lastConnections" onClick="viewLastConnections(${d.commercial.telefono_factura})" class="btn btn-outline-dark m-1"><i class="fas fa fa-signal"></i> Ultimas Conexiones</button>`
        html +=`</div></td>
                </tfooter>`;
        return html;
    };
})




