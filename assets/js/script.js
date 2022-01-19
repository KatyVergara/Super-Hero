$(document).ready(function () {

    $("form").submit(function (event) {
        event.preventDefault()

        //validar id
        let valueInput = $("#buscar").val();
        if (valueInput < 1 || valueInput > 731) {
            alert("Debes ingresar un número de ID entre 1 y 731.");
        };        
        let valido = /^[0-9]+$/;
        if (valueInput.match(valido)) {            
        } else {
          alert("El ID de tu SuperHero debe contener sólo números.\n\nVuelve a intentarlo");
        };
                

        //consulta a la API a través de AJAX
        $.ajax({
            type: "GET",
            url: "https://superheroapi.com/api.php/600362641247453/" + valueInput,
            
            error: () => {
                alert("Error de conexión")
            },

            success:(data) => {

                let nombre = data.name;
                let conexiones = data.connections["group-affiliation"];
                let publicadoPor = data.biography.publisher;
                let ocupacion = data.work.occupation;
                let primeraAparicion = data.biography["first-appearance"];
                let altura = data.appearance.height.join(" - ");                
                let peso = data.appearance.weight.join(" - ");                
                let alias = data.biography.aliases.join(" - ");
                let imagen = data.image.url;


                //renderización de info en card
                $("#info").html(`
                <h4 class="glass text-center m-0 text-white" >SuperHero Encontrado</h4>
                
                <div class="glass borde sombra card flex-row border-0">
                
                    <img class="img-card img-fluid sombra card-img-left" style="width:38%;" src="${imagen}" alt="${nombre}"
                        onerror="this.src='assets/img/no-disponible.png'" />
                
                    <div class="card-body">
                        <h5 class="card-title">Nombre: <strong>${nombre}</strong></h5>
                        <p>Conexiones: ${conexiones}</p>
                        <p class="px-3"><i>Publicado por: ${publicadoPor}</i></p>
                        <hr>
                        <p class="px-3">Ocupación: ${ocupacion}</p>
                        <hr>
                        <p class="px-3"><i>Primera Aparición: ${primeraAparicion}</i></p>
                        <hr>
                        <p class="px-3"><i>Altura: ${altura}</i></p>
                        <hr>
                        <p class="px-3"><i>Peso: ${peso}</i></p>
                        <hr>
                        <p class="px-3 pb-2"><i>Alias: ${alias}</i></p>
                
                    </div>
                </div>
                
                `)

                //gráfico
                let stats = [];

                stats.push(
                    { y: data.powerstats.intelligence, name: "Intelligence", color: "#3A4081" },
                    { y: data.powerstats.strength, name: "Strength", color: "#2EA99C" },
                    { y: data.powerstats.speed, name: "Speed", color: "#73F1DB" },
                    { y: data.powerstats.durability, name: "Durability", color: "#FAAB5C" },
                    { y: data.powerstats.power, name: "Power", color: "#ed5530" },
                    { y: data.powerstats.combat, name: "Combat", color: "#C11400" }
                );

                let config = {
                    exportEnabled: false,
                    animationEnabled: true,
                    backgroundColor: "#000000b0",
                    title: {
                        text: `Estadísticas de Poder para ${nombre}`,
                        fontSize: 30,
                        fontFamily: "Roboto Condensed",
                        fontWeight: "bold",
                        fontColor: "white"
                    },
                    legend: {
                        fontFamily: "Roboto Condensed",
                        fontColor: "white",
                        cursor: "pointer",
                        itemclick: explodePie
                    },

                    data: [{
                        type: "pie",
                        showInLegend: "true",
                        toolTipContent: "<strong>{name}</strong>: {y}",
                        indexLabel: "{name} ({y})",
                        indexLabelFontColor: "white",
                        indexLabelFontFamily: "Roboto Condensed",
                        dataPoints: stats
                    }]
                };

                //renderización del gráfico
                let chart = new CanvasJS.Chart("chartContainer", config);
                chart.render();

                function explodePie(e) {
                    if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
                        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
                    } else {
                        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
                    }
                    e.chart.render();
                }
            }           
        });
    });
});