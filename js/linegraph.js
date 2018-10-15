function linegraph(d){

    var d=d;
    console.log(d);
    d3                                                                    //To clear previous rendering added on 09-Sep-2018
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();

    var body = d3.select('#vis_canvas2')

    var margin = {top: 70, right: 50, bottom: 70, left: 50},
        w = 500 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;




    var x = d3.scale.linear().range([0, w]);
    var y = d3.scale.linear().range([h, 0]);

    console.log("h");
    console.log(x);
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis().scale(y)
        .orient("left");




// Adds the svg canvas
    var svg = body.append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Get the data
    d3.csv("./data/10yearAUSOpenMatches.csv", function(error, csv_data) {
        var data2 = d3.nest(d)
            .key(function(d) { return d.player1;})
            .key(function(d){return d.year})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.winner1; });
            }).entries(csv_data);
        data2.forEach(function(data2) {
            data2.player1 = data2.key;
            data2.winner1 = data2.values;
            data2.year=+data2.year;
        });



        var myData=200;
        var myName;
        var winnerCount=0;
        for(var i=0;i<data2.length;i++)                              //Mother for loop added on 10-sep-2018 for nested retrieving data
            for(var j=0;j<data2[i].winner1.length;j++) {

                if(data2[i].player1===d.player1){                    //If cond added on 11-Sep-2018 to Compare player name as key to aggregate that player's stats
                    myName=data2[i].player1;

                    winnerCount=data2[i].winner1;

                }


            }
    console.log(winnerCount);


        var valueline = d3.svg.line()
            .x(function(winnerCount) { return x(winnerCount.key); })
            .y(function(winnerCount) { return y(winnerCount.values); });

        // Scale the range of the data
        x.domain(d3.extent(winnerCount, function(winnerCount) { return winnerCount.key;  }));
        y.domain([0, d3.max(winnerCount, function(winnerCount) { return winnerCount.values; })]);




        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom').tickFormat(d3.format("d"));

        console.log(xAxis);
        // Y-axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')

        // Add the valueline path.
        svg.append("path")

            .attr("class", "line")
            .attr("d", valueline(winnerCount))
            .attr('stroke','black')
            .attr('stroke-width',1);

        // X-axis
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + h + ')')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'10px'})
            .call(xAxis)
            .append('text') // X-axis Label
            .attr('class','label')
            .attr('y',-10)
            .attr('x',w)
            .attr('dx','.50em')
            .style('text-anchor','end')
            .text('Years')
        // Y-axis
        svg.append('g')
            .attr('class', 'axis')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'10px'})
            .call(yAxis)
            .append('text') // y-axis Label
            .attr('class','label')
            .attr('transform','rotate(-90)')
            .attr('x',0)
            .attr('y',1)
            .attr('dy','.71em')
            .style('text-anchor','end')
            .text('winner points')


    });

}