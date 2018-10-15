


function plotGraph(d){

var filterData=d;

    d3
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();


    d3.csv('./data/10yearAUSOpenMatches.csv', function (data) {
        data.forEach(function(d) {

            d.ace1 = +d.ace1;
            d.ace2 = +d.ace2;

        });

        // Variables
       // var body = d3.select('#vis_canvas2')
        var margin = { top: 50, right: 50, bottom: 50, left: 50 }
        var h = 500 - margin.top - margin.bottom
        var w = 500 - margin.left - margin.right
        var formatPercent = d3.format('.2%')


        var x = d3.scaleBand().rangeRound([0, w]).padding(0.1),
            y = d3.scaleLinear().rangeRound([h, 0]);



        var g_main = d3.select('#vis_canvas2').append('svg')
            .attr('height',h + margin.top + margin.bottom)
            .attr('width',w + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



        x.domain(data.map(function(d) { return d.ace1; }));
        y.domain([0, d3.max(data, function(d) { return d.ace2; })]);

        g_main.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + h + ")")
            .call(d3.axisBottom(x));

        g_main.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Ace 2");

        g_main.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .filter(function(d) {

                if(d.player1 === filterData.player1||d.player2 === filterData.player2||d.player2 === filterData.player1||d.player1 === filterData.player2){   //Added if cond on 10-sep-2018 to get both players

                    return this;
                }
                else
                    return null;

                // return d.player1 === filterData.player1? this : null ; //Part2: Filter condition added 09-Sep-2018
            })
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.ace1); })
            .attr("y", function(d) { return y(d.ace2); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return h - y(d.ace2); });




        var rect = svg.selectAll('bar')
            .data(data)
            .enter()
            .append('rect')

            .attr("class", "bar")
            .attr('x',function (d) { return xScale(d.ace1) })
            .attr('y',function (d) { return yScale(d.ace2) })
            .attr("height", function(d){ return h - margin.top - margin.bottom - yScale(d.ace2); })
            .attr("width", function(d){ return xScale.rangeBand(); })
            .attr('stroke','black')
            .attr('stroke-width',1)
            .attr('fill',function (d,i) { return colorScale(0) })


            .append('title')
            .text(function (d) { return 'Player 1:'+d.player1+'\nPlayer 2:'+d.player2+'\nAce 1: '+ d.ace1 +
                '\nAce 2: ' + d.ace2 })





    });

}