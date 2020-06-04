$(document).ready(function () {

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

  //当前视口宽度
  var nowClientWidth = document.documentElement.clientWidth;
  //换算方法
  function nowSize(val) {
    return val * (nowClientWidth / 1920);
  }

  getChart1('popuphistory')

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

  // 多条曲线的各种参数
  var chartObj = {};
  //点击设置按钮
  var colorCount = 0;
  // 曲线颜色
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
  var myChartObj = null;

  // 获取线条颜色
  function getColor(type, oldColor) {
    var tempColor = void 0;
    if (type === 'get') {
      for (var i = 0; i < COLOR.length; i++) {
        var co = COLOR[i];
        if (!co.used) {
          tempColor = co.value;
          co.used = true;
          colorCount++;
          break;
        }
      }
    } else if (type === 'del') {
      for (var i = 0; i < COLOR.length; i++) {
        var co = COLOR[i];
        if (oldColor === co.value) {
          co.used = false
          break;
        }
      }
      colorCount--;
    }
    return tempColor;
  }

  function handler(keyName, checked, _this) {
    // 判断是实时数据的话
    if (true) {
      if (checked) {
        // 最多可选8个指标
        console.log(colorCount, "colorCount")
        if (colorCount > 8) {
          _this.checked = false;
          alert("最多只能选8个指标")
          return;
        }

        var tempColor = getColor('get');
        // console.log(tempColor,"选中右侧的添加曲线")
        chartObj[keyName] = {
          name: $(_this).siblings('span').text(),
          key: keyName,
          data: [],
          pointCount: 0,
          color: tempColor,
          other: '其他别的啥参数'
        }
        $(_this).parent().css({
          color: tempColor
        });
      } else {
        // 画曲线
        for (var k in chartObj) {
          if (chartObj.hasOwnProperty(k)) {
            if (k == keyName) {
              var tempColor = getColor('del', chartObj[k].color)
              $(_this).parent().css({
                color: '#fff'
              });
              delete chartObj[k]
            }
          }
        }
      }
    }
  }
  function trendFun1(children) {
    //点击页面某个点显示弹窗
    $(children).on('click', function () {

      $(".popup").css('display', 'block')
      $(this).parent().addClass("active")

      var keyName2 = $(this).attr("data-attr");
      var onOff4 = 1;
      $("#setBtn").on('click', function () {
        if (onOff4 == 1) {
          $('.setpopup').css('display', 'block')
          $('input[data-keyName]').prop('checked', false);
          onOff4 = 0;
          colorCount++;
          // 画曲线
          for (var k in chartObj) {
            if (chartObj.hasOwnProperty(k)) {
              $('input[data-keyName=' + k + ']').prop('checked', true).parent().css({
                color: chartObj[k].color
              });
            }
          }
        } else {
          var selected = new Array();
          $("input[name=setvalue]").each(function (i, d) {
            if (d.checked) {
              selected.push(d.value);
            }
          })
          console.log(selected, "存储的值")
          onOff4 = 1;
          colorCount--;
          $('.setpopup').css('display', 'none')
        }
      })

      /**
       * 监听数据变化
       * window.intervalID 来自 index.js 文件中的定时器
       */
      if (!myChartObj) {
        myChartObj = echarts.init(document.getElementById('popupactual'));
      }
      if (window.intervalID) {

        var tempColor = getColor('get');
        chartObj[keyName2] = {
          name: $('input[data-keyName=' + keyName2 + ']').siblings('span').text(),
          key: keyName2,
          data: [],
          pointCount: 0,
          color: tempColor,
          other: '其他别的啥参数'
        }

        // 监听数据变化
        $(document).on('changeData', function (e, dataObj) {
          // 同下 randomData 函数
          function randomData(key) {
            //将各指标转化成一个范围（1-100）之内的数据
            var data = null;
            //流量(0~1000)
            if (key == 'CN_G001' || key == 'CN_G002' || key == 'CN_G003' || key == 'CN_G004' || key == 'CN_G005' || key == 'CN_G006' || key == 'CN_G007') {
              data = ((dataObj[key].toFixed(0) - (0)) / (1000 - (0))) * 100;
            }
            //温度(-10~400)
            if (key == 'CN_T001' || key == 'CN_T002' || key == 'CN_T003' || key == 'CN_T004' || key == 'CN_T005' || key == 'CN_T006' || key == 'CN_T007' || key == 'CN_T008') {
              data = ((dataObj[key].toFixed(0) - (-10)) / (400 - (-10))) * 100;
            }
            //压力(0~3)
            if (key == 'CN_P002' || key == 'CN_P003' || key == 'CN_P004' || key == 'CN_P005' || key == 'CN_P006' || key == 'CN_P007' || key == 'CN_P008') {
              data = ((dataObj[key].toFixed(0) - (0)) / (3 - (0))) * 100;
            }
            //压力(0~3)
            if (key == 'CN_L002') {
              console.log(dataObj[key].toFixed(2),"水箱")
              console.log("1111")
              data = ((dataObj[key].toFixed(2) - (0)) / (10 - (0))) * 100;
            }
            return {
              value: [
                new Date(+new Date() + 1000),
                data
              ]
            }
          }
          for (var prop in chartObj) {
            if (chartObj.hasOwnProperty(prop)) {
              var obj = chartObj[prop]
              obj.pointCount++;
              if (obj.pointCount >= 120) {
                obj.data.shift();
              }
              obj.data.push(randomData(obj.key));
            }
          }
          getChart(myChartObj, setChartLine(chartObj))
        })

        // 监听右侧checkbox选择
        $("input[data-keyName]").on('click', function () {
          handler(this.value, this.checked, this);
        })
      }

      //关闭弹窗
      $("#close").click(function () {
        // 取消数据变化监听
        $(document).off('changeData')

        chartObj = {}
        getChart(myChartObj, setChartLine(chartObj));

        // 将所有备选颜色值变成未使用过
        for (var i = 0; i < COLOR.length; i++) {
          var co = COLOR[i]
          co.used = false;
        }
        colorCount = 0;
        // 将所有设置弹窗中指标变成未选中状态
        $('input[data-keyName]').prop('checked', false).off('click').parent().css({
          color: '#fff'
        });
        // 关闭设置弹窗
        onOff4 = 1;
        $("#setBtn").off('click');
        $('#close').off('click');
        $('.setpopup').css('display', 'none');
        // 关闭弹窗
        $(".popup").css('display', 'none')
      })
    });
  }

  // 设置折线图需要使用的配置参数 series
  function setChartLine(chartObj) {
    var series = []
    for (var type in chartObj) {
      if (chartObj.hasOwnProperty(type)) {
        series.push({
          name: chartObj[type].name,
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          hoverAnimation: false,
          data: chartObj[type].data,
          color: chartObj[type].color,

        })
      }
    }
    return series
  }
  function getChart(myChartObj, series) {
    var option = {
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
      xAxis: {
        type: 'time',
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
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        min: 0,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#ffffff',
            fontSize: nowSize(16)
          },
          formatter: function (value) {
            return value + "%";
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'     //X轴的颜色
          },
        },
      },
      series: series
    };

    if (option && typeof option === "object") {  // 如果获取到了数据且数据是对象，DetectRecordCurveInfo 是父组件传来的可用的数据信息
      myChartObj.setOption(option, true);
    }
  }

  // 监听指标
  trendFun1("#CN_G001")
  trendFun1("#CN_T001")
  trendFun1("#CN_G002")
  trendFun1("#CN_P002")
  trendFun1("#CN_T002")
  trendFun1("#CN_G003")
  trendFun1("#CN_P003")
  trendFun1("#CN_T003")
  trendFun1("#CN_G004")
  trendFun1("#CN_P004")
  trendFun1("#CN_T004")
  trendFun1("#CN_G005")
  trendFun1("#CN_P006")
  trendFun1("#CN_T006")
  trendFun1("#CN_P007")
  trendFun1("#CN_T007")
  trendFun1("#CN_G006")
  trendFun1("#CN_P008")
  trendFun1("#CN_T008")
  trendFun1("#CN_G007")
  trendFun1("#CN_P005")
  trendFun1("#CN_T005")
  trendFun1("#CN_L002")
})
