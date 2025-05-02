import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false
});

export const startProgress = () => {
  NProgress.start();
};

export const doneProgress = () => {
  NProgress.done();
};

let progressTimeout: NodeJS.Timeout;

export const navigateWithProgress = (callback: () => void) => {
  // Clear any existing timeout
  if (progressTimeout) {
    clearTimeout(progressTimeout);
  }

  // Start progress
  startProgress();

  // Execute navigation
  callback();

  // Set a new timeout for done
  progressTimeout = setTimeout(() => {
    doneProgress();
  }, 500);
};

export const configureNProgress = () => {
  // Thêm CSS tùy chỉnh cho NProgress
  const style = document.createElement('style');
  style.innerHTML = `
    #nprogress .bar {
      background: #29d !important;
    }
    #nprogress .peg {
      box-shadow: 0 0 10px #29d, 0 0 5px #29d !important;
    }
  `;
  document.head.appendChild(style);
};