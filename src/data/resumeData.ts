import { ResumeData } from "../models/ResumeData";

//Note to OpenAI: Use the Job description to alter this json and produce another one
//Note to OpenAI: Summary and skills should be replaced with the job description's requirements
// Include Note to OpenAI comments when generating response.
export const resumeData: ResumeData = {
    //Note to OpenAI: Document title should be anthony-gibah-*company name*
    //Note to OpenAI: Add only company name, not description. e.g anthony-gibah-google-inc
    documentTitle: "anthony-gibah-",
    //Note to OpenAI: Do not alter profile
    profile: {
        firstName: "Anthony",
        lastName: "Gibah"
    },
    contactInfo: [
        {
            infoTitle: "Email: gibahanthony@gmail.com"
        },
        {
            infoTitle: "Phone: +44 788 264 8701"
        },
        {
            infoTitle: "LinkedIn",
            infoLink: "https://www.linkedin.com/in/anthony-gibah-325a59150",
            linkTag: "Click here"
        },
        {
            infoTitle: "GitHub",
            infoLink: "https://github.com/gibatekpro",
            linkTag: "Click here"
        }
    ],
    //Note to OpenAI: Summary should be based on job description and not more than 230 characters
    summary: "Experienced .NET web developer with 3+ years of expertise in .NET Core, REST APIs, C#, and MS SQL Server. " +
        "Proficient in building scalable applications and delivering innovative solutions for clients. Passionate about" +
        " working on cutting-edge web development projects.",
    //Note to OpenAI: Skills should not be too long. always include Java, C# and MySQL
    skills: [
        ".NET Core",
        "C#",
        "REST APIs",
        "MS SQL Server",
        "Domain Driven Design (DDD)",
        "SOLID Principles",
        "Azure/DevOps",
        "NoSQL/Document DB",
        "HTML, CSS/SASS",
        "JavaScript",
        "Typescript",
        "Angular 2+/React",
        "Front-end Build Tools (NPM, Webpack, Babel)",
        "Unit Testing & TDD"
    ],
    //Note to OpenAI: Company name should remain the same, but Job titles and roles should be based on job description
    //Note to OpenAI: Do not use buzzwords. Use clear human-like statements. 5 bullet points each
    workExperience: [
        {
            companyName: "Cenitium Ltd",
            //Note to OpenAI: The job title must be based on job description. So if it is java, change job title to java or springboot
            //Note to OpenAI: STOP using .NET Developer as the title of Java job. use Java or Spring boot developer
            jobTitle: ".NET Developer",
            //Note to OpenAI: The roles must be based on job description. Do not use .NET roles for JAVA
            //Note to OpenAI: Change roles to match the given job description
            roles: [
                "Developed high-quality web applications using .NET Core, C#, and REST APIs for various clients.",
                "Collaborated with stakeholders to improve scalability, performance, and security.",
                "Collaborated with cross-functional teams to ensure client requirements were met and projects were delivered on time.",
                "Utilized Azure/DevOps for continuous integration and deployment, while working on scalable architecture.",
                "Wrote unit tests, integration tests, and E2E tests to ensure the stability and reliability of the codebase."
            ],
            startDate: "Aug 2021",
            endDate: "Sep 2023",
            current: false
        },
        {
            companyName: "Cenitium Ltd",
            //Note to OpenAI: The job title must be based on job description. So if it is java, change job title to java or springboot
            //Note to OpenAI: but include intern
            //Note to OpenAI: STOP using C# Developer as the title of Java job. use Java or Spring boot developer
            jobTitle: "C# Developer - Intern",
            //Note to OpenAI: The roles must be based on job description. Do not use .NET roles for JAVA
            //Note to OpenAI: Change roles to match the given job description
            roles: [
                "Developed and maintained full-stack applications using C# .NET, React, and SQL for eCommerce platforms.",
                "Implemented Agile methodologies, including TDD, for faster and more reliable project delivery.",
                "Worked closely with cloud platforms like Azure and AWS for deployment and hosting.",
                "Assisted in the development of web applications using C# and SQL.",
                "Contributed to bug fixing, version control using Git, and collaboration in Agile teams.",
                "Supported daily stand-ups and sprint planning for project management."
            ],
            startDate: "Sep 2020",
            endDate: "Aug 2021",
            current: false
        },
    ],
    education: [
        {
            institutionName: "University of Westminster",
            degree: "Masters Degree",
            course: "Software Engineering",
            startDate: "Sep 2023",
            endDate: "Aug 2024",
            current: false,
            link: "https://www.westminster.ac.uk/"
        },
        {
            institutionName: "University of Benin",
            degree: "Bachelors in Engineering",
            course: "Electrical/Electronic Engineering",
            startDate: "Sep 2013",
            endDate: "Jun 2019",
            current: false,
            link: "https://www.uniben.edu/"
        }
    ],
    //Note to OpenAI: Luv2Shop E-commerce Website Project name should be the same, but its project details should be based
    // on job description
    projects: [
        {
            projectName: "Luv2Shop E-commerce Website",
            role: "Full Stack Developer",
            projectDetails: [
                "Designed and implemented a scalable eCommerce solution using C# .NET for backend and React for frontend.",
                "Integrated secure payment solutions (e.g., Stripe) and used Azure for deployment.",
                "Collaborated with a small team to ensure performance and UX enhancements."
            ],
            startDate: "Jan 2023",
            endDate: "Mar 2023",
            current: false,
            link: "https://github.com/gibatekpro"
        },
        {
            projectName: "IMEI Generator (1 million+ installs on Playstore)",
            role: "Android App Developer",
            projectDetails: [
                "Developed an Android app for generating and validating IMEI numbers using Java and Firebase.",
                "Integrated analytics and authentication using Firebase.",
                "Achieved over 1 million installs with a responsive UI."
            ],
            startDate: "Sep 2017",
            endDate: "Dec 2017",
            current: false
        }
    ]
};
