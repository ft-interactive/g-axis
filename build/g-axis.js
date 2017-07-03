(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
	(factory((global.gAxis = global.gAxis || {}),global.d3));
}(this, function (exports,d3) { 'use strict';

	function xLinear () {
		let scale = d3.scaleLinear()
	        .domain([0, 100])
	        .range([0, 220]);
		let tickSize = 50;
		let numTicks = 5;
		let align = 'bottom';
		let xAxisHighlight = 0;
		let xLabel;

		function getAxis(alignment) {
			return {
				top: d3.axisTop(),
				bottom: d3.axisBottom(),
			}[alignment];
		}

		function axis(parent) {
			const xAxis = getAxis(align)
				.tickSize(tickSize)
				.ticks(numTicks)
				.scale(scale);

			xLabel = parent.append('g')
				.attr('class', 'axis xAxis')
				.call(xAxis);

			xLabel.selectAll('.tick')
				.filter(d => d === 0 || d === xAxisHighlight)
				.classed('baseline', true);
		}

		axis.align = (d) => {
			if (!d) return align;
			align = d;
			return axis;
		};
		axis.scale = (d) => {
			if (!d) return scale;
			scale = d;
			return axis;
		};
		axis.domain = (d) => {
			scale.domain(d);
			return axis;
		};
		axis.range = (d) => {
			scale.range(d);
			return axis;
		};
		axis.tickSize = (d) => {
			if (d === undefined) return tickSize;
			tickSize = d;
			return axis;
		};
		axis.xLabel = (d) => {
			if (d === undefined) return xLabel;
			xLabel = d;
			return axis;
		};
		axis.numTicks = (d) => {
			if (d === undefined) return numTicks;
			numTicks = d;
			return axis;
		};
		axis.xAxisHighlight = (d) => {
			xAxisHighlight = d;
			return axis;
		};

		return axis;
	}

	function yOrdinal () {
		let align = 'left';
		let scale = d3.scaleBand()
			.domain(['Oranges', 'Lemons', 'Apples', 'Pears'])
	        .rangeRound([0, 220])
	        .paddingInner(0.1)
			.paddingOuter(0.05);
		let labelWidth = 0;
		let tickSize = 0;
		let offset = 0;
		let yLabel;

		function getAxis(alignment) {
			return {
				left: d3.axisLeft(),
				right: d3.axisRight(),
			}[alignment];
		}

		function axis(parent) {
			const yAxis = getAxis(align)
				.tickSize(tickSize)
				.scale(scale);

			if (scale.domain.length > 1) {
				scale.paddingInner(0.1);
			}		else { scale.paddingInner(0.2); }

			yLabel = parent.append('g')
				.attr('class', 'axis yAxis')
				.call(yAxis);

			// Calculate width of widest .tick text
			parent.selectAll('.yAxis text').each(function calcTickTextWidth() {
				labelWidth = Math.max(this.getBBox().width, labelWidth);
			});

			parent.selectAll('.axis.yAxis text')
				.attr('id', 'yAxisLabel');
		}

		axis.scale = (d) => {
			if (!d) return scale;
			scale = d;
			return axis;
		};
		axis.domain = (d) => {
			scale.domain(d);
			return axis;
		};
		axis.rangeRound = (d) => {
			scale.rangeRound(d);
			return axis;
		};
		axis.bandwidth = (d) => {
			if (!d) return scale.bandwidth();
			scale.bandwidth(d);
			return axis;
		};
		axis.labelWidth = (d) => {
			if (d === undefined) return labelWidth;
			labelWidth = d;
			return axis;
		};
		axis.yLabel = (d) => {
			if (d === undefined) return yLabel;
			yLabel = d;
			return axis;
		};
		axis.paddingInner = (d) => {
			if (!d) return scale.paddingInner();
			scale.paddingInner(d);
			return axis;
		};
		axis.paddingOuter = (d) => {
			if (!d) return scale.paddingOuter();
			scale.paddingOuter(d);
			return axis;
		};
		axis.tickSize = (d) => {
			if (d === undefined) return tickSize;
			tickSize = d;
			return axis;
		};
		axis.offset = (d) => {
			if (d === undefined) return offset;
			offset = d;
			return axis;
		};
		axis.align = (d) => {
			if (!d) return align;
			align = d;
			return axis;
		};

		return axis;
	}

	function yLinear () {
		let scale = d3.scaleLinear()
			.domain([0, 10000])
			.range([120, 0]);
		let align = 'right';
		let labelWidth = 0;
		let tickSize = 300;
		let yAxisHighlight = 0;
		let numTicks = 5;
		let yLabel;

		function getAxis(alignment) {
			return {
				left: d3.axisLeft(),
				right: d3.axisRight(),
			}[alignment];
		}

		function axis(parent) {
			const yAxis = getAxis(align)
				.ticks(numTicks)
				.scale(scale);

			yLabel = parent.append('g')
				.attr('class', 'axis yAxis')
				.call(yAxis);

			// Calculate width of widest .tick text
			parent.selectAll('.yAxis text').each(function calcTickTextWidth() {
				labelWidth = Math.max(this.getBBox().width, labelWidth);
			});

	        // Use this to amend the tickSIze and re cal the vAxis
			yLabel.call(yAxis.tickSize(tickSize - labelWidth));

			yLabel.selectAll('.tick')
				.filter(d => d === 0 || d === yAxisHighlight)
				.classed('baseline', true);
		}

		axis.scale = (d) => {
			scale = d;
			return axis;
		};
		axis.domain = (d) => {
			scale.domain(d);
			return axis;
		};
		axis.range = (d) => {
			scale.range(d);
			return axis;
		};
		axis.align = (d) => {
			align = d;
			return axis;
		};
		axis.labelWidth = (d) => {
			if (d === undefined) return labelWidth;
			labelWidth = d;
			return axis;
		};
		axis.tickSize = (d) => {
			if (d === undefined) return tickSize;
			tickSize = d;
			return axis;
		};
		axis.yAxisHighlight = (d) => {
			yAxisHighlight = d;
			return axis;
		};
		axis.numTicks = (d) => {
			numTicks = d;
			return axis;
		};
		axis.align = (d) => {
			if (!d) return align;
			align = d;
			return axis;
		};
		axis.yLabel = (d) => {
			if (d === undefined) return yLabel;
			yLabel = d;
			return axis;
		};

		return axis;
	}

	exports.xLinear = xLinear;
	exports.yOrdinal = yOrdinal;
	exports.yLinear = yLinear;

	Object.defineProperty(exports, '__esModule', { value: true });

}));