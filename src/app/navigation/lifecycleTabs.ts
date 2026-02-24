import { TripStatus } from '../../models/trip';

export type LifecycleKey = TripStatus;

export const getLifecycleTabLabel = (key: LifecycleKey) => {
  if (key === 'planning') {
    return 'Plan';
  }
  if (key === 'preparing') {
    return 'Prepare';
  }
  if (key === 'active') {
    return 'Explore';
  }
  return 'Reflect';
};