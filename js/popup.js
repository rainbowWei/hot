$(document).ready(function(){

  //选项卡效果
//   $(".tab>li").click(function(){
//     //1.获取鼠标移入的对象并让当前对象显示
//     $(this).addClass("on");
//     //2.获取当前对象的所有同级的其余元素集合，并隐藏
//     $(this).siblings().removeClass("on");
//     //3.获取当前li元素的索引
//     var $index=$(this).index();
//     //4.获取对应的ul中的li元素对象
//     var $eq=$(".tablist>div").eq($index);
//     //5.设置当前li元素可见
//     $eq.addClass("showcontent");
//     //6.获取当前对象的所有同级元素的集合，并隐藏
//     $eq.siblings().removeClass("showcontent");
// });
  
  //当前视口宽度
  let nowClientWidth = document.documentElement.clientWidth;


  //换算方法
  function nowSize(val, initWidth = 1920) {
      return val * (nowClientWidth / initWidth);
  }
$("#popupactual").css( 'width', $("#popupactual").width());
console.log($("#popupactual").width(),"宽度")
  var chart = document.getElementById("popupactual");
  var echart = echarts.init(chart);
  var option = {
      color: ['#ffff00', '#55b2f9', '#e687b6', '#55f9c9', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53'],
      tooltip: {},
      legend: {
          top: '0',
          textStyle: {
              color: '#ffffff',
              fontSize: nowSize(16)
          },
      },
      grid: {
          top: '30',
          left: '60',
          right: '30',
          bottom: '80',
      },
      lineStyle: {
          width: 1
      },
      dataZoom: [
          {
              start: 30,
              end: 85,
              height: 24,//这里可以设置dataZoom的尺寸
              textStyle: {
                  color: '#ffffff',
                  fontSize: nowSize(16)
              },
              dataBackground: {
                  lineStyle: {
                      color: [
                          "#f1f1f1"
                      ],
                  },
                  areaStyle: {
                      color: [
                          "#626871"
                      ],
                      opacity: 0.5
                  }
              }
          }, {
              type: 'inside'
          }
      ],
      yAxis: [
          {
              type: 'value',
              axisLabel: {
                  textStyle: {
                      color: '#ffffff',
                      fontSize: nowSize(16)
                  }
              },
              axisLine: {
                  lineStyle: {
                      color: '#fff',     //X轴的颜色
                  },
              },
          },
      ],
      xAxis: {
          boundaryGap: false,
          axisLine: { onZero: false },
          type: 'category',
          data: [
              '2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00', '2009/6/12 12:00', '2009/6/12 13:00', '2009/6/12 14:00',
          ].map(function (str) {
              return str.replace(' ', '\n');
          }),
          axisLabel: {
              show: true,
              textStyle: {
                  color: '#ffffff',
                  fontSize: nowSize(16)
              },
          },
          axisLine: {
              lineStyle: {
                  color: '#fff'     //X轴的颜色
              },
          },
          splitArea: {
              show: true,
              areaStyle: {
                  color: [
                      "#1e292d"
                  ],
                  opacity: 0.9
              }
          }
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330],
          type: 'line',
          name: '设定值',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      },
      {
          data: ['60%', '50.8%', '55.9%', '44.9%', '59.8%', '58%', '54.9%', '70.9%', '56.9%', '55%', '60%', '60%', '60%'],
          type: 'line',
          name: '测量值',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      },
      {
          data: [700, 500, 690, 345, 890, 987, 853, 234, 777, 343, 700, 500, 690],
          type: 'line',
          name: '总输出',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      },
      {
          data: [500, 700, 490, 845, 290, 587, 353, 634, 477, 543, 900, 300, 890],
          type: 'line',
          name: 'PID',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      },
      {
          data: [400, 520, 890, 345, 690, 787, 953, 434, 377, 253, 670, 245, 670],
          type: 'line',
          name: '观测器',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      },
      {
          data: [270, 500, 654, 555, 345, 965, 333, 231, 390, 453, 544, 600, 390],
          type: 'line',
          name: '重叠',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      },
      {
          data: [240, 670, 854, 324, 567, 435, 379, 568, 754, 325, 456, 715, 678],
          type: 'line',
          name: 'RSF',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      },
      {
          data: [270, 500, 654, 555, 345, 965, 333, 231, 390, 453, 544, 600, 390],
          type: 'line',
          name: '观测器动态',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  lineStyle: {
                      width: 1// 0.1的线条是非常细的了
                  }
              }
          }
      }
      ]
  };

  echart.setOption(option);
})