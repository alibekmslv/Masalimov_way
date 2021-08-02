'use strict';

const KeyCode = {
  LEFT: 37,
  RIGHT: 39,
  ESCAPE: 27,
};
const TAB_SCROLL_OFFSET = 60;

const noJsElement = document.querySelector('.no-js');
noJsElement.classList.remove('no-js');

// Menu Related Vars
const mainHeaderElement = document.querySelector('.main-header');
const menuButtonElement = mainHeaderElement.querySelector('.menu-button');

// Country Cards Related Vars
const countyCardsElements = document.querySelector('.places-to-visit__country-cards');
const countryLinks = countyCardsElements.querySelectorAll('.places-to-visit__link');

// Tabs Related Vars
const tabs = document.querySelectorAll('[role="tab"]');
const tabList = document.querySelector('[role="tablist"]');

// Popup Related Vars
const modalElement = document.querySelector('.modal');
const modalCloseElement = modalElement.querySelector('.modal__close');
const countriesElement = document.querySelector('.countries');
const pricesElement = document.querySelector('.prices');

// Form Related Vars
const sectionFeedbackElement = document.querySelector('.section-feedback');
const feedbackFormElement = sectionFeedbackElement.querySelector('.feedback-form form');
const feedbackPhoneElement = feedbackFormElement.querySelector('[type="tel"]');
const feedbackEmailElement = feedbackFormElement.querySelector('[type="email"]');
const modalResultElement = modalElement.querySelector('.modal__result');
const buyTourFormElement = modalElement.querySelector('.popup-form form');
const buyTourPhoneElement = buyTourFormElement.querySelector('[type="tel"]');
const buyTourEmailElement = buyTourFormElement.querySelector('[type="email"]');


// Menu
menuButtonElement.addEventListener('click', () => {
  mainHeaderElement.classList.toggle('main-header--open');
  menuButtonElement.classList.toggle('menu-button--open');
});

mainHeaderElement.addEventListener('click', (e) => {
  if (e.target.classList.contains('site-navigation__link')) {
    e.preventDefault();
    mainHeaderElement.classList.remove('main-header--open');
    menuButtonElement.classList.remove('menu-button--open');
    document.querySelector(e.target.hash).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
});

// Tabs
const changeTabs = (e) => {
  const target = e.target;
  const parent = target.parentNode;
  const tabsBlock = countriesElement.querySelector('.tabs');

  if (!target.classList.contains('tabs__tab--selected')) {
    parent.scrollLeft = target.offsetLeft - TAB_SCROLL_OFFSET;
  }

  parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach((t) => {
      t.setAttribute('aria-selected', false);
      t.classList.remove('tabs__tab--selected');
    });

  target.setAttribute('aria-selected', true);
  target.classList.add('tabs__tab--selected');

  tabsBlock
    .querySelectorAll('[role="tabpanel"]')
    .forEach((p) => {
      p.setAttribute('hidden', true);
      p.classList.remove('tabs__tabpanel--active');
    });

  const selectedPanel = tabsBlock.querySelector(`#${target.getAttribute('aria-controls')}`);
  selectedPanel.removeAttribute('hidden');
  selectedPanel.classList.add('tabs__tabpanel--active');
};

if (tabs.length > 0) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabs);
  });

  let tabFocus = 0;

  tabList.addEventListener('keydown', (e) => {
    if (e.keyCode === KeyCode.RIGHT || e.keyCode === KeyCode.LEFT) {
      e.preventDefault();
      tabs[tabFocus].setAttribute('tabindex', -1);
      if (e.keyCode === KeyCode.RIGHT) {
        tabFocus++;
        if (tabFocus >= tabs.length) {
          tabFocus = 0;
        }
      } else if (e.keyCode === KeyCode.LEFT) {
        tabFocus--;
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1;
        }
      }

      tabs[tabFocus].setAttribute('tabindex', 0);
      tabs[tabFocus].focus();
    }
  });
}

// countyCardsElements.addEventListener('click', (e) => {
//   e.preventDefault();
//   console.log(e.target, e.currentTarget);
//   const parentLink = e.target.parentNode;
//   const tabId = parentLink.dataset.tab;
//   const countryContainerElement = document.querySelector(`${parentLink.hash}`);
//   const tabsElement = document.querySelector('.tabs');

//   if (tabId && countryContainerElement) {
//     changeTabs({ target: document.querySelector(`#${tabId}`)});
//     tabsElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
//   }
// });

countryLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = e.currentTarget.dataset.tab;
    const countryContainerElement = document.querySelector(`${e.currentTarget.hash}`);
    const tabsElement = document.querySelector('.tabs');

    if (tabId && countryContainerElement) {
      changeTabs({ target: document.querySelector(`#${tabId}`)});
      tabsElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }
  });
});


// Popup
const closeModal = (listenerToRemove) => {
  modalElement.classList.remove('modal--show');
  modalResultElement.classList.remove('modal__result--show');
  window.removeEventListener('keydown', listenerToRemove);
};

const windowKeydownHandler = (e) => {
  if (e.keyCode === KeyCode.ESCAPE) {
    closeModal(windowKeydownHandler);
  }
};

const modalCloseClickHandler = () => {
  closeModal(windowKeydownHandler);
};


const showPopup = () => {
  modalElement.classList.add('modal--show');
  buyTourPhoneElement.focus();
  window.addEventListener('keydown', windowKeydownHandler);
};

modalElement.addEventListener('click', (e) => {
  if (e.target === modalElement) {
    closeModal(windowKeydownHandler);
  }
});

modalCloseElement.addEventListener('click', modalCloseClickHandler);

countriesElement.addEventListener('click', (e) => {
  if (e.target.classList.contains('country__button')) {
    e.preventDefault();
    showPopup();
  }
});

pricesElement.addEventListener('click', (e) => {
  if (e.target.classList.contains('card-price__button')) {
    e.preventDefault();
    showPopup();
  }
});


// Form Validation
const checkPhoneValidity = (phoneElement) => {
  const inputElement = phoneElement.parentNode;

  if (phoneElement.validity.patternMismatch) {
    inputElement.classList.add('input--invalid');
  } else {
    inputElement.classList.remove('input--invalid');
  }
};

const checkEmailValidity = (emailElement) => {
  const inputElement = emailElement.parentNode;

  if(!emailElement.validity.valid) {
    inputElement.classList.add('input--invalid');
  } else {
    inputElement.classList.remove('input--invalid');
  }
};

// Feedback Form
const showSuccessPopup = () => {
  showPopup();
  localStorage.removeItem('phoneNumber');
  localStorage.removeItem('email');
  modalResultElement.classList.add('modal__result--show');
};

const resetForms = () => {
  feedbackFormElement.reset();
  buyTourFormElement.reset();
};

feedbackPhoneElement.value = localStorage.getItem('phoneNumber');
feedbackEmailElement.value = localStorage.getItem('email');

feedbackFormElement.addEventListener('submit', (e) => {
  e.preventDefault();
  resetForms();
  showSuccessPopup();
});

feedbackPhoneElement.addEventListener('input', (e) => {
  checkPhoneValidity(feedbackPhoneElement);
  localStorage.setItem('phoneNumber', e.target.value);
  buyTourPhoneElement.value = e.target.value;
});

feedbackEmailElement.addEventListener('input', (e) => {
  checkEmailValidity(feedbackEmailElement);
  localStorage.setItem('email', e.target.value);
  buyTourEmailElement.value = e.target.value;
});

// Buy Tour Form
buyTourPhoneElement.value = localStorage.getItem('phoneNumber');
buyTourEmailElement.value = localStorage.getItem('email');

buyTourPhoneElement.addEventListener('input', (e) => {
  checkPhoneValidity(buyTourPhoneElement);
  localStorage.setItem('phoneNumber', e.target.value);
  feedbackPhoneElement.value = e.target.value;
});

buyTourEmailElement.addEventListener('input', (e) => {
  checkEmailValidity(buyTourEmailElement);
  localStorage.setItem('email', e.target.value);
  feedbackEmailElement.value = e.target.value;
});

buyTourFormElement.addEventListener('submit', (e) => {
  e.preventDefault();
  resetForms();
  showSuccessPopup();
});
