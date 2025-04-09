var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
  useCoarsePointer :true,
  pointerSize: 100,  
  renderer: 'canvas',
  useDirtyRect: false
});

// 定義 Google Apps Script 部署的網址
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6ptRlGbOJK8cobRRx3lgZST7SRXifGHX0ZxZMgDDHRpAWll79VqQ8fCKJBblVXpYvIA/exec';

// 從 Google Sheets 獲取數據
async function fetchData() {
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// 初始化圖表
async function initChart() {
  const data = await fetchData();
  if (!data) return;

  const xAxis_data = data.xAxis;
  const data_A = data.dataA;
  const data_B = data.dataB;
  const data_C = data.dataC;
  const names = ['開案率％','開案- 是','開案- 否'];
  const color = ['#4D8EFF','#3fdd73','#FA1818'];

  const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',  // 讓滑鼠移動時顯示十字準線
            crossStyle: {
                color: '#999'
            }
        },
        formatter: function (params) {
            var htmlStr = params[0].name + '<br/>';  // X 軸名稱
            params.forEach(param => {
                var seriesName = param.seriesName;
                var value = param.value;
                var seriesColor = color[param.seriesIndex]; // 確保顏色正確對應
                htmlStr += `<div>
                    <span style="display:inline-block;width:10px;height:10px;border-radius:5px;background-color:${seriesColor};"></span> 
                    ${seriesName}：${value}
                </div>`;
            });
            return htmlStr;
        }
    },
    title: {
            text: '2025第１季區辦處理進度',
            top:'1%',
            left:'10%',
            textStyle: {
                color: '#000',
                fontWeight: 540,
                fontSize: 24
            }
        },
    toolbox: {
            top: 10,
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
        },
    grid: {
        top: '12%',
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
    },
    legend: {
        top: '5%',
        textStyle: {
            fontSize: 15,
            color: '#666666',
        },
        data: names
    },
    xAxis: {
        type: 'category',
        data: xAxis_data,
        axisPointer: { show: true },  // 讓 X 軸顯示指示線
        axisLine: {
            lineStyle: {
                color: '#E3E3E3',
                width: 2
            }
        },
        axisLabel: {
            textStyle: {
                fontSize: 15,
                color: '#646464'
            }
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '件數',
            axisPointer: { show: true },  // 讓 Y 軸顯示指示線
            axisLabel: {
                textStyle: { fontSize: 15, color: '#979A9F' }
            },
            splitLine: {
                lineStyle: { type: 'dashed', color: '#4d4d4f' }
            }
        },
        {
            type: 'value',
            name: '開案率％',
            min: 0,
            max: 100,
            position: 'right',
            axisLine: {
                lineStyle: { color: color[2] }
            },
            axisLabel: {
                formatter: '{value}%',
                textStyle: { fontSize: 15, color: '#979A9F' }
            }
        }
    ],
    series: [
        {
            type: 'bar',
            name: names[1],
            data: data_A,
            itemStyle: { color: color[0] }
        },
        {
            type: 'bar',
            name: names[2],
            data: data_B,
            itemStyle: { color: color[1] }
        },
        {
            type: 'line',
            name: names[0],
            data: data_C,
            yAxisIndex: 1,
            symbolSize :15, //设置拐点大小
            itemStyle: { color: color[2] },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(255,140,55,0.7)' },
                        { offset: 1, color: 'rgba(255,140,55,0)' }
                    ]
                }
            }
        }
    ]
  };

  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }
}

// 初始化圖表
initChart();

window.addEventListener('resize', myChart.resize);
