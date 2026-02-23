'use client';

import Image from 'next/image';

export type DigitalPortPassData = {
  nameLine?: string;
  fullName: string;
  country: string;
  dob: string;
  passportLabel?: string;
  passportId: string;

  seafarerCapacityLabel?: string;
  category: string;
  endorsement: string;

  issuedBy: string;
  dppNumber: string;

  verifyText?: string;

  photoSrc: string;
  qrSrc: string;
  logoSrc?: string;
  shipBgSrc?: string;
};

type Props = {
  data: DigitalPortPassData;
  className?: string;
};

export default function DigitalPortPassCard({ data, className }: Props) {
  const {
    nameLine = 'NAME',
    fullName,
    country,
    dob,
    passportLabel = 'Passport / ID',
    passportId,
    seafarerCapacityLabel = 'SEAFARER CAPACITY:',
    category,
    endorsement,
    issuedBy,
    dppNumber,
    verifyText = '',
    photoSrc,
    qrSrc,
    logoSrc,
    shipBgSrc,
  } = data;

  return (
    <div
      className={[
        'relative w-[920px] h-[620px] rounded-[34px] overflow-hidden',
        'shadow-[0_18px_45px_rgba(0,0,0,0.25)] bg-[#eef2f7]',
        className ?? '',
      ].join(' ')}
    >
      {/* Top blue header */}
      <div className="absolute inset-x-0 top-0 h-[150px] bg-gradient-to-b from-[#0f2a57] to-[#1a3e78]" />

      {/* Header content */}
      <div className="absolute left-[34px] top-[18px] flex items-center gap-4">
        {logoSrc ? (
          <div className="relative w-[92px] h-[92px]">
            <Image src={logoSrc} alt="logo" fill className="object-contain" />
          </div>
        ) : (
          <div className="w-[92px] h-[92px] rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
        )}

        <div className="text-white">
          <div className="text-[46px] font-semibold tracking-wide leading-[1.05]">
            Republic of Panama
          </div>
          <div className="mt-2 text-[28px] font-semibold tracking-[0.08em] text-[#d8c55c]">
            DIGITAL PORT PASS <span className="text-white/80 font-medium">(DPP)</span>
          </div>
        </div>
      </div>

      {/* White separator under header */}
      <div className="absolute inset-x-0 top-[150px] h-[10px] bg-white/70" />

      {/* Main card background */}
      <div className="absolute inset-x-0 top-[160px] bottom-[90px] bg-gradient-to-b from-[#f8fbff] to-[#e9edf6]" />

      {/* Faint ship background on right */}
      {shipBgSrc ? (
        <div className="absolute right-[-40px] top-[170px] w-[520px] h-[360px] opacity-[0.12]">
          <Image src={shipBgSrc} alt="ship background" fill className="object-contain" />
        </div>
      ) : (
        <div className="absolute right-[-60px] top-[190px] w-[560px] h-[320px] rounded-[40px] bg-[#0f2a57]/10 blur-[0px]" />
      )}

      {/* Photo box */}
      <div className="absolute left-[54px] top-[205px] w-[210px] h-[250px] rounded-[18px] bg-[#d7e2f2] overflow-hidden border border-[#b8c6dd]">
        {photoSrc ? (
          <div className="relative w-full h-full">
            <Image src={photoSrc} alt="person photo" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#d7e2f2]">
            <svg className="w-20 h-20 text-[#8fa4c4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
      </div>

      {/* Text block */}
      <div className="absolute left-[290px] top-[210px] w-[420px]">
        <div className="text-[22px] tracking-[0.14em] text-[#364a68] font-medium">
          {nameLine}
        </div>

        <div className="mt-2 text-[54px] leading-[1.0] font-semibold text-[#1f2e4a]">
          {fullName}
        </div>

        <div className="mt-6 text-[34px] text-[#273b5d] font-medium">{country}</div>
        <div className="mt-2 text-[34px] text-[#273b5d] font-medium">{dob}</div>

        <div className="mt-8 text-[28px] text-[#2e3f5f]">{passportLabel}</div>
        <div className="mt-1 text-[38px] font-semibold text-[#182844] tracking-wide">
          {passportId}
        </div>

        <div className="mt-12 h-[1px] bg-[#c8d2e3]" />

        <div className="mt-6 text-[18px] tracking-[0.12em] text-[#5a6f8f] font-semibold">
          {seafarerCapacityLabel}
        </div>
        <div className="mt-6 text-[44px] font-semibold text-[#1f2e4a]">
          {category}
        </div>
        <div className="mt-3 text-[34px] text-[#233554] font-medium">
          {endorsement}
        </div>
      </div>

      {/* QR box */}
      <div className="absolute right-[55px] top-[270px] w-[255px] h-[255px] bg-white rounded-[18px] border border-[#c7d2e3] shadow-[0_12px_25px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="relative w-full h-full p-[14px]">
          <div className="relative w-full h-[190px]">
            <Image src={qrSrc} alt="qr" fill className="object-contain" unoptimized />
          </div>
          {verifyText && (
            <div className="mt-3 text-center text-[18px] text-[#2c3e5c]">
              {verifyText}
            </div>
          )}
        </div>
      </div>

      {/* Bottom blue footer */}
      <div className="absolute inset-x-0 bottom-0 h-[90px] bg-gradient-to-b from-[#0f2a57] to-[#102b5b]" />

      {/* Footer content */}
      <div className="absolute left-[44px] bottom-[22px] flex items-center gap-3 text-white">
        <div className="w-[40px] h-[40px] rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <div className="text-[30px] font-medium">
          {issuedBy}
        </div>
      </div>

      <div className="absolute right-[44px] bottom-[22px] text-[30px] text-white font-semibold">
        {dppNumber}
      </div>

      {/* Outer border */}
      <div className="absolute inset-0 rounded-[34px] border border-white/30 pointer-events-none" />
    </div>
  );
}
