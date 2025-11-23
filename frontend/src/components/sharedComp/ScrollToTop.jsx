import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Disable the browser's automatic scroll restoration so back/forward
  // navigations don't restore the previous scroll position.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo(0, 0);
    
    // Also use requestAnimationFrame to ensure it happens after DOM updates
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    
    // Multiple attempts to ensure scroll happens
    requestAnimationFrame(() => {
      scrollToTop();
      // Also try after a tiny delay as fallback
      setTimeout(scrollToTop, 0);
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
