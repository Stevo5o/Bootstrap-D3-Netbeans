( function () {
var bardata = [];

// vary the input
d3.tsv('data.tsv', function(error, data) {

    if(error){
        return console.log(error);
    }

    for(key in data)
    {
      bardata.push(data[key].value)
    }

    var margin  = { top: 30, right: 30, bottom: 40, left: 50 }

    var height = 400 - margin.top - margin.bottom,
          width = 550 - margin.left - margin.right,
          barWidth = 50,
          barOffset = 5;

    var tempColor;

    // add colors
    var colors = d3.scale.linear()
          .domain( [ 0, bardata.length * .33, bardata.length * .66, bardata.length ] )
          .range( [ '#B58929', '#C61C6F', '#268BD2', '#85992C' ] )

    // quantitative scale
    var yScale = d3.scale.linear()
          .domain( [ 0, d3.max( bardata ) ] )
          .range( [ 0, height ] );

    // ordinal scale
    var xScale = d3.scale.ordinal()
          .domain( d3.range( 0, bardata.length ) )
          .rangeBands( [ 0, width ], .2 );

    var tooltip = d3.select( 'body' ).append( 'div' )
          .style( 'position', 'absolute' )
          .style( 'padding', '0 10px' )
          .style( 'background', 'white' )
          .style( 'opacity', 0 )

    var myChart1 = d3.select( '#chart1' ).append( 'svg' )
          .style('background', '#E7E0CB')
          .attr( 'width', width + margin.left + margin.right )
          .attr( 'height', height + margin.top + margin.bottom )
          .append( 'g' )
          .attr('transform', 'translate('+margin.left + ', ' + margin.top + ')')
          .selectAll( 'rect' ).data( bardata )
          .enter().append( 'rect' )
          .style( 'fill', function ( d, i )
          {
             return colors( i );
          } )
          .attr( 'width', xScale.rangeBand() )
          .attr( 'x', function ( d, i )
          {
             return xScale( i );
          } )
          .attr( 'height', 0 )
          .attr( 'y', height )

          .on( 'mouseover', function ( d )
          {
             tooltip.transition()
                     .style( 'opacity', .9 )

             tooltip.html( d )
                     .style( 'left', ( d3.event.pageX - 35 ) + 'px' )
                     .style( 'top', ( d3.event.pageY - 30 ) + 'px' )

             tempColor = this.style.fill;
             d3.select( this )
                     .style( 'opacity', .5 )
                     .style( 'fill', 'yellow' );
          } )

          .on( 'mouseout', function ( d )
          {
             d3.select( this )
                     .style( 'opacity', 1 )
                     .style( 'fill', tempColor );
          } );

    myChart1.transition()
          .attr( 'height', function ( d )
          {
             return yScale( d );
          } )
          .attr( 'y', function ( d )
          {
             return height - yScale( d );
          } )
          .delay( function ( d, i )
          {
             return i * 20;
          } )
          .duration( 1000 )
          .ease( 'elastic' )

    var vGuideScale = d3.scale.linear()
          .domain( [ 0, d3.max( bardata ) ] )
          .range( [ height, 0 ] )

    var vAxis = d3.svg.axis()
          .scale( vGuideScale )
          .orient( 'left' )
          .ticks( 10 )

    var vGuide = d3.select( 'svg' ).append( 'g' )
    vAxis( vGuide )
    vGuide.attr( 'transform', 'translate(' + margin.left + ', ' + margin.top + ')' )
    vGuide.selectAll( 'path' )
          .style( {fill: 'none', stroke: "#000"} )
    vGuide.selectAll( 'line' )
          .style( {stroke: "#000"} )

    var hAxis = d3.svg.axis()
          .scale( xScale )
          .orient( 'bottom' )
          .tickValues( xScale.domain().filter( function ( d, i )
          {
             return !( i % ( bardata.length / 16 ) );
          } ) )

    var hGuide = d3.select('svg').append('g')
    hAxis(hGuide)
    hGuide.attr( 'transform', 'translate(' + margin.left + ', ' + (height + (margin.top)) + ')' )
    hGuide.selectAll( 'path' )
          .style( {fill: 'none', stroke: "#000"} )
    hGuide.selectAll( 'line' )
          .style( {stroke: "#000"} )
});

// piechart
var width = 400,
        height = 400;        
radius = 200,
        colors = d3.scale.ordinal()
        .range(['#595AB7','#A57706','#D11C24','#C61C6F','#BD3613','#2176C7','#259286','#738A05']);

var piedata = [
   {
      label: "Bitter",
      value: 30
   },
   {
      label: "Red Ale",
      value: 40
   },
   {
      label: "Stout",
      value: 60
   },
   {
      label: "Lager",
      value: 200
   },
   {
      label: "Pilsener",
      value: 50
   },
   {
      label: "Gloden ale",
      value: 50
   }
];

var pie = d3.layout.pie()
        .value( function ( d )
        {
           return d.value;
        } )

var arc = d3.svg.arc()
        .outerRadius( radius )

var myChart2 = d3.select( '#chart2' ).append( 'svg' )
                .attr( 'width', '400' )
        .attr( 'height', '400' )
        .attr("text-anchor", "middle") 
    .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
    .attr('preserveAspectRatio','xMinYMin')
        .append( 'g' )
        .attr( 'transform', 'translate(' + ( width - radius ) + ', ' + ( height - radius ) + ' )' )
        .selectAll( 'path' ).data( pie( piedata ) )
        .enter().append( 'g' )
        .attr('class', 'slice')

var slices = d3.selectAll('g.slice')
.append('path')
.attr('fill', function(d, i)
{
  return colors(i);
})
.attr('d', arc)

var text = d3.selectAll('g.slice')
.append('text')
.text(function(d, i)
{
  return d.data.label;
})
.attr('text-anchor', 'middle')
.attr('fill', 'white')
.attr('transform', function(d)
{
  d.innerRadius = 0;
  d.outerRadius = radius;
  return 'translate('+ arc.centroid(d) +')'
})

// horizontal 
   var data =
           [
              {
                 key: 'Bitter',
                 value: 132
              },
              {
                 key: 'Ale',
                 value: 71
              },
              {
                 key: 'Stout',
                 value: 337
              },
              {
                 key: 'Lager',
                 value: 93
              },
              {
                 key: 'Bock',
                 value: 78
              },
              {
                 key: 'Dunkel',
                 value: 43
              },
              {
                 key: 'Pilsener',
                 value: 20
              },
              {
                 key: 'Weissbier',
                 value: 16
              },
              {
                 key: 'Pale ale',
                 value: 30
              },
              {
                 key: 'Red ale',
                 value: 8
              },
              {
                 key: 'Gloden ale',
                 value: 17
              },
              {
                 key: 'Brown ale',
                 value: 21
              }
           ];
   var w = 550;
   var h = 400;
   var margin = {
      top: 20,
      bottom: 40,
      left: 80,
      right: 20
   };
   var width = w - margin.left - margin.right;
   var height = h - margin.top - margin.bottom;
   var x = d3.scale.linear()
           .domain( [ 0, d3.max( data, function ( d )
              {
                 return d.value;
              } ) ] )
           .range( [ 0, width ] );
   var y = d3.scale.ordinal()
           .domain( data.map( function ( entry )
           {
              return entry.key;
           } ) )
           .rangeBands( [ 0, height ] );
   var linearColorScale = d3.scale.linear()
           .domain( [ 0, data.length ] )
           .range( [ "#572500", "#F68026" ] );
   var ordinalColorScale = d3.scale.category20();
   var xAxis = d3.svg.axis()
           .scale( x )
           .orient( 'bottom' );
   var yAxis = d3.svg.axis()
           .scale( y )
           .orient( 'left' );
   var svg = d3.select( "div#chart3" ).append( 'svg' )
           .attr( 'id', 'chart' )
           .attr( 'width', w )
           .attr( 'height', h );
   var chart = svg.append( 'g' )
           .classed( 'display', true )
           .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

   plot = function ( params )
   {
      this.selectAll( ".bar" )
              .data( params.data )
              .enter()
              .append( 'rect' )
              .classed( 'bar', 'true' )
              .attr( 'x', 0 )
              .attr( 'y', function ( d, i )
              {
                 return y( d.key );
              } )
              .attr( 'height', function ( d, i )
              {
                 return y.rangeBand() - 1;
              } )
              .attr( 'width', function ( d )
              {
                 return x( d.value );
              } )
              .style( "fill", function ( d, i )
              {
                 return ordinalColorScale( i );
                 // return linearColorScale( i );
              } );
      this.selectAll( ".bar-label" )
              .data( params.data )
              .enter()
              .append( 'text' )
              .classed( 'bar-label', true )
              .attr( 'x', function ( d )
              {
                 return x( d.value );
              } )
              .attr( 'dx', -4 )
              .attr( 'y', function ( d, i )
              {
                 return y( d.key );
              } )
              .attr( 'dy', function ( d, i )
              {
                 return y.rangeBand() / 1.5 + 2;
              } )
              .text( function ( d )
              {
                 return d.value;
              } )
      this.append( 'g' )
              .classed( 'x axis', true )
              .attr( 'transform', "translate(" + 0 + "," + height + ")" )
              .call( xAxis );

      this.append( 'g' )
              .classed( 'y axis', true )
              .attr( 'transform', "translate(0,0)" )
              .call( yAxis );
   };
   plot.call( chart, {
      data: data
   } );

  // vertical
 
   var margin = {
      top: 58,
      bottom: 100,
      left: 80,
      right: 40
   };
   var width = w - margin.left - margin.right;
   var height = h - margin.top - margin.bottom;

   var x = d3.scale.ordinal()
           .domain( data.map( function ( entry )
           {
              return entry.key;
           } ) )
          .rangeBands( [ 0, width ] );

   var y = d3.scale.linear()
           .domain( [ 0, d3.max( data, function ( d )
              {
                 return d.value;
              } ) ] )
           .range( [ height, 0 ] ); 
   var ordinalColorScale = d3.scale.category20();
   var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom'); 
   var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left'); 
   var yGridlines = d3.svg.axis()
                    .scale(y)
                    .tickSize(-width, 0, 0)
                    .tickFormat("")
                    .orient('left');
   var svg = d3.select( "div#chart4" ).append( 'svg' )
           .attr( 'id', 'chart' )
           .attr( 'width', w )
           .attr( 'height', h );
   var chart = svg.append( 'g' )
           .classed( 'display', true )
           .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );
  var controls = d3.select('div#chart4')
                  .append('div')  
                  .attr('id', 'controls');
  var sort_btn = controls.append('button')
                  .html('Sort data: assending')
                  .attr('state', 0);
   drawAxis = function(params)
   {
      if(params.initialize === true){
          // draw the gridlines and axis
          // draw the gridlines
          this.append('g')
              .call(yGridlines)
              .classed('gridline', true)
              .attr('transform', 'translate(0,0)')

          // x axis
          this.append('g')
                  .classed('x axis', true)
                  .attr('transform', "translate(" + 0 + "," + height + ")")
                  .call(params.axis.x)
                      .selectAll('text')
                      .classed('x-axis-label', true)
                          .style('text-anchor', 'end')
                          .attr('dx', -8)
                          .attr('dy', 8)
                          .attr('transform', 'translate(0,0) rotate(-45)'); 
          // y axis
          this.append('g')
                  .classed('y axis', true)
                  .attr('transform', "translate(0,0)")
                  .call(params.axis.y);

          // y label
          this.select('.y.axis')
                  .append('text')
                  .attr('x', 0)
                  .attr('y', 0)
                  .style('text-anchor', 'middle')
                  .attr('transform', 'translate(-50, ' + height/2 + ') rotate(-90)')
                  .text('Units Sold'); 

          // x label
          this.select('.x.axis')
                  .append('text')
                  .attr('x', 0)
                  .attr('y', 0)
                  .style('text-anchor', 'middle')
                  .attr('transform', 'translate(' + width/2 + ', 80)')
                  .text('Beer Type'); 
      } else if(params.initialize === false)
      {
          // update info
          this.selectAll('g.x.axis')
              .transition()
              .duration(500)
              .ease('bounce')
              .delay(500)
            .call(params.axis.x) 
          this.selectAll('.x-axis-label')           
              .style('text-anchor', 'end')
                  .attr('dx', -8)
                  .attr('dy', 8)
                  .attr('transform', 'translate(0,0) rotate(-45)')
          this.selectAll('g.y.axis')
              .transition()
              .duration(500)
              .ease('bounce')
              .delay(500)
            .call(params.axis.y)
      }
   }
   plot = function ( params )
   {
    x.domain( data.map( function ( entry )
           {
              return entry.key;
           } ) );
    y.domain( [ 0, d3.max( data, function ( d )
              {
                 return d.value;
              } ) ] );

      drawAxis.call(this, params);
      
      // enter()
      this.selectAll( ".bar" )
              .data( params.data )
              .enter()
                .append( 'rect' )
                .classed( 'bar', 'true' )
                .on('mouseover', function( d, i )
                  {
                      d3.select(this).style('fill', 'yellow');
                  })
                .on('mousemove', function( d, i )
                  {
                      
                  })
                .on('mouseout', function( d, i )
                  {
                      d3.select(this).style('fill', ordinalColorScale(i));
                  });

      this.selectAll( ".bar-label" )
              .data( params.data )
              .enter()
              .append( 'text' )
              .classed( 'bar-label', true );

      // update()
      this.selectAll('.bar')
          .transition()
          .duration(500)
          .ease('bounce')
          .delay(500)
          .attr( 'x', function(d, i)
          {
            return x(d.key);
          } )
          .attr( 'y', function ( d, i )
          {
             return y( d.value );
          } )
          .attr( 'height', function ( d, i )
          {
             return height - y(d.value);
          } )
          .attr( 'width', function ( d )
          {
             return x.rangeBand();
          } )
          .style( "fill", function ( d, i )
          {
            return ordinalColorScale(i);             
          } );

      this.selectAll('.bar-label')
          .transition()
          .duration(500)
          .ease('bounce')
          .delay(500)
          .attr( 'x', function ( d , i )
          {
             return x( d.key ) + ( x.rangeBand()/2);
          } )
          .attr( 'dx', 0 )
          .attr( 'y', function ( d, i )
          {
             return y( d.value );
          } )
          .attr( 'dy', -6 )
          .text( function ( d )
          {
             return d.value;
          } )

      // exit()
      this.selectAll('.bar')
          .data(params.data)
          .exit()
          .remove();

      this.selectAll('.bar-label')
          .data(params.data)
          .exit()
          .remove();      
   };
   sort_btn.on('', function()
   {
    var self = d3.select(this);
    var ascending = function(a, b)
    {
      return a.value - b.value;
    };
    var descending = function(a, b)
    {
      return b.value - a.value;
    };
    var state = +self.attr('state');
    var txt = 'Sort data: ';
      if(state === 0)
      {
        data.sort(ascending);
        state = 1;
        txt += 'descending';
      } else if(state === 1)
      {
        data.sort(descending);
          state = 0;
          txt += 'ascending';
      }
      self.attr('state', state);
      self.html(txt);

      plot.call( chart, {
      data: data,
      axis: 
              {
                 x: xAxis,
                 y: yAxis
              },
              gridlines: yGridlines,
              initialize: false
   } );
   });
plot.call( chart, {
  data: data,
  axis: 
          {
             x: xAxis,
             y: yAxis
          },
          gridlines: yGridlines,
          initialize: true
   } );

// line chart 

var data = [
  {key: "Lager", value: 60, date: "2014/01/01" },
  {key: "Lager", value: 58, date: "2014/01/02" },
  {key: "Lager", value: 59, date: "2014/01/03" },
  {key: "Lager", value: 56, date: "2014/01/04" },
  {key: "Lager", value: 57, date: "2014/01/05" },
  {key: "Lager", value: 55, date: "2014/01/06" },
  {key: "Lager", value: 56, date: "2014/01/07" },
  {key: "Lager", value: 52, date: "2014/01/08" },
  {key: "Lager", value: 54, date: "2014/01/09" },
  {key: "Lager", value: 57, date: "2014/01/10" },
  {key: "Lager", value: 56, date: "2014/01/11" },
  {key: "Lager", value: 59, date: "2014/01/12" },
  {key: "Lager", value: 56, date: "2014/01/13" },
  {key: "Lager", value: 52, date: "2014/01/14" },
  {key: "Lager", value: 48, date: "2014/01/15" },
  {key: "Lager", value: 47, date: "2014/01/16" },
  {key: "Lager", value: 48, date: "2014/01/17" },
  {key: "Lager", value: 45, date: "2014/01/18" },
  {key: "Lager", value: 43, date: "2014/01/19" },
  {key: "Lager", value: 41, date: "2014/01/20" },
  {key: "Lager", value: 37, date: "2014/01/21" },
  {key: "Lager", value: 36, date: "2014/01/22" },
  {key: "Lager", value: 39, date: "2014/01/23" },
  {key: "Lager", value: 41, date: "2014/01/24" },
  {key: "Lager", value: 42, date: "2014/01/25" },
  {key: "Lager", value: 40, date: "2014/01/26" },
  {key: "Lager", value: 43, date: "2014/01/27" },
  {key: "Lager", value: 41, date: "2014/01/28" },
  {key: "Lager", value: 39, date: "2014/01/29" },
  {key: "Lager", value: 40, date: "2014/01/30" },
  {key: "Lager", value: 39, date: "2014/01/31" }
];

var margin = {
  top: 58,
  bottom: 100,
  left: 80,
  right: 40
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var svg = d3.select('div#chart5').append('svg')
           .attr('id', 'chart')
           .attr('width', w)
           .attr('height', h)
var chart = svg.append('g')
              .classed('display', true)
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var dateParser = d3.time.format('%Y/%m/%d').parse;
var x = d3.time.scale()
         .domain(d3.extent(data, function(d)
         {
            var date = dateParser(d.date);
            return date;
         }))
         .range([0,width])
var y = d3.scale.linear()
         .domain([0, d3.max(data, function(d)
         {
            return d.value;
         })])
         .range([height, 0]);
var xAxis = d3.svg.axis()
             .scale(x)
             .orient('bottom')
             .ticks(d3.time.days, 7)
             .tickFormat(d3.time.format('%m/%d'));
var yAxis = d3.svg.axis()
             .scale(y)
             .orient('left')
             .ticks(5);
var line = d3.svg.line()
             .x(function(d)
             {
                var date = dateParser(d.date);
                return x(date);
             })
             .y(function(d)
             {
                return y(d.value);
             })
             .interpolate('monotone');
var area = d3.svg.area()
             .x(function(d)
             {
                var date = dateParser(d.date);
                return x(date);
             })
             .y0(height)
             .y1(function(d)
             {
                return y(d.value);
             })
             .interpolate('monotone');
plot = function(params)
{
  this.append('g')
      .classed('x axis', true)
      .attr('transform', 'translate(0,' + height + ')')
      .call(params.axis.x);
  this.append('g')
      .classed('y axis', true)
      .attr('transform', 'translate(0,0)')
      .call(params.axis.y);
  // enter()
   this.selectAll('.area')
      .data([params.data])
      .enter()
          .append('path')
          .classed('area', true);
  this.selectAll('.trendline')
      .data([params.data])
      .enter()
          .append('path')
          .classed('trendline', true);
  this.selectAll('.point')
      .data(params.data)
      .enter()
          .append('circle')
          .classed('point', true)
          .attr('r', 2);
  // update()
  this.selectAll('.area')
      .attr('d', function(d)
      {
          return area(d);
      })
 this.selectAll('.trendline')
      .attr('d', function(d)
      {
          return line(d);
      })
  this.selectAll('.point')
      .attr('cx', function(d)
      {
        var date = dateParser(d.date);
        return x(date);
        })
      .attr('cy', function(d)
      {
        return y(d.value);
      })
  // exit()
  this.selectAll('.area')
      .data([params.data])
      .exit()
      .remove();
  this.selectAll('.trendline')
      .data([params.data])
      .exit()
      .remove();
  this.selectAll('.point')
      .data(params.data)
      .exit()
      .remove();
}
plot.call(chart, 
{
  data:data,
  axis:
  {
    x: xAxis,
    y: yAxis
  }
});

// scatter
( function () {
var margin = {
      top: 60,
      bottom: 80,
      left: 100,
      right: 80
   };
   var width = w - margin.left - margin.right;
   var height = h - margin.top - margin.bottom;
   var svg = d3.select( "div#chart6" ).append( "svg" )
           .attr( "id", "chart" )
           .attr( "width", w )
           .attr( "height", h );
   var chart = svg.append( "g" )
           .classed( "display", true )
           .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );
   var colorScale = d3.scale.category10();
   var x = d3.scale.linear()
           .range( [ 0, width ] );
   var y = d3.scale.linear()
           .domain( [ 1, 5 ] )
           .range( [ height, 0 ] );
           var tickValues = [18, 25, 32, 39, 46, 53, 60, 67, 74]
   var xAxis = d3.svg.axis()
   .scale(x)
   .tickValues(tickValues)
   .orient("bottom");
   var xGridlines = d3.svg.axis()
   .scale(x)
   .tickValues(tickValues)
   .tickSize(-height, -height)
   .tickFormat("")
   .orient("bottom");
   var yAxis = d3.svg.axis()
           .scale( y )
           .ticks( 5 )
           .tickSize( 20 )
           .tickFormat( function ( d )
           {
              return d.toFixed( 1 );
           } )
           .orient( "left" );
   var yGridlines = d3.svg.axis()
           .scale( y )
           .tickSize( -width, 0, 0 )
           .tickFormat( "" )
           .orient( "left" );
   var responseScale = d3.scale.linear()           
           .range( [ 2, 15 ] );

   function drawAxis( params )
   {
      if ( params.initialize )
      {
        this.append("g")
            .classed("gridline x", true)
            .attr("transform", "translate(0," + height + ")")
            .call(params.axis.gridlines.x);
         this.append( "g" )
                 .classed( "gridline y", true )
                 .attr( "transform", "translate(0,0)" )
                 .call( params.axis.gridlines.y );
          this.append("g")
            .classed("axis x", true)
            .attr("transform", "translate(0," + height + ")")
            .call(params.axis.x)
         this.append( "g" )
                 .classed( "axis y", true )
                 .attr( "transform", "translate(0,0)" )
                 .call( params.axis.y );
        this.select(".y.axis")
        .append("text")
        .classed("y axis-label", true)
        .attr("transform", "translate("+ -56 + "," + height/2 + ") rotate(-90)")
        .text("Rating (1=Low,5=High)")
        this.select(".x.axis")
        .append("text")
        .classed("x axis-label", true)
        .attr("transform", "translate(" + width/2 + "," + 48 + ")")
        .text("Customer age");
        this.append("g")
        .append("text")
        .classed("chart-header", true)
        .attr("transform", "translate(0,-24)")
        .text("")
      }
   }
   function plot( params )
   {
    x.domain( d3.extent( params.data, function ( d )
           {
              return d.age;
           } ) );
    responseScale.domain( d3.extent( params.data, function ( d )
           {
              return d.responses;
           } ) )
      drawAxis.call( this, params );
      var self = this;
      var beers = d3.keys( params.data[0] ).filter( function ( d )
      {
         return d !== "age" && d !== "responses";
      } );

      // enter() for the groups
      this.selectAll( ".donut" )
              .data( beers )
              .enter()
              .append( "g" )
              .attr( "class", function ( d )
              {
                 return d;
              } )
              .classed( "donut", true );

      // update for groups
      this.selectAll(".donut")
      .style("fill", function(d,i)
      {
          return colorScale(i);
      })
      .on("mouseover", function(d,i)
      {
        d3.select(this)
        .transition()
        .style("opacity", 1)
      })
      .on("mouseout", function(d,i)
      {
        d3.select(this)
        .transition()
        .style("opacity", 0.1)
      });

      beers.forEach( function ( Beer )
      {
         var g = self.selectAll( "g." + Beer );
         var arr = params.data.map( function ( d )
         {
            return{
               key: Beer,
               value: d[Beer],
               age: d.age,
               responses: d.responses
            };
         } );
         // enter()
         g.selectAll( ".response" )
                 .data( arr )
                 .enter()
                 .append( "circle" )
                 .classed( "response", true )

         // update()
         g.selectAll( ".response" )
                 .attr( "r", function ( d )
                 {
                    return responseScale( d.responses );
                 } )
                 .attr( "cx", function ( d )
                 {
                    return x( d.age );
                 } )
                 .attr( "cy", function ( d )
                 {
                    return y( d.value );
                 } )
                .on("mouseover", function(d,i)
                {
                   var str = d.key + " Beer: ";
                   str += "Age: " + d.age + " ";
                   str += "Responses: " + d.responses + " ";
                   str += "Average Rating: " + d.value;
                   d3.select(".chart-header").text(str);
                }) 
                .on("mouseout", function(d,i)
                {
                  d3.select(".chart-header").text("");
                })
                 // exit()
                 .selectAll( ".response" )
                 .data( arr )
                 .exit()
                 .remove();
      } );
   }

   d3.csv("survey_data.csv", function(error, parsed_data) 
  {    
   plot.call( chart, {
      data: parsed_data,
      axis: {
         x: xAxis, 
         y: yAxis,
         gridlines:
                 {
                    x: xGridlines,
                    y: yGridlines
                 }
      },
      initialize: true
   } )
    });
    }() );
}() );
