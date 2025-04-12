'use client';
import {useState} from 'react';
import styles from './context.module.css'

export default function context()
{
    return(
        <div className={styles.contextform}>
            <h1 className={styles.contextheader}>Submit context for your interview!</h1>

            <p className={styles.textinputp}>Copy and paste company info and job description here</p>
            <div>
                <textarea className={styles.textinput} defaultValue={'Enter job/internship description here...'}>
                
                </textarea>
            </div>

            

            <p className={styles.resumetextp}>Upload PDF of your resume</p>
            <div>
                <label className={styles.resumefile} htmlFor='resumeUpload'>
                Upload Resume
                </label>
                <input
                    type="file"
                    id="resumeUpload"
                    accept=".pdf"
                    className={styles.fileInput}
                />
            </div>

            <button className={styles.submitbutton}>
                <span>Submit</span>
            </button>
            
        </div>
    )
}