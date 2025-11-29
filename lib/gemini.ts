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
