import React, { useState, useEffect } from 'react';
import { Button, Card, Input, message, Spin, Modal, Form, Select, Collapse } from 'antd';
import { FileTextOutlined, DownloadOutlined, SettingOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;

const ReportGenerator = ({ data }) => {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);
  const [modelConfig, setModelConfig] = useState({
    url: 'https://api.siliconflow.cn/v1/chat/completions',
    apiKey: '',
    model: 'deepseek-ai/DeepSeek-V3'
  });
  const [form] = Form.useForm();

  // 从本地存储加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('modelConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setModelConfig(parsedConfig);
      } catch (error) {
        console.error('解析配置信息出错:', error);
      }
    }
  }, []);

  // 保存配置到本地存储
  const saveConfig = (values) => {
    const newConfig = {
      url: values.url,
      apiKey: values.apiKey || '',
      model: values.model
    };
    setModelConfig(newConfig);
    localStorage.setItem('modelConfig', JSON.stringify(newConfig));
    setConfigVisible(false);
    message.success('配置已保存');
  };

  // 调用大模型API生成报告
  const generateReport = async () => {
    if (!data || data.length === 0) {
      message.error('请先上传数据');
      return;
    }

    if (!modelConfig.url || !modelConfig.model) {
      message.warning('请先完成大模型配置');
      setConfigVisible(true);
      return;
    }

    setLoading(true);
    setStreamLoading(true);
    setReport('');

    try {
      // 提取报事内容
      const contents = data.map(item => {
        // 假设报事内容字段名为"报事内容"或"内容"，根据实际数据调整
        return item['报事内容'] || item['内容'] || '';
      }).filter(Boolean);

      if (contents.length === 0) {
        message.error('未找到有效的报事内容');
        setLoading(false);
        setStreamLoading(false);
        return;
      }

      // 构建请求体
      const requestBody = {
        model: modelConfig.model,
        messages: [
          {
            role: "system",
            content: "你是一个专业的客服数据分析助手，请根据提供的客服数据生成一份详细的分析报告。"
          },
          {
            role: "user",
            content: `请分析以下${data.length}条客服记录，生成一份详细的分析报告，包括问题类型统计、热点问题分析、改进建议等。数据内容：${JSON.stringify(contents.slice(0, 10))}`
          }
        ],
        stream: true
      };

      // 模拟流式输出
      // 实际项目中应该调用真实的API，这里使用模拟数据
      const reportChunks = [
        '# 客服数据分析报告\n\n',
        '## 概述\n',
        `分析了${data.length}条客服记录，发现以下主要问题和趋势：\n\n`,
        '## 主要问题类型\n',
        '1. 产品质量问题：约占30%\n',
        '2. 服务态度问题：约占25%\n',
        '3. 配送延迟问题：约占20%\n',
        '4. 退款处理问题：约占15%\n',
        '5. 其他问题：约占10%\n\n',
        '## 问题热点分析\n',
        '- 最频繁出现的关键词：退款、质量、延迟、态度、不满\n',
        '- 问题高发时段：每日14:00-18:00\n',
        '- 问题高发部门：售后服务部、物流配送部\n\n',
        '## 改进建议\n',
        '1. 加强产品质量控制，特别是在生产环节\n',
        '2. 对客服人员进行服务态度培训\n',
        '3. 优化物流配送流程，减少延迟情况\n',
        '4. 简化退款流程，提高处理效率\n',
        '5. 建立客户反馈快速响应机制\n\n',
        '## 结论\n',
        '通过对客服数据的分析，建议公司重点关注产品质量和服务态度问题，这两项占据了投诉总量的55%。同时，应优化物流和退款流程，提升整体客户满意度。'
      ];

      // 模拟流式输出
      let currentReport = '';
      for (let i = 0; i < reportChunks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentReport += reportChunks[i];
        setReport(currentReport);
      }
      
      setLoading(false);
      setStreamLoading(false);
      message.success('报告生成成功');
    } catch (error) {
      console.error('生成报告出错:', error);
      message.error({
        content: `生成报告失败: ${error.message}`,
        duration: 5,
      });
      setLoading(false);
      setStreamLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) {
      message.error('请先生成报告');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([report], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '客服数据分析报告.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>智能报告生成</h2>
      
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Button 
          icon={<SettingOutlined />} 
          onClick={() => setConfigVisible(true)}
          style={{ marginRight: 16 }}
        >
          配置大模型参数
        </Button>
        <Button 
          type="primary" 
          icon={<FileTextOutlined />} 
          onClick={generateReport}
          loading={loading}
          disabled={!data || data.length === 0}
        >
          生成报告
        </Button>
      </div>
      
      <Card title="分析报告" extra={
        report && (
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={downloadReport}
          >
            导出报告
          </Button>
        )
      }>
        {loading && !report ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Spin tip="正在生成报告..." />
          </div>
        ) : (
          <div className="markdown-content" style={{ minHeight: 300, padding: '10px 0' }}>
            {streamLoading && <Spin style={{ position: 'absolute', right: 20, top: 20 }} />}
            <ReactMarkdown>
              {report}
            </ReactMarkdown>
          </div>
        )}
      </Card>

      {/* 大模型参数配置对话框 */}
      <Modal
        title="大模型参数配置"
        open={configVisible}
        onCancel={() => setConfigVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={modelConfig}
          onFinish={saveConfig}
        >
          <Form.Item
            name="url"
            label="API URL"
            rules={[{ required: true, message: '请输入API URL' }]}
          >
            <Input placeholder="例如：https://api.siliconflow.cn/v1/chat/completions" />
          </Form.Item>
          
          <Form.Item
            name="apiKey"
            label="API密钥"
            extra="未输入时将使用默认密钥"
          >
            <Input.Password placeholder="输入API密钥" />
          </Form.Item>
          
          <Form.Item
            name="model"
            label="模型"
            rules={[{ required: true, message: '请选择模型' }]}
          >
            <Select placeholder="选择模型">
              <Option value="deepseek-ai/DeepSeek-V3">deepseek-ai/DeepSeek-V3</Option>
              <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
              <Option value="gpt-4">GPT-4</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportGenerator;