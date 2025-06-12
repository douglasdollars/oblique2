export class CardFlip {
  constructor(options = {}) {
    this.options = {
      duration: 300, // 0.3 seconds as specified
      easing: 'ease-in-out',
      onStart: () => {},
      onComplete: () => {},
      ...options
    };
    this.isAnimating = false;
  }

  async flip(element) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const startTime = performance.now();
    const cardInner = element.querySelector('.card-inner');
    
    if (!cardInner) {
      console.error('Card inner element not found');
      this.isAnimating = false;
      return;
    }

    this.options.onStart();

    // Add animation class
    cardInner.classList.add('is-flipping');

    // Set initial transform
    const currentRotation = cardInner.classList.contains('is-flipped') ? 180 : 0;
    const targetRotation = currentRotation === 0 ? 180 : 0;

    // Animate using requestAnimationFrame
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.options.duration, 1);

      // Apply easing
      const easedProgress = this.easeInOutCubic(progress);
      const currentRotation = easedProgress * (targetRotation - (targetRotation === 180 ? 0 : 180)) + (targetRotation === 180 ? 0 : 180);

      // Apply transform
      cardInner.style.transform = `rotateY(${currentRotation}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        cardInner.classList.remove('is-flipping');
        cardInner.classList.toggle('is-flipped');
        cardInner.style.transform = '';
        this.isAnimating = false;
        this.options.onComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  // Cubic easing function
  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Check if animation is in progress
  isInProgress() {
    return this.isAnimating;
  }

  // Cancel ongoing animation
  cancel() {
    this.isAnimating = false;
  }
} 