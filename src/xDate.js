import * as d3 from 'd3';

export default function () {
    let mindate = new Date(1970,1,1);
    let maxdate = new Date(2017,6,1);
    let scale = d3.scaleTime()
        .domain([mindate,maxdate])
        .range([0,220]);
    let interval ="lustrum";
    let minorAxis = true;
    let tickSize=10;
    let minorTickSize=5;
    let fullYear = false;
    let align = 'bottom';
    let xLabel;
    let xLabelMinor;

    function axis(parent) {

        function getAxis(alignment) {
            return {
                top: d3.axisTop(),
                bottom: d3.axisBottom(),
            }[alignment];
        }

        const xAxis =getAxis(align)
            .tickSize(tickSize)
            .ticks(getTicks(interval))
            .tickFormat(tickFormat(interval))
            .scale(scale)

        const xMinor=d3.axisBottom()
            .tickSize(minorTickSize)
            .ticks(getTicksMinor(interval))
            .tickFormat("")
            .scale(scale)

        xLabel = parent.append("g")
            .attr("class","axis baseline")
            .call(xAxis)

        if (minorAxis) {
            xLabelMinor = parent.append("g")
            .attr("class",(d)=>{
                let plotHeight = d3.select('.chart-plot').node().getBBox().height
                if (plotHeight == tickSize) {
                    return "axis xAxis";
                }
                else {return "axis baseline"}
            })
            .call(xMinor)
        }
    }

    function getTicks(interval) {
        console.log()
        return {
            "century":d3.timeYear.every(100),
            "jubilee":d3.timeYear.every(50),
            "decade":d3.timeYear.every(10),
            "lustrum":d3.timeYear.every(5),
            "years":d3.timeYear.every(1),
            "quarters":d3.timeMonth.every(3),
            "months":d3.timeMonth.every(1),
            "weeks":d3.timeWeek.every(1),
            "days":d3.timeDay.every(1),
            "hours":d3.timeHour.every(1)
        }[interval]
    }
    function getTicksMinor(interval) {
        return {
            "century":d3.timeYear.every(10),
            "jubilee":d3.timeYear.every(10),
            "decade":d3.timeYear.every(1),
            "lustrum":d3.timeYear.every(1),
            "years":d3.timeMonth.every(1),
            "quarters":d3.timeMonth.every(1),
            "months":d3.timeDay.every(1),
            "weeks":d3.timeDay.every(1),
            "days":d3.timeHour.every(1),
            "hours":d3.timeMinute.every(1)
        }[interval]
    }

    function tickFormat(interval) {
        let formatFullYear=d3.timeFormat("%Y"),
        formatYear=d3.timeFormat("%y")
        return {
            "century":d3.timeFormat("%Y"),
            "jubilee":function(d,i) {
                let format= checkCentury(d,i);
                return format
            },
            "decade":function(d,i) {
                let format= checkCentury(d,i);
                return format
            },
            "lustrum":function(d,i) {
                let format= checkCentury(d,i);
                return format
            },
            "years": function(d,i) {
                let format= checkCentury(d,i);
                return format
            },
            "quarters":d3.timeFormat("%b"),
            "months":d3.timeFormat("%b"),
            "weeks":d3.timeFormat("%b"),
            "days":d3.timeFormat("%d"),
            "hours":d3.timeFormat("%I"+":00")
        }[interval]

        function checkCentury(d,i) {
            if (fullYear || (+formatFullYear(d) % 100 === 0) ||(i==0)) {
                return formatFullYear(d)
            }
            else {
                return formatYear(d)
            }
        }

    }

    axis.align = (d)=>{
        align = d;
        return axis;
    }
    axis.scale = (d)=>{
        scale = d;
        return axis;
    }
    axis.domain = (d)=>{
        scale.domain(d);
        return axis;
    };
    axis.range = (d)=>{
        scale.range(d);
        return axis;
    };

    axis.fullYear = (d)=>{
        fullYear = d;
        return axis;
    }
    axis.interval = (d)=>{
        interval = d;
        return axis;
    }
    axis.tickSize = (d)=>{
        if(!d) return tickSize;
        tickSize = d;
        return axis;
    }
    axis.minorTickSize = (d)=>{
        if(!d) return minorTickSize;
        minorTickSize = d;
        return axis;
    }
    axis.minorAxis = (d)=>{
        minorAxis = d;
        return axis;
    }
    axis.xLabel = (d) => {
        if (d === undefined) return xLabel;
        xLabel = d;
    return axis;
    };
    axis.xLabelMinor = (d) => {
        if (d === undefined) return xLabelMinor;
        xLabelMinor = d;
    return axis;
    };
    return axis
}
