declare module 'aplayer' {
    interface Audio {
      name: string;
      artist: string;
      url: string;
      cover: string;
      lrc: string;
      [key: string]: any;
    }
  
    interface APlayerOptions {
      container: HTMLElement;
      fixed?: boolean;
      autoplay?: boolean;
      mini?: boolean;
      theme?: string;
      loop?: 'all' | 'one' | 'none';
      order?: 'list' | 'random';
      volume?: number;
      audio: Audio[];
    }
  
    class APlayer {
      constructor(options: APlayerOptions);
      currentTime: number;
      paused: boolean;
      volume: number;
      play(): void;
      pause(): void;
      destroy(): void;
    }
  
    export default APlayer;
  }
  
  // 扩展 Window 类型
  interface Window {
    APlayer: typeof import('aplayer').default;
  }