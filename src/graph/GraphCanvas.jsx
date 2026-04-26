import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ComponentNode } from './nodes';
import { useAppContext } from '../AppContext';

const nodeTypes = {
  rfComponent: ComponentNode
};

let id = 0;
const getId = () => `node_${id++}`;

export default function GraphCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const { setInspectedNodeId } = useAppContext();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNodeId = getId();
      const newNode = {
        id: newNodeId,
        type: 'rfComponent',
        position,
        data: { label: type, componentType: type, id: newNodeId },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeDoubleClick = useCallback((event, node) => {
    setInspectedNodeId(node.id);
  }, [setInspectedNodeId]);

  const onEdgeClick = useCallback((event, edge) => {
    setEdges(eds => eds.map(e => {
      if (e.id === edge.id) {
        const isProbed = !e.data?.isProbed;
        return { 
          ...e, 
          data: { ...e.data, isProbed },
          style: { ...e.style, stroke: isProbed ? '#f00' : 'var(--accent)', strokeWidth: isProbed ? 4 : 2 }
        };
      }
      return e;
    }));
  }, [setEdges]);

  const onNodesDelete = useCallback((deletedNodes) => {
    const deletedIds = deletedNodes.map(n => n.id);
    setInspectedNodeId(prev => deletedIds.includes(prev) ? null : prev);
  }, [setInspectedNodeId]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={onEdgeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
      >
        <Background color="var(--accent)" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
