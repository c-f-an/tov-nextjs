// 이미지 옵션 데이터 타입
export interface ImageOptionData {
  opacity: number; // 0-100
  backgroundType: 'none' | 'solid' | 'gradient';
  solidColor: string; // hex color
  gradientFrom: string; // hex color
  gradientTo: string; // hex color
  gradientDirection: 'to-t' | 'to-b' | 'to-l' | 'to-r' | 'to-tl' | 'to-tr' | 'to-bl' | 'to-br'; // gradient direction
  gradientShape: 'linear' | 'radial'; // gradient shape
}

// 이미지 옵션 데이터를 Tailwind CSS 클래스로 변환
export function imageOptionToTailwind(options: ImageOptionData): string {
  const classes: string[] = [];

  // 투명도 (opacity)
  if (options.opacity < 100) {
    classes.push(`opacity-${options.opacity}`);
  }

  // 배경 설정
  if (options.backgroundType === 'solid' && options.solidColor) {
    classes.push(`bg-[${options.solidColor}]`);
  } else if (options.backgroundType === 'gradient' && options.gradientFrom && options.gradientTo) {
    // 그라데이션 도형 (linear or radial)
    if (options.gradientShape === 'radial') {
      classes.push(`bg-[radial-gradient(circle,${options.gradientFrom},${options.gradientTo})]`);
    } else {
      // 선형 그라데이션 + 방향
      classes.push(`bg-gradient-${options.gradientDirection} from-[${options.gradientFrom}] to-[${options.gradientTo}]`);
    }
  }

  return classes.join(' ');
}

// Tailwind CSS 클래스를 이미지 옵션 데이터로 변환 (역변환)
export function tailwindToImageOption(tailwindClasses: string): ImageOptionData {
  const defaultOptions: ImageOptionData = {
    opacity: 100,
    backgroundType: 'none',
    solidColor: '#ffffff',
    gradientFrom: '#ffffff',
    gradientTo: '#000000',
    gradientDirection: 'to-b',
    gradientShape: 'linear',
  };

  if (!tailwindClasses) return defaultOptions;

  // opacity 추출
  const opacityMatch = tailwindClasses.match(/opacity-(\d+)/);
  if (opacityMatch) {
    defaultOptions.opacity = parseInt(opacityMatch[1]);
  }

  // radial gradient 추출
  if (tailwindClasses.includes('radial-gradient')) {
    defaultOptions.backgroundType = 'gradient';
    defaultOptions.gradientShape = 'radial';

    const radialMatch = tailwindClasses.match(/radial-gradient\(circle,([^,]+),([^)]+)\)/);
    if (radialMatch) {
      defaultOptions.gradientFrom = radialMatch[1];
      defaultOptions.gradientTo = radialMatch[2];
    }
  }
  // linear gradient 추출
  else if (tailwindClasses.includes('bg-gradient-')) {
    defaultOptions.backgroundType = 'gradient';
    defaultOptions.gradientShape = 'linear';

    // 방향 추출
    const directionMatch = tailwindClasses.match(/bg-gradient-(to-[a-z]+)/);
    if (directionMatch) {
      defaultOptions.gradientDirection = directionMatch[1] as any;
    }

    const fromMatch = tailwindClasses.match(/from-\[([^\]]+)\]/);
    if (fromMatch) {
      defaultOptions.gradientFrom = fromMatch[1];
    }

    const toMatch = tailwindClasses.match(/to-\[([^\]]+)\]/);
    if (toMatch) {
      defaultOptions.gradientTo = toMatch[1];
    }
  }
  // solid color 추출
  else if (tailwindClasses.includes('bg-[') && !tailwindClasses.includes('radial-gradient')) {
    defaultOptions.backgroundType = 'solid';

    const bgMatch = tailwindClasses.match(/bg-\[([^\]]+)\]/);
    if (bgMatch) {
      defaultOptions.solidColor = bgMatch[1];
    }
  }

  return defaultOptions;
}
