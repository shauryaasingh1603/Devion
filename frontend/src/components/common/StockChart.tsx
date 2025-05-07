import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StockChartProps {
  data: {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showVolume?: boolean;
  showTooltip?: boolean;
  timeframe?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';
  className?: string;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 30, left: 50 },
  showVolume = true,
  showTooltip = true,
  timeframe = '1M',
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    
    d3.select(svgRef.current).selectAll('*').remove();
    
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const volumeHeight = showVolume ? chartHeight * 0.2 : 0;
    const priceHeight = chartHeight - volumeHeight;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, chartWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.low) as number * 0.99,
        d3.max(data, d => d.high) as number * 1.01
      ])
      .range([priceHeight, 0]);
    
    const line = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.close));
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 1.5)
      .attr('d', line);
    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.append('g')
      .attr('transform', `translate(0,${priceHeight})`)
      .call(xAxis);
    
    svg.append('g')
      .call(yAxis);
    
    if (showVolume) {
      const volumeScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.volume) as number])
        .range([volumeHeight, 0]);
      
      svg.selectAll('.volume-bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'volume-bar')
        .attr('x', d => xScale(d.date) - 2)
        .attr('y', d => priceHeight + volumeScale(d.volume))
        .attr('width', 4)
        .attr('height', d => volumeHeight - volumeScale(d.volume))
        .attr('fill', d => d.close > d.open ? '#16a34a' : '#dc2626');
      
      const volumeAxis = d3.axisRight(volumeScale)
        .ticks(3)
        .tickFormat(d => {
          if (typeof d === 'number') {
            if (d >= 1000000) return `${(d / 1000000).toFixed(1)}M`;
            if (d >= 1000) return `${(d / 1000).toFixed(1)}K`;
            return d.toString();
          }
          return '';
        });
      
      svg.append('g')
        .attr('transform', `translate(${chartWidth},${priceHeight})`)
        .call(volumeAxis);
    }
    
    if (showTooltip) {
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('pointer-events', 'none');
      
      const bisect = d3.bisector((d: any) => d.date).left;
      
      const focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');
      
      focus.append('circle')
        .attr('r', 4)
        .attr('fill', '#2563eb');
      
      focus.append('line')
        .attr('class', 'x-hover-line')
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('y1', 0)
        .attr('y2', priceHeight);
      
      focus.append('line')
        .attr('class', 'y-hover-line')
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('x1', 0)
        .attr('x2', chartWidth);
      
      svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', chartWidth)
        .attr('height', priceHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseover', () => {
          focus.style('display', null);
          tooltip.style('opacity', 1);
        })
        .on('mouseout', () => {
          focus.style('display', 'none');
          tooltip.style('opacity', 0);
        })
        .on('mousemove', (event) => {
          const [mouseX] = d3.pointer(event);
          const x0 = xScale.invert(mouseX);
          const i = bisect(data, x0, 1);
          const d0 = data[i - 1];
          const d1 = data[i];
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          focus.attr('transform', `translate(${xScale(d.date)},${yScale(d.close)})`);
          focus.select('.x-hover-line').attr('y2', priceHeight - yScale(d.close));
          focus.select('.y-hover-line').attr('x1', -xScale(d.date)).attr('x2', chartWidth - xScale(d.date));
          
          tooltip
            .html(`
              <div>
                <strong>Date:</strong> ${d.date.toLocaleDateString()}<br/>
                <strong>Open:</strong> ${d.open.toFixed(2)}<br/>
                <strong>High:</strong> ${d.high.toFixed(2)}<br/>
                <strong>Low:</strong> ${d.low.toFixed(2)}<br/>
                <strong>Close:</strong> ${d.close.toFixed(2)}<br/>
                <strong>Volume:</strong> ${d.volume.toLocaleString()}
              </div>
            `)
            .style('left', `${event.pageX + 15}px`)
            .style('top', `${event.pageY - 28}px`);
        });
    }
    
  }, [data, width, height, margin, showVolume, showTooltip, timeframe]);
  
  return (
    <div className={`stock-chart ${className}`.trim()}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StockChart;
