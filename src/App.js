import React, { useState } from 'react';
import { Layout, Typography, Tabs } from 'antd';
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
      label: '数据上传与高亮展示',
      children: <DataUpload onDataLoaded={handleDataLoaded} />
    },
    {
      key: '2',
      label: '可视化自助分析图表',
      children: <DataVisualization data={data} columns={columns} />
    },
    {
      key: '3',
      label: '智能报告生成',
      children: <ReportGenerator data={data} />
    }
  ];

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <Title level={2} style={{ margin: '16px 0' }}>客服数据分析系统</Title>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <Tabs defaultActiveKey="1" items={items} />
      </Content>
      <Footer style={{ textAlign: 'center' }}>客服数据分析系统 ©2025</Footer>
    </Layout>
  );
}

export default App;
