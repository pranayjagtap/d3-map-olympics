function getData() {


    var tennis_data;
    console.log("Hi");

    var data1= d3.csv("./data/10yearAUSOpenMatches.csv", function(error,data) {

    });




    d3
        .select("#vis_canvas")
        .append()

        .data(data2)
        .enter()
        .append("text")
        .attr("x", 100)
        .attr("y", function (d, i) {
            return i*100 + 50;
        })
        .text(function (d) {
            return "multiple elements with proper d3 way: " + d;
        })
        .style("fill", function (d) {
            if (d > 10) {
                return "red";
            }
            return "black";
        });



}