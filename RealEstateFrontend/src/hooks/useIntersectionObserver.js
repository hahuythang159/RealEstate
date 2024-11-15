import { useState, useEffect } from 'react';

const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5, // 50% phần tử phải xuất hiện trong viewport
        ...options,
      }
    );

    const element = document.querySelector(options.target);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.target]);

  return isVisible;
};

export default useIntersectionObserver;
