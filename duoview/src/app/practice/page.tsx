'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './practice.module.css';
import Image from 'next/image';

export default function PracticePage() {
  const [interviewData, setInterviewData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Avatar animation states
  const [avatarState, setAvatarState] = useState('idle'); // idle, talking, blinking
  const blinkTimerRef = useRef(null);
  const talkTimerRef = useRef(null);

  // Animation cycle for avatar
  useEffect(() => {
    // Set up random blinking
    const startBlinkCycle = () => {
      blinkTimerRef.current = setInterval(() => {
        if (avatarState !== 'talking') {
          setAvatarState('blinking');
          setTimeout(() => {
            setAvatarState('idle');
          }, 300); // Blink for 300ms
        }
      }, 3000 + Math.random() * 2000); // Random blink interval between 3-5 seconds
    };

    startBlinkCycle();

    // Clean up timers on unmount
    return () => {
      clearInterval(blinkTimerRef.current);
      clearTimeout(talkTimerRef.current);
    };
  }, [avatarState]);

  useEffect(() => {
    // Retrieve the context from localStorage
    const savedContext = localStorage.getItem('interviewContext');
    if (savedContext) {
      try {
        const parsedContext = JSON.parse(savedContext);
        setInterviewData(parsedContext);
        
        // Parse the questions from the response
        const questionsList = parsedContext.questions
          .split('\n\n')
          .filter(q => q.trim().startsWith('Question'));
        
        setQuestions(questionsList.length > 0 ? questionsList : ['No questions available']);
        
        // Simulate avatar talking when loaded
        simulateAvatarTalking();
      } catch (error) {
        console.error("Error parsing interview context:", error);
      }
    }
    
    setLoading(false);
  }, []);

  // Function to make avatar appear to talk
  const simulateAvatarTalking = () => {
    setAvatarState('talking');
    
    // Talk for a random duration between 2-4 seconds
    const talkDuration = 2000 + Math.random() * 2000;
    talkTimerRef.current = setTimeout(() => {
      setAvatarState('idle');
    }, talkDuration);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        // Simulate avatar talking after user stops recording
        simulateAvatarTalking();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAudioBlob(null);
      simulateAvatarTalking(); // Make avatar talk when moving to next question
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAudioBlob(null);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading interview data...</div>;
  }

  if (!interviewData) {
    return (
      <div className={styles.errorContainer}>
        <h1>No interview data found</h1>
        <p>Please go back and submit your resume and job description first.</p>
        <button onClick={() => window.location.href = '/context'}>
          Go to Context Page
        </button>
      </div>
    );
  }

  // Determine which avatar image to display based on state
  const getAvatarImage = () => {
    switch (avatarState) {
      case 'blinking':
        return '/images/avatar-blink.png';
      case 'talking':
        return '/images/avatar-talk.png';
      case 'idle':
      default:
        return '/images/avatar-idle.png';
    }
  };

  return (
    <div className={styles.practiceContainer}>
      <div className={styles.avatarPanel}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar} style={{ backgroundImage: `url(${getAvatarImage()})` }}>
            {/* Avatar will be displayed as background image */}
          </div>
          <h2 className={styles.avatarTitle}>Interviewer</h2>
        </div>
      </div>

      <div className={styles.conversationPanel}>
        <div className={styles.questionBubble}>
          <p>{questions[currentQuestion] || 'No questions available'}</p>
        </div>

        {audioBlob && (
          <div className={styles.answerBubble}>
            <p>Your Answer:</p>
            <audio src={URL.createObjectURL(audioBlob)} controls className={styles.audioPlayer} />
          </div>
        )}

        <div className={styles.controls}>
          <button onClick={previousQuestion} disabled={currentQuestion === 0} className={styles.navButton}>
            Previous
          </button>
          
          <div className={styles.micContainer}>
            <button 
              onClick={isRecording ? stopRecording : startRecording} 
              className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.micIcon}>
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
            <span className={styles.recordingStatus}>
              {isRecording ? 'Recording...' : 'Click to speak'}
            </span>
          </div>
          
          <button 
            onClick={nextQuestion} 
            disabled={currentQuestion >= questions.length - 1}
            className={styles.navButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}