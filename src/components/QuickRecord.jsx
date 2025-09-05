import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Share2, AlertTriangle, Send } from 'lucide-react';
import CallToAction from './CallToAction';

const QuickRecord = ({ userLocation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setAlertSent(false);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Recording permission denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const sendAlert = () => {
    // Simulate sending alert to emergency contacts
    const message = `ALERT: I am in a situation that requires documentation. My location: ${userLocation?.city || 'Unknown'}, ${userLocation?.state || 'Unknown'}. Time: ${new Date().toLocaleString()}`;
    
    // In a real app, this would send SMS/email to emergency contacts
    console.log('Alert sent:', message);
    setAlertSent(true);
    
    // Show confirmation
    alert('Emergency alert sent to your contacts!');
  };

  const shareRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Quick Record & Share</h2>
        <p className="text-gray-600">
          Document your interaction and alert emergency contacts if needed
        </p>
      </div>

      {/* Recording Interface */}
      <div className="card text-center">
        <div className="mb-6">
          {isRecording ? (
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto recording-pulse rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-mono font-bold text-red-600">
                {formatTime(recordingTime)}
              </div>
              <p className="text-sm text-gray-600">Recording in progress...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600">Tap to start recording</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!isRecording ? (
            <CallToAction 
              variant="record"
              onClick={startRecording}
              className="w-full"
            >
              Start Recording
            </CallToAction>
          ) : (
            <CallToAction 
              variant="shareAlert"
              onClick={stopRecording}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </CallToAction>
          )}

          {isRecording && (
            <CallToAction 
              variant="shareAlert"
              onClick={sendAlert}
              disabled={alertSent}
              className={`w-full ${alertSent ? 'opacity-50' : ''}`}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {alertSent ? 'Alert Sent!' : 'Send Emergency Alert'}
            </CallToAction>
          )}
        </div>
      </div>

      {/* Recording History/Controls */}
      {recordedBlob && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Latest Recording</h3>
          <div className="space-y-4">
            <audio 
              controls 
              src={URL.createObjectURL(recordedBlob)}
              className="w-full"
            />
            <div className="flex space-x-3">
              <button 
                onClick={shareRecording}
                className="btn-outline flex-1 flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Download
              </button>
              <button 
                onClick={sendAlert}
                className="btn-accent flex-1 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Share Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts Info */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-800">Emergency Contacts</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Alerts will be sent to your configured emergency contacts with your location and timestamp. 
              Configure contacts in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickRecord;