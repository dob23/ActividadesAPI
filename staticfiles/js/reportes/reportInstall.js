$(function () {
    //REALIZAR PETICION  PARA TRAER INFORMACION
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'top10Installers'
        },
        dataType: 'json'
    }).done(function (data) {
        console.log(data);
        var strHtml = '';
        var div = $('#replaceMe');
        
        for (var x in data.data) {
            contador = parseInt(x) + 1;
            porcentaje = (data.data[x].Puntaje * 100) / 70;
            total = porcentaje.toFixed(2)
            if (total>=100) {
                total = 100;
            }
            puntajeFinal = parseFloat(data.data[x].Puntaje);
            strHtml += `<tr>
                        <td scope="row">${contador}</td>
                        <td>
                            <a>${data.data[x].nombre_empresas}</a>
                            <br />
                            <small>${data.data[x].nombre_areas}</small>
                        </td>
                        <td>
                            <ul class="list-inline">
                                <li class="list-inline-item">
                                    <img
                                        alt="Avatar"
                                        class="table-avatar"
                                        src="/static/img/user.jpg"
                                    />
                                    <br />
                                    <small>${data.data[x].login}</small>
                                </li>
                            </ul>
                        </td>
                        <td>
                            <div class="progressTopInst">
                                <div
                                class="progressBarTopInst"
                                role="progressbar"
                                aria-valuenow="${total}"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style="width:${total}%"
                                ></div>
                            </div>
                            <small>${total}% Complete </small>
                        </td>
                        <td><center>${puntajeFinal.toFixed(1)}</center></td>
                        <td><center>${data.data[x].total}</center></td>
                        <td><center>${data.data[x].fechaSolicitud}</center></td>
                        </tr>`;
        }
        div.html(strHtml);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {
        
    });
});