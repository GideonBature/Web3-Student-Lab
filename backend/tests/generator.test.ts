import request from 'supertest';
import { jest } from '@jest/globals';

// Mock OpenAI
jest.unstable_mockModule('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          // @ts-ignore
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    title: 'Test Project',
                    description: 'A test project description',
                    keyFeatures: ['Feature 1', 'Feature 2'],
                    recommendedTech: ['Node.js', 'React'],
                    difficulty: 'Intermediate'
                  })
                }
              }
            ]
          })
        }
      }
    }))
  };
});

describe('Generator API Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    // Dynamic import to ensure mock is registered first
    const module = await import('../src/index.js');
    app = module.app;
  });

  describe('POST /api/generator/generate', () => {
    it('should generate a project idea with valid input', async () => {
      const response = await request(app)
        .post('/api/generator/generate')
        .send({
          theme: 'Environment',
          techStack: ['React', 'Solidity'],
          difficulty: 'Intermediate'
        })
        .expect(200);

      expect(response.body).toHaveProperty('projectIdea');
      expect(response.body.projectIdea).toHaveProperty('title', 'Test Project');
      expect(response.body.projectIdea).toHaveProperty('description');
      expect(Array.isArray(response.body.projectIdea.keyFeatures)).toBe(true);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/generator/generate')
        .send({
          theme: 'Environment'
          // missing techStack and difficulty
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
