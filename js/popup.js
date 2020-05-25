$(document).ready(function () {

  trendFun(".tap", "#G001")
  trendFun(".tap", "#T001")
  trendFun(".pipeline", "#G002")
  trendFun(".pipeline", "#P002")
  trendFun(".pipeline", "#T002")
  trendFun(".position2", "#P005")
  trendFun(".position2", "#T005")
  trendFun(".position3", "#G003")
  trendFun(".position3", "#P003")
  trendFun(".position3", "#T003")
  trendFun(".position4", "#G004")
  trendFun(".position4", "#P004")
  trendFun(".position4", "#T004")
  trendFun(".position5", "#T004")
  trendFun(".position5", "#T004")
  trendFun(".position5", "#T004")
  trendFun(".position6", "#P007")
  trendFun(".position6", "#T007")
  trendFun(".position7", "#G006")
  trendFun(".position7", "#P008")
  trendFun(".position7", "#T008")
  trendFun(".position8", "#G007")

  function trendFun(parent, children) {
    $(parent).on('click', children, function () {
      $(".popup").css('display', 'block')
      $(this).addClass("active")

    });
  }

  //关闭弹窗
  $("#close").click(function () {
    $(".popup").css('display', 'none')
  })

  //选项卡效果
  $(".tab>li").click(function () {
    //1.获取鼠标移入的对象并让当前对象显示
    $(this).addClass("on");
    //2.获取当前对象的所有同级的其余元素集合，并隐藏
    $(this).siblings().removeClass("on");
    //3.获取当前li元素的索引
    var $index = $(this).index();
    console.log($index, "索引值")
    //4.获取对应的ul中的li元素对象
    var $eq = $(".tablist>div").eq($index);
    //5.获取z-index的值
    var Zindex = $(".tablist .mask").css("z-index")
    //6.设置当前li元素对应的内容区可见
    $eq.addClass("showcontent").css("z-index", parseInt(Zindex) + 1);
    //7.获取当前对象的所有同级元素的集合，并隐藏
    $eq.siblings('div').removeClass("showcontent").css("z-index", parseInt(Zindex) - 1);
  });
  //点击设置按钮
  var onOff4 = 1;
  $("#setBtn").on('click', function () {
    if (onOff4 == 1) {
      $('.setpopup').css('display', 'block')
      onOff4 = 0;
    } else {
      $('.setpopup').css('display', 'none')
      selectedFun();
      onOff4 = 1;
    }
  })
  var colorCount = 0;
  var COLOR = [
    { used: false, value: '#ffff00' },
    { used: false, value: '#55b2f9' },
    { used: false, value: '#e687b6' },
    { used: false, value: '#55f9c9' },
    { used: false, value: '#759aa0' },
    { used: false, value: '#e69d87' },
    { used: false, value: '#8dc1a9' },
    { used: false, value: '#ea7e53' }
  ];
  $("input[name=setvalue]").on('click', function () {
    if (this.checked) {
      // 最多可选8个指标
      if (colorCount >= 8) {
        this.checked = false;
        return;
      }
      var tempColor = void 0;
      for (var i = 0; i < COLOR.length; i++) {
        var co = COLOR[i];
        if (!co.used) {
          tempColor = co.value;
          co.used = true;
          colorCount++;
          break;
        }
      }
      console.log(COLOR, tempColor);
      $(this).parent().css({
        color: tempColor
      }).attr('color', tempColor);
    } else {
      var oldColor = $(this).parent().attr('color');
      for (var i = 0; i < COLOR.length; i++) {
        var co = COLOR[i];
        if (oldColor === co.value) {
          co.used = false
          break;
        }
      }
      $(this).parent().css({
        color: '#fff'
      }).attr('color', '#fff');
      colorCount--;
    }
  })
  function selectedFun() {
    var selected = new Array();
    var colorCountTemp = 0;
    $("input[name=setvalue]").each(function (i, d) {
      if (d.checked) {
        selected.push(d.value);
        colorCountTemp++;
      }
    })
    colorCount = colorCountTemp;
    // alert(selected, "存储的值")
  }
  //当前视口宽度
  let nowClientWidth = document.documentElement.clientWidth;
  //换算方法
  function nowSize(val) {
    return val * (nowClientWidth / 1920);
  }

  getChart('popupactual')
  getChart1('popuphistory')
  function getChart(chartId) {
    var myChartObj = echarts.init(document.getElementById(chartId));

    function randomData() {
      return now = new Date();
    }
    var data = [];
    // var now = +new Date(2020, 5, 20);
    for (var i = 0; i < 1000; i++) {
      data.push(randomData());
    }
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
        type: 'time',
        splitLine: {
          show: false
        },
        // boundaryGap: false,
        // axisLine: { onZero: false },
        // type: 'category',
        // data: [
        //   '2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00', '2009/6/12 12:00', '2009/6/12 13:00', '2009/6/12 14:00',
        // ].map(function (str) {
        //   return str.replace(' ', '\n');
        // }),
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
        data: data,
        type: 'line',
        // name: '设定值',
        symbol: 'circle',
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1// 0.1的线条是非常细的了
            }
          }
        }
      },
      ]
    };
    myChartObj.setOption(option);
    window.addEventListener("resize", function () {
      myChartObj.resize();
    });
    setInterval(function () {
      for (var i = 0; i < 8; i++) {
        data.shift();
        data.push(randomData());
      }
      myChartObj.setOption({
        series: [{
          data: data
        }]
      });
    }, 1000);
  }
  function getChart1(chartId) {
    var myChartObj2 = echarts.init(document.getElementById(chartId));
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
        data: [300, 580, 450, 345, 690, 487, 653, 234, 977, 243, 100, 570, 890],
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
      ]
    };
    myChartObj2.setOption(option);
    window.addEventListener("resize", function () {
      myChartObj2.resize();
    });
  }
})
