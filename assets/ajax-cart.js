var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

const defaults = {
    cartModal: '.js-ajax-cart-modal', // classname
    cartModalContent: '.js-ajax-cart-modal-content', // classname
    cartModalClose: '.js-ajax-cart-modal-close', // classname
    cartDrawer: '.js-ajax-cart-drawer', // classname
    cartDrawerContent: '.js-ajax-cart-drawer-content', // classname
    cartDrawerClose: '.js-ajax-cart-drawer-close', // classname
    cartDrawerTrigger: '.js-ajax-cart-drawer-trigger', // classname
    cartOverlay: '.js-ajax-cart-overlay', // classname
    cartCounter: '.js-ajax-cart-counter', // classname
    addToCart: '.js-ajax-add-to-cart', // classname
    removeFromCart: '.js-ajax-remove-from-cart', //classname
    removeFromCartNoDot: 'js-ajax-remove-from-cart', //classname,
    checkoutButton: '.js-ajax-checkout-button',
    checkoutButton: '.js-ajax-checkout-button',
    sub: '.to', // classname
};

const cartModal = document.querySelector(defaults.cartModal);
const cartModalContent = document.querySelector(defaults.cartModalContent);
const cartModalClose = document.querySelector(defaults.cartModalClose);
const cartDrawer = document.querySelector(defaults.cartDrawer);
const sub = document.querySelector(defaults.sub);
const cartDrawerContent = document.querySelector(defaults.cartDrawerContent);
const cartDrawerClose = document.querySelector(defaults.cartDrawerClose);
const cartDrawerTrigger = document.querySelector(defaults.cartDrawerTrigger);
const cartOverlay = document.querySelector(defaults.cartOverlay);
const cartCounter = document.querySelector(defaults.cartCounter);
const addToCart = document.querySelectorAll(defaults.addToCart);
let removeFromCart = document.querySelectorAll(defaults.removeFromCart);
const checkoutButton = document.querySelector(defaults.checkoutButton);
const htmlSelector = document.documentElement;






for (let i = 0; i < addToCart.length; i++) {

    addToCart[i].addEventListener('click', function(event) {
  setTimeout(function(){
       event.preventDefault();
                let item = event.target;
                let form = item.parentNode;
                while ('form' !== form.tagName.toLowerCase()) {
                    form = form.parentNode;
                }
      
      const productID = window.location.search; 
      const variantURL = new URLSearchParams(productID);
 	  const variantID = variantURL.get('variant');
     
      const formIDs = form.getAttribute('id');
      
     var sasa =  document.getElementById('varirnt').value;

      const formIDsss = variantID;
      // const quani = $('input[name="quantity"]').val();
      
     //console.log(sasa);
      const formID = sasa;
      addProductToCart(formID);
     // console.log(formIDs);
 if (formIDsss == null){
     addProductToCart(sasa);
      }else{
      addProductToCart(formID);
      }
      //alert(formID);
    },1000);
      
    });

}

function addProductToCart(formID) {
  const quani = $('input[name="quantity"]').val();
    $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: {
                id: formID,
          quantity: 0
            },
        success: addToCartOk,
        error: addToCartFail,
    });
}

function fetchCart() {
    $.ajax({
        type: 'GET',
        url: '/cart.js',
        dataType: 'json',
        success: function(cart) {
            onCartUpdate(cart);

            if (cart.item_count === 0) {
                cartDrawerContent.innerHTML = 'Cart is empty';
                checkoutButton.classList.add('is-hidden');
            } else {
                renderCart(cart);
                checkoutButton.classList.remove('is-hidden');
            }

        },
    });
}

function changeItem(line, callback) {
    const quantity = 0;
    $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: 'quantity=' + quantity + '&line=' + line,
        dataType: 'json',
        success: function(cart) {
            if ((typeof callback) === 'function') {
                callback(cart);
            } else {
                onCartUpdate(cart);
                fetchCart();
                removeProductFromCart();
              renderCart(cart);
            }
        },
    });
}



function reItem(clickedId) {
    const quantity = 0;
    $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: {
                quantity: quantity,
                id: clickedId
            },
        dataType: 'json',
        success: function(cart) {
            if ((typeof callback) === 'function') {
                callback(cart);
            } else {
                onCartUpdate(cart);
                fetchCart();
                removeProductFromCart();
               renderCart(cart);
            }
        },
    });
}

function ajaxSubmitCart(clickedId) {
  
   $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: {
                quantity: 1,
                id: clickedId
            },
        success: addToCartOk,
        error: addToCartFail,
    });
}

function ajaxSubmitCartRe(clickedId, inputval) {
  
   $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        dataType: 'json',
        data: {
                quantity: inputval,
                id: clickedId
            },
        success: addToCartOkRe,
        error: addToCartFail,
    });
}



$(document).on("click", ".qtyminus", function() { 
  var quantity = parseInt($(this).next("input").val()); 
  var clickedId = $(this).parent().attr('id');
  quantity -= 1;
  $(this).next("input").attr("value", quantity);
  
  var inputval = $(this).next("input").val();
  //alert(inputval);
  if (quantity == 0) {
    setTimeout(function(){ 
      reItem(clickedId);
     
    
    }, 500);
    
    
    
  } else {
    ajaxSubmitCartRe(clickedId, inputval);
  }
});





$(document).on("click", ".qtyplus", function() { 
  
var clickedId = $(this).parent().attr('id');
 
  //var quantity = parseInt($(this).prev("input").val()); 
 // quantity += 1;
 // $(this).prev("input").attr("value", quantity);
  ajaxSubmitCart(clickedId);
  
});
  

function onCartUpdate(cart) {
    //console.log('items in the cart?', cart.item_count);
  
  $('.itm span, .js-ajax-cart-counter').html(cart.item_count);
  
   $('.itm span').removeClass();
  setTimeout(function(){ 
       $('.itm span').addClass('poin' + cart.item_count);
     
    
    }, 100);
 
}


function addToCartOkRe(product) {
    //cartModalContent.innerHTML = product.title + ' was added to the cart!';
    //cartCounter.innerHTML = Number(cartCounter.innerHTML) - 1;
  //  openAddModal();
   // openCartOverlay();
  //openCartDrawer();
  //  openCartOverlay();
    fetchCart();
}

function addToCartOk(product) {
    //cartModalContent.innerHTML = product.title + ' was added to the cart!';
    //cartCounter.innerHTML = Number(cartCounter.innerHTML) + 1;
  //  openAddModal();
   // openCartOverlay();
  openCartDrawer();
    openCartOverlay();
    fetchCart();
}

function removeProductFromCart() {
    //cartCounter.innerHTML = Number(cartCounter.innerHTML) - 1;
}

function addToCartFail() {
    cartModalContent.innerHTML = 'The product you are trying to add is out of stock.';
    openAddModal();
    openCartOverlay();
}

function renderCart(cart) {

   // console.log(cart);

  
subR();
  
    clearCartDrawer();

    cart.items.forEach(function(item, index) {

        
      console.log(item);
        //console.log(item.image);
        //console.log(item.line_price);
        //console.log(item.quantity);
      //const subs = item.selling_plan_allocation.selling_plan.name;
       
      if ('selling_plan_allocation' in item)
      {
        
        var y = item.selling_plan_allocation.selling_plan.name;
     var x = "&nbsp;-&nbsp;" +  y;
      } else{
      
     var x = "";
      }
      console.log(x);
  const productTitle = '<div class="ajax-cart-item__title">' + item.product_title +' ';
      
    
      const productTitlem = '<span class="ajax-cart-suv ' + item.variant_title +'">' + item.variant_title + x + '</span>';;
  const productTitlel = '</div>';
  
      
        const productImage = '<img class="ajax-cart-item__image" src="' + item.image + '" >';
        const productPrice = '<div class="ajax-cart-item__price">' + Shopify.formatMoney(item.line_price) + '</div>';
        //const productQuantity = '<div class="ajax-cart-item__quantity"><div id="' + item.id + '" class="qty-wrapper">' +
                //  '<input type="button" value="-" class="qtyminus" field="quantity" />' +
                 // '<input disabled type="text" id="Quantity" name="quantity" value="'+ item.quantity + '" class="qty" />'+
                 // '<input type="button" value="+" class="qtyplus" field="quantity" />'+
                 // '</div></div>';
      
      const productQuantity = '<div class="ajax-cart-item__quantity">Quantity: <b>' + item.quantity + '</b></div>';
        const productRemove = '<div class="ajax-cart-item__remove ' + defaults.removeFromCartNoDot + '"><svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 5H16.5" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.6665 4.99999V3.33332C5.6665 2.8913 5.8421 2.46737 6.15466 2.15481C6.46722 1.84225 6.89114 1.66666 7.33317 1.66666H10.6665C11.1085 1.66666 11.5325 1.84225 11.845 2.15481C12.1576 2.46737 12.3332 2.8913 12.3332 3.33332V4.99999M14.8332 4.99999V16.6667C14.8332 17.1087 14.6576 17.5326 14.345 17.8452C14.0325 18.1577 13.6085 18.3333 13.1665 18.3333H4.83317C4.39114 18.3333 3.96722 18.1577 3.65466 17.8452C3.3421 17.5326 3.1665 17.1087 3.1665 16.6667V4.99999H14.8332Z" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';

       const concatProductInfo = '<div class="ajax-cart-item__single" data-line="' + Number(index + 1) + '">'+ productRemove + productImage + '<div class="rig-img"><div class="grid-tit">' + productTitle  + productTitlem + productTitlel +'</div><div class="qunt-grid">'+ productQuantity +  productPrice + '</div></div></div>';
      
        cartDrawerContent.innerHTML = cartDrawerContent.innerHTML + concatProductInfo;

    });

    // document.querySelectorAll('.js-ajax-remove-from-cart')
    //     .forEach((element) => {
    //         element.addEventListener('click', function() {
    //             const lineID = this.parentNode.getAttribute('data-line');
    //             console.log('aa');
    //         });
    //     });

    removeFromCart = document.querySelectorAll(defaults.removeFromCart);

    for (let i = 0; i < removeFromCart.length; i++) {
        removeFromCart[i].addEventListener('click', function() {
            const line = this.parentNode.getAttribute('data-line');
           // console.log(line);
            changeItem(line);
        });
    }
  
  const concatProductInfos = Shopify.formatMoney(cart.total_price);

   sub.innerHTML = sub.innerHTML + concatProductInfos;
 
 // console.log(concatProductInfos);
}

function openCartDrawer() {
    cartDrawer.classList.add('is-open');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('is-open');
}

function clearCartDrawer() {
    cartDrawerContent.innerHTML = '';
}

function subR() {
    sub.innerHTML = '';
}






function openAddModal() {
    cartModal.classList.add('is-open');
}

function closeAddModal() {
    cartModal.classList.remove('is-open');
}

function openCartOverlay() {
    cartOverlay.classList.add('is-open');
    htmlSelector.classList.add('is-locked');
}

function closeCartOverlay() {
    cartOverlay.classList.remove('is-open');
    htmlSelector.classList.remove('is-locked');
    

}

cartModalClose.addEventListener('click', function() {
    closeAddModal();
    closeCartOverlay();
});

cartDrawerClose.addEventListener('click', function() {
    closeCartDrawer();
    closeCartOverlay();
});



$('body:before').click(function(e){
   $('.ajax-cart__drawer.js-ajax-cart-drawer').removeClass('is-open')    
  $('html').removeClass('is-locked');
});





// cart is empty stanje
cartOverlay.addEventListener('click', function() {
    closeAddModal();
    closeCartDrawer();
    closeCartOverlay();
});

cartDrawerTrigger.addEventListener('click', function(event) {
    event.preventDefault();
    //fetchCart();
    openCartDrawer();
    openCartOverlay();
});

document.addEventListener('DOMContentLoaded', function() {
    fetchCart();
});