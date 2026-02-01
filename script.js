/* ================================================
   CHOHAN'S SALOON - Interactive JavaScript
   All functionality for animations, booking, and UI
   ================================================ */

// ================================================
// GLOBAL VARIABLES & CONFIGURATION
// ================================================
const CONFIG = {
  businessHours: { open: 10, close: 23 }, // 10 AM - 11 PM
  whatsappNumber: '923205719979',
  emailjs: {
    publicKey: 'YOUR_PUBLIC_KEY', // User needs to replace this
    serviceId: 'service_mixheij',
    templateId: 'YOUR_TEMPLATE_ID' // User needs to replace this
  }
};

// Simulated booked slots (in real app, this would come from backend)
let bookedSlots = {};

// ================================================
// DOM READY
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initBeforeAfterSlider();
  initScrollAnimations();
  initServiceFilters();
  initGalleryLightbox();
  initTestimonialsSlider();
  initBookingForm();
  initFormInteractions();
  initFAQ();
  initNewsletter();

  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init(CONFIG.emailjs.publicKey);
  }
});

// ================================================
// NAVIGATION
// ================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      // Check if current page matches href (for multi-page)
      const path = window.location.pathname;
      const pageName = path.split('/').pop() || 'index.html';

      if (href === pageName || (href === 'index.html' && path.endsWith('/'))) {
        link.classList.add('active');
      }
    });
  });

  // Set active link on load
  const path = window.location.pathname;
  const pageName = path.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') === pageName) {
      link.classList.add('active');
    }
  });
}

// ================================================
// HERO PARTICLES
// ================================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particle.style.animationDuration = `${10 + Math.random() * 10}s`;
    container.appendChild(particle);
  }
}

// ================================================
// BEFORE/AFTER SLIDER
// ================================================
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfter');
  const slider = document.getElementById('baSlider');
  const afterImage = container?.querySelector('.ba-after');

  if (!container || !slider || !afterImage) return;

  let isDragging = false;

  const updateSliderPosition = (x) => {
    const rect = container.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));

    slider.style.left = `${position}%`;
    afterImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
  };

  // Mouse events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      updateSliderPosition(e.clientX);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSliderPosition(e.touches[0].clientX);
  });

  container.addEventListener('touchmove', (e) => {
    if (isDragging) {
      updateSliderPosition(e.touches[0].clientX);
    }
  });

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Initialize at 50%
  updateSliderPosition(container.getBoundingClientRect().left + container.offsetWidth / 2);
}

// ================================================
// SCROLL ANIMATIONS
// ================================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// ================================================
// SERVICE FILTERS
// ================================================
function initServiceFilters() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      // Filter cards
      serviceCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.remove('visible');
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}

// ================================================
// GALLERY LIGHTBOX
// ================================================
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    images.push(img.src);

    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox(images[currentIndex]);
    });
  });

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

// ================================================
// TESTIMONIALS SLIDER
// ================================================
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('#testimonialsDots .dot');
  const cards = track?.querySelectorAll('.testimonial-card');

  if (!track || !cards) return;

  let currentSlide = 0;
  const totalSlides = cards.length;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Auto-slide
  setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);
}

// ================================================
// FAQ ACCORDION
// ================================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// ================================================
// NEWSLETTER FORM
// ================================================
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input').value;

    // Simulate submission
    const button = form.querySelector('button');
    const originalText = button.textContent;

    button.textContent = 'Subscribed!';
    button.disabled = true;
    button.style.backgroundColor = 'var(--color-success)';

    alert(`Thanks for subscribing! We'll send updates to ${email}`);
    form.reset();

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      button.style.backgroundColor = '';
    }, 3000);
  });
}

// ================================================
// BOOKING FORM
// ================================================
function initBookingForm() {
  const dateInput = document.getElementById('appointmentDate');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const form = document.getElementById('appointmentForm');

  // Set minimum date to today
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = formatDate(today);
  dateInput.max = formatDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)); // 30 days ahead

  // Generate time slots when date changes
  dateInput.addEventListener('change', () => {
    generateTimeSlots(dateInput.value);
  });

  // Form submission
  form.addEventListener('submit', handleFormSubmit);

  // Generate initial time slots
  generateTimeSlots(dateInput.value);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generateTimeSlots(selectedDate) {
  const container = document.getElementById('timeSlots');
  container.innerHTML = '';

  const { open, close } = CONFIG.businessHours;
  const now = new Date();
  const isToday = selectedDate === formatDate(now);

  for (let hour = open; hour < close; hour++) {
    for (let min = 0; min < 60; min += CONFIG.slotDuration) {
      const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const displayTime = formatTimeDisplay(hour, min);

      // Check if slot is in the past (for today)
      let isDisabled = false;
      if (isToday) {
        const slotTime = new Date();
        slotTime.setHours(hour, min, 0, 0);
        if (slotTime <= now) {
          isDisabled = true;
        }
      }

      // Check if slot is fully booked
      const slotKey = `${selectedDate}-${timeString}`;
      if (bookedSlots[slotKey] >= CONFIG.maxConcurrentBookings) {
        isDisabled = true;
      }

      const slot = document.createElement('div');
      slot.className = `time-slot${isDisabled ? ' disabled' : ''}`;
      slot.textContent = displayTime;
      slot.dataset.time = timeString;

      if (!isDisabled) {
        slot.addEventListener('click', () => selectTimeSlot(slot));
      }

      container.appendChild(slot);
    }
  }
}

function formatTimeDisplay(hour, min) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
}

function selectTimeSlot(slot) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  slot.classList.add('selected');
}

function initFormInteractions() {
  // Service selection
  const serviceOptions = document.querySelectorAll('.service-option');
  serviceOptions.forEach(option => {
    option.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      updatePriceSummary();
    });
  });

  // Add-on selection
  const addonOptions = document.querySelectorAll('.addon-option');
  addonOptions.forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('selected');
      const checkbox = option.querySelector('input[type="checkbox"]');
      checkbox.checked = option.classList.contains('selected');
      updatePriceSummary();
    });
  });
}

function updatePriceSummary() {
  const priceItemsContainer = document.getElementById('priceItems');
  const totalPriceElement = document.getElementById('totalPrice');

  let total = 0;
  let html = '';

  // Selected service
  const selectedService = document.querySelector('.service-option.selected');
  if (selectedService) {
    const serviceName = selectedService.querySelector('.service-option-name').textContent;
    const servicePrice = parseInt(selectedService.dataset.price);
    total += servicePrice;
    html += `<div class="price-item"><span>${serviceName}</span><span>Rs. ${servicePrice}</span></div>`;
  }

  // Selected add-ons
  const selectedAddons = document.querySelectorAll('.addon-option.selected');
  selectedAddons.forEach(addon => {
    const addonName = addon.querySelector('.service-option-name').textContent;
    const addonPrice = parseInt(addon.dataset.price);
    total += addonPrice;
    html += `<div class="price-item"><span>${addonName}</span><span>Rs. ${addonPrice}</span></div>`;
  });

  if (html === '') {
    html = '<div class="price-item"><span>Select a service to see pricing</span><span>-</span></div>';
  }

  priceItemsContainer.innerHTML = html;
  totalPriceElement.textContent = `Rs. ${total}`;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  // Gather form data
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const date = document.getElementById('appointmentDate').value;
  const selectedTimeSlot = document.querySelector('.time-slot.selected');
  const selectedService = document.querySelector('.service-option.selected');
  const selectedAddons = document.querySelectorAll('.addon-option.selected');
  const confirmCheckbox = document.getElementById('confirmBooking');

  // Validation
  if (!name || !phone || !date) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!selectedTimeSlot) {
    alert('Please select a time slot.');
    return;
  }

  if (!selectedService) {
    alert('Please select a service.');
    return;
  }

  if (!confirmCheckbox.checked) {
    alert('Please confirm your appointment.');
    return;
  }

  // Build booking details
  const time = selectedTimeSlot.dataset.time;
  const serviceName = selectedService.querySelector('.service-option-name').textContent;
  const servicePrice = parseInt(selectedService.dataset.price);

  let addons = [];
  let addonsTotal = 0;
  selectedAddons.forEach(addon => {
    const name = addon.querySelector('.service-option-name').textContent;
    const price = parseInt(addon.dataset.price);
    addons.push({ name, price });
    addonsTotal += price;
  });

  const totalPrice = servicePrice + addonsTotal;

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = formatTimeFromString(time);

  // Show confirmation modal
  const confirmationDetails = document.getElementById('confirmationDetails');
  confirmationDetails.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Name</span>
      <span class="detail-value">${name}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Phone</span>
      <span class="detail-value">${phone}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${formattedDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Time</span>
      <span class="detail-value">${formattedTime}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Service</span>
      <span class="detail-value">${serviceName}</span>
    </div>
    ${addons.length > 0 ? `
    <div class="detail-row">
      <span class="detail-label">Add-ons</span>
      <span class="detail-value">${addons.map(a => a.name).join(', ')}</span>
    </div>
    ` : ''}
    <div class="detail-row" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
      <span class="detail-label" style="font-weight: 700;">Total</span>
      <span class="detail-value" style="color: #d4af37; font-weight: 700;">Rs. ${totalPrice}</span>
    </div>
  `;

  document.getElementById('bookingConfirmation').classList.add('active');

  // Simulate booking slot
  const slotKey = `${date}-${time}`;
  bookedSlots[slotKey] = (bookedSlots[slotKey] || 0) + 1;

  // In a real application, this would send an email to the admin
  // For now, we'll log the booking details
  console.log('Booking submitted:', {
    name,
    phone,
    date,
    time,
    service: serviceName,
    addons,
    total: totalPrice,
    adminEmail: CONFIG.adminEmail
  });

  // Simulate sending email notification (in real app, this would be a server call)
  sendBookingNotification({
    name,
    phone,
    date: formattedDate,
    time: formattedTime,
    service: serviceName,
    addons: addons.map(a => a.name).join(', ') || 'None',
    total: totalPrice
  });

  // Reset form
  e.target.reset();
  document.querySelectorAll('.service-option, .addon-option, .time-slot').forEach(el => {
    el.classList.remove('selected');
  });
  updatePriceSummary();
}

function formatTimeFromString(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

async function sendBookingNotification(booking) {
  // Check if EmailJS is configured
  if (CONFIG.emailjs.publicKey === 'YOUR_PUBLIC_KEY') {
    console.log('EmailJS not configured. Booking details:', booking);
    alert('Booking simulation successful! To send real emails, please configure EmailJS in script.js');
    return;
  }

  const templateParams = {
    to_name: 'Chohan Saloon Admin',
    from_name: booking.name,
    customer_name: booking.name,
    customer_phone: booking.phone,
    appointment_date: booking.date,
    appointment_time: booking.time,
    service_name: booking.service,
    addons: booking.addons,
    total_price: `Rs. ${booking.total}`,
    reply_to: booking.phone // Using phone as contact since we don't have simulated customer email
  };

  try {
    const button = document.querySelector('#appointmentForm button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending...';
    }

    await emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.templateId,
      templateParams
    );

    console.log('Email sent successfully!');

  } catch (error) {
    console.error('Failed to send email:', error);
    alert('Booking confirmed, but failed to send email notification. Please contact us directly.');

  } finally {
    const button = document.querySelector('#appointmentForm button[type="submit"]');
    if (button) {
      button.disabled = false;
      button.textContent = '✨ Confirm Appointment';
    }
  }
}

function closeConfirmation() {
  document.getElementById('bookingConfirmation').classList.remove('active');
}

// Make closeConfirmation available globally
window.closeConfirmation = closeConfirmation;

// ================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ================================================
// INITIALIZE SERVICE CARD CLICK FOR BOOKING
// ================================================
document.querySelectorAll('.service-card .btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.service-card');
    const serviceName = card.querySelector('.service-name').textContent;

    // Scroll to booking
    document.getElementById('booking').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Pre-select the service in booking form
    setTimeout(() => {
      const serviceOptions = document.querySelectorAll('.service-option');
      serviceOptions.forEach(option => {
        const optionName = option.querySelector('.service-option-name').textContent;
        if (optionName.includes(serviceName) || serviceName.includes(optionName.split(' ')[0])) {
          option.click();
        }
      });
    }, 500);
  });
});
