import React from 'react';
import { Handle, Position } from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedAgent } from '../redux/flowSlice';

const AgentNode = ({ id, data }) => {
  const dispatch = useDispatch();
  const agent = useSelector(state => state.flow.agents.find(agent => agent.id === id));

  if (!agent) {
    return null; // Return null if the agent doesn't exist
  }

  const { label } = agent.data;

  const handleClick = () => {
    dispatch(setSelectedAgent(id));
  };

  return (
    <div
      className={`relative px-4 py-2 shadow-md rounded-md bg-white border-2 ${
        label.trim() === '' ? 'border-red-500' : 'border-gray-200'
      }`}
      onClick={handleClick}
    >
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <div className="font-bold">{label}</div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onDelete();
        }}
        className="absolute top-0 right-0 text-red-500 hover:text-red-700 font-bold"
        style={{ fontSize: '16px' }}
      >
        &times;
      </button>
    </div>
  );
};

export default AgentNode;