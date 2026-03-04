import { ImageSourcePropType } from 'react-native';
import { fallbackCoverImage } from '../assets/coverImages';

export const imageByKey: Record<string, ImageSourcePropType> = {
  kyoto: { uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  lisbon: { uri: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=1200&q=80' },
  copenhagen: { uri: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80' },
  marrakech: { uri: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80' },
  florida_cover: { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  hyderabad_cover: { uri: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  default: { uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80' },
};

export const coverImageKeys = Object.keys(imageByKey).filter((key) => key !== 'default');
export { fallbackCoverImage };
