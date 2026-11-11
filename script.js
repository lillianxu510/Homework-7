
var globalData = [
    {
        Project: "City Livability",
        Count: 4,
        Technologies: "Python, Pandas, Plotly, Panel"
    },
    {
        Project: "Video Game Database",
        Count: 4,
        Technologies: "Python, Flask, MySQL, Docker"
    },
    {
        Project: "MBTA Analysis",
        Count: 3,
        Technologies: "Python, Pandas, Matplotlib"
    }
];



function addD3VisToPage(elementID) {

    var containerParent = document.getElementById(elementID);

    if (containerParent == null) {
        return;
    }

    processD3Vis(globalData, elementID);
}



function processD3Vis(data, elementID) {

    const margin = {
        top: 40,
        right: 20,
        bottom: 100,
        left: 60
    };

    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#" + elementID).selectAll("*").remove();

    const svg = d3.select("#" + elementID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", "0 0 460 400")
        .append("g")
        .attr("transform",
              `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Project))
        .padding(0.2);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-35)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, 5])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(5));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 85)
        .text("Data Science Projects");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height / 2)
        .text("Number of Technologies");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", -15)
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Technologies Used by Project");

    const bars = svg.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Project))
        .attr("y", d => y(d.Count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Count));

    const tooltipContainer = svg.append("g")
        .attr("visibility", "hidden")
        .style("pointer-events", "none");

    tooltipContainer.append("rect")
        .attr("width", 230)
        .attr("height", 65)
        .attr("fill", "lightgray")
        .attr("stroke", "darkgray")
        .attr("rx", 8);

    const tooltipTitle = tooltipContainer.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .style("font-size", "12px")
        .style("font-weight", "bold");

    const tooltipCount = tooltipContainer.append("text")
        .attr("x", 10)
        .attr("y", 38)
        .style("font-size", "11px");

    const tooltipText = tooltipContainer.append("text")
        .attr("x", 10)
        .attr("y", 55)
        .style("font-size", "10px");

    function moveTooltip(event) {
        const [mx, my] = d3.pointer(event, svg.node());

        const tooltipX = Math.max(
            0, Math.min(mx + 10, width - 230)
        );

        const tooltipY = Math.max(
            0, Math.min(my - 75, height - 65)
        );

        tooltipContainer.attr(
            "transform",
            `translate(${tooltipX},${tooltipY})`
        );
    }

    bars.on("mouseover", function(event, d) {

        tooltipTitle.text(d.Project);
        tooltipCount.text("Technologies: " + d.Count);
        tooltipText.text(d.Technologies);

        moveTooltip(event);

        tooltipContainer.attr("visibility", "visible");

    })
    .on("mousemove", function(event, d) {

        moveTooltip(event);

    })
    .on("mouseout", function() {

        tooltipContainer.attr("visibility", "hidden");

    });

}

addD3VisToPage("d3-visualization");
