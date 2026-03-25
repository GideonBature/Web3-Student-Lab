import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export interface ProjectIdea {
  title: string;
  description: string;
  keyFeatures: string[];
  recommendedTech: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export class GeneratorService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateProjectIdea(
    theme: string,
    techStack: string[],
    difficulty: string
  ): Promise<ProjectIdea> {
    const prompt = `
      As an expert Web3 and Software Architect, generate a unique and innovative hackathon project idea.
      
      Theme: ${theme}
      Technology Stack: ${techStack.join(', ')}
      Target Difficulty: ${difficulty}
      
      Return the response in a structured JSON format with the following keys:
      - title: A catchy name for the project.
      - description: A detailed description of the project and its value proposition.
      - keyFeatures: An array of 3-5 core functionalities.
      - recommendedTech: An array of tools and libraries that would be useful.
      - difficulty: The suggested level (Beginner, Intermediate, or Advanced).
      
      Ensure the idea is practical for a 48-hour hackathon but still innovative.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates innovative hackathon project ideas in JSON format.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      return JSON.parse(content) as ProjectIdea;
    } catch (error) {
      console.error('Error generating project idea:', error);
      throw new Error('Failed to generate project idea');
    }
  }
}
