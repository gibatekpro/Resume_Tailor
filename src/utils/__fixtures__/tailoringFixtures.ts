import type {ResumeInfo} from "../../models/ResumeInfo";
import type {JobAnalysis, Rewrite} from "../../models/TailoringPipeline";

// Fixtures for the pipeline tests. No live model calls are made.
// The CV is rebuilt from the facts in the reported run (the Cenitium bullets are as reported; the rest is filler in the
// same style). Replace it with the real CV text when convenient: the tests only rely on the facts named in them.
// The model responses are hand-written in the shape the API returns: the Lead job's first rewrite reproduces every
// failure from the real run, so the tests prove the checks catch them and the repair fixes them.

export const CV: ResumeInfo = {
    resumeName: "Main CV",
    profile: {
        firstName: "Tony",
        lastName: "Sample",
        profession: "Software Developer",
        summary: "Full-stack developer with four years' experience building React and .NET applications for finance clients.",
    },
    skills: ["C#", ".NET Core", "ASP.NET Core", "React", "TypeScript", "SQL Server", "Entity Framework Core", "Azure", "Git", "GitHub", "Jira"],
    workExperience: [
        {
            companyName: "Cenitium",
            jobTitle: "Software Developer",
            startMonth: "Sep", startYear: "2021", endMonth: "", endYear: "", current: true,
            duties: [
                "Promoted from intern to full-time developer after the first year, then led a team of 3 developers, splitting and tracking work in Jira and GitHub.",
                "Build and maintain full-stack React and .NET features for client finance applications.",
                "Modernised the price-list management tool, moving it from Excel spreadsheets to a React and .NET web app used by the sales team.",
                "Automated invoice checking: each incoming invoice is read and matched against its purchase order in C#, cutting manual checks from 2 days to 2 hours a month.",
                "Mentored 3 placement-year students in full-stack development with React and .NET.",
                "Deployed applications to Azure App Service and managed SQL Server databases.",
            ],
        },
        {
            companyName: "Ametek Taylor Hobson",
            jobTitle: "Software Engineering Intern",
            startMonth: "Jun", startYear: "2020", endMonth: "Aug", endYear: "2020", current: false,
            duties: [
                "Wrote automated tests in C# for metrology instrument software.",
                "Fixed bugs in a WPF desktop application used by calibration engineers.",
            ],
        },
    ],
    projects: [
        {
            projectName: "Resume Tailor",
            role: "Personal project",
            startMonth: "Jan", startYear: "2024", endMonth: "", endYear: "", current: true,
            projectDetails: [
                "Built a React and TypeScript web app that tailors CVs to job adverts with the OpenAI API.",
                "Stored users' CVs and applications in Firebase Firestore.",
            ],
        },
    ],
    education: [{
        institutionName: "University of Leicester", degree: "BSc", course: "Computer Science",
        startMonth: "Sep", startYear: "2017", endMonth: "Jun", endYear: "2021", current: false, class: "Second Class Honours",
    }],
    languages: [{name: "English", proficiency: "Native"}],
};

export const RULES = [
    "Write up to 5 bullet points for each work experience role.",
    "Use British English spelling.",
    "Keep the whole CV to two pages: keep each bullet under 30 words.",
];

// ---------------------------------------------------------------- Lead Software Engineer (lead, a stretch)

export const LEAD_JOB = `Lead Software Engineer C# .NET – FinTech

We're a fast-growing FinTech building payment and lending platforms used by millions of customers. We're looking for a
Lead Software Engineer to provide technical leadership to a team of around 10 engineers and own the design of our core
backend services.

What you'll do
- Lead, mentor and grow a team of engineers, setting technical direction and standards.
- Design and build C# .NET Core backend services for large, scalable systems.
- Shape our event-driven architecture.
- Improve our CI/CD pipelines and infrastructure as code on Azure.

What you'll need
- Proven technical leadership of an engineering team.
- Strong C# and .NET Core backend development.
- Experience building large-scale, scalable systems.
- Event-driven architecture (e.g. Azure Service Bus, Kafka).
- CI/CD pipelines.
- Infrastructure as code (Terraform or Bicep).
- Microsoft Azure.
- Strong grasp of OOP, data structures, design patterns and algorithms.
- A degree in a STEM subject.

Nice to have
- Experience in FinTech or financial services.`;

export const LEAD_ANALYSIS: JobAnalysis = {
    job: {
        title: "Lead Software Engineer C# .NET",
        company: "",
        location: "",
        salary: "",
        summary: "Lead a team of around 10 engineers building C# .NET Core backend services for a FinTech's payment and lending platforms. The role sets technical direction and owns the design of event-driven systems on Azure.",
    },
    seniority: "lead",
    themes: [
        {name: "Technical leadership", jobPhrases: ["technical leadership", "Lead, mentor and grow a team of engineers"]},
        {name: "C# .NET Core backend", jobPhrases: ["C# .NET Core backend services", "Strong C# and .NET Core backend development"]},
        {name: "Scalable, event-driven systems", jobPhrases: ["large, scalable systems", "event-driven architecture"]},
        {name: "Delivery on Azure", jobPhrases: ["CI/CD pipelines", "infrastructure as code on Azure"]},
    ],
    requirements: [
        {
            id: "R1", text: "Technical leadership of an engineering team", priority: "must", category: "leadership",
            evidence: [
                {quote: "led a team of 3 developers, splitting and tracking work in Jira and GitHub", strength: "partial"},
                {quote: "Mentored 3 placement-year students in full-stack development", strength: "partial"},
            ],
            ifMissing: {kind: "real", text: "The role leads around 10 engineers; your CV shows leading a team of 3."},
        },
        {
            id: "R2", text: "C# and .NET Core backend development", priority: "must", category: "technical",
            evidence: [
                {quote: "each incoming invoice is read and matched against its purchase order in C#", strength: "strong"},
                {quote: ".NET Core", strength: "strong"},
            ],
            ifMissing: {kind: "ask", text: ""},
        },
        {
            id: "R3", text: "Large-scale, scalable systems", priority: "must", category: "technical",
            evidence: [{quote: "Build and maintain full-stack React and .NET features for client finance applications", strength: "partial"}],
            ifMissing: {kind: "real", text: "The role builds systems used by millions; your CV doesn't say how many users your systems serve."},
        },
        {
            id: "R4", text: "Event-driven architecture", priority: "must", category: "technical",
            // Not in the CV: the pipeline must throw this quote away.
            evidence: [{quote: "Built event-driven invoice processing on Azure", strength: "strong"}],
            ifMissing: {kind: "ask", text: "Have you built systems that react to events or messages, e.g. with Azure Service Bus or Kafka?"},
        },
        {
            id: "R5", text: "CI/CD pipelines", priority: "must", category: "technical", evidence: [],
            ifMissing: {kind: "ask", text: "Have you used CI/CD pipelines? Which tool, e.g. GitHub Actions or Azure DevOps?"},
        },
        {
            id: "R6", text: "Infrastructure as code (Terraform or Bicep)", priority: "must", category: "technical", evidence: [],
            ifMissing: {kind: "ask", text: "Have you defined infrastructure in code, e.g. with Terraform, Bicep or ARM templates?"},
        },
        {
            id: "R7", text: "Microsoft Azure", priority: "must", category: "technical",
            evidence: [{quote: "Deployed applications to Azure App Service", strength: "strong"}],
            ifMissing: {kind: "ask", text: ""},
        },
        {
            id: "R8", text: "OOP, data structures, design patterns and algorithms", priority: "must", category: "technical",
            evidence: [{quote: "Computer Science", strength: "partial"}],
            ifMissing: {kind: "ask", text: ""},
        },
        {
            id: "R9", text: "A degree in a STEM subject", priority: "must", category: "education",
            evidence: [{quote: "Computer Science", strength: "strong"}],
            ifMissing: {kind: "real", text: ""},
        },
        {
            id: "R10", text: "Experience in FinTech or financial services", priority: "nice", category: "domain",
            evidence: [{quote: "client finance applications", strength: "partial"}],
            ifMissing: {kind: "real", text: ""},
        },
    ],
    fitStrength: "Four years of C# and .NET work for finance clients, deployed to Azure.",
    fitConcern: "Lead role managing ~10 engineers; your leadership evidence is a team of 3.",
};

const unchangedAmetek = {
    index: 1,
    bullets: [
        {text: "Wrote automated tests in C# for metrology instrument software.", from: [0], why: ""},
        {text: "Fixed bugs in a WPF desktop application used by calibration engineers.", from: [1], why: ""},
    ],
};

const unchangedProject = {
    index: 0,
    bullets: [
        {text: "Built a React and TypeScript web app that tailors CVs to job adverts with the OpenAI API.", from: [0], why: ""},
        {text: "Stored users' CVs and applications in Firebase Firestore.", from: [1], why: ""},
    ],
};

// The first rewrite, reproducing the reported run: promotion dropped, leadership not first and missing from the summary,
// a duplicate pair, an invented nominalisation, completed work in the present tense, plus a claimed technology and a buzzword.
export const LEAD_FIRST_REWRITE: Rewrite = {
    summary: "Full-stack developer with four years' experience building React and .NET applications for finance clients, with a focus on efficient delivery.",
    roles: [
        {
            index: 0,
            bullets: [
                {text: "Built and maintained React and .NET application features for client finance applications.", from: [1], why: "C# .NET backend (must)"},
                {text: "Led a team of 3 developers while building full-stack React and .NET features, including finance applications for clients.", from: [0, 1], why: "Technical leadership (must)"},
                {text: "Modernise the price-list management tool, moving it from Excel spreadsheets to a React and .NET web app used by the sales team.", from: [2], why: ""},
                {text: "Automate invoice checking with event-driven processing: each incoming invoice is read and matched against its purchase order in C#, cutting manual checks from 2 days to 2 hours a month.", from: [3], why: "Event-driven architecture (must)"},
                {text: "Deliver full-stack mentoring for 3 placement-year students.", from: [4], why: "Mentoring (must)"},
            ],
        },
        unchangedAmetek,
    ],
    projects: [unchangedProject],
    projectOrder: [0],
    skills: ["C#", ".NET Core", "Azure", "ASP.NET Core", "SQL Server", "Entity Framework Core", "React", "TypeScript", "Git", "GitHub", "Jira"],
    addedSkills: [{skill: "Event-driven architecture", evidence: "Built event-driven invoice processing"}],
    droppedPoints: [],
    improvements: [{section: "Cenitium", issue: "No numbers on the scale of the finance applications.", suggestion: "How many clients or users use them?"}],
};

// The repair: every reported failure fixed.
export const LEAD_REPAIRED_REWRITE: Rewrite = {
    summary: "Full-stack developer, promoted from intern to full-time developer, who led a team of 3 developers and mentored 3 placement-year students. Builds C# and .NET Core services and React front ends for finance clients, deployed to Azure.",
    roles: [
        {
            index: 0,
            bullets: [
                {text: "Promoted from intern to full-time developer after the first year, then led a team of 3 developers, splitting and tracking work in Jira and GitHub.", from: [0], why: "Leadership first for 'Technical leadership' (must)"},
                {text: "Mentored 3 placement-year students in full-stack development with React and .NET.", from: [4], why: "Moved up: mentoring evidence for 'Technical leadership' (must)"},
                {text: "Build and maintain full-stack React and .NET features for client finance applications, deployed to Azure App Service with SQL Server databases.", from: [1, 5], why: "Merged: .NET backend and Azure (must)"},
                {text: "Automated invoice checking in C#: each incoming invoice is read and matched against its purchase order, cutting manual checks from 2 days to 2 hours a month.", from: [3], why: "Leads with C# for 'C# and .NET Core backend development' (must)"},
                {text: "Modernised the price-list management tool, moving it from Excel spreadsheets to a React and .NET web app used by the sales team.", from: [2], why: ""},
            ],
        },
        unchangedAmetek,
    ],
    projects: [unchangedProject],
    projectOrder: [0],
    skills: ["C#", ".NET Core", "Azure", "ASP.NET Core", "SQL Server", "Entity Framework Core", "React", "TypeScript", "Git", "GitHub", "Jira"],
    addedSkills: [],
    droppedPoints: [],
    improvements: [{section: "Cenitium", issue: "No numbers on the scale of the finance applications.", suggestion: "How many clients or users use them?"}],
};

// ---------------------------------------------------------------- .NET Developer (mid, a strong fit)

export const DOTNET_JOB = `.NET Developer

Join our product team building web applications for financial services clients. You'll work across the stack, mostly
in C# and .NET Core, with React on the front end.

Requirements
- Commercial experience with C# and .NET Core.
- React and TypeScript.
- SQL Server and Entity Framework Core.
- Experience deploying to Azure.
- Git for version control.
- Writing automated tests.

Nice to have
- Agile / Scrum experience.`;

export const DOTNET_ANALYSIS: JobAnalysis = {
    job: {
        title: ".NET Developer",
        company: "",
        location: "",
        salary: "",
        summary: "Full-stack developer role building web applications for financial services clients, mostly in C# and .NET Core with React.",
    },
    seniority: "mid",
    themes: [
        {name: "C# and .NET Core", jobPhrases: ["C# and .NET Core"]},
        {name: "React front end", jobPhrases: ["React on the front end", "React and TypeScript"]},
        {name: "Data and Azure", jobPhrases: ["SQL Server and Entity Framework Core", "deploying to Azure"]},
    ],
    requirements: [
        {id: "R1", text: "C# and .NET Core", priority: "must", category: "technical", evidence: [{quote: ".NET Core", strength: "strong"}, {quote: "matched against its purchase order in C#", strength: "strong"}], ifMissing: {kind: "ask", text: ""}},
        {id: "R2", text: "React and TypeScript", priority: "must", category: "technical", evidence: [{quote: "Built a React and TypeScript web app", strength: "strong"}], ifMissing: {kind: "ask", text: ""}},
        {id: "R3", text: "SQL Server and Entity Framework Core", priority: "must", category: "technical", evidence: [{quote: "SQL Server", strength: "strong"}, {quote: "Entity Framework Core", strength: "strong"}], ifMissing: {kind: "ask", text: ""}},
        {id: "R4", text: "Deploying to Azure", priority: "must", category: "technical", evidence: [{quote: "Deployed applications to Azure App Service", strength: "strong"}], ifMissing: {kind: "ask", text: ""}},
        {id: "R5", text: "Git", priority: "must", category: "technical", evidence: [{quote: "Git", strength: "strong"}], ifMissing: {kind: "ask", text: ""}},
        {id: "R6", text: "Writing automated tests", priority: "must", category: "technical", evidence: [{quote: "Wrote automated tests in C#", strength: "partial"}], ifMissing: {kind: "ask", text: ""}},
        {id: "R7", text: "Agile / Scrum", priority: "nice", category: "other", evidence: [], ifMissing: {kind: "ask", text: "Have you worked in Agile or Scrum teams, e.g. with sprints and stand-ups?"}},
    ],
    fitStrength: "Four years of C#, .NET Core and React work for finance clients, deployed to Azure with SQL Server.",
    fitConcern: "",
};

// A good first rewrite (no repair needed). The mentoring point is the least relevant here and is reported as dropped.
export const DOTNET_REWRITE: Rewrite = {
    summary: "Full-stack developer with four years' experience building C# and .NET Core services and React front ends for finance clients, deployed to Azure with SQL Server.",
    roles: [
        {
            index: 0,
            bullets: [
                {text: "Build and maintain full-stack React and .NET features for client finance applications.", from: [1], why: "C# and .NET Core (must) first"},
                {text: "Automated invoice checking in C#: each incoming invoice is read and matched against its purchase order, cutting manual checks from 2 days to 2 hours a month.", from: [3], why: "C# (must)"},
                {text: "Deployed applications to Azure App Service and managed SQL Server databases.", from: [5], why: "Azure and SQL Server (must)"},
                {text: "Modernised the price-list management tool, moving it from Excel spreadsheets to a React and .NET web app used by the sales team.", from: [2], why: ""},
                {text: "Promoted from intern to full-time developer after the first year, then led a team of 3 developers, splitting and tracking work in Jira and GitHub.", from: [0], why: ""},
            ],
        },
        unchangedAmetek,
    ],
    projects: [unchangedProject],
    projectOrder: [0],
    skills: ["C#", ".NET Core", "ASP.NET Core", "React", "TypeScript", "SQL Server", "Entity Framework Core", "Azure", "Git", "GitHub", "Jira"],
    addedSkills: [],
    droppedPoints: [{section: "Cenitium", text: "Mentored 3 placement-year students in full-stack development with React and .NET.", reason: "Least relevant to a mid-level .NET role, and the role is at its 5-bullet limit."}],
    improvements: [],
};
