export class ShuffleAnimation {
  constructor(options = {}) {
    this.options = {
      duration: 500, // 0.5 seconds as specified
      easing: 'ease-in-out',
      onStart: () => {},
      onComplete: () => {},
      ...options
    };
    this.isAnimating = false;
  }

  async shuffle(element) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const startTime = performance.now();
    const cardStack = element.querySelector('.card-stack');
    
    if (!cardStack) {
      console.error('Card stack element not found');
      this.isAnimating = false;
      return;
    }

    this.options.onStart();

    // Add animation class
    cardStack.classList.add('is-shuffling');

    // Get all cards in the stack
    const cards = Array.from(cardStack.querySelectorAll('.card'));
    const cardCount = cards.length;

    // Set initial transforms
    cards.forEach((card, index) => {
      const delay = (index * 50); // Stagger the animations
      card.style.transitionDelay = `${delay}ms`;
      card.style.transform = 'translateX(0) rotate(0deg)';
    });

    // Animate using requestAnimationFrame
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.options.duration, 1);

      // Apply easing
      const easedProgress = this.easeInOutCubic(progress);

      // Animate each card
      cards.forEach((card, index) => {
        const cardProgress = Math.max(0, Math.min(1, (easedProgress * 2) - (index * 0.2)));
        if (cardProgress > 0) {
          const xOffset = Math.sin(cardProgress * Math.PI) * 20;
          const rotation = Math.sin(cardProgress * Math.PI) * 5;
          card.style.transform = `translateX(${xOffset}px) rotate(${rotation}deg)`;
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        cardStack.classList.remove('is-shuffling');
        cards.forEach(card => {
          card.style.transitionDelay = '';
          card.style.transform = '';
        });
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