// OpenAI API integration for AI-powered features
// Note: In a real application, API calls should be made from the server side

const MOCK_MODE = true; // Set to false to use real OpenAI API

// Function to generate job title suggestions based on skills and experience
export async function suggestJobTitles(skills: string[], experience: number): Promise<string[]> {
  // In mock mode, return hardcoded suggestions
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Sample job titles based on common skills
    const hasReact = skills.some(skill => 
      skill.toLowerCase().includes('react') || 
      skill.toLowerCase().includes('javascript') ||
      skill.toLowerCase().includes('frontend')
    );
    
    const hasPython = skills.some(skill => 
      skill.toLowerCase().includes('python') || 
      skill.toLowerCase().includes('data') ||
      skill.toLowerCase().includes('ml')
    );
    
    const hasDesign = skills.some(skill => 
      skill.toLowerCase().includes('design') || 
      skill.toLowerCase().includes('ux') ||
      skill.toLowerCase().includes('ui')
    );
    
    const titles = [];
    
    if (hasReact) {
      titles.push('Frontend Developer', 'React Developer');
      if (experience > 5) titles.push('Senior Frontend Engineer');
    }
    
    if (hasPython) {
      titles.push('Data Scientist', 'Python Developer');
      if (experience > 5) titles.push('Machine Learning Engineer');
    }
    
    if (hasDesign) {
      titles.push('UI/UX Designer', 'Product Designer');
      if (experience > 5) titles.push('Senior UX Designer');
    }
    
    // Default suggestions if no matches
    if (titles.length === 0) {
      return [
        'Software Engineer',
        'Full Stack Developer',
        'Product Manager',
        'Project Manager',
        'Business Analyst',
      ];
    }
    
    return titles;
  }
  
  // In production mode, this would call the OpenAI API
  try {
    // This is where you would make a real API call to OpenAI
    // const response = await fetch('https://api.openai.com/v1/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4',
    //     messages: [
    //       {
    //         role: 'system',
    //         content: 'You are a career advisor helping suggest job titles based on skills and experience.'
    //       },
    //       {
    //         role: 'user',
    //         content: `Based on these skills: ${skills.join(', ')} and ${experience} years of experience, suggest 5 job titles.`
    //       }
    //     ],
    //     max_tokens: 150
    //   }),
    // });
    
    // const data = await response.json();
    // const suggestions = data.choices[0].message.content
    //   .split('\n')
    //   .map((line: string) => line.replace(/^\d+\.\s+/, '').trim())
    //   .filter((line: string) => line);
    
    // return suggestions;
    
    // For now, return mock data
    return [
      'Software Engineer',
      'Full Stack Developer', 
      'Frontend Developer',
      'Backend Developer',
      'DevOps Engineer',
    ];
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return [
      'Software Engineer',
      'Developer',
      'Programmer',
      'IT Specialist',
      'Technical Consultant',
    ];
  }
}

// Function to generate job descriptions based on title and requirements
export async function generateJobDescription(title: string, requirements: string[]): Promise<string> {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    // Sample job descriptions based on title
    const descriptions: Record<string, string> = {
      'Software Engineer': `We are seeking a talented Software Engineer to join our development team. The ideal candidate will have strong experience in building robust applications and a passion for clean, maintainable code.

Responsibilities:
- Design and implement new features and functionality
- Write clean, efficient, and well-documented code
- Troubleshoot, debug and upgrade existing systems
- Collaborate with cross-functional teams
- Stay up-to-date with emerging technologies

Requirements:
- Strong proficiency in at least one programming language
- Experience with databases and data structures
- Knowledge of software engineering best practices
- Problem-solving aptitude
- Ability to work in a team environment`,
      
      'Data Scientist': `We're looking for a Data Scientist to help transform our data into insights and products. The ideal candidate has strong statistical analysis skills and can effectively communicate findings to non-technical stakeholders.

Responsibilities:
- Develop and implement data models and algorithms
- Analyze large datasets to identify patterns and trends
- Create data visualizations and reports
- Collaborate with engineering and product teams
- Stay current with industry developments

Requirements:
- Experience with statistical analysis and machine learning
- Proficiency in Python, R, or similar tools
- Knowledge of SQL and data manipulation
- Strong analytical and critical thinking skills
- Excellent communication abilities`,
      
      'UX Designer': `We are seeking a UX Designer who is passionate about creating intuitive user experiences. The ideal candidate will combine research insights with design thinking to create products that delight our users.

Responsibilities:
- Conduct user research and usability testing
- Create wireframes, prototypes, and high-fidelity designs
- Collaborate with product managers and developers
- Iterate designs based on user feedback
- Stay current with UX best practices and trends

Requirements:
- Experience with user-centered design methodologies
- Proficiency in design tools (Figma, Sketch, etc.)
- Strong portfolio demonstrating UX process
- Excellent communication and collaboration skills
- Ability to solve complex design problems`,
    };
    
    // Return matching description or default
    return descriptions[title] || 
      `We are seeking a talented ${title} to join our team. The ideal candidate will have relevant experience and a passion for excellence in their field.

Responsibilities:
- Contribute to team objectives and projects
- Apply specialized knowledge to solve problems
- Collaborate with team members across departments
- Stay current with industry developments
- Maintain high standards of quality in all work

Requirements:
- Experience in ${title.toLowerCase()} role or related field
- Strong technical skills relevant to the position
- Excellent communication and teamwork abilities
- Problem-solving aptitude
- Desire to learn and grow professionally`;
  }
  
  // In production mode, this would call the OpenAI API
  try {
    // This would be a real API call in production
    // For now, return mock data
    return `We are seeking a talented ${title} to join our team...`;
  } catch (error) {
    console.error('Error generating job description:', error);
    return `Job description for ${title}`;
  }
}
