
const PAYPAL_LINKS = {
  "Post Instagram": "https://www.paypal.com/ncp/payment/NCQ8MYHMR6HQ4",
  "Storia Instagram": "https://www.paypal.com/ncp/payment/RJNDZ3S4QPSNU",
  "Reel Instagram": "https://www.paypal.com/ncp/payment/4CWEKJQS6AK58",
  "Pacchetto No Cap": "https://www.paypal.com/ncp/payment/W87KWJBS5KS2G",
  "Post TikTok": "https://www.paypal.com/ncp/payment/8ME69UV3CHF6S",
  "Video Lyrics TikTok": "https://www.paypal.com/ncp/payment/FPQR94UGDPQ2S",
  "Spotify Basic": "https://www.paypal.com/ncp/payment/9VFKS39VXSBR8",
  "Spotify Medium": "https://www.paypal.com/ncp/payment/FUM23F3J3J8WN",
  "Spotify Premium": "https://www.paypal.com/ncp/payment/W7AM5F4JY8EJJ"
};

$("#checkout-form").addEventListener("submit", e => {
  e.preventDefault();

  const service = $("#product").value.split("|")[1];
  const paypalUrl = PAYPAL_LINKS[service];

  if (!paypalUrl) {
    $("#pay-message").textContent =
      "Link PayPal non disponibile. Contatta NVGP.TEAM.";
    return;
  }

  $("#pay-message").textContent =
    "Reindirizzamento a PayPal...";

  window.location.assign(paypalUrl);
});
