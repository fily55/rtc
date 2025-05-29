import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { MediaStreamAction } from './mediaStreamTypes';

export const useMediaDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  return (action: MediaStreamAction) => {
    dispatch(action);
  };
}; 