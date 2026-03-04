import { ImageSourcePropType } from 'react-native';

export const fallbackCoverImage: ImageSourcePropType = require('../../assets/covers/fallback.png');

export const coverImageByKey: Record<string, ImageSourcePropType> = {
  kyoto: require('../../assets/covers/kyoto.png'),
  lisbon: require('../../assets/covers/lisbon.png'),
  copenhagen: require('../../assets/covers/copenhagen.png'),
  marrakech: require('../../assets/covers/marrakech.png'),
  florida_cover: require('../../assets/covers/florida_cover.png'),
  hyderabad_cover: require('../../assets/covers/hyderabad_cover.png'),
  default: require('../../assets/covers/default.png'),
};

export const coverImageKeys = Object.keys(coverImageByKey).filter((key) => key !== 'default');
