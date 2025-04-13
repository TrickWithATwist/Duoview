// force this API route to use the Node.js runtime
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    console.log(process.env.OPENAI_API_KEY)
  try {
    console.log("route hit")
    // Initialize OpenAI client with your API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Parse the FormData
    const formData = await request.formData();
    const jobDescription = formData.get('jobdescription'); // Note: matching your key name
    const resumeFile = formData.get('resume');

    // In a real implementation, you would parse the PDF text here
    // For this example, we're simplifying and just using metadata
    const resumeInfo = `Resume filename: ${resumeFile.name}, size: ${resumeFile.size} bytes`;

    console.log("Processing request with job description:", jobDescription);
    console.log("Resume info:", resumeInfo);

    // Create a system message with context
    const systemMessage = `
      You are an interview preparation assistant. 
      Your task is to act as an interviewer for a job candidate.
      
      The candidate has applied for the following position:
      ${jobDescription}
      
      The candidate's resume information:
      ${resumeInfo}
      
      Based on this information, you will conduct a behavioral interview with the candidate.
      Generate 5 relevant behavioral questions based on the job description and candidate's background.
      For each question, also prepare a guidance framework for what would constitute a good answer.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use gpt-4 if you have access
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: "Please generate a set of behavioral interview questions for me based on the provided job description and resume. Include guidance on what makes a good answer for each." }
      ],
      temperature: 0.7,
    });

    // Extract the interview questions and context
    const interviewData = {
      questions: completion.choices[0].message.content,
      jobContext: jobDescription,
      resumeContext: resumeInfo,
    };

    return NextResponse.json(interviewData);
  } catch (error) {
    console.error('Error processing context:', error);
    return NextResponse.json(
      { error: 'Failed to process interview context', details: error.message },
      { status: 500 }
    );
  }
}