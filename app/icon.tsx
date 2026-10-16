import { ImageResponse } from 'next/og';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#0C0A07',
        color: '#DBB857',
        fontSize: 48,
        fontFamily: 'serif',
      }}
    >
      P
    </div>,
    size,
  );
}
