-- Job Listing Platform Database Schema
-- Based on the normalized 3NF design from the documentation

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table - stores reusable company master data
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    website VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    address VARCHAR(255),
    niche VARCHAR(50),
    benefits JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table - core job listings with essential attributes
CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    employment_type VARCHAR(20) CHECK (employment_type IN ('full-time', 'part-time', 'contract')),
    recruit_type VARCHAR(10) CHECK (recruit_type IN ('campus', 'social')),
    posted_date TIMESTAMPTZ DEFAULT NOW(),
    location VARCHAR(100),
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job attributes table - stores variable/optional job metadata
CREATE TABLE job_attributes (
    job_id INTEGER PRIMARY KEY REFERENCES jobs(job_id) ON DELETE CASCADE,
    hiring_manager VARCHAR(100),
    skill_tags VARCHAR(50)[],
    additional_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance optimization
-- Jobs table indexes
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_salary_min ON jobs(salary_min);
CREATE INDEX idx_jobs_salary_max ON jobs(salary_max);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_recruit_type ON jobs(recruit_type);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);

-- Companies table indexes
CREATE INDEX idx_companies_niche ON companies(niche);
CREATE INDEX idx_companies_benefits ON companies USING GIN(benefits);

-- Job attributes indexes
CREATE INDEX idx_job_attributes_skills ON job_attributes USING GIN(skill_tags);

-- Create triggers for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_attributes_updated_at BEFORE UPDATE ON job_attributes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample companies
INSERT INTO companies (name, website, logo_url, description, address, niche, benefits) VALUES
('TechCorp Inc.', 'https://techcorp.com', '/api/placeholder/48/48', 'Leading technology solutions provider specializing in enterprise software', 'San Francisco, CA', 'Enterprise Software', '["Health Insurance", "401k Match", "Remote Work"]'),
('DesignTech', 'https://designtech.com', '/api/placeholder/48/48', 'Creative design studio focused on user experience and product design', 'Remote', 'Design & UX', '["Health Insurance", "Flexible Hours", "Learning Budget"]'),
('AI Solutions', 'https://aisolutions.com', '/api/placeholder/48/48', 'Artificial intelligence and machine learning research company', 'New York, NY', 'AI/ML', '["Health Insurance", "Stock Options", "Conference Budget"]'),
('StartupXYZ', 'https://startupxyz.com', '/api/placeholder/48/48', 'Fast-growing startup building the next generation of mobile apps', 'Austin, TX', 'Mobile Development', '["Health Insurance", "Stock Options", "Flexible Hours"]'),
('CloudTech', 'https://cloudtech.com', '/api/placeholder/48/48', 'Cloud infrastructure and DevOps solutions provider', 'Seattle, WA', 'Cloud Computing', '["Health Insurance", "Remote Work", "401k Match"]'),
('AppStudio', 'https://appstudio.com', '/api/placeholder/48/48', 'Mobile app development agency serving clients worldwide', 'Los Angeles, CA', 'Mobile Development', '["Flexible Hours", "Project Bonuses"]'),
('DataFlow Inc', 'https://dataflow.com', '/api/placeholder/48/48', 'Big data processing and analytics platform', 'Remote', 'Data Analytics', '["Remote Work", "Learning Budget", "Health Insurance"]'),
('TestLab', 'https://testlab.com', '/api/placeholder/48/48', 'Quality assurance and software testing services', 'Chicago, IL', 'QA/Testing', '["Health Insurance", "Professional Development"]');

-- Insert sample jobs
INSERT INTO jobs (title, description, requirements, salary_min, salary_max, employment_type, recruit_type, location, company_id) VALUES
('Senior Frontend Developer', 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.', '5+ years React experience, TypeScript proficiency, Experience with Next.js', 120000, 180000, 'full-time', 'social', 'San Francisco, CA', 1),
('Product Designer', 'Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and engineers to design and prototype new features.', '3+ years product design experience, Figma proficiency, User research experience', 90000, 130000, 'full-time', 'social', 'Remote', 2),
('Data Scientist', 'We are seeking a Data Scientist to help us build ML models and analyze large datasets to drive business insights and product improvements.', 'PhD in Computer Science or related field, Python/R proficiency, ML experience', 140000, 200000, 'full-time', 'social', 'New York, NY', 3),
('Junior Full Stack Developer', 'Great opportunity for a junior developer to grow their skills in a fast-paced startup environment. You will work on both frontend and backend development.', '1+ years development experience, JavaScript proficiency, Interest in full stack development', 70000, 95000, 'full-time', 'campus', 'Austin, TX', 4),
('DevOps Engineer', 'Join our infrastructure team to build scalable cloud solutions and automate deployment processes.', '3+ years DevOps experience, AWS/Azure knowledge, Docker & Kubernetes', 110000, 160000, 'full-time', 'social', 'Seattle, WA', 5),
('Mobile App Developer', 'Develop cross-platform mobile applications using React Native and Flutter.', 'React Native experience, Mobile development skills, UI/UX understanding', 80000, 120000, 'contract', 'social', 'Los Angeles, CA', 6),
('Backend Developer', 'Build robust APIs and microservices to power our data processing platform.', 'Python/Java proficiency, Database design, API development', 95000, 135000, 'full-time', 'social', 'Remote', 7),
('QA Engineer', 'Design and execute comprehensive testing strategies for web and mobile applications.', 'Testing methodologies, Automation tools, Bug tracking', 75000, 105000, 'full-time', 'social', 'Chicago, IL', 8);

-- Insert sample job attributes
INSERT INTO job_attributes (job_id, hiring_manager, skill_tags, additional_info) VALUES
(1, 'Jane Chen, Engineering Lead', '{"React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Jest"}', 'Relocation support available'),
(2, 'Mike Rodriguez, Design Director', '{"Figma", "Sketch", "Prototyping", "User Research", "Design Systems"}', 'Portfolio review required'),
(3, 'Dr. Sarah Kim, Head of AI', '{"Python", "R", "TensorFlow", "SQL", "Statistics", "Machine Learning"}', 'PhD preferred but not required'),
(4, 'Alex Johnson, CTO', '{"JavaScript", "Node.js", "React", "MongoDB", "Express.js"}', 'Great mentorship opportunities'),
(5, 'David Park, Infrastructure Lead', '{"AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"}', 'On-call rotation required'),
(6, 'Lisa Wong, Project Manager', '{"React Native", "Flutter", "JavaScript", "Mobile UI"}', 'Contract-to-hire opportunity'),
(7, 'Tom Wilson, Backend Lead', '{"Python", "Java", "PostgreSQL", "REST APIs", "Microservices"}', 'Remote-first company'),
(8, 'Emma Davis, QA Manager', '{"Selenium", "Jest", "Cypress", "Manual Testing", "Automation"}', 'ISTQB certification a plus');