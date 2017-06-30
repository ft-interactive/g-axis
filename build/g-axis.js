(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
	(factory((global.gAxis = global.gAxis || {}),global.d3));
}(this, function (exports,d3) { 'use strict';

	function xFoo () {
		return 42;
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

		function axis(parent) {
			const xAxis = d3.getAxis()
	            .tickSize(tickSize)
				.scale(scale);

			const yLabel = parent.append('g')
				.attr('class', 'axis xAxis')
				.call(xAxis);

			yLabel.attr('transform', 'translate(0, ' + (offset) + ')');
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
			labelWidth = d;
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

		function getAxis (alignment) {
			return {
				'left': d3.axisLeft(),
				'right': d3.axisRight(),
			} [alignment];
		}
		return axis;
	}

	exports.xFoo = xFoo;
	exports.yOrdinal = yOrdinal;

	Object.defineProperty(exports, '__esModule', { value: true });

}));