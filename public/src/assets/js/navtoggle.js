export default {
    showMenu(e) {
        var menuLeft = document.getElementById('menu'),
        overlay = document.getElementById('overlay');
        // document.getElementById('app').classList.add('no-scroll');
        menuLeft.classList.add('menu-open');
        overlay.classList.add('overlay-active');
    },
    overlayClick(e) {
        var menuLeft = document.getElementById('menu'),
        overlay = document.getElementById('overlay');
        // document.getElementById('app').classList.remove('no-scroll');
        menuLeft.classList.remove('menu-open');
        overlay.classList.remove('overlay-active');
    }
}
