﻿$(document).ready(function () {
  var dataObj = {}
  var intervalID = null;
  var waterBoxBg = $("#waterboxbg").height(); // 水箱总高度
  var progressBg = $("#progressbg").width(); // 控制性能指标宽度
  //当前视口宽度
  var nowClientWidth = document.documentElement.clientWidth
  //换算方法
  function nowSize(val) {
    return val * (nowClientWidth / 1920);
  }

  // 热水温度稳态占比
  var myChart = echarts.init(document.getElementById('hotw'));
  // 室内温度达标率
  var myChart2 = echarts.init(document.getElementById('circle'));
  // 先控自动占比
  var myChart3 = echarts.init(document.getElementById('sicon'));

  //环状图表初始化(假数据默认的时候显示)
  //热水温度稳态占比
  onWaterChange({
    color: ['#f553ab', '#6c6b6f'],
    data: [
      { value: 40 },
      { value: 100 }
    ],
    myChart: myChart,
    notMerge: true
  });
  // 室内温度达标率
  onWaterChange({
    color: ['#ff9519', '#6c6b6f'],
    data: [
      { value: 30 },
      { value: 100 }
    ],
    myChart: myChart2,
    notMerge: true
  });
  // 先控自动占比
  onWaterChange({
    color: ['#00ffff', '#6c6b6f'],
    data: [
      { value: 50 },
      { value: 100 }
    ],
    myChart: myChart3,
    notMerge: true
  });
  window.addEventListener("resize", function () {
    myChart && myChart.resize();
    myChart2 && myChart2.resize();
    myChart3 && myChart3.resize();
  });

  // 时钟
  setInterval(function () {
    var newDate = new Date();                // 获取当前时间
    var Year = newDate.getFullYear();        // 获取年份
    var Mouth = newDate.getMonth() + 1;      // 获取月份
    var Day = newDate.getDate();             // 获取日
    var Hour = newDate.getHours();           // 获取时
    var Minutes = newDate.getMinutes();      // 获取分
    var Seconds = newDate.getSeconds();      // 获取秒
    // 拼接年月日和时分秒
    var year = Year + "/" + Appendzero(Mouth) + "/" + Appendzero(Day);
    var date = Appendzero(Hour) + ":" + Appendzero(Minutes) + ":" + Appendzero(Seconds);
    // 插入DOM
    $(".year").text(year);
    $(".date").text(date);
  }, 1000)

  //个位补零函数
  function Appendzero(obj) {
    return (obj < 10) ? "0" + obj : obj;
  }

  //阀门开度初始值
  $("#aperture").val(24.77);
  $("#aperture2").val(68.05);
  $("#aperture3").val(20.18);
  $("#aperture4").val(5.18);

  function run(runStatus) {
    if (runStatus == 1) {
      if (intervalID) clearInterval(intervalID);
      intervalID = setInterval(update, 1000);
      // 存一个全局的定时器，给 popup.js 中使用
      window.intervalID = true;
    } else {
      if (intervalID) clearInterval(intervalID);
      intervalID = null;
      window.intervalID = false;
    }
  }

  function update() {
    //温度
    if (RSFZ_Main.BCSZT === true) {
      $("#btn1").addClass("show");
      $("#btn2").removeClass("show");
    } else {
      $("#btn2").addClass("show");
      $("#btn1").removeClass("show");
    }
    //给水
    if (RSFZ_Main.BCSZT2 === true) {
      $("#btn3").addClass("show");
      $("#btn4").removeClass("show");
    } else {
      $("#btn4").addClass("show");
      $("#btn3").removeClass("show");
    }
    //补水
    if (RSFZ_Main.BCSZT3 === true) {
      $("#btn5").addClass("show");
      $("#btn6").removeClass("show");
    } else {
      $("#btn6").addClass("show");
      $("#btn5").removeClass("show");
    }

    //模型从界面获取数据并运行
    RSFZ_Main.CN_M001VS = $("#aperture").val();
    RSFZ_Main.CN_M003VS = $("#aperture2").val();
    RSFZ_Main.CN_M004VS = $("#aperture3").val();
    RSFZ_Main.CN_M005VS = $("#aperture4").val();
    //模型的主运行函数
    RSFZ_Main.CLSCN(RSFZ_Main.CN_M001VS, 0, RSFZ_Main.CN_M003VS, RSFZ_Main.CN_M004VS, RSFZ_Main.CN_M005VS, RSFZ_Main.CN_S001T)
    //刷新界面显示
    dataObj = setDataObj(RSFZ_Main);

    for (var keyName in dataObj) {
      $('.' + keyName).text(dataObj[keyName].toFixed(2));
      $('.' + keyName).parent().attr('data-attr', keyName)
    }
    //水箱的进度条
    $("#water").css("height", (RSFZ_Main.CN_L002.toFixed(2) / 10) * waterBoxBg + 'px');
    //控制性能指标的进度条
    $("#progress").css("width", (RSFZ_Main.ZHZB.toFixed(2) / 100) * progressBg + 'px');

    // 图表展示
    //热水温度稳态占比
    onWaterChange({
      color: ['#f553ab', '#6c6b6f'],
      data: [
        { value: RSFZ_Main.RST_WTB },
        { value: 100 - RSFZ_Main.RST_WTB }
      ],
      myChart: myChart,
      notMerge: false
    });
    // 室内温度达标率
    onWaterChange({
      color: ['#ff9519', '#6c6b6f'],
      data: [
        { value: RSFZ_Main.SNT_WTB },
        { value: 100 - RSFZ_Main.SNT_WTB }
      ],
      myChart: myChart2,
      notMerge: false
    });
    // 先控自动占比
    onWaterChange({
      color: ['#00ffff', '#6c6b6f'],
      data: [
        { value: RSFZ_Main.RSZKB },
        { value: 100 - RSFZ_Main.RSZKB }
      ],
      myChart: myChart3,
      notMerge: false
    });

    function x() {
      //OPC的相关操作
      // Program.CN_G001_set(RSFZ_Main.CN_G001);
      // Program.CN_G002_set(RSFZ_Main.CN_G002);
      // Program.CN_G003_set(RSFZ_Main.CN_G003);
      // Program.CN_G004_set(RSFZ_Main.CN_G004);
      // Program.CN_G005_set(RSFZ_Main.CN_G005);
      // Program.CN_G006_set(RSFZ_Main.CN_G006);
      // Program.CN_G007_set(RSFZ_Main.CN_G007);
      // Program.CN_G008_set(RSFZ_Main.CN_G008);
      // Program.CN_P001_set(RSFZ_Main.CN_P001);
      // Program.CN_P002_set(RSFZ_Main.CN_P002);
      // Program.CN_P003_set(RSFZ_Main.CN_P003);
      // Program.CN_P004_set(RSFZ_Main.CN_P004);
      // Program.CN_P005_set(RSFZ_Main.CN_P005);
      // Program.CN_P006_set(RSFZ_Main.CN_P006);
      // Program.CN_P007_set(RSFZ_Main.CN_P007);
      // Program.CN_P008_set(RSFZ_Main.CN_P008);
      // Program.CN_T001_set(RSFZ_Main.CN_T001);
      // Program.CN_T002_set(RSFZ_Main.CN_T002);
      // Program.CN_T003_set(RSFZ_Main.CN_T003);
      // Program.CN_T004_set(RSFZ_Main.CN_T004);
      // Program.CN_T005_set(RSFZ_Main.CN_T005);
      // Program.CN_T006_set(RSFZ_Main.CN_T006);
      // Program.CN_T007_set(RSFZ_Main.CN_T007);
      // Program.CN_T008_set(RSFZ_Main.CN_T008);
      // Program.CN_T009_set(RSFZ_Main.CN_T009);
      // Program.CN_L001_set(RSFZ_Main.CN_L001);
      // Program.CN_L002_set(RSFZ_Main.CN_L002);
      // Program.CN_M001V_set(RSFZ_Main.CN_M001V);
      // Program.CN_M002V_set(RSFZ_Main.CN_M002V);
      // Program.CN_M003V_set(RSFZ_Main.CN_M003V);
      // Program.CN_M004V_set(RSFZ_Main.CN_M004V);
      // Program.CN_M005V_set(RSFZ_Main.CN_M005V);
      // Program.CN_S001T_set(RSFZ_Main.CN_S001T);
      // Program.CN_M001VS_set(RSFZ_Main.CN_M001VS);
      // Program.CN_M002VS_set(RSFZ_Main.CN_M002VS);
      // Program.CN_M003VS_set(RSFZ_Main.CN_M003VS);
      // Program.CN_M004VS_set(RSFZ_Main.CN_M004VS);
      // Program.CN_M005VS_set(RSFZ_Main.CN_M005VS);
      // Program.Heart_set(RSFZ_Main.Heart);
      // RSFZ_Main.BCSMV = Program.BCSMV_get();
      // RSFZ_Main.BCSMV2 = Program.BCSMV2_get();
      // RSFZ_Main.BCSMV3 = Program.BCSMV3_get();
      // Program.CN_T010_set(RSFZ_Main.CN_T010);
      // RSFZ_Main.TD1_T = Program.TD1_T_get();
      // RSFZ_Main.TD1_GX_T = Program.TD1_GX_T_get();
      // RSFZ_Main.TD1_EGX_F = Program.TD1_EGX_F_get();
      // RSFZ_Main.TD1_Q = Program.TD1_Q_get();
      // Program.TD1_X_YOUT_set(RSFZ_Main.TD1_X_YOUT);
      // Program.TD1_X_EOUT_set(RSFZ_Main.TD1_X_EOUT);
      // Program.TD1_Y_ZOUT_set(RSFZ_Main.TD1_Y_ZOUT);
      // RSFZ_Main.TD2_T = Program.TD2_T_get();
      // RSFZ_Main.TD2_K = Program.TD2_K_get();
      // RSFZ_Main.TD2_GX_T = Program.TD2_GX_T_get();
      // RSFZ_Main.TD2_EGX_F = Program.TD2_EGX_F_get();
      // RSFZ_Main.TD2_Q = Program.TD2_Q_get();
      // Program.TD2_X_YOUT_set(RSFZ_Main.TD2_X_YOUT);
      // Program.TD2_X_EOUT_set(RSFZ_Main.TD2_X_EOUT);
      // Program.TD2_Y_ZOUT_set(RSFZ_Main.TD2_Y_ZOUT);
      // RSFZ_Main.TD4_T = Program.TD4_T_get();
      // RSFZ_Main.TD4_GX_T = Program.TD4_GX_T_get();
      // RSFZ_Main.TD4_EGX_F = Program.TD4_EGX_F_get();
      // RSFZ_Main.TD4_Q = Program.TD4_Q_get();
      // Program.TD4_X_YOUT_set(RSFZ_Main.TD4_X_YOUT);
      // Program.TD4_X_EOUT_set(RSFZ_Main.TD4_X_EOUT);
      // Program.TD4_Y_ZOUT_set(RSFZ_Main.TD4_Y_ZOUT);
      // RSFZ_Main.TF1_DT = Program.TF1_DT_get();
      // RSFZ_Main.TF1_K = Program.TF1_K_get();
      // RSFZ_Main.TF1_LT = Program.TF1_LT_get();
      // RSFZ_Main.SG1_SIN_K = Program.SG1_SIN_K_get();
      // RSFZ_Main.SG1_SIN_H = Program.SG1_SIN_H_get();
      // RSFZ_Main.SG1_SIN_T = Program.SG1_SIN_T_get();
      // RSFZ_Main.SG1_FB_K = Program.SG1_FB_K_get();
      // RSFZ_Main.SG1_FB_H = Program.SG1_FB_H_get();
      // RSFZ_Main.SG1_FB_L = Program.SG1_FB_L_get();
      // RSFZ_Main.SG1_FB_HT = Program.SG1_FB_HT_get();
      // RSFZ_Main.SG1_FB_LT = Program.SG1_FB_LT_get();
      // RSFZ_Main.SG1_JCB_K = Program.SG1_JCB_K_get();
      // RSFZ_Main.SG1_JCB_H = Program.SG1_JCB_H_get();
      // RSFZ_Main.SG1_JCB_L = Program.SG1_JCB_L_get();
      // RSFZ_Main.SG1_JCB_HT = Program.SG1_JCB_HT_get();
      // RSFZ_Main.SG1_JCB_LT = Program.SG1_JCB_LT_get();
      // RSFZ_Main.SG1_TXB_K = Program.SG1_TXB_K_get();
      // RSFZ_Main.SG1_TXB_H = Program.SG1_TXB_H_get();
      // RSFZ_Main.SG1_TXB_L = Program.SG1_TXB_L_get();
      // RSFZ_Main.SG1_TXB_T = Program.SG1_TXB_T_get();
      // RSFZ_Main.SG1_TXB_T1 = Program.SG1_TXB_T1_get();
      // RSFZ_Main.SG1_JYB_IN = Program.SG1_JYB_IN_get();
      // RSFZ_Main.SG1_SJB_K = Program.SG1_SJB_K_get();
      // RSFZ_Main.SG1_SJB_T = Program.SG1_SJB_T_get();
      // RSFZ_Main.SG1_SJFB_K = Program.SG1_SJFB_K_get();
      // RSFZ_Main.SG1_SJFB_HMT = Program.SG1_SJFB_HMT_get();
      // RSFZ_Main.SG1_SJFB_LMT = Program.SG1_SJFB_LMT_get();
      // RSFZ_Main.SG1_SJFB_MH = Program.SG1_SJFB_MH_get();
      // RSFZ_Main.SG1_SJFB_ML = Program.SG1_SJFB_ML_get();
      // RSFZ_Main.SG1_SJFB_TK = Program.SG1_SJFB_TK_get();
      // RSFZ_Main.SG1_SJFB_AK = Program.SG1_SJFB_AK_get();
      // Program.SG1_SIN_OUT_set(RSFZ_Main.SG1_SIN_OUT);
      // Program.SG1_FB_OUT_set(RSFZ_Main.SG1_FB_OUT);
      // Program.SG1_JCB_OUT_set(RSFZ_Main.SG1_JCB_OUT);
      // Program.SG1_TXB_OUT_set(RSFZ_Main.SG1_TXB_OUT);
      // Program.SG1_JYB_OUT_set(RSFZ_Main.SG1_JYB_OUT);
      // Program.SG1_SJB_OUT_set(RSFZ_Main.SG1_SJB_OUT);
      // Program.SG1_SJFB_OUT_set(RSFZ_Main.SG1_SJFB_OUT);
      // Program.SG1_OUT_set(RSFZ_Main.SG1_OUT);
      // RSFZ_Main.SG2_SIN_K = Program.SG2_SIN_K_get();
      // RSFZ_Main.SG2_SIN_H = Program.SG2_SIN_H_get();
      // RSFZ_Main.SG2_SIN_T = Program.SG2_SIN_T_get();
      // RSFZ_Main.SG2_FB_K = Program.SG2_FB_K_get();
      // RSFZ_Main.SG2_FB_H = Program.SG2_FB_H_get();
      // RSFZ_Main.SG2_FB_L = Program.SG2_FB_L_get();
      // RSFZ_Main.SG2_FB_HT = Program.SG2_FB_HT_get();
      // RSFZ_Main.SG2_FB_LT = Program.SG2_FB_LT_get();
      // RSFZ_Main.SG2_JCB_K = Program.SG2_JCB_K_get();
      // RSFZ_Main.SG2_JCB_H = Program.SG2_JCB_H_get();
      // RSFZ_Main.SG2_JCB_L = Program.SG2_JCB_L_get();
      // RSFZ_Main.SG2_JCB_HT = Program.SG2_JCB_HT_get();
      // RSFZ_Main.SG2_JCB_LT = Program.SG2_JCB_LT_get();
      // RSFZ_Main.SG2_TXB_K = Program.SG2_TXB_K_get();
      // RSFZ_Main.SG2_TXB_H = Program.SG2_TXB_H_get();
      // RSFZ_Main.SG2_TXB_L = Program.SG2_TXB_L_get();
      // RSFZ_Main.SG2_TXB_T = Program.SG2_TXB_T_get();
      // RSFZ_Main.SG2_TXB_T1 = Program.SG2_TXB_T1_get();
      // RSFZ_Main.SG2_JYB_IN = Program.SG2_JYB_IN_get();
      // RSFZ_Main.SG2_SJB_K = Program.SG2_SJB_K_get();
      // RSFZ_Main.SG2_SJB_T = Program.SG2_SJB_T_get();
      // RSFZ_Main.SG2_SJFB_K = Program.SG2_SJFB_K_get();
      // RSFZ_Main.SG2_SJFB_HMT = Program.SG2_SJFB_HMT_get();
      // RSFZ_Main.SG2_SJFB_LMT = Program.SG2_SJFB_LMT_get();
      // RSFZ_Main.SG2_SJFB_MH = Program.SG2_SJFB_MH_get();
      // RSFZ_Main.SG2_SJFB_ML = Program.SG2_SJFB_ML_get();
      // RSFZ_Main.SG2_SJFB_TK = Program.SG2_SJFB_TK_get();
      // RSFZ_Main.SG2_SJFB_AK = Program.SG2_SJFB_AK_get();
      // Program.SG2_SIN_OUT_set(RSFZ_Main.SG2_SIN_OUT);
      // Program.SG2_FB_OUT_set(RSFZ_Main.SG2_FB_OUT);
      // Program.SG2_JCB_OUT_set(RSFZ_Main.SG2_JCB_OUT);
      // Program.SG2_TXB_OUT_set(RSFZ_Main.SG2_TXB_OUT);
      // Program.SG2_JYB_OUT_set(RSFZ_Main.SG2_JYB_OUT);
      // Program.SG2_SJB_OUT_set(RSFZ_Main.SG2_SJB_OUT);
      // Program.SG2_SJFB_OUT_set(RSFZ_Main.SG2_SJFB_OUT);
      // Program.SG2_OUT_set(RSFZ_Main.SG2_OUT);
      // RSFZ_Main.SG3_SIN_K = Program.SG3_SIN_K_get();
      // RSFZ_Main.SG3_SIN_H = Program.SG3_SIN_H_get();
      // RSFZ_Main.SG3_SIN_T = Program.SG3_SIN_T_get();
      // RSFZ_Main.SG3_FB_K = Program.SG3_FB_K_get();
      // RSFZ_Main.SG3_FB_H = Program.SG3_FB_H_get();
      // RSFZ_Main.SG3_FB_L = Program.SG3_FB_L_get();
      // RSFZ_Main.SG3_FB_HT = Program.SG3_FB_HT_get();
      // RSFZ_Main.SG3_FB_LT = Program.SG3_FB_LT_get();
      // RSFZ_Main.SG3_JCB_K = Program.SG3_JCB_K_get();
      // RSFZ_Main.SG3_JCB_H = Program.SG3_JCB_H_get();
      // RSFZ_Main.SG3_JCB_L = Program.SG3_JCB_L_get();
      // RSFZ_Main.SG3_JCB_HT = Program.SG3_JCB_HT_get();
      // RSFZ_Main.SG3_JCB_LT = Program.SG3_JCB_LT_get();
      // RSFZ_Main.SG3_TXB_K = Program.SG3_TXB_K_get();
      // RSFZ_Main.SG3_TXB_H = Program.SG3_TXB_H_get();
      // RSFZ_Main.SG3_TXB_L = Program.SG3_TXB_L_get();
      // RSFZ_Main.SG3_TXB_T = Program.SG3_TXB_T_get();
      // RSFZ_Main.SG3_TXB_T1 = Program.SG3_TXB_T1_get();
      // RSFZ_Main.SG3_JYB_IN = Program.SG3_JYB_IN_get();
      // RSFZ_Main.SG3_SJB_K = Program.SG3_SJB_K_get();
      // RSFZ_Main.SG3_SJB_T = Program.SG3_SJB_T_get();
      // RSFZ_Main.SG3_SJFB_K = Program.SG3_SJFB_K_get();
      // RSFZ_Main.SG3_SJFB_HMT = Program.SG3_SJFB_HMT_get();
      // RSFZ_Main.SG3_SJFB_LMT = Program.SG3_SJFB_LMT_get();
      // RSFZ_Main.SG3_SJFB_MH = Program.SG3_SJFB_MH_get();
      // RSFZ_Main.SG3_SJFB_ML = Program.SG3_SJFB_ML_get();
      // RSFZ_Main.SG3_SJFB_TK = Program.SG3_SJFB_TK_get();
      // RSFZ_Main.SG3_SJFB_AK = Program.SG3_SJFB_AK_get();
      // Program.SG3_SIN_OUT_set(RSFZ_Main.SG3_SIN_OUT);
      // Program.SG3_FB_OUT_set(RSFZ_Main.SG3_FB_OUT);
      // Program.SG3_JCB_OUT_set(RSFZ_Main.SG3_JCB_OUT);
      // Program.SG3_TXB_OUT_set(RSFZ_Main.SG3_TXB_OUT);
      // Program.SG3_JYB_OUT_set(RSFZ_Main.SG3_JYB_OUT);
      // Program.SG3_SJB_OUT_set(RSFZ_Main.SG3_SJB_OUT);
      // Program.SG3_SJFB_OUT_set(RSFZ_Main.SG3_SJFB_OUT);
      // Program.SG3_OUT_set(RSFZ_Main.SG3_OUT);
      // RSFZ_Main.RS_HTM1_KSA = Program.RS_HTM1_KSA_get();
      // RSFZ_Main.RS_HTM1_KTM = Program.RS_HTM1_KTM_get();
      // RSFZ_Main.SB_T = Program.SB_T_get();
      // RSFZ_Main.SB_K = Program.SB_K_get();
      // RSFZ_Main.RS_SRQ1_KSA = Program.RS_SRQ1_KSA_get();
      // RSFZ_Main.RS_SRQ1_KTM = Program.RS_SRQ1_KTM_get();
      // Program.HM_YHT1_set(RSFZ_Main.HM_YHT1);
      // RSFZ_Main.VL2_SEL = Program.VL2_SEL_get();
      // RSFZ_Main.VL2_X1 = Program.VL2_X1_get();
      // RSFZ_Main.VL2_X2 = Program.VL2_X2_get();
      // RSFZ_Main.VL2_X3 = Program.VL2_X3_get();
      // RSFZ_Main.VL2_X4 = Program.VL2_X4_get();
      // RSFZ_Main.VL2_X5 = Program.VL2_X5_get();
      // RSFZ_Main.VL2_X6 = Program.VL2_X6_get();
      // RSFZ_Main.VL2_X7 = Program.VL2_X7_get();
      // RSFZ_Main.VL2_X8 = Program.VL2_X8_get();
      // RSFZ_Main.VL2_Y1 = Program.VL2_Y1_get();
      // RSFZ_Main.VL2_Y2 = Program.VL2_Y2_get();
      // RSFZ_Main.VL2_Y3 = Program.VL2_Y3_get();
      // RSFZ_Main.VL2_Y4 = Program.VL2_Y4_get();
      // RSFZ_Main.VL2_Y5 = Program.VL2_Y5_get();
      // RSFZ_Main.VL2_Y6 = Program.VL2_Y6_get();
      // RSFZ_Main.VL2_Y7 = Program.VL2_Y7_get();
      // RSFZ_Main.VL2_Y8 = Program.VL2_Y8_get();
      // RSFZ_Main.VL12_SEL = Program.VL12_SEL_get();
      // RSFZ_Main.VL12_X1 = Program.VL12_X1_get();
      // RSFZ_Main.VL12_X2 = Program.VL12_X2_get();
      // RSFZ_Main.VL12_X3 = Program.VL12_X3_get();
      // RSFZ_Main.VL12_X4 = Program.VL12_X4_get();
      // RSFZ_Main.VL12_X5 = Program.VL12_X5_get();
      // RSFZ_Main.VL12_X6 = Program.VL12_X6_get();
      // RSFZ_Main.VL12_X7 = Program.VL12_X7_get();
      // RSFZ_Main.VL12_X8 = Program.VL12_X8_get();
      // RSFZ_Main.VL12_Y1 = Program.VL12_Y1_get();
      // RSFZ_Main.VL12_Y2 = Program.VL12_Y2_get();
      // RSFZ_Main.VL12_Y3 = Program.VL12_Y3_get();
      // RSFZ_Main.VL12_Y4 = Program.VL12_Y4_get();
      // RSFZ_Main.VL12_Y5 = Program.VL12_Y5_get();
      // RSFZ_Main.VL12_Y6 = Program.VL12_Y6_get();
      // RSFZ_Main.VL12_Y7 = Program.VL12_Y7_get();
      // RSFZ_Main.VL12_Y8 = Program.VL12_Y8_get();
      // RSFZ_Main.VL7_SEL = Program.VL7_SEL_get();
      // RSFZ_Main.VL7_X1 = Program.VL7_X1_get();
      // RSFZ_Main.VL7_X2 = Program.VL7_X2_get();
      // RSFZ_Main.VL7_X3 = Program.VL7_X3_get();
      // RSFZ_Main.VL7_X4 = Program.VL7_X4_get();
      // RSFZ_Main.VL7_X5 = Program.VL7_X5_get();
      // RSFZ_Main.VL7_X6 = Program.VL7_X6_get();
      // RSFZ_Main.VL7_X7 = Program.VL7_X7_get();
      // RSFZ_Main.VL7_X8 = Program.VL7_X8_get();
      // RSFZ_Main.VL7_Y1 = Program.VL7_Y1_get();
      // RSFZ_Main.VL7_Y2 = Program.VL7_Y2_get();
      // RSFZ_Main.VL7_Y3 = Program.VL7_Y3_get();
      // RSFZ_Main.VL7_Y4 = Program.VL7_Y4_get();
      // RSFZ_Main.VL7_Y5 = Program.VL7_Y5_get();
      // RSFZ_Main.VL7_Y6 = Program.VL7_Y6_get();
      // RSFZ_Main.VL7_Y7 = Program.VL7_Y7_get();
      // RSFZ_Main.VL7_Y8 = Program.VL7_Y8_get();
      // RSFZ_Main.LL_SEL = Program.LL_SEL_get();
      // RSFZ_Main.YL_SEL = Program.YL_SEL_get();
      // RSFZ_Main.WD_SEL = Program.WD_SEL_get();
      // Program.SJ_KSA_set(RSFZ_Main.SJ_KSA);
      // RSFZ_Main.ZHZB = Program.ZHZB_get();
      // RSFZ_Main.RSZKB = Program.RSZKB_get();
      // RSFZ_Main.SNT_WTB = Program.SNT_WTB_get();
      // RSFZ_Main.RST_WTB = Program.RST_WTB_get();
      // RSFZ_Main.SNT_MIN = Program.SNT_MIN_get();
      // RSFZ_Main.SNT_MAX = Program.SNT_MAX_get();
      // RSFZ_Main.SNT_PJ = Program.SNT_PJ_get();
      // RSFZ_Main.RST_MIN = Program.RST_MIN_get();
      // RSFZ_Main.RST_MAX = Program.RST_MAX_get();
      // RSFZ_Main.RST_PJ = Program.RST_PJ_get();
      // RSFZ_Main.TEA_MIN = Program.TEA_MIN_get();
      // RSFZ_Main.TEA_MAX = Program.TEA_MAX_get();
      // RSFZ_Main.TEA_PJ = Program.TEA_PJ_get();
      // RSFZ_Main.Heartr = Program.Heartr_get();
      // Program.testbool_set(RSFZ_Main.testbool);
      // RSFZ_Main.BCSZT = Program.BCSZT_get();
      // RSFZ_Main.BCSZT2 = Program.BCSZT2_get();
      // RSFZ_Main.BCSZT3 = Program.BCSZT3_get();
      // RSFZ_Main.TD1_YJX_EN = Program.TD1_YJX_EN_get();
      // RSFZ_Main.TD1_EJX_EN = Program.TD1_EJX_EN_get();
      // RSFZ_Main.TD2_YJX_EN = Program.TD2_YJX_EN_get();
      // RSFZ_Main.TD2_EJX_EN = Program.TD2_EJX_EN_get();
      // RSFZ_Main.TD4_YJX_EN = Program.TD4_YJX_EN_get();
      // RSFZ_Main.TD4_EJX_EN = Program.TD4_EJX_EN_get();
      // RSFZ_Main.SG1_SIN_EN = Program.SG1_SIN_EN_get();
      // RSFZ_Main.SG1_FB_EN = Program.SG1_FB_EN_get();
      // RSFZ_Main.SG1_JCB_EN = Program.SG1_JCB_EN_get();
      // RSFZ_Main.SG1_TXB_EN = Program.SG1_TXB_EN_get();
      // RSFZ_Main.SG1_JYB_EN = Program.SG1_JYB_EN_get();
      // RSFZ_Main.SG1_SJB_EN = Program.SG1_SJB_EN_get();
      // RSFZ_Main.SG1_SJFB_EN = Program.SG1_SJFB_EN_get();
      // RSFZ_Main.SG1_SIN_QH = Program.SG1_SIN_QH_get();
      // RSFZ_Main.SG2_SIN_EN = Program.SG2_SIN_EN_get();
      // RSFZ_Main.SG2_FB_EN = Program.SG2_FB_EN_get();
      // RSFZ_Main.SG2_JCB_EN = Program.SG2_JCB_EN_get();
      // RSFZ_Main.SG2_TXB_EN = Program.SG2_TXB_EN_get();
      // RSFZ_Main.SG2_JYB_EN = Program.SG2_JYB_EN_get();
      // RSFZ_Main.SG2_SJB_EN = Program.SG2_SJB_EN_get();
      // RSFZ_Main.SG2_SJFB_EN = Program.SG2_SJFB_EN_get();
      // RSFZ_Main.SG2_SIN_QH = Program.SG2_SIN_QH_get();
      // RSFZ_Main.SG3_SIN_EN = Program.SG3_SIN_EN_get();
      // RSFZ_Main.SG3_FB_EN = Program.SG3_FB_EN_get();
      // RSFZ_Main.SG3_JCB_EN = Program.SG3_JCB_EN_get();
      // RSFZ_Main.SG3_TXB_EN = Program.SG3_TXB_EN_get();
      // RSFZ_Main.SG3_JYB_EN = Program.SG3_JYB_EN_get();
      // RSFZ_Main.SG3_SJB_EN = Program.SG3_SJB_EN_get();
      // RSFZ_Main.SG3_SJFB_EN = Program.SG3_SJFB_EN_get();
      // RSFZ_Main.SG3_SIN_QH = Program.SG3_SIN_QH_get();
      // RSFZ_Main.SB_EN = Program.SB_EN_get();
      // RSFZ_Main.YHKC = Program.YHKC_get();
      // Program.TJQL_set(RSFZ_Main.TJQL);
      // RSFZ_Main.TJQL = Program.TJQL_get();
    }
    $(document).trigger('changeData', dataObj)
  }

  // 点击阀门开度弹出一个输入框,输入开度，然后再提交
  promptFun("#aperture")
  promptFun("#aperture2")
  promptFun("#aperture3")
  promptFun("#aperture4")

  function promptFun(id) {
    $(id).on('click', function () {
      var oldValue = $(id).val();
      var inputValue = prompt("请输入开度", oldValue);
      if (inputValue && !isNaN(inputValue) && inputValue >= 0 && inputValue <= 100) {
        $(id).val(inputValue);
      }
    })
  }
  //设定初始值
  RSFZ_Main.CN_S001T = 1;

  //泵开关的操作
  $("#on").on('click', function () {
    RSFZ_Main.CN_S001T = 1;
    $("#on").addClass("onactive");
    $("#off").removeClass("offactive");
  })
  $("#off").on('click', function () {
    RSFZ_Main.CN_S001T = 0;
    $("#off").addClass("offactive");
    $("#on").removeClass("onactive");
  })

  //开始运行和暂停运行开关的切换
  var onOff = 0;
  $("#run").on('click', function () {
    if (onOff == 0) {
      $(this).children(".txt").text("暂停运行");
      onOff = 1;
      run(1);
    } else if (onOff == 1) {
      $(this).children(".txt").text("开始运行");
      onOff = 0;
      run(0);
    }
  })

  //点击温度Xk投入
  $("#btn1").click(function () {
    $(this).addClass("show");
    $("#btn2").removeClass("show")
    RSFZ_Main.BCSZT = true;
  })
  //点击温度Xk切除
  $("#btn2").click(function () {
    $(this).addClass("show");
    $("#btn1").removeClass("show")
    RSFZ_Main.BCSZT = false;
  })
  //点击给水Xk投入
  $("#btn3").click(function () {
    $(this).addClass("show");
    $("#btn4").removeClass("show")
    RSFZ_Main.BCSZT2 = true;
  })
  //点击给水Xk切除
  $("#btn4").click(function () {
    $(this).addClass("show");
    $("#btn3").removeClass("show")
    RSFZ_Main.BCSZT2 = false;
  })
  //点击补水Xk投入
  $("#btn5").click(function () {
    $(this).addClass("show");
    $("#btn6").removeClass("show")
    RSFZ_Main.BCSZT3 = true;
  })
  //点击补水Xk切除
  $("#btn6").click(function () {
    $(this).addClass("show");
    $("#btn5").removeClass("show")
    RSFZ_Main.BCSZT3 = false;
  })

  //点击统计参数开始统计
  $("#censusStart").on('click', function () {
    RSFZ_Main.TJQL = false;
    $(this).addClass("on");
    $("#censusClear").removeClass("on");
  })
  //点击统计参数统计清零
  $("#censusClear").on('click', function () {
    RSFZ_Main.TJQL = true;
    $(this).addClass("on");
    $("#censusStart").removeClass("on");
  })
  //点击统计参数开始统计
  $("#checkStart").on('click', function () {
    RSFZ_Main.KHEN = false;
    $(this).addClass("on");
    $("#checkClear").removeClass("on");
  })
  //点击统计参数统计清零
  $("#checkClear").on('click', function () {
    RSFZ_Main.KHEN = true;
    $(this).addClass("on");
    $("#checkStart").removeClass("on");
  })

  //点击保存数据
  var onOff2 = 1;
  $("#keep").on('click', function () {
    if (onOff2 == 1) {
      $(this).addClass("on2");
      RSFZ_Main.BCEN = true;
      onOff2 = 0;
    } else {
      $(this).removeClass("on2");
      RSFZ_Main.BCEN = false;
      onOff2 = 1;
    }

  })

  //点击调用数据
  var onOff3 = 1;
  $("#fetch").on('click', function () {
    if (onOff3 == 1) {
      $(this).addClass("on2");
      RSFZ_Main.DYEN = true;
      onOff3 = 0;
    } else {
      $(this).removeClass("on2");
      RSFZ_Main.DYEN = false;
      onOff3 = 1;
    }

  })

  //环状函数
  function onWaterChange(obj) {
    var myChart = obj.myChart;
    var option = {
      series: [
        {
          type: 'pie',
          radius: ['80%', '100%'],
          // 禁用饼状图悬浮动画效果
          animation: false,
          color: obj.color,
          data: obj.data,
          label: {
            show: true,
            position: 'center',
            formatter: function () {
              var total = 0;
              for (var i = 0; i < obj.data.length; i++) {
                total += Number(obj.data[i].value);
              }
              return (obj.data[0].value * 100 / total).toFixed(0) + '%';
            },
            textStyle: {
              fontSize: 10,
              color: "#FFF"
            }
          }
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option, obj.notMerge);
  }

  // Program.main();
  function setDataObj(RSFZ_Main) {
    return {
      CN_T010: RSFZ_Main.CN_T010,  // 天气温度
      FL: RSFZ_Main.CN_FL,  // 风力
      CN_HRQL: RSFZ_Main.CN_HRQL,  // 换热器液位
      CN_T009: RSFZ_Main.CN_T009,  // 室内温度
      CN_P001: RSFZ_Main.CN_P001,  // 蒸汽压力
      CN_G001: RSFZ_Main.CN_G001,  // 蒸汽流量
      CN_T001: RSFZ_Main.CN_T001,  // 蒸汽温度
      CN_G002: RSFZ_Main.CN_G002,  // 流量
      CN_P002: RSFZ_Main.CN_P002,  // 压力
      CN_T002: RSFZ_Main.CN_T002,  // 温度
      CN_G003: RSFZ_Main.CN_G003,  // 疏水流量
      CN_P003: RSFZ_Main.CN_P003,  // 疏水压力
      CN_T003: RSFZ_Main.CN_T003,  // 疏水温度
      CN_G004: RSFZ_Main.CN_G004,  // 进水流量
      CN_P004: RSFZ_Main.CN_P004,  // 进水压力
      CN_T004: RSFZ_Main.CN_T004,  // 进水温度
      CN_G005: RSFZ_Main.CN_G005,  // 热水流量
      CN_P005: RSFZ_Main.CN_P005,  // 阀前热水压力
      CN_T005: RSFZ_Main.CN_T005,  // 阀前热水温度
      CN_G006: RSFZ_Main.CN_G006,  // 回水流量
      CN_P006: RSFZ_Main.CN_P006,  // 阀后热水压力
      CN_T006: RSFZ_Main.CN_T006,  // 阀后热水温度
      CN_G007: RSFZ_Main.CN_G007,  // 补水流量
      CN_P007: RSFZ_Main.CN_P007,  // 补水压力
      CN_T007: RSFZ_Main.CN_T007,  // 补水温度
      CN_P008: RSFZ_Main.CN_P008,  // 回水压力
      CN_T008: RSFZ_Main.CN_T008,  // 回水温度
      CN_L002: RSFZ_Main.CN_L002,  // 水箱液位
      PTMIN: RSFZ_Main.CN_PTMIN,  // 网管温度下限
      TEA_PJ: RSFZ_Main.TEA_PJ,  // 天气温度平均值
      TEA_MAX: RSFZ_Main.TEA_MAX,  // 天气温度最高值
      TEA_MIN: RSFZ_Main.TEA_MIN,  // 天气温度最低值
      RST_PJ: RSFZ_Main.RST_PJ,  // 热水温度平均值
      RST_MAX: RSFZ_Main.RST_MAX,  // 热水温度最高值
      RST_MIN: RSFZ_Main.RST_MIN,  // 热水温度最低值
      SNT_PJ: RSFZ_Main.SNT_PJ,  // 室内温度平均值
      SNT_MAX: RSFZ_Main.SNT_MAX,  // 室内温度最高值
      SNT_MIN: RSFZ_Main.SNT_MIN,  // 室内温度最低值
    };
  }
});
