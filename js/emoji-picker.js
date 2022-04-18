/*
 * emoji-picker.js v0.1.1
 * Projet : Composant
 * Copyright 2022 Thierry Bouedo
 */


/**
 * Composant de type 'dropdown' est un composant de sélection de caractère emoji.
 * Cet 'emojiPicker' est associé à un élément de type 'inputText'.
 * Ce composant fait partie du 'Contrôleur' de l'application.
 * 
 * Il est présenté de manière isolée dans l'hypothèse d'une éventuelle 
 * réutilisation (projet à mûrir : il faudrait notamment avoir la possibilité de créer 
 * plusieurs instances)
 * 
 * Attention ! Pour le moment ce pseudo-composant singleton est unique pour l'application !
 */

const emojiPicker = {
  visible: false,

  /**
   * Initialise l'emojiPicker.
   * @param {Element} inputElement élément (inputText)de destination du caractère sélectionné
   * @param {String[]} emojis un tableau des caractères emojis proposés
   * 
   * @return 
   */

  init: function (inputElement, emojis) {
    // capturer l'élément 'inputText' associé et certains de ses attributs
    this.inputElement = inputElement;
    this.maxLength = (this.inputElement.hasAttribute("maxlength")? 
      this.inputElement.getAttribute("maxlength"): 14);          
    
    // créer du conteneur du composant
    this.emojiPickerContainer = document.createElement('div');
    this.emojiPickerContainer.classList.add('emoji-picker-dropdown');
    // insérer le conteneur du composant dans le DOM
    insertAfter (this.emojiPickerContainer, this.inputElement);

    // ajouter un 'toggle' button
    this.emojiPickerButton = document.createElement('p');
    this.emojiPickerButton.classList.add('button');
    this.emojiPickerButton.innerHTML = '&#x25BE;';
    this.emojiPickerButton.addEventListener('click', function (event) {
      emojiPicker.toggle();
    }, false);
    this.emojiPickerContainer.appendChild(this.emojiPickerButton);

    // ajouter le contenu : la palette des emojis
    this.emojiPickerContent = document.createElement('ul');
    this.emojiPickerContent.classList.add('content', 'hidden');
    this.emojiPickerContainer.appendChild(this.emojiPickerContent);

    // ajouter les items de la palette
    emojis.forEach(emoji => addEmoji(emoji, this.emojiPickerContent));  

    // fonction de création/insertion d'un item de la palette
    function addEmoji (emoji, parent) {
      let emojiNode = document.createElement('li');
      let emojiTextNode = document.createTextNode(emoji);
      emojiNode.appendChild(emojiTextNode);
      emojiNode.onclick = function(event) {
        emojiPicker.insertAtCaret(event.target.innerHTML);
        emojiPicker.inputElement.checkValidity();
      }
      parent.appendChild(emojiNode);
    };

    // fonction d'insertion dans le DOM
    function insertAfter(newNode, existingNode) {
      existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    };
  },

  /**
   * Cache le contenu du 'dropdown'
   * @return 
   */

  hide: function() {
    this.emojiPickerContent.classList.remove('visible');
    this.emojiPickerContent.classList.add('hidden');
  },

  /**
   * Basculement du 'dropdown' quand l'utilisateur clique sur le bouton +/-
   * @return 
   */

  toggle: function() {
    if (!this.visible) {
      if (typeof this.inputElement !== 'undefined')
        this.inputElement.focus();
      this.emojiPickerContent.classList.remove('hidden');
      this.emojiPickerContent.classList.add('visible');
      this.emojiPickerButton.innerHTML = "&#x25B4";
      this.visible = true;
    }
    else {
      this.emojiPickerContent.classList.remove('visible');
      this.emojiPickerContent.classList.add('hidden');
      this.emojiPickerButton.innerHTML = "&#x25BE";
      this.visible = false;
    }
  },

  /**
   * Insérer un caractère emoji, à la position du curseur, dans la zone cible 
   * associée au dropdown (c'est à dire dans l'inputText)
   * Insertion avec contrôle du maximum de caractères saisis
   * @param {String} emoji emoji sélectionné à insérer
   * @return 
   */

  insertAtCaret: function(emoji) {
    if (typeof this.inputElement === 'undefined') return;
    if (!(Array.from(this.inputElement.value).length < this.maxLength)) return;
    
    let caretPos = this.inputElement.selectionStart;
    const front = (this.inputElement.value).substring(0, caretPos);
    const back = (this.inputElement.value).substring(
      this.inputElement.selectionEnd, 
      this.inputElement.value.length);
    this.inputElement.value = front + emoji + back;
    caretPos = caretPos + emoji.length;
    this.inputElement.selectionStart = caretPos;
    this.inputElement.selectionEnd = caretPos;
    this.inputElement.focus();
  }
}



