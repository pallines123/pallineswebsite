const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add("show")
        } else {
            entry.target.classList.remove("show")
        }
    })
}, { threshold: 0.1 })

const sections = document.querySelectorAll(".home, .idea, .team, .work")
sections.forEach(el => observer.observe(el))

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        if(href === '#') return;  // ignore buttons with just '#'
        
        const target = document.querySelector(href);
        if(target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if(window.scrollY > 70) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

var i = 0;
var txt = 'Per il progetto di pubblicita della Pirelli.';
var speed = 50;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("demo").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

// only starts when home section becomes visible
const homeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            i = 0;  // reset
            document.getElementById("demo").innerHTML = '';  // clear text
            typeWriter();  // start typing
        }
    })
}, { threshold: 0.5 })

homeObserver.observe(document.querySelector(".home"))

const root = document.documentElement;
const finalText = "TRACK";
const colors = [root.style.getPropertyValue("--basictext"), "#ffc60b", "#ff362f"];
let isRunning = false;
let lastColor = null;

function getRandomColor() {
    let available = colors.filter(c => c !== lastColor);
    let color = available[Math.floor(Math.random() * available.length)];
    lastColor = color;
    return color;
}

function typeEffect(element, text, color, callback) {
    element.style.color = color;
    element.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;
        if(i >= text.length) {
            clearInterval(interval);
            if(callback) setTimeout(callback, 1000);
        }
    }, 100);
}

function deleteEffect(element, callback) {
    let text = element.innerHTML;
    const interval = setInterval(() => {
        text = text.slice(0, -1);
        element.innerHTML = text;
        if(text.length === 0) {
            clearInterval(interval);
            if(callback) setTimeout(callback, 300);
        }
    }, 80);
}

function startSequence() {
    if(isRunning) return;  // stops double triggers
    isRunning = true;

    const el = document.getElementById("typetrack");

    typeEffect(el, finalText, getRandomColor(), () => {
        setTimeout(() => {
            deleteEffect(el, () => {
                typeEffect(el, finalText, getRandomColor(), () => {
                    setTimeout(() => {
                        deleteEffect(el, () => {
                            isRunning = false;  // reset flag before looping
                            startSequence();
                        });
                    }, 10000);
                });
            });
        }, 10000);
    });
}

// CSS blinking cursor
const style = document.createElement('style');
style.innerHTML = `
    .cursor {
        animation: blink 0.8s step-end infinite;
        font-family: "acier-bat-solid";
        font-size: 12rem;
        font-weight: 400;
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// start when home is visible
const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting && !isRunning) {
            startSequence();
        }
    })
}, { threshold: 0.5 })

scrambleObserver.observe(document.querySelector(".home"))

let isDark = false;

document.getElementById("theme-btn").addEventListener("click", function() {
    const icon = document.getElementById("theme-icon");
    isDark = !isDark;

    if(isDark) {
        root.style.setProperty('--background', "#0e0e10");
        root.style.setProperty('--basictext', 'white');
        root.style.setProperty('--secondarytext', "#a8a8a8");
        root.style.setProperty('--navbarseparator', "#383838");
        root.style.setProperty('--imgfilter', 1);
        icon.src = "images/moon-svgrepo-com.svg";   // changes to moon in dark mode
    } else {
        root.style.setProperty('--background', "#ffffff");
        root.style.setProperty('--basictext', '#000000');
        root.style.setProperty('--secondarytext', "#4b4b4b");
        root.style.setProperty('--navbarseparator', "#cccccc");
        root.style.setProperty('--imgfilter', 0);
        icon.src = "images/sun-svgrepo-com.svg";    // changes back to sun in light mode
    }
});

const cards = document.querySelectorAll('.carousel-card');
const dots = document.querySelectorAll('.dot');
let current = 0;

const workLabels = ['MANIFESTO', 'LOGO', 'EDIT', 'PUBBLICITA'];

const bgText = document.getElementById('work-bg-text');

function goTo(index) {
    const next = (index + cards.length) % cards.length;
    const direction = index > current ? 'left' : 'right';

    // update background text
    bgText.style.opacity = '0';
    setTimeout(() => {
        bgText.textContent = workLabels[next];
        bgText.style.opacity = '0.05';
    }, 150);

    // rest of your existing goTo code...
    cards.forEach(c => {
        c.classList.remove('active', 'exit-left', 'exit-right');
        c.style.animationName = '';
    });

    cards[current].classList.add(direction === 'left' ? 'exit-left' : 'exit-right');
    dots[current].classList.remove('active');

    current = next;
    cards[current].style.animationName = direction === 'left' ? 'slideIn' : 'slideInLeft';
    cards[current].classList.add('active');
    dots[current].classList.add('active');

    setTimeout(() => {
        cards.forEach(c => c.classList.remove('exit-left', 'exit-right'));
    }, 300);
}

document.querySelector('.prev').addEventListener('click', () => goTo(current - 1));
document.querySelector('.next').addEventListener('click', () => goTo(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');

document.querySelectorAll('.fullscreen-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const img = this.closest('.carousel-card').querySelector('img');
        const fullscreenSrc = img.getAttribute('data-fullscreen') || img.src;
        overlayImg.src = fullscreenSrc;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelector('.overlay-close').addEventListener('click', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

overlay.addEventListener('click', function(e) {
    if(e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.querySelectorAll('[data-work]').forEach(btn => {
    btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-work'));
        goTo(index);  // uses your existing goTo function
    });
});