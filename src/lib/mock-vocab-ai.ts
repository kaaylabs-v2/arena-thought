// Mock AI generation for vocabulary definitions and examples

const knownTerms: Record<string, { definition: string; example: string }> = {
  "backpropagation": {
    definition: "An algorithm used to train neural networks by calculating the gradient of the loss function with respect to each weight, propagating errors backward through the network layers.",
    example: "During training, backpropagation adjusts the weights of each neuron to minimize the difference between the predicted and actual output.",
  },
  "gradient descent": {
    definition: "An iterative optimization algorithm that adjusts parameters in the direction of steepest decrease of a loss function to find a local minimum.",
    example: "The model used gradient descent to iteratively reduce the prediction error over 1,000 epochs.",
  },
  "neural network": {
    definition: "A computational model inspired by biological neural networks, composed of interconnected layers of nodes (neurons) that process and transform input data.",
    example: "A neural network with three hidden layers was trained to classify handwritten digits with 98% accuracy.",
  },
  "epoch": {
    definition: "One complete pass through the entire training dataset during the learning process of a machine learning model.",
    example: "After 50 epochs of training, the model's validation accuracy plateaued at 94%.",
  },
  "overfitting": {
    definition: "A modeling error that occurs when a model learns the training data too well, including its noise, resulting in poor generalization to new unseen data.",
    example: "The model achieved 99% accuracy on training data but only 72% on the test set — a clear sign of overfitting.",
  },
  "hypothesis": {
    definition: "A proposed explanation or prediction that can be tested through experimentation or observation, forming the basis of scientific inquiry.",
    example: "The researcher's hypothesis that sleep duration correlates with academic performance was supported by the study's findings.",
  },
  "variable": {
    definition: "A measurable factor or quantity that can change or be changed in an experiment, used to test relationships and outcomes.",
    example: "In the experiment, temperature was the independent variable while reaction rate was the dependent variable.",
  },
  "photosynthesis": {
    definition: "The biological process by which green plants and certain organisms convert light energy, water, and carbon dioxide into glucose and oxygen.",
    example: "Photosynthesis occurs primarily in the chloroplasts of leaf cells, where chlorophyll absorbs sunlight to drive the reaction.",
  },
  "metaphor": {
    definition: "A figure of speech that directly compares two unlike things by stating one is the other, creating a symbolic or imaginative connection.",
    example: "In Shakespeare's 'All the world's a stage,' the world is compared to a stage to suggest that life is a performance.",
  },
  "algorithm": {
    definition: "A step-by-step procedure or set of rules for solving a problem or accomplishing a task, especially by a computer.",
    example: "The sorting algorithm arranged the dataset of 10,000 entries in ascending order within milliseconds.",
  },
};

function findBestMatch(term: string): { definition: string; example: string } | null {
  const lower = term.toLowerCase();
  for (const [key, value] of Object.entries(knownTerms)) {
    if (lower.includes(key) || key.includes(lower)) return value;
  }
  return null;
}

function generateFallback(term: string): { definition: string; example: string } {
  return {
    definition: `A concept or term referring to "${term}" within the context of this course material, denoting a specific principle, process, or classification relevant to the subject area.`,
    example: `The concept of ${term} was discussed in lecture as a foundational element for understanding the broader topic.`,
  };
}

export function mockGenerateDefinition(term: string): Promise<string> {
  return new Promise((resolve) => {
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const match = findBestMatch(term);
      resolve(match ? match.definition : generateFallback(term).definition);
    }, delay);
  });
}

export function mockGenerateExample(term: string): Promise<string> {
  return new Promise((resolve) => {
    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const match = findBestMatch(term);
      resolve(match ? match.example : generateFallback(term).example);
    }, delay);
  });
}
