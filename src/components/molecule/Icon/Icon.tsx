import * as LucideIcons from 'lucide-react';
import React from 'react';
import Icons from '../../../constants/icons';
import { useTheme } from '@/theme/ThemeContext';

type LocalIconKeys = keyof typeof Icons;
type LucideIconKeys = keyof typeof LucideIcons;

export type IconNames = LocalIconKeys | LucideIconKeys;

interface IconProps {
  name: IconNames;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'white',
  className = ''
}) => {
  const { theme } = useTheme()
  color = theme === 'dark' ? color : 'black'; // Adjust color based on theme
  
  // Check if icon exists in local icons
  if (Object.prototype.hasOwnProperty.call(Icons, name)) {
    const LocalIcon = Icons[name as LocalIconKeys];
    return <LocalIcon color={color} fill={color} width={size} height={size} />;
  }

  // Check if icon exists in Lucide icons and is a valid component
  if (Object.prototype.hasOwnProperty.call(LucideIcons, name)) {
    const LucideIcon = LucideIcons[name as LucideIconKeys] as React.ComponentType<{ size: number; color: string; className: string }>;
    if (typeof LucideIcon === 'function' || typeof LucideIcon === 'object') {
      return <LucideIcon size={size} color={color} className={className} />;
    }
  }

  console.warn(`Icon "${String(name)}" not found in either local or Lucide icons`);
  return null;
};

export default Icon;
