'use client';
import {useState} from 'react';
import { useRouter } from 'next/navigation';
import styles from './context.module.css'


export default function context()
{
    //establishing essential variables
    const router = useRouter() //router to change pages
    let [textboxinput, Settextboxinput] = useState('Enter job/internship description here...')
    let [resumefile, Setresumefile] = useState(null)
    let [resumetext, Setresumetext] = useState('')

    //functions to handle file change and submissions
    async function Handlefilechange(e) 
    {
        //getting data
        let data = await e.target.files[0]
        console.log(data)
        console.log(textboxinput)
        if (data && data.type === 'application/pdf') 
        {
            Setresumefile(data);
            
            //placeholder
            Setresumetext(`Uploaded: ${data.name}`);
        }
      
    }

    async function HandleSubmit()
    {
        //edge cases
        if(!resumefile)
        {
            alert("Please upload your resume.");
            return;
        }

        if(textboxinput === 'Enter job/internship description here...' || !textboxinput.trim())
        {
            alert("Please type your job/internship description.")
            return;
        }
        
        //submitting to chatgpt
        try
        {
            //placeholder for converting resume to pdf

            //form data
            let formdata = new FormData();
            formdata.append('resume', resumefile)
            formdata.append('jobdescription', textboxinput)

            // Send to our Next.js API endpoint
            const response = await fetch('/api/processContext', {
                method: 'POST',
                body: formdata,
            });

            if (!response.ok) {
                alert('Failed to process your information');
                return;
            }

            const data = await response.json();
            
            //Store the interview context in localStorage for the practice page
            localStorage.setItem('interviewContext', JSON.stringify(data));

            //Navigate to the practice page
            router.push('/practice');
        }
        finally
        {
            //just to avoid compilation error
        }
    }



    return(
        <div className={styles.pageWrapper}>
            <div className={styles.contextform}>
                <h1 className={styles.contextheader}>Submit context for your interview!</h1>
    
                <p className={styles.textinputp}>Copy and paste company info and job description here</p>
                <div>
                    <textarea className={styles.textinput} defaultValue={textboxinput}
                    onChange={(e) => Settextboxinput(e.target.value)}
                    onClick={() => {
                        if (textboxinput === 'Enter job/internship description here...') {
                          Settextboxinput('');
                        }}}
                    />
                </div>
    
                <div className={styles.uploadBox}>
                    <p className={styles.resumetextp}>Upload PDF of your resume</p>
                    <label className={styles.resumefile} htmlFor='resumeUpload'>
                        {resumefile ? resumefile.name : 'Upload Resume'}
                    </label>
                    <input
                        type="file"
                        id="resumeUpload"
                        accept=".pdf"
                        className={styles.fileInput}
                        onChange={Handlefilechange}
                    />
                </div>
    
                <button className={styles.submitbutton} onClick={HandleSubmit}>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    )
    
}