import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Cấu hình NProgress
NProgress.configure({
    showSpinner: false,
    minimum: 0.1,
    easing: 'ease',
    speed: 500,
    trickleSpeed: 200,
});

export const startProgress = () => {
    NProgress.start();
};

export const doneProgress = () => {
    NProgress.done();
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