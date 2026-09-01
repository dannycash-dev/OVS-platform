(() => {
  const $ = (selector) => document.querySelector(selector);
  const showToast = (message) => {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const switchView = (view) => {
    document.querySelectorAll('.view').forEach((element) => element.classList.remove('active-view'));
    const target = $(`#${view}-view`);
    if (target) target.classList.add('active-view');
    document.querySelectorAll('.nav-item[data-view]').forEach((element) => element.classList.toggle('active', element.dataset.view === view));
  };
  const renderFiles = (files) => {
    const list = $('#file-list');
    if (!list) return;
    list.innerHTML = files.map((file) => `<div class="file-row"><b>${file.name}</b><small>${file.size}</small></div>`).join('');
    $('#dropzone')?.classList.toggle('has-file', files.length > 0);
    const assessButton = $('#assess-btn');
    if (assessButton) assessButton.disabled = files.length === 0;
  };
  const files = [];
  $('#xray-input')?.addEventListener('change', (event) => {
    [...event.target.files].slice(0, 4).forEach((file) => files.push({ name: file.name, size: `${(file.size / 1048576).toFixed(1)} MB` }));
    renderFiles(files);
  });
  $('#dropzone')?.addEventListener('dragover', (event) => event.preventDefault());
  $('#dropzone')?.addEventListener('drop', (event) => {
    event.preventDefault();
    [...event.dataTransfer.files].slice(0, 4).forEach((file) => files.push({ name: file.name, size: `${(file.size / 1048576).toFixed(1)} MB` }));
    renderFiles(files);
  });
  $('#sample-btn')?.addEventListener('click', () => {
    files.splice(0, files.length, { name: 'sample_radiograph_AP.jpg', size: 'Demo file' }, { name: 'sample_radiograph_lateral.jpg', size: 'Demo file' });
    $('#patient-name').value = 'Sample case';
    $('#weight').value = '22';
    renderFiles(files);
    showToast('Sample case loaded');
  });
  $('#assess-btn')?.addEventListener('click', () => showToast('Review prepared. Connect your secure AI app backend when ready.'));
  document.querySelectorAll('[data-view]').forEach((element) => element.addEventListener('click', () => switchView(element.dataset.view)));
  document.querySelectorAll('[data-variant-id]').forEach((button) => button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const response = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id: Number(button.dataset.variantId), quantity: 1 }] }) });
      if (!response.ok) throw new Error('Cart request failed');
      const cart = await fetch('/cart.js').then((result) => result.json());
      if ($('#cart-count')) $('#cart-count').textContent = cart.item_count;
      if ($('#rail-title')) $('#rail-title').textContent = `${cart.item_count} item${cart.item_count === 1 ? '' : 's'} selected`;
      showToast('Added to Shopify cart');
    } catch (error) {
      showToast('Unable to update cart');
    } finally {
      button.disabled = false;
    }
  }));
  $('#search-input')?.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach((card) => { card.hidden = !card.textContent.toLowerCase().includes(query); });
  });
  $('.mobile-menu')?.addEventListener('click', () => { $('.sidebar').style.left = $('.sidebar').style.left === '0px' ? '' : '0px'; });
})();
