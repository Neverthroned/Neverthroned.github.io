document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll('.portfolio-item');

  const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= window.innerHeight - offset;
  };

  const displayScrollElement = (element) => {
    element.classList.add('in-view');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
      if (elementInView(el, 100)) displayScrollElement(el);
    });
  };

  // Run on scroll and on page load
  window.addEventListener('scroll', handleScrollAnimation);
  handleScrollAnimation(); // initial check
});