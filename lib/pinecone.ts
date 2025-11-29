import { Pinecone } from '@pinecone-database/pinecone';
import type { VectorMetadata } from '@/types';

const apiKey = process.env.PINECONE_API_KEY!;
const indexName = process.env.PINECONE_INDEX!;

if (!apiKey || !indexName) {
    throw new Error('Missing Pinecone environment variables');
}

const pinecone = new Pinecone({ apiKey });
const index = pinecone.index(indexName);

export const vectorStore = {
    async upsert(id: string, values: number[], metadata: VectorMetadata) {
        try {
            await index.upsert([
                {
                    id,
                    values,
                    metadata: metadata as Record<string, any>,
                },
            ]);
            return id;
        } catch (error) {
            console.error('Pinecone upsert error:', error);
            throw new Error('Failed to store vector');
        }
    },

    async query(
        queryVector: number[],
        filter: { userId: string; projectId?: string },
        topK = 10
    ) {
        try {
            const filterObj: Record<string, any> = { userId: filter.userId };
            if (filter.projectId) {
                filterObj.projectId = filter.projectId;
            }

            const results = await index.query({
                vector: queryVector,
                topK,
                filter: filterObj,
                includeMetadata: true,
            });

            return results.matches || [];
        } catch (error) {
            console.error('Pinecone query error:', error);
            throw new Error('Failed to search vectors');
        }
    },

    async delete(id: string) {
        try {
            await index.deleteOne(id);
        } catch (error) {
            console.error('Pinecone delete error:', error);
            throw new Error('Failed to delete vector');
        }
    },

    async deleteBatch(ids: string[]) {
        try {
            await index.deleteMany(ids);
        } catch (error) {
            console.error('Pinecone batch delete error:', error);
            throw new Error('Failed to delete vectors');
        }
    },
};
