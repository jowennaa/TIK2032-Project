// main.js - Interactive features for Barcelona Fan Website

document.addEventListener('DOMContentLoaded', function() {
    // 1. Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply smooth scroll for same-page links
            if(this.getAttribute('href').charAt(0) === '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active-link');
            link.style.color = '#FFD700'; // Gold color to highlight current page
            link.style.borderBottom = '2px solid #FFD700';
        }
    });

    // 3. Gallery image hover effect enhancement
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.5)';
                this.querySelector('.caption').style.color = '#FFD700';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                this.querySelector('.caption').style.color = '#ccc';
            });
        });
    }

    // 4. Add dynamic last updated date to the blog page
    if (currentPage === 'blog.html') {
        const articles = document.querySelectorAll('article');
        articles.forEach((article, index) => {
            // Create fake "last updated" dates for blog posts (for demo purposes)
            const today = new Date();
            const daysAgo = index * 2; // Each article is 2 days older than the previous
            today.setDate(today.getDate() - daysAgo);
            
            const dateElement = document.createElement('p');
            dateElement.classList.add('post-date');
            dateElement.textContent = `Last updated: ${today.toLocaleDateString('id-ID')}`;
            dateElement.style.fontSize = '12px';
            dateElement.style.fontStyle = 'italic';
            dateElement.style.textAlign = 'right';
            
            article.appendChild(dateElement);
            
            // Add click effect to expand/collapse articles
            const heading = article.querySelector('h2');
            const originalContent = article.innerHTML;
            let isExpanded = false;
            
            heading.style.cursor = 'pointer';
            
            heading.addEventListener('click', function() {
                if (!isExpanded) {
                    const fullContent = `<h2>${this.textContent}</h2>
                        <p>${article.querySelector('p').textContent}</p>
                        <p>Baca selengkapnya tentang berita terbaru dari FC Barcelona. Artikel ini membahas perkembangan terbaru dan analisis mendalam.</p>
                        <p>Sumber: BarçaZone</p>
                        ${dateElement.outerHTML}`;
                    
                    article.innerHTML = fullContent;
                    article.style.background = 'rgba(0, 0, 0, 0.85)';
                } else {
                    article.innerHTML = originalContent;
                    article.style.background = 'rgba(0, 0, 0, 0.7)';
                }
                isExpanded = !isExpanded;
            });
        });
    }

    // 5. Welcome message with local storage for returning visitors
    const userVisited = localStorage.getItem('visited');
    if (currentPage === 'index.html' || currentPage === '') {
        const container = document.querySelector('.container');
        
        if (!userVisited) {
            // First time visitor
            localStorage.setItem('visited', 'true');
            
            const welcomeMsg = document.createElement('div');
            welcomeMsg.classList.add('welcome-message');
            welcomeMsg.innerHTML = `
                <div style="background-color: rgba(165, 29, 45, 0.9); padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <h3>Selamat datang di Barça Zone!</h3>
                    <p>Terima kasih telah mengunjungi situs penggemar FC Barcelona ini. Nikmati kontennya!</p>
                    <button id="close-welcome" style="background: #004D98; border: none; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                        Tutup
                    </button>
                </div>
            `;
            
            container.appendChild(welcomeMsg);
            
            document.getElementById('close-welcome').addEventListener('click', function() {
                welcomeMsg.style.display = 'none';
            });
        } else {
            // Returning visitor
            const returningMsg = document.createElement('div');
            returningMsg.classList.add('returning-message');
            returningMsg.innerHTML = `
                <div style="background-color: rgba(0, 77, 152, 0.9); padding: 10px; border-radius: 8px; margin-top: 15px;">
                    <p>Selamat datang kembali, Culer! 🔵🔴</p>
                </div>
            `;
            
            container.appendChild(returningMsg);
            
            // Auto-hide the message after 3 seconds
            setTimeout(() => {
                returningMsg.style.display = 'none';
            }, 3000);
        }
    }

    // 6. Simple slideshow for the gallery page
    if (currentPage === 'gallery.html') {
        // Add slideshow controls at the top
        const gallerySection = document.querySelector('.gallery-container');
        const slideShowControls = document.createElement('div');
        slideShowControls.classList.add('slideshow-controls');
        slideShowControls.innerHTML = `
            <div style="margin-bottom: 20px; background: rgba(0, 0, 0, 0.6); padding: 10px; border-radius: 8px; display: inline-block;">
                <button id="start-slideshow" style="background: #A71D2D; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    Mulai Slideshow
                </button>
                <button id="stop-slideshow" style="background: #004D98; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; display: none;">
                    Berhenti
                </button>
            </div>
        `;
        
        gallerySection.parentNode.insertBefore(slideShowControls, gallerySection);
        
        const startSlideshow = document.getElementById('start-slideshow');
        const stopSlideshow = document.getElementById('stop-slideshow');
        let slideshowInterval;
        let currentSlide = 0;
        
        startSlideshow.addEventListener('click', function() {
            this.style.display = 'none';
            stopSlideshow.style.display = 'inline-block';
            
            // Hide all gallery items except the current one
            const items = document.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                if (index !== currentSlide) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'block';
                    item.style.width = '60%';
                    item.style.margin = '0 auto';
                }
            });
            
            // Start the slideshow
            slideshowInterval = setInterval(() => {
                items[currentSlide].style.display = 'none';
                currentSlide = (currentSlide + 1) % items.length;
                items[currentSlide].style.display = 'block';
            }, 3000);
        });
        
        stopSlideshow.addEventListener('click', function() {
            this.style.display = 'none';
            startSlideshow.style.display = 'inline-block';
            
            clearInterval(slideshowInterval);
            
            // Reset the gallery to its original state
            const items = document.querySelectorAll('.gallery-item');
            items.forEach(item => {
                item.style.display = 'block';
                item.style.width = '100%';
                item.style.margin = '0';
            });
        });
    }

    // 7. Contact form validation (for contact page)
    if (currentPage === 'contact.html') {
        // Add a simple contact form
        const contactContainer = document.querySelector('.contact-container');
        const contactForm = document.createElement('div');
        contactForm.innerHTML = `
            <h3 style="margin-top: 30px;">Send Me a Message</h3>
            <form id="contact-form" style="display: grid; gap: 10px;">
                <input type="text" id="name" placeholder="Your Name" required style="padding: 8px; border-radius: 5px; border: none;">
                <input type="email" id="email" placeholder="Your Email" required style="padding: 8px; border-radius: 5px; border: none;">
                <textarea id="message" placeholder="Your Message" rows="5" required style="padding: 8px; border-radius: 5px; border: none;"></textarea>
                <button type="submit" style="background: #A71D2D; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
                    Send Message
                </button>
            </form>
            <div id="form-result" style="margin-top: 15px;"></div>
        `;
        
        contactContainer.appendChild(contactForm);
        
        // Add form validation
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const formResult = document.getElementById('form-result');
            
            // Simple validation
            if (name.length < 2) {
                formResult.innerHTML = '<p style="color: #ff6b6b;">Name must be at least 2 characters long.</p>';
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                formResult.innerHTML = '<p style="color: #ff6b6b;">Please enter a valid email address.</p>';
                return;
            }
            
            if (message.length < 10) {
                formResult.innerHTML = '<p style="color: #ff6b6b;">Message must be at least 10 characters long.</p>';
                return;
            }
            
            // If validation passes, show success message
            formResult.innerHTML = `
                <div style="background-color: rgba(75, 181, 67, 0.8); padding: 10px; border-radius: 5px;">
                    <p>Thank you, ${name}! Your message has been sent.</p>
                    <p>We'll reply to ${email} as soon as possible.</p>
                </div>
            `;
            
            // Reset form
            this.reset();
        });
    }

    // 8. Add "Back to Top" button that appears when scrolling
    const backToTopBtn = document.createElement('button');
    backToTopBtn.textContent = '↑';
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '20px';
    backToTopBtn.style.right = '20px';
    backToTopBtn.style.display = 'none';
    backToTopBtn.style.backgroundColor = '#004D98';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.border = 'none';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.width = '40px';
    backToTopBtn.style.height = '40px';
    backToTopBtn.style.fontSize = '20px';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.zIndex = '999';
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});