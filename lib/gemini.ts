import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;

if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generate embeddings using Google Gemini's embedding-001 model
 * Returns a 768-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });

        const result = await model.embedContent(text);
        const embedding = result.embedding;

        if (!embedding || !embedding.values) {
            throw new Error('No embedding values returned from Gemini API');
        }

        return embedding.values;
    } catch (error: any) {
        console.error('Gemini embedding error:', error);

        // Handle rate limiting
        if (error?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        // Handle invalid API key
        if (error?.status === 403 || error?.status === 401) {
            throw new Error('Invalid Gemini API key');
        }

        throw new Error(`Failed to generate embedding: ${error?.message || 'Unknown error'}`);
    }
}

/**
 * Generate embeddings for multiple texts in batch
 * More efficient for processing large amounts of text
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchEmbeddings = await Promise.all(
            batch.map(text => generateEmbedding(text))
        );
        embeddings.push(...batchEmbeddings);

        // Add delay between batches to avoid rate limiting
        if (i + batchSize < texts.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return embeddings;
}

// Entity Extraction Types
export interface GraphEntity {
    name: string;
    type: string;
}

export interface GraphRelation {
    source: string;
    target: string;
    type: string;
}

export interface ExtractionResult {
    entities: GraphEntity[];
    relations: GraphRelation[];
}

/**
 * Extract entities and relationships from text using Gemini
 * using a structured prompt.
 */
export async function extractEntities(text: string): Promise<ExtractionResult> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
        You are an advanced Knowledge Graph extractor. Analyze the following text and extract:
        1. Entities (People, Projects, Topics, Organizations, Technologies, Locations).
        2. Relationships between these entities.

        Text: "${text}"

        Return JSON ONLY with this structure:
        {
          "entities": [
            {"name": "Entity Name", "type": "TYPE"}
          ],
          "relations": [
            {"source": "Entity Name 1", "target": "Entity Name 2", "type": "RELATION_TYPE"}
          ]
        }
        
        Keep types general: PERSON, PROJECT, TOPIC, ORG, TECH, LOCATION.
        Relation types should be screaming snake case: WORKS_ON, LOCATED_IN, RELATED_TO, USED_BY.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const textResponse = response.text();

        // Clean markdown code blocks if present
        const jsonStr = textResponse.replace(/^```json\n|\n```$/g, '').trim();

        return JSON.parse(jsonStr) as ExtractionResult;
    } catch (error) {
        console.error('Entity extraction error:', error);
        // Return empty result on failure to not block memory creation
        return { entities: [], relations: [] };
    }
}
