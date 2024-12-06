import {OpenAIInstruction} from "../models/OpenAIInstruction";

export const openAIInstruction: OpenAIInstruction = {
    prompt: [
        "Modify the resumeInfo object based on the provided job description and instructions.",
        "This is a set of instructions for you (ChatGPT/OpenAI to follow",
        "DO NOT INCLUDE this ```json or any backticks",
        "Fill in the missing objects that have openAI in them using the job description",
        "Document title should be resumeInfo.firstName-resumeInfo-lastname-*company name",
        "openAIJobCompanyName is the name of the company. please include it if available",
        "The JSON should be of this type interface JobApplicationInfo {\n" +
        "openAIDocumentTitle?: string,\n" +
        "    openAIJobTitle?: string,\n" +
        "openAIJobCompanyName?: string,\n" +
        "    openAIExpectedSalary?: string,\n" +
        "    openAIJobLocation?: string,\n" +
        "    openAISimpleJobDescription?: string,\n" +
        "    resumeInfo?: ResumeInfo,\n" +
        "}",
        "Note to OpenAI: More instructions are given in openAINote object. Please follow strictly"
    ],
    responseFormat: "JSON",
    rules: [
        "Document title should be resumeInfo.firstName-resumeInfo-lastname-*company name",
        "Add only company name, not description. e.g john-doe-google-inc",
        "Do not alter profile",
        "Skills should not be too long. always include Java, C# and MySQL",
        "Company name should remain the same, but Job titles and roles should be based on job description",
        "Do not use buzzwords. Use clear human-like statements. 5 bullet points each",
        "The job title must be based on job description. So if it is java, change job title to java or springboot",
        "STOP using .NET Developer as the title of Java job. use Java or Spring boot developer",
        "The roles must be based on job description. Do not use .NET roles for JAVA",
        "Change roles to match the given job description",
        "The job title must be based on job description. So if it is java, change job title to java or springboot, but include intern where it is already stated",
        "STOP using C# Developer as the title of Java job. use Java or Spring boot developer",
        "The roles must be based on job description. Do not use .NET roles for JAVA",
        "Change roles to match the given job description",
        "Luv2Shop E-commerce Website Project name should be the same, but its project details should be based on job description",
    ],
    jobDescriptionData: "",
}