"use client";

import { useEffect, useRef } from 'react';

type EventMap = WindowEventMap & DocumentEventMap & HTMLElementEventMap;

function useEventListener<K extends keyof EventMap>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element: EventTarget = window,
  options?: boolean | AddEventListenerOptions,
) {
  const savedHandler = useRef<(event: EventMap[K]) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: Event) => savedHandler.current?.(event as EventMap[K]);
    
    element.addEventListener(eventName, eventListener, options);
    
    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

export { useEventListener };
