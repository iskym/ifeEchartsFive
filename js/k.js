// JavaScript Document
$(function(){
		var myChart=echarts.init(document.getElementById('main'));
		var oData='';
		//三十天起始值
		var start=0;
		var end=30;
		var newData='';
		//获取数组一定的值
		function getArr(arr,first,last){
				console.log(last);
				if(last >= arr.length){start = 0;end = 30;console.log(11111111);};
				var oArr=[];
				for(var i = first;i < last;i++){
						oArr.push(arr[i]);
					};
				return oArr;
			}
		
		//数据分割函数；
		function splitData(rawData) {
			var categoryData = [];
			var values = [];
			var volumns = [];
			for (var i = 0; i < rawData.length; i++) {
				if(rawData[i].Ticker == 'A'){
						categoryData.push(rawData[i]['Date']);
						var value=[];
						value.push(rawData[i].Open,rawData[i].Close,rawData[i].Low,rawData[i].High);
						values.push(value);
						volumns.push(rawData[i].Volume)
					}
				
			}
			return {
				categoryData: categoryData,
				values: values,
				volumns:volumns
			};
		};
		//计算ma5 ma10 ....
		function calculateMA(dayCount, data) {
			oValues=getArr(data.values,start,end);
			
			//console.log(data.values.length);
			var result = [];
			//console.log(data);
			for (var i = start, len = oValues.length; i < (len + start); i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					
					var count = i - j;
					//console.log(count);
					count = data.values[count][1];
					sum += parseFloat(count);
				}
				result.push(+(sum / dayCount).toFixed(3));
			}
			return result;
		};
		//返回函数
		function dataBack(obj){
				var obj = getArr(obj,start,end)//obj.slice(start,end);	
				//console.log(obj.length);
				return obj;			
			}
		//获取json数据
		$.get('data/converted.json',function(Data){
				//获取前三十天数据;
				data=splitData(Data);
				
				myChart.setOption(option = {
					backgroundColor: '#eee',
					animation: false,
					legend: {
						bottom: 10,
						left: 'center',
						data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'line'
						}
					},
					toolbox: {
						feature: {
							dataZoom: {
								yAxisIndex: false
							},
							brush: {
								type: ['lineX', 'clear']
							}
						}
					},
					/*brush: {
						xAxisIndex: 'all',
						brushLink: 'all',
						outOfBrush: {
							colorAlpha: 0.1
						}
					},*/
					grid: [
						{
							left: '10%',
							right: '8%',
							height: '50%'
						},
						{
							left: '10%',
							right: '8%',
							top: '63%',
							height: '16%'
						}
					],
					xAxis: [
						{
							type: 'category',
							data: dataBack(data.categoryData),
							scale: true,
							boundaryGap : false,
							axisLine: {onZero: false},
							splitLine: {show: false},
							splitNumber: 20,
							min: 'dataMin',
							max: 'dataMax'
						},
						{
							type: 'category',
							gridIndex: 1,
							data: dataBack(data.categoryData),
							scale: true,
							boundaryGap : false,
							axisLine: {onZero: false},
							axisTick: {show: false},
							splitLine: {show: false},
							axisLabel: {show: false},
							splitNumber: 20,
							min: 'dataMin',
							max: 'dataMax'
						}
					],
					yAxis: [
						{
							scale: true,
							splitArea: {
								show: true
							}
						},
						{
							scale: true,
							gridIndex: 1,
							splitNumber: 2,
							axisLabel: {show: false},
							axisLine: {show: false},
							axisTick: {show: false},
							splitLine: {show: false}
						}
					],
					/*dataZoom: [
						{
							type: 'inside',
							xAxisIndex: [0, 1],
							start: 60,
							end: 100
						},
						{
							show: true,
							xAxisIndex: [0, 1],
							type: 'slider',
							top: '85%',
							start: 60,
							end: 100
						}
					],*/
					series: [
						{
							name: 'Dow-Jones index',
							type: 'candlestick',
							data: dataBack(data.values),
							itemStyle: {
								normal: {
									borderColor: null,
									borderColor0: null
								}
							},
							tooltip: {
								formatter: function (param) {
									var param = param[0];
									return [
										'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
										'Open: ' + param.data[0] + '<br/>',
										'Close: ' + param.data[1] + '<br/>',
										'Lowest: ' + param.data[2] + '<br/>',
										'Highest: ' + param.data[3] + '<br/>'
									].join('');
								}
							}
						},
						{
							name: 'MA5',
							type: 'line',
							data: calculateMA(5, data),
							smooth: true,
							lineStyle: {
								normal: {opacity: 0.5}
							}
						},
						{
							name: 'MA10',
							type: 'line',
							data: calculateMA(10, data),
							smooth: true,
							lineStyle: {
								normal: {opacity: 0.5}
							}
						},
						{
							name: 'MA20',
							type: 'line',
							data: calculateMA(20, data),
							smooth: true,
							lineStyle: {
								normal: {opacity: 0.5}
							}
						},
						{
							name: 'MA30',
							type: 'line',
							data: calculateMA(30, data),
							smooth: true,
							lineStyle: {
								normal: {opacity: 0.5}
							}
						},
						{
							name: 'Volumn',
							type: 'bar',
							xAxisIndex: 1,
							yAxisIndex: 1,
							data: dataBack(data.volumns)//volumns
						}
					]
				}, true);
			/*myChart.dispatchAction({
				type: 'brush',
				areas: [
					{
						brushType: 'lineX',
						coordRange: ['20100625', '20100809'],
						xAxisIndex: 0
					}
				]
			});*/
			// MA数字减少
			/*function reduce(num){
				num > 0 ? num-- : num = 0 ;
				return num;
				};
			var MA5 = 5;
			var MA10 = 10;
			var MA20 = 20;
			var MA30 = 30;*/
			//定时每200ms更新一天
			
			setInterval(function(){
					//console.log(MA5 > 0 ? MA5-- : MA5 = 0);
					start++;
					end++;
					//console.log(data.values.length);
					//newData=Data.slice(start,end);
					//data=splitData(newData);
					myChart.setOption({
							xAxis: [
								{
									type: 'category',
									data: dataBack(data.categoryData)//data.categoryData[start,end],
								}
								
							],
							series: [
								{
									name: 'Dow-Jones index',
									data: dataBack(data.values)
								},
								{
									name: 'MA5',
									data: calculateMA(5, data)
								},
								{
									name: 'MA10',
									data: calculateMA(10, data)
								},
								{
									name: 'MA20',
									data: calculateMA(20, data)
								},
								{
									name: 'MA30',
									data: calculateMA(30, data)
								},
								{
									name: 'Volumn',
									data: dataBack(data.volumns)//data.volumns[start,end]
								}
							]
					
						});
				},200)
			//使用 option
		//myChart.setOption(option);
			})
	})