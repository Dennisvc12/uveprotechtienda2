
const WA_NUMBER = '51949030039';
const CART_KEY = 'uveprotech_cart_v1';

function loadCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const cart = loadCart();
  const el = document.querySelector('.cart .count');
  if(el){ el.textContent = cart.reduce((a,i)=>a+i.qty,0); }
}
function addToCart(item){
  const cart = loadCart();
  const idx = cart.findIndex(p => p.name===item.name && p.price===item.price);
  if(idx>=0){ cart[idx].qty += 1; } else { cart.push({...item, qty:1}); }
  saveCart(cart);
  openCart();
}
function currency(v){
  if(typeof v === 'string') return v;
  return 'S/' + v.toLocaleString('es-PE');
}
function openCart(){
  const cart = loadCart();
  const modal = document.getElementById('cart-modal');
  const tbody = modal.querySelector('tbody');
  tbody.innerHTML = '';
  let total = 0;
  cart.forEach((it, i)=>{
    const priceNum = Number(String(it.price).replace(/[^0-9]/g,'')) || 0;
    const subtotal = priceNum * it.qty;
    total += subtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${it.name}</td>
      <td>${it.price}</td>
      <td class="qty">
        <button data-i="${i}" class="dec">-</button>
        <strong>${it.qty}</strong>
        <button data-i="${i}" class="inc">+</button>
      </td>
      <td>S/${subtotal.toLocaleString('es-PE')}</td>
    `;
    tbody.appendChild(tr);
  });
  modal.querySelector('.total').textContent = 'S/' + total.toLocaleString('es-PE');
  modal.style.display = 'flex';

  tbody.querySelectorAll('.inc').forEach(btn=>{
    btn.onclick = () => { const cart = loadCart(); cart[btn.dataset.i].qty++; saveCart(cart); openCart(); };
  });
  tbody.querySelectorAll('.dec').forEach(btn=>{
    btn.onclick = () => { const cart = loadCart(); cart[btn.dataset.i].qty--; if(cart[btn.dataset.i].qty<=0) cart.splice(btn.dataset.i,1); saveCart(cart); openCart(); };
  });

  modal.querySelector('.checkout').onclick = ()=>{
    const cart = loadCart();
    if(cart.length===0) return;
    let text = 'Hola UVEPROTECH 👋, quiero comprar:%0A';
    let sum = 0;
    cart.forEach(it=>{
      const p = Number(String(it.price).replace(/[^0-9]/g,'')) || 0;
      sum += p * it.qty;
      text += `- ${it.name} (${it.price}) x${it.qty}%0A`;
    });
    text += `%0ATotal: S/${sum.toLocaleString('es-PE')}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${text}`;
    window.open(url,'_blank');
  };
}
function closeCart(){ document.getElementById('cart-modal').style.display='none'; }
document.addEventListener('DOMContentLoaded', updateCartCount);
