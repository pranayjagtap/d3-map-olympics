function perCapitaMap() {
    var data2;
    var mapper={};
// Clear the canvas before we paint
    d3
        .select("#vis_canvas")
        .selectAll("*")
        .remove();
    d3
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();

    var margin = { top: 20, right: 0, bottom: 20, left: 0 }
    var height = 400 - margin.top - margin.bottom
    var width = 800 - margin.left - margin.right
    var mycanvas=d3.select("#vis_canvas")
    var svg = mycanvas.append("svg")
        .attr('height',height + margin.top + margin.bottom)
        .attr('width',width + margin.left + margin.right)
        .append('g')
        .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

// Map and projection
    d3.csv('./data/athlete_events_new.csv', function (d) {

        data2 = d3.nest(d)
            .key(function (d) {
                return d.NOC;
            })
            .rollup(function (d) {
                return d.length
            })
            .entries(d);

        data3 = d3.nest(d)
            .key(function (d) {
                return d.NOC;
            })
            .key(function(d){

                return d.Medal;
            })
            .rollup(function (d) {
                return +d.length
            })
            .entries(d);
       // console.log(data3)


        var sumofmed=0;
        for(i=0;i<data3.length;i++){
            sumofmed=0;

            //console.log(area);
            for(j=0;j<data3[i].values.length;j++){

                if(!(data3[i].values[j].key==="NA")) {
                    //    console.log(data3[i].values[j].value)
                    sumofmed = sumofmed + data3[i].values[j].value;
                }
            }

            data2[i].value=sumofmed;
        }
        //  console.log(data3)
        console.log(data2[4].value)




console.log(data3)


        var myCountrydata;
        var myCountdata;


        var path = d3.geoPath();
        var projection = d3.geoNaturalEarth()
            .scale(width / 2 / Math.PI)
            .translate([width / 2, height / 2])
        var path = d3.geoPath()
            .projection(projection);

// Data and color scale


        var colorScheme = d3.schemeReds[7]
        if(colorScheme.includes("#eee")){}
        else
            colorScheme.unshift("#eee")

        var colorScale = d3.scaleThreshold()
            .domain([0,0.005,0.025, 0.05,0.1, 0.2, 0.5, 1])
            .range(colorScheme);
       // console.log(colorScale)

// Legend
        var g = svg.append("g")
            .attr("class", "legendThreshold")
            .attr("transform", "translate(5,5)");
        g.append("ext")
            .attr("class", "caption")
            .attr("x", 0)
            .attr("y", -6)
            .text("Count");
        var labels = ['0  Medals/sq.ft area','0.005','0.025', '0.05', '0.1','0.2', '0.5',   '> 1'];
        var legend = d3.legendColor()
            .labels(function (d) {

                    console.log(d.i)
                    return labels[d.i];

            })

            .scale(colorScale);
        svg.select(".legendThreshold")
            .call(legend);

// Load external data and boot

        d3.queue()
            .defer(d3.json, './data/world.json')


            .await(function ready(error, topo,data) {
                if (error) throw error;

                // Draw the map
                svg.append("g")
                    .attr("class", "countries")
                    .selectAll("path")
                    .data(topo.features)
                    .enter().append("path")
                    .attr("fill", function (d){
                        // Pull data for this country
// var area=d3.geo.centroid(d);
                        var area=path.area(d);
                        console.log(d.id);
                        console.log(path.area(d));

                        for( i=0;i<data2.length;i++){
                            if(data2[i].key==d.id){
                                if(data2[i].key===d.id){
                                    data2[i].value=data2[i].value/area;
                                    console.log(d.id);
                                    console.log(area);
                                    console.log(data2[i].value)
                                }

                                ColorValue=data2[i].value


                                mapper[d.properties.name]=ColorValue;
                                return colorScale(ColorValue);
                            }

                        }

                        return colorScale(0);



                        // Set the color

                    })
                    .attr("d", path)
                    //On mousehover for annotation
                    .on('click',function(d){
                        plotPie(d);
                    })
                    .on('mouseover', function (d) {
                        //  console.log(d)
                        d3.select(this)
                            .transition()
                            .duration(500)

                            .attr('stroke-width',2.5)
                            .enter()
                            .append("text")
                            .text(function(d) {return d.properties.name+'\nDensity: '+mapper[d.properties.name];})

                    })
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .transition()
                            .duration(500)

                            .attr('stroke-width',1)
                    })
                    .append('title')
                    .text(function(d) {return "CLICK FOR DETAILS!"+'\n'+d.properties.name+'\nDensity: '+(mapper[d.properties.name]===undefined?0:mapper[d.properties.name]);})




                ;
            });
    });


}



