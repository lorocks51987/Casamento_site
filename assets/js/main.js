document.addEventListener('DOMContentLoaded', ready, false);

const THEME_PREF_STORAGE_KEY = "theme-preference";
const THEME_TO_ICON_CLASS = {
    'dark': 'feather-moon',
    'light': 'feather-sun'
};
const THEME_TO_ICON_TEXT_CLASS = {
    'dark': 'Dark mode',
    'light': 'Light mode'
};
let toggleIcon = '';
let darkThemeCss = '';

const HEADING_TO_TOC_CLASS = {
    'H1': 'level-1',
    'H2': 'level-2',
    'H3': 'level-3',
    'H4': 'level-4'
}

// Sound interaction
const clickSound = new Audio('/audio/click.mp3');
clickSound.volume = 0.5;

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.log("Erro ao tocar som:", err));
}

// Scroll Reveal Animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        'main#content h1, main#content h2, main#content h3, main#content p, main#content hr, ' +
        'main#content ul li, main#content ol li, .gallery-item, .timeline-item, ' +
        '.home-title, .wedding-verse, .home-date-subtitle, .save-the-date, .wedding-countdown-container, .rsvp-container, ' +
        '.mural-item, .history-item, .carta-noivos, .carta-section, .btn-spotify, .form-group'
    );

    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        // Sort entries by their vertical position to ensure top-to-bottom staggering
        const sortedEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

        sortedEntries.forEach((entry, index) => {
            // Apply a slight delay to each element that enters at the same time
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 100); 
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => observer.observe(el));
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.15;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// Splash Screen Removal
window.addEventListener('load', () => {
    if (document.getElementById('splash-screen')) {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 1200); // Slower 1.2s delay for a deliberate reveal
    } else {
        document.body.classList.add('loaded');
    }
});

function ready() {
    feather.replace({ 'stroke-width': 1, width: 20, height: 20 });
    setThemeByUserPref();
    initScrollReveal();
    initParallax();
    initGalleryLightbox();
    initNetlifyAjaxForms();

    // Interactive elements click sound with navigation delay
    document.querySelectorAll('.nav-link a, .nav-item a, .btn-rsvp').forEach(link => {
        link.addEventListener('click', (e) => {
            const url = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Se for link externo ou abrir em nova aba, toca o som e segue normal
            if (target === '_blank' || url.startsWith('http') && !url.includes(window.location.hostname)) {
                playClickSound();
                return;
            }

            // Para links internos, cancela o clique, toca o som e navega após delay
            e.preventDefault();
            playClickSound();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = url;
            }, 150);
        });
    });

    if (document.querySelector('main#content > .container') !== null &&
        document.querySelector('main#content > .container').classList.contains('post')) {
        if (document.getElementById('TableOfContents') !== null) {
            fixTocItemsIndent();
            createScrollSpy();
        } else {
            document.querySelector('main#content > .container.post').style.display = "block";
        }
    }

    // Elements to inject
    const svgsToInject = document.querySelectorAll('img.svg-inject');
    // Do the injection
    if (svgsToInject.length) {
        SVGInjector(svgsToInject, {
            afterAllInjections: () => {
                // Normalize once after injection (avoids observing whole DOM)
                requestAnimationFrame(normalizeInjectedSvgPaths);
            }
        });
    }

    function normalizeInjectedSvgPaths() {
        document.querySelectorAll('.nav-link a svg').forEach(svg => {
            // Some icons are feather SVGs and shouldn't be altered
            if (svg.classList && svg.classList.contains('feather')) return;
            // Defensive: only normalize if we can read the bbox
            const bbox = svg.getBBox?.();
            if (!bbox || !bbox.width || !bbox.height) return;

            const scaleX = 20 / bbox.width;
            const scaleY = 20 / bbox.height;
            const scale = Math.min(scaleX, scaleY);

            svg.setAttribute('transform', `scale(${scale}) translate(${-bbox.x}, ${-bbox.y})`);
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '1');
            svg.setAttribute('fill', 'transparent');
        });
    }

    const hamburgerToggle = document.getElementById('hamburger-menu-toggle');
    if (hamburgerToggle) hamburgerToggle.addEventListener('click', () => {
        const hamburgerMenu = document.getElementsByClassName('nav-hamburger-list')[0]
        const hamburgerMenuToggleTarget = document.getElementById("hamburger-menu-toggle-target")
        playClickSound();
        if (hamburgerMenu.classList.contains('visibility-hidden')) {
            hamburgerMenu.classList.remove('visibility-hidden');
            hamburgerMenuToggleTarget.setAttribute("aria-checked", "true");
        } else {
            hamburgerMenu.classList.add('visibility-hidden');
            hamburgerMenuToggleTarget.setAttribute("aria-checked", "false");
        }
    })
}

function initGalleryLightbox() {
    const modal = document.getElementById("wedding-lightbox");
    if (!modal) return;

    // Ensure the fixed modal isn't trapped in transformed ancestors (mobile Safari)
    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    const modalImg = document.getElementById("lightbox-img");
    const caption = document.getElementById("lightbox-caption");
    const counter = document.getElementById("lightbox-counter");
    const closeBtn = modal.querySelector(".lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    const images = Array.from(document.querySelectorAll(".gallery-item img"));
    if (!images.length) return;

    let currentIndex = 0;
    const scrollYBeforeOpen = { value: 0 };

    function setBodyLocked(locked) {
        if (locked) {
            // More reliable than overflow hidden on mobile
            scrollYBeforeOpen.value = window.scrollY || 0;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollYBeforeOpen.value}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
        } else {
            const y = scrollYBeforeOpen.value || 0;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            window.scrollTo(0, y);
        }
    }

    function openLightbox(index) {
        currentIndex = index;
        const img = images[currentIndex];
        modal.classList.add("show");
        modalImg.src = img.currentSrc || img.src;
        modalImg.alt = img.alt || "";
        const fileName = (modalImg.src || "").split("/").pop();
        caption.textContent = modalImg.alt && modalImg.alt.toLowerCase() !== (fileName || "").toLowerCase() ? modalImg.alt : "";
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
        setBodyLocked(true);
    }

    function closeLightbox() {
        modal.classList.remove("show");
        setBodyLocked(false);
    }

    function prev() {
        openLightbox((currentIndex - 1 + images.length) % images.length);
    }
    function next() {
        openLightbox((currentIndex + 1) % images.length);
    }

    images.forEach((img, index) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => openLightbox(index));
        // Touch reliability on some mobiles
        img.addEventListener("touchend", (e) => {
            e.preventDefault();
            openLightbox(index);
        }, { passive: false });
    });

    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); next(); });
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeLightbox();
    });
    modal.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("show")) return;
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
        if (e.key === "Escape") closeLightbox();
    });
}

function initNetlifyAjaxForms() {
    // Unifies RSVP + Mural behavior (prevents duplicated inline scripts)
    document.querySelectorAll('form[data-netlify="true"]').forEach((form) => {
        const id = form.getAttribute("id") || "";
        const successId = id ? id.replace("-form", "-success") : "";
        const success = successId ? document.getElementById(successId) : null;
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalBtnText = submitBtn && submitBtn.tagName === "BUTTON" ? submitBtn.textContent : null;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = new FormData(form);
            if (submitBtn) {
                submitBtn.disabled = true;
                if (originalBtnText) submitBtn.textContent = "Enviando...";
            }
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(data).toString()
            })
                .then(() => {
                    form.style.display = "none";
                    if (success) success.style.display = "block";
                })
                .catch(() => {
                    alert("Ops! Erro ao enviar. Por favor, tente novamente.");
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        if (originalBtnText) submitBtn.textContent = originalBtnText;
                    }
                });
        });
    });
}

// Consolidated scroll work (throttled via rAF)
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        const threshold = window.innerWidth <= 820 ? 50 : 100;
        toggleHeaderShadow(threshold);
        scrollTicking = false;
    });
}, { passive: true });

function fixTocItemsIndent() {
    document.querySelectorAll('#TableOfContents a').forEach($tocItem => {
        const itemId = $tocItem.getAttribute("href").substring(1)
        $tocItem.classList.add(HEADING_TO_TOC_CLASS[document.getElementById(itemId).tagName]);
    });
}

function createScrollSpy() {
    var elements = document.querySelectorAll('#toc a');
    let rafPending = false;
    document.addEventListener('scroll', function () {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            elements.forEach(function (element) {
                const targetId = element.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (!target) return;
                const boundingRect = target.getBoundingClientRect();
                if (boundingRect.top <= 55 && boundingRect.bottom >= 0) {
                    elements.forEach(function (elem) {
                        elem.classList.remove('active');
                    });
                    element.classList.add('active');
                }
            });
            rafPending = false;
        });
    }, { passive: true });
}

function toggleHeaderShadow(scrollY) {
    if (window.scrollY > scrollY) {
        document.querySelectorAll('.header').forEach(function (item) {
            item.classList.add('header-shadow')
        })
    } else {
        document.querySelectorAll('.header').forEach(function (item) {
            item.classList.remove('header-shadow')
        })
    }
}

function setThemeByUserPref() {
    darkThemeCss = document.getElementById("dark-theme");
    const savedTheme = localStorage.getItem(THEME_PREF_STORAGE_KEY) ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const darkThemeToggles = document.querySelectorAll('.dark-theme-toggle');
    setTheme(savedTheme, darkThemeToggles);
    darkThemeToggles.forEach(el => el.addEventListener('click', toggleTheme, { capture: true }))
}

function toggleTheme(event) {
    toggleIcon = event.currentTarget.querySelector("a svg.feather");
    if (toggleIcon.classList[1] === THEME_TO_ICON_CLASS.dark) {
        setThemeAndStore('light', [event.currentTarget]);
    } else if (toggleIcon.classList[1] === THEME_TO_ICON_CLASS.light) {
        setThemeAndStore('dark', [event.currentTarget]);
    }
    playClickSound();
}

function setTheme(themeToSet, targets) {
    darkThemeCss.disabled = themeToSet === 'light';
    // Expose theme state to CSS (tokens + overrides)
    document.documentElement.classList.toggle('dark', themeToSet === 'dark');
    document.documentElement.setAttribute('data-theme', themeToSet);
    targets.forEach((target) => {
        target.querySelector('a').innerHTML = feather.icons[THEME_TO_ICON_CLASS[themeToSet].split('-')[1]].toSvg();
        target.querySelector(".dark-theme-toggle-screen-reader-target").textContent = [THEME_TO_ICON_TEXT_CLASS[themeToSet]];
    });
}

function setThemeAndStore(themeToSet, targets) {
    setTheme(themeToSet, targets);
    localStorage.setItem(THEME_PREF_STORAGE_KEY, themeToSet);
}
