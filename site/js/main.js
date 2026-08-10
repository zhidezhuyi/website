if (!/(^|\s)js(\s|$)/.test(document.documentElement.className)) {
  document.documentElement.className += (document.documentElement.className ? ' ' : '') + 'js';
}

function hasClass(element, className) {
  return new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className);
}

function addClass(element, className) {
  if (!element) {
    return;
  }

  if (element.classList) {
    element.classList.add(className);
    return;
  }

  if (!hasClass(element, className)) {
    element.className += (element.className ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if (!element) {
    return;
  }

  if (element.classList) {
    element.classList.remove(className);
    return;
  }

  element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?=\\s|$)', 'g'), ' ').replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
}

function toggleClass(element, className) {
  if (!element) {
    return;
  }

  if (hasClass(element, className)) {
    removeClass(element, className);
  } else {
    addClass(element, className);
  }
}

function forEachNode(nodeList, callback) {
  for (var index = 0; index < nodeList.length; index += 1) {
    callback(nodeList[index], index);
  }
}

var navbar = document.getElementById('navbar');
var backToTop = document.getElementById('backToTop');
var menuToggle = document.getElementById('menuToggle');
var navLinks = document.getElementById('navLinks');
var fadeElements = document.querySelectorAll('.fade-up');
var contactForm = document.getElementById('contactForm');
var sections = document.querySelectorAll('section[id]');
var typingText = document.getElementById('typingText');

function getScrollY() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function handleScroll() {
  var scrollY = getScrollY();

  if (navbar) {
    if (scrollY > 50) {
      addClass(navbar, 'scrolled');
    } else {
      removeClass(navbar, 'scrolled');
    }
  }

  if (backToTop) {
    if (scrollY > 400) {
      addClass(backToTop, 'visible');
    } else {
      removeClass(backToTop, 'visible');
    }
  }
}

window.addEventListener('scroll', handleScroll, false);

if (backToTop) {
  backToTop.addEventListener('click', function () {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', function () {
    toggleClass(menuToggle, 'active');
    toggleClass(navLinks, 'active');
  });

  forEachNode(navLinks.querySelectorAll('a'), function (link) {
    link.addEventListener('click', function () {
      removeClass(menuToggle, 'active');
      removeClass(navLinks, 'active');
    });
  });
}

function revealFadeElements() {
  forEachNode(fadeElements, function (element) {
    addClass(element, 'visible');
  });
}

if (fadeElements.length) {
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      forEachNode(entries, function (entry) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          addClass(entry.target, 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    forEachNode(fadeElements, function (element) {
      observer.observe(element);
    });
  } else {
    revealFadeElements();
  }
}

/* ===== 终端打字动画 ===== */
if (typingText) {
  var typingPhrases = [
    '正在调用销售数据接口，聚合本月订单...',
    '识别出 3 个高增长品类与 2 个异常渠道...',
    '生成趋势图表，撰写分析结论与建议...'
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function typeLoop() {
    var phrase = typingPhrases[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      typingText.textContent = phrase.slice(0, charIndex);

      if (charIndex >= phrase.length) {
        deleting = true;
        window.setTimeout(typeLoop, 2200);
        return;
      }
      window.setTimeout(typeLoop, 55);
    } else {
      charIndex -= 1;
      typingText.textContent = phrase.slice(0, charIndex);

      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        window.setTimeout(typeLoop, 500);
        return;
      }
      window.setTimeout(typeLoop, 22);
    }
  }

  window.setTimeout(typeLoop, 800);
}

/* ===== 联系表单（mailto 兜底） ===== */
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var phone = document.getElementById('phone');
    var message = document.getElementById('message');
    var button = contactForm.querySelector('button[type="submit"]');
    var subject;
    var body;
    var originalText;

    event.preventDefault();

    subject = encodeURIComponent('咨询 - ' + (name ? name.value : ''));
    body = encodeURIComponent(
      '姓名: ' + (name ? name.value : '') + '\n' +
      '邮箱: ' + (email ? email.value : '') + '\n' +
      '电话: ' + (phone ? phone.value : '') + '\n\n' +
      (message ? message.value : '')
    );
    window.location.href = 'mailto:houcan@zhidezhuyi.com?subject=' + subject + '&body=' + body;

    if (!button) {
      return;
    }

    originalText = button.textContent;
    button.textContent = '已打开邮件客户端';
    button.style.background = '#059669';

    window.setTimeout(function () {
      button.textContent = originalText;
      button.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

function updateActiveNav() {
  var scrollY = getScrollY() + 100;

  forEachNode(sections, function (section) {
    var top = section.offsetTop;
    var height = section.offsetHeight;
    var id = section.getAttribute('id');
    var link = document.querySelector('.nav-links a[href="#' + id + '"]');

    if (!link) {
      return;
    }

    if (scrollY >= top && scrollY < top + height) {
      addClass(link, 'active');
    } else {
      removeClass(link, 'active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, false);

handleScroll();
updateActiveNav();
