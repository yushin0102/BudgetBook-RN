import { withAlpha } from '../utils/colorUtils';

const main = {
    primary: '#FF8A80', // 馬卡龍粉紅
    secondary: '#82B1FF', // 柔藍
    accent: '#FFD180', // 淡橘
    success: '#69F0AE', // 淺綠
    warning: '#FFEB3B', // 馬卡龍黃
};

const secondary = {
    sky: '#82B1FF', // 柔藍（與主色冷暖平衡）
    mint: '#A5F1D6', // 馬卡龍薄荷綠，適合背景或成功提示
    lavender: '#CBB8FF', // 馬卡龍紫，高雅柔化色
    sand: '#FFE0B2', // 淺杏膚色，用於底色或卡片
    coral: '#FFAB91', // 暖珊瑚橘（比主色略深，按鈕 hover）
    peach: '#FFCCBC', // 淡桃色（比主色略淺，按鈕按下）
};

const gradients = {
    coral: ['#FFAB91', '#FFCCBC'],
    mint: ['#A5F1D6', '#C8F7E7'],
    lavender: ['#CBB8FF', '#E1D7FF'],
    sky: ['#82B1FF', '#B3D9FF'],
};

const error = {
    alert: '#FF5252', // 粉紅紅
};

const black = {
    0: '#FFFFFF',
    20: '#9E9E9E',
    30: '#EEEEEE',
    40: '#E0E0E0',
    50: '#C2C2C2',
    60: '#999999',
    70: '#6F6F6F',
    80: '#505050',
    90: '#303030',
    100: '#070707',
};

const blackOpacity = {
    0: 'rgba(0, 0, 0,0)',
    20: 'rgba(0, 0, 0,0.2)',
    30: 'rgba(0, 0, 0,0.3)',
    40: 'rgba(0, 0, 0,0.4)',
    50: 'rgba(0, 0, 0,0.5)',
    60: 'rgba(0, 0, 0,0.6)',
    70: 'rgba(0, 0, 0,0.7)',
    80: 'rgba(0, 0, 0,0.8)',
    90: 'rgba(0, 0, 0,0.9)',
};

const transparentMain = {
    primary: withAlpha(main.primary, 0.2), // primary 的透明度為 20%
    secondary: withAlpha(main.secondary, 0.2), // secondary 的透明度為 0.2
    accent: withAlpha(main.accent, 0.2), // accent 的透明度為 0.2
    success: withAlpha(main.success, 0.2), // success 的透明度為 0.2
    warning: withAlpha(main.warning, 0.2), // warning 的透明度為 0.2
};

export const colors = {
    white: '#FFFFFF',
    pure_black: '#000000',
    main,
    secondary,
    black,
    error,
    gradients,
    transparentMain,
    blackOpacity,
};

// Tailwind css 參考如下:
/**
 mb-1 到 mb-6 的像素值
mb-1: 4px
mb-2: 8px
mb-3: 12px
mb-4: 16px
mb-5: 20px
mb-6: 24px
h1 到 h5 的字體大小
h1: 36px
h2: 30px
h3: 24px
h4: 20px
h5: 18px
 */
