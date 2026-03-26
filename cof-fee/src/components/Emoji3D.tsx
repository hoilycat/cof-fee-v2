import { motion } from 'framer-motion';

// 로컬 이미지 import (경로는 실제 파일 위치에 맞게 꼭 확인하세요!)
import sunImg from '../assets/icons/3dicons-sun-front-color.png';
import moonImg from '../assets/icons/3dicons-moon-front-color.png';
import purpleCupImg from '../assets/icons/3dicons-tea-cup-front-gradient.png'; 
import starImg from '../assets/icons/3dicons-star-dynamic-premium.png';
import heartImg from '../assets/icons/3dicons-heart-front-color.png';
import batteryImg from '../assets/icons/3dicons-battery-front-color.png';
import bulbImg from '../assets/icons/3dicons-bulb-front-color.png'; 

const ICONS_3D: Record<string, string> = {
  Sun_3D: sunImg,
  Moon_3D: moonImg,
  Coffee_3D: purpleCupImg, 
  Sparkles_3D: starImg,
  Heart_3D: heartImg,
  Battery_3D: batteryImg,
  Pill_3D: bulbImg,
};

interface Props {
  type: keyof typeof ICONS_3D | 'Droplet_3D';
  size?: number;
  className?: string;
  animate?: boolean;
  isDark?: boolean; 
}

export const Emoji3D = ({ type, size = 48, className = "", animate = false, isDark = false }: Props) => {
  if (type === 'Droplet_3D') {
    return (
      <span 
        style={{ fontSize: size * 0.85, width: size, height: size }} 
        className={`flex items-center justify-center drop-shadow-md ${className}`}
      >
        💧
      </span>
    );
  }

  return (
    <motion.div 
      style={{ width: size, height: size }} 
      className={`relative flex items-center justify-center ${className}`}
      // 부드러운 유영 효과 (Floating)
      animate={animate ? {
        y: [0, -12, 0], // 위아래 이동 폭
        rotate: [0, 2, 0, -2, 0] // 아주 미세한 회전 추가로 생동감 부여
      } : {}}
      transition={{
        duration: 4, // 4초 동안 천천히
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {isDark && (
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: type === 'Sun_3D' ? '#FDBA74' : type === 'Coffee_3D' ? '#C084FC' : '#FFFFFF' }} 
        />
      )}

      <img 
        src={ICONS_3D[type]} 
        alt={type} 
        style={{ width: '100%', height: '100%' }}
        className={`object-contain relative z-10 ${isDark ? 'brightness-110 contrast-110' : ''}`}
      />
    </motion.div>
  );
};
