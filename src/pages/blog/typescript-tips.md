---
layout: ../../layouts/PostLayout.astro
title: "TypeScript Tips for Better Code Quality"
subtitle: "Advanced patterns and techniques"
description: "Advanced TypeScript patterns and techniques to write more maintainable code"
date: 2025-01-10
author: "Jane Developer"
color: "#06b6d4"
---

TypeScript has become an essential tool in modern JavaScript development. Here are some advanced tips that have helped me write better, more maintainable code.

## Use Discriminated Unions

Discriminated unions are powerful for modeling state:

```typescript
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };

function handleState(state: LoadingState) {
  switch (state.status) {
    case 'idle':
      return 'Not started';
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data; // TypeScript knows data exists
    case 'error':
      return state.error; // TypeScript knows error exists
  }
}
```

## Leverage Template Literal Types

Template literal types enable powerful string manipulation at the type level:

```typescript
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// Result: 'onClick' | 'onFocus' | 'onBlur'
```

## Use `satisfies` for Better Type Inference

The `satisfies` operator (TypeScript 4.9+) provides type checking without widening:

```typescript
const config = {
  endpoint: '/api/users',
  timeout: 5000,
  retries: 3
} satisfies Config;

// config.endpoint is still string literal '/api/users'
// not widened to string
```

## Const Assertions for Immutability

Use `as const` to create deeply readonly types:

```typescript
const routes = {
  home: '/',
  about: '/about',
  blog: '/blog'
} as const;

type Route = typeof routes[keyof typeof routes];
// Route = '/' | '/about' | '/blog'
```

## Generic Constraints

Use generic constraints to create flexible, type-safe functions:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Jane', age: 30 };
const name = getProperty(user, 'name'); // string
const age = getProperty(user, 'age');   // number
```

## Conclusion

These TypeScript patterns have significantly improved my code quality and developer experience. Start incorporating them into your projects and see the difference!

