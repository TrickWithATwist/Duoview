'use client';
import {useState} from 'react';
import styles from './context.module.css'

export default function context()
{
    return(
        <div className={styles.contextform}>
            <h1 className={styles.contextheader} htmlFor='resumeUpload'>Submit context for your interview!</h1>
            <div>
                <label className={styles.resumefile}>
                <input
                    type="file"
                    id="resumeUpload"
                    accept=".pdf"
                    className={styles.fileInput}
                />
                </label>
            </div>
            <p>Context page</p>
        </div>
    )
}