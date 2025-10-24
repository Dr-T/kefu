import React, { useState } from 'react';
import { Upload, Button, message, Table, Input, Tag, Space } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import Highlighter from 'react-highlight-words';

const DataUpload = ({ onDataLoaded }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [negativeWords, setNegativeWords] = useState(['投诉', '失望', '不满', '差评', '退款']);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length > 0) {
        // 处理列
        const firstRow = jsonData[0];
        const tableColumns = Object.keys(firstRow).map(key => ({
          title: key,
          dataIndex: key,
          key: key,
          render: (text) => {
            if (typeof text === 'string') {
              return (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={negativeWords}
                  autoEscape
                  textToHighlight={text}
                />
              );
            }
            return text;
          }
        }));
        
        // 添加行号
        const dataWithKeys = jsonData.map((item, index) => ({
          ...item,
          key: index,
        }));
        
        setData(dataWithKeys);
        setColumns(tableColumns);
        message.success(`${file.name} 上传成功！`);
        
        if (onDataLoaded) {
          onDataLoaded(dataWithKeys, tableColumns);
        }
      } else {
        message.error('上传的Excel文件没有数据！');
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const handleClose = (removedTag) => {
    const newTags = negativeWords.filter(tag => tag !== removedTag);
    setNegativeWords(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && negativeWords.indexOf(inputValue) === -1) {
      setNegativeWords([...negativeWords, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>数据上传与高亮展示</h2>
      
      <div style={{ marginBottom: 16 }}>
        <Upload
          beforeUpload={handleUpload}
          accept=".xlsx,.xls"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>上传Excel文件</Button>
        </Upload>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <h3>负面词汇配置</h3>
        <div>
          {negativeWords.map(tag => (
            <Tag
              closable
              key={tag}
              color="red"
              onClose={() => handleClose(tag)}
            >
              {tag}
            </Tag>
          ))}
          {inputVisible ? (
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
              autoFocus
            />
          ) : (
            <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
              <PlusOutlined /> 添加负面词汇
            </Tag>
          )}
        </div>
      </div>
      
      {data.length > 0 && (
        <Table 
          columns={columns} 
          dataSource={data} 
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default DataUpload;