// Metadata service for generating and uploading DID metadata to IPFS

interface DIDMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface DIDData {
  fullName?: string;
  documentNumber?: string;
  documentType?: string;
  dateOfBirth?: string;
  gender?: string;
  issuingCountry?: string;
  verificationTimestamp?: string;
  ipfsUrl?: string;
  livenessImage?: string;
  didVerificationScore?: number;
  demoData?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    documentType: string;
    documentNumber: string;
  };
}
import {uploadImageToPinata} from './pinata';
/**
 * Generate JSON metadata for DID NFT
 * @param didData The DID data from context
 * @param isDemoMode Whether using demo data or real verification
 * @returns JSON metadata object
 */
export const generateDIDMetadata = (didData: DIDData, isDemoMode: boolean = false): DIDMetadata => {
  // Use demo data if in demo mode, otherwise use verified data
  const name = isDemoMode ? 
    `${didData.demoData?.firstName} ${didData.demoData?.lastName}` : 
    didData.fullName || 'Unknown User';
  
  const documentNumber = isDemoMode ?
    didData.demoData?.documentNumber :
    didData.documentNumber || 'N/A';
    
  const documentType = isDemoMode ?
    didData.demoData?.documentType :
    didData.documentType || 'Unknown';
    
  const dateOfBirth = isDemoMode ?
    didData.demoData?.dateOfBirth :
    didData.dateOfBirth || 'N/A';
    
  const nationality = isDemoMode ?
    didData.demoData?.nationality :
    didData.issuingCountry || 'Unknown';
  
  const gender = isDemoMode ? 
    'Not Specified' : 
    didData.gender || 'Not Specified';

  // Generate a unique token number
  const tokenNumber = Math.floor(Math.random() * 1000) + 1;
  
  // Prefer liveness image (selfie) over document image for DID profile
  // Use the uploaded liveness image, then ID image, or a placeholder
  const imageUrl = didData.livenessImage || 
    didData.ipfsUrl || 
    "https://green-manual-tapir-637.mypinata.cloud/ipfs/bafybeiamhz7xwe7kjvurvtc7d4t3pscyttowfqkkcjrdfsulcn56bdrgke/image.png";

  return {
    name: `${name}`,
    description: `Name: ${name}, ID # ${documentNumber}, DOB: ${dateOfBirth}, Gender: ${gender}`,
    image: imageUrl,
    attributes: [
      {
        trait_type: "document_type",
        value: documentType || 'Unknown'
      },
      {
        trait_type: "document_number", 
        value: documentNumber || 'Unknown'
      },
      {
        trait_type: "full_name",
        value: name
      },
      {
        trait_type: "date_of_birth",
        value: dateOfBirth || 'Unknown'
      },
      {
        trait_type: "gender",
        value: gender
      },
      {
        trait_type: "nationality",
        value: nationality || 'Unknown'
      },
      {
        trait_type: "verification_score",
        value: didData.didVerificationScore?.toString() || "0"
      },
      {
        trait_type: "verification_timestamp",
        value: didData.verificationTimestamp || new Date().toISOString()
      },
      {
        trait_type: "verification_type",
        value: isDemoMode ? "Demo Mode" : "Full Verification"
      },
      {
        trait_type: "liveness_verified",
        value: didData.livenessImage ? "Yes" : "No"
      },
      {
        trait_type: "document_image_url",
        value: didData.ipfsUrl || "Not Available"
      },
      {
        trait_type: "liveness_image_url", 
        value: didData.livenessImage || "Not Available"
      }
    ]
  };
};

/**
 * Upload JSON metadata to IPFS via Pinata API
 * @param metadata The metadata object to upload
 * @returns Promise with the IPFS URL
 */
export const uploadMetadataToIPFS = async (metadata: DIDMetadata): Promise<string> => {
  try {
    const response = await fetch('/api/pinata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    return result.url;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
};

/**
 * Generate and upload DID metadata to IPFS
 * @param didData The DID data from context
 * @param isDemoMode Whether using demo data
 * @returns Promise with the IPFS URL
 */
export const createAndUploadDIDMetadata = async (didData: DIDData, isDemoMode: boolean = false): Promise<string> => {
  // Generate metadata
  
  const metadata = generateDIDMetadata(didData, isDemoMode);
 
  // Upload to IPFS
  const file = new File([JSON.stringify(metadata)], 'metadata.json', { type: 'application/json' });
  const ipfsUrl = await uploadImageToPinata(file);
  
  console.log('DID Metadata uploaded to IPFS:', ipfsUrl);
  return ipfsUrl;
};
