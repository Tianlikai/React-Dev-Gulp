function getScrollbarWidth() {
  if (document.body.clientWidth >= window.innerWidth) {
    return 0;
  }

  // Create the measurement node
  var measure = document.createElement('div');

  measure.className = 'modal-scrollbar-measure';
  document.body.appendChild(measure);

  // Get the scrollbar width
  var scrollbarWidth = measure.offsetWidth - measure.clientWidth;

  // Delete the DIV
  document.body.removeChild(measure);

  return scrollbarWidth;
}

module.exports = getScrollbarWidth;