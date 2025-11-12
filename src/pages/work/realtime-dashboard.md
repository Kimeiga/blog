---
layout: ../../layouts/PostLayout.astro
title: "Real-time Analytics Dashboard"
subtitle: "WebSocket-powered data visualization"
description: "A high-performance dashboard for visualizing real-time data streams"
date: 2024-12-15
tech: "React, WebSockets, D3.js, Redis, Node.js"
color: "#10b981"
---

## Overview

A real-time analytics dashboard built for a SaaS platform that processes millions of events per day. The dashboard provides live insights into user behavior, system performance, and business metrics with sub-second latency.

## Challenge

The client needed a way to visualize streaming data from multiple sources in real-time, with the ability to:

- Handle 10,000+ events per second
- Display data with minimal latency (<500ms)
- Support multiple concurrent users
- Provide interactive data exploration
- Scale horizontally as data volume grows

## Solution

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Clients   │────▶│  WebSocket   │────▶│   Redis     │
│  (React)    │◀────│   Server     │◀────│  Pub/Sub    │
└─────────────┘     └──────────────┘     └─────────────┘
                            │                     ▲
                            │                     │
                            ▼                     │
                    ┌──────────────┐     ┌─────────────┐
                    │  Processing  │────▶│   Event     │
                    │   Workers    │     │  Streams    │
                    └──────────────┘     └─────────────┘
```

### Key Technologies

**Frontend:**
- React with hooks for state management
- D3.js for custom visualizations
- WebSocket client for real-time updates
- Web Workers for heavy computations

**Backend:**
- Node.js WebSocket server
- Redis for pub/sub and caching
- Event stream processing with Apache Kafka
- PostgreSQL for historical data

### Performance Optimizations

1. **Data Aggregation**: Pre-aggregate data on the server to reduce payload size
2. **Throttling**: Limit update frequency to 60fps for smooth animations
3. **Virtual Scrolling**: Render only visible data points in large datasets
4. **Memoization**: Cache expensive calculations using React.memo
5. **Connection Pooling**: Reuse WebSocket connections efficiently

## Code Highlights

### Real-time Data Hook

```typescript
function useRealtimeData(channel: string) {
  const [data, setData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ 
        action: 'subscribe', 
        channel 
      }));
    };
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(prev => [...prev.slice(-1000), newData]);
    };
    
    return () => ws.close();
  }, [channel]);
  
  return data;
}
```

### Optimized Chart Component

```typescript
const Chart = memo(({ data }: ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const line = d3.line()
      .x(d => xScale(d.timestamp))
      .y(d => yScale(d.value));
    
    svg.selectAll('path')
      .data([data])
      .join('path')
      .attr('d', line)
      .attr('stroke', 'steelblue');
  }, [data]);
  
  return <svg ref={svgRef} />;
});
```

## Results

- **99.9% uptime** over 6 months in production
- **<200ms latency** from event to visualization
- **500+ concurrent users** supported
- **50% reduction** in time to insight for business teams
- **Zero data loss** during peak traffic

## Impact

The dashboard became a critical tool for the client's operations team, enabling them to:

- Detect and respond to issues in real-time
- Make data-driven decisions faster
- Identify trends and patterns as they emerge
- Improve overall system reliability

## Lessons Learned

- WebSocket connection management at scale requires careful planning
- Client-side performance is just as important as server-side
- Real-time doesn't always mean instant—smart throttling improves UX
- Monitoring and observability are crucial for real-time systems
- User feedback is essential for designing effective visualizations

