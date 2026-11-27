import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: file('src/data/products.json'),
  schema: z.object({
    id: z.string(),
    family: z.enum(['lavas', 'tortilla']),
    variant: z.string(),
    name: z.string(),
    price: z.number(),
    tint: z.string(),
    pack: z.string(),
    cut: z.string(),
    description: z.string(),
  }),
});

const recipes = defineCollection({
  loader: file('src/data/recipes.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    category: z.enum(['Kahvaltı', 'Öğle', 'Akşam', 'Atıştırmalık']),
    minutes: z.number(),
    servings: z.number(),
    product: z.string(),
    image: z.string(),
    cut: z.boolean().optional(),
    bg: z.string(),
    intro: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
  }),
});

const rehber = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/rehber' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    readMinutes: z.number(),
    image: z.string(),
    bg: z.string(),
    date: z.coerce.date(),
    product: z.string(),
    order: z.number(),
  }),
});

const yasal = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/yasal' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    updated: z.string(),
    path: z.string(),
    order: z.number(),
  }),
});

export const collections = { products, recipes, rehber, yasal };
