// Desktop dropdown toggle
const desktopDropdownToggle = document.getElementById('desktop-dropdown-toggle');
const desktopDropdownMenu = document.getElementById('desktop-dropdown-menu');

desktopDropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    desktopDropdownMenu.classList.toggle('show');
    
    // Rotate the chevron icon
    const chevron = desktopDropdownToggle.querySelector('i');
    if (desktopDropdownMenu.classList.contains('show')) {
        chevron.style.transform = 'rotate(180deg)';
    } else {
        chevron.style.transform = 'rotate(0)';
    }
});

// Close desktop dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!desktopDropdownToggle.contains(e.target) && !desktopDropdownMenu.contains(e.target)) {
        desktopDropdownMenu.classList.remove('show');
        desktopDropdownToggle.querySelector('i').style.transform = 'rotate(0)';
    }
});

// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', () => {
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    
    // Reset animations by removing the classes first
    const menuItems = document.querySelectorAll('.mobile-nav-link');
    menuItems.forEach((item) => {
        item.classList.remove('animate__fadeInRight');
        // Force a reflow to restart animation
        void item.offsetWidth;
    });
    
    mobileMenuContainer.classList.add('active');
    mobileMenuBackdrop.classList.add('active');
    
    // Add animation classes to menu items with delay
    menuItems.forEach((item, index) => {
        item.classList.add('animate__fadeInRight');
        item.style.animationDelay = `${0.1 + index * 0.1}s`;
    });
});

// Mobile dropdown toggles
const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const dropdown = toggle.nextElementSibling;
        const chevron = toggle.querySelector('.chevron-icon');
        
        dropdown.classList.toggle('open');
        chevron.classList.toggle('rotate');
    });
});

document.getElementById('menu-close').addEventListener('click', closeMenu);
document.getElementById('mobile-menu-backdrop').addEventListener('click', closeMenu);

function closeMenu() {
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    
    mobileMenuContainer.classList.remove('active');
    mobileMenuBackdrop.classList.remove('active');
}

// Close menu when clicking on a mobile nav link (except dropdown toggles)
document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking on dropdown items
document.querySelectorAll('.mobile-dropdown-item').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Navbar transparency
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.bottom >= 0
        );
    }

    // Function to handle scroll animations
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            if (isInViewport(element) && element.classList.contains('opacity-0')) {
                // Get the animation class from data attribute
                const animationClass = element.getAttribute('data-animation');
                // Get delay if specified
                const delay = element.getAttribute('data-delay') || 0;
                
                // Set delay if specified
                element.style.animationDelay = delay + 'ms';
                
                // Add the animation class and remove opacity-0
                element.classList.add(animationClass);
                element.classList.remove('opacity-0');
            }
        });
    }

    // Run once on load to check for elements already in viewport
    handleScrollAnimations();

    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);
});

// Navbar transparency
window.addEventListener('scroll', () => {
const navbar = document.querySelector('.navbar');
if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
} else {
    navbar.classList.remove('scrolled');
}
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
    });
});
});




window.addEventListener('scroll', function() {
const navbar = document.getElementById('navbar');

if (window.scrollY > 10) {
// Saat di-scroll, navbar mendapatkan efek blur
navbar.classList.remove('bg-transparent');
navbar.classList.add('bg-white/30', 'backdrop-blur-md');
} else {
// Saat di posisi atas, navbar transparan tanpa blur
navbar.classList.add('bg-transparent');
navbar.classList.remove('bg-white/30', 'backdrop-blur-md');
}
});

// Navbar transparency
window.addEventListener('scroll', () => {
const navbar = document.querySelector('.navbar');
if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
} else {
    navbar.classList.remove('scrolled');
}
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
    });
});
});

// Intersection Observer for fade-in animations
const observerOptions = {
root: null,
rootMargin: '0px',
threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    }
});
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
observer.observe(el);
});

function toggleFAQ(element) {
const content = element.nextElementSibling; // Konten FAQ
const icon = element.querySelector('i'); // Ikon panah

if (content.classList.contains('hidden')) {
// Jika konten tersembunyi, tampilkan dengan animasi fadeIn
content.classList.remove('hidden', 'animate__fadeOut');
content.classList.add('animate__fadeIn');
icon.classList.add('rotate'); // Rotasi ikon
} else {
// Jika konten terlihat, sembunyikan dengan animasi fadeOut
content.classList.remove('animate__fadeIn');
content.classList.add('animate__fadeOut');
icon.classList.remove('rotate'); // Reset rotasi ikon

// Sembunyikan konten setelah animasi selesai
content.addEventListener('animationend', () => {
    if (content.classList.contains('animate__fadeOut')) {
        content.classList.add('hidden');
    }
}, { once: true });
}
}