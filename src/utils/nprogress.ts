import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
if (typeof window !== 'undefined') {
    NProgress.configure({
        showSpinner: false,
        minimum: 0.1,
        easing: 'ease',
        speed: 500
    });
}

export const startProgress = () => {
    if (typeof window !== 'undefined') {
        NProgress.start();
    }
};

export const doneProgress = () => {
    if (typeof window !== 'undefined') {
        NProgress.done();
    }
}; 