import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); opacity: 1; }
  50% { transform: rotate(180deg); opacity: 0.5; }
  100% { transform: rotate(360deg); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const SpinnerCore = styled.div<{ size?: number; color?: string }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border: 3px solid ${props => props.color || '#3b82f6'};
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 3px solid transparent;
    border-radius: 50%;
    border-top-color: ${props => props.color || '#3b82f6'};
    opacity: 0.7;
    animation: ${spin} 1.5s linear infinite reverse;
  }
`;

const LoadingText = styled.span<{ color?: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.color || '#6b7280'};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

interface ModernSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
  textColor?: string;
}

export const ModernSpinner: React.FC<ModernSpinnerProps> = ({
  size = 40,
  color = '#3b82f6', // Tailwind blue-500
  text = 'Loading...',
  textColor = '#6b7280' // Tailwind gray-500
}) => {
  return (
    <SpinnerContainer>
      <SpinnerCore size={size} color={color} />
      {text && <LoadingText color={textColor}>{text}</LoadingText>}
    </SpinnerContainer>
  );
};