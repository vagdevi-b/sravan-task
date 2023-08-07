import {Renderer2} from '@angular/core';
import {fromEvent, Observable, race} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

/**
 * Returns true if parentEl and childEl are the same element
 * or if parentEl is the parent of childEl directly or indirectly
 */
export function isParentOf(parentEl: HTMLElement | Node, childEl: HTMLElement | Node): boolean {

  let parentOfChildEl = childEl;
  while (parentOfChildEl && parentEl !== parentOfChildEl) {
    parentOfChildEl = parentOfChildEl.parentElement;
  }

  return !!parentOfChildEl;
}

export function isChildOf(
    element: HTMLElement | Node,
    elArray: HTMLElement[] | Node[]
) {
  return elArray
      ? elArray.some(each => each.contains(element))
      : false;
}

export function autoClose(
    document: any,
    closeCallback,
    ignoreElements: HTMLElement[],
    closed: Observable<any>
): void {

  const closableClicks = fromEvent<MouseEvent>(document, 'click')
      .pipe(
          filter(event => !isChildOf(event.target as Node, ignoreElements)),
          takeUntil(closed)
      );

  const escapeKeyups = fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
          filter(event => {
            return event.code === 'Escape'
                && !event.ctrlKey
                && !event.shiftKey
                && !event.metaKey
          }),
          takeUntil(closed)
      );

  setTimeout(() => {
    race<void>([closableClicks, escapeKeyups])
        .subscribe(_ => closeCallback());
  }, 100);
}

/**
 * Positions componentEl under the element.
 * Uses absolute positioning.
 */
export function positionComponentUnderElement(
    element: HTMLElement,
    componentEl: HTMLElement,
    renderer: Renderer2
): void {

  const targetDomRect: DOMRect = element.getBoundingClientRect() as DOMRect;

  const offsetParent = element.offsetParent;

  const offsetParentDomRect: DOMRect = (offsetParent
          ? offsetParent.getBoundingClientRect()
          : document.documentElement.getBoundingClientRect()
  ) as DOMRect;

  const left = targetDomRect.x - offsetParentDomRect.x;
  const top = targetDomRect.y - offsetParentDomRect.y + targetDomRect.height;

  if (componentEl.style.position !== 'absolute') {
    renderer.setStyle(componentEl, 'position', 'absolute');
  }
  renderer.setStyle(componentEl, 'top', `${top}px`);
  renderer.setStyle(componentEl, 'left', `${left}px`);
}

export function leftPad(inputNumber: any, padString: string, requiredLength: number) {
  if (!padString || padString.length !== 1) {
    return inputNumber;
  }

  inputNumber = `${inputNumber}`;
  if (inputNumber.length < requiredLength) {
    const requiredCharacterLength = requiredLength - inputNumber.length;

    for (let i = 0; i < requiredCharacterLength; i++) {
      inputNumber = `${padString}${inputNumber}`;
    }
  }

  return inputNumber;
}

export function isInteger(num: any): boolean {
  return num && typeof num === 'number' && isFinite(num) && Math.floor(num) === num;
}

export const monthNumberToName = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
};
