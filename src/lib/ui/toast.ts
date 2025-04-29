export function show_toast(baheth_link, type: "video" | "playlist") {
  // Detect dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // create toast element
  const toast = document.createElement("div");
  toast.classList.add("baheth-toast");
  if (prefersDarkMode) {
    toast.classList.add("dark-mode");
  }
  
  toast.innerHTML = `
    <div class="toast-header">
      <img class="baheth-logo" src="${chrome.runtime.getURL(prefersDarkMode ? "baheth-logo-light.svg" : "baheth-logo-dark.svg")}" alt="Baheth" />
      <div class="notification-indicator"></div>
    </div>
    <div class="toast-content">
      <p class="toast-title">${
        type === "video" ? "هذا المقطع متاح" : "قائمة التشغيل هذه متاحة"
      } على باحث! 🔍</p>
      <p class="toast-description">اضغط للمشاهدة عبر باحث.</p>
    </div>
    <button class="toast-action">الانتقال إلى باحث</button>
    <button class="close" aria-label="إغلاق">×</button>
  `;

  document.body.appendChild(toast);

  // show the toast after 300ms of creation with animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-hide after 8 seconds
  const autoHideTimeout = setTimeout(() => {
    delete_all_toasts();
  }, 8000);

  // handle toast click
  toast.onclick = (event) => {
    const target = event.target as Element;
    
    if (target.classList.contains("close")) {
      clearTimeout(autoHideTimeout);
      delete_all_toasts();
    } else if (target.classList.contains("toast-action") || !target.classList.contains("close")) {
      // open baheth link
      window.open(baheth_link, "_blank");
    }
  };
}

export function delete_all_toasts() {
  const toasts = document.querySelectorAll(".baheth-toast");

  toasts.forEach((toast) => {
    // Add a class to trigger the fade-out animation
    toast.classList.remove("show");

    // Remove the element after the animation completes
    toast.addEventListener("transitionend", () => toast.remove());

    // Fallback removal if transitionend doesn't fire
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300); // Adjust timeout based on transition duration
  });
}
