const factory = (axis, svg, currentFrame) =>
    // Use newMargin redefine the new margin and range of xAxis
    axis()
        .plotDim([
            currentFrame.dimension().width,
            currentFrame.dimension().height,
        ])
        .range([currentFrame.dimension().height, 0])
        .frameName('webFrameMDefault')
        .tickSize(currentFrame.dimension().width)
        .rem(currentFrame.rem());

export default {
    yLinear: [
        (axis, svg, currentFrame) => {
            // Instantiate yLinear
            const yAxis = factory(axis, svg, currentFrame)
                .domain([0, 200])
                .align('left');

            // Set up yAxis
            currentFrame.plot().call(yAxis);

            // Get newly-calculated margin value
            const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

            // Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({ left: newMargin });

            // Call parent container to update positioning
            svg.call(currentFrame);

            // Translate axis from the left
            yAxis
                .yLabel()
                .attr(
                    'transform',
                    `translate(${yAxis.tickSize() - yAxis.labelWidth()}, 0)`,
                );
        },
        (axis, svg, currentFrame) => {
            const yAxis = factory(axis, svg, currentFrame)
                .domain([0, 200])
                .align('right');

            // Set up yAxis
            currentFrame.plot().call(yAxis);

            // Get newly-calculated margin value
            const newMargin = yAxis.labelWidth() + currentFrame.margin().right;

            // Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({ right: newMargin });
            // Call parent container to update positioning
            svg.call(currentFrame);
        },
    ],
    yDate: [
        (axis, svg, currentFrame) => {
            // Instantiate yDate
            const yAxis = factory(axis, svg, currentFrame)
                .domain([new Date('2000-01-01T00:00:00.00Z'), new Date()])
                .range([0, currentFrame.dimension().height])
                .minorTickSize(currentFrame.rem() * 0.3)
                .align('left');

            // Set up yAxis
            currentFrame.plot().call(yAxis);

            // Get newly-calculated margin value
            const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

            // Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({ left: newMargin });

            // Translate axis from the left
            yAxis
                .yLabel()
                .attr(
                    'transform',
                    `translate(${yAxis.tickSize() - yAxis.labelWidth()}, 0)`,
                );

            // Call parent container to update positioning
            svg.call(currentFrame);
        },
        (axis, svg, currentFrame) => {
            // Instantiate yDate
            const yAxis = factory(axis, svg, currentFrame)
                .minorTickSize(currentFrame.rem() * 0.3)
                .range([0, currentFrame.dimension().height])
                .domain([new Date('2000-01-01T00:00:00.00Z'), new Date()])
                .align('right');

            // Set up yAxis
            currentFrame.plot().call(yAxis);

            // Get newly-calculated margin value
            const newMargin = yAxis.labelWidth() + currentFrame.margin().right;

            // Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({ right: newMargin });

            // Call parent container to update positioning
            svg.call(currentFrame);

            yAxis
                .yLabelMinor()
                .attr(
                    'transform',
                    `translate(${yAxis.tickSize() - yAxis.labelWidth()}, 0)`,
                );
        },
    ],
    yOrdinal: [
        (axis, svg, currentFrame) => {
            // Instantiate yOrdinal
            const yAxis = factory(axis, svg, currentFrame)
                .tickSize(5) // Tiny ticks
                .align('left');

            // Set up yAxis
            currentFrame.plot().call(yAxis);

            // Get newly-calculated margin value
            const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

            // Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({ left: newMargin });

            // Call parent container to update positioning
            svg.call(currentFrame);

            yAxis
                .yLabel()
                .attr('transform', `translate(${yAxis.labelWidth()}, 0)`);
        },
        (axis, svg, currentFrame) => {
            // Instantiate yOrdinal
            const yAxis = factory(axis, svg, currentFrame)
                .tickSize(0)
                .align('right');

            // Set up yAxis
            currentFrame.plot().call(yAxis);

            // Get newly-calculated margin value
            const newMargin = yAxis.labelWidth() + currentFrame.margin().right;

            // Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({ right: newMargin });

            // Call parent container to update positioning
            svg.call(currentFrame);

            yAxis
                .yLabel()
                .attr(
                    'transform',
                    `translate(${currentFrame.dimension().width +
                        yAxis.labelWidth()}, 0)`,
                );
        },
    ],
    xDate: [
        (axis, svg, currentFrame) => {
            // Instantiate xDate
            const xAxis = factory(axis, svg, currentFrame)
                .align('bottom')
                .range([0, currentFrame.dimension().width])
                .tickSize(currentFrame.rem() * 0.75)
                .minorTickSize(currentFrame.rem() * 0.3);

            // Set up xAxis
            currentFrame.plot().call(xAxis);

            // Translate axis to bottom of plot
            xAxis
                .xLabel()
                .attr(
                    'transform',
                    `translate(0,${currentFrame.dimension().height})`,
                );
            xAxis
                .xLabelMinor()
                .attr(
                    'transform',
                    `translate(0,${currentFrame.dimension().height})`,
                );
        },
        (axis, svg, currentFrame) => {
            // Instantiate xDate
            const xAxis = factory(axis, svg, currentFrame)
                .align('top')
                .tickSize(currentFrame.rem() * 0.75)
                .range([0, currentFrame.dimension().width])
                .minorTickSize(currentFrame.rem() * 0.3);

            // Set up xAxis
            currentFrame.plot().call(xAxis);
        },
    ],
    xLinear: [
        (axis, svg, currentFrame) => {
            // Instantiate xLinear
            const xAxis = factory(axis, svg, currentFrame)
                .range([0, currentFrame.dimension().width])
                .plotDim([
                    currentFrame.dimension().width,
                    currentFrame.dimension().height,
                ])
                .rem(currentFrame.rem())
                .tickSize(currentFrame.dimension().height)
                .align('bottom')
                .frameName('webFrameMDefault');

            // Set up xAxis
            currentFrame.plot().call(xAxis);
        },
        (axis, svg, currentFrame) => {
            // Adds some margin to deal with the lack of a y-axis in test
            const newMargin = currentFrame.rem();
            currentFrame.margin({ right: newMargin });

            // Set up the chart frame
            svg.call(currentFrame);

            // Instantiate xLinear
            const xAxis = factory(axis, svg, currentFrame)
                .tickSize(currentFrame.dimension().height)
                .range([0, currentFrame.dimension().width])
                .align('top');

            // Set up xAxis
            currentFrame.plot().call(xAxis);

            xAxis
                .xLabel()
                .attr('transform', `translate(0, ${xAxis.tickSize()})`);
        },
    ],
    xOrdinal: [
        (axis, svg, currentFrame) => {
            // Instantiate xAxis
            const xAxis = factory(axis, svg, currentFrame)
                .tickSize(10)
                .rangeRound([0, currentFrame.dimension().width])
                .align('bottom');

            // Set up xAxis
            currentFrame.plot().call(xAxis);

            // Translate to bottom of plot
            xAxis
                .xLabel()
                .attr(
                    'transform',
                    `translate(0,${currentFrame.dimension().height +
                        currentFrame.rem()})`,
                );
        },
        (axis, svg, currentFrame) => {
            // Instantiate xAxis
            const xAxis = factory(axis, svg, currentFrame)
                .tickSize(10)
                .rangeRound([0, currentFrame.dimension().width])
                .align('top');

            // Set up xAxis
            currentFrame.plot().call(xAxis);
        },
    ],
};
