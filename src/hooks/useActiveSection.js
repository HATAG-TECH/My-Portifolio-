import { useState, useEffect } from 'react';

// observe section elements and report the id of the section currently in view
export default function useActiveSection(sectionIds = []) {
  const [active, setActive] = useState(sectionIds[0] || '');

  useEffect(() => {
    if (!sectionIds.length) return;

    const options = {
      root: null,
      rootMargin: '0px 0px -60% 0px', // fire when 40% of section is visible
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, options);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
