import {containsPhrase, normaliseText} from "./text";

// Technologies, practices and architecture claims the checks look for. Each entry lists the spellings of one thing.
// Words that are also ordinary English ("Go", "Swift", "Spring", "rest", "helm") are only listed in unambiguous forms.
export const TECH_TERMS: string[][] = [
    // Languages
    ["C#", "C Sharp"], ["C++"], ["Java"], ["JavaScript", "JS"], ["TypeScript", "TS"], ["Python"], ["Golang"], ["Rust"],
    ["Kotlin"], ["PHP"], ["Ruby"], ["Scala"], ["SQL"], ["T-SQL", "TSQL"], ["PL/SQL"], ["Bash"], ["PowerShell"], ["VB.NET"],
    ["Dart"], ["Objective-C"], ["MATLAB"], ["HTML"], ["CSS"], ["Sass", "SCSS"],
    // .NET and backend frameworks
    [".NET", "dotnet"], [".NET Core"], [".NET Framework"], ["ASP.NET"], ["ASP.NET Core"], ["ASP.NET MVC"],
    ["Entity Framework", "EF"], ["Entity Framework Core", "EF Core"], ["Blazor"], ["WPF"], ["WinForms", "Windows Forms"],
    ["MAUI"], ["Xamarin"], ["SignalR"], ["gRPC"], ["GraphQL"], ["REST API", "REST APIs", "RESTful"], ["SOAP"], ["Web API"],
    ["Node.js", "Node", "NodeJS"], ["Express.js"], ["NestJS"], ["Django"], ["Flask"], ["FastAPI"], ["Spring Boot"],
    ["Laravel"], ["Ruby on Rails"],
    // Frontend
    ["React", "React.js", "ReactJS"], ["React Native"], ["Next.js"], ["Angular"], ["AngularJS"], ["Vue", "Vue.js"],
    ["Svelte"], ["Redux"], ["jQuery"], ["Tailwind", "Tailwind CSS"], ["Bootstrap"], ["Vite"], ["Webpack"],
    // Data
    ["SQL Server", "MSSQL", "Microsoft SQL Server"], ["PostgreSQL", "Postgres"], ["MySQL"], ["MariaDB"], ["SQLite"],
    ["Oracle"], ["MongoDB"], ["Cosmos DB", "CosmosDB"], ["Redis"], ["Elasticsearch"], ["DynamoDB"], ["Firebase"],
    ["Firestore"], ["Snowflake"], ["Databricks"], ["Power BI"], ["SSIS"], ["SSRS"],
    ["Power Automate", "Microsoft Flow"], ["Power Apps", "PowerApps"], ["SharePoint"],
    // Cloud
    ["Azure", "Microsoft Azure"], ["AWS", "Amazon Web Services"], ["GCP", "Google Cloud"], ["Azure Functions"],
    ["Azure App Service"], ["Azure DevOps"], ["Azure Service Bus"], ["Event Grid"], ["Event Hubs"], ["Logic Apps"],
    ["AWS Lambda"], ["S3"], ["EC2"], ["SQS"], ["SNS"], ["CloudFormation"], ["Vercel"], ["Netlify"], ["Heroku"],
    // DevOps and infrastructure
    ["CI/CD", "CI CD", "continuous integration", "continuous delivery", "continuous deployment"],
    ["GitHub Actions"], ["Jenkins"], ["TeamCity"], ["Octopus Deploy"], ["GitLab CI"],
    ["Docker"], ["Kubernetes", "K8s"], ["AKS"], ["Helm charts"],
    ["Terraform"], ["Bicep"], ["ARM templates"], ["Pulumi"], ["Ansible"], ["infrastructure as code", "IaC"],
    ["Git"], ["GitHub"], ["GitLab"], ["Bitbucket"], ["Jira"], ["Confluence"],
    ["Kafka"], ["RabbitMQ"], ["MassTransit"], ["NServiceBus"],
    ["Grafana"], ["Prometheus"], ["Datadog"], ["Application Insights", "App Insights"], ["Splunk"],
    // Testing
    ["xUnit"], ["NUnit"], ["MSTest"], ["Jest"], ["Vitest"], ["Cypress"], ["Playwright"], ["Selenium"], ["Moq"],
    ["TDD", "test-driven development"], ["BDD"], ["SpecFlow"],
    // Architecture and practice claims that must be earned by the CV
    ["microservices", "microservice"], ["event-driven", "event driven"], ["event sourcing"], ["CQRS"],
    ["domain-driven design", "DDD"], ["serverless"], ["distributed systems"], ["message queues", "message queue"],
    ["OAuth"], ["OpenID Connect"], ["JWT"], ["Agile"], ["Scrum"], ["Kanban"],
    // AI
    ["OpenAI"], ["LLM", "LLMs"], ["machine learning"], ["TensorFlow"], ["PyTorch"],
];

// Each tech term (by its first spelling) that appears in `text` under any of its spellings.
export const findTechTerms = (text: string, extraTerms: string[] = []) => {
    const groups = [...TECH_TERMS, ...extraTerms.filter((term) => term.trim()).map((term) => [term])];
    const found = groups.filter((spellings) => spellings.some((spelling) => containsPhrase(text, spelling))).map((spellings) => spellings[0]);
    return [...new Set(found)];
};

// Whether `term` (any of its spellings, if it is in the dictionary) appears in `text`.
export const mentionsTerm = (text: string, term: string) => {
    const spellings = TECH_TERMS.find((group) => group[0] === term) ?? [term];
    return spellings.some((spelling) => containsPhrase(text, spelling));
};

// The same key for every spelling of one skill ("EF Core" and "Entity Framework Core", "TS" and "TypeScript"),
// so a renamed skill isn't counted as a new one. A skill not in the dictionary is its own key.
export const skillKey = (skill: string) => {
    const name = normaliseText(skill);
    const group = TECH_TERMS.find((spellings) => spellings.some((spelling) => normaliseText(spelling) === name));
    return group ? normaliseText(group[0]).trim() : name.trim();
};
