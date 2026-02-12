'use client';

import { useState, useEffect } from 'react';
import { useDIDContext } from '../../context/DIDContext';
import { CreationStep } from '@/types/did';

// ============================================================================
// TYPES
// ============================================================================

interface UserInfo {
  fullName?: string;
  idNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  email?: string;
  capacityRequest?: string;
  phoneNumber?: string;
  address?: string;
}

type Stage = 'preparing' | 'processing' | 'generating' | 'completed';

// ============================================================================
// HELPERS
// ============================================================================

function buildCredentialId(didData: Record<string, any>): string {
  const walletShort = (didData.walletAddress || '0x0000').slice(-6).toUpperCase();
  const tokenId = didData.didIdentifier || '00';
  return `DPP-${walletShort}-${tokenId}`;
}

function getApplicationType(didData: Record<string, any>): string {
  const formType = didData.registroFormType || localStorage.getItem('registroFormType') || 'F-76';
  const appType = didData.registroApplicationType || localStorage.getItem('registroApplicationType') || '';
  const labels: Record<string, string> = {
    titulo: 'Título de Competencia',
    refrendo: 'Refrendo',
    certificado: 'Certificado de Suficiencia',
    duplicado: 'Duplicado',
  };
  const appLabel = labels[appType] || 'Technical Documentation';
  return `${formType} — ${appLabel}`;
}

function buildImagePrompt(didData: Record<string, any>): string {
  const userInfo = (didData.userInfo || {}) as UserInfo;
  const fullName = userInfo.fullName || didData.fullName || 'Seafarer';
  const nationality = userInfo.nationality || 'Panama';
  const capacity = userInfo.capacityRequest || 'Maritime Professional';
  const credentialId = buildCredentialId(didData);
  const appType = getApplicationType(didData);

  return `Create a highly detailed, professional Digital Port Pass credential card for the Panama Maritime Authority (Autoridad Marítima de Panamá). This is a physical-looking official government maritime credential, landscape orientation.

Design specifications:
- HEADER BAR: Dark navy blue (#052457) top strip with "AUTORIDAD MARÍTIMA DE PANAMÁ" in gold/white text, Panama coat of arms emblem on the left, and "PASE PORTUARIO DIGITAL" subtitle
- LEFT SECTION: A silhouette placeholder portrait area with a thin gold border, styled like a passport photo slot. Below it: the credential holder name "${fullName}", nationality "${nationality}", capacity/rank "${capacity}"
- CENTER: A large QR code graphic (stylistic, does not need to scan) with "VERIFIED ON BLOCKCHAIN" below it in small text
- RIGHT SECTION: Credential details block with:
  - Credential ID: ${credentialId}
  - Application: ${appType}
  - Status: MINTED & VERIFIED (with a green checkmark)
  - Issue date: ${new Date().toLocaleDateString('es-PA')}
  - Form Version: v.03
- BOTTOM STRIP: Red (#D8131B) bar with "GOBIERNO NACIONAL — CON PASO FIRME" and maritime wave pattern
- BACKGROUND: Subtle ocean wave watermark pattern in very light blue, micro-printed security text, holographic foil effect on corners
- OVERALL STYLE: Blend of a modern government ID card and a digital blockchain credential. Colors: deep navy blue, panama red, white, and gold accents. Professional, authoritative, tamper-proof appearance. Include subtle ship/anchor/maritime motifs integrated into the background pattern.
- The card should look photorealistic — like a real physical credential photographed on a dark surface with slight shadow and depth.`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function FinalizationStep() {
  const { state, updateDIDData, markStepAsCompleted, setCurrentStep } = useDIDContext();
  const [stage, setStage] = useState<Stage>('preparing');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const didData = state.didData;
  const userInfo = (didData.userInfo || {}) as UserInfo;
  const credentialId = buildCredentialId(didData);
  const appType = getApplicationType(didData);

  // --- Finalization + image generation flow ---
  useEffect(() => {
    let mounted = true;

    const runFinalization = async () => {
      // Already completed previously
      if (didData.finalizationComplete) {
        setStage('completed');
        setAnimationProgress(100);
        if (didData.generatedPassImage) {
          setGeneratedImageUrl(didData.generatedPassImage);
        }
        return;
      }

      try {
        // ---- STAGE 1: PREPARING ----
        setStage('preparing');
        setAnimationProgress(0);

        await animateProgress(3000, (p) => mounted && setAnimationProgress(p));
        if (!mounted) return;

        // ---- STAGE 2: PROCESSING ----
        setStage('processing');
        setAnimationProgress(0);

        await animateProgress(3000, (p) => mounted && setAnimationProgress(p));
        if (!mounted) return;

        // ---- STAGE 3: GENERATING IMAGE ----
        setStage('generating');
        setAnimationProgress(0);

        // Start a slow progress for image generation (it can take 10-20s)
        const genStart = Date.now();
        const genInterval = setInterval(() => {
          if (!mounted) { clearInterval(genInterval); return; }
          const elapsed = Date.now() - genStart;
          // Slowly fill to 90% over 25 seconds, never reaching 100 until done
          const p = Math.min((elapsed / 25000) * 90, 90);
          setAnimationProgress(p);
        }, 200);

        let imageUrl: string | null = null;
        try {
          const prompt = buildImagePrompt(didData);
          const res = await fetch('/api/openai-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
          });
          const data = await res.json();

          if (!res.ok || data.error) {
            throw new Error(data.message || 'Image generation failed');
          }
          imageUrl = data.imageUrl || null;
        } catch (imgErr: any) {
          console.error('Image generation error:', imgErr);
          if (mounted) setImageError(imgErr.message || 'Could not generate Digital Port Pass image.');
        }

        clearInterval(genInterval);
        if (!mounted) return;
        setAnimationProgress(100);

        if (imageUrl && mounted) {
          setGeneratedImageUrl(imageUrl);
        }

        // Small pause to show 100%
        await new Promise(r => setTimeout(r, 800));
        if (!mounted) return;

        // ---- COMPLETE ----
        setStage('completed');
        updateDIDData({
          finalizationComplete: true,
          completionTimestamp: new Date().toISOString(),
          generatedPassImage: imageUrl || undefined,
        });
        markStepAsCompleted(true);

      } catch (err: any) {
        console.error('Finalization error:', err);
        if (mounted) setError(err.message || 'An error occurred during finalization.');
      }
    };

    runFinalization();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full max-w-3xl mx-auto">
      {stage === 'preparing' && (
        <ProgressCard
          title="Preparing Finalization"
          subtitle="Initializing final steps for your Digital Port Pass..."
          progress={animationProgress}
          checks={[
            { label: 'Collecting verified data', done: animationProgress > 30 },
            { label: 'Preparing blockchain anchoring', done: animationProgress > 60 },
            { label: 'Assembling credential payload', done: animationProgress > 90 },
          ]}
        />
      )}

      {stage === 'processing' && (
        <ProgressCard
          title="Finalizing Your DID"
          subtitle="Securing your credential on the blockchain..."
          progress={animationProgress}
          checks={[
            { label: 'Validating documents', done: animationProgress > 25 },
            { label: 'Generating credentials', done: animationProgress > 50 },
            { label: 'Configuring resolver', done: animationProgress > 75 },
            { label: 'Registering identifier', done: animationProgress > 95 },
          ]}
        />
      )}

      {stage === 'generating' && (
        <ProgressCard
          title="Generating Digital Port Pass"
          subtitle="Creating your personalized credential image with AI..."
          progress={animationProgress}
          checks={[
            { label: 'Composing credential layout', done: animationProgress > 15 },
            { label: 'Applying Panama maritime theme', done: animationProgress > 35 },
            { label: 'Embedding identity data', done: animationProgress > 55 },
            { label: 'Rendering final image', done: animationProgress > 80 },
          ]}
          highlight
        />
      )}

      {stage === 'completed' && (
        <CompletedView
          didData={didData}
          userInfo={userInfo}
          credentialId={credentialId}
          appType={appType}
          generatedImageUrl={generatedImageUrl}
          imageError={imageError}
        />
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <p className="font-semibold mb-1">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ProgressCard({
  title,
  subtitle,
  progress,
  checks,
  highlight,
}: {
  title: string;
  subtitle: string;
  progress: number;
  checks: { label: string; done: boolean }[];
  highlight?: boolean;
}) {
  return (
    <div className="space-y-6 text-center">
      <h3 className={`text-lg font-semibold ${highlight ? 'text-[#D8131B]' : 'text-[#052457]'}`}>
        {title}
      </h3>
      <p className="text-gray-500 text-sm">{subtitle}</p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${
            highlight
              ? 'bg-gradient-to-r from-[#D8131B] to-[#052457]'
              : 'bg-gradient-to-r from-[#005EB8] to-[#052457]'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Spinner + checklist */}
      <div className="flex flex-col items-center gap-4">
        <div className={`animate-spin rounded-full h-14 w-14 border-[3px] border-transparent ${
          highlight ? 'border-t-[#D8131B] border-b-[#D8131B]' : 'border-t-[#005EB8] border-b-[#005EB8]'
        }`} />

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-left max-w-sm mx-auto">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={c.done ? 'text-green-500' : 'text-gray-400'}>
                {c.done ? '✅' : '⏳'}
              </span>
              <span className={c.done ? 'text-gray-700' : 'text-gray-400'}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompletedView({
  didData,
  userInfo,
  credentialId,
  appType,
  generatedImageUrl,
  imageError,
}: {
  didData: Record<string, any>;
  userInfo: UserInfo;
  credentialId: string;
  appType: string;
  generatedImageUrl: string | null;
  imageError: string | null;
}) {
  const mintTimestamp = didData.completionTimestamp
    ? new Date(didData.completionTimestamp).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#052457]">Digital Port Pass Minted</h3>
        <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto">
          Your seafarer credential has been created and secured. This digital record can be verified anytime by AMP and authorized parties.
        </p>
      </div>

      {/* Generated Image */}
      {generatedImageUrl && (
        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-[#052457]/20">
          <img
            src={generatedImageUrl}
            alt="Digital Port Pass"
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      {imageError && !generatedImageUrl && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs text-center">
          Image generation unavailable: {imageError}
        </div>
      )}

      {/* Status Module */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Top status bar */}
        <div className="bg-gradient-to-r from-[#052457] to-[#005EB8] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-semibold">Minted and Verified</span>
          </div>
          <span className="text-white/70 text-xs font-mono">v.03</span>
        </div>

        {/* Details grid */}
        <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Credential ID" value={credentialId} mono />
          <InfoRow label="Minted on" value={mintTimestamp} />
          <InfoRow label="Application Type" value={appType} />
          <InfoRow label="Form Version" value="F-76 (TIT) V.03" />
          <InfoRow label="DID Identifier" value={`did:ryt:${didData.didIdentifier || didData.walletAddress || '0x0'}`} mono />
          <InfoRow label="Status" value="Active" badge />
        </div>
      </div>

      {/* Applicant Details */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#005EB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[#052457] text-sm font-semibold">Applicant Information</span>
        </div>

        <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Full Name" value={userInfo.fullName || didData.fullName || 'N/A'} />
          <InfoRow label="ID Number" value={userInfo.idNumber || didData.documentNumber || 'N/A'} />
          <InfoRow label="Nationality" value={userInfo.nationality || 'N/A'} />
          <InfoRow label="Date of Birth" value={userInfo.dateOfBirth || didData.dateOfBirth || 'N/A'} />
          <InfoRow label="Capacity Request" value={userInfo.capacityRequest || 'N/A'} />
          <InfoRow label="Phone" value={userInfo.phoneNumber || 'N/A'} />
          <InfoRow
            label="Email (administrative notifications)"
            value={userInfo.email || 'N/A'}
            fullWidth
          />
          <InfoRow label="Address" value={userInfo.address || 'N/A'} fullWidth />
        </div>
      </div>

      {/* Trust Anchors */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <TrustBadge icon="🔗" label="Blockchain Secured" />
        <TrustBadge icon="🛡️" label="AMP Verified" />
        <TrustBadge icon="📋" label="STCW Compliant" />
        <TrustBadge icon="🌐" label="Globally Verifiable" />
      </div>

      {/* Next prompt */}
      <p className="text-center text-[#005EB8] text-sm font-medium animate-pulse">
        Click &apos;Next&apos; to complete the process.
      </p>
    </div>
  );
}

// ============================================================================
// SMALL UI PIECES
// ============================================================================

function InfoRow({
  label,
  value,
  mono,
  badge,
  fullWidth,
}: {
  label: string;
  value: string;
  mono?: boolean;
  badge?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-0.5">{label}</p>
      {badge ? (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          {value}
        </span>
      ) : (
        <p className={`text-gray-800 font-medium break-all ${mono ? 'font-mono text-xs' : 'text-sm'}`}>
          {value}
        </p>
      )}
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#052457]/5 border border-[#052457]/10 px-3 py-1.5 rounded-full">
      <span className="text-sm">{icon}</span>
      <span className="text-[11px] font-semibold text-[#052457]">{label}</span>
    </div>
  );
}

// ============================================================================
// UTILS
// ============================================================================

function animateProgress(
  duration: number,
  onProgress: (p: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      onProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}
