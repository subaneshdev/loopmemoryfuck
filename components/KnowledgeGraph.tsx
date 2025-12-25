'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ForceGraph2D with no SSR to avoid window not found errors
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => <div className="p-4 text-center text-zinc-500">Loading Graph...</div>
});

const GraphView = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        // Update dimensions on mount and resize
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: 600 // Fixed height for now
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        // Fetch Data
        const fetchData = async () => {
            try {
                const res = await fetch('/api/graph');
                const json = await res.json();
                if (json.success) {
                    setGraphData(json.graph);
                }
            } catch (error) {
                console.error('Failed to load graph data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const getNodeColor = (node: any) => {
        switch (node.type) {
            case 'PERSON': return '#4ade80'; // Green
            case 'PROJECT': return '#f472b6'; // Pink
            case 'ORG': return '#60a5fa'; // Blue
            case 'TOPIC': return '#fbbf24'; // Amber
            default: return '#9ca3af'; // Gray
        }
    };

    if (loading) return <div className="animate-pulse h-64 bg-zinc-900 rounded-xl"></div>;

    return (
        <div ref={containerRef} className="w-full h-[600px] border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 relative">
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-zinc-400">
                Knowledge Graph
            </div>
            {graphData.nodes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-500">
                    No graph data found. Add memories to generate the knowledge graph.
                </div>
            ) : (
                <ForceGraph2D
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeColor={getNodeColor}
                    nodeRelSize={6}
                    linkColor={() => '#3f3f46'} // zinc-700
                    backgroundColor="#09090b" // zinc-950
                />
            )}
        </div>
    );
};

export default GraphView;
