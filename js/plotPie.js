function plotPie(p){

    var p=p;
    var data2;
    var format=d3.format(",.0f");

    d3
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();
    var newdata={}
    var margin = { top: 20, right: 0, bottom: 20, left: 0 }
    var height = 400 - margin.top - margin.bottom
    var width = 400 - margin.left - margin.right
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20c);

    document.getElementById("title2").innerHTML="DONUT PIE CHART";

    d3.csv('./data/athlete_events_new.csv', function (data) {

        data2 = d3.nest(data)
            .key(function (data) {
                if(data.NOC===p.id)
                    return data.Sport;
            })
            .rollup(function (data) {

                return data.length
            })
            .entries(data);



        var sum=0;
        //  console.log(data2)
        for (j=0;j<data2.length;j++){

            if(data2[j].key==="undefined"){
                //    console.log(data2[j])
                data2[j].value=0;
            }
            else
                sum=sum+data2[j].value;
        }
        // console.log(sum)

        if(sum===0){
            alert("No participation in Olympics by  "+p.id);
        }
        for (j=0;j<data2.length;j++){
            data2[j].value=(data2[j].value/sum)*100  //percentage
        }

        //    console.log(data2)


        var arc = d3.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 100);

        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 80);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) {
                //   console.log(d.value);
                return d.value; });

        var svg = d3.select("#vis_canvas2").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(data2))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) {
                //console.log(d.value);
                return color(d.value); })
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)

                    .attr('stroke-width',3)
                    .enter()
                    .append("text")
                    .text(function(d) {return 'Sport:'+d.data.key+'\nShare:'+d.value+'%:';})

            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)

                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function(d)

            {
                // console.log(d)
                return 'Sport:  '+d.data.key+'\nShare:  '+format(d.value)+'%:';})
        ;


        /*    g.append("text")
                .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) {

                    return d.data.key; });
    */
    });


}