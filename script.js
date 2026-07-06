// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// --- Wishlist button ---------------------------------------------------------
// Until the real Steam store URL is set (data-url on the button), tell visitors
// the page is on the way instead of sending them to a placeholder.
(function () {
  var steam = document.getElementById("steam");
  var msg = document.getElementById("steamMsg");
  if (!steam) return;
  var url = steam.dataset.url;
  var ready = url && url !== "STEAM_APP_URL";
  if (ready) {
    steam.href = url;
  } else {
    steam.addEventListener("click", function (e) {
      e.preventDefault();
      msg.textContent = "Steam page coming soon — check back!";
    });
  }
})();

// --- Mailing list ------------------------------------------------------------
// Set data-endpoint on the <form> to your provider's POST URL (e.g. a Formspree
// endpoint like https://formspree.io/f/abcdwxyz). Until then, the form validates
// but reports that signups aren't connected yet.
(function () {
  var form = document.getElementById("signup");
  var msg = document.getElementById("signupMsg");
  if (!form) return;
  var endpoint = form.dataset.endpoint;
  var connected = endpoint && endpoint !== "MAILING_LIST_ENDPOINT";

  function setMsg(text, ok) {
    msg.textContent = text;
    msg.style.color = ok ? "var(--green)" : "var(--magenta)";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMsg("Please enter a valid email address.", false);
      return;
    }
    if (!connected) {
      setMsg("Signups aren’t connected yet — coming soon.", false);
      return;
    }
    setMsg("Sending…", true);
    fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          setMsg("You’re on the list — thanks!", true);
        } else {
          setMsg("Something went wrong. Please try again later.", false);
        }
      })
      .catch(function () {
        setMsg("Network error. Please try again later.", false);
      });
  });
})();
