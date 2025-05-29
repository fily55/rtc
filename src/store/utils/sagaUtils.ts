import { takeLatest, ForkEffect, put, PutEffect } from 'redux-saga/effects';
import { MediaStreamAction } from '../mediaStreamTypes';

export function takeLatestMedia(
  pattern: MediaStreamAction['type'],
  saga: (action: MediaStreamAction) => Generator
): ForkEffect {
  return takeLatest<MediaStreamAction>(pattern, saga);
} 

export function putMedia(action: MediaStreamAction): PutEffect<MediaStreamAction> {
    return put(action);
}