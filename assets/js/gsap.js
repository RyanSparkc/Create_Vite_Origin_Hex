import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const itemsLeft = document.querySelectorAll('.g-fade-left');
itemsLeft.forEach(item => {
  gsap.from(item, {
    duration: 0.7,
    x: -1800,
    scrollTrigger: {
      trigger: item,
      // markers: true,
      start: 'top 95%',
      // end: 'bottom 0%',
      toggleActions: 'restart  none none none',
    },
  });
});

const itemsRight = document.querySelectorAll('.g-fade-right');
itemsRight.forEach(item => {
  gsap.from(item, {
    duration: 0.7,
    x: 1200,
    scrollTrigger: {
      trigger: item,
      // markers: true,
      start: 'top 75%',
      end: 'bottom 25%',
      toggleActions:"play none none none"
    }
  });
});

const itemsUp = document.querySelectorAll('.g-fade-up');
itemsUp.forEach(item => {
  gsap.from(item, {
    duration: 0.7,
    y: 300,
    scrollTrigger: {
      trigger: item,
      // markers: true,
      start: 'top 100%',
      toggleActions:"play none none none"
    }
  });
});

gsap.from('.g-zoom-in', {
  duration: 1.5,
  scale: 0,
  opacity: 0,
  ease: 'power3.inOut',
  scrollTrigger: {
    trigger: '#g-swiper',
    // markers: true,
    start: 'top 75%',
    toggleActions:"play none none none"
  }
});

gsap.timeline()
    .from('#circle', {scale: 0, opacity: 0.2, duration: 0.7})
    .to('#circle', {rotate: 360, duration: 10, repeat: -1, ease: 'none'});


const tl = gsap.timeline()
    .to('.g-animation-1', {opacity: 0.1, duration: 0.3})
    .to('.g-animation-2', {opacity: 0.1, duration: 0.3})
    .to('.g-animation-3', {opacity: 0.1, duration: 0.3})
    .to('.g-animation-4', {opacity: 0.1, duration: 0.3})
    .to('.g-animation-1', {opacity: 1, duration: 0.3})
    .to('.g-animation-2', {opacity: 1, duration: 0.3})
    .to('.g-animation-3', {opacity: 1, duration: 0.3})
    .to('.g-animation-4', {opacity: 1, duration: 0.3});
const st = ScrollTrigger.create({
  trigger: '#g-position',
  // markers: true,
  start: 'top 85%',
  toggleActions:"play none none reset",
  animation: tl,
})

