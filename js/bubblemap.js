function bubblemap(){

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



        var myCountrydata;
        var myCountdata;


        var path = d3.geoPath();
        var projection = d3.geoNaturalEarth()
            .scale(width / 2 / Math.PI)
            .translate([width / 2, height / 2])
        var path = d3.geoPath()
            .projection(projection);

// Data and color scale
        var data = d3.map();



// Load external data and boot

        d3.queue()
            .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")


            .await(function ready(error, topo,data) {
                if (error) throw error;

                // Draw the map
                svg.append("g")
                    .attr("class", "countries")
                    .selectAll("path")
                    .data(topo.features)
                    .enter().append("path")

                        // Pull data for this country



                    .attr("d", path)
                    //On mousehover for annotation
                    .on('click',function(d){
                        plotPie(d);
                    })

                svg
                    .append("g")
                    .attr("class", "bubble")
                    .selectAll("circle")
                    .data(topo.features)
                    .enter()
                    .append("circle")
                    .attr("transform", function(d) {
                        return "translate(" + path.centroid(d) + ")";
                    })
                    .attr("r", function(d) {

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
                                return ColorValue+5;
                            }

                        }

                        return 0;


                            // Set the color


                        }) .attr("d", path)
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
                    .text(function(d) {return d.properties.name+'\nDensity: '+(mapper[d.properties.name]===undefined?0:mapper[d.properties.name]);})




            });
    });



}