'use strict';
const KeyCode = {
  LEFT: 37,
  RIGHT: 39,
};
const TAB_SCROLL_OFFSET = 60;

const noJsElement = document.querySelector('.no-js');
noJsElement.classList.remove('no-js');

const menuButtonElement = document.querySelector('.menu-button');
const mainHeaderElement = document.querySelector('.main-header');

// Country Cards Related Vars
const countyCardsElements = document.querySelector('.places-to-visit__country-cards');

// Tabs Related Vars
const tabs = document.querySelectorAll('[role="tab"]');
const tabList = document.querySelector('[role="tablist"]');

menuButtonElement.addEventListener('click', () => {
  mainHeaderElement.classList.toggle('main-header--open');
  menuButtonElement.classList.toggle('menu-button--open');
});

// Tabs
if (tabs.length > 0) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabs);
  });

  // Enable arrow navigation between tabs in the tab list
  let tabFocus = 0;

  tabList.addEventListener('keydown', (e) => {
    // Move down
    if (e.keyCode === KeyCode.RIGHT || e.keyCode === KeyCode.LEFT) {
      e.preventDefault();
      tabs[tabFocus].setAttribute('tabindex', -1);
      if (e.keyCode === KeyCode.RIGHT) {
        tabFocus++;
        // If we're at the end, go to the start
        if (tabFocus >= tabs.length) {
          tabFocus = 0;
        }
        // Move up
      } else if (e.keyCode === KeyCode.LEFT) {
        tabFocus--;
        // If we're at the start, move to the end
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1;
        }
      }

      tabs[tabFocus].setAttribute('tabindex', 0);
      tabs[tabFocus].focus();
    }
  });
}

function changeTabs(e) {
  const target = e.target;
  const parent = target.parentNode;
  // const grandparent = parent.parentNode;
  const tabsBlock = document.querySelector('.tabs');

  if (!target.classList.contains('tabs__tab--selected')) {
    parent.scrollLeft = target.offsetLeft - TAB_SCROLL_OFFSET;
  }

  // Remove all current selected tabs
  parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach((t) => {
      t.setAttribute('aria-selected', false);
      t.classList.remove('tabs__tab--selected');
    });

  // Set this tab as selected
  target.setAttribute('aria-selected', true);
  target.classList.add('tabs__tab--selected');

  // Hide all tab panels
  tabsBlock
    .querySelectorAll('[role="tabpanel"]')
    .forEach((p) => {
      p.setAttribute('hidden', true);
      p.classList.remove('tabs__tabpanel--active');
    });

  // Show the selected panel
  const selectedPanel = tabsBlock.querySelector(`#${target.getAttribute('aria-controls')}`);
  selectedPanel.removeAttribute('hidden');
  selectedPanel.classList.add('tabs__tabpanel--active');
}

countyCardsElements.addEventListener('click', (e) => {
  e.preventDefault();
  const tabId = e.target.dataset.tab;
  const countryContainerElement = document.querySelector(`${e.target.hash}`);
  const tabsElement = document.querySelector('.tabs');

  if (tabId && countryContainerElement) {
    changeTabs({ target: document.querySelector(`#${tabId}`)});
    // countryContainerElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    tabsElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
});
