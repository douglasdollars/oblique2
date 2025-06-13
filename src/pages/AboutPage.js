export class AboutPage {
  constructor() {
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'about-page';
    container.innerHTML = `
      <article class="about-content">
        <header class="about-header">
          <h1>About Oblique Strategies</h1>
        </header>

        <section class="about-section">
          <h2>What are Oblique Strategies?</h2>
          <p>
            Oblique Strategies is a set of cards created by musician Brian Eno and artist Peter Schmidt 
            to help break creative blocks and encourage lateral thinking. Each card contains a cryptic 
            remark or instruction designed to help artists, musicians, writers, and other creative 
            individuals approach their work from a new perspective.
          </p>
          <p>
            The cards are meant to be consulted when you feel stuck or need a fresh approach to your 
            creative work. They offer unexpected prompts that can lead to breakthrough moments and 
            innovative solutions.
          </p>
        </section>

        <section class="about-section">
          <h2>The Creators of Oblique Strategies</h2>
          <div class="creators-grid">
            <div class="creator">
              <h3>Brian Eno</h3>
              <p>
                Brian Eno is a renowned musician, composer, and producer who has been influential in 
                the development of ambient music and electronic music. He has worked with artists like 
                David Bowie, U2, and Talking Heads, and is known for his innovative approach to music 
                production and sound design.
              </p>
            </div>
            <div class="creator">
              <h3>Peter Schmidt</h3>
              <p>
                Peter Schmidt was a German-born British painter and multimedia artist. He was known 
                for his experimental approach to art and his interest in the intersection of visual 
                art and music. Schmidt collaborated with Eno on various projects and shared his 
                philosophy of using constraints and chance operations in creative work.
              </p>
            </div>
          </div>
          <h2>The Creator of This Website</h2>
          <div class="creators-grid">
            <div class="creator">
              <h3>Douglas Dollars</h3>
              <p>
                A pretty nice guy!
              </p>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>History and Development</h2>
          <p>
            The first edition of Oblique Strategies was published in 1975, born out of conversations 
            between Eno and Schmidt about their shared interest in cybernetics and the use of systems 
            in creative work. The cards were originally printed in a limited edition of 500 copies.
          </p>
          <p>
            Since then, several editions have been released, each containing slightly different sets 
            of cards. The strategies have been used by countless artists, musicians, and creative 
            professionals around the world to overcome creative obstacles and discover new approaches 
            to their work.
          </p>
        </section>

        <section class="about-section">
          <h2>How to Use Oblique Strategies</h2>
          <div class="usage-instructions">
            <ol>
              <li>
                <strong>When you're stuck:</strong> Draw a card when you encounter a creative block 
                or feel uncertain about how to proceed with your work.
              </li>
              <li>
                <strong>Read and reflect:</strong> Consider the instruction or phrase on the card. 
                Don't worry if it doesn't immediately make sense—let it percolate.
              </li>
              <li>
                <strong>Apply laterally:</strong> Think about how the strategy might apply to your 
                current situation, even if the connection isn't obvious.
              </li>
              <li>
                <strong>Experiment:</strong> Use the card as a starting point for experimentation. 
                The goal is to shift your perspective and try something new.
              </li>
              <li>
                <strong>Trust the process:</strong> Sometimes the most seemingly irrelevant strategies 
                can lead to the most interesting results.
              </li>
            </ol>
          </div>
        </section>

        <section class="about-section">
          <h2>Creative Applications</h2>
          <p>
            Oblique Strategies can be applied to various creative disciplines:
          </p>
          <ul class="applications-list">
            <li><strong>Music:</strong> Composition, arrangement, production, and performance</li>
            <li><strong>Visual Arts:</strong> Painting, drawing, sculpture, and digital art</li>
            <li><strong>Writing:</strong> Fiction, poetry, screenwriting, and journalism</li>
            <li><strong>Design:</strong> Graphic design, product design, and architecture</li>
            <li><strong>Problem Solving:</strong> Business strategy, research, and innovation</li>
            <li><strong>Personal Development:</strong> Decision making and life choices</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>About This Website</h2>
          <p>
            This digital version of Oblique Strategies brings the classic card deck to the web, 
            allowing you to draw cards randomly and explore the full collection. The interface 
            is designed to capture the tactile experience of using physical cards while providing 
            the convenience of digital access.
          </p>
          <p>
            Whether you're a longtime user of Oblique Strategies or discovering them for the first 
            time, we hope this tool helps unlock new creative possibilities in your work.
          </p>
        </section>
      </article>
    `;

    // Replace existing page if it exists
    const existingPage = document.querySelector('.about-page');
    if (existingPage) {
      existingPage.replaceWith(container);
    } else {
      document.querySelector('main').appendChild(container);
    }

    this.element = container;
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 