// Modern JavaScript with enhanced interactivity and API integration

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const API_BASE_URL = 'http://localhost:3000/api';

  // DOM Elements
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navButtons = document.querySelector('.nav-buttons');
  const bookingForm = document.querySelector('.booking-form');
  const contactForm = document.querySelector('.contact-form');
  const roomCards = document.querySelectorAll('.room-card');
  const diningCards = document.querySelectorAll('.dining-card');
  const eventCards = document.querySelectorAll('.event-card');
  const offerCards = document.querySelectorAll('.offer-card');
  const newsCards = document.querySelectorAll('.news-card');

  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navButtons.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          navButtons.classList.remove('active');
          mobileMenuBtn.classList.remove('active');
        }
      }
    });
  });

  // Navbar Scroll Effect
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      navbar.classList.remove('scroll-up');
      return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
      // Scroll Down
      navbar.classList.remove('scroll-up');
      navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
      // Scroll Up
      navbar.classList.remove('scroll-down');
      navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
  });

  // Hero Slider (Removed - now static background)

  // Guest Counter Logic
  document.querySelectorAll('.guest-counter').forEach(counter => {
    const decrementBtn = counter.querySelector('.decrement');
    const incrementBtn = counter.querySelector('.increment');
    const countDisplay = counter.querySelector('.count-display');
    let count = parseInt(countDisplay.textContent);

    decrementBtn.addEventListener('click', () => {
      if (count > 0) { // Allow 0 kids
        if (counter.parentElement.classList.contains('adults') && count === 1) {
          // Do nothing if it's adults and count is 1 (minimum 1 adult)
        } else {
          count--;
          countDisplay.textContent = count;
        }
      }
    });

    incrementBtn.addEventListener('click', () => {
      count++;
      countDisplay.textContent = count;
    });
  });

  // Image Gallery Modal
  function createImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <img src="" alt="Enlarged view">
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  const imageModal = createImageModal();
  const modalImg = imageModal.querySelector('img');
  const closeModal = imageModal.querySelector('.close-modal');

  // Add click handlers for all gallery images
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      imageModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  closeModal.addEventListener('click', () => {
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Room Cards Hover Effect
  roomCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.room-info').style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.room-info').style.transform = 'translateY(100%)';
    });
  });

  // Dining Cards Animation
  diningCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.dining-info').style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.dining-info').style.transform = 'translateY(100%)';
    });
  });

  // Event Cards Animation
  eventCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.event-info').style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.event-info').style.transform = 'translateY(100%)';
    });
  });

  // Booking Form Handling
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const checkInDate = document.getElementById('check-in-date').value;
      const checkOutDate = document.getElementById('check-out-date').value;
      const adultsCount = document.querySelector('.form-group.adults .count-display').textContent;
      const kidsCount = document.querySelector('.form-group.kids .count-display').textContent;

      const bookingData = {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: parseInt(adultsCount),
        kids: parseInt(kidsCount)
      };

      try {
        // Check availability
        const availabilityResponse = await fetch(`${API_BASE_URL}/booking/check-availability`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });

        const availabilityData = await availabilityResponse.json();

        if (availabilityData.available) {
          showNotification('Rooms are available for your selected dates!', 'success');
          showBookingModal(bookingData); // Pass bookingData to modal
        } else {
          showNotification('Sorry, no rooms available for the selected dates.', 'error');
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        showNotification('Error checking availability. Please try again.', 'error');
      }
    });
  }

  // Contact Form Handling
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contactData)
        });

        const data = await response.json();

        if (data.success) {
          showNotification('Message sent successfully! We will get back to you soon.', 'success');
          contactForm.reset();
        } else {
          showNotification('Error sending message. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message. Please try again.', 'error');
      }
    });
  }

  // Notification System
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Booking Modal
  function showBookingModal(bookingData) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Complete Your Booking</h2>
        <form id="final-booking-form">
          <div class="form-group">
            <label for="full-name">Full Name</label>
            <input type="text" id="full-name" name="fullName" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" required>
          </div>
          <div class="form-group">
            <label for="special-requests">Special Requests</label>
            <textarea id="special-requests" name="specialRequests"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Confirm Booking</button>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('#final-booking-form');
    
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const finalBookingData = {
        ...bookingData,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        specialRequests: formData.get('specialRequests')
      };
      
      try {
        const response = await fetch(`${API_BASE_URL}/booking/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(finalBookingData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          showNotification('Booking confirmed! Check your email for details.', 'success');
          modal.remove();
          bookingForm.reset();
        } else {
          showNotification('Error confirming booking. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error submitting booking:', error);
        showNotification('Error confirming booking. Please try again.', 'error');
      }
    });
  }

  // Add CSS for notifications and modals
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      border-radius: 5px;
      color: white;
      font-weight: 500;
      transform: translateX(120%);
      transition: transform 0.3s ease;
      z-index: 1000;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification.success {
      background: #28a745;
    }
    
    .notification.error {
      background: #dc3545;
    }
    
    .notification.info {
      background: #17a2b8;
    }
    
    .image-modal,
    .booking-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      position: relative;
      max-width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .image-modal .modal-content {
      background: transparent;
      padding: 0;
    }
    
    .image-modal img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }
    
    .close-modal {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.5rem;
      color: white;
      cursor: pointer;
      z-index: 1001;
    }
    
    .booking-modal .close-modal {
      color: var(--gray-700);
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--gray-700);
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--gray-300);
      border-radius: 5px;
      font-size: 1rem;
    }
    
    .form-group textarea {
      height: 100px;
      resize: vertical;
    }
  `;

  document.head.appendChild(style);
});
