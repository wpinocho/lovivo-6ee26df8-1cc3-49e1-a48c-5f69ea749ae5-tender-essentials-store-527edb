(function() {
  'use strict';

  console.log('🎨 Visual Edit Bridge initialized');

  // Estado del Visual Edit Mode
  let isVisualEditActive = false;
  let eventListenersAttached = false;
  let highlightOverlay = null;
  let currentHighlightedElement = null;

  // ==================== PREVENCIÓN DE EVENTOS ====================
  
  function preventDefaultBehavior(event) {
    if (isVisualEditActive) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  function activateVisualEditMode() {
    if (eventListenersAttached) return;
    
    isVisualEditActive = true;
    
    // Prevenir clicks en toda la página
    document.addEventListener('click', preventDefaultBehavior, true);
    document.addEventListener('mousedown', preventDefaultBehavior, true);
    document.addEventListener('mouseup', preventDefaultBehavior, true);
    
    // Prevenir navegación
    document.addEventListener('submit', preventDefaultBehavior, true);
    
    // Prevenir drag and drop
    document.addEventListener('dragstart', preventDefaultBehavior, true);
    
    // Cambiar cursor
    document.body.style.cursor = 'crosshair';
    document.body.style.userSelect = 'none';
    
    eventListenersAttached = true;
    console.log('🎨 Visual Edit Mode ACTIVATED - All interactions blocked');
  }

  function deactivateVisualEditMode() {
    if (!eventListenersAttached) return;
    
    isVisualEditActive = false;
    
    document.removeEventListener('click', preventDefaultBehavior, true);
    document.removeEventListener('mousedown', preventDefaultBehavior, true);
    document.removeEventListener('mouseup', preventDefaultBehavior, true);
    document.removeEventListener('submit', preventDefaultBehavior, true);
    document.removeEventListener('dragstart', preventDefaultBehavior, true);
    
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    eventListenersAttached = false;
    console.log('🎨 Visual Edit Mode DEACTIVATED - Interactions restored');
  }

  // ==================== HIGHLIGHT OVERLAY ====================
  
  function createHighlightOverlay() {
    if (highlightOverlay) return highlightOverlay;
    
    highlightOverlay = document.createElement('div');
    highlightOverlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.15);
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.1);
      z-index: 2147483647;
      transition: all 0.1s ease;
      display: none;
    `;
    document.body.appendChild(highlightOverlay);
    return highlightOverlay;
  }

  function updateHighlightPosition() {
    if (!currentHighlightedElement || !highlightOverlay) return;
    
    const rect = currentHighlightedElement.getBoundingClientRect();
    highlightOverlay.style.top = `${rect.top}px`;
    highlightOverlay.style.left = `${rect.left}px`;
    highlightOverlay.style.width = `${rect.width}px`;
    highlightOverlay.style.height = `${rect.height}px`;
    highlightOverlay.style.display = 'block';
  }

  // ==================== DETECCIÓN DE ELEMENTOS ====================
  
  function isInteractiveOrContentElement(element) {
    if (!element || element === document.body || element === document.documentElement) {
      return false;
    }

    // Elementos interactivos
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IMG', 'VIDEO', 'SVG', 'LABEL'];
    if (interactiveTags.includes(element.tagName)) {
      return true;
    }
    
    // Elementos con roles interactivos
    const role = element.getAttribute('role');
    if (role && ['button', 'link', 'textbox', 'checkbox', 'radio', 'tab', 'menuitem'].includes(role)) {
      return true;
    }
    
    // Elementos de texto con contenido directo
    const textTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'LI', 'TD', 'TH', 'STRONG', 'EM'];
    if (textTags.includes(element.tagName)) {
      const hasDirectText = Array.from(element.childNodes).some(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
      );
      if (hasDirectText) return true;
    }
    
    // Elementos pequeños con contenido
    const textLength = element.textContent?.trim().length || 0;
    const childrenCount = element.children.length;
    const isSmallElement = textLength > 0 && textLength < 300 && childrenCount < 5;
    
    return isSmallElement;
  }

  function findBestElement(element, x, y) {
    if (!element) return null;

    // Si es un elemento interactivo/específico, usarlo
    if (isInteractiveOrContentElement(element)) {
      return element;
    }
    
    // Buscar un hijo más específico en las coordenadas exactas
    const children = element.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      const rect = child.getBoundingClientRect();
      
      if (
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom
      ) {
        // Recursivamente buscar en el hijo
        const bestChild = findBestElement(child, x, y);
        if (bestChild) return bestChild;
      }
    }
    
    // Si no hay mejor opción pero el elemento tiene contenido útil, devolverlo
    if (element.textContent?.trim().length > 0 && element !== document.body) {
      return element;
    }
    
    return null;
  }

  // ==================== GENERACIÓN DE SELECTORES ====================
  
  function generateSelector(element) {
    if (!element || element === document.documentElement || element === document.body) {
      return null;
    }

    // ID único
    if (element.id) {
      return `#${CSS.escape(element.id)}`;
    }
    
    // Data-testid u otros data-attributes
    const testId = element.getAttribute('data-testid');
    if (testId) {
      return `[data-testid="${CSS.escape(testId)}"]`;
    }

    // Clase única si existe
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim().split(/\s+/).filter(c => c && c !== 'undefined');
      for (const cls of classes) {
        const selector = `.${CSS.escape(cls)}`;
        try {
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        } catch (e) {
          // Ignorar errores de selector inválido
        }
      }
    }

    // Path con clases específicas (limitado a 5 niveles)
    const path = [];
    let current = element;
    const maxDepth = 5;

    while (current && current !== document.body && path.length < maxDepth) {
      let selector = current.tagName.toLowerCase();
      
      // Agregar primera clase si existe
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).filter(c => c && c !== 'undefined');
        if (classes.length > 0) {
          selector += '.' + CSS.escape(classes[0]);
        }
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(' > ');
  }

  // ==================== HIGHLIGHTING ====================
  
  function highlightElement(selector) {
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn('[VisualEdit Bridge] Cannot highlight: element not found', selector);
        return;
      }

      currentHighlightedElement = element;
      const overlay = createHighlightOverlay();
      
      // Actualizar posición inicial
      updateHighlightPosition();
      
      // Actualizar al hacer scroll
      let scrollTimeout;
      const scrollHandler = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateHighlightPosition, 10);
      };
      
      // Remover listener anterior si existe
      if (window._visualEditScrollHandler) {
        window.removeEventListener('scroll', window._visualEditScrollHandler, true);
      }
      
      window._visualEditScrollHandler = scrollHandler;
      window.addEventListener('scroll', scrollHandler, true);
      
    } catch (error) {
      console.error('[VisualEdit Bridge] Error highlighting element:', error);
    }
  }

  function clearHighlight() {
    if (highlightOverlay) {
      highlightOverlay.style.display = 'none';
    }
    
    currentHighlightedElement = null;
    
    if (window._visualEditScrollHandler) {
      window.removeEventListener('scroll', window._visualEditScrollHandler, true);
      window._visualEditScrollHandler = null;
    }
  }

  // ==================== OBTENER INFO DEL ELEMENTO ====================
  
  function getElementInfo(element) {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    return {
      selector: generateSelector(element),
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      textContent: element.textContent?.trim().substring(0, 100),
      computedStyles: {
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
        fontWeight: computedStyle.fontWeight,
        padding: computedStyle.padding,
        margin: computedStyle.margin,
        display: computedStyle.display,
        position: computedStyle.position,
      },
      boundingRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }
    };
  }

  // ==================== DETECCIÓN DE ELEMENTOS ====================
  
  function handleDetectElement(data) {
    const { x, y, action } = data;
    console.log('[VisualEdit Bridge] Detecting element at', x, y, 'action:', action);

    // CRÍTICO: Ocultar el overlay antes de hacer elementFromPoint
    if (highlightOverlay) {
      highlightOverlay.style.display = 'none';
    }

    // Detectar elemento en las coordenadas
    let element = document.elementFromPoint(x, y);
    
    // Buscar el mejor elemento (más específico)
    element = findBestElement(element, x, y);
    
    // Restaurar el overlay si es hover
    if (highlightOverlay && action === 'hover' && element) {
      highlightOverlay.style.display = 'block';
    }

    if (!element || element === document.documentElement || element === document.body) {
      console.log('[VisualEdit Bridge] No valid element detected');
      window.parent.postMessage({
        type: 'NO_ELEMENT_DETECTED',
        action: action
      }, '*');
      return;
    }

    const selector = generateSelector(element);
    if (!selector) {
      console.log('[VisualEdit Bridge] Could not generate selector for element');
      window.parent.postMessage({
        type: 'NO_ELEMENT_DETECTED',
        action: action
      }, '*');
      return;
    }

    console.log('[VisualEdit Bridge] Generated selector:', selector);

    if (action === 'hover') {
      currentHighlightedElement = element;
      updateHighlightPosition();
      
      window.parent.postMessage({
        type: 'ELEMENT_HOVERED',
        selector: selector
      }, '*');
    } else if (action === 'click') {
      window.parent.postMessage({
        type: 'ELEMENT_CLICKED',
        selector: selector
      }, '*');
    }
  }

  // ==================== MESSAGE LISTENER ====================
  
  window.addEventListener('message', function(event) {
    if (!event.data || !event.data.type) return;

    switch (event.data.type) {
      case 'VISUAL_EDIT_MODE_ACTIVATE':
        activateVisualEditMode();
        break;

      case 'VISUAL_EDIT_MODE_DEACTIVATE':
        deactivateVisualEditMode();
        clearHighlight();
        break;

      case 'VISUAL_EDIT_DETECT_ELEMENT':
        handleDetectElement(event.data);
        break;

      case 'VISUAL_EDIT_HIGHLIGHT':
        if (event.data.selector) {
          highlightElement(event.data.selector);
        }
        break;

      case 'VISUAL_EDIT_CLEAR_HIGHLIGHT':
        clearHighlight();
        break;

      case 'VISUAL_EDIT_REQUEST_INFO':
        if (event.data.selector) {
          try {
            const element = document.querySelector(event.data.selector);
            const info = getElementInfo(element);
            window.parent.postMessage({
              type: 'ELEMENT_INFO',
              info: info
            }, '*');
          } catch (error) {
            console.error('[VisualEdit Bridge] Error getting element info:', error);
            window.parent.postMessage({
              type: 'ELEMENT_INFO',
              info: null,
              error: error.message
            }, '*');
          }
        }
        break;
    }
  });

})();
