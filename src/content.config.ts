import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const creditSchema = z.object({
  name: z.string(),
  url: z.string().url().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  license: z.string().optional(),
  licenseUrl: z.string().url().optional(),
});

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  credit: creditSchema.optional(),
  objectPosition: z.string().optional(),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    language: z.string().default('en'),
    hero: imageSchema.optional(),
    legacySource: z.string().url().optional(),
    disclosure: z.string().optional(),
  }),
});

export const collections = { posts };
