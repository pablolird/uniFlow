import { useState } from 'react';

interface QRValidationResult {
  isValid: boolean;
  token?: string;
  error?: string;
}

export const useQRValidation = (expectedToken: string, formBaseUrl: string) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateQR = (scannedData: string): QRValidationResult => {
    try {
      // Expected format: {FORM_BASE_URL}/v1/assets/{QR_TOKEN}
      const urlPattern = new RegExp(`^${formBaseUrl}/v1/assets/([A-Za-z0-9_-]{24})$`);
      const match = scannedData.match(urlPattern);

      if (!match) {
        setValidationError('Invalid QR code format');
        return { isValid: false, error: 'Invalid QR code format' };
      }

      const scannedToken = match[1];

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