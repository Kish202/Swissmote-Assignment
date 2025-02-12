// src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useWebSocket = (url) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(url);
    
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [url]);

  return socket.current;
};