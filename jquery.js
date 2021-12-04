/* TITLE ANIMATION */
function myRepeat() {
  $(".title-container").delay(150).fadeOut(1000).delay(150).fadeIn(1000);
}
setInterval(myRepeat, 1000);
