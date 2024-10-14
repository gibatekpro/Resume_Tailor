
export const instructionData=
"\n" +
        "Produce ONLY JSON,  with no comments at all.\n" +
        "Use the Note to OpenAI comments as guidelines. Follow guidelines strictly.\n" +
        "//Note to OpenAI: Use the Job description to alter this json and produce another one\n" +
        "//Note to OpenAI: Summary and skills should be replaced with the job description's requirements\n" +
        "// Include Note to OpenAI comments when generating response.\n" +
        "export const resumeData: ResumeData = {\n" +
        "    //Note to OpenAI: Document title should be anthony-gibah-*company name*\n" +
        "    //Note to OpenAI: Add only company name, not description. e.g anthony-gibah-google-inc\n" +
        "    documentTitle: \"anthony-gibah-\",\n" +
        "    //Note to OpenAI: Do not alter profile\n" +
        "    profile: {\n" +
        "        firstName: \"Anthony\",\n" +
        "        lastName: \"Gibah\",\n" +
        "        profession: \"Software Engineer\"\n" +
        "    },\n" +
        "    contactInfo: [\n" +
        "        {\n" +
        "            infoTitle: \"Email\",\n" +
        "            infoDetails: \"gibahanthony@gmail.com\",\n" +
        "        },\n" +
        "        {\n" +
        "            infoTitle: \"Location\",\n" +
        "            infoDetails: \"London, UK\",\n" +
        "        },\n" +
        "        {\n" +
        "            infoTitle: \"Phone\",\n" +
        "            infoDetails: \"+44 788 264 8701\",\n" +
        "        },\n" +
        "        {\n" +
        "            infoTitle: \"LinkedIn\",\n" +
        "            infoLink: \"https://www.linkedin.com/in/anthony-gibah-325a59150\",\n" +
        "            linkTag: \"Click here\"\n" +
        "        },\n" +
        "        {\n" +
        "            infoTitle: \"GitHub\",\n" +
        "            infoLink: \"https://github.com/gibatekpro\",\n" +
        "            linkTag: \"Click here\"\n" +
        "        }\n" +
        "    ],\n" +
        "    //Note to OpenAI: Summary should be based on job description and not more than 230 characters\n" +
        "    summary: \"Experienced .NET web developer with 3+ years of expertise in .NET Core, REST APIs, C#, and MS SQL Server. \" +\n" +
        "        \"Proficient in building scalable applications and delivering innovative solutions for clients. Passionate about\" +\n" +
        "        \" working on cutting-edge web development projects.\",\n" +
        "    //Note to OpenAI: Skills should not be too long. always include Java, C# and MySQL\n" +
        "    skills: [\n" +
        "        \".NET Core\",\n" +
        "        \"C#\",\n" +
        "        \"REST APIs\",\n" +
        "        \"MS SQL Server\",\n" +
        "        \"JavaScript\",\n" +
        "        \"Typescript\",\n" +
        "    ],\n" +
        "    languages: [\n" +
        "        {\n" +
        "            name: \"English\",\n" +
        "            level: \"Fluent\"\n" +
        "        }\n" +
        "    ],\n" +
        "    //Note to OpenAI: Company name should remain the same, but Job titles and roles should be based on job description\n" +
        "    //Note to OpenAI: Do not use buzzwords. Use clear human-like statements. 5 bullet points each\n" +
        "    workExperience: [\n" +
        "        {\n" +
        "            companyName: \"Cenitium Ltd\",\n" +
        "            //Note to OpenAI: The job title must be based on job description. So if it is java, change job title to java or springboot\n" +
        "            //Note to OpenAI: STOP using .NET Developer as the title of Java job. use Java or Spring boot developer\n" +
        "            jobTitle: \".NET Developer\",\n" +
        "            //Note to OpenAI: The roles must be based on job description. Do not use .NET roles for JAVA\n" +
        "            //Note to OpenAI: Change roles to match the given job description\n" +
        "            roles: [\n" +
        "                \"Developed high-quality web applications using .NET Core, C#, and REST APIs for various clients.\",\n" +
        "                \"Collaborated with stakeholders to improve scalability, performance, and security.\",\n" +
        "                \"Collaborated with cross-functional teams to ensure client requirements were met and projects were delivered on time.\",\n" +
        "                \"Utilized Azure/DevOps for continuous integration and deployment, while working on scalable architecture.\",\n" +
        "                \"Wrote unit tests, integration tests, and E2E tests to ensure the stability and reliability of the codebase.\"\n" +
        "            ],\n" +
        "            startDate: \"Aug 2021\",\n" +
        "            endDate: \"Sep 2023\",\n" +
        "            current: false\n" +
        "        },\n" +
        "        {\n" +
        "            companyName: \"Cenitium Ltd\",\n" +
        "            //Note to OpenAI: The job title must be based on job description. So if it is java, change job title to java or springboot\n" +
        "            //Note to OpenAI: but include intern\n" +
        "            //Note to OpenAI: STOP using C# Developer as the title of Java job. use Java or Spring boot developer\n" +
        "            jobTitle: \"C# Developer - Intern\",\n" +
        "            //Note to OpenAI: The roles must be based on job description. Do not use .NET roles for JAVA\n" +
        "            //Note to OpenAI: Change roles to match the given job description\n" +
        "            roles: [\n" +
        "                \"Developed and maintained full-stack applications using C# .NET, React, and SQL for eCommerce platforms.\",\n" +
        "                \"Implemented Agile methodologies, including TDD, for faster and more reliable project delivery.\",\n" +
        "                \"Worked closely with cloud platforms like Azure and AWS for deployment and hosting.\",\n" +
        "                \"Assisted in the development of web applications using C# and SQL.\",\n" +
        "                // \"Contributed to bug fixing, version control using Git, and collaboration in Agile teams.\",\n" +
        "                // \"Supported daily stand-ups and sprint planning for project management.\"\n" +
        "            ],\n" +
        "            startDate: \"Sep 2020\",\n" +
        "            endDate: \"Aug 2021\",\n" +
        "            current: false\n" +
        "        },\n" +
        "    ],\n" +
        "    education: [\n" +
        "        {\n" +
        "            institutionName: \"University of Westminster\",\n" +
        "            degree: \"Masters Degree\",\n" +
        "            course: \"Software Engineering (Distinction)\",\n" +
        "            startDate: \"Sep 2023\",\n" +
        "            endDate: \"Aug 2024\",\n" +
        "            current: false,\n" +
        "            link: \"https://www.westminster.ac.uk/\"\n" +
        "        },\n" +
        "        {\n" +
        "            institutionName: \"University of Benin\",\n" +
        "            degree: \"Bachelors in Engineering\",\n" +
        "            course: \"Electrical/Electronic Engineering\",\n" +
        "            startDate: \"Sep 2013\",\n" +
        "            endDate: \"Jun 2019\",\n" +
        "            current: false,\n" +
        "            link: \"https://www.uniben.edu/\"\n" +
        "        }\n" +
        "    ],\n" +
        "    //Note to OpenAI: Luv2Shop E-commerce Website Project name should be the same, but its project details should be based\n" +
        "    // on job description\n" +
        "    projects: [\n" +
        "        {\n" +
        "            projectName: \"Luv2Shop E-commerce Website\",\n" +
        "            role: \"Full Stack Developer\",\n" +
        "            projectDetails: [\n" +
        "                \"Designed and implemented a scalable eCommerce solution using C# .NET for backend and React for frontend.\",\n" +
        "                \"Integrated secure payment solutions (e.g., Stripe) and used Azure for deployment.\",\n" +
        "                \"Collaborated with a small team to ensure performance and UX enhancements.\"\n" +
        "            ],\n" +
        "            startDate: \"Jan 2023\",\n" +
        "            endDate: \"Mar 2023\",\n" +
        "            current: false,\n" +
        "            link: \"https://github.com/gibatekpro\"\n" +
        "        },\n" +
        "        {\n" +
        "            projectName: \"IMEI Generator (1 million+ installs on Playstore)\",\n" +
        "            role: \"Android App Developer\",\n" +
        "            projectDetails: [\n" +
        "                \"Developed an Android app for generating and validating IMEI numbers using Java and Firebase.\",\n" +
        "                \"Integrated analytics and authentication using Firebase.\",\n" +
        "                \"Achieved over 1 million installs with a responsive UI.\"\n" +
        "            ],\n" +
        "            startDate: \"Sep 2017\",\n" +
        "            endDate: \"Dec 2017\",\n" +
        "            current: false\n" +
        "        }\n" +
        "    ]\n" +
        "};"
;