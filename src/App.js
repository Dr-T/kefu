import React, { useState } from 'react';
import { Layout, Typography, Tabs, theme } from 'antd';
import { RobotOutlined, AreaChartOutlined, CloudUploadOutlined } from '@ant-design/icons';
import './App.css';
import DataUpload from './components/DataUpload';
import DataVisualization from './components/DataVisualization';
import ReportGenerator from './components/ReportGenerator';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleDataLoaded = (loadedData, loadedColumns) => {
    setData(loadedData);
    setColumns(loadedColumns);
  };

  const items = [
    {
      key: '1',
      label: <span><CloudUploadOutlined /> 数据上传与高亮展示</span>,
      children: <DataUpload onDataLoaded={handleDataLoaded} />
    },
    {
      key: '2',
      label: <span><AreaChartOutlined /> 可视化自助分析图表</span>,
      children: <DataVisualization data={data} columns={columns} />
    },
    {
      key: '3',
      label: <span><RobotOutlined /> 智能报告生成</span>,
      children: <ReportGenerator data={data} />
    }
  ];

  const { token } = theme.useToken();

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header className="tech-header" style={{ padding: '0 20px', display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ marginRight: '16px' }}>
          <RobotOutlined style={{ fontSize: '28px', color: 'white' }} />
        </div>
        <Title level={2} style={{ margin: '16px 0', color: 'white' }}>客服数据分析系统</Title>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        <div className="tech-card" style={{ padding: '24px', minHeight: '280px' }}>
          <Tabs 
            defaultActiveKey="1" 
            items={items} 
            size="large"
            type="card"
            animated={{ inkBar: true, tabPane: true }}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: token.colorBgContainer }}>
        客服数据分析系统 ©2025 | 科技驱动服务
      </Footer>
    </Layout>
  );
}

export default App;
