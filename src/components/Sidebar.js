import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateAgent, setSelectedAgent } from '../redux/flowSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const selectedAgentId = useSelector(state => state.flow.selectedAgentId);
  const agent = useSelector(state => state.flow.agents.find(a => a.id === selectedAgentId));

  if (!agent) return null;

  const { label, description, steps, tools } = agent.data;

  const handleChange = (field, value) => {
    dispatch(updateAgent({ id: selectedAgentId, data: { ...agent.data, [field]: value } }));
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
  ];

  const addTool = () => {
    const newTools = [...tools, { name: '', parameters: [], description: '', url: '' }];
    handleChange('tools', newTools);
  };

  const updateTool = (index, field, value) => {
    const updatedTools = tools.map((tool, i) => 
      i === index ? { ...tool, [field]: value } : tool
    );
    handleChange('tools', updatedTools);
  };

  const addParameter = (toolIndex) => {
    const updatedTools = tools.map((tool, i) => 
      i === toolIndex 
        ? { ...tool, parameters: [...tool.parameters, { name: '', type: 'String', description: '' }] }
        : tool
    );
    handleChange('tools', updatedTools);
  };

  const updateParameter = (toolIndex, paramIndex, field, value) => {
    const updatedTools = tools.map((tool, i) => 
      i === toolIndex 
        ? {
            ...tool,
            parameters: tool.parameters.map((param, j) => 
              j === paramIndex ? { ...param, [field]: value } : param
            )
          }
        : tool
    );
    handleChange('tools', updatedTools);
  };

  const removeParameter = (toolIndex, paramIndex) => {
    const updatedTools = tools.map((tool, i) => 
      i === toolIndex 
        ? { ...tool, parameters: tool.parameters.filter((_, j) => j !== paramIndex) }
        : tool
    );
    handleChange('tools', updatedTools);
  };

  const removeTool = (index) => {
    const updatedTools = tools.filter((_, i) => i !== index);
    handleChange('tools', updatedTools);
  };

  return (
    <div className="w-96 bg-white shadow-lg rounded-lg p-6 overflow-y-auto">
      <button
        onClick={() => dispatch(setSelectedAgent(null))}
        className="text-gray-500 hover:text-gray-700 float-right text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Agent</h2>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Steps</label>
        <ReactQuill
          value={steps}
          onChange={(value) => handleChange('steps', value)}
          modules={modules}
          formats={formats}
          className="bg-white border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Tools</label>
        {tools.map((tool, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-md">
            <input
              type="text"
              value={tool.name}
              onChange={(e) => updateTool(index, 'name', e.target.value)}
              placeholder="Tool Name"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              value={tool.description}
              onChange={(e) => updateTool(index, 'description', e.target.value)}
              placeholder="Tool Description"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              value={tool.url}
              onChange={(e) => updateTool(index, 'url', e.target.value)}
              placeholder="Tool URL"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 focus:ring-blue-500 focus:border-blue-500"
            />
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Parameters</h4>
              {tool.parameters.map((param, paramIndex) => (
                <div key={paramIndex} className="mb-4">
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) => updateParameter(index, paramIndex, 'name', e.target.value)}
                    placeholder="Parameter Name"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={param.type}
                    onChange={(e) => updateParameter(index, paramIndex, 'type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Enum">Enum</option>
                  </select>
                  <textarea
                    value={param.description}
                    onChange={(e) => updateParameter(index, paramIndex, 'description', e.target.value)}
                    placeholder="Parameter Description"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeParameter(index, paramIndex)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1 rounded-md shadow-sm mt-1"
                  >
                    Remove Parameter
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addParameter(index)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md shadow-sm mt-2"
              >
                Add Parameter
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeTool(index)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md mt-4 shadow-sm"
            >
              Remove Tool
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTool}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
        >
          Add Tool
        </button>
      </div>
    </div>
  );
};

export default Sidebar;