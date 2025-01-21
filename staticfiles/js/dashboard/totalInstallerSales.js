$(document).ready(function () {
    //PRINCIPAL
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'totalInstallerSales',
            'option': 'all'
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function (data) {            
        if (data.type =='error'){
            Swal.fire({
                title: data.msg,
                icon: 'warning'
            });
            return;
        }
            //TOTAL PRODUCTOS
            var arrLb = [];
            var arrBA = [];
            var arrIPTV = [];
            //MESES
            var arrrMes = [];
            var mesesNumerados = [
                "NA",
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"
            ];
            //RECORRER ARREGLO PARA BUSCAR EL TOTAL DE LOS PRODUCTO  
            data.data.forEach(function (instalaciones) {
                //console.warn(instalaciones)
                arrrMes.push(mesesNumerados[instalaciones.mes])
                arrLb.push(parseInt(instalaciones.totalLb));
                arrBA.push(parseInt(instalaciones.totalBa));
                arrIPTV.push(parseInt(instalaciones.totalIptv));
            });
            //ZONA DE LA GRAFICA QUE MOSTRARA LOS DATOS
            Highcharts.chart('containerTotalProducts', {
                title: {
                    text: 'Total De Instalaciones x Productos Segmento Hogar'
                },
                subtitle: {
                    text: 'Ultimo año'
                },
                yAxis: {
                    title: {
                        text: 'Cantidad de Instalaciones'
                    }
                },
                xAxis: {
                    categories: arrrMes,
                    accessibility: {
                        description: 'Meses ultimo año'
                    }
                    
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart: 0
                    }
                },
                series: [
                    {
                        name: 'VOZ',
                        data: arrLb,
                            color: 'green'
                    },
                    {
                        name: 'INTERNET',
                        data: arrBA,
                        color: 'blue'
                    },
                    {
                        name: 'TV',
                        data: arrIPTV,
                        color: 'red'
                    }
                ],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }

            });
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    })
    //POR CANAL
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'totalInstallerSales',
            'option': 'channel'
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function (data) {            
        if (data.type =='error'){
            Swal.fire({
                title: data.msg,
                icon: 'warning'
            });
            return;
        }
        //MESES BASE
        var mesesNumerados = ["NA", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        
        //CANALES INTERNET
        var arrEMCALI = [];
        var arrVIR = [];
        var datosAgrupados = {};
        //CANALES IPTV
        var arrEMCALIIPTV = [];
        var arrVIRIPTV = [];
        var datosAgrupadosIPTV = {};
        //CANALES VOZ
        var arrEMCALIVOZ = [];
        var arrVIRVOZ = [];
        var datosAgrupadosVOZ = {};
        //SUMER LOS ECOMERCE
        data.data.forEach(function (instalaciones) {
            //MES
            var clave = instalaciones.ano;
            //VALIDAR SI EXISTE EL ANO
            if (!datosAgrupados[clave]) {
                datosAgrupados[clave] = [];
            }
            //VALIDAR SI EXISTE EL ME
            if (!datosAgrupados[clave].includes(instalaciones.mes)) {
                //arregloSinDuplicados.push(elemento);
                datosAgrupados[clave].push(instalaciones.mes);
            }
            switch (instalaciones.id__areas) {
                case '57':
                    arrVIR.push(parseInt(instalaciones.totalBa));
                    arrVIRIPTV.push(parseInt(instalaciones.totalIptv));
                    arrVIRVOZ.push(parseInt(instalaciones.totalLb));
                    break;
                case '47':
                    arrEMCALI.push(parseInt(instalaciones.totalBa));
                    arrEMCALIIPTV.push(parseInt(instalaciones.totalIptv));
                    arrEMCALIVOZ.push(parseInt(instalaciones.totalLb));
                    break;
            }
        });
        //PINTAR META Y MES INTERNET
        arrMesAux = [];
        for (const clave in datosAgrupados) {
            //VALIDAR DATOS SI HAY DATOS EN CLAVE
            if (datosAgrupados[clave]) {
                const auxArr = datosAgrupados[clave];
                auxArr.forEach(function(elemento) {
                    arrMesAux.push(mesesNumerados[elemento]);
                });
                
            }
        }
        //PINTAR
        Highcharts.chart('containerBa', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Instalaciones Internet Por Grupo',
                align: 'left'
            },
            xAxis: {
                categories: arrMesAux
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count trophies'
                },
                stackLabels: {
                    enabled: true
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'EMCALI',
                    data: arrEMCALI
                },{
                    name: 'VIR 2021',
                    data: arrVIR
                }
            ]
        });
        //PINTAR IPTV
        Highcharts.chart('containerIptv', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Instalaciones IPTV Por Grupo',
                align: 'left'
            },
            xAxis: {
                categories: arrMesAux
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count trophies'
                },
                stackLabels: {
                    enabled: true
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'EMCALI',
                    data: arrEMCALIIPTV
                },{
                    name: 'VIR 2021',
                    data: arrVIRIPTV
                }
            ]
        });
        //PINTAR VOZ
        Highcharts.chart('containerLb', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Instalaciones Voz Por Grupo',
                align: 'left'
            },
            xAxis: {
                categories: arrMesAux
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count trophies'
                },
                stackLabels: {
                    enabled: true
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'EMCALI',
                    data: arrEMCALIVOZ
                },
                {
                    name: 'VIR 2021',
                    data: arrVIRVOZ
                }
            ]
        });
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    })
});