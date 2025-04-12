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



    return(
        <div className={styles.contextform}>
            <h1 className={styles.contextheader}>Submit context for your interview!</h1>

            {/*Textbox to copy paste job description context*/}
            <p className={styles.textinputp}>Copy and paste company info and job description here</p>
            <div>
                <textarea className={styles.textinput} defaultValue={textboxinput}
                onChange={(e) => Settextboxinput(e.target.value)}
                onClick={() => {
                    if (textboxinput === 'Enter job/internship description here...') {
                      Settextboxinput('');
                    }}}
                >
                
                </textarea>
            </div>

            
            {/*Button where you upload your resume PDF*/}
            <p className={styles.resumetextp}>Upload PDF of your resume</p>
            <div>
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

            {/*Button to submit PDF and job desc to chat gpt as context*/}
            <button className={styles.submitbutton}>
                <span>Submit</span>
            </button>
            
        </div>
    )
}