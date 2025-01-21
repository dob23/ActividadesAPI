$(document).ready(function () {
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
        pageLength: 50,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'listarZonaWifi',
            },
            dataType: 'json',
            dataSrc: 'data'
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { "data": "id_universidad" },
            { "data": "nombre" },
            { "data": "sede" },
            { "data": "direccion" },
            { "data": "medio" },
            { "data": "convenio" },
            { "data": "orden_contrato" },
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
        $.ajax({
            type: "POST",
            url: window.location.pathname,
            scrollX: true,
            data: {
                'action': 'detalleSede',
                'id': data['id_universidad'],
                'convenio':data['convenio']/// PARAMETRO QUE FILTRA EL ID_ORDENES DE LA DATA
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
                    row.child(format(data)).show();
                    tr.addClass('shown');
                }
            },
        });
    });
    $('#categoryFilter').change(function(){
        tblOrden.columns($(this).data('column')).search($(this).val()).draw();
    });
    function format(d) {
        //PUERTO
        flagPort = 0;
        htmlPort = `No tienen infraestructura asignada`;
        if (d.data.port != null) {
            console.warn("entro");
            flagPort = 1
            htmlPort = `<ul>
                            <li><b>Central </b>${d.data.port.centralOlt}</li>
                            <li><b>Zona </b>${d.data.port.zona}</li>
                            <li><b>Modelo </b> ${d.data.port.modelo}</li>
                            <li><b>Marca </b>${d.data.port.marca}</li>
                            <li><b>Nombre OLT </b>${d.data.port.nombreDispositivo}</li>
                            <li><b>Proyecto </b>${d.data.port.nombreCentral}</li>
                            <li><b>Tecnologia </b>${d.data.port.tecnologia}</li>
                            <li><b>Tarjeta </b>${d.data.port.forTarjeta}</li>
                            <li><b>Puerto </b>${d.data.port.forPuerto}</li>
                            <li><b>Instancia </b>${d.data.port.forInstancia}</li>
                            <li><b>Fibra Hilo </b>${d.data.port.plantside}</li>
                            <li><b>N1 </b>${d.data.port.N1}</li>
                            <li><b>Posicion N1 </b>${d.data.port.posicionN1}</li>
                            <li><b>Direccion N1 </b>${d.data.port.N1_DIRECCION}</li>
                            <li><b>N2 </b>${d.data.port.N2}</li>
                            <li><b>Posicion N2 </b>${d.data.port.posicionN2}</li>
                            <li><b>Direccion N2 </b>${d.data.port.N2_DIRECCION}</li>
                        </ul>`;
        } else {
            console.warn("no entro");
        }
        //DISPOSITIVOS
        flagDevice = 0;
        htmlDevice = `No tiene dispositivos asignados`;
        if (esObjetoVacio(d.data.device) == false) {
            flagDevice = 1
            htmlDevice = ``;
            //RECORRER OBJETOS
            for (const valor of d.data.device) {
                //console.log(valor);
                htmlDevice += `
                    <ul>
                        <li><b>Marca </b>${valor.nameDevice}</li>
                        <li><b>Modelo </b>${valor.nameModeloDevice}</li>
                        <li><b>Serial </b> ${valor.serial}</li>
                        <li><b>Mac </b>${valor.mac}</li>
                    </ul>
                    <br>
                `;
            }
        }
        //BOTONES, VALIDAR
        htmlBotones =  ``;
        if (flagPort == 1 && flagDevice == 1) {
            //VALIDAR SI TIENE ONT 
            if (d.data.serialOnt != 0) {
                if (d.data.convenio=='40ZONAS-WIFI') {
                    htmlBotones += `<button onClick = "configurationWifi('${d.data.id}','${d.data.port.nombreDispositivo}',${d.data.port.forTarjeta},${d.data.port.forPuerto},${d.data.port.forInstancia},'${d.data.serialOnt}','${d.data.description}')" class="btn btn-outline-dark m-1"><i class="fa-solid fa-gears"></i> CONFIGURAR</button>`;
                }
                //BOTON DE MEDIACION DE SED
            }
            
            htmlBotones += `
            <a id="read" onClick="viewParametersPortFtth('${d.data.port.nombreDispositivo}',${d.data.port.forTarjeta},${d.data.port.forPuerto},${d.data.port.forInstancia})" title="" class="btn btn-outline-dark m-1"><i class="nav-icon fas fa-eye"></i> PARÁMETROS</a>`;
        }
        //BOTON DE ULTIMAS CONEXIONES TRIPLE AAA
        if (esObjetoVacio(d.data.products.internet) == false) {
            uid = d.data.products.internet.user_pppoe.split("@");
            htmlBotones += `<button id="lastConnections" onClick="viewLastConnectionsUsername('${d.data.products.internet.user_pppoe}')" class="btn btn-outline-dark m-1"><i class="fas fa fa-signal"></i> Ultimas Conexiones</button>`;
            htmlBotones += `<button onClick ="buscarCPElegalizarDn('${uid[0]}','true','${uid[1]}')" type = "button" class="btn btn-outline-dark m-1"><i class="fa-solid fa-hard-drive"></i> &nbsp;LEGALIZAR</button>`;
        }
        let html = '';
        html += `
            <div class="row"> 
                <div class="card-body">
                    <h5 class="card-title"><b>Infraestructura</b></h5>
                    <p class="card-text">
                    ${htmlPort}
                    </p>
                </div>
                <div class="card-body">
                    <h5 class="card-title"><b>Dispositivos</b></h5>
                    <p class="card-text">
                    ${htmlDevice}
                    </p>
                </div>
            </div>
            <div class="row">
                ${htmlBotones}
            </div>
        `;
        return html;
    };
});

// Validar si un objeto este vacio
function esObjetoVacio(obj) {
    return Object.keys(obj).length === 0;
}