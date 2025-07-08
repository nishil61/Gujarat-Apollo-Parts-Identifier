// IMPORTANT: Replace with your actual Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiph20KVLN4ZMnYXXoi6wTFmnMBmxvkBfRVaPp_-cG8vIWPn5c_cPbz29e7hYFLOJ3/exec';

interface DetectionLog {
  part: string;
  confidence: number; // Decimal value (e.g., 0.987 for 98.7%) - Google Sheets will format as percentage
  source: 'Upload' | 'Webcam';
}

export const logDetectionToSheet = async (logData: DetectionLog): Promise<void> => {
  if (!SCRIPT_URL) {
    console.warn('Google Apps Script URL is not configured. Skipping sheet logging.');
    return;
  }

  try {
    console.log('Attempting to log to Google Sheets:', logData);
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Changed from 'cors' to 'no-cors' to avoid preflight
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    console.log('Response received from Google Apps Script');
    
    // Note: With no-cors mode, we can't read the response content
    // but the request should still reach the Apps Script
    console.log('Detection logged to Google Sheet (no-cors mode)');
    
  } catch (error) {
    console.error('Error logging to Google Sheet:', error);
    
    // Fallback: Try with no headers to avoid CORS preflight
    try {
      console.log('Retrying with simplified request...');
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(logData),
      });
      console.log('Fallback request sent to Google Sheet');
    } catch (fallbackError) {
      console.error('Fallback request also failed:', fallbackError);
    }
  }
};
