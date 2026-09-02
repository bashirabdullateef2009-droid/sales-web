
(function(){
  var revealEls = document.querySelectorAll('[data-reveal]');
  if(!revealEls.length) return;
  if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function(el){ observer.observe(el); });
})();

(function(){
  var loader = document.getElementById('pageLoader');
  function hideLoader(){
    document.body.classList.add('loaded');
    if(loader){
      loader.classList.add('hidden');
      setTimeout(function(){ loader.style.display = 'none'; }, 550);
    }
  }
  if(document.readyState === 'complete'){
    setTimeout(hideLoader, 500);
  } else {
    window.addEventListener('load', function(){
      setTimeout(hideLoader, 500);
    });
  }
  setTimeout(hideLoader, 2500);
})();

(function(){
  var wrap = document.querySelector('.diagram-wrap');
  var layer = document.getElementById('diagramFloat');
  if(!wrap || !layer) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.matchMedia('(max-width: 860px)').matches) return;

  var rafId = null;
  wrap.addEventListener('mousemove', function(e){
    var rect = wrap.getBoundingClientRect();
    var px = (e.clientX - rect.left) / rect.width - 0.5;
    var py = (e.clientY - rect.top) / rect.height - 0.5;
    if(rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function(){
      var rotY = px * 14;
      var rotX = py * -10;
      layer.style.setProperty('--tiltX', rotX.toFixed(2) + 'deg');
      layer.style.setProperty('--tiltY', rotY.toFixed(2) + 'deg');
      layer.style.animationPlayState = 'paused';
      layer.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
    });
  });
  wrap.addEventListener('mouseleave', function(){
    layer.style.transform = '';
    layer.style.animationPlayState = 'running';
  });
})();

(function(){
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', function(){
      var isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    siteNav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

(function(){
  var cart = [];
  var cartPanel = document.getElementById('cartPanel');
  var cartScrim = document.getElementById('cartScrim');
  var cartItemsEl = document.getElementById('cartItems');
  var cartTotalEl = document.getElementById('cartTotal');
  var cartCountEl = document.getElementById('cartCount');
  var whatsappBtn = document.getElementById('cartWhatsapp');

  function formatNaira(n){
    return '₦' + n.toLocaleString('en-NG');
  }

  function openCart(){ cartPanel.classList.add('open'); cartScrim.classList.add('open'); }
  function closeCart(){ cartPanel.classList.remove('open'); cartScrim.classList.remove('open'); }

  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartScrim.addEventListener('click', closeCart);

  function render(){
    cartCountEl.textContent = cart.length;
    if(cart.length === 0){
      cartItemsEl.innerHTML = '<p class="cart-empty">Nothing added yet. Prices update here as you add models below.</p>';
      whatsappBtn.setAttribute('disabled','disabled');
    } else {
      cartItemsEl.innerHTML = cart.map(function(item, i){
        return '<div class="cart-item">' +
          '<span class="cart-item-name">' + item.name + '</span>' +
          '<span class="cart-item-code">' + formatNaira(item.price) + '</span>' +
          '<button data-index="' + i + '" class="remove-item">Remove</button>' +
          '</div>';
      }).join('');
      whatsappBtn.removeAttribute('disabled');
    }
    var total = cart.reduce(function(sum, item){ return sum + item.price; }, 0);
    cartTotalEl.textContent = formatNaira(total);
  }

  cartItemsEl.addEventListener('click', function(e){
    if(e.target.classList.contains('remove-item')){
      var idx = parseInt(e.target.getAttribute('data-index'), 10);
      cart.splice(idx, 1);
      render();
    }
  });

  document.querySelectorAll('.add-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var name = btn.getAttribute('data-name');
      var price = parseInt(btn.getAttribute('data-price'), 10);
      cart.push({name: name, price: price});
      render();
      var original = btn.textContent;
      btn.textContent = 'Added';
      btn.classList.add('added');
      setTimeout(function(){
        btn.textContent = original;
        btn.classList.remove('added');
      }, 1100);
    });
  });

  whatsappBtn.addEventListener('click', function(){
    if(cart.length === 0) return;
    var lines = cart.map(function(item){ return '- ' + item.name + ' (' + formatNaira(item.price) + ')'; });
    var total = cart.reduce(function(sum, item){ return sum + item.price; }, 0);
    var message = 'Hi AyoTech, I\'d like to order:\n' + lines.join('\n') + '\n\nTotal: ' + formatNaira(total);
    window.open('https://wa.me/2348106274076?text=' + encodeURIComponent(message), '_blank');
  });

  render();
})();

