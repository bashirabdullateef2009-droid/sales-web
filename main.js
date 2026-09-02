
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

