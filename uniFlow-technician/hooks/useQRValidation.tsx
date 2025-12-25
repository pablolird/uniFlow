
import { useState } from 'react';

interface QRValidationResult {
  isValid: boolean;
  token?: string;
  error?: string;
}

export const useQRValidation = (expectedToken: string) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateQR = (scannedData: string): QRValidationResult => {
    try {
      // Extract token from the scanned data
      // Pattern: any URL ending with /v1/assets/{QR_TOKEN}
      // OR just the token itself
      const urlPattern = /\/v1\/assets\/([A-Za-z0-9_-]+)$/;
      const match = scannedData.match(urlPattern);
      
      let scannedToken: string;
      
      if (match) {
        // If it matches the URL pattern, extract the token from the URL
        scannedToken = match[1];
      } else {
        // Otherwise, treat the entire scanned data as the token
        scannedToken = scannedData.trim();
      }

      if (scannedToken !== expectedToken) {
        setValidationError('QR code does not match this asset');
        return { isValid: false, error: 'QR code does not match this asset' };
      }

      setValidationError(null);
      return { isValid: true, token: scannedToken };
    } catch (error) {
      setValidationError('Error validating QR code');
      return { isValid: false, error: 'Error validating QR code' };
    }
  };

  const clearError = () => setValidationError(null);

  return { validateQR, validationError, clearError };
};

export default useQRValidation;