/**
 * 井春堂钢管厂 - 交互脚本
 */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // 1. 导航栏滚动效果
  // ============================================
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // 导航栏阴影
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // 回到顶部按钮
    if (backToTop) {
      if (scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初始化

  // ============================================
  // 2. 移动端菜单切换
  // ============================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navbar-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // 点击链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ============================================
  // 3. 回到顶部按钮
  // ============================================
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 4. FAQ 手风琴展开/收起
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // 关闭所有
        faqItems.forEach(function (other) {
          other.classList.remove('active');
          var otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
          }
        });

        // 如果之前不是激活状态，则打开
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // ============================================
  // 5. 数字滚动动画（统计数据）
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateNumber(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var unit = el.querySelector('.unit');
    var unitText = unit ? unit.textContent : '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = Math.floor(eased * target);

      if (unit) {
        el.textContent = current.toLocaleString();
        el.appendChild(unit);
      } else {
        el.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (unit) {
          el.textContent = target.toLocaleString();
          el.appendChild(unit);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
    }

    requestAnimationFrame(step);
  }

  // 使用 IntersectionObserver 触发
  if (statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  // ============================================
  // 6. 表单提交处理
  // ============================================
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // 清除之前的错误
      var errorGroups = contactForm.querySelectorAll('.form-group.has-error');
      errorGroups.forEach(function (g) { g.classList.remove('has-error'); });

      var isValid = true;

      // 验证姓名
      var nameInput = contactForm.querySelector('#name');
      if (nameInput && nameInput.value.trim().length < 2) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // 验证电话
      var phoneInput = contactForm.querySelector('#phone');
      var phoneRegex = /^1[3-9]\d{9}$/;
      if (phoneInput && !phoneRegex.test(phoneInput.value.trim())) {
        phoneInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // 验证公司
      var companyInput = contactForm.querySelector('#company');
      if (companyInput && companyInput.value.trim().length < 2) {
        companyInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        // 隐藏表单，显示成功提示
        contactForm.style.display = 'none';
        var successMsg = document.querySelector('.form-success');
        if (successMsg) {
          successMsg.classList.add('show');
        }

        // 5秒后重置
        setTimeout(function () {
          contactForm.reset();
          contactForm.style.display = 'block';
          if (successMsg) {
            successMsg.classList.remove('show');
          }
        }, 5000);
      }
    });
  }

  // ============================================
  // 7. 平滑滚动到锚点
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight : 0;
        var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // 8. 滚动进入动画
  // ============================================
  var animateElements = document.querySelectorAll('.animate-in');

  if (animateElements.length > 0) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(function (el) {
      animObserver.observe(el);
    });
  }

  // ============================================
  // 9. 产品筛选（产品中心页面）
  // ============================================
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-card[data-category]');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = this.getAttribute('data-filter');

      // 更新按钮状态
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      // 筛选产品
      productCards.forEach(function (card) {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

});
