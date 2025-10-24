import React, { useState, useEffect } from 'react';
import { Select, Card, Radio, Empty } from 'antd';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;

const DataVisualization = ({ data, columns }) => {
  const [groupByField, setGroupByField] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartOption, setChartOption] = useState({});
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    if (columns && columns.length > 0) {
      // 过滤出适合分组的字段（通常是分类字段）
      const fields = columns
        .filter(col => col.dataIndex !== 'key')
        .map(col => col.dataIndex);
      setAvailableFields(fields);
      if (fields.length > 0 && !groupByField) {
        setGroupByField(fields[0]);
      }
    }
  }, [columns]);

  useEffect(() => {
    if (data && data.length > 0 && groupByField) {
      generateChartOption();
    }
  }, [data, groupByField, chartType]);

  const generateChartOption = () => {
    // 按选定字段分组统计
    const groupData = {};
    data.forEach(item => {
      const value = item[groupByField] || '未知';
      if (groupData[value]) {
        groupData[value] += 1;
      } else {
        groupData[value] = 1;
      }
    });

    const keys = Object.keys(groupData);
    const values = Object.values(groupData);

    // 生成图表配置
    const option = {
      title: {
        text: `按${groupByField}分组统计`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: chartType !== 'pie' ? {
        type: 'category',
        data: keys,
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      } : undefined,
      yAxis: chartType !== 'pie' ? {
        type: 'value'
      } : undefined,
      series: [
        chartType === 'pie' ? {
          name: groupByField,
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: keys.map((key, index) => ({
            name: key,
            value: values[index]
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        } : {
          name: '数量',
          type: chartType,
          data: values
        }
      ],
      grid: chartType !== 'pie' ? {
        bottom: 100
      } : undefined
    };

    setChartOption(option);
  };

  const handleFieldChange = (value) => {
    setGroupByField(value);
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>可视化自助分析图表</h2>
      
      {data && data.length > 0 ? (
        <>
          <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
            <div>
              <span style={{ marginRight: 8 }}>选择分组字段:</span>
              <Select 
                value={groupByField} 
                onChange={handleFieldChange}
                style={{ width: 200 }}
              >
                {availableFields.map(field => (
                  <Option key={field} value={field}>{field}</Option>
                ))}
              </Select>
            </div>
            
            <div>
              <span style={{ marginRight: 8 }}>图表类型:</span>
              <Radio.Group value={chartType} onChange={handleChartTypeChange}>
                <Radio.Button value="bar">柱状图</Radio.Button>
                <Radio.Button value="line">折线图</Radio.Button>
                <Radio.Button value="pie">饼图</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          
          <Card>
            <ReactECharts 
              option={chartOption} 
              style={{ height: 400 }}
              opts={{ renderer: 'svg' }}
            />
          </Card>
        </>
      ) : (
        <Empty description="请先上传数据" />
      )}
    </div>
  );
};

export default DataVisualization;