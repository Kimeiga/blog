---
layout: ../../layouts/PostLayout.astro
title: "Microservices API Gateway"
subtitle: "High-performance service mesh"
description: "A high-performance API gateway for managing microservices communication"
date: 2024-11-20
tech: "Go, Redis, PostgreSQL, Docker, Kubernetes"
color: "#8b5cf6"
---

## Overview

An API gateway built in Go to handle routing, authentication, rate limiting, and monitoring for a microservices architecture. Designed to handle 100,000+ requests per second with minimal latency.

## Problem Statement

The company was transitioning from a monolithic architecture to microservices and needed a robust gateway to:

- Route requests to appropriate services
- Handle authentication and authorization
- Implement rate limiting and throttling
- Provide request/response transformation
- Aggregate data from multiple services
- Monitor and log all traffic

## Architecture

### Core Components

1. **Router**: Intelligent request routing based on path, headers, and query parameters
2. **Auth Middleware**: JWT validation and API key management
3. **Rate Limiter**: Token bucket algorithm with Redis backend
4. **Circuit Breaker**: Prevent cascading failures
5. **Load Balancer**: Distribute traffic across service instances
6. **Metrics Collector**: Real-time performance monitoring

### Technology Choices

**Why Go?**
- Excellent concurrency support with goroutines
- Low memory footprint
- Fast compilation and execution
- Strong standard library for HTTP handling

**Why Redis?**
- In-memory performance for rate limiting
- Pub/sub for real-time updates
- Atomic operations for distributed counters

## Implementation Highlights

### Request Pipeline

```go
type Middleware func(http.Handler) http.Handler

func Chain(h http.Handler, middlewares ...Middleware) http.Handler {
    for i := len(middlewares) - 1; i >= 0; i-- {
        h = middlewares[i](h)
    }
    return h
}

// Usage
handler := Chain(
    serviceHandler,
    LoggingMiddleware,
    AuthMiddleware,
    RateLimitMiddleware,
    CircuitBreakerMiddleware,
)
```

### Rate Limiting

```go
type RateLimiter struct {
    redis  *redis.Client
    limit  int
    window time.Duration
}

func (rl *RateLimiter) Allow(key string) (bool, error) {
    now := time.Now().Unix()
    windowStart := now - int64(rl.window.Seconds())
    
    pipe := rl.redis.Pipeline()
    pipe.ZRemRangeByScore(ctx, key, "0", 
        strconv.FormatInt(windowStart, 10))
    pipe.ZCard(ctx, key)
    pipe.ZAdd(ctx, key, &redis.Z{
        Score:  float64(now),
        Member: now,
    })
    pipe.Expire(ctx, key, rl.window)
    
    results, err := pipe.Exec(ctx)
    if err != nil {
        return false, err
    }
    
    count := results[1].(*redis.IntCmd).Val()
    return count < int64(rl.limit), nil
}
```

### Circuit Breaker

```go
type CircuitBreaker struct {
    maxFailures  int
    timeout      time.Duration
    state        State
    failures     int
    lastFailTime time.Time
    mu           sync.RWMutex
}

func (cb *CircuitBreaker) Call(fn func() error) error {
    cb.mu.RLock()
    state := cb.state
    cb.mu.RUnlock()
    
    if state == StateOpen {
        if time.Since(cb.lastFailTime) > cb.timeout {
            cb.setState(StateHalfOpen)
        } else {
            return ErrCircuitOpen
        }
    }
    
    err := fn()
    
    if err != nil {
        cb.recordFailure()
        return err
    }
    
    cb.recordSuccess()
    return nil
}
```

## Performance Optimizations

1. **Connection Pooling**: Reuse HTTP connections to backend services
2. **Response Caching**: Cache frequently requested data
3. **Request Batching**: Combine multiple requests when possible
4. **Compression**: Gzip responses to reduce bandwidth
5. **Zero-Copy**: Minimize memory allocations in hot paths

## Monitoring & Observability

Integrated comprehensive monitoring:

- **Metrics**: Request rate, latency percentiles, error rates
- **Tracing**: Distributed tracing with OpenTelemetry
- **Logging**: Structured logging with correlation IDs
- **Alerting**: Automated alerts for anomalies

## Results

- **100,000+ RPS** sustained throughput
- **<5ms P99 latency** for routing decisions
- **99.99% uptime** over 12 months
- **60% reduction** in backend service load through caching
- **Zero downtime** deployments with rolling updates

## Deployment

Deployed on Kubernetes with:

- Horizontal Pod Autoscaling based on CPU and custom metrics
- Health checks and readiness probes
- Blue-green deployments for zero-downtime updates
- Multi-region deployment for high availability

## Challenges & Solutions

**Challenge**: Managing configuration for 50+ microservices
**Solution**: Dynamic configuration with etcd and hot-reloading

**Challenge**: Debugging distributed request flows
**Solution**: Implemented distributed tracing and correlation IDs

**Challenge**: Handling traffic spikes during peak hours
**Solution**: Auto-scaling with predictive scaling based on historical patterns

## Open Source Contributions

Several components were extracted and open-sourced:

- `go-ratelimit`: Redis-backed rate limiting library
- `circuit-breaker`: Circuit breaker implementation
- `http-middleware`: Collection of useful HTTP middlewares

## Conclusion

Building this API gateway was a challenging but rewarding project that taught me about distributed systems, performance optimization, and operational excellence at scale.

