import { Router, Request, Response } from 'express';
import { GeneratorService } from '../../generator/generator.service.js';

const router = Router();
const generatorService = new GeneratorService();

/**
 * @route   POST /api/generator/generate
 * @desc    Generate a new project idea using AI
 * @access  Public
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { theme, techStack, difficulty } = req.body;

    if (!theme || !techStack || !difficulty) {
      res.status(400).json({ error: 'Theme, techStack, and difficulty are required' });
      return;
    }

    const projectIdea = await generatorService.generateProjectIdea(
      theme,
      techStack,
      difficulty
    );

    res.json({ projectIdea });
  } catch (error) {
    console.error('Generator Route Error:', error);
    res.status(500).json({ error: 'Failed to generate project idea' });
  }
});

export default router;
