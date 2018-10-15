
function scatterplot() {


    //Added this on 10-Sep-2018 to clear screen as new points after adding filter would just plot on top of old one. Fix to clear old graph
    d3
        .select("#vis_canvas")
        .selectAll("*")
        .remove();
    d3
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();




// set the dimensions and margins of the graph
    d3.csv('./data/10yearAUSOpenMatches.csv', function (data) {
        data.forEach(function(d) {

            d.total1 = +d.total1;
            d.total2 = +d.total2;

        });

        // Variables
        var mycanvas = d3.select('#vis_canvas')
        var margin = { top: 70, right: 50, bottom: 70, left: 50 }
        var h = 500 - margin.top - margin.bottom
        var w = 500 - margin.left - margin.right

        var filterYear=document.getElementById('select_year').value;
        var filterRound=document.getElementById('select_round').value;


        // Standard Scale to define ddomain and range
        var backcolor = d3.scale.category20()
        var xScale = d3.scale.linear()
            .domain([
                d3.min([d3.min(data,function (d) {
                    return d.total1
                })]),
                d3.max([0,d3.max(data,function (d) {
                    return d.total1
                })])

            ])
            .range([0,w])
        var yScale = d3.scale.linear()
            .domain([
                d3.min([0,d3.min(data,function (d) {
                    return d.total2
                })]),
                d3.max([0,d3.max(data,function (d) {
                    return d.total2
                })])
            ])
            .range([h,0])

        var svg = mycanvas.append('svg')
            .attr('height',h + margin.top + margin.bottom)
            .attr('width',w + margin.left + margin.right)
            .append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
        // X-axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
        // Y-axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')

        // points that represent data points of each match
        var points = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .filter(function(d) {                                   //Part2: Added filtering condition on 09-Sep-2018 to provide yearly view of data
                if(filterYear==='all'){
                    return d.year;
                }
                else {
                    return d.year === filterYear ? this : null;
                }
            })
            .filter(function(d) {                                   //Part2: Added filtering condition on 10-Sep-2018 to provide yearly view of data
                if(filterRound==='all'){
                    return d.round;
                }
                else {
                    return d.round === filterRound ? this : null;
                }
            })
            .attr('cx',function (d) { return xScale(d.total1) })
            .attr('cy',function (d) { return yScale(d.total2) })
            .attr('r','3')
            .attr('stroke','black')
            .attr('stroke-width',1)
            .attr('fill',function (d,i) { return backcolor(0) })
            .on('click',function(d){
                linegraph(d);
            })
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',3)
                    .enter()
                    .append("text")
                    .text(function(d) {return 'Player 1:'+d.player1+'\nPlayer 2:'+d.player2+'\ntotal1:'+d.total1+'\ntotal2:'+d.total2;})

            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',3)
                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function (d) { return 'Player 1:'+d.player1+'\nPlayer 2:'+d.player2+'\ntotal 1: '+ d.total1 +
                '\ntotal 2: ' + d.total2 })



        // X-axis
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + h + ')')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'12px'})
            .call(xAxis)
            .append('text') // X-axis Label
            .attr('class','label')
            .attr('y',-10)
            .attr('x',w)
            .attr('dx','.71em')
            .style('text-anchor','end')
            .text('Total Points by Player 1')
        // Y-axis
        svg.append('g')
            .attr('class', 'axis')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'12px'})
            .call(yAxis)
            .append('text') // y-axis Label
            .attr('class','label')
            .attr('transform','rotate(-90)')
            .attr('x',0)
            .attr('y',1)
            .attr('dy','.71em')
            .style('text-anchor','end')
            .text('Total Points by Player 2')


    });

}
