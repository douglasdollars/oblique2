export class TableAnimations {
  static async highlightRow(row, type = 'success') {
    const className = `highlight-${type}`;
    row.classList.add(className);
    
    // Add initial glow
    row.style.boxShadow = type === 'success' 
      ? '0 0 15px rgba(255, 215, 0, 0.5)' 
      : '0 0 15px rgba(255, 0, 0, 0.5)';
    
    // Trigger animation
    await this.animateGlow(row);
    
    // Cleanup
    row.classList.remove(className);
    row.style.boxShadow = '';
  }

  static async animateGlow(element) {
    return new Promise(resolve => {
      const keyframes = [
        { opacity: 0.7, offset: 0 },
        { opacity: 1, offset: 0.2 },
        { opacity: 1, offset: 0.8 },
        { opacity: 0, offset: 1 }
      ];

      const animation = element.animate(keyframes, {
        duration: 1500,
        easing: 'ease-in-out'
      });

      animation.onfinish = () => resolve();
    });
  }

  static async fadeOut(element) {
    return new Promise(resolve => {
      const keyframes = [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-10px)' }
      ];

      const animation = element.animate(keyframes, {
        duration: 300,
        easing: 'ease-out'
      });

      animation.onfinish = () => {
        element.style.display = 'none';
        resolve();
      };
    });
  }

  static async fadeIn(element) {
    element.style.display = '';
    return new Promise(resolve => {
      const keyframes = [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ];

      const animation = element.animate(keyframes, {
        duration: 300,
        easing: 'ease-out'
      });

      animation.onfinish = () => resolve();
    });
  }

  static async slideOut(element, direction = 'left') {
    const distance = direction === 'left' ? '-100%' : '100%';
    return new Promise(resolve => {
      const keyframes = [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: `translateX(${distance})`, opacity: 0 }
      ];

      const animation = element.animate(keyframes, {
        duration: 300,
        easing: 'ease-in-out'
      });

      animation.onfinish = () => {
        element.style.display = 'none';
        resolve();
      };
    });
  }

  static async slideIn(element, direction = 'right') {
    const startDistance = direction === 'right' ? '100%' : '-100%';
    element.style.display = '';
    return new Promise(resolve => {
      const keyframes = [
        { transform: `translateX(${startDistance})`, opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ];

      const animation = element.animate(keyframes, {
        duration: 300,
        easing: 'ease-out'
      });

      animation.onfinish = () => resolve();
    });
  }
} 